// טוענים את הפונקציות האמיתיות מתוך typesetter.js עצמו (לא עותק) ובודקים אותן.
// שימוש: node verify_cut.js [נתיב ל-typesetter.js]
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || 'typesetter.js', 'utf8');
const grab = name => { const m = src.match(new RegExp('^function ' + name + '\\([\\s\\S]*?^\\}\\n', 'm')); if (!m) throw new Error(name + ' not found'); return m[0]; };
const ctx = {}; vm.createContext(ctx);
vm.runInContext(grab('decideParagraphCut') + '\n' + grab('stripTrailingHeadings'), ctx);
const { decideParagraphCut } = ctx;

let total = 0, failures = [];
const fail = (msg, a) => failures.push(msg + '  ' + JSON.stringify(a));
for (let N = 1; N <= 14; N++) for (let F = 0; F <= N; F++)
  for (const pc of [true, false]) for (const W of [true, false]) for (const O of [true, false]) {
    total++;
    const a = { N, F, pageHasContent: pc, W, O };
    const r = decideParagraphCut(N, F, pc, W, O);
    // 1. לעולם לא מציבים יותר משנכנס, פרט לכפיית שורה אחת בראש עמוד ריק (כלל מכוון - אחרת העמוד נשאר ריק)
    if (r.count > Math.max(F, pc ? 0 : 1)) fail('הוצבו יותר שורות ממה שנכנס', { ...a, r });
    if (!pc && F === 0 && !(r.count === 1 && !r.pushWhole)) fail('ראש עמוד שבו לא נכנס דבר: חייבת להיכפות שורה אחת', { ...a, r });
    // 2. אם הכול נכנס - מציבים הכול
    if (F >= N && !(r.count === N && !r.pushWhole)) fail('הכול נכנס אך נחתך', { ...a, r });
    // 3. דחיית כל הפסקה אסורה בראש עמוד (אחרת לולאה אינסופית / עמוד ריק)
    if (!pc && r.pushWhole) fail('דחייה בראש עמוד', { ...a, r });
    // 4. מחוץ לדחייה - תמיד מציבים לפחות שורה אחת (התקדמות מובטחת)
    if (!r.pushWhole && r.count < 1) fail('אפס שורות ללא דחייה', { ...a, r });
    // 5. הכלל המרכזי: כשיש תוכן בעמוד - אין שורה בודדת בשום צד של חיתוך
    if (pc && !r.pushWhole && r.count < N) {
      if (W && r.count === 1) fail('widow: שורה בודדת בתחתית', { ...a, r });
      if (O && N - r.count === 1) fail('orphan: שורה בודדת עוברת', { ...a, r });
    }
    // 6. דחייה מותרת רק כשבאמת אי אפשר לחתוך חוקית (לא דוחים סתם)
    if (r.pushWhole && F >= N) fail('דחייה מיותרת', { ...a, r });
  }
console.log('שילובים שנבדקו:', total, '| כשלים:', failures.length);
failures.slice(0, 6).forEach(f => console.log('  ', f));

// דוגמאות קריטיות, מודפסות במפורש
const show = (N, F, W, O) => { const r = decideParagraphCut(N, F, true, W, O); return `N=${N} F=${F} W=${W} O=${O} => ${r.pushWhole ? 'דוחים את כל הפסקה' : 'נשארות ' + r.count + ', עוברות ' + (N - r.count)}`; };
console.log('\nהמקרה שנכשל בקוד הישן:'); console.log('  ' + show(3, 2, true, true));
console.log('מקרים רגילים:'); [[10,7],[5,4],[4,2],[2,1],[6,1]].forEach(([N,F]) => console.log('  ' + show(N, F, true, true)));
console.log('רק widow דלוק:  ' + show(3, 2, true, false) + ' | רק orphan דלוק: ' + show(3, 2, false, true));
process.exit(failures.length ? 1 : 0);
