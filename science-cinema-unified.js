/* Full interdisciplinary learning journey. 40 stages; one video ID/one YouTube player.
   Editorial placements reviewed 2026-10-19, based on prerequisites, subject, and series order.
   Preserve the shorter existing route separately to remain usable during pain. */
(function(){
'use strict';
const guide=window.scienceCinemaGuide;
if(!guide?.paths?.journey?.chapters||!Array.isArray(videos))return;
const main=guide.paths.journey;
// Five creator-verified MinutePhysics explainers: optional fast-paced bridges only.
// Insert into the video array first, and into exact curriculum positions below.
const preciseScienceClips=[{"anchor":"WzC92VJJnvg","stage":6,"after":"WzC92VJJnvg","id":"Af0_vWDfJwQ","title":"מהו חומר אפל? · MinutePhysics (העמקת רשות)","en":"Minute Physics: What is Dark Matter?","note":"המחשת לוח קצרה של הראיות לחומר אפל והשאלות שנותרו פתוחות. מומלצת אחרי הסרט החזותי על החומר האפל, לא במקומו.","bridge":"מהגלקסיות שאיננו רואים את מלוא המסה שלהן, נבחן כיצד מדענים מסיקים על קיום חומר אפל מתוך תנועות וכבידה. אחר כך נמשיך להיווצרות הכוכבים.","phase":"🌌 החומר האפל והראיות לו · הסבר מהיר","concept":"dark"},{"anchor":"px31h7ruU1Y","stage":8,"after":"px31h7ruU1Y","id":"gS1dpowPlE8","title":"איך השמש מפיקה אנרגיה? · היתוך ומנהור קוונטי (רשות)","en":"How the Sun works: Fusion and Quantum Tunneling","note":"הסבר לוח קצר ומהיר על ההיתוך הגרעיני בליבת כוכבים ועל תפקיד המנהור הקוונטי בהסתברות לתגובות. העמקה אופציונלית לאחר היכרות עם חיי הכוכב.","bridge":"אחרי שראינו כיצד כוכב חי ומתפתח, נציץ לתהליך ההיתוך שמזין אותו. מכאן ממשיכים לשאריות הכוכבים ולהיווצרות היסודות.","phase":"☀️ כוכבים · היתוך, אנרגיה ומנהור קוונטי · רשות","concept":"fusion"},{"anchor":"n09iGowWdLY","stage":34,"after":"n09iGowWdLY","id":"FAivtXJOsiI","title":"למה אור נע לאט יותר בזכוכית? · MinutePhysics (רשות)","en":"The Speed of Light in Glass","note":"הסבר מהיר ומאויר למהירות התקדמות האור בחומר ולקשר בין האור לזכוכית. מגיע אחרי הדגמות שבירת האור במים.","bridge":"אחרי הקשית והחץ הנשברים בכוס, נסביר למה התפשטות האור בזכוכית שונה מהתפשטותו בריק. משם נעבור לטיפות וקשת בענן.","phase":"🌈 אור, זכוכית ושבירה · הסבר מהיר","concept":"refraction"},{"anchor":"lW4Uq_2VPhE","stage":34,"after":"lW4Uq_2VPhE","id":"y3SBSbsdiYg","title":"איך לייזר עובד מבחינה פיזיקלית? · MinutePhysics (רשות)","en":"How lasers work (in theory)","note":"המחשת לוח קצרה ומהירה של הרעיון הפיזיקלי מאחורי לייזר, בהמשך לניסוי החזותי על אור ולייזרים.","bridge":"אחרי שראינו לייזר בניסוי אמיתי, נבין בקצרה מה מאפשר יצירת אור לייזר ממוקד ומתואם. אחר כך נמשיך לצילום אור ואוויר.","phase":"🔦 אור, לייזר ופליטה מאולצת · רשות","concept":"photon"},{"anchor":"DjcS1kRkc6M","stage":38,"after":"DjcS1kRkc6M","id":"YHS9g72npqA","title":"גלי כבידה בהמחשת דמויות מקל · MinutePhysics (רשות)","en":"Gravitational Waves Explained Using Stick Figures","note":"המחשת לוח קצרה לגלי כבידה, אחרי הביקור במתקן LIGO ובטרם הדמיות מרחב־הזמן. קצר ומהיר ולכן בגדר העמקה.","bridge":"אחרי סיפור הניסוי ב־LIGO, נמחיש באמצעות ציורי מקל כיצד גלי כבידה משנים מעט את המרחקים. מכאן נעבור למרחב־זמן בתלת־ממד.","phase":"〰️ גלי כבידה, זמן ומרחב־זמן · רשות","concept":"wave"}];

// Two verified official PBS Eons clips fill the 287–252 Ma Pangea gap before dinosaurs.
const pangeaScienceClips=[{"anchor":"sj8pFX9SOXE","stage":19,"after":"sj8pFX9SOXE","id":"yTTyI_Rscss","title":"דימטרודון: טורף־העל שלפני הדינוזאורים · תיעוד PBS (רשות)","en":"Earth's First Apex Predator on Land Wasn't a Dinosaur | Eons: Life and Death on Pangea","who":"PBS · Eons: Life and Death on Pangea · 2026","duration":"קטע תיעודי · רשות","lang":"en","ease":1,"quiet":false,"note":"צילומי שטח ממיטת מאובנים בטקסס עם מגישי PBS Eons והמחשות של פנגיאה ושל דימטרודון לפני כ־287 מיליון שנה. קטע מהסדרה, לא פרק מלא.","bridge":"לאחר שהכרנו את המעבר מהים ליבשה, נקפוץ ליבשת פנגיאה ונפגוש טורף קדום שחי הרבה לפני הדינוזאורים.","phase":"🌍 פנגיאה · החיים ביבשה לפני הדינוזאורים"},{"anchor":"yTTyI_Rscss","stage":19,"after":"yTTyI_Rscss","id":"S_eJeFIFs7g","title":"ההכחדה הגדולה מכולן: אסון סוף הפרם · תיעוד PBS (רשות)","en":"The Worst Mass Extinction Ever | Eons: Life and Death on Pangea","who":"PBS · Eons: Life and Death on Pangea · 2026","duration":"קטע תיעודי · רשות","lang":"en","ease":1,"quiet":false,"note":"תיעוד שטח ומפגש עם מומחים על משבר סוף הפרם לפני כ־252 מיליון שנה; התפרצויות געשיות ושינויים קיצוניים בסביבה. קטע מסדרה בת שישה חלקים, לא פרק מלא.","bridge":"מהחיים ששגשגו בפנגיאה נעבור להכחדת סוף הפרם; לאחר שהעולם התאושש, נגיע לתקופת הדינוזאורים בתחנה הבאה.","phase":"🌋 סוף הפרם · ההכחדה הגדולה והתאוששות החיים"}];

// Short, publisher-embedded physics lab demonstrations, with exact prerequisite placements.
const waveScienceClips=[{"id":"_2HE4AlSE_s","stage":33,"anchor":"2OP0gp9v5XM","after":"2OP0gp9v5XM","title":"שני סוגי גלים בקפיץ · גל רוחבי מול גל אורכי (רשות)","en":"The Difference Between Transverse & Longitudinal Waves","who":"Saint Mary's University · Physics Demos","phase":"🌊 יסודות הגלים · רוחבי ואורכי","note":"ניסוי אמיתי עם קפיץ סלינקי שמראה מה ההבדל בין גל רוחבי וגל אורכי: תנועה לצדדים לעומת דחיסות והתרווחויות לאורך הקפיץ. מקור: ספריית ההדגמות הרשמית של Saint Mary's University.","bridge":"אחרי שהכרנו גלים, נביט בקפיץ: החלקיקים יכולים לנוע לרוחב הגל או לאורך התקדמותו. עכשיו נוכל להבין טוב יותר מדוע קול נע כגל אורכי באוויר.","ease":0,"quiet":false,"duration":"הדגמת מעבדה קצרה · רשות","lang":"en"},{"id":"1UNeNCp5Gns","stage":33,"anchor":"Q3oItpVa9fs","after":"Q3oItpVa9fs","title":"גל עומד על קפיץ · צמתים ותהודה בהדגמה (רשות)","en":"Standing Waves on a Spring","who":"Saint Mary's University · Physics Demos","phase":"🔊 גל עומד, צמתים ותהודה","note":"הדגמת מעבדה: כשקפיץ מתנדנד בתדירות המתאימה מופיעים אזורים כמעט נייחים (צמתים) לצד אזורים שרוטטים בחוזקה. מסבירה ויזואלית את הרעיון של גל עומד לפני ניסויי תהודה עם קול.","bridge":"אחרי שראינו שצליל יכול לצייר צורות, נבחן איך גלים המוחזרים לאורך קפיץ יוצרים צמתים ודפוסים יציבים. מכאן נעבור לגלי קול עומדים שיכולים להחזיק חפצים באוויר.","ease":0,"quiet":false,"duration":"הדגמת מעבדה קצרה · רשות","lang":"en"}];
const activeVideoId=videos[current]?.id;
for(const item of preciseScienceClips){
  if(videos.some(v=>v.id===item.id))continue;
  const at=videos.findIndex(v=>v.id===item.anchor);
  if(at<0){console.warn('MinutePhysics anchor missing',item.id,item.anchor);continue;}
  const {stage,anchor,after,...meta}=item;
  videos.splice(at+1,0,{...meta,who:'MinutePhysics · Henry Reich · ערוץ היוצר הרשמי',duration:'סרטון קצר · קצב מהיר',lang:'en',ease:2,quiet:false});
}

for(const item of pangeaScienceClips){
  if(videos.some(v=>v.id===item.id))continue;
  const at=videos.findIndex(v=>v.id===item.anchor);
  if(at<0){console.warn('PBS Pangea source anchor missing',item.id,item.anchor);continue;}
  const {stage,anchor,after,...meta}=item;
  videos.splice(at+1,0,meta);
}
for(const item of waveScienceClips){
  if(videos.some(v=>v.id===item.id))continue;
  const at=videos.findIndex(v=>v.id===item.anchor);
  if(at<0){console.warn('Wave lab prerequisite video missing',item.id,item.anchor);continue;}
  const {stage,anchor,after,...meta}=item;
  videos.splice(at+1,0,meta);
}
if(activeVideoId){const at=videos.findIndex(v=>v.id===activeVideoId);if(at>=0)current=at;}
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
// Place these clips INSIDE their teaching stations after their prerequisite,
// not at a stage's end. Their neighbors remain unchanged.
for(const item of preciseScienceClips){
  const chapter=main.chapters[item.stage-1],clip=byId.get(item.id);
  if(!chapter||!clip||included.has(item.id))continue;
  const at=chapter.items.findIndex(x=>x.id===item.after);
  if(at<0){console.warn('MinutePhysics curriculum prerequisite missing',item.id,item.after);continue;}
  chapter.items.splice(at+1,0,{id:item.id,why:'🧠 רשות · המחשת לוח קצרה ומהירה: '+item.note});
  included.add(item.id);added++;
}

// PBS Pangea episodes belong between the move onto land and the rise of dinosaurs.
for(const item of pangeaScienceClips){
  const chapter=main.chapters[item.stage-1],clip=byId.get(item.id);
  if(!chapter||!clip||included.has(item.id))continue;
  const at=chapter.items.findIndex(x=>x.id===item.after);
  if(at<0){console.warn('PBS Pangea journey prerequisite missing',item.id,item.after);continue;}
  chapter.items.splice(at+1,0,{id:item.id,why:'🎬 רשות · תיעוד PBS על פנגיאה: '+item.note});
  included.add(item.id);added++;
}
// Required prerequisites first: put university wave demos next to the concept they illustrate.
for(const item of waveScienceClips){
  const chapter=main.chapters[item.stage-1],clip=byId.get(item.id);
  if(!chapter||!clip||included.has(item.id))continue;
  const at=chapter.items.findIndex(entry=>entry.id===item.after);
  if(at<0){console.warn('Wave lab journey prerequisite missing',item.id,item.after);continue;}
  chapter.items.splice(at+1,0,{id:item.id,why:'🎬 רשות · ניסוי אוניברסיטאי קצר: '+item.bridge});
  included.add(item.id);added++;
}
// Repair a confirmed 2014 Royal Institution chapter-order regression.
// Editorial ordering only: 11 existing unique videos; no new video/player or other route changes.
const technologyChapter=main.chapters[38];
const technologySequence=[["W79s0PsHhDc","מתחילים מן הנורה החשמלית: כיצד החשמל הופך לאור שימושי?"],["Mllam3nKTv4","אחרי שהכרנו את הנורה, נראה כיצד התאורה החשמלית שינתה את חיי הלילה ואת הערים."],["yMAHqOBhw_o","Royal Institution, פרק 1 מתוך 3: מאור ונורות לגורד שחקים שהופך למשחק מואר. אחר כך האור יעביר גם מידע."],["fqweToh5wyw","פרק 2 מתוך 3: מן האור בבניין להולוגרמות, מסכים ותקשורת. בפרק הבא המכונות יתעוררו לחיים."],["VGjU1mzoTFg","פרק 3 מתוך 3: מנועים, רובוטים ומוזיקה. הסדרה מסתיימת ועכשיו נראה כיצד מסכים מציגים תמונה."],["3BJU2drrtCM","מן הרובוטים וההולוגרמות אל המסך הביתי: נצלול אל הפיקסלים ונראה כיצד התמונה נבנית."],["PN_ESIcQFpM","מן האור שמצייר תמונה לאור שמודד מרחקים: לייזרים חושפים יערות בתלת־ממד."],["MiUHjLxm3V0","מלייזרים למדידה נעבור ללייזרים ולמראות המדויקים שמייצרים את שבבי המחשב. השבבים יאפשרו את הפרק הבא."],["Abbli3B8phw","סדרת הבינה המלאכותית, חלק 1 מתוך 3: מהשבבים למחשבים שלומדים לזהות דפוסים."],["p5vLTHXyTn8","חלק 2 מתוך 3: אחרי יסודות הלמידה נראה כיצד הבינה המלאכותית כבר פועלת בחיינו."],["B3IeRplsYXw","חלק 3 מתוך 3: מן הלמידה לרובוטים ולתחבורה שמקבלים החלטות בעולם האמיתי; מכאן נביט אל העתיד."]];
if(technologyChapter){
 const items=technologyChapter.items;
 const originals=new Map(items.map(item=>[item.id,item]));
 if(items.length===technologySequence.length&&technologySequence.every(([id])=>originals.has(id))){
  const ordered=technologySequence.map(([id,why])=>({...originals.get(id),why}));
  items.splice(0,items.length,...ordered);
 }else console.warn('Technology chapter inventory changed; editorial order requires review');
}
const left=videos.filter(v=>!included.has(v.id));
if(left.length)console.warn('Unassigned cinema videos require editorial review',left.map(v=>v.id));
main.title='🌌 המסע המשולב המלא · כל המדע בסדר אחד';
main.short='40 תחנות · סרטים קצרים, דוקו, קורסים והעמקות';
main.description='מסע אחד מהמפץ הגדול אל החומר, כוכבים, חיים, ניסויים, פיזיקה, כימיה וטכנולוגיה. בכל תחנה סרטי היסוד תחילה ואחריהם השלמות, סדרות והסברים ארוכים המסומנים כרשות. אפשר לדלג בין סרטים או לבחור במסע הממוקד בימים קשים. תוכני קורסים שניתן לצפות בהם רק באתר המקור ממשיכים להופיע במדף ההעמקה של התחנה.';
main.unifiedVersion='full-2026-10-19';
render();
})();