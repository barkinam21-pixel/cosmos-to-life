/* Dedicated, lightweight calm-audio physics path, curated 2026-10-19.
   These are publisher-listed videos; actual playback/embeddability must be checked in browser.
   Do not create players here; use the existing single YouTube player. */
(function(){
'use strict';
if(!Array.isArray(videos) || !window.scienceCinemaGuide?.paths)return;
const entries=[
  {
    "ease": 2,
    "quiet": true,
    "lang": "en",
    "after": "PUn2izowBkw",
    "id": "eiA2buHKV00",
    "title": "מהי אנרגיה באמת? · הסבר איטי ומעמיק",
    "en": "What is Energy Actually Made Of According to Quantum Physics?",
    "who": "Sleep On Physics",
    "phase": "⚡ אנרגיה · העמקה להאזנה",
    "note": "מסע רגוע של כשעתיים: מאנרגיה במכניקה ובחום אל קוונטים, סימטריות ושדות. מיועד להקשבה ארוכה; פחות חזותי מן המסלול הראשי.",
    "duration": "2:11 שעות",
    "bridge": "אחרי ההיכרות עם אנרגיה, אפשר להקשיב להסבר ממושך על משמעותה ועל התפתחות הרעיון במדע."
  },
  {
    "ease": 2,
    "quiet": true,
    "lang": "en",
    "after": "eiA2buHKV00",
    "id": "OBKp1dnDCKg",
    "title": "כבידה, נפילה ומסלולים · פיזיקה בקצב איטי",
    "en": "Every Confusing Thing About Gravity Explained Slowly (For Sleep)",
    "who": "Cosmo Explains",
    "phase": "🌍 כבידה ומסלולים · העמקה להאזנה",
    "note": "פרק ארוך ורגוע המבסס נפילה חופשית, חוק ניוטון ומסלולי כוכבים לפני היחסות. אפשר להקשיב ללא חישובים מסובכים.",
    "duration": "כ־2:17 שעות",
    "bridge": "מאחרי שהכרנו אנרגיה וכוחות, נעבור לכבידה — מחפצים נופלים ועד תנועת עולמות."
  },
  {
    "ease": 2,
    "quiet": true,
    "lang": "en",
    "after": "OBKp1dnDCKg",
    "id": "tvB659d_oik",
    "title": "מאיפה מגיעה מהירות האור? · מסע רגוע",
    "en": "Where Does Light Get Its Speed From?",
    "who": "Sleep On Physics",
    "phase": "💡 אור, גלים ומרחב־זמן · העמקה להאזנה",
    "note": "למה האור נע במהירות קבועה בריק, ומה שונה כשהוא עובר בחומר? הסבר ממושך המגיע גם ליחסות.",
    "duration": "2:03 שעות",
    "bridge": "מן הכבידה נעבור לתנועה המיוחדת של האור, שאחר כך תוביל להבנת היחסות."
  },
  {
    "ease": 2,
    "quiet": true,
    "lang": "en",
    "after": "tvB659d_oik",
    "id": "omVpq_Kqt4A",
    "title": "ממה עשוי פוטון? · מעמיקים באור",
    "en": "What is a Photon Made Of According to Quantum Physics?",
    "who": "Sleep On Physics",
    "phase": "💡 פוטונים · העמקה להאזנה",
    "note": "מסע היסטורי ותיאורטי בעקבות אור ופוטונים, מן הניסויים הקלאסיים ועד שדות קוונטיים. מתאים כהעמקה אחרי מהירות האור.",
    "duration": "פרק ארוך",
    "bridge": "אחרי מהירות האור נשאל מהו פוטון עצמו, ומה פירוש חלקיק של אור."
  },
  {
    "ease": 2,
    "quiet": true,
    "lang": "en",
    "after": "dgqHFpP1w2k",
    "id": "mJtRgvly6KI",
    "title": "למה אלקטרון באטום לא מאבד את כל האנרגיה?",
    "en": "An Electron Never Runs Out of Energy... Why Not?",
    "who": "Sleep On Physics",
    "phase": "⚛️ אלקטרונים ואטומים · העמקה להאזנה",
    "note": "מהבעיה הקלאסית של יציבות האטום אל בוהר, דה ברויי, שרדינגר ומכניקת הקוונטים. הסבר ארוך ואיטי.",
    "duration": "2:05 שעות",
    "bridge": "אחרי שהכרנו את האלקטרון, נעמיק בשאלה מדוע אטומים יציבים ואינם קורסים."
  },
  {
    "ease": 2,
    "quiet": true,
    "lang": "en",
    "after": "mJtRgvly6KI",
    "id": "fHglQ1uIT9Y",
    "title": "מכניקת הקוונטים · הסברים איטיים ופשוטים",
    "en": "Every Confusing Thing About Quantum Mechanics Explained Slowly (For Sleep)",
    "who": "Cosmo Explains",
    "phase": "⚛️ יסודות קוונטיים · העמקה להאזנה",
    "note": "הסבר שקט על דואליות גל־חלקיק, סופרפוזיציה, אי־ודאות ושזירה; מתאים אחרי היכרות עם אטומים.",
    "duration": "כשעתיים",
    "bridge": "בעקבות בעיית האלקטרון היציב נכיר בהדרגה את חוקי העולם הקוונטי."
  },
  {
    "ease": 2,
    "quiet": true,
    "lang": "en",
    "after": "fHglQ1uIT9Y",
    "id": "ElsGy4V3qSA",
    "title": "מאיפה מגיעה מסה? · קווארקים ואנרגיה",
    "en": "What Is Mass Made Of According to Quantum Physics?",
    "who": "Sleep On Physics",
    "phase": "⚛️ מסה, קווארקים ושדות · העמקה להאזנה",
    "note": "מסביר כיצד המסה של החומר הרגיל קשורה לאנרגיה של קווארקים וגלואונים וכיצד חלקיקים יסודיים מקבלים מסה.",
    "duration": "2:10 שעות",
    "bridge": "אחרי מושגי היסוד הקוונטיים נחקור מאין מגיעה המסה של החלקיקים והחומר."
  },
  {
    "ease": 2,
    "quiet": true,
    "lang": "en",
    "after": "ElsGy4V3qSA",
    "id": "j8-D301SqQs",
    "title": "למה הריק אינו באמת ריק? · שדות קוונטיים",
    "en": "What Is a Quantum Field... and Why Is Empty Space Not Empty",
    "who": "Sleep On Physics",
    "phase": "🌀 שדות קוונטיים · העמקה להאזנה",
    "note": "מתקדם לשדות קוונטיים, אפקט קזימיר, תנודות ריק ושדה היגס. הרחבה ארוכה אחרי הכרות עם חלקיקים וקוונטים.",
    "duration": "1:51 שעות",
    "bridge": "אחרי המסה והחלקיקים נעמיק ברעיון של השדות שמהם מתארת הפיזיקה את העולם."
  },
  {
    "ease": 2,
    "quiet": true,
    "lang": "en",
    "after": "Mllam3nKTv4",
    "id": "IgpdT9XbVgI",
    "title": "מהו מתח חשמלי באמת? · מהסוללה ועד הקוונטים",
    "en": "What is voltage really in quantum terms and effects?",
    "who": "Sleep On Physics",
    "phase": "🔋 מתח וחשמל · העמקה להאזנה",
    "note": "מתח כהפרש פוטנציאל ולא חומר שזורם בחוט: סוללות, שדות ומטענים, עם חיבור ליישומים יומיומיים.",
    "duration": "פרק ארוך",
    "bridge": "אחרי השימוש בחשמל לאור, נעמיק בשאלה מה עושה מתח חשמלי בסוללה ובחוט."
  },
  {
    "ease": 2,
    "quiet": true,
    "lang": "en",
    "after": "IgpdT9XbVgI",
    "id": "x2H0OwZvbuo",
    "title": "למה מגנט קבוע לא צריך סוללה?",
    "en": "Why a Magnet Doesn't Actually Run Out of Energy",
    "who": "Sleep On Physics",
    "phase": "🧲 מגנטיות, כוח ואנרגיה · העמקה להאזנה",
    "note": "מפריד בין כוח לבין צריכת אנרגיה, ומסביר את המגנט הקבוע דרך האלקטרונים והפיזיקה של החומר.",
    "duration": "1:58 שעות",
    "bridge": "מהפרשי מתח וזרם נעבור לכוח מגנטי ולשאלה מדוע מגנט יכול להחזיק עצם לאורך שנים."
  }
];
const chapters=[
  {
    "name": "1 · להתחיל בשאלות הגדולות",
    "description": "מושגי יסוד בקצב נינוח: אנרגיה, כבידה, אור. אין צורך לפתור תרגילים.",
    "items": [
      {
        "id": "OBKp1dnDCKg",
        "why": "מתחילים בנפילה, כבידה ומסלולים — נושאים שאפשר לדמיין."
      },
      {
        "id": "eiA2buHKV00",
        "why": "ממשיכים לאנרגיה ולצורות שבהן היא מופיעה בטבע."
      },
      {
        "id": "tvB659d_oik",
        "why": "אחרי מושגי היסוד מגיעים למהירות האור ולמרחב־זמן."
      }
    ]
  },
  {
    "name": "2 · מהו החומר?",
    "description": "מסע מדורג מאור ואלקטרונים עד הרעיון של מסה; מתאים להאזנה ממושכת.",
    "items": [
      {
        "id": "omVpq_Kqt4A",
        "why": "מהירות האור מובילה לשאלה מהו הפוטון עצמו."
      },
      {
        "id": "mJtRgvly6KI",
        "why": "מהפוטון והאור אל אלקטרונים יציבים בתוך אטומים."
      },
      {
        "id": "fHglQ1uIT9Y",
        "why": "מכאן ליסודות המוזרים אך החשובים של הקוונטים."
      },
      {
        "id": "ElsGy4V3qSA",
        "why": "אחרי הקוונטים נשאל מהי מסה ומדוע יש אותה לחומר."
      },
      {
        "id": "j8-D301SqQs",
        "why": "נסיים בהעמקה על שדות קוונטיים והטבע של הריק."
      }
    ]
  },
  {
    "name": "3 · חשמל ומגנטים מהחיים",
    "description": "שני סיפורים ארוכים שאפשר לשמוע בנפרד: למה סוללה מניעה מטענים, ולמה מגנט מחזיק בלי להתרוקן.",
    "items": [
      {
        "id": "IgpdT9XbVgI",
        "why": "ממתח בסוללה להבנה של זרם וחשמל."
      },
      {
        "id": "x2H0OwZvbuo",
        "why": "מסוללות וחשמל אל מגנטיות וכוחות שאינם דורשים צריכת אנרגיה רציפה."
      }
    ]
  }
];
const previousId=videos[current]?.id;
const unresolved=[];
for(const entry of entries){
  const {after,...v}=entry;
  if(videos.some(item=>item.id===v.id))continue;
  const at=videos.findIndex(item=>item.id===after);
  if(at<0){unresolved.push(v.id);continue;}
  videos.splice(at+1,0,v);
}
if(unresolved.length)console.warn('Calm physics path: missing insertion anchors',unresolved);
window.scienceCinemaGuide.paths.sleep={
  title:'🌙 פיזיקה בהקשבה רגועה · כשעתיים לפרק',
  short:'לשמוע הסברים ארוכים בלי להתרכז במסך',
  description:'מסלול משלים ולא תחליף למסע החזותי: פיזיקה מוסברת באנגלית בקצב איטי, בעיקר להאזנה נינוחה. הפרקים ארוכים וייתכן שהוויזואליה דלה; תכנים של ערוצים עצמאיים אינם תחליף למקור מדעי ראשוני, וניתן לעבור בכל רגע למסלולים החזותיים.',
  chapters
};
const still=videos.findIndex(v=>v.id===previousId);
if(still>=0)current=still;
page=Math.max(0,Math.floor(Math.max(0,filtered().indexOf(current))/PAGE_SIZE));
render();
})();