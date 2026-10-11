'use strict';
// A no-network regression rig for the optional browser-only, no-key dubbing mode.
const assert=require('node:assert/strict');
const fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'dub-free.js'),'utf8');
const html=fs.readFileSync(path.join(root,'dub-free.html'),'utf8');
assert.match(html,/lang="he" dir="rtl"/);
for(const id of ['freeStart','freeStop','freePreview','freeOriginal','freeHebrew','freeVolume','freeAmbience','freeSound'])
  assert(html.includes('id="'+id+'"'),id+' control missing');
assert(!/gemini-3\.5|apiKey|googleapis\.com/i.test(js),'New route must not depend on Gemini key');
assert(html.includes('בלי שמע רקע'),'One-button clean Hebrew option required');
assert(html.includes('/dub-free.js?v=2026-10-11.2'),'Version-pinned file required');
const originalDub=fs.readFileSync(path.join(root,'dub.js'),'utf8');
assert.match(originalDub,/gemini-3\.5-live-translate-preview/,'Old dub must remain intact');
new vm.Script(js,{filename:'dub-free.js'});

const tick=async()=>{for(let i=0;i<35;i++)await Promise.resolve()};
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return{promise,resolve,reject}}
function createRig(options={}) {
  const ids=['freeStart','freeStop','freeStatus','freeOriginal','freeHebrew','freeProgress',
    'freeVoiceInfo','freeElapsed','freeClean','freePreview','freeAmbience','freeVolume',
    'freeVolumeText','freeSound'];
  const elements={};
  for(const id of ids)elements[id]={disabled:true,textContent:'',value:'',checked:false,dataset:{},events:{},
    addEventListener(type,fn){this.events[type]=fn}};
  elements.freeVolume.value='35';elements.freeAmbience.checked=true;
  elements.freeOriginal.textContent='ממתין לאנגלית…';elements.freeHebrew.textContent='התרגום יופיע כאן…';
  const voice={name:'Hebrew locked test',lang:'he-IL',localService:true,voiceURI:'he-test'};
  let canceled=0, modelsCreated=0, modelsDestroyed=0, captureCalls=0;
  let fakeNow=Date.now();
  const utterances=[],recognizers=[],contexts=[],worklets=[];
  const engine={getVoices:()=>options.voices??[voice],speak(u){utterances.push(u)},cancel(){canceled++},
    addEventListener(){}};
  class Utterance{constructor(text){this.text=text}}
  class Recognition {
    constructor(){this.started=[];recognizers.push(this)}
    start(track){this.started.push(track)}
    abort(){this.aborted=true}
  }
  const audioTrack={kind:'audio',readyState:'live',stopped:0,listeners:[],
    stop(){this.stopped++},addEventListener(event,cb){this.listeners.push(cb)}};
  const videoTrack={kind:'video',readyState:'live',stopped:0,
    stop(){this.stopped++},addEventListener(){}};
  const capturedStream={getAudioTracks:()=>options.noAudio?[]:[audioTrack],
    getTracks:()=>[audioTrack,videoTrack]};
  const timers=new Map();let timerId=0;
  const translatorObj={translate:async s=>'שלום, '+s,destroy(){modelsDestroyed++}};
  const Translator={
    availability:async()=>options.availability??'available',
    create(){modelsCreated++;return Promise.resolve(translatorObj)}
  };
  class AudioContext {
    constructor(){contexts.push(this);this.currentTime=0;this.destination={};
      this.audioWorklet={addModule:async p=>{assert.equal(p,'/dub-free-ambience-worklet.js?v=2026-10-11.2')}}}
    createMediaStreamSource(){return{connect(){},disconnect(){}}}
    createGain(){return{gain:{value:0,setTargetAtTime(v){this.value=v}},connect(){},disconnect(){}}}
    resume(){return Promise.resolve()}
    close(){this.closed=true;return Promise.resolve()}
  }
  class Worklet {
    constructor(ctx,name,opts){assert.equal(name,'hebrew-dub-ambience');this.port={onmessage:null};worklets.push(this)}
    connect(){}disconnect(){}
  }
  const window={Translator,AudioContext,AudioWorkletNode:Worklet,SpeechRecognition:Recognition,
    speechSynthesis:engine,addEventListener(){}};
  const navigator={userAgent:options.userAgent||'Mozilla/5.0 Chrome/140.0.0.0',
    mediaDevices:{getDisplayMedia(){captureCalls++;
      return options.sharePromise||Promise.resolve(capturedStream)}}};
  const sandbox={window,navigator,document:{getElementById:id=>elements[id]},SpeechSynthesisUtterance:Utterance,
    clearTimeout:id=>timers.delete(id),setTimeout:(fn,delay)=>{const id=++timerId;timers.set(id,{fn,delay});return id},
    clearInterval(){},setInterval:()=>123,Date:{now:()=>fakeNow},console};
  vm.runInNewContext(js,sandbox,{filename:'dub-free.js',timeout:1000});
  return{elements,voice,utterances,recognizers,contexts,worklets,audioTrack,videoTrack,
    advance(ms){fakeNow+=ms},
    get captureCalls(){return captureCalls},get modelsCreated(){return modelsCreated},
    get modelsDestroyed(){return modelsDestroyed},get canceled(){return canceled},
    fireTimeouts(maxDelay=Infinity){
      for(const [id,t] of [...timers])if(t.delay<=maxDelay){timers.delete(id);t.fn()}
    }};
}

(async()=>{
  const r=createRig(); await tick();
  assert.equal(r.elements.freeStart.disabled,false,'Supported browser should allow one-click start');
  const startPromise=r.elements.freeStart.events.click();
  await startPromise;await tick();
  assert.equal(r.modelsCreated,1,'Free mode must create only one local translator');
  assert.equal(r.captureCalls,1,'Exactly one tab picker');
  assert.equal(r.recognizers.length,1,'Audio track recognizer should be started');
  assert.equal(r.recognizers[0].started[0],r.audioTrack,
    'Recognition must use captured tab track, never microphone');
  assert.equal(r.contexts.length,1,'Use one small AudioContext');
  assert.equal(r.elements.freeStop.disabled,false);
  assert.match(r.elements.freeStatus.textContent,/דיבוב חינמי פעיל/);
  const result=Object.assign([{transcript:'The universe is expanding'}],{isFinal:true});
  r.recognizers[0].onresult({resultIndex:0,results:[result]});
  await tick();
  assert.match(r.elements.freeOriginal.textContent,/universe/);
  assert.match(r.elements.freeHebrew.textContent,/שלום/);
  assert.equal(r.utterances.length,1,'Translated text must be spoken');
  assert.equal(r.utterances[0].voice,r.voice,'Voice must stay locked to one exact object');
  r.utterances[0].onstart?.();
  r.utterances[0].onend?.();
  r.recognizers[0].onend();
  r.fireTimeouts();
  assert.equal(r.recognizers[0].started.length,2,'Restart after silence must use same tab track');
  assert.equal(r.recognizers[0].started[1],r.audioTrack);
  r.elements.freeClean.events.click();
  assert.equal(r.elements.freeAmbience.checked,false,'One-button Hebrew-only must mute original');
  r.elements.freeStop.events.click();
  assert.equal(r.audioTrack.stopped,1,'Stop must release microphone-free audio track');
  assert.equal(r.videoTrack.stopped,1,'Stop must also release tab video track');
  assert.equal(r.modelsDestroyed,1,'Stop must destroy translator');
  assert(r.contexts[0].closed,'AudioContext must be released');
  assert(r.canceled>=1,'Speech must be canceled on stop');
  assert.equal(r.elements.freeStart.disabled,false,'Can start another session manually');

  // Stop pressed while sharing picker is pending must stop late capture.
  const picker=deferred(),r2=createRig({sharePromise:picker.promise});await tick();
  const running=r2.elements.freeStart.events.click();
  r2.elements.freeStop.events.click();
  picker.resolve({getAudioTracks:()=>[r2.audioTrack],getTracks:()=>[r2.audioTrack,r2.videoTrack]});
  await running;await tick();
  assert.equal(r2.audioTrack.stopped,1);
  assert.equal(r2.videoTrack.stopped,1);
  assert.equal(r2.recognizers.length,0,'Late tab picker must not enable capture');
  assert.equal(r2.modelsDestroyed,1,'Pending translator must be disposed after cancel');

  // Long genuine silence must not consume a tiny automatic-restart quota.
  const quiet=createRig();await tick();
  await quiet.elements.freeStart.events.click();
  const quietRecognizer=quiet.recognizers[0];
  for(let i=0;i<7;i++){
    quiet.advance(11000);
    quietRecognizer.onerror({error:'no-speech'});
    quietRecognizer.onend();
    assert.equal(quiet.elements.freeStop.disabled,false,'Silence must not stop the session');
    quiet.fireTimeouts(2500);
  }
  assert.equal(quietRecognizer.started.length,8,'Keep same tab track through long quiet scenes');
  assert(quietRecognizer.started.every(track=>track===quiet.audioTrack));
  quiet.elements.freeStop.events.click();

  // An actual rapid-close loop must terminate, even if there is no onerror.
  const broken=createRig();await tick();
  await broken.elements.freeStart.events.click();
  const brokenRecognizer=broken.recognizers[0];
  for(let i=0;i<4;i++){
    broken.advance(1000);
    if(broken.elements.freeStop.disabled)break;
    brokenRecognizer.onend();
    broken.fireTimeouts(1300);
  }
  assert.equal(broken.elements.freeStop.disabled,true,'A rapidly failing speech service must stop');

  // Chromium can forget to fire TTS onend after an utterance starts.
  // A watchdog must free the speech queue without switching Hebrew voices.
  const stuck=createRig();await tick();
  await stuck.elements.freeStart.events.click();
  const stuckR=stuck.recognizers[0];
  const longEnglish=('The universe expands and galaxies move away from one another. ').repeat(7);
  stuckR.onresult({resultIndex:0,results:[Object.assign([{transcript:longEnglish}],{isFinal:true})]});
  await tick();
  assert(stuck.utterances.length>=1);
  const older=stuck.utterances[0];
  older.onstart();
  stuck.fireTimeouts();
  assert(stuck.utterances.length>=2,'A stalled voice should advance to the next pending phrase');
  assert.equal(stuck.utterances[1].voice,stuck.voice,'Recovery must use exact same voice');
  older.onerror();
  assert.equal(stuck.elements.freeStop.disabled,false,'Late cancel error must not stop new voice');
  stuck.elements.freeStop.events.click();

  const unsupported=createRig({availability:'unavailable'});await tick();
  assert.equal(unsupported.elements.freeStart.disabled,true,'Unsupported language pair must fail fast');
  assert.equal(unsupported.modelsCreated,0);
  const noVoice=createRig({voices:[]});await tick();
  assert.equal(noVoice.elements.freeStart.disabled,true,'Must not synthesize Hebrew with non-Hebrew voice');
  const mobile=createRig({userAgent:'Android Chrome/140.0'});await tick();
  assert.equal(mobile.elements.freeStart.disabled,true,'Mobile Chrome has no built-in Translator API');

  console.log('PASS: free browser dub: model gate, zero-mic capture, silence, TTS watchdog, pending model cleanup, stop and fail-fast');
})().catch(e=>{console.error(e);process.exitCode=1});