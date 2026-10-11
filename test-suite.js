/* ==========================================================================
   test-suite.js — מחולל טקסט בדיקה אולטימטיבי + דוח עימוד מפורט
   ========================================================================== */

(function() {
'use strict';

// ==========================================================================
// מילון מילים ליצירת פסקאות
// ==========================================================================
const W = ['השבת','המצווה','המעשה','הגדר','הרשות','ההוצאה','המלאכה','האיסור','הקדוש','החילול','השביתה','המנוחה','הנפישה','הזכירה','השמירה','היום','הזמן','המקום','החפץ','האדם','הכח','הפעולה','התוצאה','העושה','הנעשה','המציאות','ההויה','החלל','הכלל','הפרט','הצורה','החומר','השינוי','ההמצאה','העילוי','היצירה','הבריאה','התחלה','הסוף','האמצע','הקודם','המאוחר','הראשון','השני','השלישי','הכרחי','אפשרי','מחויב','מותר','אסור','חיובי','שלילי','מעורב','פשוט','מורכב','כללי','פרטי','מיוחד','סתמי','מפורש','רמוז','מבואר','מקוצר','מורחב','מדויק','משוער','קבוע','משתנה','תדיר','מזומן','תמידי','זמני','עקרוני','מעשי','ובזה','ובכך','ולכן','ואכן','והנה','וביאור','ומכח','ומצד','שהרי','שכן','שהוא','שזה','שאין','שיש','שמה','שכל','ביחס','בפני','כולל','מחמת','כשיש','כשאין','כאשר','בפשטות','ברומו','שלא','כדי','בעיקר','בפרט','בכלל','בייחוד','בסתימה','במציאות','בגדרי','בהגדרה'];

function rint(n) { return Math.floor(Math.random() * n); }
function rw() { return W[rint(W.length)]; }

function makePara(wordCount) {
    if (wordCount <= 0) wordCount = 1;
    let parts = [], rem = wordCount;
    while (rem > 0) {
        let chunk = Math.min(rem, 6 + rint(8));
        let sentence = [];
        for (let i = 0; i < chunk; i++) sentence.push(rw());
        parts.push(sentence.join(' ') + '.');
        rem -= chunk;
    }
    return parts.join(' ');
}

// פסקה באורך שורה אחת (~18 מילים)
const ONE_LINE = () => makePara(15 + rint(6));
// פסקה באורך שורות (n שורות × ~18 מילים)
const LINES = (n) => makePara(n * 16 + rint(8));

// ==========================================================================
// 1. מחולל טקסט בדיקה — כיסוי כל השילובים
// ==========================================================================
// מטריצת שילובים:
//   סוג עמוד: תחילת פרק | אמצע פרק | סוף פרק | עמוד עם H3 באמצע
//   אורך פסקה: 1 | 2 | 3 | 1-שורה | 2-שורות | 3 | 5 | 10 | 20 | 50 | מלא-עמוד
//   כותרת: אין | H4 | H5 | H6 | H4+H5 | H4+H5+H6
//   H7: אין | 1 קצר | 1 ארוך | 2 | 3 | 5
// מייצר ~300+ עמודים

function generateTestText() {
    let L = [];

    // --- מטא-דאטא ---
    L.push('שם הספר - טקסט בדיקה אולטימטיבי');
    L.push('נושא - בדיקת עימוד');
    L.push('נושא מפורט - כיסוי כל מקרי העימוד');
    L.push('פרטי מהדורא - גרסת בדיקה');
    L.push('שם המחבר - מערכת עימוד');
    L.push('מקום ושנת הוצאה - ירושלים | תשפ"ו');
    L.push('שמירת זכויות - כל הזכויות הפקר');
    L.push('פרטי הוצאה לאור - הוצאת בדיקה');
    L.push('פרטי קשר - 000-0000000');
    L.push('פרטים נוספים - טקסט לבדיקה בלבד');
    L.push('');

    // עמודי הגדרה לרישיון הכולל
    L.push('כותרת 1 מספר 1 - הגדרות היסוד - עקרונות - כללים - פרטים - שילובים');
    let chapNum = 1;
    let simanNum = 1;
    let h3Num = 1;
    let h4Num = 1;
    let h5Num = 1;
    let h6Num = 1;
    let h7Num = 1;

    // --- פרק 1: תחילת פרק — כל שילובי אורך פסקה ---
    L.push('כותרת 0 מספר 1 - מבוא כללי');
    L.push(makePara(200)); // מבוא ארוך
    L.push('');

    L.push(`כותרת 2 מספר ${simanNum++} - תחילת פרק - אורכי פסקה`);
    L.push(`כותרת 3 מספר ${h3Num++} - אורך פסקה מ-1 ועד עמוד מלא`);

    // כל אורך פסקה אפשרי
    const paraLengths = [1, 2, 3, 4, 5, 10, 15, 20, 30, 50, 75, 100, 150, 200, 300, 500, 800];
    paraLengths.forEach(n => {
        L.push(`כותרת 7 מספר ${h7Num++} - פסקה באורך ${n} מילים`);
        L.push(makePara(n));
    });

    L.push('');

    // --- פרק 2: אמצע פרק — כל שילובי כותרות 4/5/6 ---
    L.push(`כותרת 2 מספר ${simanNum++} - אמצע פרק - שילובי כותרות משנה`);
    L.push(`כותרת 3 מספר ${h3Num++} - כותרות משנה - כל השילובים`);

    // H4 לבד
    L.push(`כותרת 4 מספר ${h4Num++} - H4 בלבד`);
    L.push(LINES(5));
    L.push(LINES(10));

    // H5 לבד
    L.push(`כותרת 5 מספר ${h5Num++} - H5 בלבד`);
    L.push(LINES(3));
    L.push(LINES(7));

    // H6 לבד
    L.push(`כותרת 6 מספר ${h6Num++} - H6 בלבד`);
    L.push(LINES(2));
    L.push(LINES(5));

    // H4 + H5
    L.push(`כותרת 4 מספר ${h4Num++} - H4 ואחריו H5`);
    L.push(LINES(4));
    L.push(`כותרת 5 מספר ${h5Num++} - H5 אחרי H4`);
    L.push(LINES(6));

    // H4 + H5 + H6
    L.push(`כותרת 4 מספר ${h4Num++} - H4 ואחריו H5 ו-H6`);
    L.push(LINES(3));
    L.push(`כותרת 5 מספר ${h5Num++} - H5 אחרי H4`);
    L.push(LINES(3));
    L.push(`כותרת 6 מספר ${h6Num++} - H6 אחרי H5`);
    L.push(LINES(3));

    // H4 בתחילת טור (אחרי H3)
    L.push(`כותרת 3 מספר ${h3Num++} - H3 ואחריו H4 מיד`);
    L.push(`כותרת 4 מספר ${h4Num++} - H4 מיד אחרי H3`);
    L.push(LINES(8));

    // H4 + H4 (שתי כותרות H4 ברצף)
    L.push(`כותרת 4 מספר ${h4Num++} - H4 ראשון`);
    L.push(LINES(4));
    L.push(`כותרת 4 מספר ${h4Num++} - H4 שני ברצף`);
    L.push(LINES(4));

    // H5 + H5 + H5 (שלוש כותרות H5 ברצף)
    L.push(`כותרת 5 מספר ${h5Num++} - H5 ראשון`);
    L.push(LINES(3));
    L.push(`כותרת 5 מספר ${h5Num++} - H5 שני`);
    L.push(LINES(3));
    L.push(`כותרת 5 מספר ${h5Num++} - H5 שלישי`);
    L.push(LINES(3));

    L.push('');

    // --- פרק 3: סוף פרק — שילובי H7 ---
    L.push(`כותרת 2 מספר ${simanNum++} - סוף פרק - הערות שוליים`);
    L.push(`כותרת 3 מספר ${h3Num++} - הערות שוליים - כל השילובים`);

    // H7: 1 קצר
    L.push(`כותרת 7 מספר ${h7Num++} - הערה קצרה - הגדרת המושג`);
    L.push(LINES(5));

    // H7: 1 ארוך
    L.push(`כותרת 7 מספר ${h7Num++} - הערה ארוכה - ביאור מפורט של הגדרה זו ומשמעויותיה ביחס לכלל העניין ולפרטיו`);
    L.push(LINES(5));

    // H7: 2 ברצף
    L.push(`כותרת 7 מספר ${h7Num++} - הערה ראשונה`);
    L.push(`כותרת 7 מספר ${h7Num++} - הערה שניה ברצף`);
    L.push(LINES(8));

    // H7: 3 ברצף
    L.push(`כותרת 7 מספר ${h7Num++} - הערה 1 מתוך 3`);
    L.push(`כותרת 7 מספר ${h7Num++} - הערה 2 מתוך 3`);
    L.push(`כותרת 7 מספר ${h7Num++} - הערה 3 מתוך 3`);
    L.push(LINES(8));

    // H7: 5 ברצף
    for (let i = 0; i < 5; i++) {
        L.push(`כותרת 7 מספר ${h7Num++} - הערה ${i+1} מתוך 5 - משמעות ${rw()} ו${rw()}`);
    }
    L.push(LINES(10));

    // H7: עם פסקה קצרה (1 שורה)
    L.push(`כותרת 7 מספר ${h7Num++} - הערה עם פסקה קצרה`);
    L.push(ONE_LINE());

    // H7: עם פסקה ארוכה
    L.push(`כותרת 7 מספר ${h7Num++} - הערה עם פסקה ארוכה`);
    L.push(LINES(30));

    // H7: עם H4
    L.push(`כותרת 7 מספר ${h7Num++} - הערה עם H4`);
    L.push(`כותרת 4 מספר ${h4Num++} - H4 אחרי H7`);
    L.push(LINES(8));

    L.push('');

    // --- פרק 4: עמוד עם H3 באמצעו ---
    L.push(`כותרת 2 מספר ${simanNum++} - H3 באמצע עמוד`);
    L.push(`כותרת 3 מספר ${h3Num++} - H3 ראשון בעמוד`);
    L.push(LINES(15));
    L.push(`כותרת 3 מספר ${h3Num++} - H3 שני באמצע העמוד`);
    L.push(LINES(15));
    L.push(`כותרת 3 מספר ${h3Num++} - H3 שלישי`);
    L.push(LINES(15));

    L.push('');

    // --- פרק 5: שילוב כל האתגרים ---
    L.push(`כותרת 2 מספר ${simanNum++} - שילוב כל האתגרים`);

    // חלק א': פסקה ענקית + H3 + H4 + H7
    L.push(`כותרת 3 מספר ${h3Num++} - פסקה ענקית ואחריה כותרות`);
    L.push(makePara(600));
    L.push(`כותרת 7 מספר ${h7Num++} - הערה אחרי פסקה ענקית`);
    L.push(`כותרת 4 מספר ${h4Num++} - H4 אחרי הערה`);
    L.push(LINES(8));

    // חלק ב': רצף פסקאות קצרות מאוד (1-3 מילים) — אלמנות/יתוממות
    L.push(`כותרת 3 מספר ${h3Num++} - פסקאות קצרות קיצוניות`);
    for (let i = 0; i < 15; i++) {
        L.push(makePara(1 + (i % 4)));
    }

    // חלק ג': רצף כותרות ללא פסקאות ביניהן
    L.push(`כותרת 3 מספר ${h3Num++} - כותרות ברצף`);
    L.push(`כותרת 4 מספר ${h4Num++} - H4 א`);
    L.push(`כותרת 4 מספר ${h4Num++} - H4 ב`);
    L.push(`כותרת 5 מספר ${h5Num++} - H5 א`);
    L.push(`כותרת 5 מספר ${h5Num++} - H5 ב`);
    L.push(`כותרת 6 מספר ${h6Num++} - H6 א`);
    L.push(LINES(5));

    // חלק ד': שילוב כל האורכים עם כל הכותרות וכל ההערות
    L.push(`כותרת 3 מספר ${h3Num++} - שילוב מלא`);
    const combos = [
        {para: 5, h4: true, h5: false, h6: false, h7: 0},
        {para: 10, h4: true, h5: true, h6: false, h7: 1},
        {para: 20, h4: true, h5: true, h6: true, h7: 1},
        {para: 30, h4: false, h5: true, h6: false, h7: 2},
        {para: 50, h4: true, h5: false, h6: true, h7: 0},
        {para: 100, h4: false, h5: false, h6: false, h7: 3},
        {para: 150, h4: true, h5: true, h6: false, h7: 1},
        {para: 200, h4: false, h5: false, h6: false, h7: 0},
        {para: 300, h4: true, h5: false, h6: false, h7: 2},
        {para: 500, h4: false, h5: false, h6: false, h7: 0},
    ];
    combos.forEach(c => {
        if (c.h7 > 0) {
            for (let j = 0; j < c.h7; j++) {
                L.push(`כותרת 7 מספר ${h7Num++} - הערה ${j+1} - ${rw()} ו${rw()}`);
            }
        }
        if (c.h4) L.push(`כותרת 4 מספר ${h4Num++} - H4 עם פסקה ${c.para}`);
        if (c.h5) L.push(`כותרת 5 מספר ${h5Num++} - H5 עם פסקה ${c.para}`);
        if (c.h6) L.push(`כותרת 6 מספר ${h6Num++} - H6 עם פסקה ${c.para}`);
        L.push(makePara(c.para));
    });

    // חלק ה': חזרה על כל השילובים עם טקסט שונה (להגדלת נפח ל-300+ עמודים)
    L.push(`כותרת 3 מספר ${h3Num++} - חזרות - כל השילובים`);
    for (let round = 0; round < 80; round++) {
        L.push(`כותרת 4 מספר ${h4Num++} - סבב ${round+1} - H4`);
        L.push(`כותרת 7 מספר ${h7Num++} - הערה לסבב ${round+1}`);
        L.push(makePara(50 + round * 20));
        L.push(`כותרת 5 מספר ${h5Num++} - H5 סבב ${round+1}`);
        L.push(makePara(30 + round * 10));
        L.push(`כותרת 6 מספר ${h6Num++} - H6 סבב ${round+1}`);
        L.push(makePara(20 + round * 5));
        L.push(`כותרת 7 מספר ${h7Num++} - הערה נוספת לסבב ${round+1} - ${rw()} ${rw()} ${rw()}`);
        L.push(makePara(80 + round * 15));
    }

    // חלק ו': פסקאות באורך שורה אחת עם כותרות (בדיקת אלמנות)
    L.push(`כותרת 3 מספר ${h3Num++} - פסקאות שורה אחת`);
    for (let i = 0; i < 25; i++) {
        L.push(`כותרת 7 מספר ${h7Num++} - הערה קצרצרה ${i+1}`);
        L.push(ONE_LINE());
    }

    // חלק ז': פסקה באורך עמוד מלא
    L.push(`כותרת 3 מספר ${h3Num++} - פסקה באורך עמוד מלא`);
    L.push(makePara(900));

    // חלק ח': שתי פסקאות ענקיות זו אחר זו
    L.push(`כותרת 3 מספר ${h3Num++} - שתי פסקאות ענקיות`);
    L.push(makePara(700));
    L.push(makePara(700));

    // חלק ט': רצף H7 רבים עם פסקאות קצרות
    L.push(`כותרת 3 מספר ${h3Num++} - H7 רבים עם פסקאות קצרות`);
    for (let i = 0; i < 20; i++) {
        L.push(`כותרת 7 מספר ${h7Num++} - הערה ${i+1} מתוך 20 - ${rw()} ${rw()} ${rw()}`);
        L.push(makePara(5 + (i % 8) * 3));
    }

    // חלק י': סיכום — כל סוגי הפסקאות ברצף אחד
    L.push(`כותרת 2 מספר ${simanNum++} - סיכום - כל אורכי הפסקה`);
    L.push(`כותרת 3 מספר ${h3Num++} - סיכום אורכים`);
    [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610].forEach(n => {
        L.push(`כותרת 7 מספר ${h7Num++} - פסקה באורך ${n} (פיבונאצ'י)`);
        L.push(makePara(n));
    });

    // סיום
    L.push(`כותרת 2 מספר ${simanNum++} - סיום המסמך`);
    L.push(makePara(100));
    L.push(makePara(50));
    L.push(makePara(10));
    L.push(makePara(1));

    return L.join('\n');
}

// ==========================================================================
// 2. דוח עימוד מפורט
// ==========================================================================
function generateLayoutReport() {
    const pages = document.querySelectorAll('#book-container .a4-page');
    if (pages.length === 0) { alert('אין עמודים מעומדים.'); return; }

    const S = { totalPages: pages.length, totalBlocks: 0, imbalanced: 0, sparse: 0, sparseCut: 0, adjusted: 0, startMismatch: 0, headingsDeferred: 0, tightenRunts: 0 };
    const pageData = [];

    pages.forEach((pg, pIdx) => {
        const pNum = pg.querySelector('.page-number-footer')?.textContent?.trim() || '';
        const role = pg.className.match(/page-role-(\S+)/)?.[1] || 'regular';
        const bf = pg.querySelector('.page-body-flow');
        const availH = bf ? bf.clientHeight : null;

        const blocks = pg.querySelectorAll('.block-2col, .block-h3-span');
        const bInfo = [];
        blocks.forEach((b, bi) => {
            if (b.classList.contains('block-h3-span')) {
                bInfo.push({ t: 'h3', i: bi, text: (b.textContent || '').slice(0, 35) });
                return;
            }
            const r = b.querySelector('.right-col'), l = b.querySelector('.left-col');
            if (!r || !l) return;
            S.totalBlocks++;
            const rH = r.scrollHeight, lH = l.scrollHeight, d = Math.abs(rH - lH);
            if (d > 5) S.imbalanced++;
            const rP = r.querySelectorAll('p'), lP = l.querySelectorAll('p');
            [...rP, ...lP].forEach(p => {
                if (p.style.marginBottom || p.style.lineHeight || p.style.wordSpacing || p.style.letterSpacing) S.adjusted++;
                if (p.style.letterSpacing) S.tightenRunts++;
            });
            const rF = r.firstElementChild, lF = l.firstElementChild;
            let sm = null;
            if (rF && lF && Math.abs(rF.offsetTop - lF.offsetTop) > 2) { sm = Math.abs(rF.offsetTop - lF.offsetTop); S.startMismatch++; }
            // Sparse line check — בודק גם שורה אחרונה של פסקה רגילה (p-end)
            // וגם שורת חיתוך של פסקה חתוכה (p-cut) — כי זו "שורת אמצע פסקה" שיכולה להיות דלילה
            const checkSparse = (col, colName) => {
                const ps = col.querySelectorAll('p'); if (!ps.length) return;
                const so = { fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'), fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'), lineHeight: getComputedStyle(document.documentElement).getPropertyValue('--line-height-body') || '1.34' };
                const cw = col.offsetWidth - 40;
                ps.forEach((p, pi) => {
                    const raw = p.getAttribute('data-raw-text') || p.textContent || '';
                    if (!raw.trim() || typeof getLinesFromParagraph !== 'function') return;
                    const info = getLinesFromParagraph(raw, cw, so, false);
                    if (!info.lines?.length) return;
                    const lastLine = info.lines[info.lines.length - 1];
                    const words = lastLine.split(/\s+/).filter(x => x.length > 0).length;
                    if (words > 0 && words <= 4) {
                        S.sparse++;
                        // סמן אם זו פסקה חתוכה (p-cut) — שורת אמצע פסקה דלילה
                        if (p.classList.contains('p-cut')) {
                            S.sparseCut++;
                        }
                    }
                });
            };
            checkSparse(r, 'R'); checkSparse(l, 'L');
            bInfo.push({ t: '2c', i: bi, rH, lH, d, ok: d <= 5, rP: rP.length, lP: lP.length, rF: rF ? rF.tagName + '.' + (rF.className.slice(0,20)) : '—', lF: lF ? lF.tagName + '.' + (lF.className.slice(0,20)) : '—', sm });
        });
        pageData.push({ idx: pIdx + 1, pNum, role, availH, blocks: bInfo });
    });

    // HTML report
    let h = `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8"><title>דוח עימוד</title><style>
body{font-family:monospace;padding:16px;background:#0f172a;color:#e2e8f0;font-size:9pt}
h1{color:#38bdf8;border-bottom:2px solid #334155;padding-bottom:8px}
.sum{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:16px 0}
.sum div{background:#1e293b;padding:10px;border-radius:6px;text-align:center}
.sum .n{font-size:20pt;font-weight:bold}
.sum .l{font-size:7pt;color:#94a3b8}
.ok{color:#10b981}.bad{color:#ef4444}.warn{color:#f59e0b}
table{width:100%;border-collapse:collapse;font-size:7.5pt}
th{background:#334155;padding:4px;text-align:center;position:sticky;top:0}
td{padding:3px 4px;border-bottom:1px solid #1e293b;text-align:center}
tr.h3row td{color:#38bdf8;text-align:right}
tr.bad{background:rgba(239,68,68,.08)}
.btn{background:#2563eb;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;margin-bottom:12px}
</style></head><body>`;
    h += '<h1>דוח עימוד מפורט</h1>';
    h += '<button class="btn" onclick="window.print()">🖨️ הדפס / שמור כ-PDF</button>';
    h += `<div class="sum">
        <div><div class="n">${S.totalPages}</div><div class="l">עמודים</div></div>
        <div><div class="n ${S.imbalanced===0?'ok':'bad'}">${S.imbalanced}</div><div class="l">לא מאוזן</div></div>
        <div><div class="n">${S.totalBlocks}</div><div class="l">בלוקים</div></div>
        <div><div class="n ${S.sparse<20?'ok':'warn'}">${S.sparse}</div><div class="l">דלילות סה"כ</div></div>
        <div><div class="n ${S.sparseCut===0?'ok':'bad'}">${S.sparseCut}</div><div class="l">דלילות p-cut (אמצע פסקה)</div></div>
        <div><div class="n">${S.adjusted}</div><div class="l">מותאמות</div></div>
        <div><div class="n">${S.tightenRunts}</div><div class="l">tightenRunts</div></div>
        <div><div class="n ${S.startMismatch===0?'ok':'bad'}">${S.startMismatch}</div><div class="l">חוסר תחילת טור</div></div>
        <div><div class="n">${S.headingsDeferred}</div><div class="l">כותרות נדחו</div></div>
    </div>`;
    h += '<table><thead><tr><th>עמוד</th><th>מספר</th><th>תפקיד</th><th>בלוק</th><th>R</th><th>L</th><th>Δ</th><th>סטטוס</th><th>R-P</th><th>L-P</th><th>R-ראשון</th><th>L-ראשון</th><th>תחילת טור</th></tr></thead><tbody>';
    pageData.forEach(p => {
        p.blocks.forEach(b => {
            if (b.t === 'h3') {
                h += `<tr class="h3row"><td>${p.idx}</td><td>${p.pNum}</td><td colspan="12">⬩ H3: ${b.text}</td></tr>`;
            } else {
                const cls = b.d > 5 ? 'bad' : '';
                const st = b.ok ? '<span class="ok">✓</span>' : `<span class="bad">${b.d}px</span>`;
                const sm = b.sm != null ? `<span class="bad">${b.sm}px</span>` : '<span class="ok">✓</span>';
                h += `<tr class="${cls}"><td>${p.idx}</td><td>${p.pNum}</td><td>${p.role}</td><td>#${b.i}</td><td>${b.rH}</td><td>${b.lH}</td><td>${b.d}</td><td>${st}</td><td>${b.rP}</td><td>${b.lP}</td><td>${b.rF}</td><td>${b.lF}</td><td>${sm}</td></tr>`;
            }
        });
    });
    h += '</tbody></table></body></html>';

    const blob = new Blob([h], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// ==========================================================================
// 3. כפתורים
// ==========================================================================
function initTestSuiteButtons() {
    const bar = document.querySelector('.text-actions-bar');
    if (!bar) return;
    const btnTest = document.createElement('button');
    btnTest.type = 'button';
    btnTest.className = 'btn-tool btn-secondary';
    btnTest.innerHTML = '🧪 טקסט בדיקה';
    btnTest.style.flex = '0.7';
    btnTest.title = 'הזרקת טקסט בדיקה מקיף (~300 עמודים)';
    btnTest.addEventListener('click', () => {
        const text = generateTestText();
        if (typeof renderEditorContent === 'function') renderEditorContent(text, []);
        setTimeout(() => { if (typeof typesetDocument === 'function') typesetDocument(); }, 500);
    });
    bar.insertBefore(btnTest, bar.firstChild);

    const btnReport = document.createElement('button');
    btnReport.type = 'button';
    btnReport.className = 'btn-tool btn-secondary';
    btnReport.innerHTML = '📊 דוח עימוד';
    btnReport.style.flex = '0.7';
    btnReport.title = 'הפקת דוח מפורט על מצב העימוד';
    btnReport.addEventListener('click', generateLayoutReport);
    bar.insertBefore(btnReport, btnTest.nextSibling);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTestSuiteButtons);
else initTestSuiteButtons();

window.generateTestText = generateTestText;
window.generateLayoutReport = generateLayoutReport;
})();
