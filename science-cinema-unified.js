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
// Official National Geographic visual introductions inserted before deeper geology.
const geologyScienceClips=[
{id:'Wq9kLzm36h0',stage:14,anchor:'ujBi9Ba8hqs',before:'VNGUdObDoLk',title:'היבשות בתנועה: לוחות טקטוניים ופנגיאה · רשות',en:'Continental Drift 101 | National Geographic',who:'National Geographic · הערוץ הרשמי',phase:'🌍 נדידת יבשות · פנגיאה',note:'סרטון מצולם ומונפש שממחיש את תנועת היבשות לאורך מיליוני שנים כהכנה להרי געש ולרעידות אדמה.',bridge:'מתחילים ממפת העולם המשתנה: תנועת הלוחות יוצרת ומפרידה יבשות. משם נבין כיצד אותם כוחות מעצבים הרי געש.',ease:1,quiet:false,duration:'סרטון קצר · רשות',lang:'en'},
{id:'VSgB1IWr6O4',stage:14,anchor:'VNGUdObDoLk',after:'VNGUdObDoLk',title:'מה גורם לרעידות אדמה? · נשיונל ג׳יאוגרפיק (רשות)',en:'Earthquakes 101 | National Geographic',who:'National Geographic · הערוץ הרשמי',phase:'🌋 רעידות אדמה · תנועת לוחות',note:'מבוא חזותי לשברים גאולוגיים, תנועת הלוחות ושחרור אנרגיה ברעידת אדמה. ייתכנו צילומי נזק.',bridge:'אחרי הרי הגעש נבין כיצד תנועה פתאומית לאורך שבר גורמת לרעידת אדמה; ההסבר מכין אותנו לסרט על טבעת האש.',ease:1,quiet:false,duration:'סרטון קצר · רשות',lang:'en'}
];

// NOAA/NASA Space Place: beginner-friendly tide animation before NASA's advanced global model.
const tideIntroClip={id:'tcGEjzt_4is',stage:15,anchor:'xx-0pMlleTM',before:'PSJRymZ5bJs',title:'למה יש גאות ושפל? הירח והים · הסבר מאויר (רשות)',en:'What Causes Tides?',who:'NOAA NESDIS · NASA Space Place / JPL-Caltech',phase:'🌊 גאות ושפל · הכבידה של הירח',note:'סרטון מבוא מאויר על משיכת הירח, שני אזורי הגאות ומחזור הגאות והשפל. מסביר את הבסיס לפני הדמיית NASA המורכבת של גאות בכל האוקיינוסים.',bridge:'אחרי העננים והאוויר נרד אל הים ונראה כיצד הירח מושך את המים. כעת נוכל להבין את מפת הגאות העולמית המורכבת שמופיעה מיד אחריו.',ease:0,quiet:false,duration:'אנימציית מבוא קצרה · רשות',lang:'en'};

// Official Met Office three-part visual series: sunlight -> circulation cells -> Coriolis winds.
// Publisher listed the episodes in this order; all are optional, after cloud/aerosol basics.
const metOfficeCirculationClips=[
  {
    "id": "7fd03fBRsuU",
    "stage": 15,
    "after": "xx-0pMlleTM",
    "title": "למה העולם אינו מתחמם באופן שווה? · רוחות, חלק 1 (רשות)",
    "en": "What is global circulation? | Part One | Differential heating",
    "who": "Met Office · Learn About Weather · הערוץ הרשמי",
    "phase": "🌤️ אוויר, שמש והבדלי חימום",
    "note": "פרק 1 מתוך 3: אנימציות ומפות מסבירות למה קרינת השמש מחממת אחרת את קו המשווה ואת הקטבים. מבוא קל לפני תנועת האוויר סביב העולם.",
    "bridge": "אחרי שראינו עננים ואבק באוויר, נבין למה השמש מחממת אזורים שונים בעוצמות שונות. ההפרשים האלה מניעים את הרוחות שנראה מיד.",
    "duration": "2:15 · פרק 1/3 · רשות",
    "ease": 0,
    "quiet": false,
    "lang": "en"
  },
  {
    "id": "xqM83_og1Fc",
    "stage": 15,
    "after": "7fd03fBRsuU",
    "title": "איך האוויר נע סביב העולם? · רוחות, חלק 2 (רשות)",
    "en": "What is global circulation? | Part Two | The three cells",
    "who": "Met Office · Learn About Weather · הערוץ הרשמי",
    "phase": "🌍 תאי זרימה באטמוספרה · מפות ואנימציות",
    "note": "פרק 2 מתוך 3: זרמי האוויר מתחלקים לתאי האדלי, פרל והקוטב. הסבר מאויר מדוע יש חגורות של יערות גשם ומדבריות.",
    "bridge": "כבר הבנו שהשמש מחממת את קו המשווה יותר מן הקטבים. כעת נראה כיצד האוויר החם עולה והקר שוקע ויוצר אזורי זרימה גדולים.",
    "duration": "3:35 · פרק 2/3 · רשות",
    "ease": 1,
    "quiet": false,
    "lang": "en"
  },
  {
    "id": "PDEcAxfSYaI",
    "stage": 15,
    "after": "xqM83_og1Fc",
    "title": "למה הרוחות מתעקמות? · קוריוליס, חלק 3 (רשות)",
    "en": "What is global circulation? | Part Three | The Coriolis effect & winds",
    "who": "Met Office · Learn About Weather · הערוץ הרשמי",
    "phase": "🌪️ סיבוב כדור הארץ · רוחות וזרמי סילון",
    "note": "פרק 3 מתוך 3: אנימציות על ההשפעה של סיבוב כדור הארץ על מסלולי הרוח, זרמי סילון וכיווני רוח קבועים. העמקה לבחירה.",
    "bridge": "אחרי שלמדנו על שלושת תאי הזרימה, נוסיף את סיבוב כדור הארץ ונראה מדוע הרוח סוטה הצדה. מכאן עוברים מן האטמוספרה אל תנועת הים.",
    "duration": "6:18 · פרק 3/3 · רשות",
    "ease": 2,
    "quiet": false,
    "lang": "en"
  }
];

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
for(const item of geologyScienceClips){
 if(videos.some(v=>v.id===item.id))continue;
 const at=videos.findIndex(v=>v.id===item.anchor);
 if(at<0){console.warn('Geology video anchor missing',item.id,item.anchor);continue;}
 const {stage,anchor,before,after,...meta}=item;
 videos.splice(at+1,0,meta);
}

// Only add when the verified source anchor exists, preserving the active video.
if(!videos.some(v=>v.id===tideIntroClip.id)){
 const at=videos.findIndex(v=>v.id===tideIntroClip.anchor);
 if(at<0)console.warn('NOAA tide video anchor missing',tideIntroClip.anchor);
 else {const {stage,anchor,before,...meta}=tideIntroClip;videos.splice(at+1,0,meta);}
}

// Keep one video record per ID and preserve the active selection when inserting this series.
for(const item of metOfficeCirculationClips){
 if(videos.some(v=>v.id===item.id))continue;
 const at=videos.findIndex(v=>v.id===item.after);
 if(at<0){console.warn('Met Office video prerequisite missing',item.id,item.after);continue;}
 const {stage,after,...meta}=item;
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
// New geology introductions sit next to the exact prerequisite, not at the end.
for(const item of geologyScienceClips){
 const chapter=main.chapters[item.stage-1],clip=byId.get(item.id);
 if(!chapter||!clip||included.has(item.id))continue;
 const at=chapter.items.findIndex(x=>x.id===(item.before||item.after));
 if(at<0){console.warn('Geology curriculum neighbor missing',item.id);continue;}
 chapter.items.splice(at+(item.before?0:1),0,{id:item.id,why:'🎬 רשות · '+item.bridge});
 included.add(item.id);added++;
}

// Explain lunar tides before the detailed visualization, within the same teaching station.
{
 const ch=main.chapters[tideIntroClip.stage-1];
 if(ch&&byId.has(tideIntroClip.id)&&!included.has(tideIntroClip.id)){
  const at=ch.items.findIndex(e=>e.id===tideIntroClip.before);
  if(at<0)console.warn('NOAA tide route neighbor missing',tideIntroClip.before);
  else {ch.items.splice(at,0,{id:tideIntroClip.id,why:'🎬 מבוא חזותי קצר (רשות) · '+tideIntroClip.bridge});included.add(tideIntroClip.id);added++;}
 }
}

// Same precise sequence inside the MAIN journey, before lunar tides and ocean simulations.
for(const item of metOfficeCirculationClips){
 const ch=main.chapters[item.stage-1],clip=byId.get(item.id);
 if(!ch||!clip||included.has(item.id))continue;
 const at=ch.items.findIndex(x=>x.id===item.after);
 if(at<0){console.warn('Met Office route prerequisite missing',item.id,item.after);continue;}
 ch.items.splice(at+1,0,{id:item.id,why:'🎬 רשות · '+item.bridge});
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

// 2026-10-23: verified official publisher video IDs for two visual fluid-pressure bridges.
// Placement requires an existing exact prerequisite: never append blindly to the stage.
const fluidPressureVisuals20261023=[{"after":"WU1RKUx18mo","video":{"id":"Hk21cI45pRU","title":"בקבוק בּוּם · לחץ אוויר מועך בקבוק (ניסוי בעברית)","en":"בקבוק בּום — ניסוי מדע בבית","who":"מכון דוידסון לחינוך מדעי · סרטון יוצר רשמי","phase":"🌬️ לחץ אוויר · ניסוי בעברית","note":"ניסוי קצר וחזותי: שינויי טמפרטורה ולחץ אוויר גורמים לבקבוק להימעך בבת אחת. המשך טבעי לניסוי הכוס ההפוכה שמדגים לחץ אטמוספרי.","bridge":"אחרי שכוס המים נשארה הפוכה בזכות לחץ האוויר, נראה מה קורה כאשר הפרש הלחצים גדול כל כך שהבקבוק נמחץ. מכאן נמשיך אל האוויר סביב כנפי המטוס.","ease":0,"quiet":false,"lang":"he","duration":"קצר"}},{"after":"7tjf8HWiR3Y","video":{"id":"BickMFHAZR0","title":"איך עצים מצליחים להרים מים לגובה עצום? · Veritasium (רשות)","en":"How Trees Bend the Laws of Physics","who":"Veritasium · Derek Muller · סרטון יוצר רשמי","phase":"🌳 לחץ שלילי, מים ועצים · העמקת רשות","note":"חקירת תעלומה בעולם החי: כיצד מים עולים בעצים גבוהים מאוד, ומה תפקידם של דיות, לכידות מולקולות המים ומתח הפנים? משלב ניסויים וצילומים עם הסבר מאתגר מעט יותר.","bridge":"אחרי שראינו כיצד מים משנים את צורת זרימתם, נגלה איך מתיחות בתוך עמודת מים מאפשרת לעצים להוביל מים כלפי מעלה. בהמשך נחזור לניסויים חזותיים במים ובחומרים.","ease":1,"quiet":false,"lang":"en","duration":"כ־10 דקות"}}];
for(const item of fluidPressureVisuals20261023){
 const chapter=main.chapters[30];
 const at=chapter?.items?.findIndex(entry=>entry.id===item.after)??-1;
 if(at<0){console.warn('Fluid pressure prerequisite missing; clip NOT added',item.video.id,item.after);continue;}
 if(videos.some(video=>video.id===item.video.id))continue;
 videos.push(item.video);
 chapter.items.splice(at+1,0,{id:item.video.id,why:'🎬 רשות · '+item.video.bridge});
 included.add(item.video.id);
 added++;
}
// 2026-10-23: official Veritasium video, confirmed by its YouTube channel and creator site.
// A tangible steering/balance experiment belongs beside the existing bicycle experiment.
// This is a journey-only optional enrichment; never change the 282-film core route.
{
  const stage=27,after='MFzDaBzBlL0';
  const video={
    id:'9cNmUNHSBac',
    title:'למה אופניים נשארים יציבים? · ניסויי Veritasium (רשות)',
    en:"Most People Don't Know How Bikes Work",
    who:'Veritasium · Derek Muller · הערוץ הרשמי',
    phase:'🚲 תנועה, היגוי ושיווי משקל',
    note:'ניסויים מצולמים עם אופניים מיוחדים מראים מדוע היגוי ושיווי משקל קשורים, ולמה ההסבר הפשוט של אפקט הגירוסקופ אינו מספיק. העמקה חזותית אחרי ניסוי האופניים ההפוכים.',
    bridge:'אחרי ניסוי האופניים ההפוכים נבין בניסויים אמיתיים כיצד היגוי מאפשר לשמור על שיווי משקל בסיבוב ובנסיעה. אחר כך נחזור להדגמות של אינרציה וכוח.',
    ease:1,quiet:false,lang:'en',duration:'כ־11 דקות'
  };
  const chapter=main.chapters[stage-1];
  const at=chapter?.items?.findIndex(entry=>entry.id===after)??-1;
  if(at<0)console.warn('Bicycle stability prerequisite missing: clip NOT added',video.id,after);
  else if(!videos.some(existing=>existing.id===video.id)){
    videos.push(video);
    chapter.items.splice(at+1,0,{id:video.id,why:'🎬 רשות · '+video.bridge});
    included.add(video.id);
    added++;
  }
}

// Optional official PBS Eons Triassic bridge, verified 2026-10-23.
{
 const ch=main.chapters[19],before='fVPclPzRJk4',at=ch?.items?.findIndex(x=>x.id===before)??-1;
 const video={
  id:'QsmV34Co32c',title:'מי שלט בעולם לפני הדינוזאורים? · זוחלי הטריאס (רשות)',
  en:'When Dinosaur Look-Alikes Ruled the Earth',who:'PBS Eons · ערוץ היוצר הרשמי',
  phase:'🦖 טריאס · דינוזאורים וזוחלים דמויי תנינאים',
  note:'איורים ושחזורים ממחישים כיצד זוחלים דמויי תנינאים שגשגו בטריאס, כשדינוזאורים היו עדיין קבוצה קטנה. הכנה חזותית לסיפור השתלטות הדינוזאורים על היבשה.',
  bridge:'מהתאוששות החיים אחרי הכחדת הפרם נעבור לזוחלים ששלטו בטריאס. נכיר את המתחרים של הדינוזאורים, ואז נראה כיצד הדינוזאורים נעשו דומיננטיים.',
  ease:1,quiet:false,lang:'en',duration:'כ־7 דקות · רשות'
 };
 if(at<0)console.warn('Triassic PBS prerequisite missing; clip NOT added',video.id,before);
 else if(!videos.some(v=>v.id===video.id)){
  videos.push(video);ch.items.splice(at,0,{id:video.id,why:'🎬 רשות · '+video.bridge});included.add(video.id);added++;
 }
}

// PBS Eons official Cenozoic timeline: exact bridge after dinosaurs and before the 3-part family-tree series.
// YouTube ID and title checked against PBS Eons and university course listings on 2026-10-23.
{
  const chapter=main.chapters[20],before='bBgnqVLQm5s';
  const video={
    id:'yR8cR75iKGU',
    title:'מהכחדת הדינוזאורים לעליית היונקים והאדם · תיעוד PBS (רשות)',
    en:'From the Fall of Dinos to the Rise of Humans',
    who:'PBS Eons · הערוץ הרשמי',
    phase:'🦣 עידן היונקים · מהכחדת הדינוזאורים להופעת האדם',
    note:'סיפור מאויר ומצולם של 66 מיליון השנים האחרונות: התאוששות החיים, שינויי אקלים, התפשטות היונקים, ראשית הפרימטים ואבות האדם. סקירה כרונולוגית לפני סדרת עץ החיים.',
    bridge:'אחרי ההכחדה שהכרנו בתחנה הקודמת נבין כיצד היונקים התפשטו והסתעפו לאורך עידן הקנוזואיקון. אחר כך נעבור להסבר על עץ החיים, גנים ומוצא משותף בשלושה פרקים ברצף.',
    ease:1,quiet:false,lang:'en',duration:'12:34 · רשות'
  };
  const at=chapter?.items?.findIndex(entry=>entry.id===before)??-1;
  if(at<0)console.warn('Cenozoic PBS prerequisite missing; clip NOT added',video.id,before);
  else if(!videos.some(v=>v.id===video.id)){
    videos.push(video);
    chapter.items.splice(at,0,{id:video.id,why:'🎬 רשות · '+video.bridge});
    included.add(video.id);
    added++;
  }
}


/* GPB Physics in Motion: real-world demonstrations complete the motion prerequisites.
   Publisher and YouTube title/IDs verified 2026-10-23. Optional; preserve core route. */
const motionPrerequisites=[
 {before:'R8m9VJfwYrc',id:'9z-EIcdJ9VY',title:'מרחק לעומת העתק · הסבר עם הדגמות (רשות)',en:'What Are Distance and Displacement? | Physics in Motion',duration:'5:52 · רשות',note:'הדגמות פשוטות של ההבדל בין המרחק הכולל שעוברים ובין ההעתק מנקודת ההתחלה אל הסיום, כולל כיוון התנועה.',bridge:'לפני שנחשב מהירות, נפריד בין אורך הדרך שעברנו לבין ההעתק. משם נמשיך לניסוי המכוניות שמבדיל בין מהירות ובין מהירות עם כיוון.'},
 {after:'R8m9VJfwYrc',id:'iNTIsl8T5R4',title:'מהי תאוצה? · בלימה ומסלול ניסויים (רשות)',en:'Acceleration and Kinematic Equations | Physics in Motion',duration:'10:23 · רשות',note:'ניסויים במסלול מבחן של פורשה: שינוי מהירות ביחידת זמן, תאוצה בבלימה ומשוואות תנועה. החלק האחרון כולל חישובים שאפשר לדלג עליהם.',bridge:'אחרי שהכרנו מהירות וכיוון, נראה כיצד המהירות משתנה בזמן: זו תאוצה. ניעזר בבלימה ובתנועה של מכונית לפני שנראה זאת בגרף.'},
 {after:'iNTIsl8T5R4',id:'ZoC1L96Jgis',title:'איך קוראים גרף של תנועה? · דוגמה יומיומית (רשות)',en:'How Do You Graph Motion? | Physics in Motion',duration:'7:34 · רשות',note:'ליד דוכן אוכל לומדים לקרוא גרפים של מיקום, מהירות ותאוצה לאורך זמן: איך התנועה נראית כשמציירים אותה?',bridge:'כעת, אחרי מהירות ותאוצה, נתרגם תנועה לקווים פשוטים על גרף. משם נתקדם אל וקטורים, תנועה בשני ממדים ותנועה יחסית.'},
 {after:'w3BhzYI6zXU',id:'xBS01yzd0yI',title:'מהירות יחסית · ניסוי בסירה (רשות)',en:'What Is Relative Velocity? | Physics in Motion',duration:'6:12 · רשות',note:'ניסוי על סירה שממחיש כיצד כיוון ומהירות נראים שונים לצופה בסירה ולצופה מבחוץ. המשך שימושי ללימוד וקטורים.',bridge:'אחרי שלמדנו וקטורים ותנועה בשני ממדים, נצא לסירה ונבין מדוע מהירות תמיד נמדדת ביחס לנקודת ייחוס.'}
];
for(const spec of motionPrerequisites){
 const chapter=main.chapters[25],anchor=spec.after||spec.before;
 const pos=chapter.items.findIndex(x=>x.id===anchor);
 if(pos<0){console.warn('Motion video anchor missing; skip',spec.id,anchor);continue;}
 if(included.has(spec.id))continue;
 const {after,before,...meta}=spec;
 if(!videos.some(v=>v.id===meta.id))videos.push({...meta,who:'GPB Education · Physics in Motion',phase:'📏 תנועה, מהירות ותאוצה · יסודות',ease:1,quiet:false,lang:'en'});
 chapter.items.splice(pos+(after?1:0),0,{id:spec.id,why:'🎬 רשות · '+spec.bridge});
 included.add(spec.id);added++;
}

/* NOVA/PBS visual bridge: dark matter is not dark energy. Placed directly after the dark-matter explainer. */
{
 const id='clA9WRZA8K8',chapter=main.chapters[5];
 const after=chapter?.items.findIndex(item=>item.id==='Af0_vWDfJwQ')??-1;
 if(after<0){console.warn('Dark-energy lesson anchor missing; not inserted',id);}
 else if(!included.has(id)){
  if(!videos.some(v=>v.id===id))videos.push({
   id,title:'מהי אנרגיה אפלה? · למה התפשטות היקום מאיצה (רשות)',
   en:'What Is Dark Energy?',
   who:'What The Physics?! · יוצרי NOVA / PBS',
   phase:'🌌 חומר אפל לעומת אנרגיה אפלה · מבוא חזותי',
   note:'אנימציות והסבר מצולם על התפשטות היקום המואצת ועל התעלומה שנקראת אנרגיה אפלה. חשוב: זה אינו חומר אפל, והמנגנון עדיין אינו ידוע.',
   bridge:'חומר אפל מסייע להסביר כבידה בגלקסיות; אנרגיה אפלה היא שם לתעלומת האצת ההתפשטות של היקום כולו. אחרי ההבחנה נמשיך לראות איך נולדים כוכבים.',
   duration:'סרטון קצר · רשות',lang:'en',ease:1,quiet:false
  });
  chapter.items.splice(after+1,0,{id,why:'🎬 רשות · מבדילים בין חומר אפל, שמתגלה דרך כבידה, לבין אנרגיה אפלה הקשורה להתפשטות היקום. ההסבר חזותי וקצר לפני שחוזרים להיווצרות הכוכבים.'});
  included.add(id);added++;
 }
}

/* NASA ScienceCasts 2018, creator-verified YouTube ID. Embedding not browser-verified.
   Optional visual connection between taught field fundamentals and the solar wind. */
{
 const chapter=main.chapters[34],after='XoVW7CRR5JY',id='o4FSg-90XlA';
 const video={id,title:'המגן המגנטי של כדור הארץ · רוח השמש (רשות)',
 en:"NASA ScienceCasts: Earth's Magnetosphere",who:'NASA Science · ScienceCasts · הערוץ הרשמי',
 phase:'🧲 שדות מגנטיים · המגן של כדור הארץ',
 note:'אנימציות NASA המסבירות כיצד השדה המגנטי של כדור הארץ מסיט חלקיקי רוח שמש ועוזר להגן על האטמוספרה; השוואה למאדים והיכרות עם משימת MMS. כשלוש וחצי דקות.',
 bridge:'אחרי שהכרנו שדות חשמליים ומגנטיים בתלת־ממד נראה יישום עצום שלהם סביב כדור הארץ: המגנטוספרה. כך נחבר בין השדות שלמדנו ובין רוח השמש, ונמשיך לניסויי חשמל וניצוצות.',
 duration:'כ־3:30 · סרט NASA חזותי · רשות',lang:'en',ease:1,quiet:false};
 const at=chapter?.items?.findIndex(item=>item.id===after)??-1;
 if(at<0)console.warn('NASA magnetosphere lesson anchor missing; not inserted',id,after);
 else if(!included.has(id)){
  if(!videos.some(v=>v.id===id))videos.push(video);
  chapter.items.splice(at+1,0,{id,why:'🎬 רשות · '+video.bridge});
  included.add(id);added++;
 }
}

/* XVIVO / Harvard BioVisions: two publisher-uploaded cinematic 3D molecular animations.
   Optional, original series order: Inner Life first, then Powering the Cell.
   Both inserted after the mitochondria origin primer and before microscopy. */
{
 const chapter=main.chapters[17];
 const clips=[{"id":"wJyUtbn0O5Y","after":"0obYR-nf45I","title":"מסע תלת־ממדי אל החיים בתוך התא · Harvard/XVIVO (רשות)","en":"The Inner Life of the Cell Animation","who":"XVIVO Scientific Animation · Harvard BioVisions · סרט היוצר הרשמי","phase":"🧬 התא החי · מנועים מולקולריים והובלה בתוכו","note":"אנימציה מדעית קולנועית של XVIVO ואוניברסיטת הרווארד: מסע בתוך תא דם לבן, תנועה של חלבונים והעברת מטענים בתוך התא. זו הדמיה אמנותית המבוססת על מחקר, ולא צילום מיקרוסקופי ישיר.","bridge":"אחרי שהכרנו את המיטוכונדריה ואת מקורה ניכנס לתוך תא חי ונראה כיצד מולקולות וחלבונים נעים ופועלים יחד. בסרט הבא נתקרב במיוחד לייצור האנרגיה במיטוכונדריה.","duration":"כ־3 דקות · תלת־ממד קולנועי · רשות","ease":0,"quiet":true,"lang":"en"},{"id":"RrS2uROUjK4","after":"wJyUtbn0O5Y","title":"בתוך המיטוכונדריה: כיצד התא יוצר ATP? · Harvard/XVIVO (רשות)","en":"Powering the Cell: Mitochondria Animation","who":"XVIVO Scientific Animation · Harvard BioVisions · סרט היוצר הרשמי","phase":"⚡ ביולוגיה של אנרגיה · ATP ומיטוכונדריה","note":"אנימציית תלת־ממד מרהיבה מבית XVIVO והרווארד שממחישה ייצור ATP במיטוכונדריה מן האנרגיה שבמזון. ההדמיה ממחישה מבנים ומנגנונים מורכבים ואינה מחליפה הסבר בסיסי לנשימה תאית.","bridge":"אחרי המסע בין מכונות מולקולריות נתמקד בתחנת הכוח של התא: המיטוכונדריה ויצירת ATP. מכאן נמשיך אל תקריבים ומיקרוסקופים כדי לראות כיצד חוקרים את עולם התאים במעבדה.","duration":"אנימציה קולנועית קצרה · רשות","ease":1,"quiet":true,"lang":"en"}];
 for(const spec of clips){
  const at=chapter?.items?.findIndex(item=>item.id===spec.after)??-1;
  if(at<0){console.warn('BioVisions cinematic insertion anchor missing',spec.id,spec.after);continue;}
  if(included.has(spec.id))continue;
  const {after,...video}=spec;
  if(!videos.some(v=>v.id===spec.id))videos.push(video);
  chapter.items.splice(at+1,0,{id:spec.id,why:'🎬 רשות · '+video.bridge});
  included.add(spec.id);added++;
 }
}


/* NASA Goddard / NASA My NASA Data: official YouTube ID checked on 2026-10-23.
   GEOS-5 atmospheric simulation of 2006, not present-day CO2 measurements.
   Precise sequence: NASA vegetation/carbon -> modeled winds/CO2 -> ocean carbon. */
{
 const stage=15,after='aWqjqLFmQnA';
 const video={
  id:'x1SgmFa0r04',
  title:'איך פחמן דו־חמצני נע סביב כדור הארץ? · NASA (רשות)',
  en:"A Year in the Life of Earth's CO2",
  who:'NASA Goddard Space Flight Center · ערוץ רשמי',
  phase:'🌍 רוחות, מחזור הפחמן ואטמוספרה',
  note:'הדמיית NASA מרהיבה של תנועת פחמן דו־חמצני סביב העולם: רוחות מסיעות את הגז, והעונות משנות את דפוסי הריכוז. מבוססת על מודל GEOS-5 המדמה את שנת 2006; זו סימולציה, לא צילום ישיר או נתון מהשנה הנוכחית.',
  bridge:'אחרי שראינו את הקשר בין צמחייה לבין פחמן באטמוספרה נעקוב אחר הדרך שבה רוחות מובילות פחמן דו־חמצני ברחבי העולם. אחר כך נבחן כיצד האוקיינוס קולט חום ופחמן.',
  lang:'en',ease:1,quiet:false,duration:'סימולציית NASA חזותית קצרה · רשות'
 };
 const chapter=main.chapters[stage-1];
 const at=chapter?.items?.findIndex(item=>item.id===after)??-1;
 if(at<0)console.warn('NASA CO2 prerequisite missing; clip not added',video.id,after);
 else if(!included.has(video.id)){
  if(!videos.some(v=>v.id===video.id))videos.push(video);
  chapter.items.splice(at+1,0,{id:video.id,why:'🎬 רשות · '+video.bridge});
  included.add(video.id);added++;
 }
}

/* Curated 2026-10-23: official TED-Ed explainer and creator-identified Branch Education
   3D factory tour. Prerequisite order: chips in five minutes -> slow 3D factory
   -> existing Veritasium EUV photolithography documentary. Optional only. */
{
 const chapter=main.chapters[38];
 const clips=[
  {
   id:'IkRXpFIRUl4',
   title:'איך מייצרים שבבים? · אנימציית TED-Ed (רשות)',
   en:'How are microchips made? - George Zaidan and Sajan Saini',
   who:'TED-Ed · Kozmonot Animation Studio · מקור רשמי',
   phase:'💻 טרנזיסטורים, סיליקון ופוטוליתוגרפיה · היכרות',
   note:'אנימציה קצרה ובהירה: כיצד מייצרים מיליארדי מתגים זעירים על פרוסת סיליקון בעזרת אור, שכבות וחומרים מיוחדים, ומה המחיר הסביבתי של התהליך. מכינה לצפייה בסיור המפורט במפעל.',
   bridge:'אחרי שראינו כיצד טכנולוגיה מבוססת על אור וחשמל, ניכנס אל השבבים שמפעילים מכשירים מודרניים: איך בונים מעגלים זעירים שכבה אחר שכבה? בהמשך נראה מפעל אמיתי בהמחשת תלת־ממד.',
   duration:'5:15 דקות · אנימציה · רשות',ease:1,quiet:false,lang:'en'
  },
  {
   id:'dX9CGRZwD-w',
   title:'איך מייצרים מעבד? · סיור תלת־ממדי במפעל שבבים (רשות)',
   en:'How are Microchips Made? CPU Manufacturing Process Steps',
   who:'Branch Education · ערוץ היוצר הרשמי',
   phase:'🏭 הנדסת שבבים · ייצור, מכונות ופוטוליתוגרפיה',
   note:'מסע תלת־ממדי מרשים וארוך בתוך מפעל שבבים: פרוסות סיליקון, טרנזיסטורים, חשיפה באור, חריטה, שקיעה ובקרת איכות. מומלץ להעמקה חזותית אחרי הסבר היסוד הקצר, ובקצב נוח.',
   bridge:'כבר הכרנו באנימציה את רעיון השבב. כעת נצא לסיור חזותי ארוך במפעל ובמכונות שמדפיסות מיליארדי רכיבים זעירים; משם נמשיך לסיפור מכונות האור האולטרה־סגול המתקדמות של Veritasium.',
   duration:'27:48 דקות · תלת־ממד · העמקת רשות',ease:2,quiet:false,lang:'en'
  }
 ];
 let after='PN_ESIcQFpM';
 for(const video of clips){
  if(included.has(video.id)){after=video.id;continue;}
  const at=chapter?.items?.findIndex(item=>item.id===after)??-1;
  if(at<0){console.warn('Microchip sequence prerequisite missing; not inserting',video.id,after);break;}
  if(!videos.some(v=>v.id===video.id))videos.push(video);
  chapter.items.splice(at+1,0,{id:video.id,why:'🎬 רשות · '+video.bridge});
  included.add(video.id);added++;
  after=video.id;
 }
}


/* 2026-10-23: PBS/KQED Deep Look macrophotography of echinoderm movement.
   Precisely after its sea-urchin relative; optional journey only.
   Publisher/video identity checked; iframe and regional availability untested. */
{
 const chapter=main.chapters[22],after='ak2xqH5h0YY';
 const video={
  id:'9rxf_2EgwfE',
  title:'איך כוכב ים דוהר בלי מוח? מאות רגלי מים בתנועה · PBS (רשות)',
  en:'Ever Seen a Starfish Gallop? | Deep Look',
  who:'KQED Deep Look / PBS · הערוץ הרשמי',
  phase:'🌊 החיים בים · תנועה הידראולית ותיאום בלי מוח מרכזי',
  note:'צילומי מאקרו מרהיבים של כוכב ים צד טרף באמצעות מאות רגלי צינור המונעות בלחץ מי ים. סרט קצר וברור הממחיש דפוס תנועה מתואם בלי מוח מרכזי. מבית PBS/KQED.',
  bridge:'אחרי קיפוד הים נפגוש קרוב משפחה שלו: כוכב הים. נראה כיצד רגליים זעירות המלאות במים דוחפות ומושכות אותו יחד, ואז נמשיך אל יצורים ימיים נוספים.',
  duration:'4:33 דקות · תיעוד מאקרו · רשות',lang:'en',ease:0,quiet:false
 };
 const at=chapter?.items?.findIndex(item=>item.id===after)??-1;
 if(at<0)console.warn('PBS sea-star journey prerequisite missing; clip not added',video.id,after);
 else if(!included.has(video.id)){
  if(!videos.some(existing=>existing.id===video.id))videos.push(video);
  chapter.items.splice(at+1,0,{id:video.id,why:'🎬 רשות · '+video.bridge});
  included.add(video.id);added++;
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