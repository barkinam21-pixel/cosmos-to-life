/* Keep all source video data/EMBED_ORDER in index.html and life.html unchanged. */
(function(){
  'use strict';
  // Six players maximum on one virtual page. Retain this limit for future additions.
  // Navigation happens within the SAME tab/document so the separate live-dubbing capture is not reset.
  const PAGE_SIZE=6;
  const pages=[];
  chapters.forEach((chapter,ci)=>{
    for(let start=0;start<chapter.items.length;start+=PAGE_SIZE){
      pages.push({ci,start,end:Math.min(chapter.items.length,start+PAGE_SIZE)});
    }
  });
  if(!pages.length)return;
  const firstPages=chapters.map((chapter,ci)=>pages.findIndex(p=>p.ci===ci));
  let current=-1;
  const headerPager=document.createElement('div');
  headerPager.className='page-controls';
  headerPager.setAttribute('aria-label','מעבר בין דפי הלימוד');
  nav.after(headerPager);
  const bottomPager=document.createElement('div');
  bottomPager.className='page-controls page-controls-bottom';
  bottomPager.setAttribute('aria-label','מעבר בין דפי הלימוד');
  app.after(bottomPager);

  function urlPage(){
    const raw=new URLSearchParams(location.search).get('page');
    if(raw!==null){
      const n=Number(raw);
      if(Number.isInteger(n))return Math.min(pages.length-1,Math.max(0,n-1));
    }
    const match=location.hash.match(/^#ch-(\d+)$/);
    if(match){
      const ci=Number(match[1])-1;
      if(ci>=0 && ci<chapters.length)return firstPages[ci];
    }
    return 0;
  }

  function drawCards(p){
    (function(c,ci,start,end){const s=document.createElement('section');s.className='chapter';s.id='ch-'+(ci+1);s.innerHTML='<h2>פרק '+(CHAPTER_OFFSET+ci+1)+' · '+c.t+'</h2><p class="intro">'+c.intro+'</p><div class="grid"></div>';const g=s.querySelector('.grid');c.items.slice(start,end).forEach((x,localIndex)=>{const ii=start+localIndex;const a=document.createElement('article');a.className='card';a.innerHTML='<div class="top"><div class="num">'+hebSub(ii+1)+'</div><div><h3 class="title">'+x[0]+'</h3><div class="meta">'+x[1]+' · רמת עומק: '+x[5]+'</div></div></div>'+media(x[6])+'<div class="why"><b>למה עכשיו?</b> '+x[2]+'</div><ul class="q">'+x[3].map(q=>'<li>'+q+'</li>').join('')+'</ul><div class="chips">'+x[4].map(t=>'<span class="chip">'+t+'</span>').join('')+'</div>';g.appendChild(a)});const b=document.createElement('div');b.className='bridge';b.textContent='גשר לפרק הבא: '+c.bridge;if(end===c.items.length)s.appendChild(b);app.appendChild(s)})(chapters[p.ci],p.ci,p.start,p.end);
  }

  function drawControls(){
    const p=pages[current],partChapter=CHAPTER_OFFSET+p.ci+1;
    const label='דף '+(current+1)+' מתוך '+pages.length+' · פרק '+partChapter+' · יחידות '+(p.start+1)+'–'+p.end+' מתוך '+chapters[p.ci].items.length;
    for(const box of [headerPager,bottomPager]){
      box.replaceChildren();
      const back=document.createElement('button');
      back.type='button';back.textContent='הדף הקודם';back.disabled=current===0;
      back.addEventListener('click',()=>show(current-1,{history:true,scroll:true}));
      const info=document.createElement('span');
      info.className='page-description';info.textContent=label;
      const next=document.createElement('button');
      next.type='button';next.textContent='הדף הבא';next.disabled=current===pages.length-1;
      next.addEventListener('click',()=>show(current+1,{history:true,scroll:true}));
      box.append(back,info,next);
    }
    nav.querySelectorAll('a[data-page]').forEach(a=>{
      const target=Number(a.dataset.page)-1;
      const active=pages[target]?.ci===p.ci;
      a.classList.toggle('chapter-nav-current',active);
      if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
    });
  }

  function show(index,options){
    if(index<0||index>=pages.length)return false;
    if(index===current)return true;
    const opts=options||{};
    if(current!==-1 && typeof window.cleanupLearningPageMedia==='function')window.cleanupLearningPageMedia();
    current=index;
    app.replaceChildren();
    drawCards(pages[index]);
    drawControls();
    if(opts.history){
      const url=new URL(location.href);
      if(index===0)url.searchParams.delete('page');
      else url.searchParams.set('page',String(index+1));
      url.hash='';
      history.pushState({learningPage:index},'',url.pathname+url.search+url.hash);
    }
    if(opts.scroll){
      const first=app.querySelector('.card');
      if(opts.autoPlay&&first)first.scrollIntoView({behavior:'smooth',block:'start'});
      else window.scrollTo({top:0,behavior:'instant'});
    }
    if(typeof window.refreshLearningPageMedia==='function')window.refreshLearningPageMedia({autoPlay:!!opts.autoPlay});
    return true;
  }

  chapters.forEach((chapter,ci)=>{
    const page=firstPages[ci];
    if(page<0)return;
    const a=document.createElement('a');
    a.href='?page='+(page+1);
    a.dataset.page=String(page+1);
    a.textContent='פרק '+(CHAPTER_OFFSET+ci+1)+' · '+chapter.t;
    a.addEventListener('click',e=>{e.preventDefault();show(page,{history:true,scroll:true})});
    nav.appendChild(a);
  });
  window.learningPages={
    hasNext:()=>current<pages.length-1,
    next:options=>show(current+1,{history:true,scroll:true,...(options||{})}),
    pageCount:pages.length,
    pageSize:PAGE_SIZE
  };
  window.addEventListener('popstate',()=>show(urlPage(),{scroll:true}));
  show(urlPage(),{scroll:false});
})();
