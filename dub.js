'use strict';
/* Client-only tab-audio-to-Hebrew pilot: no website backend, persistence, or analytics. */
(()=>{
  const $=id=>document.getElementById(id);
  const startButton=$('start'),stopButton=$('stop'),checkButton=$('checkKey'),keyInput=$('apiKey');
  const status=$('status'),countdown=$('countdown');
  const orig=$('original'),translated=$('translated');
  const MODEL='gemini-3.5-live-translate-preview';
  const DUB_BUILD='2026-10-11.2';
  const LIMIT_MS=10*60*1000;
  let state='idle', capture=null, socket=null, captureContext=null, playbackContext=null;
  let captureNode=null, backgroundGain=null, inputNode=null;
  let playbackTime=0, activeSources=new Set(), deadline=0, timer=null, setupReady=false, heardAudio=false;
  let connectionTimer=null, setupTimer=null, runId=0;
  let verifiedKey=''; // RAM only: cleared when this tab closes or reloads.
  // Live Translate has no supported persistent speaker lock. Optional browser
  // speech synthesis can use one installed, locally provided Hebrew voice.
  const tts=window.speechSynthesis||null;
  let localHebrewVoice=null,ttsText='',ttsTimer=null;
  const usingSystemVoice=()=>Boolean(tts&&localHebrewVoice&&$('voiceMode').value==='system');
  function refreshHebrewVoice(){
    if(!tts)return;
    try{
      const voices=tts.getVoices().filter(v=>/^he(?:[-_]|$)/i.test(v.lang)&&v.localService);
      localHebrewVoice=voices.find(v=>/^he[-_]IL$/i.test(v.lang))||voices[0]||null;
    }catch(_){localHebrewVoice=null}
    $('systemVoiceOption').disabled=!localHebrewVoice;
    if(!localHebrewVoice&&$('voiceMode').value==='system')$('voiceMode').value='google';
    $('voiceHint').textContent=localHebrewVoice
      ? 'נמצא קול עברי מקומי: '+localHebrewVoice.name+'. הוא קבוע, אבל האיכות והקצב תלויים במחשב.'
      : 'לא נמצא קול עברי מקומי מותקן. הקריינות הרגילה של Google זמינה כרגיל.';
  }
  function speakHebrewChunk(thisRun){
    clearTimeout(ttsTimer);ttsTimer=null;
    if(!ttsText||!usingSystemVoice()||state==='idle'||runId!==thisRun)return;
    const phrase=ttsText.trim();ttsText='';
    if(!phrase)return;
    const utter=new SpeechSynthesisUtterance(phrase);
    utter.lang='he-IL';utter.voice=localHebrewVoice;utter.rate=1.07;
    try{tts.speak(utter)}catch(_){
      // Never lose the normal Google path if the local browser TTS fails.
      $('voiceMode').value='google';
      setStatus('הקול המקומי לא זמין. חזרתי לקריינות של Google.','neutral');
    }
  }
  function queueHebrewVoice(text,thisRun){
    if(!usingSystemVoice()||state==='idle'||runId!==thisRun)return;
    const part=String(text||'').trim();if(!part)return;
    ttsText+=(ttsText?' ':'')+part;
    // Avoid per-token stutter; latency is higher than Google native audio.
    if(ttsText.length>=70||/[.!?׃]$/.test(part))speakHebrewChunk(thisRun);
    else{clearTimeout(ttsTimer);ttsTimer=setTimeout(()=>speakHebrewChunk(thisRun),700)}
  }
  const WS_ENDPOINT='wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';
  const MODEL_ENDPOINT='https://generativelanguage.googleapis.com/v1beta/models/'+MODEL;

  function setStatus(message,kind='neutral'){
    status.textContent=message;status.dataset.kind=kind;
  }
  function switchControls(running){
    startButton.disabled=running;stopButton.disabled=!running;
    keyInput.disabled=running;checkButton.disabled=running;$('suppress').disabled=running;
    $('voiceMode').disabled=running;
  }
  // A cheap, optional stereo side-channel mix. It cancels truly centered
  // speech; unlike AI source separation, mono and centered effects cannot survive.
  function updateAmbience(){
    const enabled=$('ambience').checked;
    const slider=$('ambienceVolume');
    const volume=Math.max(0,Math.min(100,Number(slider.value)||0));
    slider.disabled=!enabled;
    $('ambienceVolumeLabel').textContent=volume+'%';
    if(backgroundGain){
      const target=enabled?volume/100:0;
      if(typeof backgroundGain.gain.setTargetAtTime==='function')
        backgroundGain.gain.setTargetAtTime(target,captureContext.currentTime,0.025);
      else backgroundGain.gain.value=target;
    }
  }
  function readKey(){
    const key=(keyInput.value || verifiedKey).trim();
    // New Gemini Auth keys use AQ. (dot) and older keys may use AIza.
    // Never reject a key on an assumed provider-specific prefix.
    if(key.length<16 || /\s/.test(key) || /[<>\"'`]/.test(key)){
      setStatus('המפתח לא נראה שלם. צריך להעתיק מפתח Gemini Auth מ-Google AI Studio (בדרך כלל מתחיל AQ.). לא לשלוח אותו בצ׳אט.','bad');
      return null;
    }
    return key;
  }
  function setupPayload(){
    // WebSocket's BidiGenerateContentSetup schema differs from the example
    // in Google's Live Translate guide. A transcript field nested inside
    // generationConfig makes the server close with 1007 (invalid JSON).
    return {setup:{
      model:'models/'+MODEL,
      generationConfig:{
        responseModalities:['AUDIO'],
        translationConfig:{targetLanguageCode:'he',echoTargetLanguage:false}
      },
      inputAudioTranscription:{},
      outputAudioTranscription:{}
    }};
  }
  // Gemini WebSocket replies may be UTF-8 JSON text frames, Blob frames or
  // ArrayBuffer binary frames. Never JSON.parse a Blob directly: it silently
  // discards setupComplete and makes an accepted session appear to time out.
  async function parseLiveFrame(frame){
    let text=frame;
    try{
      if(typeof text==='string'){}
      else if(typeof Blob!=='undefined' && text instanceof Blob)text=await text.text();
      else if(text instanceof ArrayBuffer)text=new TextDecoder().decode(text);
      else if(ArrayBuffer.isView(text))text=new TextDecoder().decode(text);
      else return null;
      const message=JSON.parse(text);
      return message && typeof message==='object'?message:null;
    }catch(_){return null;}
  }
  function explainHttp(status,body){
    const code=body?.error?.status||'';
    if(status===400) return 'Google דחתה בקשה (400). זה אינו מוכיח שהמפתח שגוי; נבדוק את חיבור Live עצמו.';
    if(status===401) return 'Google לא אישרה את המפתח (401). השתמש במפתח Auth חדש מתוך AI Studio, ולא במפתח Standard ישן.';
    if(status===402) return 'Google דורשת יתרת Prepay בחשבון בתשלום (402). זה לא אומר שהמפתח שגוי; בדוק Billing ב-AI Studio. אין להפעיל טעינה אוטומטית לפני שבודקים עלות.';
    if(status===403) return 'אין הרשאה למודל או ל-Gemini API בפרויקט (403). בדוק סוג מפתח והגבלות הפרויקט ב-AI Studio.';
    if(status===404) return 'נקודת בדיקת המודל החזירה 404. זה לא בהכרח אומר שחיבור Live חסום.';
    if(status===429) return 'מכסת השימוש של Google נוצלה (429). זה לא אומר שהמפתח פגום.';
    if(status>=500) return 'שירות Google אינו זמין זמנית ('+status+'). המפתח לא בהכרח פגום.';
    return 'Google החזירה שגיאה '+status+(code?' ('+code+')':'')+'. אין לשלם לפני שמבררים אותה.';
  }
  function explainLiveFailure(code,reason){
    const detail=String(reason||'').slice(0,140);
    if(/resource.exhausted|quota|rate.limit|429/i.test(detail))return 'מכסת Gemini נוצלה (429). המפתח לא בהכרח שגוי.';
    if(/402|prepay|billing|payment|insufficient.funds/i.test(detail))return 'נדרשת יתרת תשלום בחשבון Google (402). אל תפעיל חיוב לפני שבודקים מחיר.';
    if(/401|api.key.invalid|unauthenticated|invalid.api.key/i.test(detail))return 'Google לא מאשרת את מפתח ה-API (401). כדאי ליצור מפתח Auth חדש ב-AI Studio.';
    if(/403|permission.denied|forbidden/i.test(detail))return 'למפתח אין הרשאה למודל (403). בדוק הרשאות או סוג פרויקט.';
    if(/404|model.*not.found/i.test(detail))return 'המודל אינו נגיש בחשבון הזה (404).';
    if(/invalid.json.payload|unknown.name|cannot.find.field/i.test(detail))return 'Google דחתה את מבנה בקשת החיבור (1007). זו בעיית קוד ולא בעיה במפתח או בתשלום. '+detail;
    return 'חיבור Live נסגר (קוד '+code+'). '+(detail||'ייתכן חיבור רשת, הרשאת Google או מגבלת API.');
  }
  async function diagnoseLiveFailure(key,original){
    // REST is only a secondary diagnostic. A model metadata lookup can fail
    // even when the Live WebSocket is usable, so never let it veto Live setup.
    try{
      const response=await fetch(MODEL_ENDPOINT,{method:'GET',headers:{'x-goog-api-key':key},cache:'no-store',signal:AbortSignal.timeout(5000)});
      if([401,402,403,429].includes(response.status)){
        let body={};try{body=await response.json()}catch(_){}
        return explainHttp(response.status,body);
      }
      if(response.ok) return original+' בדיקת REST של Google הצליחה, אבל החיבור החי לא אושר.';
    }catch(_){}
    return original;
  }
  async function testKeyWithGoogle(key){
    // Test actual translation session FIRST, not a different REST operation.
    // This avoids the former false-negative when GET /models rejects a
    // Live-only model or the metadata endpoint is blocked by the browser.
    const live=await new Promise(resolve=>{
      let done=false,ws,opened=false,frames=0,decoded=0;
      const finish=(ok,message)=>{
        if(done)return;done=true;clearTimeout(timeout);
        if(ws){ws.onopen=null;ws.onmessage=null;ws.onerror=null;ws.onclose=null;
          try{if(ws.readyState<=1)ws.close()}catch(_){}}
        resolve({ok,message});
      };
      // Diagnose the actual stage rather than treating a missed binary frame
      // as a network failure. Twenty seconds is a safety cap, not a retry loop.
      const timeout=setTimeout(()=>{
        let reason;
        if(!opened)reason='חיבור WebSocket ל-Google לא נפתח. ייתכן סינון רשת/דפדפן או עומס.';
        else if(frames===0)reason='WebSocket נפתח והגדרות נשלחו, אך Google לא החזירה תשובה.';
        else if(decoded===0)reason='Google החזירה '+frames+' הודעות, אבל כולן לא פוענחו. זו תקלת תאימות בקוד, לא במפתח.';
        else reason='Google החזירה '+decoded+' הודעות קריאות, אך לא אישרה setupComplete.';
        finish(false,'החיבור לא אושר בתוך 20 שניות. '+reason);
      },20000);
      try{
        ws=new WebSocket(WS_ENDPOINT+'?key='+encodeURIComponent(key));
        ws.binaryType='arraybuffer';
        ws.onopen=()=>{opened=true;ws.send(JSON.stringify(setupPayload()));};
        ws.onmessage=async e=>{
          frames++;
          const data=await parseLiveFrame(e.data);
          if(done)return;
          if(!data)return;
          decoded++;
          if(data.setupComplete)finish(true,'המפתח וחיבור התרגום לעברית אושרו. הצעד הבא הוא בדיקת הקול בסרטון קצר.');
          else if(data.error)finish(false,explainLiveFailure(data.error.code||'API',data.error.message||data.error.status));
        };
        ws.onerror=()=>{}; // onclose typically has the real reason.
        ws.onclose=e=>finish(false,explainLiveFailure(e.code,e.reason));
      }catch(_){finish(false,'הדפדפן לא הצליח לפתוח חיבור Live. בדוק Chrome/Edge או רשת.');}
    });
    if(live.ok)return {ok:true,message:live.message,uncertain:false};
    const message=await diagnoseLiveFailure(key,live.message);
    return {ok:false,message,uncertain:!/(401|402|403|429|שגוי|מכסת|הרשאה|יתרת תשלום)/i.test(message)};
  }

  async function checkKey(){
    if(state!=='idle')return;
    const key=readKey();if(!key)return;
    checkButton.disabled=true;startButton.disabled=true;
    setStatus('בודק את המפתח ואת חיבור Live מול Google — בלי לשלוח שום שמע…');
    try{
      const result=await testKeyWithGoogle(key);
      if(result.ok){verifiedKey=key;keyInput.value='';}
      setStatus(result.message,result.ok?'good':result.uncertain?'neutral':'bad');
    }catch(_){setStatus('לא הצלחתי לבדוק את המפתח. אפשר לנסות שוב.','bad')}
    finally{if(state==='idle'){checkButton.disabled=false;startButton.disabled=false;}}
  }
  function appendTranscript(node,message){
    if(!message)return;
    const prev=node.dataset.hasTranscript==='1'?node.textContent:'';
    node.textContent=(prev+' '+message).trim().slice(-1500);
    node.dataset.hasTranscript='1';node.scrollTop=node.scrollHeight;
  }
  function toB64(bytes){
    let bin='';
    for(let i=0;i<bytes.length;i+=8192){
      bin+=String.fromCharCode(...bytes.subarray(i,i+8192));
    }
    return btoa(bin);
  }
  function pcmFromBase64(b64){
    const bin=atob(b64),samples=Math.floor(bin.length/2),f=new Float32Array(samples);
    for(let i=0;i<samples;i++){
      const word=bin.charCodeAt(i*2)|(bin.charCodeAt(i*2+1)<<8);
      f[i]=(word&0x8000?word-65536:word)/32768;
    }
    return f;
  }
  async function playTranslated(b64,mimeType,thisRun){
    if(!b64||state==='idle'||runId!==thisRun||!playbackContext)return;
    const outputContext=playbackContext;
    const rateMatch=String(mimeType||'').match(/(?:^|;)\s*rate=(\d+)/i);
    const specifiedRate=rateMatch?Number(rateMatch[1]):24000;
    const rate=[16000,24000,32000,44100,48000].includes(specifiedRate)?specifiedRate:24000;
    const data=pcmFromBase64(b64);
    if(!data.length)return;
    if(outputContext.state!=='running')await outputContext.resume();
    if(state==='idle'||runId!==thisRun||playbackContext!==outputContext)return;
    const buffer=outputContext.createBuffer(1,data.length,rate);
    buffer.getChannelData(0).set(data);
    const source=outputContext.createBufferSource();
    source.buffer=buffer;source.connect(outputContext.destination);
    const now=outputContext.currentTime;
    if(playbackTime<now)playbackTime=now+0.025;
    // Avoid an ever-growing backlog when the translation falls behind.
    if(playbackTime-now>8){
      for(const s of activeSources){try{s.stop()}catch(_){}}
      activeSources.clear();playbackTime=now+0.045;
      setStatus('הדיבוב מתעכב. איפסתי את תור השמע כדי לחזור לזמן אמת.','neutral');
    }
    // Gently drain a growing client-side queue; this cannot eliminate
    // model/network latency. Avoid high rates that audibly change Hebrew pitch.
    const queued=Math.max(0,playbackTime-now);
    const speed=queued>1.25?1.08:queued>0.45?1.04:1;
    source.playbackRate.value=speed;
    const at=playbackTime;
    playbackTime+=data.length/rate/speed;
    activeSources.add(source);
    source.onended=()=>activeSources.delete(source);
    source.start(at);
    if(!heardAudio){heardAudio=true;setStatus('הדיבוב העברי מתנגן. אפשר להמשיך בסרטונים באתר.','good')}
  }
  function stop(reason='הדיבוב נעצר.'){
    if(state==='idle')return;
    ++runId; // Invalidates promises and late WebSocket events from the old run.
    state='idle';setupReady=false;
    clearInterval(timer);timer=null;clearTimeout(connectionTimer);connectionTimer=null;clearTimeout(setupTimer);setupTimer=null;countdown.textContent='';
    if(socket){
      const ws=socket;socket=null;
      try{if(ws.readyState===WebSocket.OPEN){ws.send(JSON.stringify({realtimeInput:{audioStreamEnd:true}}))}}catch(_){}
      try{ws.close(1000,'stopped')}catch(_){}
    }
    if(captureNode){captureNode.port.onmessage=null;try{captureNode.disconnect()}catch(_){}captureNode=null}
    if(inputNode){try{inputNode.disconnect()}catch(_){}inputNode=null}
    if(backgroundGain){try{backgroundGain.disconnect()}catch(_){}backgroundGain=null}
    clearTimeout(ttsTimer);ttsTimer=null;ttsText='';
    if(tts){try{tts.cancel()}catch(_){}}
    if(capture){for(const t of capture.getTracks()){try{t.stop()}catch(_){}}capture=null}
    for(const s of activeSources){try{s.stop()}catch(_){}}activeSources.clear();playbackTime=0;
    // Capture and playback share one context to reduce CPU and audio clocks.
    const contexts=new Set([captureContext,playbackContext]);
    captureContext=null;playbackContext=null;
    for(const a of contexts){if(a)a.close().catch(()=>{})}
    switchControls(false);setStatus(reason,reason.startsWith('שגיאה')?'bad':'neutral');
  }
  async function onMessage(raw,originSocket,thisRun,diagnostics){
    if(state==='idle'||runId!==thisRun||socket!==originSocket)return;
    const msg=await parseLiveFrame(raw);
    if(state==='idle'||runId!==thisRun||socket!==originSocket)return;
    if(msg)diagnostics.decoded++;
    if(!msg){
      if(!setupReady)stop('שגיאה: Google החזירה הודעה בפורמט לא צפוי. לא משמע שהמפתח שגוי.');
      return;
    }
    if(msg.error){stop('שגיאה ממנוע Google: '+explainLiveFailure(msg.error.code||'API',msg.error.message||msg.error.status));return}
    if(msg.setupComplete){clearTimeout(setupTimer);setupTimer=null;setupReady=true;verifiedKey=keyInput.value.trim()||verifiedKey;keyInput.value='';setStatus('החיבור פעיל. הפעל סרטון בלשונית ששיתפת.','good');return}
    const c=msg.serverContent;
    if(!c)return;
    if(c.inputTranscription?.text)appendTranscript(orig,c.inputTranscription.text);
    if(c.outputTranscription?.text){
      appendTranscript(translated,c.outputTranscription.text);
      if(usingSystemVoice())queueHebrewVoice(c.outputTranscription.text,thisRun);
    }
    for(const part of c.modelTurn?.parts||[]){
      if(part.inlineData?.data&&!usingSystemVoice())playTranslated(part.inlineData.data,part.inlineData.mimeType,thisRun).catch(()=>{
        if(state!=='idle'&&runId===thisRun&&socket===originSocket)stop('שגיאה בהשמעת הקריינות העברית.');
      });
    }
  }
  async function startCaptureProcessing(thisRun){
    const context=captureContext=playbackContext;
    await context.audioWorklet.addModule('/dub-worklet.js?v='+DUB_BUILD);
    if(state!=='starting'||runId!==thisRun||captureContext!==context)return;
    inputNode=context.createMediaStreamSource(capture);
    captureNode=new AudioWorkletNode(context,'hebrew-dub-capture',{outputChannelCount:[2]});
    backgroundGain=context.createGain();backgroundGain.gain.value=0;
    inputNode.connect(captureNode);
    captureNode.connect(backgroundGain);
    backgroundGain.connect(context.destination);
    updateAmbience();
    captureNode.port.onmessage=e=>{
      if(e.data?.type==='soundLevels'){
        const d=e.data;
        // Show what was actually captured; mono previously produced no soundtrack.
        const source=Number(d.channels)===1?'מונו':'סטריאו';
        const relative=d.sourceRms>0?Math.round(100*d.backgroundRms/d.sourceRms):0;
        $('soundReport').textContent='שמע מקור: '+source+' · רקע משוחזר: '+relative+'% מעוצמת המקור (לפני הכיוון)';
        return;
      }
      if(state!=='running'||!setupReady||!socket||socket.readyState!==WebSocket.OPEN)return;
      if(!(e.data instanceof ArrayBuffer))return;
      if(socket.bufferedAmount>300000)return;
      const packet=new Uint8Array(e.data);
      socket.send(JSON.stringify({realtimeInput:{audio:{data:toB64(packet),mimeType:'audio/pcm;rate=16000'}}}));
    };
    await context.resume();
  }
  async function begin(){
    if(state!=='idle')return;
    let apiKey=readKey();
    if(!apiKey)return;
    if(!navigator.mediaDevices?.getDisplayMedia||!window.AudioWorkletNode||!window.AudioContext){
      setStatus('שגיאה: הדפדפן אינו תומך בלכידת שמע מהלשונית. נסה Chrome/Edge במחשב.','bad');return;
    }
    const thisRun=++runId;
    state='starting';setupReady=false;heardAudio=false;switchControls(true);
    orig.dataset.hasTranscript='0';translated.dataset.hasTranscript='0';
    orig.textContent='מחכה לדיבור בשפת המקור…';translated.textContent='מחכה לתרגום לעברית…';
    setStatus('בחר את לשונית הסרטונים והפעל שיתוף שמע (Share tab audio).');
    try{
      // Must be triggered directly by a user click. No video is sent to Google.
      const stream=await navigator.mediaDevices.getDisplayMedia({
        video:{displaySurface:'browser',frameRate:1},
        audio:{suppressLocalAudioPlayback:$('suppress').checked},
        selfBrowserSurface:'exclude',preferCurrentTab:false,
        systemAudio:'exclude',monitorTypeSurfaces:'exclude',surfaceSwitching:'include'
      });
      // The user may press Stop while the browser's share picker is open.
      // A late permission grant must not leak a live capture into a new run.
      if(state!=='starting'||runId!==thisRun){
        for(const track of stream.getTracks()){try{track.stop()}catch(_){}}
        return;
      }
      capture=stream;
      $('soundReport').textContent='ממתין לנתוני שמע מהסרטון…';
      const audio=capture.getAudioTracks()[0];
      if(!audio){stop('שגיאה: הלשונית נבחרה בלי שמע. יש להפעיל מחדש ולסמן Share tab audio.');return}
      for(const track of capture.getTracks())track.addEventListener('ended',()=>{
        if(state!=='idle'&&runId===thisRun)stop('שיתוף הלשונית הסתיים. להפעלה חוזרת יש ללחוץ על הפעל דיבוב.');
      });
      const outputContext=playbackContext=new AudioContext({latencyHint:'interactive'});
      await outputContext.resume();
      if(state!=='starting'||runId!==thisRun)return;
      await startCaptureProcessing(thisRun);
      if(state!=='starting'||runId!==thisRun)return;
      setStatus('השיתוף פעיל. מתחבר למנוע התרגום של Google…');
      const url=WS_ENDPOINT+'?key='+encodeURIComponent(apiKey);
      socket=new WebSocket(url);
      // Keep the entered key until Google confirms setup; avoid repeat typing on failure.
      const thisSocket=socket;
      const diagnostics={frames:0,decoded:0};
      let messageQueue=Promise.resolve(); // Preserve server frame order, including async Blob.text().
      thisSocket.binaryType='arraybuffer';
      connectionTimer=setTimeout(()=>{
        if(state!=='idle'&&runId===thisRun&&socket===thisSocket&&thisSocket.readyState!==WebSocket.OPEN)
          stop('שגיאה: החיבור אל Google לא נפתח בתוך 20 שניות. בדוק את החיבור לרשת.');
      },20000);
      thisSocket.onopen=()=>{
        if(state==='idle'||runId!==thisRun||socket!==thisSocket)return;
        clearTimeout(connectionTimer);connectionTimer=null;
        state='running';
        thisSocket.send(JSON.stringify(setupPayload()));
        setupTimer=setTimeout(()=>{
          if(state==='idle'||runId!==thisRun||socket!==thisSocket||setupReady)return;
          const reason=diagnostics.frames===0
            ? 'WebSocket נפתח, אך Google לא החזירה הודעות.'
            : diagnostics.decoded===0
              ? 'Google החזירה הודעות בינאריות שלא פוענחו.'
              : 'הודעות Google פוענחו, אך לא התקבל setupComplete.';
          stop('שגיאה: החיבור לא אושר בתוך 25 שניות. '+reason);
        },25000);
        deadline=Date.now()+LIMIT_MS;
        countdown.textContent='נותרו 10:00 דקות לניסוי';
        timer=setInterval(()=>{
          const s=Math.max(0,Math.ceil((deadline-Date.now())/1000));
          countdown.textContent='נותרו '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+' דקות';
          const queue=playbackContext&&heardAudio?Math.max(0,playbackTime-playbackContext.currentTime):0;
          $('latencyInfo').textContent=heardAudio
            ? 'תור שמע מקומי: '+queue.toFixed(2)+' שניות. זמן העיבוד של Google נוסף לכך.'
            : 'מחכה לקריינות. השהיית Google אינה בשליטת הנגן.';
          if(!s)stop('הניסוי הסתיים לאחר 10 דקות. לא נמשיך לצרוך API בלי הפעלה מחדש.');
        },1000);
        setStatus('החיבור נפתח. מחכה לאישור תחילת תרגום…');
      };
      thisSocket.onmessage=event=>{
        if(state==='idle'||runId!==thisRun||socket!==thisSocket)return;
        diagnostics.frames++;
        const payload=event.data;
        messageQueue=messageQueue.then(()=>onMessage(payload,thisSocket,thisRun,diagnostics)).catch(()=>{
          if(state!=='idle'&&runId===thisRun&&socket===thisSocket)stop('שגיאה: נכשל פענוח הודעת Google.');
        });
      };
      thisSocket.onerror=()=>{
        // onclose usually follows onerror and carries the real 1007/401 reason.
        // Do not stop here, or we would hide the actionable error message.
      };
      thisSocket.onclose=event=>{
        if(state!=='idle'&&runId===thisRun&&socket===thisSocket)
          stop('שגיאה: '+explainLiveFailure(event.code,event.reason));
      };
    }catch(e){
      if(state==='idle'||runId!==thisRun)return;
      let error='שגיאה בהפעלת הדיבוב.';
      if(e?.name==='NotAllowedError')error='שגיאה: שיתוף הלשונית לא אושר.';
      else if(e?.name==='NotSupportedError')error='שגיאה: הדפדפן לא תומך בהקלטת שמע מהלשונית.';
      else if(e?.message)error+=' '+String(e.message).slice(0,190);
      stop(error);
    }
  }
  checkButton.addEventListener('click',checkKey);
  startButton.addEventListener('click',begin);
  stopButton.addEventListener('click',()=>stop('הדיבוב הופסק לבקשתך.'));
  $('ambience').addEventListener('change',updateAmbience);
  $('ambienceVolume').addEventListener('input',updateAmbience);
  $('voiceMode').addEventListener('change',()=>{
    if($('voiceMode').value==='system'&&!localHebrewVoice)$('voiceMode').value='google';
  });
  refreshHebrewVoice();
  if(tts&&typeof tts.addEventListener==='function')tts.addEventListener('voiceschanged',refreshHebrewVoice);
  updateAmbience();
  window.addEventListener('pagehide',()=>stop('הדיבוב הסתיים.'));
})();
