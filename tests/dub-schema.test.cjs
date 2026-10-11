'use strict';
// No credentials, network requests, or external dependencies are needed.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const s=fs.readFileSync(path.join(root,'dub.js'),'utf8');
const a=s.indexOf('function setupPayload(){');
const b=s.indexOf('function explainHttp(',a);
assert(a>=0&&b>a,'Cannot find setupPayload');
const fn=new Function("const MODEL='gemini-3.5-live-translate-preview';\n"+s.slice(a,b)+"\nreturn setupPayload();");
const p=fn().setup;
assert.equal(p.model,'models/gemini-3.5-live-translate-preview');
assert.equal(p.generationConfig.translationConfig.targetLanguageCode,'he');
assert.deepEqual(p.generationConfig.responseModalities,['AUDIO']);
for(const key of ['inputAudioTranscription','outputAudioTranscription']){
  assert.deepEqual(p[key],{},key+' must be in setup');
  assert(!(key in p.generationConfig),key+' under generationConfig causes 1007');
}
assert(s.includes('setupTimer=setTimeout')&&s.includes('clearTimeout(setupTimer)'));
assert(s.includes('data.length/rate'));
assert(!/localStorage|sessionStorage|indexedDB/.test(s),'Do not persist private keys');
const html=fs.readFileSync(path.join(root,'dub.html'),'utf8');
assert(html.includes('id="checkKey"')&&html.includes('id="apiKey"'));
assert(html.includes('wss://generativelanguage.googleapis.com'));
assert(html.includes('kallpmoklcckbobcoccenpphbhbijndc'),'Verified Chrome Web Store AutoDub link required');
assert(html.includes('לא בתוך הנגן המוטמע באתר'),'Do not claim third-party extension works inside our iframe');
assert(html.includes('בלי מפתח API אישי'),'No-key mode must be explicit');
for(const page of ['index.html','life.html']){
  const body=fs.readFileSync(path.join(root,page),'utf8');
  const embed=body.match(/EMBED_ORDER\s*=\s*(\[[^\]]*\])/);
  assert(embed,page+': EMBED_ORDER missing');
  const ids=[...embed[1].matchAll(/['"]([A-Za-z0-9_-]{11})['"]/g)].map(x=>x[1]);
  const links=[...body.matchAll(/youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/g)].map(x=>x[1]);
  assert.deepEqual(ids,links,page+': video order mismatch');
  assert.equal(ids.length,new Set(ids).size,page+': duplicate video');
  assert(body.includes('href="/dub.html"')&&body.includes('advanceAfterCard')&&body.includes('showEmbedFallback'));
  assert(body.includes('🎧 נסה דיבוב חינמי ב־YouTube'),'Every YouTube card should offer an opt-in free dubbing route');
  assert(body.includes('class="watch free-dub-watch"'),'Free route must be an ordinary link, never an injected player');
}
console.log('PASS: Gemini Live 1007 setup schema, Hebrew translation, privacy and both video sequences');
