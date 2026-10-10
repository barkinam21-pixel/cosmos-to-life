'use strict';
// Offline browser simulation: no network, no Google account and no real microphone.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','dub.js'),'utf8');
function deferred(){
  let resolve,reject;
  const promise=new Promise((a,b)=>{resolve=a;reject=b});
  return {promise,resolve,reject};
}
async function flush(){for(let i=0;i<24;i++)await Promise.resolve()}
function setupRig(getDisplayMedia){
  const elements={};
  for(const id of ['start','stop','checkKey','apiKey','status','countdown','original','translated','suppress','ambience','ambienceVolume','ambienceVolumeLabel','soundReport','latencyInfo','voiceMode','systemVoiceOption','voiceHint']){
    elements[id]={value:'',textContent:'',dataset:{},disabled:false,checked:true,events:{},
      addEventListener(type,fn){this.events[type]=fn},scrollTop:0,scrollHeight:0};
  }
  elements.apiKey.value='AQ.'+'x'.repeat(32);
  elements.ambience.checked=true;
  elements.ambienceVolume.value='75';
  elements.voiceMode.value='google';
  elements.systemVoiceOption.disabled=true;
  elements.stop.disabled=true;
  const streams=[],sockets=[],buffers=[],audioStarts=[],contexts=[],gains=[],worklets=[],spoken=[],compressors=[];
  let ttsCanceled=0;
  const localTts={
    getVoices:()=>[{name:'Local Hebrew Test',lang:'he-IL',localService:true}],
    speak:utter=>spoken.push(utter),
    cancel:()=>{ttsCanceled++},
    addEventListener(){}
  };
  class SpeechSynthesisUtterance{constructor(text){this.text=text}}
  class MockWebSocket{
    static OPEN=1;
    constructor(url){this.url=url;this.readyState=0;this.sent=[];sockets.push(this)}
    send(raw){this.sent.push(JSON.parse(raw))}
    open(){this.readyState=1;this.onopen?.()}
    message(raw){this.onmessage?.({data:raw})}
    close(code=1000,reason='stopped'){this.readyState=3;this.onclose?.({code,reason})}
  }
  class MockAudioContext{
    constructor(){this.state='running';this.destination={};this.currentTime=0;this.closed=false;contexts.push(this);
      this.audioWorklet={addModule:async p=>assert.equal(p,'/dub-worklet.js?v=2026-10-11.3')};}
    createMediaStreamSource(stream){return {connect(){},disconnect(){}}}
    createGain(){
      const node={gain:{value:1,setTargetAtTime(value){this.value=value}},connect(){},disconnect(){}};
      gains.push(node);return node;
    }
    createDynamicsCompressor(){
      const p=()=>({value:0});
      const node={threshold:p(),knee:p(),ratio:p(),attack:p(),release:p(),connect(){},disconnect(){}};
      compressors.push(node);return node;
    }
    createBuffer(channels,length,rate){buffers.push({channels,length,rate});return {getChannelData:()=>new Float32Array(length)}}
    createBufferSource(){return {connect(){},playbackRate:{value:1},start(at){audioStarts.push({at,rate:this.playbackRate.value})},stop(){},onended:null,buffer:null}}
    resume(){this.state='running';return Promise.resolve()}
    close(){this.closed=true;return Promise.resolve()}
  }
  class MockAudioWorkletNode{
    constructor(context,name,options){
      assert.equal(name,'hebrew-dub-capture');
      assert.deepEqual(Array.from(options.outputChannelCount),[2]);
      this.port={onmessage:null};worklets.push(this);
    }
    connect(){} disconnect(){}
  }
  const sandbox={document:{getElementById:id=>elements[id]},
    navigator:{mediaDevices:{getDisplayMedia}},
    window:{AudioWorkletNode:MockAudioWorkletNode,AudioContext:MockAudioContext,speechSynthesis:localTts,addEventListener(){}},
    SpeechSynthesisUtterance,
    AudioContext:MockAudioContext,AudioWorkletNode:MockAudioWorkletNode,
    WebSocket:MockWebSocket,Blob,ArrayBuffer,TextDecoder,Uint8Array,Float32Array,
    btoa:raw=>Buffer.from(raw,'binary').toString('base64'),
    atob:raw=>Buffer.from(raw,'base64').toString('binary'),
    setTimeout:()=>123,clearTimeout:()=>{},setInterval:()=>234,clearInterval:()=>{},
    Date,console};
  vm.runInNewContext(source,sandbox,{filename:'dub.js',timeout:2000});
  return {elements,sockets,buffers,audioStarts,contexts,streams,gains,worklets,spoken,compressors,get ttsCanceled(){return ttsCanceled}};
}
function stream(){
  const tracks=[{stopped:0,listeners:[],stop(){this.stopped++},addEventListener(type,fn){this.listeners.push({type,fn})}},
                {stopped:0,listeners:[],stop(){this.stopped++},addEventListener(type,fn){this.listeners.push({type,fn})}}];
  return {tracks,getTracks:()=>tracks,getAudioTracks:()=>[tracks[0]]};
}
(async()=>{
  // Regression: Stop pressed while permission picker is pending must release a late grant.
  const permission=deferred();
  const r1=setupRig(()=>permission.promise), late=stream();
  const pending=r1.elements.start.events.click();
  r1.elements.stop.events.click();
  permission.resolve(late);
  await pending;await flush();
  assert(late.tracks.every(t=>t.stopped===1),'Late capture must be stopped');
  assert.equal(r1.sockets.length,0,'Canceled picker must not open WebSocket');
  assert.equal(r1.elements.stop.disabled,true,'UI must return to idle');

  // Regression: late picker failure must not stop a newer session.
  const old=deferred(), r2=setupRig(()=>old.promise);
  const oldBegin=r2.elements.start.events.click();
  r2.elements.stop.events.click();
  const fresh=stream();
  const newer=setupRig(async()=>fresh);
  await newer.elements.start.events.click();
  assert.equal(newer.sockets.length,1);
  assert.equal(newer.contexts.length,1,'Capture and dub audio should reuse one AudioContext');
  assert.equal(newer.gains.length,1,'Background audio must be controlled by a gain node');
  assert.equal(newer.gains[0].gain.value,0.75,'Default soundtrack must be audible');
  assert.equal(newer.compressors.length,1,'Stereo and Hebrew speech must share a native output compressor');
  assert.equal(newer.compressors[0].threshold.value,-9);
  assert.equal(newer.compressors[0].ratio.value,2.2);
  assert.equal(newer.elements.systemVoiceOption.disabled,false,'Installed Hebrew voice should be offered');
  newer.worklets[0].port.onmessage({data:{type:'soundLevels',channels:1,sourceRms:0.1,backgroundRms:0.08}});
  assert.match(newer.elements.soundReport.textContent,/מונו/);
  newer.elements.ambience.checked=false;
  newer.elements.ambience.events.change();
  assert.equal(newer.gains[0].gain.value,0,'Disable background without stopping dubbing');
  newer.elements.ambience.checked=true;
  newer.elements.ambienceVolume.value='25';
  newer.elements.ambienceVolume.events.input();
  assert.equal(newer.gains[0].gain.value,0.25,'Adjust background without reconnecting');

  // Active path: translation setup, Blob confirmation, binary transcripts and PCM audio.
  const ws=newer.sockets[0];
  assert.match(ws.url,/generativelanguage\.googleapis\.com/);
  assert.equal(ws.binaryType,'arraybuffer');
  ws.open();
  assert.equal(ws.sent[0].setup.generationConfig.translationConfig.targetLanguageCode,'he');
  assert.equal(ws.sent[0].setup.generationConfig.inputAudioTranscription,undefined);
  assert(ws.sent[0].setup.inputAudioTranscription);
  ws.message(new Blob([JSON.stringify({setupComplete:{}})]));
  await flush();
  assert.match(newer.elements.status.textContent,/החיבור פעיל/);
  assert.equal(newer.elements.apiKey.value,'','Key input must clear after setup');
  const pcm=Buffer.from([0,0,255,127]).toString('base64');
  const msg={serverContent:{inputTranscription:{text:'Hello'},outputTranscription:{text:'שלום'},
    modelTurn:{parts:[{inlineData:{data:pcm,mimeType:'audio/pcm;rate=24000'}}]}}};
  ws.message(new TextEncoder().encode(JSON.stringify(msg)).buffer);
  await flush();
  assert.match(newer.elements.original.textContent,/Hello/);
  assert.match(newer.elements.translated.textContent,/שלום/);
  assert.equal(newer.buffers[0].rate,24000,'Audio output sample rate must match MIME');
  assert.equal(newer.buffers[0].length,2);
  assert.equal(newer.audioStarts.length,1,'PCM must actually schedule playback');
  assert.equal(newer.elements.status.dataset.kind,'good');

  newer.elements.stop.events.click();
  assert(fresh.tracks.every(t=>t.stopped===1),'Stop must release audio and video capture');
  assert(newer.contexts.every(c=>c.closed),'Stop must release the shared AudioContext');
  assert.equal(newer.elements.stop.disabled,true);
  ws.onclose?.({code:1006,reason:'late close'});
  assert.equal(newer.elements.stop.disabled,true);
  old.reject(new Error('old picker canceled'));
  await oldBegin;await flush();
  assert.equal(r2.sockets.length,0);
  // Optional Hebrew fixed voice uses one local speaker; native audio is not mixed twice.
  const fixed=setupRig(async()=>stream());
  fixed.elements.voiceMode.value='system';
  await fixed.elements.start.events.click();
  const fixedWS=fixed.sockets[0];fixedWS.open();
  fixedWS.message(JSON.stringify({setupComplete:{}}));await flush();
  fixedWS.message(JSON.stringify({serverContent:{
    outputTranscription:{text:'שלום לכולם. זהו ניסוי בקריינות עברית קבועה.'},
    modelTurn:{parts:[{inlineData:{data:pcm,mimeType:'audio/pcm;rate=24000'}}]}
  }}));await flush();
  assert.equal(fixed.spoken.length,1,'Local Hebrew TTS must speak output transcript');
  assert.equal(fixed.spoken[0].voice.name,'Local Hebrew Test');
  assert.equal(fixed.buffers.length,0,'No double-play with Google native PCM');
  fixed.elements.stop.events.click();
  assert(fixed.ttsCanceled>=1,'Stop must cancel local TTS');
  console.log('PASS: offline MockWebSocket voice options, mono meter, Blob/transcript/audio, stop cleanup');
})().catch(e=>{console.error(e);process.exitCode=1});