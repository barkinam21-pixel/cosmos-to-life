/* World Science: one journey, one player, six visible cards.
   Works from the full original course plus current cinema routes without changing either source. */
(function(){
'use strict';
const course=window.worldScienceCourse, guide=window.scienceCinemaGuide;
if(!course||!guide?.paths?.journey?.chapters||!Array.isArray(videos)){return;}
const idFromUrl=(url)=>{
  const s=String(url||'');
  const m=s.match(/[?&]v=([A-Za-z0-9_-]{11})(?:[&#]|$)|youtu\.be\/([A-Za-z0-9_-]{11})(?:[?&#/]|$)|youtube\.com\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})/);
  return m?(m[1]||m[2]||m[3]):null;
};
const safeUrl=(url)=>{try{const u=new URL(url);return u.protocol==='https:'?u.href:''}catch(e){return ''}};
const esc=(s)=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const filmById=new Map(videos.map(v=>[v.id,v]));
const stageMeta=guide.paths.journey.chapters.map((ch,i)=>({number:i+1,name:ch.name,description:ch.description||'',era:ch.era||''}));
const stageArr=stageMeta.map(()=>[]);
const itemByKey=new Map();
const seenCinema=new Set();
const duplicatesInCinema=[];
guide.paths.journey.chapters.forEach((ch,si)=>{
  for(const point of ch.items){
    const film=filmById.get(point.id);
    if(!film)continue;
    if(seenCinema.has(point.id)){duplicatesInCinema.push(point.id);continue;}
    seenCinema.add(point.id);
    const obj={
      key:'yt:'+film.id, id:film.id, title:film.title||film.en||film.id, en:film.en||'',
      who:film.who||'', note:film.note||'', link:'https://www.youtube.com/watch?v='+encodeURIComponent(film.id),
      media:'youtube', stage:si+1, lang:film.lang||(guide.videoLanguages?.[film.id])||'',
      source:'cinema', group:-1, sourceSequence:0, originalLessons:[],
      why:point.why||film.bridge||'', optional:Boolean(film.ease>=2||/רשות|להעמקה/.test((point.why||'')+' '+(film.phase||''))),
      quiet:Boolean(film.quiet), duration:film.duration||'', phase:film.phase||'', labels:film.phase||''
    };
    stageArr[si].push(obj);itemByKey.set(obj.key,obj);
  }
});
const extraInCinema=[];
for(const film of videos){
 if(seenCinema.has(film.id))continue;
 extraInCinema.push(film.id);
 // This is a visible editorial warning rather than a fabricated chronological placement.
}
const courseSlots=stageMeta.map(()=>[]);
let mergedDuplicates=0,uniqueCourse=0,externalCount=0;
for(const line of course.units){
 const [stage,g,serial,title,who,note,questions,labels,level,rawUrl]=line;
 if(!Number.isInteger(stage)||stage<1||stage>40)continue;
 const url=safeUrl(rawUrl);
 if(!url)continue;
 const id=idFromUrl(url);
 const key=id?'yt:'+id:'ext:'+url;
 const lesson={chapter:g,number:serial,title,who,note,questions,labels,level,url};
 if(itemByKey.has(key)){
    const existing=itemByKey.get(key);
    existing.originalLessons.push(lesson);
    mergedDuplicates++;
    continue;
 }
 let media='external';
 if(id)media='youtube';
 else if(/\.(?:mp4|m4v)(?:[?#]|$)/i.test(url))media='direct';
 else if(/^https:\/\/(?:www\.)?vimeo\.com\/\d+(?:[/?#]|$)/i.test(url))media='vimeo';
 const deep=/העמקה|מתקדם|ארוך|אוניברסיטה|סרט מלא|דוקו מלא|lecture|university|caltech|mit/i.test(String(level)+' '+String(who)+' '+String(note));
 const item={
   key,id:id||'',title,en:'',who,note,link:url,media,stage,lang:/[\u0590-\u05ff]/.test(title)?'he':'en',
   source:'course',group:g,sourceSequence:serial,originalLessons:[lesson],
   why:note||'',optional:deep,quiet:false,duration:'',phase:course.chapters[g]?.name||'',labels:Array.isArray(labels)?labels.join(' · '):String(labels||'')
 };
 itemByKey.set(key,item);courseSlots[stage-1].push(item);
 uniqueCourse++;
 if(!id)externalCount++;
}
const commonWords=new Set('what when where which whose will that this from with into your about have does just works explained explanation science physics chemistry biology crash course part episode video official full theory the and how why for are can did was were its they their lesson introduction overview understanding universe world life energy high school make using through who all more'.split(' '));
function words(text){
 return new Set(String(text||'').toLowerCase().replace(/[^a-z0-9\u0590-\u05ff]+/g,' ').split(' ').filter(w=>w.length>3&&!commonWords.has(w)));
}
function overlap(a,b){let score=0;for(const w of a)if(b.has(w))score++;return score;}
const STAGES=stageArr.map((cinema,idx)=>{
 const lessons=courseSlots[idx];
 if(!cinema.length)return lessons;
 const buckets=Array.from({length:cinema.length+1},()=>[]);
 let minSlot=1;
 for(let k=0;k<lessons.length;k++){
   const unit=lessons[k];
   const target=1+(lessons.length<2?Math.floor(cinema.length/2):Math.round(k/(lessons.length-1)*(cinema.length-1)));
   const titleWords=words(unit.title), noteWords=words(unit.note);
   let best=minSlot,bestScore=-Infinity;
   for(let slot=minSlot;slot<=cinema.length;slot++){
     const neighbor=cinema[slot-1];
     const ne=words((neighbor.en||'')+' '+neighbor.title);
     const nn=words(neighbor.note+' '+neighbor.phase);
     const score=overlap(titleWords,ne)*3+overlap(titleWords,nn)*1.35+
       overlap(noteWords,ne)*0.65-Math.abs(slot-target)*1.8;
     if(score>bestScore){bestScore=score;best=slot;}
   }
   buckets[best].push(unit);minSlot=best;
 }
 const woven=[];
 for(let j=0;j<cinema.length;j++){woven.push(cinema[j]);woven.push(...buckets[j+1]);}
 return woven;
});
const MAIN=STAGES.flat();
const routes={journey:MAIN};
for(const route of ['core','calm','sleep','hebrew']){
 const chapterItems=guide.paths[route]?.chapters?.flatMap(ch=>ch.items)||[];
 const seen=new Set();
 routes[route]=chapterItems.map(pt=>'yt:'+pt.id).filter(key=>{if(seen.has(key))return false;seen.add(key);return itemByKey.has(key);}).map(key=>itemByKey.get(key));
}
const ytCount=MAIN.filter(x=>x.media==='youtube').length;
const qa={
 full:MAIN.length,unique:new Set(MAIN.map(x=>x.key)).size,stations:STAGES.length,originalCourse:course.units.length,
 cinemaVideos:videos.length,mergedDuplicates,external:externalCount,youtube:ytCount,
 unseenCinema:extraInCinema,duplicateCinema:duplicatesInCinema,
 stationCounts:STAGES.map(arr=>arr.length),routes:Object.fromEntries(Object.entries(routes).map(([k,v])=>[k,v.length])),
 badSequence:STAGES.flatMap((list,i)=>list.filter(x=>x.stage!==i+1).map(x=>x.key)),
 courseLoss:course.units.length!==uniqueCourse+mergedDuplicates
};
window.worldScienceQA=Object.freeze(qa);
window.worldScienceModel={stages:STAGES,routes,itemByKey,stageMeta};
if(typeof document==='undefined'||!document.getElementById('playerHost'))return;

const $=id=>document.getElementById(id);
let mode='journey',query='',omitDeep=false,key=MAIN[0]?.key||'',viewPage=0,auto=true,userPaused=true;
let ytPlayer=null,activeKind='',mediaElement=null,pendingPlay=false,pendingTime=0;
let errorStreak=0,errorTimeout=0,lastSaved=0,lastPauseForce=0;
const STORE='worldScienceResumeV1';
let saved=null;
try{saved=JSON.parse(localStorage.getItem(STORE)||'null')}catch(e){}
if(saved&&routes[saved.mode]?.length)mode=saved.mode;
if(saved&&itemByKey.has(saved.key))key=saved.key;
if(saved&&typeof saved.auto==='boolean')auto=saved.auto;
if(saved&&typeof saved.omitDeep==='boolean')omitDeep=saved.omitDeep;
let currentTime=Number(saved?.seconds)||0;
function say(s){$('status').textContent=s;}
function filteredRoute(){
 let list=routes[mode]||MAIN;
 if(omitDeep&&mode==='journey')list=list.filter(x=>!x.optional);
 const q=query.trim().toLowerCase();
 if(q)list=list.filter(x=>[x.title,x.en,x.who,x.note,x.labels,x.phase].join(' ').toLowerCase().includes(q));
 return list;
}
function active(){return itemByKey.get(key)||MAIN[0];}
function position(list){return list.findIndex(x=>x.key===key);}
function writeProgress(seconds){
 const now=Date.now();if(now-lastSaved<2000&&seconds===undefined)return;
 lastSaved=now;
 try{localStorage.setItem(STORE,JSON.stringify({key,mode,auto,omitDeep,seconds:Math.max(0,Math.round(seconds==null?playbackTime():seconds)),savedAt:now}))}catch(e){}
}
function playbackTime(){
 try{if(activeKind==='youtube'&&ytPlayer?.getCurrentTime)return Number(ytPlayer.getCurrentTime())||0;
 if(activeKind==='direct'&&mediaElement)return mediaElement.currentTime||0;}catch(e){}
 return currentTime||0;
}
function poster(item){
 const yt=item.id&&/^[A-Za-z0-9_-]{11}$/.test(item.id);
 return yt?'https://i.ytimg.com/vi/'+item.id+'/hqdefault.jpg':'';
}
function mediaLink(item){return item.link||'';}
function updateModeButtons(){
 document.querySelectorAll('[data-mode]').forEach(btn=>{const on=btn.dataset.mode===mode;btn.setAttribute('aria-pressed',String(on));btn.classList.toggle('active',on);});
 $('auto').setAttribute('aria-pressed',String(auto));
 $('auto').textContent=auto?'רצף אוטומטי: פעיל':'רצף אוטומטי: כבוי';
 $('skipDeep').checked=omitDeep;
}
function showStage(item){
 const stage=stageMeta[item.stage-1]||stageMeta[0],list=STAGES[item.stage-1]||[];
 $('stageEyebrow').textContent='תחנה '+String(stage.number).padStart(2,'0')+' / 40';
 $('stageTitle').textContent=stage.name;
 $('stageDescription').textContent=stage.description;
 $('stageCount').textContent=list.length+' תכנים בתחנה';
 $('stageSelect').value=String(item.stage);
 const root=document.documentElement;
 root.dataset.era=item.stage<=6?'cosmos':item.stage<=12?'stars':item.stage<=16?'earth':item.stage<=24?'life':item.stage<=38?'lab':'future';
}
function renderCards(keepPage){
 const route=filteredRoute(),pos=position(route);
 if(!keepPage&&pos>=0)viewPage=Math.floor(pos/6);
 viewPage=Math.max(0,Math.min(viewPage,Math.max(0,Math.ceil(route.length/6)-1)));
 const start=viewPage*6,part=route.slice(start,start+6);
 $('cards').innerHTML=part.map((item,index)=>{
  const on=item.key===key;
  const img=poster(item),badge=item.source==='course'?'מהמסלול הלימודי':'מקולנוע המדע';
  const thumb=img?'<img loading="lazy" decoding="async" width="136" height="77" src="'+esc(img)+'" alt="">':'<span class="no-thumb">'+(item.media==='direct'?'🎞':'✦')+'</span>';
  return '<button type="button" class="clip'+(on?' selected':'')+'" data-key="'+esc(item.key)+'" aria-pressed="'+on+'">'+
   '<span class="clip-thumb">'+thumb+'</span><span class="clip-copy"><small>'+esc(badge)+(item.optional?' · רשות':'')+'</small>'+
   '<strong><bdi>'+esc(item.title)+'</bdi></strong><em>'+esc(item.who)+'</em></span><span class="number">'+(start+index+1)+'</span></button>';
 }).join('');
 $('pageInfo').textContent=route.length?((start+1)+'–'+Math.min(start+6,route.length)+' מתוך '+route.length):'אין תוצאות';
 $('prevPage').disabled=viewPage<=0;
 $('nextPage').disabled=(viewPage+1)*6>=route.length;
 $('navPrev').disabled=pos<=0;
 $('navNext').disabled=pos<0||pos>=route.length-1;
 $('routeCount').textContent=route.length+' תכנים במסלול הנבחר';
}
function showCurrent(){
 const item=active();if(!item)return;
 showStage(item);updateModeButtons();
 const filmLabel=item.source==='cinema'?'קולנוע המדע':'המסלול הלימודי';
 $('nowLabel').textContent=filmLabel+' · '+(item.media==='youtube'?'YouTube':item.media==='direct'?'וידאו רשמי':item.media==='vimeo'?'Vimeo':'אתר המקור')+(item.optional?' · רשות':'');
 $('nowTitle').textContent=item.title;
 $('byline').textContent=[item.who,item.duration,item.labels].filter(Boolean).join(' • ');
 $('note').textContent=item.note||item.why||'';
 $('bridge').textContent=item.why&&item.why!==item.note?item.why:'';
 $('bridge').hidden=!$('bridge').textContent;
 const lessons=item.originalLessons||[];
 const questions=lessons.flatMap(l=>Array.isArray(l.questions)?l.questions:[]);
 $('questions').innerHTML=questions.length?'<summary>שאלות לחשיבה מהשיעור המקורי ('+questions.length+')</summary><ul>'+
    questions.map(q=>'<li>'+esc(q)+'</li>').join('')+'</ul>':'';
 $('questions').hidden=!questions.length;
 const firstLesson=lessons[0];
 $('sourceInfo').textContent=firstLesson?(course.chapters[firstLesson.chapter]?.name||'')+' · '+String(firstLesson.level||''):'';
 const link=mediaLink(item);
 $('watchAtSource').href=link;
 $('watchAtSource').textContent=item.id?'פתיחה ב־YouTube / דיבוב':'פתיחה באתר המקור';
 $('nowProgress').textContent=(filteredRoute().findIndex(x=>x.key===item.key)+1)+' / '+filteredRoute().length;
 const idx=filteredRoute().findIndex(x=>x.key===key),next=filteredRoute()[idx+1];
 $('nextExplain').textContent=next?(next.stage!==item.stage?'עוברים לתחנה הבאה — ':'מכאן נמשיך אל ')+next.title+'. '+(next.note||next.why||'').slice(0,240):'סיימנו את המסלול הנבחר. אפשר לחזור לתחנה או לבחור מסלול נוסף.';
 renderCards();
}
function clearPlayer(){
 if(errorTimeout){clearTimeout(errorTimeout);errorTimeout=0;}
 if(ytPlayer){try{ytPlayer.destroy()}catch(e){} ytPlayer=null;}
 if(mediaElement){try{mediaElement.pause();mediaElement.src='';mediaElement.load()}catch(e){}mediaElement=null;}
 activeKind='';
 $('playerHost').replaceChildren();
}
function makePoster(){
 clearPlayer();const item=active();if(!item)return;
 const holder=document.createElement('div');holder.className='preview';
 if(poster(item))holder.style.backgroundImage='linear-gradient(0deg,#061322dd,#06132222),url("'+poster(item)+'")';
 const button=document.createElement('button');button.className='bigPlay';button.type='button';
 button.textContent=item.media==='external'?'פתיחה במקור':'▶ הפעל סרטון';
 button.addEventListener('click',()=>{if(item.media==='external')window.open(item.link,'_blank','noopener,noreferrer');else play();});
 holder.appendChild(button);$('playerHost').appendChild(holder);
}
function refreshSelection(shouldPlay){
 showCurrent();
 if(shouldPlay)play(true);
 else {userPaused=true;makePoster();say('מוכן לצפייה. לחץ על הפעל.');}
 writeProgress(currentTime);
}
function pick(nextKey,shouldPlay){
 if(!itemByKey.has(nextKey))return;
 if(nextKey!==key){currentTime=0;clearPlayer();}
 key=nextKey;userPaused=!shouldPlay;
 refreshSelection(shouldPlay);
 if(mode==='journey'&&!query){const item=active();if(item)location.hash='stage-'+item.stage;}
}
function changeMode(nextMode){
 if(!routes[nextMode])return;
 mode=nextMode;query='';$('search').value='';
 let next=filteredRoute();
 if(!next.some(x=>x.key===key))key=next[0]?.key||MAIN[0]?.key;
 currentTime=0;userPaused=true;viewPage=0;refreshSelection(false);
}
function step(offset,fromAuto){
 const list=filteredRoute();let index=position(list);if(index<0)index=0;
 const next=list[index+offset];
 if(!next){if(fromAuto){auto=false;updateModeButtons();say('סיימנו את המסלול. הרצף נעצר.');writeProgress(0);}return;}
 pick(next.key,true);
}
function onEnded(){
 writeProgress(0);currentTime=0;
 if(auto&&!userPaused)step(1,true);
 else say('הסרטון הסתיים. אפשר להמשיך לסרט הבא.');
}
function handleError(reason){
 errorStreak++;
 const stop=errorStreak>=3||filteredRoute().length<=1;
 if(stop){auto=false;updateModeButtons();}
 const canSkip=!stop&&auto&&!userPaused;
 say(canSkip?'הסרטון לא זמין כאן ('+reason+'). מנסה את הפריט הבא.':'הנגן לא זמין כרגע ('+reason+'). אפשר להשתמש בקישור לאתר המקור או לבחור סרט אחר.');
 if(canSkip){errorTimeout=setTimeout(()=>{errorTimeout=0;if(auto&&!userPaused)step(1,true);},850);}
 writeProgress();
}
function loadYoutube(){
 if(!window.YT?.Player){
  pendingPlay=true;
  if(!document.getElementById('worldYoutubeApi')){
   const s=document.createElement('script');s.id='worldYoutubeApi';s.src='https://www.youtube.com/iframe_api';s.async=true;
   s.onerror=()=>{pendingPlay=false;say('לא ניתן לטעון את YouTube כעת. אפשר לפתוח את הסרטון במקור.');};
   document.head.appendChild(s);
  }
  say('טוען נגן YouTube אחד…');return;
 }
 const item=active();
 if(activeKind==='youtube'&&ytPlayer&&typeof ytPlayer.loadVideoById==='function'){
  try{ytPlayer.loadVideoById({videoId:item.id,startSeconds:currentTime||0});return;}catch(e){}
 }
 clearPlayer();
 activeKind='youtube';
 const slot=document.createElement('div');slot.id='worldYoutubeSlot';$('playerHost').appendChild(slot);
 ytPlayer=new YT.Player('worldYoutubeSlot',{
  width:'100%',height:'100%',videoId:item.id,
  playerVars:{playsinline:1,rel:0,controls:0,origin:location.origin},
  events:{
   onReady:(event)=>{
     if(userPaused){try{event.target.pauseVideo()}catch(e){}return;}
     try{if(currentTime>3)event.target.seekTo(currentTime,true);event.target.playVideo();}
     catch(e){say('נדרש ללחוץ על הפעל שוב.');}
   },
   onStateChange:(event)=>{
     if(userPaused&&(event.data===1||event.data===3)){
       const now=Date.now();
       if(now-lastPauseForce>200){lastPauseForce=now;try{ytPlayer?.pauseVideo()}catch(e){}}
       say('מושהה — לחץ על הפעל כדי להמשיך.');return;
     }
     if(event.data===1){errorStreak=0;say('מתנגן בתוך האתר.');}
     if(event.data===2){writeProgress();say('הנגן מושהה — לחץ על הפעל כדי להמשיך.');}
     if(event.data===0)onEnded();
   },
   onError:(event)=>handleError('YouTube '+event.data)
  }
 });
}
window.onYouTubeIframeAPIReady=()=>{if(pendingPlay&&!userPaused){pendingPlay=false;loadYoutube();}};
function directPlay(item){
 clearPlayer();activeKind='direct';
 const el=document.createElement('video');
 el.controls=true;el.playsInline=true;el.preload='metadata';
 el.src=item.link;el.setAttribute('aria-label',item.title);
 $('playerHost').appendChild(el);mediaElement=el;
 el.addEventListener('playing',()=>{errorStreak=0;say('מתנגן.');});
 el.addEventListener('pause',()=>{if(mediaElement!==el)return;if(!el.ended&&!userPaused){userPaused=true;say('מושהה.');}writeProgress();});
 el.addEventListener('ended',onEnded);
 el.addEventListener('error',()=>handleError('וידאו לא נטען'));
 el.addEventListener('timeupdate',()=>{if(Date.now()-lastSaved>14000)writeProgress();});
 if(currentTime>0)el.addEventListener('loadedmetadata',()=>{try{el.currentTime=currentTime}catch(e){}},{once:true});
 el.play().catch(()=>say('הדפדפן מבקש הפעלה ידנית — לחץ על ▶ בתוך הנגן.'));
}
function embedVimeo(item){
 clearPlayer();activeKind='vimeo';
 const m=item.link.match(/vimeo\.com\/(\d+)/);
 if(!m){say('פתח את הסרטון באתר המקור.');return;}
 const frame=document.createElement('iframe');frame.title=item.title;frame.loading='lazy';
 frame.src='https://player.vimeo.com/video/'+m[1]+'?autoplay=1';
 frame.allow='autoplay;fullscreen;picture-in-picture';frame.allowFullscreen=true;
 $('playerHost').appendChild(frame);say('הסרטון נטען. מעבר אוטומטי אינו זמין לנגן זה.');
}
function play(resetErrors){
 const item=active();if(!item)return;
 if(resetErrors)errorStreak=0;
 userPaused=false;pendingPlay=false;
 if(item.media==='youtube'){
   if(ytPlayer&&activeKind==='youtube'){
     try{ytPlayer.playVideo();say('ממשיך צפייה…');return;}catch(e){}
   }
   loadYoutube();
 }else if(item.media==='direct'){
   if(mediaElement&&activeKind==='direct'){
     mediaElement.play().catch(()=>say('לחץ על הפעל בנגן.'));return;
   }
   directPlay(item);
 }else if(item.media==='vimeo')embedVimeo(item);
 else {userPaused=true;say('המקור הזה נצפה באתר המפרסם. השתמש בכפתור פתיחה במקור.');}
 writeProgress();
}
function pause(){
 userPaused=true;pendingPlay=false;
 try{if(activeKind==='youtube'&&ytPlayer?.pauseVideo)ytPlayer.pauseVideo();}catch(e){}
 try{if(activeKind==='direct')mediaElement?.pause()}catch(e){}
 if(activeKind==='vimeo'){makePoster();}
 say('מושהה — לחץ על הפעל כדי להמשיך.');writeProgress();
}
function jumpStage(n){
 const i=Number(n)-1;if(!Number.isInteger(i)||i<0||i>=STAGES.length)return;
 mode='journey';query='';$('search').value='';
 const first=STAGES[i][0];if(first)pick(first.key,false);
}
function init(){
 $('totalCount').textContent=String(MAIN.length);
 $('totalStages').textContent=String(STAGES.length);
 $('stageSelect').innerHTML=stageMeta.map(x=>'<option value="'+x.number+'">'+esc(x.name)+'</option>').join('');
 $('subtitle').textContent='אנימציות, דוקומנטריים, ניסויים, קורסים בעברית ובאנגלית — '+MAIN.length+' יחידות בסדר אחד, בלי כפילויות.';
 document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>changeMode(btn.dataset.mode)));
 $('cards').addEventListener('click',e=>{const btn=e.target.closest('[data-key]');if(btn)pick(btn.dataset.key,false);});
 $('search').addEventListener('input',e=>{query=e.target.value;viewPage=0;renderCards(true);});
 $('skipDeep').addEventListener('change',e=>{omitDeep=e.target.checked;viewPage=0;renderCards();writeProgress();});
 $('navPrev').addEventListener('click',()=>step(-1,false));
 $('navNext').addEventListener('click',()=>step(1,false));
 $('prevPage').addEventListener('click',()=>{viewPage--;renderCards(true);});
 $('nextPage').addEventListener('click',()=>{viewPage++;renderCards(true);});
 $('stageSelect').addEventListener('change',e=>jumpStage(e.target.value));
 $('play').addEventListener('click',()=>play(true));
 $('pause').addEventListener('click',pause);
 $('auto').addEventListener('click',()=>{auto=!auto;updateModeButtons();writeProgress();});
 $('resume').addEventListener('click',()=>{
   if(saved&&itemByKey.has(saved.key)){mode=routes[saved.mode]?saved.mode:'journey';key=saved.key;query='';$('search').value='';currentTime=saved.seconds||0;refreshSelection(false);}
   else {mode='journey';key=MAIN[0].key;currentTime=0;refreshSelection(false);}
 });
 $('playerHost').addEventListener('dblclick',()=>{if(userPaused)play();else pause();});
 const hash=location.hash.match(/^#stage-(\d{1,2})$/);
 if(hash&&mode==='journey'&&(!saved||!itemByKey.has(saved.key))){const si=Number(hash[1])-1; if(STAGES[si]?.length){key=STAGES[si][0].key;currentTime=0;}}
 if(!filteredRoute().some(x=>x.key===key)){key=filteredRoute()[0]?.key||MAIN[0]?.key;}
 refreshSelection(false);
 $('resume').hidden=!saved;
 if(extraInCinema.length)say('יש סרטוני קולנוע שטרם שובצו במסע — נדרשת בדיקת עריכה.');
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')writeProgress();});
 window.addEventListener('pagehide',()=>writeProgress());
}
init();
})();