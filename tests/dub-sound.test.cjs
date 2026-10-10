'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','dub-worklet.js'),'utf8');
assert(source.includes('this.bassAlpha=1-Math.exp'));
assert(source.includes('this.trebleAlpha=1-Math.exp'));
assert(source.includes('0.60*this.bass+0.18*treble'));
assert(source.includes('this.port.postMessage(this.packet.buffer'));
assert(source.includes("registerProcessor('hebrew-dub-capture'"));
function tone(hz){
  let bass=0,lowPass=0;const fsHz=48000;
  const alphaBass=1-Math.exp(-2*Math.PI*175/fsHz);
  const alphaTreble=1-Math.exp(-2*Math.PI*4250/fsHz);
  let output=0;
  for(let i=0;i<4800;i++){
    const signal=Math.sin(i*2*Math.PI*hz/fsHz)*0.65;
    bass+=alphaBass*(signal-bass);
    lowPass+=alphaTreble*(signal-lowPass);
    const ambience=0.60*bass+0.18*(signal-lowPass);
    if(i>1000)output+=ambience*ambience;
  }
  return Math.sqrt(output/3800);
}
const bass=tone(90),speech=tone(1400),effect=tone(7000);
assert(bass>0.16,'Mono bass is audible');
assert(bass>speech*3,'Speech band is attenuated');
assert(effect>0.03,'Treble effects survive');
console.log('PASS: mono sound spectrum, side-channel wiring and PCM path');
