'use strict';
// Offline frequency tests; no internet, video download, audio upload or API key.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const packets=[],reports=[];
class Base{constructor(){this.port={postMessage(msg){
  if(msg instanceof ArrayBuffer)packets.push(new Int16Array(msg.slice(0)));
  else reports.push(msg);
}}}}
let Processor;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','dub-worklet.js'),'utf8'),{
  AudioWorkletProcessor:Base,Int16Array,Math,sampleRate:48000,
  registerProcessor:(name,p)=>{assert.equal(name,'hebrew-dub-capture');Processor=p}
},{filename:'dub-worklet.js',timeout:2000});
assert(Processor);
function gain(freq,antiphase=false){
  const p=new Processor();let wet=0,dry=0;
  for(let f=0;f<450;f++){
    const l=new Float32Array(128),r=new Float32Array(128);
    const a=new Float32Array(128),b=new Float32Array(128);
    for(let i=0;i<128;i++){
      const t=(f*128+i)/48000,v=0.3*Math.sin(2*Math.PI*freq*t);
      l[i]=v;r[i]=antiphase?-v:v;
    }
    p.process([[l,r]],[[a,b]]);
    for(let i=0;i<128;i++){
      wet+=a[i]**2;dry+=l[i]**2;
      if(antiphase)assert(Math.abs(a[i]+b[i])<1e-5,'Stereo side effects must retain direction');
      else assert.equal(a[i],b[i],'Centered audio should remain centered');
    }
  }
  return Math.sqrt(wet/dry);
}
const bass=gain(80),melody=gain(440),speech=gain(1100),treble=gain(8000),side=gain(1000,true);
assert(bass>0.5,'Mono bass/music must be audible, unlike the previous filter');
assert(melody>0.34,'Center-panned mono melodies must no longer disappear at 440Hz');
assert(speech<0.25,'Spoken mid-band must remain quieter than unfiltered English');
assert(treble>0.15,'Mono high effects must be audible');
assert(side>0.55,'Stereo side background must pass');
assert(packets.length>10&&packets.every(p=>p.length===1600),'PCM 16kHz / 100ms');
assert(reports.length>=4&&reports.some(r=>r.backgroundRms>0),'Real sound levels');
const mono=new Processor();let out;
for(let f=0;f<13;f++){
  out=new Float32Array(128);
  mono.process([[new Float32Array(128).fill(0.4)]],[[out,new Float32Array(128)]]);
}
assert(out.some(x=>x>0),'Pure mono input must not go completely silent');
console.log('PASS: offline mono/stereo soundtrack, restored 440Hz melody, limited 1100Hz speech, 16kHz PCM');
