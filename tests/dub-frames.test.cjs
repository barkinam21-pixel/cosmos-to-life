'use strict';
// Local, no network or key. Prevents Gemini binary-frame regression.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','dub.js'),'utf8');
const begin=source.indexOf('  async function parseLiveFrame(frame){');
const end=source.indexOf('  function explainHttp(',begin);
assert(begin>=0 && end>begin,'Gemini frame decoder missing');
const parse=new Function(source.slice(begin,end)+'\nreturn parseLiveFrame;')();
const sample={setupComplete:{}};
const str=JSON.stringify(sample);
const bytes=new TextEncoder().encode(str);
(async()=>{
 for(const [type,payload] of [
  ['string',str],
  ['ArrayBuffer',bytes.buffer],
  ['Blob',new Blob([bytes],{type:'application/json'})],
  ['TypedArray',bytes],
 ]){
  assert.deepEqual(await parse(payload),sample,type+' Gemini frame');
 }
 assert.equal(await parse(new Blob(['not-json'])),null,'Malformed frames must not crash');
 assert(source.includes("ws.binaryType='arraybuffer'"),'Key checker must request binary frames');
 assert(source.includes("thisSocket.binaryType='arraybuffer'"),'Active dubbing must request binary frames');
 assert(source.includes('const data=await parseLiveFrame(e.data);'),'Key checker must decode binary frames');
 assert(source.includes('const msg=await parseLiveFrame(raw);'),'Active player must decode binary frames');
 assert(source.includes("if(!opened)reason="),'Timeout must distinguish unopened sockets');
 assert(source.includes("else if(frames===0)reason="),'Timeout must distinguish no server response');
 assert(source.includes("inputAudioTranscription:{},\n      outputAudioTranscription:{}"),'Live transcription fields must live at setup level');
 console.log('PASS: text, Blob, ArrayBuffer, typed array, malformed frames, both sockets, timeout stages and 1007 setup');
})().catch(e=>{console.error(e);process.exitCode=1});
