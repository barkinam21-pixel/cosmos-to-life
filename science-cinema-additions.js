/* Film data for science-cinema.html: independent additions only. */
(function(){
  const additions=[["QTQVZuBV9oA",{"id":"6buQMvVXPHA","title":"הדים מן המפץ הגדול · מסע קולנועי בין גלקסיות","en":"Cosmic Cycles: Echoes of the Big Bang","who":"NASA Goddard · Cosmic Cycles","phase":"🌌 ראשית היקום · גלקסיות","note":"מסע מוזיקלי בין גלקסיות, חורים שחורים ומראות של היקום, עם הדמיות מרהיבות של NASA.","ease":0,"quiet":true,"duration":"קטע מוזיקלי","bridge":"מהסיפור של היווצרות היקום נעבור אל הגלקסיות והאור שעוזרים לנו לחקור אותו."}],["SxTpXX28dJA",{"id":"f-2F3QD_UyA","title":"כדור הארץ, הבית שלנו · מסע מוזיקלי מהחלל","en":"Cosmic Cycles: Earth, Our Home","who":"NASA Goddard · Cosmic Cycles","phase":"🌍 כדור הארץ מן החלל","note":"אורות לילה, סערות, עננים ונופי ארץ בצילומי תחנת החלל ולוויינים — בליווי מוזיקה.","ease":0,"quiet":true,"duration":"קטע מוזיקלי","bridge":"מהשמש שמאירה את מערכת השמש נגיע לעולם שבו הופיעו מים וחיים."}],["f-2F3QD_UyA",{"id":"l2sNqMjyIVQ","title":"כדור הארץ כיצירת אמנות · נופים מלמעלה","en":"Cosmic Cycles: Earth as Art","who":"NASA Goddard · Cosmic Cycles","phase":"🎨 כדור הארץ · נופים וצבעים","note":"הרים, נהרות, מדבריות ושדות נראים כמו ציורים בתצלומי Landsat המלווים במוזיקה.","ease":0,"quiet":true,"duration":"קטע מוזיקלי","bridge":"ממבט כולל על כדור הארץ נרד אל הצורות והצבעים של פני השטח שלו."}],["Ilifg26TZrI",{"id":"WbmZhMZcrWE","title":"פנטזיה פלנטרית · מסע בין עולמות","en":"Cosmic Cycles: Planetary Fantasia","who":"NASA Goddard · Cosmic Cycles","phase":"🪐 עולמות מערכת השמש","note":"מוזיקה ומראות קולנועיים של מאדים, צדק, שבתאי, נוגה וירחיהם.","ease":0,"quiet":true,"duration":"קטע מוזיקלי","bridge":"לאחר שהקפנו את הירח, נצא לראות את שאר העולמות של מערכת השמש."}],["HTHj_pvEYYE",{"id":"2YwH3v_EJxY","title":"נוסעים בין אסטרואידים · מסעות החלליות","en":"Cosmic Cycles: Travelers","who":"NASA Goddard · Cosmic Cycles","phase":"☄️ אסטרואידים, שביטים וחלליות","note":"מסע מוזיקלי בין אסטרואידים עתיקים והמשימות DART ו־OSIRIS-REx.","ease":0,"quiet":true,"duration":"קטע מוזיקלי","bridge":"מהעולמות הרחוקים נחזור לגופים הקטנים והעתיקים שנודדים ביניהם."}],["Kp9W-_W8rCM",{"id":"0wtLrlIKvJE","title":"קסם העור של הדיונונים · צבע שמשתנה","en":"You're Not Hallucinating. That's Just Squid Skin. | Deep Look","who":"KQED · Deep Look","phase":"🦑 אור והסוואה בטבע","note":"צילום תקריב של דיונונים שמשנים את מראה עורם כדי להיעלם כמעט לגמרי במים.","ease":0,"quiet":false,"duration":"כ־3 דקות","bridge":"ראינו כיצד זיקית משנה את צבעיה; גם הדיונון מתאים את האור שחוזר מן העור שלו."}]];
  const bridges={"nr5Pj6GQL2o":"אחרי הנופים של כדור הארץ מלמעלה נתקרב לעולם הקרוב שמקיף אותו: הירח.","GUqsH5y1j1M":"אחרי הסיור בין כוכבי הלכת, ננחת באמת על אחד מהם: מאדים.","jOb2DQWvDvc":"ליווינו חלליות אל אסטרואידים; כעת נגלה כיצד עוקבים אחרי גופים שמתקרבים לכדור הארץ.","Q3CtGoqz3ww":"הדיונון מסתווה בשינוי החזר האור, וסוסוני הים הזעירים מתחבאים בדרך אחרת בין האלמוגים."};
  const currentId=videos[current]?.id;
  for(const [after,v] of additions){
    if(videos.some(x=>x.id===v.id))continue;
    const index=videos.findIndex(x=>x.id===after);
    if(index!==-1)videos.splice(index+1,0,v);
  }
  for(const [id,bridge] of Object.entries(bridges)){
    const v=videos.find(x=>x.id===id);if(v)v.bridge=bridge;
  }
  const still=videos.findIndex(x=>x.id===currentId);
  if(still>=0)current=still;
  page=Math.max(0,Math.floor(Math.max(0,filtered().indexOf(current))/PAGE_SIZE));
  render();
})();
