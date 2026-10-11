/* Optional browser-only dubbing. No Gemini key, payments, external library or video download.
   Recognize shared tab audio -> Chrome's on-device en/he Translator -> locked Hebrew voice.
   Recognition may run on the browser provider's servers. Browser feature support varies.
   Intentionally separate from dub.js: the existing Google Live route stays untouched. */
(function () {
  'use strict';
  const $=id=>document.getElementById(id);
  const startButton=$('freeStart'), stopButton=$('freeStop'), status=$('freeStatus');
  const original=$('freeOriginal'), translated=$('freeHebrew');
  const progress=$('freeProgress'), voiceInfo=$('freeVoiceInfo'), elapsed=$('freeElapsed');
  const speech=window.speechSynthesis;
  const Recognizer=window.SpeechRecognition||window.webkitSpeechRecognition;
  const packOptions={sourceLanguage:'en',targetLanguage:'he'};
  let state='idle', run=0, stream=null, translator=null, audioContext=null, input=null, worklet=null, background=null;
  let recognition=null, recognitionTimer=null, clock=null, begunAt=0, recentRestartTimes=[];
  let recognitionStartedAt=0,lastRecognizedAt=0,endedForSilence=false,lastPhrase='',lastPhraseAt=0;
  let lockedVoice=null,speechItems=[],speaking=false,speechTimer=null,speechToken=0,voiceStalls=0;
  let translationChain=Promise.resolve(),pending=0,pendingTranslator=null,sourceConnected=false;
  let compatibility=false;

  function report(message,kind='neutral') {
    status.textContent=message;
    status.dataset.kind=kind;
  }
  function chooseVoice() {
    if(!speech || !speech.getVoices)return null;
    const voices=speech.getVoices().filter(v=>/^he(?:[-_]|$)/i.test(v.lang));
    return voices.find(v=>v.localService&&/^he[-_]IL$/i.test(v.lang))||
      voices.find(v=>v.localService)||voices.find(v=>/^he[-_]IL$/i.test(v.lang))||voices[0]||null;
  }
  function controls() {
    startButton.disabled=state!=='idle'||!compatibility;
    stopButton.disabled=state==='idle';
    $('freeClean').disabled=state==='idle';
    $('freePreview').disabled=state!=='idle'||!chooseVoice();
  }
  function setAmbience() {
    const pct=Number($('freeVolume').value)||0;
    $('freeVolumeText').textContent=pct+'%';
    $('freeVolume').disabled=!$('freeAmbience').checked;
    if(input&&worklet){
      if($('freeAmbience').checked&&!sourceConnected){input.connect(worklet);sourceConnected=true}
      else if(!$('freeAmbience').checked&&sourceConnected){input.disconnect(worklet);sourceConnected=false}
    }
    if(background&&audioContext) {
      const to=$('freeAmbience').checked?pct/100:0;
      if(background.gain.setTargetAtTime)
        background.gain.setTargetAtTime(to,audioContext.currentTime,0.035);
      else background.gain.value=to;
    }
  }
  function releaseTracks(s) {
    if(!s||!s.getTracks)return;
    for(const t of s.getTracks())try{t.stop()}catch(_){}
  }
  function cleanup(message,kind) {
    ++run; ++speechToken; state='idle';
    clearTimeout(recognitionTimer); recognitionTimer=null;
    clearTimeout(speechTimer); speechTimer=null;
    clearInterval(clock); clock=null;
    const oldRecognition=recognition; recognition=null;
    if(oldRecognition){
      oldRecognition.onresult=null;oldRecognition.onerror=null;oldRecognition.onend=null;
      try{oldRecognition.abort()}catch(_){}
    }
    speechItems=[];speaking=false;
    if(speech)try{speech.cancel()}catch(_){}
    releaseTracks(stream);stream=null;
    if(input)try{input.disconnect()}catch(_){} input=null;sourceConnected=false;
    if(worklet){worklet.port.onmessage=null;try{worklet.disconnect()}catch(_){}worklet=null}
    if(background)try{background.disconnect()}catch(_){}background=null;
    if(audioContext){const c=audioContext;audioContext=null;c.close().catch(()=>{})}
    if(translator){try{translator.destroy()}catch(_){}translator=null}
    if(pendingTranslator){try{pendingTranslator.destroy()}catch(_){}pendingTranslator=null}
    lockedVoice=null;pending=0;translationChain=Promise.resolve();recentRestartTimes=[];
    recognitionStartedAt=0;lastRecognizedAt=0;endedForSilence=false;lastPhrase='';lastPhraseAt=0;voiceStalls=0;
    controls();
    if(message)report(message,kind||'neutral');
  }
  function nextSpeech(thisRun) {
    if(speaking||!speechItems.length||state!=='running'||run!==thisRun||!lockedVoice)return;
    const text=speechItems.shift();
    const token=++speechToken;
    const isCurrent=()=>state==='running'&&run===thisRun&&speechToken===token;
    const utter=new SpeechSynthesisUtterance(text);
    utter.lang='he-IL';utter.voice=lockedVoice;utter.rate=1.12;utter.pitch=1;
    speaking=true;
    let started=false,finished=false;
    const finish=()=>{
      if(finished||!isCurrent())return;
      finished=true;clearTimeout(speechTimer);speechTimer=null;
      speaking=false;voiceStalls=0;nextSpeech(thisRun);
    };
    utter.onstart=()=>{
      if(!isCurrent())return;
      started=true;clearTimeout(speechTimer);
      // A Chromium voice may start normally but never fire onend.
      // Use a generous duration watchdog instead of changing the voice.
      speechTimer=setTimeout(()=>{
        if(!isCurrent()||finished)return;
        voiceStalls++;++speechToken;
        clearTimeout(speechTimer);speechTimer=null;speaking=false;
        try{speech.cancel()}catch(_){}
        if(voiceStalls>=2){
          cleanup('הדפדפן תקע את הקריינות פעמיים. עצרתי בלי להחליף לקול אחר.','bad');
          return;
        }
        progress.textContent='הקריינות נתקעה פעם אחת, שחררתי אותה וממשיך באותו קול.';
        nextSpeech(thisRun);
      },Math.min(42000,Math.max(9000,text.length*210+5000)));
    };
    utter.onend=finish;
    utter.onerror=()=>{
      if(isCurrent())cleanup('קריינת העברית נכשלה. לא החלפתי קול באופן אוטומטי.','bad');
    };
    speechTimer=setTimeout(()=>{
      if(isCurrent()&&!started)
        cleanup('הקול העברי לא התחיל תוך 9 שניות. לא אחליף קול בלי אישורך.','bad');
    },9000);
    try{speech.speak(utter)}catch(_){
      if(isCurrent())cleanup('הדפדפן דחה את הקריינות העברית.','bad');
    }
  }
  function splitSpeech(text) {
    let remaining=String(text||'').trim().replace(/\s+/g,' ');
    const pieces=[];
    while(remaining.length>180){
      let cut=remaining.lastIndexOf(' ',180);
      if(cut<75)cut=180;
      const sentence=Math.max(remaining.lastIndexOf('.',cut),remaining.lastIndexOf('!',cut),remaining.lastIndexOf('?',cut));
      if(sentence>=75)cut=sentence+1;
      pieces.push(remaining.slice(0,cut).trim());
      remaining=remaining.slice(cut).trim();
    }
    if(remaining)pieces.push(remaining);
    return pieces;
  }
  function queueSpeech(text,thisRun) {
    if(!text||run!==thisRun||state!=='running')return;
    speechItems.push(...splitSpeech(text));
    // Avoid an unbounded translated-voice backlog on fast videos.
    while(speechItems.length>4||speechItems.reduce((n,item)=>n+item.length,0)>520)
      speechItems.shift();
    nextSpeech(thisRun);
  }
  function onSpeechResults(event,thisRun) {
    if(run!==thisRun||state!=='running'||!translator)return;
    for(let i=event.resultIndex||0;i<event.results.length;i++){
      const result=event.results[i];
      if(!result||!result.isFinal)continue;
      const english=String(result[0]?.transcript||'').trim();
      if(!english)continue;
      const now=Date.now();
      if(english===lastPhrase&&now-lastPhraseAt<1200)continue;
      lastPhrase=english;lastPhraseAt=now;lastRecognizedAt=now;
      endedForSilence=false;recentRestartTimes=[];
      original.textContent=(original.textContent==='ממתין לאנגלית…'?'':original.textContent+' ')+english;
      original.textContent=original.textContent.slice(-1200);
      if(pending>=6){
        progress.textContent='התרגום מאחר: דילגתי על משפט כדי למנוע פער הולך וגדל.';
        continue;
      }
      pending++;
      translationChain=translationChain.then(async()=>{
        if(run!==thisRun||state!=='running'||!translator)return;
        const hebrew=String(await translator.translate(english)).trim();
        if(run!==thisRun||state!=='running'||!hebrew)return;
        translated.textContent=(translated.textContent==='התרגום יופיע כאן…'?'':translated.textContent+' ')+hebrew;
        translated.textContent=translated.textContent.slice(-1200);
        queueSpeech(hebrew,thisRun);
      }).catch(()=>{
        if(run===thisRun&&state==='running')
          progress.textContent='אחד המשפטים לא תורגם; ממשיך לדיבור הבא.';
      }).finally(()=>{if(run===thisRun)pending=Math.max(0,pending-1)});
    }
  }
  function resumeRecognition(thisRun,audioTrack) {
    if(run!==thisRun||state!=='running'||!recognition)return;
    if(audioTrack?.kind!=='audio'||audioTrack.readyState!=='live'){
      cleanup('רצועת השמע ששיתפת כבר אינה פעילה. יש לשתף שוב את לשונית הסרטון.','bad');
      return;
    }
    const now=Date.now();
    const quiet=endedForSilence||
      now-Math.max(lastRecognizedAt,recognitionStartedAt)>8000;
    const unusuallyShort=now-recognitionStartedAt<3500;
    endedForSilence=false;
    // Silence should NOT exhaust the reconnect budget during long quiet scenes.
    // However, a service that instantly fails repeatedly must still stop.
    if(!quiet||unusuallyShort){
      recentRestartTimes=recentRestartTimes.filter(t=>now-t<60000);
      recentRestartTimes.push(now);
      const limit=quiet?8:4;
      if(recentRestartTimes.length>=limit){
        cleanup('זיהוי הדיבור נסגר שוב ושוב במהירות. עצרתי כדי למנוע לולאה.','bad');
        return;
      }
    }else recentRestartTimes=[];
    if(quiet)progress.textContent='שקט בסרטון — ממתין לדיבור הבא, בלי להחליף קול.';
    recognitionTimer=setTimeout(()=>{
      recognitionTimer=null;
      if(run!==thisRun||state!=='running'||!recognition)return;
      if(audioTrack.readyState!=='live'){
        cleanup('השמע ששיתפת הסתיים, והזיהוי הופסק.','bad');return;
      }
      try{
        recognitionStartedAt=Date.now();
        recognition.start(audioTrack);
      }catch(_){cleanup('הדפדפן לא הצליח לחדש זיהוי דיבור מאותה לשונית.','bad')}
    },quiet?2400:1200);
  }
  async function connectAmbience(thisRun) {
    const c=audioContext=new window.AudioContext({latencyHint:'playback'});
    await c.audioWorklet.addModule('/dub-free-ambience-worklet.js?v=2026-10-11.2');
    if(run!==thisRun||state!=='starting')return;
    input=c.createMediaStreamSource(stream);
    worklet=new window.AudioWorkletNode(c,'hebrew-dub-ambience',{outputChannelCount:[2]});
    background=c.createGain();
    background.gain.value=0;
    // Connect the captured audio only while soundtrack is enabled.
    sourceConnected=false;worklet.connect(background);background.connect(c.destination);
    worklet.port.onmessage=event=>{
      if(run!==thisRun||state==='idle')return;
      if(event.data?.type==='soundLevels'){
        const d=event.data;
        $('freeSound').textContent='צליל המקור '+(d.channels===1?'מונו':'סטריאו')+
          ' · הרקע המעובד שומר חלק מהמוזיקה והאפקטים, אך ייתכן גם קול אנגלי חלש.';
      }
      // This worklet does not generate PCM buffers at all.
    };
    setAmbience();
    await c.resume();
  }
  async function begin() {
    if(state!=='idle'||!compatibility)return;
    // Both calls MUST start synchronously inside the button's user gesture:
    // Translator's first pack download and the tab picker require activation.
    const thisRun=++run;
    state='starting';controls();
    original.textContent='ממתין לאנגלית…';translated.textContent='התרגום יופיע כאן…';
    progress.textContent='מכין תרגום מקומי ועובר לבחירת לשונית…';
    let modelPromise, capturePromise;
    try {
      modelPromise=window.Translator.create({
        ...packOptions,
        monitor(m){
          m.addEventListener('downloadprogress',e=>{
            if(run===thisRun&&state==='starting')
              progress.textContent='מוריד חבילת תרגום חד־פעמית: '+Math.round((e.loaded||0)*100)+'%';
          });
        }
      }).then(t=>{
        if(run!==thisRun){try{t.destroy()}catch(_){}return null}
        pendingTranslator=t;
        return t;
      });
      // The tab picker may remain open after a download failure.
      // Attach a rejection handler immediately to avoid an unhandled promise.
      modelPromise.catch(()=>{});
      capturePromise=navigator.mediaDevices.getDisplayMedia({
        video:{displaySurface:'browser',frameRate:1},
        audio:{suppressLocalAudioPlayback:true},
        selfBrowserSurface:'exclude',preferCurrentTab:false,
        systemAudio:'exclude',monitorTypeSurfaces:'exclude',surfaceSwitching:'include'
      });
    }catch(_){
      cleanup('לא הצלחתי להתחיל הורדת שפה או שיתוף לשונית.','bad');return;
    }
    try {
      const s=await capturePromise;
      if(run!==thisRun||state!=='starting'){releaseTracks(s);return}
      stream=s;
      const audio=stream.getAudioTracks()[0];
      if(!audio){cleanup('לא שותף שמע מהלשונית. צריך לסמן Share tab audio.','bad');return}
      for(const t of stream.getTracks())t.addEventListener('ended',()=>{
        if(run===thisRun&&state!=='idle')cleanup('שיתוף הלשונית הסתיים.');
      });
      report('לשונית נבחרה. מכין את התרגום והקול העברי…');
      const t=await modelPromise;
      if(run!==thisRun||state!=='starting')return;
      if(!t){cleanup('תרגום העברית לא הוכן.','bad');return}
      translator=t;pendingTranslator=null;
      await connectAmbience(thisRun);
      if(run!==thisRun||state!=='starting')return;
      lockedVoice=chooseVoice();
      if(!lockedVoice){cleanup('לא נמצא קול עברי בדפדפן. לא אפעיל קול בשפה לא נכונה.','bad');return}
      recognition=new Recognizer();
      recognition.lang='en-US';recognition.continuous=true;recognition.interimResults=false;recognition.maxAlternatives=1;
      recognition.onresult=e=>onSpeechResults(e,thisRun);
      recognition.onerror=e=>{
        if(run!==thisRun||state==='idle')return;
        const code=String(e?.error||'');
        if(code==='no-speech'){
          endedForSilence=true;
          progress.textContent='אין כרגע דיבור בסרטון; ממשיך להמתין לקריינות באנגלית.';
          return;
        }
        if(['not-allowed','service-not-allowed','audio-capture','language-not-supported'].includes(code))
          cleanup('זיהוי השמע נחסם על ידי הדפדפן ('+code+'). לא ננסה שוב אוטומטית.','bad');
        else if(code==='network')
          cleanup('שירות זיהוי הדיבור של הדפדפן אינו זמין כרגע. לא ננסה שוב ושוב.','bad');
        else cleanup('תקלה בזיהוי הדיבור ('+(code||'unknown')+'). עצרתי במקום לנסות שוב ושוב.','bad');
      };
      recognition.onend=()=>resumeRecognition(thisRun,audio);
      // Never call .start() without the selected audioTrack: that would
      // switch to microphone capture on browsers that support the overload.
      recognitionStartedAt=Date.now();
      recognition.start(audio);
      state='running';begunAt=Date.now();
      voiceInfo.textContent='קול נעול לכל ההפעלה: '+lockedVoice.name;
      report('דיבוב חינמי פעיל. הפעל סרטון באנגלית בלשונית שבחרת.','good');
      progress.textContent='התרגום פועל בדפדפן; אין מפתח Gemini או טיימר של 15 דקות.';
      clock=setInterval(()=>{
        if(run!==thisRun)return;
        const sec=Math.floor((Date.now()-begunAt)/1000);
        elapsed.textContent='פעיל '+Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')+' דקות · ללא הגבלת דקות שהוגדרה באתר';
      },1000);
      controls();
    }catch(e) {
      if(run!==thisRun)return;
      if(e?.name==='NotAllowedError')
        cleanup('השיתוף לא אושר או שהדפדפן חסם הורדת חבילת תרגום.','bad');
      else
        cleanup('המסלול המקומי אינו זמין כאן: '+String(e?.message||e).slice(0,130),'bad');
    }
  }
  async function checkCompatibility() {
    if(state!=='idle')return;
    compatibility=false;controls();
    if(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent||'')){
      report('המסלול החדש מיועד ל־Chrome במחשב, לא לטלפון. מסלול AutoDub עדיין זמין.','bad');return;
    }
    if(!window.Translator||!Recognizer||!speech||!navigator.mediaDevices?.getDisplayMedia||
       !window.AudioWorkletNode||!window.AudioContext){
      report('חסר בדפדפן תרגום מובנה או זיהוי שמע. נדרש Chrome עדכני במחשב; Google Live ו־AutoDub לא שונו.','bad');return;
    }
    const voice=chooseVoice();
    voiceInfo.textContent=voice?'קול עברי זמין: '+voice.name:
      'לא זוהה קול עברי. ייתכן שצריך להתקין קול עברי במערכת.';
    if(!voice){report('חסר קול עברי בדפדפן. אי אפשר להבטיח קריינות בעברית.','bad');return}
    try {
      const availability=await window.Translator.availability(packOptions);
      if(state!=='idle')return;
      if(availability==='unavailable'){
        report('הדפדפן אינו מאפשר כעת תרגום אנגלית→עברית במכשיר הזה.','bad');return;
      }
      compatibility=['available','downloadable','downloading'].includes(availability);
      progress.textContent=availability==='available'?'חבילת התרגום מוכנה.':
        'בשימוש ראשון תורד חבילת תרגום; ייתכן שיידרש שטח פנוי.';
      report(compatibility?'מוכן להפעלה בלחיצה אחת; בלי מפתח API.':
        'לא הצלחתי לבדוק תמיכה בשפות.','neutral');
    }catch(_){report('בדיקת התרגום המובנה נכשלה. המסלול הישן נשאר זמין.','bad')}
    controls();
  }
  $('freeStart').addEventListener('click',begin);
  $('freeStop').addEventListener('click',()=>cleanup('הדיבוב הופסק.'));
  $('freePreview').addEventListener('click',()=>{
    if(state!=='idle')return;
    const v=chooseVoice();if(!v)return;
    try{
      speech.cancel();
      const u=new SpeechSynthesisUtterance('שלום, זהו הקול העברי הקבוע.');
      u.lang='he-IL';u.voice=v;speech.speak(u);
    }catch(_){report('בדיקת קול נכשלה.','bad')}
  });
  $('freeClean').addEventListener('click',()=>{
    $('freeAmbience').checked=false;setAmbience();
    progress.textContent='השמע המעובד הושתק: קריינות עברית בלבד, בלי צלילי רקע.';
  });
  $('freeAmbience').addEventListener('change',setAmbience);
  $('freeVolume').addEventListener('input',setAmbience);
  if(speech?.addEventListener)speech.addEventListener('voiceschanged',()=>{
    if(state==='idle')checkCompatibility();
  });
  window.addEventListener('pagehide',()=>cleanup(''));
  setAmbience();checkCompatibility();
})();