'use strict';
// Offline stereo side-channel, 16kHz capture and silence tests. No audio files,
// network, API key or browser access.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const code=fs.readFileSync(path.join(__dirname,'..','dub-worklet.js'),'utf8');
let Processor;
const packets=[];
class FakeProcessor{
  constructor(){this.port={postMessage(buffer){packets.push(new Int16Array(buffer.slice(0)))}}}
}
vm.runInNewContext(code,{
  AudioWorkletProcessor:FakeProcessor,
  registerProcessor:(name,C)=>{assert.equal(name,'hebrew-dub-capture');Processor=C},
  Int16Array,Float32Array,Math,sampleRate:48000
},{filename:'dub-worklet.js',timeout:1000});
assert(Processor);
const p=new Processor();
const make=n=>new Float32Array(n);
function process(left,right){
  const a=make(left.length),b=make(left.length);
  p.process([[left,...(right?[right]:[])]],[[a,b]]);
  return {a,b};
}
// Balanced center-panned narration must vanish from the side channel.
const centered=make(128).fill(0.35);
const center=process(centered,centered);
assert(center.a.every(x=>x===0)&&center.b.every(x=>x===0));
// Stereo differences survive; translated input remains mono L+R / 2.
const l=make(128).fill(0.65),r=make(128).fill(0.15);
const stereo=process(l,r);
assert(Math.abs(stereo.a[0]-0.5)<0.00001);
assert(Math.abs(stereo.b[0]-0.5)<0.00001);
// A mono source cannot be separated; never leak original English through it.
const mono=process(make(128).fill(0.8),null);
assert(mono.a.every(x=>x===0)&&mono.b.every(x=>x===0));
// Worklet must still send 100ms (=1600 samples) of downmixed 16kHz PCM.
for(let i=0;i<40;i++)process(l,r);
assert(packets.length>=1);
assert.equal(packets[0].length,1600);
assert(packets[0].some(x=>x>0),'Translation PCM should not be silent');
assert(packets[0].every(x=>Math.abs(x)<=32767));
console.log('PASS: stereo-centered speech cancellation, mono-safe silence, local side mix, 16kHz PCM');
