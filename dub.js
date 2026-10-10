'use strict';
/* Client-only tab-audio-to-Hebrew pilot: no website backend, persistence, or analytics. */
(()=>{
  const $=id=>document.getElementById(id);
  const startButton=$('start'),stopButton=$('stop'),keyInput=$('apiKey');
  const status=$('status'),countdown=$('countdown');
  const orig=$('original'),translated=$('translated');
  const MODEL='gemini-3.5-live-translate-preview';
  const LIMIT_MS=10*60*1000;
  let state='idle', capture=null, socket=null, captureContext=null, playbackContext=null;
  let captureNode=null, silentGain=null, inputNode=null;
  let playbackTime=0, activeSources=new Set(), deadline=0, timer=null, setupReady=false, heardAudio=false;

  function setStatus(message,kind='neutral'){
    status.textContent=message;status.dataset.kind=kind;
  }
  function switchControls(running){
    startButton.disabled=running;stopButton.disabled=!running;
    keyInput.disabled=running;$('suppress').disabled=running;
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
  async function playTranslated(b64){
    if(!b64||state==='idle'||!playbackContext)return;
    const data=pcmFromBase64(b64);
    if(!data.length)return;
    if(playbackContext.state!=='running')await playbackContext.resume();
    if(state==='idle')return;
    const buffer=playbackContext.createBuffer(1,data.length,24000);
    buffer.getChannelData(0).set(data);
    const source=playbackContext.createBufferSource();
    source.buffer=buffer;source.connect(playbackContext.destination);
    const now=playbackContext.currentTime;
    if(playbackTime<now)playbackTime=now+0.045;
    // Avoid an ever-growing backlog when the translation falls behind.
    if(playbackTime-now>8){
      for(const s of activeSources){try{s.stop()}catch(_){}}
      activeSources.clear();playbackTime=now+0.045;
      setStatus('הדיבוב מתעכב. איפסתי את תור השמע כדי לחזור לזמן אמת.','neutral');
    }
    const at=playbackTime;
    playbackTime+=data.length/24000;
    activeSources.add(source);
    source.onended=()=>activeSources.delete(source);
    source.start(at);
    if(!heardAudio){heardAudio=true;setStatus('הדיבוב העברי מתנגן. אפשר להמשיך בסרטונים באתר.','good')}
  }
  function stop(reason='הדיבוב נעצר.'){
    if(state==='idle')return;
    state='idle';setupReady=false;
    clearInterval(timer);timer=null;countdown.textContent='';
    if(socket){
      const ws=socket;socket=null;
      try{if(ws.readyState===WebSocket.OPEN){ws.send(JSON.stringify({realtimeInput:{audioStreamEnd:true}}))}}catch(_){}
      try{ws.close(1000,'stopped')}catch(_){}
    }
    if(captureNode){captureNode.port.onmessage=null;try{captureNode.disconnect()}catch(_){}captureNode=null}
    if(inputNode){try{inputNode.disconnect()}catch(_){}inputNode=null}
    if(silentGain){try{silentGain.disconnect()}catch(_){}silentGain=null}
    if(capture){for(const t of capture.getTracks()){try{t.stop()}catch(_){}}capture=null}
    for(const s of activeSources){try{s.stop()}catch(_){}}activeSources.clear();playbackTime=0;
    if(captureContext){const a=captureContext;captureContext=null;a.close().catch(()=>{})}
    if(playbackContext){const a=playbackContext;playbackContext=null;a.close().catch(()=>{})}
    switchControls(false);setStatus(reason,reason.startsWith('שגיאה')?'bad':'neutral');
  }
  function onMessage(raw){
    if(state==='idle')return;
    let msg;
    try{msg=JSON.parse(raw)}catch(_){return}
    if(msg.error){stop('שגיאה ממנוע Google: '+String(msg.error.message||msg.error.code||'לא ידועה').slice(0,210));return}
    if(msg.setupComplete){setupReady=true;setStatus('החיבור פעיל. הפעל סרטון בלשונית ששיתפת.','good');return}
    const c=msg.serverContent;
    if(!c)return;
    if(c.inputTranscription?.text)appendTranscript(orig,c.inputTranscription.text);
    if(c.outputTranscription?.text)appendTranscript(translated,c.outputTranscription.text);
    for(const part of c.modelTurn?.parts||[]){
      if(part.inlineData?.data)playTranslated(part.inlineData.data).catch(()=>stop('שגיאה בהשמעת הקריינות העברית.'));
    }
  }
  async function startCaptureProcessing(){
    captureContext=new AudioContext({latencyHint:'interactive'});
    await captureContext.audioWorklet.addModule('/dub-worklet.js');
    inputNode=captureContext.createMediaStreamSource(capture);
    captureNode=new AudioWorkletNode(captureContext,'hebrew-dub-capture');
    silentGain=captureContext.createGain();silentGain.gain.value=0;
    inputNode.connect(captureNode);captureNode.connect(silentGain);silentGain.connect(captureContext.destination);
    captureNode.port.onmessage=e=>{
      if(state!=='running'||!setupReady||!socket||socket.readyState!==WebSocket.OPEN)return;
      // Network back-pressure: skip data rather than freeze the browser.
      if(socket.bufferedAmount>300000)return;
      const packet=new Uint8Array(e.data);
      socket.send(JSON.stringify({realtimeInput:{audio:{data:toB64(packet),mimeType:'audio/pcm;rate=16000'}}}));
    };
    await captureContext.resume();
  }
  async function begin(){
    if(state!=='idle')return;
    let apiKey=keyInput.value.trim();
    if(!/^[-\w]{20,}$/.test(apiKey)){setStatus('שגיאה: יש להכניס מפתח Gemini API תקין.','bad');return}
    if(!navigator.mediaDevices?.getDisplayMedia||!window.AudioWorkletNode||!window.AudioContext){
      setStatus('שגיאה: הדפדפן אינו תומך בלכידת שמע מהלשונית. נסה Chrome/Edge במחשב.','bad');return;
    }
    state='starting';setupReady=false;heardAudio=false;switchControls(true);
    orig.dataset.hasTranscript='0';translated.dataset.hasTranscript='0';
    orig.textContent='מחכה לדיבור בשפת המקור…';translated.textContent='מחכה לתרגום לעברית…';
    setStatus('בחר את לשונית הסרטונים והפעל שיתוף שמע (Share tab audio).');
    try{
      // Must be triggered directly by a user click. No video is sent to Google.
      capture=await navigator.mediaDevices.getDisplayMedia({
        video:{displaySurface:'browser',frameRate:1},
        audio:{suppressLocalAudioPlayback:$('suppress').checked},
        selfBrowserSurface:'exclude',preferCurrentTab:false,
        systemAudio:'exclude',monitorTypeSurfaces:'exclude',surfaceSwitching:'include'
      });
      const audio=capture.getAudioTracks()[0];
      if(!audio){stop('שגיאה: הלשונית נבחרה בלי שמע. יש להפעיל מחדש ולסמן Share tab audio.');return}
      for(const track of capture.getTracks())track.addEventListener('ended',()=>{
        if(state!=='idle')stop('שיתוף הלשונית הסתיים. להפעלה חוזרת יש ללחוץ על הפעל דיבוב.');
      });
      playbackContext=new AudioContext({latencyHint:'interactive'});
      await playbackContext.resume();
      await startCaptureProcessing();
      if(state==='idle')return;
      setStatus('השיתוף פעיל. מתחבר למנוע התרגום של Google…');
      const url='wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key='+encodeURIComponent(apiKey);
      socket=new WebSocket(url);
      apiKey='';keyInput.value='';
      const thisSocket=socket;
      thisSocket.onopen=()=>{
        if(state==='idle'||socket!==thisSocket)return;
        state='running';
        thisSocket.send(JSON.stringify({setup:{model:'models/'+MODEL,generationConfig:{
          responseModalities:['AUDIO'],inputAudioTranscription:{},outputAudioTranscription:{},
          translationConfig:{targetLanguageCode:'he',echoTargetLanguage:false}
        }}}));
        deadline=Date.now()+LIMIT_MS;
        countdown.textContent='נותרו 10:00 דקות לניסוי';
        timer=setInterval(()=>{
          const s=Math.max(0,Math.ceil((deadline-Date.now())/1000));
          countdown.textContent='נותרו '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+' דקות';
          if(!s)stop('הניסוי הסתיים לאחר 10 דקות. לא נמשיך לצרוך API בלי הפעלה מחדש.');
        },1000);
        setStatus('החיבור נפתח. מחכה לאישור תחילת תרגום…');
      };
      thisSocket.onmessage=event=>onMessage(event.data);
      thisSocket.onerror=()=>{
        if(state!=='idle')stop('שגיאה בחיבור Google. בדוק מפתח, מכסה וזמינות המודל.');
      };
      thisSocket.onclose=event=>{
        if(state!=='idle')stop('החיבור למנוע התרגום נסגר (קוד '+event.code+'). בדוק הרשאות או מכסת שימוש.');
      };
    }catch(e){
      if(state==='idle')return;
      let error='שגיאה בהפעלת הדיבוב.';
      if(e?.name==='NotAllowedError')error='שגיאה: שיתוף הלשונית לא אושר.';
      else if(e?.name==='NotSupportedError')error='שגיאה: הדפדפן לא תומך בהקלטת שמע מהלשונית.';
      else if(e?.message)error+=' '+String(e.message).slice(0,190);
      stop(error);
    }
  }
  startButton.addEventListener('click',begin);
  stopButton.addEventListener('click',()=>stop('הדיבוב הופסק לבקשתך.'));
  window.addEventListener('pagehide',()=>stop('הדיבוב הסתיים.'));
})();
