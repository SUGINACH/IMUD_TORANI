/* ==========================================================================
   test-suite.js — מחולל טקסט בדיקה + דוח עימוד מועשר (v10)
   ==========================================================================
   v10 (2026-10-12): נוספו בדיקות ויזואליות מקיפות:
   - DOM: overflow, overlap, יתום/אלמנה, כותרת בתחתית, p-cut חד-שורתי, טור ריק
   - גופן: tofu/fallback, document.fonts.check, canvas
   - RTL/עברית: מקף, גרש, ניקוד, אות קידומת
   - עימוד מתקדם: rivers, ws רחב, tightenRunts, 3+ מקפים
   ========================================================================== */

(function() {
'use strict';

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

const ONE_LINE = () => makePara(15 + rint(6));
const LINES = (n) => makePara(n * 16 + rint(8));

function generateTestText() {
    let L = [];
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
    L.push('כותרת 1 מספר 1 - הגדרות היסוד - עקרונות - כללים - פרטים - שילובים');
    let simanNum = 1, h3Num = 1, h4Num = 1, h5Num = 1, h6Num = 1, h7Num = 1;
    L.push('כותרת 0 מספר 1 - מבוא כללי');
    L.push(makePara(200));
    L.push('');
    L.push(`כותרת 2 מספר ${simanNum++} - תחילת פרק - אורכי פסקה`);
    L.push(`כותרת 3 מספר ${h3Num++} - אורך פסקה מ-1 ועד עמוד מלא`);
    [1, 2, 3, 4, 5, 10, 15, 20, 30, 50, 75, 100, 150, 200, 300, 500, 800].forEach(n => {
        L.push(`כותרת 7 מספר ${h7Num++} - פסקה באורך ${n} מילים`);
        L.push(makePara(n));
    });
    L.push('');
    L.push(`כותרת 2 מספר ${simanNum++} - אמצע פרק - שילובי כותרות משנה`);
    L.push(`כותרת 3 מספר ${h3Num++} - כותרות משנה - כל השילובים`);
    L.push(`כותרת 4 מספר ${h4Num++} - H4 בלבד`);
    L.push(LINES(5)); L.push(LINES(10));
    L.push(`כותרת 5 מספר ${h5Num++} - H5 בלבד`);
    L.push(LINES(3)); L.push(LINES(7));
    L.push(`כותרת 6 מספר ${h6Num++} - H6 בלבד`);
    L.push(LINES(2)); L.push(LINES(5));
    L.push(`כותרת 4 מספר ${h4Num++} - H4 ואחריו H5`);
    L.push(LINES(4));
    L.push(`כותרת 5 מספר ${h5Num++} - H5 אחרי H4`);
    L.push(LINES(6));
    L.push(`כותרת 3 מספר ${h3Num++} - H3 ואחריו H4 מיד`);
    L.push(`כותרת 4 מספר ${h4Num++} - H4 מיד אחרי H3`);
    L.push(LINES(8));
    L.push(`כותרת 4 מספר ${h4Num++} - H4 ראשון`);
    L.push(LINES(4));
    L.push(`כותרת 4 מספר ${h4Num++} - H4 שני ברצף`);
    L.push(LINES(4));
    L.push(`כותרת 5 מספר ${h5Num++} - H5 ראשון`);
    L.push(LINES(3));
    L.push(`כותרת 5 מספר ${h5Num++} - H5 שני`);
    L.push(LINES(3));
    L.push(`כותרת 5 מספר ${h5Num++} - H5 שלישי`);
    L.push(LINES(3));
    L.push('');
    L.push(`כותרת 2 מספר ${simanNum++} - סוף פרק - הערות שוליים`);
    L.push(`כותרת 3 מספר ${h3Num++} - הערות שוליים - כל השילובים`);
    L.push(`כותרת 7 מספר ${h7Num++} - הערה קצרה - הגדרת המושג`);
    L.push(LINES(5));
    L.push(`כותרת 7 מספר ${h7Num++} - הערה ארוכה - ביאור מפורט`);
    L.push(LINES(5));
    L.push(`כותרת 7 מספר ${h7Num++} - הערה ראשונה`);
    L.push(`כותרת 7 מספר ${h7Num++} - הערה שניה ברצף`);
    L.push(LINES(8));
    for (let i = 0; i < 5; i++) L.push(`כותרת 7 מספר ${h7Num++} - הערה ${i+1} מתוך 5`);
    L.push(LINES(10));
    L.push(`כותרת 7 מספר ${h7Num++} - הערה עם פסקה קצרה`);
    L.push(ONE_LINE());
    L.push(`כותרת 7 מספר ${h7Num++} - הערה עם פסקה ארוכה`);
    L.push(LINES(30));
    L.push(`כותרת 7 מספר ${h7Num++} - הערה עם H4`);
    L.push(`כותרת 4 מספר ${h4Num++} - H4 אחרי H7`);
    L.push(LINES(8));
    L.push('');
    L.push(`כותרת 2 מספר ${simanNum++} - H3 באמצע עמוד`);
    L.push(`כותרת 3 מספר ${h3Num++} - H3 ראשון בעמוד`);
    L.push(LINES(15));
    L.push(`כותרת 3 מספר ${h3Num++} - H3 שני באמצע העמוד`);
    L.push(LINES(15));
    L.push(`כותרת 3 מספר ${h3Num++} - H3 שלישי`);
    L.push(LINES(15));
    L.push('');
    L.push(`כותרת 2 מספר ${simanNum++} - שילוב כל האתגרים`);
    L.push(`כותרת 3 מספר ${h3Num++} - פסקה ענקית ואחריה כותרות`);
    L.push(makePara(600));
    L.push(`כותרת 7 מספר ${h7Num++} - הערה אחרי פסקה ענקית`);
    L.push(`כותרת 4 מספר ${h4Num++} - H4 אחרי הערה`);
    L.push(LINES(8));
    L.push(`כותרת 3 מספר ${h3Num++} - פסקאות קצרות קיצוניות`);
    for (let i = 0; i < 15; i++) L.push(makePara(1 + (i % 4)));
    L.push(`כותרת 3 מספר ${h3Num++} - כותרות ברצף`);
    L.push(`כותרת 4 מספר ${h4Num++} - H4 א`);
    L.push(`כותרת 4 מספר ${h4Num++} - H4 ב`);
    L.push(`כותרת 5 מספר ${h5Num++} - H5 א`);
    L.push(`כותרת 5 מספר ${h5Num++} - H5 ב`);
    L.push(`כותרת 6 מספר ${h6Num++} - H6 א`);
    L.push(LINES(5));
    for (let round = 0; round < 80; round++) {
        L.push(`כותרת 4 מספר ${h4Num++} - סבב ${round+1} - H4`);
        L.push(`כותרת 7 מספר ${h7Num++} - הערה לסבב ${round+1}`);
        L.push(makePara(50 + round * 20));
        L.push(`כותרת 5 מספר ${h5Num++} - H5 סבב ${round+1}`);
        L.push(makePara(30 + round * 10));
        L.push(`כותרת 6 מספר ${h6Num++} - H6 סבב ${round+1}`);
        L.push(makePara(20 + round * 5));
        L.push(`כותרת 7 מספר ${h7Num++} - הערה נוספת לסבב ${round+1}`);
        L.push(makePara(80 + round * 15));
    }
    L.push(`כותרת 3 מספר ${h3Num++} - פסקאות שורה אחת`);
    for (let i = 0; i < 25; i++) {
        L.push(`כותרת 7 מספר ${h7Num++} - הערה קצרצרה ${i+1}`);
        L.push(ONE_LINE());
    }
    L.push(`כותרת 3 מספר ${h3Num++} - פסקה באורך עמוד מלא`);
    L.push(makePara(900));
    L.push(`כותרת 2 מספר ${simanNum++} - סיכום - כל אורכי הפסקה`);
    L.push(`כותרת 3 מספר ${h3Num++} - סיכום אורכים`);
    [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610].forEach(n => {
        L.push(`כותרת 7 מספר ${h7Num++} - פסקה באורך ${n} (פיבונאצ'י)`);
        L.push(makePara(n));
    });
    L.push(`כותרת 2 מספר ${simanNum++} - סיום המסמך`);
    L.push(makePara(100)); L.push(makePara(50)); L.push(makePara(10)); L.push(makePara(1));
    return L.join('\n');
}

// ==========================================================================
// בדיקות גופן
// ==========================================================================
function checkPriorityFontsLoaded() {
    const PRIORITY = [
        "גוטמן רש\"י רגיל", "פרנק ריל מודגש", "אלפא שחור", "אלפא מודגש",
        "ליבורנה רגיל", "ליבורנה מודגש", "הדסה פרידלנדר מודגש",
        "פרנק רוהל ליברה רגיל", "פרנק רוהל ליברה מודגש", "פרנק רוהל ליברה שחור",
        "נוטו סריף עברית מודגש", "נוטו סריף עברית שחור"
    ];
    return PRIORITY.map(fam => {
        try { return { family: fam, loaded: document.fonts.check(`12pt '${fam}'`) }; }
        catch (e) { return { family: fam, loaded: false }; }
    });
}

function checkFontFallback(el) {
    if (!el) return null;
    const computed = getComputedStyle(el);
    const actualFamily = computed.fontFamily;
    let requested = '';
    if (el.style && el.style.fontFamily) requested = el.style.fontFamily;
    else {
        const cssVar = computed.getPropertyValue('--fn-body') || '';
        if (cssVar) requested = cssVar;
    }
    if (!requested) return null;
    // נרמול: הסר גרשיים, לוכסנים (בריחת דפדפן), ורווחים
    // תיקון T9: צריך לבדוק את כל רשימת ה-fallback, לא רק את הראשון.
    // דוגמה: requested = "'גוטמן רש\"י רגיל', 'פרנק רוהל ליברה רגיל', serif"
    // actual = "פרנק רוהל ליברה רגיל, serif"
    // אם ניקח רק את הראשון ב-requested ונשווה ל-actual — נקבל false positive.
    // הפתרון: לפצל את requested לרשימה, ולבדוק אם actual מופיע בה.
    const normalizeOne = s => s.trim().replace(/^['"]|['"]$/g, '').replace(/['"\\]/g, '').replace(/\s+/g, ' ');
    const requestedList = requested.split(',').map(normalizeOne).filter(s => s.length > 0);
    const actualList = actualFamily.split(',').map(normalizeOne).filter(s => s.length > 0);
    const firstRequested = requestedList[0] || '';
    const firstActual = actualList[0] || '';
    // fallback אמיתי = ה-actual הראשון אינו מופיע בשום מקום ב-requestedList
    const isInRequestedList = requestedList.some(r => r === firstActual || firstActual.includes(r) || r.includes(firstActual));
    const isFallback = !isInRequestedList && firstRequested !== firstActual;
    return { requested: firstRequested, actual: firstActual, isFallback, requestedList, actualList };
}

function detectTofu(fontFamily) {
    // תיקון T12: הגרסה הישנה בדקה רק "האם משהו מצויר" — אבל כשהגופן לא קיים,
    // הדפדפן נופל ל-serif גנרי שכן מצייר עברית. לכן הבדיקה תמיד החזירה false.
    // הגרסה החדשה משווה בין ציור הגופן המבוקש לבין ציור serif גנרי. אם הם זהים
    // (או דומים מאוד), הגופן לא נטען ויש fallback.
    // תיקון נוסף: אם המבוקש הוא עצמו "serif" או "sans-serif" — אין משמעות
    // ל-bad comparison, ולכן נחזיר false (אין tofu).
    try {
        // גופנים גנריים — לעולם אינם tofu
        const generic = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui'];
        if (generic.includes(fontFamily.toLowerCase())) return false;

        const canvas = document.createElement('canvas');
        canvas.width = 200; canvas.height = 40;
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;

        // צייר עם הגופן המבוקש
        ctx.font = `16px '${fontFamily}', serif`;
        ctx.fillStyle = '#000'; ctx.textBaseline = 'top';
        ctx.fillText('אבגדהוזחטיכלמנסעפצקרשת', 5, 5);
        const data1 = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let black1 = 0;
        for (let i = 3; i < data1.length; i += 4) if (data1[i] > 0) black1++;

        // אם אין שום פיקסל שחור — זה tofu אמיתי
        if (black1 < 50) return true;

        // צייר עם serif גנרי בלבד
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `16px serif`;
        ctx.fillStyle = '#000'; ctx.textBaseline = 'top';
        ctx.fillText('אבגדהוזחטיכלמנסעפצקרשת', 5, 5);
        const data2 = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let black2 = 0;
        for (let i = 3; i < data2.length; i += 4) if (data2[i] > 0) black2++;

        // אם מספר הפיקסלים זהה (או כמעט זהה), הגופן לא נטען ויש fallback
        // סף 5% — אם ההפרש קטן מ-5% מ-black2, זה אותו ציור
        if (black2 > 0 && Math.abs(black1 - black2) < black2 * 0.05) return true;

        return false;
    } catch (e) { return false; }
}

// ==========================================================================
// פעולה 3 חלק ב' — בדיקת דיוק Canvas API
// ==========================================================================
// משווה בין measureLineWidthCanvas (canvas.measureText) לבין מדידת DOM
// אמיתית (span.offsetWidth). מחזיר אחוז סטייה ממוצע ומקסימלי.
// ==========================================================================
function checkCanvasMeasurementAccuracy(sampleWords) {
    const samples = sampleWords || [
        'השבת', 'המצווה', 'המעשה', 'בראשית', 'וידבר', 'ויאמר',
        'השכינה', 'הקדוש-ברוך-הוא', 'ישראל', 'תורה', 'מצווה', 'הלכה'
    ];
    const styleObj = { fontFamily: "'Frank Ruhl Libre', serif", fontSize: '16px' };
    const results = [];
    let totalAbsDelta = 0, maxAbsDelta = 0, maxRelDelta = 0;

    // צור span נסתר אחד למדידת DOM
    const span = document.createElement('span');
    span.style.cssText = 'position:absolute; top:-99999px; left:-99999px; visibility:hidden; white-space:pre;';
    document.body.appendChild(span);
    span.style.fontFamily = styleObj.fontFamily;
    span.style.fontSize = styleObj.fontSize;

    for (const w of samples) {
        const canvasW = (typeof measureLineWidthCanvas === 'function')
            ? measureLineWidthCanvas(w, styleObj)
            : -1;
        span.textContent = w;
        const domW = span.offsetWidth;
        const absDelta = Math.abs(canvasW - domW);
        const relDelta = domW > 0 ? absDelta / domW : 0;
        totalAbsDelta += absDelta;
        if (absDelta > maxAbsDelta) maxAbsDelta = absDelta;
        if (relDelta > maxRelDelta) maxRelDelta = relDelta;
        results.push({ word: w, canvasW: +canvasW.toFixed(2), domW, absDelta: +absDelta.toFixed(2), relDelta: +(relDelta * 100).toFixed(2) + '%' });
    }
    document.body.removeChild(span);

    return {
        sampleCount: samples.length,
        avgAbsDelta: +(totalAbsDelta / samples.length).toFixed(2),
        maxAbsDelta: +maxAbsDelta.toFixed(2),
        maxRelDelta: +(maxRelDelta * 100).toFixed(2) + '%',
        results,
        cacheStats: (typeof getWordWidthCacheStats === 'function') ? getWordWidthCacheStats() : null,
    };
}

// בדיקת אומדן מספר שורות: משווה estimateLineCountCanvas לבין מדידת DOM אמיתית
// של פסקה בת N מילים.
function checkCanvasLineEstimate(words, colWidth, styleObj) {
    if (typeof estimateLineCountCanvas !== 'function') {
        return { error: 'estimateLineCountCanvas not available' };
    }
    const canvasResult = estimateLineCountCanvas(words, colWidth, styleObj, {});

    // מדידת DOM אמיתית: נבנה פסקה ב-#measuring-box ונספור שורות לפי offsetTop
    let domLines = 0;
    try {
        const box = document.getElementById('measuring-box');
        if (box) {
            const savedCss = box.style.cssText;
            box.style.width = colWidth + 'px';
            box.style.fontFamily = styleObj.fontFamily || 'serif';
            box.style.fontSize = styleObj.fontSize || '16px';
            box.style.lineHeight = styleObj.lineHeight || '1.4';
            box.style.textAlign = 'justify';
            box.style.textJustify = 'inter-word';
            box.style.direction = 'rtl';
            box.innerHTML = '';
            const p = document.createElement('p');
            p.style.margin = '0'; p.style.padding = '0';
            p.style.lineHeight = styleObj.lineHeight || '1.4';
            const measureId = 'cme-' + Math.random().toString(36).slice(2, 8);
            p.innerHTML = words.map((w, i) => `<span id="${measureId}-${i}">${w}</span>`).join(' ');
            box.appendChild(p);
            let curTop = -1, lineCount = 0;
            for (let i = 0; i < words.length; i++) {
                const s = document.getElementById(`${measureId}-${i}`);
                if (!s) continue;
                if (curTop === -1) { curTop = s.offsetTop; lineCount = 1; }
                else if (Math.abs(s.offsetTop - curTop) > 8) { curTop = s.offsetTop; lineCount++; }
            }
            domLines = lineCount;
            box.innerHTML = '';
            box.style.cssText = savedCss;
        }
    } catch (e) {
        return { error: 'DOM measurement failed: ' + e.message, canvasResult };
    }

    return {
        wordCount: words.length,
        colWidth,
        canvasNumLines: canvasResult.numLines,
        domNumLines: domLines,
        delta: canvasResult.numLines - domLines,
        canvasLineTexts: canvasResult.lineTexts,
        canvasLastLineWidth: +canvasResult.lastLineWidth.toFixed(2),
    };
}

// ==========================================================================
// פעולה 4 — בדיקות Knuth-Plass
// ==========================================================================
// משווה את knuthPlassBreak לבין הדפדפן (greedy) על פסקאות לדוגמה.
// מדווח: מספר שורות, עלות כוללת, feasibility, והשוואת אחידות רוחבי שורות.
// ==========================================================================
function checkKnuthPlassQuality(sampleWords) {
    const words = sampleWords || [
        'השבת','המצווה','המעשה','הגדר','הרשות','ההוצאה','המלאכה','האיסור','הקדוש','החילול',
        'השביתה','המנוחה','הנפישה','הזכירה','השמירה','היום','הזמן','המקום','החפץ','האדם',
        'הכח','הפעולה','התוצאה','העושה','הנעשה','המציאות','ההויה','החלל','הכלל','הפרט'
    ];
    const colWidth = 280;
    const styleObj = { fontFamily: "'Frank Ruhl Libre', serif", fontSize: '16px' };

    if (typeof knuthPlassBreak !== 'function') {
        return { error: 'knuthPlassBreak not available' };
    }
    if (typeof isKnuthPlassAvailable !== 'function' || !isKnuthPlassAvailable(styleObj)) {
        return { error: 'Knuth-Plass not available (Canvas or font issue)' };
    }

    // Run Knuth-Plass
    const kpResult = knuthPlassBreak(words, colWidth, styleObj, {});

    // Run DOM-based greedy for comparison
    let domLines = 0;
    let domLineTexts = [];
    try {
        const box = document.getElementById('measuring-box');
        if (box) {
            const savedCss = box.style.cssText;
            box.style.width = colWidth + 'px';
            box.style.fontFamily = styleObj.fontFamily;
            box.style.fontSize = styleObj.fontSize;
            box.style.textAlign = 'justify';
            box.style.textJustify = 'inter-word';
            box.style.direction = 'rtl';
            box.innerHTML = '';
            const p = document.createElement('p');
            p.style.margin = '0'; p.style.padding = '0';
            const measureId = 'kpq-' + Math.random().toString(36).slice(2, 8);
            p.innerHTML = words.map((w, i) => `<span id="${measureId}-${i}">${w}</span>`).join(' ');
            box.appendChild(p);
            const lines = [];
            let curLine = [], curTop = -1;
            for (let i = 0; i < words.length; i++) {
                const s = document.getElementById(`${measureId}-${i}`);
                if (!s) continue;
                if (curTop === -1) { curTop = s.offsetTop; curLine = [words[i]]; }
                else if (Math.abs(s.offsetTop - curTop) > 8) {
                    lines.push(curLine.join(' '));
                    curLine = [words[i]];
                    curTop = s.offsetTop;
                } else { curLine.push(words[i]); }
            }
            if (curLine.length) lines.push(curLine.join(' '));
            domLines = lines.length;
            domLineTexts = lines;
            box.innerHTML = '';
            box.style.cssText = savedCss;
        }
    } catch (e) {
        return { error: 'DOM measurement failed: ' + e.message, kpResult };
    }

    // Compute width variance for KP vs DOM
    function widthVariance(lineTexts) {
        if (lineTexts.length === 0) return 0;
        const widths = lineTexts.map(t => measureLineWidthCanvas(t, styleObj));
        const mean = widths.reduce((a, b) => a + b, 0) / widths.length;
        const variance = widths.reduce((a, b) => a + (b - mean) ** 2, 0) / widths.length;
        return { mean: +mean.toFixed(2), stddev: +Math.sqrt(variance).toFixed(2), widths: widths.map(w => +w.toFixed(1)) };
    }
    const kpVar = widthVariance(kpResult.lines);
    const domVar = widthVariance(domLineTexts);

    return {
        wordCount: words.length,
        colWidth,
        kp: {
            numLines: kpResult.numLines,
            totalCost: kpResult.totalCost,
            feasibility: kpResult.feasibility,
            lines: kpResult.lines,
            widthStats: kpVar,
        },
        dom: {
            numLines: domLines,
            lines: domLineTexts,
            widthStats: domVar,
        },
        delta: kpResult.numLines - domLines,
        cacheStats: (typeof getKpCacheStats === 'function') ? getKpCacheStats() : null,
    };
}

// ==========================================================================
// בדיקות DOM ויזואליות
// ==========================================================================
function checkColumnOverflow(col) {
    if (!col) return null;
    const sH = col.scrollHeight, cH = col.clientHeight;
    return { overflow: sH - cH > 2, scrollH: sH, clientH: cH, overflowPx: sH - cH };
}

function checkSideNoteOverlap(page) {
    const issues = [];
    const notes = page.querySelectorAll('.side-note-anchor');
    const paras = page.querySelectorAll('.page-body-flow p, .right-col p, .left-col p');
    notes.forEach((note, ni) => {
        const nr = note.getBoundingClientRect();
        paras.forEach(p => {
            const pr = p.getBoundingClientRect();
            const vO = Math.min(nr.bottom, pr.bottom) - Math.max(nr.top, pr.top);
            if (vO > 5) {
                const hO = Math.min(nr.right, pr.right) - Math.max(nr.left, pr.left);
                if (hO > 5) issues.push({ noteIdx: ni, overlapPx: Math.round(Math.min(vO, hO)) });
            }
        });
    });
    return issues;
}

function checkWidowOrphan(page) {
    const widows = [], orphans = [];
    const cols = page.querySelectorAll('.right-col, .left-col');
    cols.forEach((col, ci) => {
        const paras = Array.from(col.querySelectorAll('p'));
        if (!paras.length) return;
        const firstP = paras[0];
        // אלמנה: פסקת המשך (p-cut/data-is-cont) עם שורה אחת בודדת בלבד
        // סף 1.1 — רק פסקה עם שורה אחת ממש (לא 2)
        if (firstP.classList.contains('p-cut') || firstP.getAttribute('data-is-cont') === 'true') {
            const lh = parseFloat(getComputedStyle(firstP).lineHeight) || 20;
            if (firstP.offsetHeight < lh * 1.1) widows.push({ col: ci, para: 0 });
        }
        const lastP = paras[paras.length - 1];
        // יתום: פסקה אחרונה (לא p-end) עם שורה אחת בודדת
        if (!lastP.classList.contains('p-end')) {
            const lh = parseFloat(getComputedStyle(lastP).lineHeight) || 20;
            if (lastP.offsetHeight < lh * 1.1 && paras.length > 1) orphans.push({ col: ci, para: paras.length - 1 });
        }
    });
    return { widows: widows.length, orphans: orphans.length, details: { widows, orphans } };
}

function checkHeadingAtColumnBottom(page) {
    const issues = [];
    page.querySelectorAll('.right-col, .left-col').forEach((col, ci) => {
        const ch = Array.from(col.children).filter(c => c.nodeType === 1);
        if (!ch.length) return;
        const last = ch[ch.length - 1];
        // בדיקה א': האלמנט האחרון הוא כותרת (אין שום טקסט אחריה)
        if (last && /title-level-[3456]/.test(last.className)) {
            const m = last.className.match(/title-level-(\d)/);
            issues.push({ col: ci, headingType: m ? m[1] : '?', issue: 'heading_last' });
        }
        // בדיקה ב': כותרת עם פחות מ-2 שורות טקסט אחריה
        // (כותרת "תלויה" בתחתית — התוכן שלה עבר לטור הבא)
        if (ch.length >= 2) {
            const secondLast = ch[ch.length - 2];
            if (secondLast && /title-level-[3456]/.test(secondLast.className || '')) {
                const lh = parseFloat(getComputedStyle(last).lineHeight) || 20;
                // ספור שורות בפועל עם getClientRects
                const range = document.createRange();
                range.selectNodeContents(last);
                const rects = range.getClientRects();
                const lineTops = new Set();
                for (const rect of rects) {
                    if (rect.height > 0) lineTops.add(Math.round(rect.top));
                }
                const actualLines = lineTops.size;
                if (actualLines < 2) {
                    const m = secondLast.className.match(/title-level-(\d)/);
                    issues.push({ col: ci, headingType: m ? m[1] : '?', issue: 'heading_with_lt_2_lines', linesAfter: actualLines });
                }
            }
        }
    });
    return issues;
}

function checkSingleLinePCut(page) {
    const issues = [];
    page.querySelectorAll('.right-col, .left-col').forEach((col, ci) => {
        col.querySelectorAll('p.p-cut').forEach((p, pi) => {
            const lh = parseFloat(getComputedStyle(p).lineHeight) || 20;
            // סף 1.1 — רק פסקה עם שורה אחת ממש
            if (p.offsetHeight < lh * 1.1) issues.push({ col: ci, paraIdx: pi });
        });
    });
    return issues;
}

function checkEmptyColumn(page) {
    const issues = [];
    page.querySelectorAll('.right-col, .left-col').forEach((col, ci) => {
        if (col.querySelectorAll('p').length === 0 && col.querySelectorAll('[class*="title-level"]').length === 0)
            issues.push({ col: ci });
    });
    return issues;
}

// ==========================================================================
// בדיקות RTL / עברית
// ==========================================================================
function checkHebrewIssues(p) {
    const issues = [];
    if (!p) return issues;
    const text = p.textContent || '';
    if (!text) return issues;
    const maqaf = '\u05BE';
    const badMaqaf = new RegExp(`(?:\\s${maqaf}|${maqaf}\\s)`, 'g');
    if (badMaqaf.test(text)) issues.push({ type: 'maqaf', detail: 'מקף מחבר לא מחובר' });
    const geresh = '\u05F3', gershayim = '\u05F4';
    if (new RegExp(`\\s[${geresh}${gershayim}]`).test(text)) issues.push({ type: 'geresh', detail: 'גרש/גרשיים לא צמוד' });
    const niqqud = /[\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u0591-\u05AF]/;
    for (const w of text.split(/\s+/)) {
        if (w && niqqud.test(w[0])) { issues.push({ type: 'niqqud', detail: 'ניקוד ללא אות בסיס' }); break; }
    }
    if (new RegExp('\\s[בכלמשה]$').test(text)) issues.push({ type: 'prefix', detail: 'אות קידומת בודדת בסוף' });
    return issues;
}

// ==========================================================================
// בדיקות עימוד מתקדם
// ==========================================================================
function checkRivers(col) {
    if (!col) return 0;
    const paras = col.querySelectorAll('p');
    if (paras.length < 3) return 0;
    let rivers = 0;
    const spacePositions = [];
    paras.forEach((p, pi) => {
        const ws = parseFloat(p.style.wordSpacing) || 0;
        if (ws > 3) {
            const lh = parseFloat(getComputedStyle(p).lineHeight) || 20;
            const numLines = Math.round(p.offsetHeight / lh);
            for (let li = 0; li < numLines; li++) spacePositions.push({ paraIdx: pi, ws });
        }
    });
    if (spacePositions.length >= 3) {
        const parasWithWs = new Set(spacePositions.map(s => s.paraIdx));
        if (parasWithWs.size >= 3) rivers++;
    }
    return rivers;
}

function checkWideWordSpacing(col) {
    if (!col) return 0;
    let c = 0;
    col.querySelectorAll('p').forEach(p => { if ((parseFloat(p.style.wordSpacing) || 0) > 3) c++; });
    return c;
}

function checkTightenRuntsApplied(col) {
    if (!col) return 0;
    let c = 0;
    col.querySelectorAll('p').forEach(p => { if ((parseFloat(p.style.letterSpacing) || 0) < 0) c++; });
    return c;
}

function checkConsecutiveHyphens(col) {
    if (!col) return false;
    let consecutive = 0;
    for (const p of Array.from(col.querySelectorAll('p'))) {
        const text = p.textContent || '';
        if (/-\s*$/.test(text) || /\u05BE\s*$/.test(text)) {
            consecutive++;
            if (consecutive >= 3) return true;
        } else consecutive = 0;
    }
    return false;
}

// ==========================================================================
// פונקציה ראשית — generateLayoutReport
// ==========================================================================
function generateLayoutReport() {
    const pages = document.querySelectorAll('#book-container .a4-page');
    if (pages.length === 0) { alert('אין עמודים מעומדים.'); return; }

    const S = {
        totalPages: pages.length, totalBlocks: 0, imbalanced: 0,
        sparse: 0, sparseCut: 0, sparseEnd: 0, adjusted: 0,
        startMismatch: 0, headingsDeferred: 0, tightenRunts: 0,
        overflow: 0, sideNoteOverlap: 0, widows: 0, orphans: 0,
        headingAtBottom: 0, singleLinePCut: 0, emptyColumns: 0,
        rivers: 0, wideWordSpacing: 0, consecutiveHyphens: 0,
        hebrewIssues: 0, fontFallbacks: 0, tofuFonts: 0,
        priorityFontsLoaded: 0, priorityFontsTotal: 0
    };

    const fontCheckResults = checkPriorityFontsLoaded();
    S.priorityFontsTotal = fontCheckResults.length;
    S.priorityFontsLoaded = fontCheckResults.filter(f => f.loaded).length;

    const pageData = [];
    const allIssues = [];

    pages.forEach((pg, pIdx) => {
        const pNum = pg.querySelector('.page-number-footer')?.textContent?.trim() || '';
        const role = pg.className.match(/page-role-(\S+)/)?.[1] || 'regular';
        const bf = pg.querySelector('.page-body-flow');
        const availH = bf ? bf.clientHeight : null;

        const snOverlaps = checkSideNoteOverlap(pg);
        S.sideNoteOverlap += snOverlaps.length;
        const wo = checkWidowOrphan(pg);
        S.widows += wo.widows; S.orphans += wo.orphans;
        const hb = checkHeadingAtColumnBottom(pg);
        S.headingAtBottom += hb.length;
        const slpc = checkSingleLinePCut(pg);
        S.singleLinePCut += slpc.length;
        const ec = checkEmptyColumn(pg);
        S.emptyColumns += ec.length;

        snOverlaps.forEach(o => allIssues.push({ page: pIdx + 1, pNum, type: 'חפיפת הערת שוליים', severity: 'high', detail: `${o.overlapPx}px` }));
        wo.details.widows.forEach(w => allIssues.push({ page: pIdx + 1, pNum, type: 'אלמנה (widow)', severity: 'high', detail: `טור ${w.col + 1}` }));
        wo.details.orphans.forEach(o => allIssues.push({ page: pIdx + 1, pNum, type: 'יתום (orphan)', severity: 'high', detail: `טור ${o.col + 1}` }));
        hb.forEach(h => allIssues.push({ page: pIdx + 1, pNum, type: 'כותרת בתחתית טור', severity: 'high', detail: `טור ${h.col + 1}, H${h.headingType}` }));
        slpc.forEach(s => allIssues.push({ page: pIdx + 1, pNum, type: 'p-cut חד-שורתי', severity: 'medium', detail: `טור ${s.col + 1}` }));
        ec.forEach(e => allIssues.push({ page: pIdx + 1, pNum, type: 'טור ריק', severity: 'low', detail: `טור ${e.col + 1}` }));

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

            const rOv = checkColumnOverflow(r), lOv = checkColumnOverflow(l);
            if (rOv.overflow) { S.overflow++; allIssues.push({ page: pIdx + 1, pNum, type: 'גלישת טור', severity: 'high', detail: `ימין ${rOv.overflowPx}px` }); }
            if (lOv.overflow) { S.overflow++; allIssues.push({ page: pIdx + 1, pNum, type: 'גלישת טור', severity: 'high', detail: `שמאל ${lOv.overflowPx}px` }); }

            const rRiv = checkRivers(r), lRiv = checkRivers(l);
            S.rivers += rRiv + lRiv;
            if (rRiv > 0) allIssues.push({ page: pIdx + 1, pNum, type: 'נהרות (rivers)', severity: 'medium', detail: 'טור ימין' });
            if (lRiv > 0) allIssues.push({ page: pIdx + 1, pNum, type: 'נהרות (rivers)', severity: 'medium', detail: 'טור שמאל' });

            const rWs = checkWideWordSpacing(r), lWs = checkWideWordSpacing(l);
            S.wideWordSpacing += rWs + lWs;
            const rTr = checkTightenRuntsApplied(r), lTr = checkTightenRuntsApplied(l);
            S.tightenRunts += rTr + lTr;

            if (checkConsecutiveHyphens(r)) { S.consecutiveHyphens++; allIssues.push({ page: pIdx + 1, pNum, type: '3+ מקפים ברצף', severity: 'medium', detail: 'טור ימין' }); }
            if (checkConsecutiveHyphens(l)) { S.consecutiveHyphens++; allIssues.push({ page: pIdx + 1, pNum, type: '3+ מקפים ברצף', severity: 'medium', detail: 'טור שמאל' }); }

            [...rP, ...lP].forEach(p => {
                if (p.style.marginBottom || p.style.lineHeight || p.style.wordSpacing || p.style.letterSpacing) S.adjusted++;
                const fb = checkFontFallback(p);
                if (fb && fb.isFallback) {
                    S.fontFallbacks++;
                    if (allIssues.length < 500) allIssues.push({ page: pIdx + 1, pNum, type: 'גופן fallback', severity: 'medium', detail: `${fb.requested} → ${fb.actual}` });
                }
                const hi = checkHebrewIssues(p);
                if (hi.length > 0) {
                    S.hebrewIssues += hi.length;
                    hi.forEach(h => allIssues.push({ page: pIdx + 1, pNum, type: `עברית: ${h.type}`, severity: 'low', detail: h.detail }));
                }
            });

            const rF = r.firstElementChild, lF = l.firstElementChild;
            let sm = null;
            if (rF && lF && Math.abs(rF.offsetTop - lF.offsetTop) > 2) { sm = Math.abs(rF.offsetTop - lF.offsetTop); S.startMismatch++; }

            const checkSparse = (col) => {
                const ps = col.querySelectorAll('p'); if (!ps.length) return;
                // השתמש ב-getBoundingClientRect().width שמושפע מ-transform:scale,
                // בדיוק כמו getClientRects. כך ההשוואה תהיה עקבית.
                const colRect = col.getBoundingClientRect();
                const cw = colRect.width;
                ps.forEach(p => {
                    // דלילות רלוונטית רק בפסקאות p-cut (אמצע פסקה — השורה האחרונה בטור)
                    // דלילות בפסקאות p-end (סיום טבעי ממורכז) אינה בעיה.
                    if (!p.classList.contains('p-cut')) return;
                    
                    // בדיקת שורות דלילות באמצעות DOM אמיתי (Range.getClientRects)
                    // תיקון קריטי (T2): ב-RTL, rect.width אינו מייצג את רוחב השורה.
                    // getClientRects יכול להחזיר מספר rects לאותה שורה (אחד לכל span
                    // פנימי, כמו drop-word), וכל rect.width הוא רק רוחב ה-span עצמו.
                    // כדי למדוד את רוחב השורה בפועל, יש להשתמש ב-
                    // rect.right - colRect.left (המרחק מתחילת הטור עד סוף הטקסט).
                    try {
                        const range = document.createRange();
                        range.selectNodeContents(p);
                        const rects = range.getClientRects();
                        // אסוף שורות ייחודיות לפי top, ולכל שורה קח את ה-maxRight
                        const lineMap = new Map();
                        for (const rect of rects) {
                            if (rect.height > 0) {
                                const top = Math.round(rect.top);
                                const rightFromColLeft = rect.right - colRect.left;
                                if (!lineMap.has(top) || rightFromColLeft > lineMap.get(top)) {
                                    lineMap.set(top, rightFromColLeft);
                                }
                            }
                        }
                        if (lineMap.size === 0) return;
                        const sortedTops = Array.from(lineMap.keys()).sort((a, b) => a - b);
                        const lastLineWidth = lineMap.get(sortedTops[sortedTops.length - 1]) || 0;
                        const lineCount = lineMap.size;
                        
                        // שורה דלילה: השורה האחרונה תופסת פחות מ-50% מרוחב הטור
                        // ויש יותר משורה אחת
                        if (lineCount > 1 && lastLineWidth < cw * 0.5) {
                            S.sparse++;
                            S.sparseCut++;
                        }
                    } catch (e) {
                        // fallback: אם Range לא עובד, דלג
                    }
                });
            };
            checkSparse(r); checkSparse(l);

            bInfo.push({ t: '2c', i: bi, rH, lH, d, ok: d <= 5, rP: rP.length, lP: lP.length,
                rF: rF ? rF.tagName + '.' + (rF.className.slice(0, 20)) : '—',
                lF: lF ? lF.tagName + '.' + (lF.className.slice(0, 20)) : '—',
                sm, rOv: rOv.overflowPx, lOv: lOv.overflowPx, rWs, lWs });
        });
        pageData.push({ idx: pIdx + 1, pNum, role, availH, blocks: bInfo });
    });

    fontCheckResults.forEach(fc => {
        if (fc.loaded && detectTofu(fc.family)) {
            S.tofuFonts++;
            allIssues.push({ page: 0, pNum: '—', type: 'גופן tofu', severity: 'high', detail: fc.family });
        }
    });

    // --- HTML ---
    let h = `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8"><title>דוח עימוד מועשר</title><style>
body{font-family:monospace;padding:16px;background:#0f172a;color:#e2e8f0;font-size:9pt}
h1{color:#38bdf8;border-bottom:2px solid #334155;padding-bottom:8px}
h2{color:#818cf8;margin-top:24px;border-bottom:1px solid #334155;padding-bottom:4px}
.sum{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:16px 0}
.sum div{background:#1e293b;padding:10px;border-radius:6px;text-align:center}
.sum .n{font-size:18pt;font-weight:bold}
.sum .l{font-size:7pt;color:#94a3b8}
.ok{color:#10b981}.bad{color:#ef4444}.warn{color:#f59e0b}
table{width:100%;border-collapse:collapse;font-size:7.5pt}
th{background:#334155;padding:4px;text-align:center;position:sticky;top:0}
td{padding:3px 4px;border-bottom:1px solid #1e293b;text-align:center}
tr.h3row td{color:#38bdf8;text-align:right}
tr.bad{background:rgba(239,68,68,.08)}
tr.warn{background:rgba(245,158,11,.08)}
.btn{background:#2563eb;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;margin-bottom:12px}
.section{margin:20px 0;padding:12px;background:#1e293b;border-radius:8px}
.font-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #334155}
.issues-table td{text-align:right}.issues-table td:first-child{text-align:center}
</style></head><body>`;
    h += '<h1>דוח עימוד מועשר</h1>';
    h += '<button class="btn" onclick="window.print()">🖨️ הדפס / שמור כ-PDF</button>';

    h += '<h2>סיכום כללי</h2>';
    h += `<div class="sum">
        <div><div class="n">${S.totalPages}</div><div class="l">עמודים</div></div>
        <div><div class="n">${S.totalBlocks}</div><div class="l">בלוקים</div></div>
        <div><div class="n ${S.imbalanced===0?'ok':'bad'}">${S.imbalanced}</div><div class="l">לא מאוזן</div></div>
        <div><div class="n ${S.startMismatch===0?'ok':'bad'}">${S.startMismatch}</div><div class="l">חוסר תחילת טור</div></div>
        <div><div class="n ${S.overflow===0?'ok':'bad'}">${S.overflow}</div><div class="l">גלישות</div></div>
        <div><div class="n ${S.sparse<20?'ok':'warn'}">${S.sparse}</div><div class="l">דלילות סה"כ</div></div>
        <div><div class="n ${S.sparseCut===0?'ok':'bad'}">${S.sparseCut}</div><div class="l">דלילות p-cut</div></div>
        <div><div class="n">${S.sparseEnd}</div><div class="l">דלילות p-end</div></div>
        <div><div class="n">${S.adjusted}</div><div class="l">מותאמות</div></div>
        <div><div class="n">${S.tightenRunts}</div><div class="l">tightenRunts</div></div>
    </div>`;

    h += '<h2>בדיקות ויזואליות</h2>';
    h += `<div class="sum">
        <div><div class="n ${S.widows===0?'ok':'bad'}">${S.widows}</div><div class="l">אלמנות</div></div>
        <div><div class="n ${S.orphans===0?'ok':'bad'}">${S.orphans}</div><div class="l">יתומים</div></div>
        <div><div class="n ${S.headingAtBottom===0?'ok':'bad'}">${S.headingAtBottom}</div><div class="l">כותרות בתחתית</div></div>
        <div><div class="n ${S.singleLinePCut===0?'ok':'bad'}">${S.singleLinePCut}</div><div class="l">p-cut חד-שורתי</div></div>
        <div><div class="n ${S.emptyColumns===0?'ok':'warn'}">${S.emptyColumns}</div><div class="l">טורים ריקים</div></div>
        <div><div class="n ${S.sideNoteOverlap===0?'ok':'bad'}">${S.sideNoteOverlap}</div><div class="l">חפיפות הערות</div></div>
        <div><div class="n ${S.rivers===0?'ok':'warn'}">${S.rivers}</div><div class="l">נהרות</div></div>
        <div><div class="n ${S.wideWordSpacing<10?'ok':'warn'}">${S.wideWordSpacing}</div><div class="l">ws רחב</div></div>
        <div><div class="n ${S.consecutiveHyphens===0?'ok':'warn'}">${S.consecutiveHyphens}</div><div class="l">3+ מקפים</div></div>
        <div><div class="n ${S.hebrewIssues===0?'ok':'warn'}">${S.hebrewIssues}</div><div class="l">בעיות עברית</div></div>
    </div>`;

    h += '<h2>בדיקות גופן</h2>';
    h += `<div class="sum">
        <div><div class="n ${S.priorityFontsLoaded===S.priorityFontsTotal?'ok':'bad'}">${S.priorityFontsLoaded}/${S.priorityFontsTotal}</div><div class="l">עדיפות נטענו</div></div>
        <div><div class="n ${S.fontFallbacks===0?'ok':'bad'}">${S.fontFallbacks}</div><div class="l">fallback</div></div>
        <div><div class="n ${S.tofuFonts===0?'ok':'bad'}">${S.tofuFonts}</div><div class="l">tofu</div></div>
    </div>`;

    h += '<div class="section"><h3>גופני עדיפות — מצב טעינה</h3>';
    fontCheckResults.forEach(fc => {
        h += `<div class="font-row"><span>${fc.family}</span><span class="${fc.loaded?'ok':'bad'}">${fc.loaded?'✓ נטען':'✗ לא נטען'}</span></div>`;
    });
    h += '</div>';

    // פעולה 3 חלק ב' — דוח Canvas API
    h += '<h2>Canvas API (פעולה 3 חלק ב)</h2>';
    try {
        const acc = checkCanvasMeasurementAccuracy();
        const cacheOk = acc.cacheStats && acc.cacheStats.wordCount > 0;
        h += `<div class="sum">
            <div><div class="n">${acc.sampleCount}</div><div class="l">דגימות</div></div>
            <div><div class="n ${acc.avgAbsDelta<2?'ok':'warn'}">${acc.avgAbsDelta}px</div><div class="l">סטייה ממוצעת</div></div>
            <div><div class="n ${acc.maxAbsDelta<5?'ok':'warn'}">${acc.maxAbsDelta}px</div><div class="l">סטייה מקסימלית</div></div>
            <div><div class="n ${cacheOk?'ok':'bad'}">${acc.cacheStats ? acc.cacheStats.wordCount : 0}</div><div class="l">מילים במטמון</div></div>
        </div>`;
        h += '<div class="section"><h3>דגימות מדידה — Canvas vs DOM</h3>';
        h += '<table class="issues-table"><thead><tr><th>מילה</th><th>Canvas (px)</th><th>DOM (px)</th><th>Δ (px)</th><th>Δ (%)</th></tr></thead><tbody>';
        acc.results.forEach(r => {
            const cls = r.absDelta > 2 ? 'warn' : (r.absDelta > 5 ? 'bad' : '');
            h += `<tr class="${cls}"><td>${r.word}</td><td>${r.canvasW}</td><td>${r.domW}</td><td>${r.absDelta}</td><td>${r.relDelta}</td></tr>`;
        });
        h += '</tbody></table></div>';

        // אומדן מספר שורות
        const estWords = ['השבת','המצווה','המעשה','הגדר','הרשות','ההוצאה','המלאכה','האיסור','הקדוש','החילול','השביתה','המנוחה','הנפישה','הזכירה','השמירה','היום','הזמן','המקום','החפץ','האדם','הכח','הפעולה','התוצאה','העושה','הנעשה','המציאות','ההויה','החלל','הכלל','הפרט'];
        const est = checkCanvasLineEstimate(estWords, 280, { fontFamily: "'Frank Ruhl Libre', serif", fontSize: '16px', lineHeight: '1.4' });
        if (!est.error) {
            const okClass = Math.abs(est.delta) <= 1 ? 'ok' : 'warn';
            h += `<div class="section"><h3>אומדן מספר שורות — Canvas vs DOM</h3>`;
            h += `<p>מילים: ${est.wordCount}, רוחב טור: ${est.colWidth}px</p>`;
            h += `<p>Canvas: <b class="${okClass}">${est.canvasNumLines}</b> שורות | DOM: <b>${est.domNumLines}</b> שורות | הפרש: <b class="${okClass}">${est.delta > 0 ? '+' : ''}${est.delta}</b></p>`;
            h += `<p>רוחב שורה אחרונה (Canvas): ${est.canvasLastLineWidth}px</p>`;
            h += '</div>';
        }
    } catch (e) {
        h += `<p class="bad">שגיאת Canvas: ${e.message}</p>`;
    }

    h += '<h2>טבלת בעיות ויזואליות</h2>';
    if (allIssues.length === 0) {
        h += '<p class="ok">✓ לא נמצאו בעיות ויזואליות!</p>';
    } else {
        h += `<p>סה"כ ${allIssues.length} בעיות:</p>`;
        h += '<table class="issues-table"><thead><tr><th>עמוד</th><th>מספר</th><th>סוג</th><th>חומרה</th><th>פרטים</th></tr></thead><tbody>';
        allIssues.slice(0, 500).forEach(iss => {
            const sc = iss.severity === 'high' ? 'bad' : (iss.severity === 'medium' ? 'warn' : '');
            h += `<tr class="${sc}"><td>${iss.page || '—'}</td><td>${iss.pNum}</td><td>${iss.type}</td><td>${iss.severity}</td><td>${iss.detail}</td></tr>`;
        });
        if (allIssues.length > 500) h += `<tr><td colspan="5" style="text-align:center;color:#94a3b8">... ועוד ${allIssues.length - 500}</td></tr>`;
        h += '</tbody></table>';
    }

    h += '<h2>טבלת בלוקים מפורטת</h2>';
    h += '<table><thead><tr><th>עמוד</th><th>מספר</th><th>תפקיד</th><th>בלוק</th><th>R</th><th>L</th><th>Δ</th><th>סטטוס</th><th>R-P</th><th>L-P</th><th>R-ראשון</th><th>L-ראשון</th><th>תחילת טור</th><th>R-גלישה</th><th>L-גלישה</th><th>R-ws</th><th>L-ws</th></tr></thead><tbody>';
    pageData.forEach(p => {
        p.blocks.forEach(b => {
            if (b.t === 'h3') {
                h += `<tr class="h3row"><td>${p.idx}</td><td>${p.pNum}</td><td colspan="16">⬩ H3: ${b.text}</td></tr>`;
            } else {
                const cls = b.d > 5 ? 'bad' : '';
                const st = b.ok ? '<span class="ok">✓</span>' : `<span class="bad">${b.d}px</span>`;
                const sm = b.sm != null ? `<span class="bad">${b.sm}px</span>` : '<span class="ok">✓</span>';
                const rOv = b.rOv > 2 ? `<span class="bad">${b.rOv}</span>` : '<span class="ok">✓</span>';
                const lOv = b.lOv > 2 ? `<span class="bad">${b.lOv}</span>` : '<span class="ok">✓</span>';
                const rWs = b.rWs > 0 ? `<span class="warn">${b.rWs}</span>` : '0';
                const lWs = b.lWs > 0 ? `<span class="warn">${b.lWs}</span>` : '0';
                h += `<tr class="${cls}"><td>${p.idx}</td><td>${p.pNum}</td><td>${p.role}</td><td>#${b.i}</td><td>${b.rH}</td><td>${b.lH}</td><td>${b.d}</td><td>${st}</td><td>${b.rP}</td><td>${b.lP}</td><td>${b.rF}</td><td>${b.lF}</td><td>${sm}</td><td>${rOv}</td><td>${lOv}</td><td>${rWs}</td><td>${lWs}</td></tr>`;
            }
        });
    });
    h += '</tbody></table></body></html>';

    const blob = new Blob([h], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// ==========================================================================
// כפתורים — מוסתרים במצב רגיל, מופיעים רק במצב בדיקה
// ==========================================================================
function initTestSuiteButtons() {
    // כפתורים אלו אינם מופיעים בסרגל הראשי — הם נוצרים רק כשמפעילים מצב בדיקה
    // דרך debug-panel.js. הפונקציות נשארות זמינות דרך window.
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTestSuiteButtons);
else initTestSuiteButtons();

window.generateTestText = generateTestText;
window.generateLayoutReport = generateLayoutReport;

// ==========================================================================
// טקסט בדיקה קבוע (seeded LCG) — מייצר את אותו טקסט בכל פעם
// ==========================================================================
let _seededState = 12345;
function _seededRand() {
    _seededState = (_seededState * 1103515245 + 12345) & 0x7fffffff;
    return _seededState / 0x7fffffff;
}
function _seededInt(n) { return Math.floor(_seededRand() * n); }
function _seededW() { return W[_seededInt(W.length)]; }

function generateTestTextSeeded() {
    _seededState = 12345; // Reset seed
    let L = [];
    L.push('שם הספר - טקסט בדיקה קבוע');
    L.push('נושא - בדיקת עימוד');
    L.push('נושא מפורט - כיסוי כל מקרי העימוד');
    L.push('פרטי מהדורא - גרסת בדיקה');
    L.push('שם המחבר - בדיקה');
    L.push('מקום ושנת הוצאה - ירושלים | תשפ"ו');
    L.push('שמירת זכויות - כל הזכויות שמורות');
    L.push('פרטי הוצאה לאור - הוצאת בדיקה');
    L.push('פרטי קשר - 052-0000000');
    L.push('פרטים נוספים - טקסט זה נוצר עם seed קבוע לשחזור מלא');

    // תוכן עניינים
    L.push('תוכן עניינים כללי');
    L.push('פרק א - מבוא');
    L.push('פרק ב - פרטים');
    L.push('פרק ג - סיכום');

    L.push('פרק א - מבוא');
    L.push('נושא - הקדמה');
    L.push('נושא מפורט - מבוא כללי');
    L.push('בכאן נתחיל לדון בענייני המבוא. ' + LINES(3));
    L.push('סעיף א - הגדרות');
    L.push(LINES(4));
    L.push('תת סעיף - ביאור');
    L.push(LINES(3));
    L.push('הערה [זוהי הערת שוליים לבדיקה. היא בודקת את מערכת ההערות.]');
    L.push(LINES(2));
    L.push('סעיף ב - כללים');
    L.push(LINES(5));
    L.push('תת סעיף - פרטים');
    L.push(LINES(3));
    L.push('הערה [הערה נוספת לבדיקת זרימת הערות בין עמודים.]');
    L.push(LINES(4));

    // פרקים נוספים
    for (let ch = 2; ch <= 30; ch++) {
        L.push('פרק ' + ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','יא','יב','יג','יד','טו','טז','יז','יח','יט','כ','כא','כב','כג','כד','כה','כו','כז','כח','כט'][ch-1] + ' - נושא');
        L.push('נושא - פרק ' + ch);
        L.push('נושא מפורט - ביאור');
        const numParas = 8 + _seededInt(5);
        for (let p = 0; p < numParas; p++) {
            if (_seededInt(4) === 0) {
                L.push('סעיף ' + (p+1) + ' - ' + _seededW());
            }
            L.push(LINES(2 + _seededInt(4)));
            if (_seededInt(5) === 0) {
                L.push('הערה [' + makePara(5 + _seededInt(5)) + ']');
            }
        }
    }

    L.push('סוף הספר');
    return L.join('\n');
}
window.generateTestTextSeeded = generateTestTextSeeded;
window.checkCanvasMeasurementAccuracy = checkCanvasMeasurementAccuracy;
window.checkCanvasLineEstimate = checkCanvasLineEstimate;
window.checkKnuthPlassQuality = checkKnuthPlassQuality;
// חשיפת פונקציות הבדיקה הפנימיות לצורכי אימות חיצוני
window.checkColumnOverflow = checkColumnOverflow;
window.checkSideNoteOverlap = checkSideNoteOverlap;
window.checkWidowOrphan = checkWidowOrphan;
window.checkHeadingAtColumnBottom = checkHeadingAtColumnBottom;
window.checkSingleLinePCut = checkSingleLinePCut;
window.checkEmptyColumn = checkEmptyColumn;
window.checkHebrewIssues = checkHebrewIssues;
window.checkRivers = checkRivers;
window.checkWideWordSpacing = checkWideWordSpacing;
window.checkTightenRuntsApplied = checkTightenRuntsApplied;
window.checkConsecutiveHyphens = checkConsecutiveHyphens;
window.checkFontFallback = checkFontFallback;
window.detectTofu = detectTofu;
window.checkPriorityFontsLoaded = checkPriorityFontsLoaded;
})();
