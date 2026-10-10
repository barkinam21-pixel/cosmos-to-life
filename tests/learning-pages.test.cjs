const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const pager=fs.readFileSync('learning-pages.js','utf8');
new vm.Script(pager,{filename:'learning-pages.js'});
assert.match(pager,/const PAGE_SIZE=6;/);
assert.match(pager,/history\.pushState/);
assert.match(pager,/refreshLearningPageMedia/);
let grandTotal=0,grandYT=0;
for(const path of ['index.html','life.html']){
 const html=fs.readFileSync(path,'utf8');
 assert.match(html,/<script src="\/learning-pages\.js"><\/script>/);
 assert.match(html,/<a href="\/dub\.html" target="_blank"/);
 assert.match(html,/cleanupLearningPageMedia/);
 assert.match(html,/pageYtObserver/);
 assert.match(html,/learningPages\?\.hasNext\(\)/);
 for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1],{filename:path});
 // Auto-next must also reach Vimeo and native media resolved after pagination.
 assert.match(html,/queueAutoplay\(target\)/,path+' in-page media auto-next');
 assert.match(html,/if\(autoPlay&&first\)queueAutoplay\(first\)/,path+' cross-page media auto-next');
 const queueBody=html.match(/function queueAutoplay\(card\)\{([\s\S]*?)\n\}/);
 assert(queueBody,path+' native/Vimeo autoplay helper');
 let vimeoCalls=0;
 const native={dataset:{}},vimeo={};
 const queue=new Function('playVimeoWhenReady','return function(card){'+queueBody[1]+'\n}')(frame=>{if(frame===vimeo)vimeoCalls++});
 queue({querySelector:selector=>selector==='.native-resolver'?native:selector.startsWith('iframe[src^=')?vimeo:null});
 assert.equal(native.dataset.autoplay,'1',path+' deferred video autoplay');
 assert.equal(vimeoCalls,1,path+' Vimeo autoplay');
 const metadata=html.match(/video\.addEventListener\('loadedmetadata',\(\)=>\{([\s\S]*?)\},\{once:true\}\);/);
 assert(metadata,path+' resolved media must trigger autoplay');
 let played=0;
 const box={dataset:{autoplay:'1'}},video={isConnected:true,controls:true,play(){played++;return Promise.resolve()}},note={textContent:''};
 const ready=new Function('box','video','note',metadata[1]);
 ready(box,video,note);ready(box,video,note);
 assert.equal(played,1,path+' play after metadata only once');
 assert.equal(box.dataset.autoplay,'0',path+' clear autoplay marker');
 const chapters=JSON.parse(html.match(/const chapters = (.*);/)[1]);
 const order=JSON.parse(html.match(/const EMBED_ORDER=(\[[^\n]*?\]);/)[1]);
 const urls=chapters.flatMap(c=>c.items.map(item=>item[6]));
 const extracted=urls.map(u=>u&&u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})/)?.[1]).filter(Boolean);
 assert.deepEqual(extracted,order,path+' YouTube order must stay identical');
 assert.equal(new Set(extracted).size,extracted.length,path+' duplicate YouTube IDs');
 const pages=chapters.flatMap((c,ci)=>Array.from({length:Math.ceil(c.items.length/6)},(_,k)=>({ci,start:k*6,end:Math.min(c.items.length,(k+1)*6)})));
 const allItems=pages.flatMap(p=>chapters[p.ci].items.slice(p.start,p.end));
 assert.deepEqual(allItems,chapters.flatMap(c=>c.items),path+' all units survive in order');
 assert(pages.every(p=>p.end-p.start>0&&p.end-p.start<=6));
 grandTotal+=allItems.length;grandYT+=order.length;
 console.log(path+': '+allItems.length+' units, '+pages.length+' lightweight pages, '+order.length+' YouTube IDs verified');
}
assert.equal(grandTotal,394);
assert.equal(grandYT,336);
assert.match(fs.readFileSync('dub.html','utf8'),/src="\/dub\.js"/);
console.log('Pager syntax, ordering, dubbing link and small-page invariants: PASS');


// Test real pagination behavior in a tiny DOM, without a browser, network, or an API key.
class MockElement{
 constructor(tag){
  this.tagName=tag;
  this.children=[];
  this.dataset={};
  this.attributes={};
  this.handlers={};
  this.className='';
  this._html='';
  this.classList={toggle:()=>{}};
 }
 set innerHTML(value){
  this._html=value;
  this.children=[];
  if(value.includes('<div class="grid"></div>')){
   const grid=new MockElement('div');grid.className='grid';this.appendChild(grid);
  }
 }
 get innerHTML(){return this._html}
 appendChild(child){this.children.push(child);return child}
 append(...children){for(const child of children)this.appendChild(child)}
 after(){}
 replaceChildren(...children){this.children=[];this.append(...children)}
 addEventListener(type,handler){this.handlers[type]=handler}
 setAttribute(name,value){this.attributes[name]=value}
 removeAttribute(name){delete this.attributes[name]}
 scrollIntoView(){}
 querySelectorAll(selector){
  const result=[];
  function visit(el){
   for(const child of el.children){
    if(selector==='.card'&&child.className==='card')result.push(child);
    if(selector==='.grid'&&child.className==='grid')result.push(child);
    if(selector==='a[data-page]'&&child.tagName==='a'&&child.dataset.page)result.push(child);
    visit(child);
   }
  }
  visit(this);return result;
 }
 querySelector(selector){return this.querySelectorAll(selector)[0]||null}
}
for(const path of ['index.html','life.html']){
 const html=fs.readFileSync(path,'utf8');
 const sections=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 const nav=new MockElement('nav'),app=new MockElement('main');
 let cleanupCount=0,refreshCount=0,historyCount=0;
 const location=new URL('https://cosmos-to-life.vercel.app/'+(path==='life.html'?'life.html':''));
 const sandbox={
   document:{getElementById:id=>id==='nav'?nav:id==='app'?app:null,createElement:tag=>new MockElement(tag)},
   URL,URLSearchParams,location,
   history:{pushState:(state,title,nextUrl)=>{historyCount++;const full=new URL(nextUrl,location.href);location.href=full.href}},
   window:{addEventListener:()=>{},scrollTo:()=>{},cleanupLearningPageMedia:()=>{cleanupCount++},refreshLearningPageMedia:()=>{refreshCount++}},
   console,setTimeout,encodeURIComponent
 };
 const ctx=vm.createContext(sandbox);
 new vm.Script(sections[0],{filename:path+' inline data'}).runInContext(ctx);
 new vm.Script(pager,{filename:'learning-pages.js'}).runInContext(ctx);
 const chapters=JSON.parse(html.match(/const chapters = (.*);/)[1]);
 const pages=chapters.flatMap(c=>Array.from({length:Math.ceil(c.items.length/6)},(_,i)=>c.items.slice(i*6,i*6+6)));
 assert.equal(sandbox.window.learningPages.pageCount,pages.length);
 assert.equal(app.querySelectorAll('.card').length,pages[0].length);
 assert.equal(nav.querySelectorAll('a[data-page]').length,chapters.length);
 for(let p=0;p<pages.length;p++){
   if(p>0)assert.equal(sandbox.window.learningPages.next({autoPlay:true}),true);
   const cards=app.querySelectorAll('.card');
   assert.equal(cards.length,pages[p].length,'only one small page rendered');
   for(let i=0;i<cards.length;i++)assert(cards[i].innerHTML.includes(pages[p][i][0]));
 }
 assert.equal(sandbox.window.learningPages.hasNext(),false);
 assert.equal(sandbox.window.learningPages.next(),false);
 assert.equal(cleanupCount,pages.length-1);
 assert.equal(refreshCount,pages.length);
 assert.equal(historyCount,pages.length-1);
 console.log(path+' virtual page runtime navigation: PASS');
}
