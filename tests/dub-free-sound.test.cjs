'use strict';
// The optional no-key route must never allocate/send 16k PCM data packets.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','dub-free-ambience-worklet.js'),'utf8');
assert(!/new\s+Int16Array|packet\.buffer|phase\s*\+=|16000/.test(source),
  'No-key mode must not generate or transfer PCM packets');
const reports=[];
class Base{
  constructor(){
    this.port={postMessage(message){
      assert.equal(typeof message,'object');
      assert.equal(message.type,'soundLevels','Only one-second metering events allowed');
      reports.push(message);
    }};
  }
}
let Processor;
vm.runInNewContext(source,{AudioWorkletProcessor:Base,Math,sampleRate:48000,
  registerProcessor:(name,ctor)=>{assert.equal(name,'hebrew-dub-ambience');Processor=ctor}
},{filename:'dub-free-ambience-worklet.js',timeout:2000});
assert(Processor);
function rmsRatio(freq,antiphase=false) {
  const processor=new Processor();
  let wet=0,dry=0;
  for(let frame=0;frame<450;frame++){
    const l=new Float32Array(128),r=new Float32Array(128);
    const a=new Float32Array(128),b=new Float32Array(128);
    for(let k=0;k<128;k++){
      const t=(frame*128+k)/48000;
      const v=0.3*Math.sin(2*Math.PI*freq*t);
      l[k]=v;r[k]=antiphase?-v:v;
    }
    assert.equal(processor.process([[l,r]],[[a,b]]),true);
    for(let i=0;i<128;i++){
      dry+=l[i]*l[i];wet+=a[i]*a[i];
      if(antiphase)assert(Math.abs(a[i]+b[i])<1e-5,'Stereo side effects kept');
      else assert.equal(a[i],b[i],'Centered melody stays centered');
    }
  }
  return Math.sqrt(wet/dry);
}
const bass=rmsRatio(80),melody=rmsRatio(440),speech=rmsRatio(1100),treble=rmsRatio(8000),side=rmsRatio(1000,true);
assert(bass>0.5,'Bass/music preserved');
assert(melody>0.34,'Music at 440 Hz preserved');
assert(speech<0.25,'Original midrange English is attenuated');
assert(treble>0.15,'High-pitched effect audible');
assert(side>0.55,'Stereo effects preserved');
assert(reports.length>=5,'One meter reading per rendered second, not 10 PCM frames/s');
assert(reports.every(r=>r.backgroundRms>=0&&[1,2].includes(r.channels)));
const mono=new Processor();let out;
for(let f=0;f<12;f++){
  out=new Float32Array(128);
  mono.process([[new Float32Array(128).fill(0.4)]],[[out,new Float32Array(128)]]);
}
assert(out.some(v=>v>0),'Mono sound must still be audible');
console.log('PASS: free soundtrack has no PCM packets and preserves bass, stereo effects, and mono music');
