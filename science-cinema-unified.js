/* Full interdisciplinary learning journey. 40 stages; one video ID/one YouTube player.
   Editorial placements reviewed 2026-10-19, based on prerequisites, subject, and series order.
   Preserve the shorter existing route separately to remain usable during pain. */
(function(){
'use strict';
const guide=window.scienceCinemaGuide;
if(!guide?.paths?.journey?.chapters||!Array.isArray(videos))return;
const main=guide.paths.journey;
if(!guide.paths.core)guide.paths.core={
  title:'🌱 המסע הממוקד · בלי כל ההרחבות',
  short:'40 תחנות · סרטי יסוד והמחשות נבחרות',
  description:'אותו סדר מדעי של המסע המשולב, אבל בלי מאות ההעמקות הנוספות. נוח יותר בימים של כאב או קושי להתרכז.',
  chapters:main.chapters.map(chapter=>({...chapter,items:chapter.items.map(item=>({...item}))}))
};
if(guide.conceptHelp?.groups?.journey&&!guide.conceptHelp.groups.core)guide.conceptHelp.groups.core=guide.conceptHelp.groups.journey;
const stageIds={"1":["2BVqksYJ2yw"],"3":["mJtRgvly6KI"],"4":["qS7tt_9P1k8"],"5":["isdLel273rQ","5mDn2oq9OV8","hF-7eKtzAHM"],"11":["V-S6GrwH6IQ","XrqsxQCOFlw","LHbFIieK-uo","Ilifg26TZrI","PxG0Ey-x4As","V5eLsyMLfuc","gkr2km7OChM","cZTp9S-rkp0","jQe8tBsMJw0","q88fSdGMbys","dk1rCCrW9NU","uUpEEU7pplg","xrGAQCq9BMU","086N-X1Bd2o","GUqsH5y1j1M","20vUNgRdB4o","W6xnXMPtg_k","pfebROfGXwc","ZS5TnjtgVis","tKfxjeLVBCA","HTHj_pvEYYE","pHASHgrSWPg","OeYnV9zp7Dk","QunVAWABQSc","v-9P04Nvdbk","P6eNCo72FUQ","51_L6DpoPzE","jOb2DQWvDvc"],"12":["nF2FJB-QKs8","i7mZBaleCFE","kDCz5jBfJoc","fwE02OBWoKQ","9i47b__igEw","fHztd6k5ZXY"],"13":["WFIbPpRmtaE","S7TUe5w6RHo"],"14":["XgPheUeQm3E","Dg4IzxDs_0Y","IcZyyaXpWSQ"],"15":["NS-EgRf5L24","ao2Jfm35XeE","p4pWafuvdrY","TFy44bV06fI","2oKYXKKf28g","7zkt-FdPC2Y","aWqjqLFmQnA","zauJQzti7FQ","Nywnud-ifWc","6FxnUYHHLiM","OfMsX2ZHABM","5FU2DAREWbw"],"16":["KJDEsAy9RyM","N7d_RWyOv20","_18avidXxqY"],"18":["FP3-Vq3NiO4","cpIB5ww32gM","-y0P80W4S-s"],"21":["OawSUyFDGGw"],"23":["dEW1_Pba3z4","c3VVUsuowNM","fbuJSmpxiNY","LYxTyMF9k_4","nfAqTSjMBJk","YeSuQm7KfaE","uXaP43Zbz7U","Zxqg_um1TXI","mKS3sHvkc4Y"],"24":["MbvoQoOn2YE","ZP05sX5aevk","5aSfMh9ittI"],"25":["wQTvf2vsxEU","2JsKwyRFiYY","_q4DrUHKC0Q","TtisQ9yZ2zo","u5mNa6KE0lA"],"26":["Jh2cZKQZ1XA"],"27":["QonjGa9EPNI","-QTkPfq7w1A","Ixf9ZyZaE9Q"],"28":["ibQT1cp_mzc","OBKp1dnDCKg"],"29":["PUn2izowBkw","eiA2buHKV00","lcjdwSY2AzM","Q10_srZ-pbs","8GpO98uvqZQ","C7t40IPSwhY","4Nsgzb9gnHs","dmcevC55K3s","nCkmQEn_Oic"],"30":["jvUcqZlMS8s","r5YM96mA9pk","fo_pmp5rtzo","uy1Z68QMno0","B9YcfuI1a5c","PNHSIEO-KOQ","HEfHFsfGXjs","jsYwFizhncE","brU5yLm9DZM"],"31":["Q56PMJbCFXQ","ZVnmOWYnlK0","yp9grWPch5A","mm1GsUK-x64","jyQwgBAaBag","yCsgoLc_fzI","LlMnU73PPE8","n1oUMjwnCj0"],"32":["QtxVdC7pBQM","eZdUKMDfJ_o","d6eJ8mccvu0","ufI4TXaevlo","4i1MUWJoI0U","GOrWy_yNBvY","vE82PDJB8ow","NfTmy1ApCvI","Rdj5-6t6QI8","DxL2HoqLbyA","-Iktr62DFEY","7J52mDjZzto"],"33":["Io-HXZTepH4","TswJuuQDJFk","hgpp12LLxM4","2awbKQ2DLRE","t-_VPRCtiUg"],"34":["V_jYXQFjCmA","JuoVCuTP7tI","ZExGV6jSuBw","a-Nc5BhjOEU","GE-VeEQFqX4","jifqsxLRRWk","IRBfpBPELmE","8YkfEft4p-w","QCX62YJCmGk","aXRTczANuIs","KTzGBJPuJwM","lW4Uq_2VPhE","TILjzuBGkRc","EmKQsSDlaa4","7KYwi2F5Ce4"],"35":["sUc13Q8CF3s","eRzqL9BAeYA","YEJ2qryXcIQ","vvi0JtUzBrc","pyMmRRIB5yw","wq9TjQZDrAA","N72oYRZvFzA","0Lx0c0TlzFI","zq9_KBJMIEs","YMNZ2oYu-qI","Xr6Z-pLqTPA","mFca4UwZB4I","TFlVWf8JX4A","XiHVe8U5PhU","ZrMltpK6iAw","-Rb9guSEeVE","HXOok3mfMLM","u4FpbaMW5sk","G3H5lKoWPpY","m4jzgqZu-4s","-w-VTw0tQlE","f_MZNsEqyQw","s94suB5uLWw","AGglJehON5g","bHIhgxav9LY","XoVW7CRR5JY","HDzVD-cqiWM","IgpdT9XbVgI","x2H0OwZvbuo"],"36":["sB4C3YfSZyU","ygVZjQK5z-8","P-uyKrPlH9Q","SS4tcajTsW8","agujzHdvtjc","I1j1aoELovk","GK2pZ_oVU1o","7Q-aVBv7PWM","R_HGnc63QKU","KciAzYfXNwU","bbECmVdyWlQ","sH1PVVJuBtE","zy7vUppYPC8","UVf2Yw7uFoE"],"37":["nPHegSulI_M","lfkjm2YRG-Q","cimZGu5GadQ","dWJi8pRBW4E"],"38":["fHglQ1uIT9Y","ElsGy4V3qSA","j8-D301SqQs","gkFD9ZPM3Jg","Ip_jdcA8fcw","XKSjCOKDtpk","QdJ-ms4ls4I","5M1xvXt92WU","i8fp0MQ-3zE","_YmwQ_6Gbjk","tvB659d_oik","omVpq_Kqt4A"],"39":["Mllam3nKTv4","PN_ESIcQFpM"],"40":["pDUUT2Y_9qk","4rTv9wvvat8","Zgu3qEPT86Q","dww8Hekngmg"]};
const byId=new Map(videos.map(v=>[v.id,v]));
const included=new Set(main.chapters.flatMap(chapter=>chapter.items.map(item=>item.id)));
const intro=video=>video.lang==='he'?'🇮🇱 השלמה בעברית':(/Sleep On Physics|Cosmo Explains/i.test(video.who)||/שעות|שעתיים|פרק ארוך/i.test(video.duration||''))?'🎧 העמקה רגועה ארוכה (רשות)':video.ease===2?'📚 העמקה למתקדמים (רשות)':'🎬 המחשה והעמקה (רשות)';
let added=0;
for(const [stage,ids] of Object.entries(stageIds)){
  const chapter=main.chapters[Number(stage)-1];
  if(!chapter){console.warn('Unknown science curriculum stage',stage);continue;}
  for(const id of ids){
    const video=byId.get(id);
    if(!video){console.warn('Missing curriculum video',stage,id);continue;}
    if(included.has(id))continue;
    chapter.items.push({id,why:intro(video)+' · '+String(video.note||video.bridge||video.title).slice(0,170)});
    included.add(id);added++;
  }
}
const left=videos.filter(v=>!included.has(v.id));
if(left.length)console.warn('Unassigned cinema videos require editorial review',left.map(v=>v.id));
main.title='🌌 המסע המשולב המלא · כל המדע בסדר אחד';
main.short='40 תחנות · סרטים קצרים, דוקו, קורסים והעמקות';
main.description='מסע אחד מהמפץ הגדול אל החומר, כוכבים, חיים, ניסויים, פיזיקה, כימיה וטכנולוגיה. בכל תחנה סרטי היסוד תחילה ואחריהם השלמות, סדרות והסברים ארוכים המסומנים כרשות. אפשר לדלג בין סרטים או לבחור במסע הממוקד בימים קשים. תוכני קורסים שניתן לצפות בהם רק באתר המקור ממשיכים להופיע במדף ההעמקה של התחנה.';
main.unifiedVersion='full-2026-10-19';
render();
})();