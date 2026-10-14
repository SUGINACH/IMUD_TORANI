
/* ==========================================================================
   מערכת עימוד תורנית מקצועית לדפי A4 — גרסת העל המושלמת (Master Edition)
   קובץ: typesetter.js
   כולל מנוע איסוף נתוני דיאגנוסטיקה, יישור 5 שלבים מותאם ואיזון טורים קשיח
   ========================================================================== */

let noteCounters = {
    footnote: 0,
    endnote: 0
};
let noteUidCounter = 0;
let footnoteQueueForPage = [];
let endnoteQueueForPart = [];
let lineToTokenMap = [];
let globalTokens = [];
let curH1 = '';
let curH2 = '';
let currentH3Title = '';
let currentH4Title = '';

// מאגר גלובלי לאחסון נתוני דיבאג וטרייס לכל עמוד
window.__pageDebugStore = window.__pageDebugStore || {};


/* ==========================================================================
   1. פונקציות יסוד, סינון עריכה ומספור תורני
   ========================================================================== */
function stripEditorialNotes(text) {
    if (!text || typeof text !== 'string') return text || '';
    return text.replace(/##[\s\S]*?##/g, '').replace(/[ \t]{2,}/g, ' ').replace(/\s+([,.:;!?])/g, '$1').trim();
}

function toGematria(num) {
    num = parseInt(num, 10);
    if (isNaN(num) || num <= 0) return "";
    
    const hundreds = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];
    const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
    const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
    const thousandsLetters = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י"];
    
    // טיפול באלפים (ומעלה): כל אלף מסומן באות יחידה + גרש.
    // 1000 → א', 2000 → ב', 3000 → ג', 10000 → י'.
    // ערכים מעל 9999 (10,000+) אינם נפוצים בספרים תורניים; אנו מטפלים רק באלפים 1-10.
    let thousandsPart = '';
    let remaining = num;
    if (num >= 1000) {
        const thousands = Math.floor(num / 1000);
        if (thousands >= 1 && thousands < thousandsLetters.length) {
            thousandsPart = thousandsLetters[thousands] + '\u05F3'; // גרש (U+05F3)
            remaining = num % 1000;
            if (remaining === 0) return thousandsPart;
        } else {
            // ערכים מעל 9999: נחזיר כל הערך כמחרוזת ספרות (fallback)
            return String(num);
        }
    }
    
    // טיפול במאות, עשרות ואחדות על היתרה (0-999)
    let str = '';
    let h = Math.floor(remaining / 100);
    if (h > 0) {
        if (h <= 4) str += ["", "ק", "ר", "ש", "ת"][h];
        else if (h < hundreds.length) str += hundreds[h];
        // אם h >= hundreds.length (10000+), איננו יכולים לייצג זאת — נחזיר מחרוזת ריקה יחסית.
    }
    let afterHundreds = remaining % 100;
    let t = Math.floor(afterHundreds / 10);
    let o = afterHundreds % 10;
    if (t === 1 && (o === 5 || o === 6)) {
        // איסור שמות קודש: 15 → טו, 16 → טז
        str += (o === 5) ? "טו" : "טז";
    } else {
        str += tens[t] + ones[o];
    }
    
    // אם יש אלפים, נפריד אותם מהחלק התחתון ברווח (נהוג בדפוס תורני).
    return thousandsPart ? (thousandsPart + ' ' + str) : str;
}

function toGematriaWithGeresh(num) {
    const raw = toGematria(num);
    if (!raw) return "";
    // גרש (U+05F3) לאות בודדת, גרשיים (U+05F4) לפני האות האחרונה בשתי אותיות ומעלה.
    
    // אם יש אלפים (מופרדים ברווח מהחלק התחתון), נטפל בכל חלק בנפרד.
    if (raw.includes(' ')) {
        const parts = raw.split(' ');
        // החלק הראשון הוא האלפים — כבר מכיל גרש.
        const thousandsPart = parts[0];  // למשל: "א'"
        const lowerPart = parts.slice(1).join(' ');  // למשל: "תשפה"
        if (!lowerPart) return thousandsPart;
        // עיבוד החלק התחתון כאילו היה יחידה נפרדת.
        if (lowerPart.includes('\u05F3') || lowerPart.includes('\u05F4')) return raw;
        if (lowerPart.length === 1) return thousandsPart + ' ' + lowerPart + '\u05F3';
        return thousandsPart + ' ' + lowerPart.slice(0, -1) + '\u05F4' + lowerPart.slice(-1);
    }
    
    // מקרה רגיל (ללא אלפים).
    if (raw.includes('\u05F3') || raw.includes('\u05F4')) return raw; // כבר מכיל גרש/גרשיים
    if (raw.length === 1) return raw + '\u05F3';
    return raw.slice(0, -1) + '\u05F4' + raw.slice(-1);
}

function formatPageNumberDisplay(pNum) {
    const pageNumPos = document.getElementById('page-num-position')?.value || 'bottom_center';
    const pageNumFormat = document.getElementById('page-num-format')?.value || 'gematria';
    const pageNumFrame = document.getElementById('page-num-frame')?.value || 'none';
    const startIdx = parseInt(document.getElementById('page-num-start-idx')?.value, 10) || 1;
    const initialValue = parseInt(document.getElementById('page-num-initial-value')?.value, 10) || 1;

    let displayPageNum = '';
    if (pageNumPos !== 'none' && pNum >= startIdx) {
        const effectiveNum = pNum - startIdx + initialValue;
        if (pageNumFormat === 'gematria') {
            displayPageNum = toGematria(effectiveNum);
        } else if (pageNumFormat === 'page_gematria') {
            displayPageNum = 'דף ' + toGematria(effectiveNum);
        } else if (pageNumFormat === 'numeric') {
            displayPageNum = String(effectiveNum);
        }
    }

    let framedPageNum = displayPageNum;
    if (displayPageNum && pageNumFrame !== 'none') {
        framedPageNum = `<span class="page-num-badge page-num-frame-${pageNumFrame}">${displayPageNum}</span>`;
    }

    return { displayPageNum, framedPageNum, pageNumPos };
}

/* ==========================================================================
   2. עדכון רשת, גופנים ומשתני CSS
   ========================================================================== */
function updateGrid() {
    const root = document.documentElement;
    const rawCol = parseFloat(document.getElementById('prop-col')?.value) || 40;
    const rawMargin = parseFloat(document.getElementById('prop-margin')?.value) || 7.5;
    const rawGutter = parseFloat(document.getElementById('prop-gutter')?.value) || 2;
    const rawGap = parseFloat(document.getElementById('prop-gap')?.value) || 2;
    const total = 2 * rawCol + 2 * rawMargin + rawGutter + 2 * rawGap;
    const scale = total > 0 ? 100 / total : 1;
    root.style.setProperty('--w-col', (rawCol * scale) + '%');
    root.style.setProperty('--w-margin', (rawMargin * scale) + '%');
    root.style.setProperty('--w-gutter', (rawGutter * scale) + '%');
    root.style.setProperty('--w-gap', (rawGap * scale) + '%');
    root.style.setProperty('--flow-mt', (document.getElementById('prop-mt')?.value || 20) + 'px');
    root.style.setProperty('--flow-mb', (document.getElementById('prop-mb')?.value || 20) + 'px');
    root.style.setProperty('--flow-mt-h2', (document.getElementById('prop-mt-h2')?.value || 20) + 'px');
}

function updateStyles() {
    const root = document.documentElement;

    function getFontVal(id, fallback) {
        const v = document.getElementById(id)?.value;
        return (v && v.trim() && v !== 'serif') ? v : fallback;
    }

    root.style.setProperty('--hdr-w-r', document.getElementById('hdr-w-r')?.value || '33.33%');
    root.style.setProperty('--hdr-w-c', document.getElementById('hdr-w-c')?.value || '33.34%');
    root.style.setProperty('--hdr-w-l', document.getElementById('hdr-w-l')?.value || '33.33%');

    root.style.setProperty('--fn-header-r', getFontVal('f-hdr-r', "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif"));
    root.style.setProperty('--sz-header-r', (document.getElementById('s-hdr-r')?.value || 15) + 'pt');
    root.style.setProperty('--fn-header-c', getFontVal('f-hdr-c', "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif"));
    root.style.setProperty('--sz-header-c', (document.getElementById('s-hdr-c')?.value || 11) + 'pt');
    root.style.setProperty('--fn-header-l', getFontVal('f-hdr-l', "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif"));
    root.style.setProperty('--sz-header-l', (document.getElementById('s-hdr-l')?.value || 15) + 'pt');

    root.style.setProperty('--fn-note-body', document.getElementById('f-note-body')?.value || "'פרנק רוהל ליברה רגיל', serif");
    root.style.setProperty('--sz-note-body', (document.getElementById('s-note-body')?.value || '') ? document.getElementById('s-note-body').value + 'pt' : 'inherit');
    root.style.setProperty('--last-line-align', document.getElementById('body-last-line-align')?.value || 'center');

    const hdrDividerMode = document.getElementById('hdr-divider-style')?.value || 'gray';
    const hdrDividerColorMap = { none: 'transparent', gray: 'rgba(0,0,0,0.06)', black: '#000' };
    root.style.setProperty('--hdr-divider-color', hdrDividerColorMap[hdrDividerMode] || hdrDividerColorMap.gray);

    root.style.setProperty('--fn-h0', getFontVal('f-h0', "'אלפא שחור', 'פרנק רוהל ליברה שחור', serif"));
    root.style.setProperty('--sz-h0', (document.getElementById('s-h0')?.value || 26) + 'pt');
    root.style.setProperty('--fn-h0-body', getFontVal('f-h0-body', "'פרנק רוהל ליברה רגיל', serif"));
    root.style.setProperty('--sz-h0-body', (document.getElementById('s-h0-body')?.value || 11.5) + 'pt');

    root.style.setProperty('--fn-h1', getFontVal('f-h1', "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif"));
    root.style.setProperty('--sz-h1', (document.getElementById('s-h1')?.value || 50) + 'pt');

    root.style.setProperty('--fn-h2', getFontVal('f-h2', "'אלפא שחור', 'פרנק רוהל ליברה שחור', serif"));
    root.style.setProperty('--sz-h2', (document.getElementById('s-h2')?.value || 17) + 'pt');
    root.style.setProperty('--h2-top-distance', document.getElementById('h2-top-distance')?.value || '22%');

    const fSiman = document.getElementById('f-siman')?.value;
    const sSiman = document.getElementById('s-siman')?.value;
    if (fSiman) root.style.setProperty('--fn-siman', fSiman);
    if (sSiman) root.style.setProperty('--sz-siman', sSiman + 'pt');

    root.style.setProperty('--fn-h3', getFontVal('f-h3', "'אלפא שחור', 'נוטו סריף עברית שחור', serif"));
    root.style.setProperty('--sz-h3', (document.getElementById('s-h3')?.value || 13.5) + 'pt');
    root.style.setProperty('--fn-h4', getFontVal('f-h4', "'אלפא שחור', 'פרנק רוהל ליברה שחור', serif"));
    root.style.setProperty('--sz-h4', (document.getElementById('s-h4')?.value || 12.5) + 'pt');
    root.style.setProperty('--fn-h5', getFontVal('f-h5', "'אלפא מודגש', 'פרנק רוהל ליברה מודגש', serif"));
    root.style.setProperty('--sz-h5', (document.getElementById('s-h5')?.value || 11.5) + 'pt');
    root.style.setProperty('--fn-h6', getFontVal('f-h6', "'נוטו סריף עברית מודגש', serif"));
    root.style.setProperty('--sz-h6', (document.getElementById('s-h6')?.value || 10.5) + 'pt');
    root.style.setProperty('--fn-h7', getFontVal('f-h7', "'הדסה פרידלנדר מודגש', 'פרנק רוהל ליברה מודגש', serif"));
    root.style.setProperty('--sz-h7', (document.getElementById('s-h7')?.value || 6) + 'pt');

    root.style.setProperty('--fn-sh-title', getFontVal('f-sh-title', "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif"));
    root.style.setProperty('--sz-sh-title', (document.getElementById('s-sh-title')?.value || 46) + 'pt');
    root.style.setProperty('--fn-sh-sub', getFontVal('f-sh-sub', "'ליבורנה מודגש', 'פרנק רוהל ליברה מודגש', serif"));
    root.style.setProperty('--sz-sh-sub', (document.getElementById('s-sh-sub')?.value || 21) + 'pt');
    root.style.setProperty('--fn-sh-desc', getFontVal('f-sh-desc', "'ליבורנה רגיל', 'פרנק רוהל ליברה רגיל', serif"));
    root.style.setProperty('--sz-sh-desc', (document.getElementById('s-sh-desc')?.value || 12) + 'pt');
    root.style.setProperty('--fn-sh-sec', document.getElementById('f-sh-sec')?.value || "'פרנק רוהל ליברה רגיל', serif");
    root.style.setProperty('--sz-sh-sec', (document.getElementById('s-sh-sec')?.value || 11.5) + 'pt');
    root.style.setProperty('--fn-sh-author', document.getElementById('f-sh-author')?.value || "'פרנק רוהל ליברה רגיל', serif");
    root.style.setProperty('--sz-sh-author', (document.getElementById('s-sh-author')?.value || 15) + 'pt');
    root.style.setProperty('--fn-sh-year', document.getElementById('f-sh-year')?.value || "'פרנק רוהל ליברה רגיל', serif");
    root.style.setProperty('--sz-sh-year', (document.getElementById('s-sh-year')?.value || 12) + 'pt');

    root.style.setProperty('--fn-body', getFontVal('font-body', `'גוטמן רש"י רגיל', 'פרנק רוהל ליברה רגיל', serif`));
    root.style.setProperty('--sz-body', (document.getElementById('size-body')?.value || 12) + "pt");
    root.style.setProperty('--line-height-body', document.getElementById('line-height-body')?.value || '1.34');
    root.style.setProperty('--fn-first-word', getFontVal('font-first-word', "'פרנק ריל מודגש', 'פרנק רוהל ליברה מודגש', serif"));
    root.style.setProperty('--sz-first-word', (document.getElementById('size-first-word')?.value || 1.5) + 'em');

    const fDh = document.getElementById('f-dh')?.value;
    if (fDh) root.style.setProperty('--fn-dh', fDh);

    const fNoteTitle = document.getElementById('f-note-title')?.value;
    const sNoteTitle = document.getElementById('s-note-title')?.value;
    if (fNoteTitle) root.style.setProperty('--fn-note-title', fNoteTitle);
    if (sNoteTitle) root.style.setProperty('--sz-note-title', (sNoteTitle || 9) + 'pt');
}

/* ==========================================================================
   3. טיפוגרפיה: דיבור המתחיל ומילה ראשונה (Drop Word)
   ========================================================================== */
function applyDibburHamatchil(text) {
    const isDhEnabled = document.getElementById('auto-dh')?.checked;
    if (!isDhEnabled || !text) return text;
    const match = text.match(/^([^.\-–—]{1,80}[.\-–—])\s*(.*)$/s);
    if (match) {
        // אסקייפ מונע הזרקת HTML זדוני דרך תוכן הפסקה (XSS).
        // אם הקלט מכיל כבר HTML (למשל כשנקרא מתוך createDropWord עם span עוטף),
        // האסקייפ יהפוך את התגיות לישויות — מה שיקלקל את התצוגה.
        // לכן, אם הקלט מכיל < או > (סימן שזה HTML), אנו מדלגים על אסקייפ.
        const isHTML = /[<>]/.test(text);
        const m1 = isHTML ? match[1] : escapeHTML(match[1]);
        const m2 = isHTML ? match[2] : escapeHTML(match[2]);
        return `<span class="dibbur-hamatchil">${m1}</span> ${m2}`;
    }
    return text;
}

function createDropWord(text, isContinuation, isSingleLine, numLines = 2) {
    // אם פסקת המשך — החזר את הטקסט כשהוא מאוסקייפ, כי הוא יוזרק ל-innerHTML.
    if (isContinuation) return escapeHTML(text);
    text = text.trim();
    if (!text) return '';

    const mode = document.getElementById('drop-word-mode')?.value || 'window';
    // במצב 'none' הטקסט עובר דרך applyDibburHamatchil המבצע אסקייפ פנימי.
    if (mode === 'none') return applyDibburHamatchil(text);

    const wordCount = parseInt(document.getElementById('drop-word-count')?.value, 10) || 1;
    const minLines = parseInt(document.getElementById('drop-word-min-lines')?.value, 10) || 2;
    const meetsLineThreshold = (numLines >= minLines) && !isSingleLine;

    const words = text.split(/\s+/);
    if (words.length === 0) return '';
    
    // FIX: אסקייפ טקסט משתמש לפני הזרקה ל-HTML — מונע XSS.
    const dropWords = escapeHTML(words.slice(0, Math.min(wordCount, words.length)).join(' '));
    const restOfText = escapeHTML(words.slice(Math.min(wordCount, words.length)).join(' '));

    let className = 'first-word-inline';
    if (mode === 'window') {
        className = meetsLineThreshold ? 'first-word-window' : 'first-word-inline';
    } else if (mode === 'bold') {
        className = 'first-word-bold';
    } else if (mode === 'inline') {
        className = 'first-word-inline';
    }

    const styledWords = `<span class="${className}">${dropWords}</span>`;
    const fullText = restOfText ? `${styledWords} ${restOfText}` : styledWords;
    // הערה: בעבר כאן הייתה קריאה ל-applyDibburHamatchil(fullText), אך זה היה באג:
    // הרגקס של דיבור המתחיל רץ על HTML שכבר כולל תגיות span, ומייצר תוצאה שבורה.
    // כעת, דיבור המתחיל מופעל רק במצב 'none' (מעלה), שבו הקלט הוא טקסט גולמי.
    return fullText;
}

/* ==========================================================================
   4. מדידת שורות אטומית עם הגנת הערות שוליים (\uE000)
   ==========================================================================

   פעולה 3 — Width Caching (לפי מחקר סעיף 7):
   מטמון תוצאות getLinesFromParagraph לפי גיבוב (hash) של הקלט.
   מאיץ עימוד פי 3-5 על ידי מניעת חישובים חוזרים של אותה פסקה.
   המטמון מתאפס בכל קריאה ל-typesetDocument.
   ========================================================================== */
const _linesCache = new Map();
const _LINES_CACHE_MAX = 2000;

function _cacheKey(text, colWidth, styleObj, useWindow) {
    // צור מפתח ייחודי מהפרמטרים
    const fp = styleObj.fontFamily || '';
    const fs = styleObj.fontSize || '';
    const lh = styleObj.lineHeight || '';
    const ws = styleObj.wordSpacing || '';
    const ls = styleObj.letterSpacing || '';
    return `${text.length}|${colWidth}|${fp}|${fs}|${lh}|${ws}|${ls}|${useWindow}`;
}

/* ==========================================================================
   3א. Canvas API למדידת רוחב טקסט — פעולה 3 חלק ב'
   ==========================================================================
   פתרון Off-DOM Canvas Measurement לפי מחקר סעיף 5 ("פתרון ה-Off-DOM
   Canvas Measurement"):
   - שימוש ב-canvas.measureText() במקום offsetWidth / getBoundingClientRect
     למדידת רוחב מילה / שורה / פסקה.
   - מונע Layout Thrashing — אין Reflow בדפדפן, הואיל ו-canvas פונה ישירות
     למנוע הפונטים (Font Engine) ומחזיר רוחב שבר אבסולוטי ומדויק.
   - מטמון רוחבי מילים ב-Map (key: font|word → width), לפי המלצת המחקר
     "שימוש במטמון רוחבים (Width Caching)".
   - מאפשר אומדן מהיר של מספר שורות (estimateLineCountCanvas) ללא צורך
     ב-DOM probe יקר של offsetHeight / offsetTop.

   שימוש נוכחי:
   1. measureWordWidth(word, styleObj) — רוחב מילה בודדת עם מטמון.
   2. measureLineWidthCanvas(text, styleObj) — רוחב שורה (מילים מופרדות ברווח).
   3. estimateLineCountCanvas(words, colWidth, styleObj, opts) — אומדן גרידי
      של מספר שורות, מחזיר גם את השורות ורוחב השורה האחרונה.
   4. resetWordWidthCache() — ניקוי המטמון (נקרא מ-performTypeset).

   הערות:
   - canvas.measureText אינו מבצע שבירת שורות או הצדקה (justify); הוא רק מודד
     רוחב. לכן הוא משמש לאומדן בלבד, וה-DOM נשאר ה-Source of Truth לחלוקת
     השורות בפועל (span.offsetTop).
   - מטמון המילים נשמר גם בין פסקאות (בניגוד ל-_linesCache שמתאפס), כי רוחב
     מילה בגופן נתון אינו תלוי בעמוד / פסקה.
   - יש להמתין לטעינת הגופן לפני מדידה. נשתמש ב-document.fonts.check() כדי
     לוודא שהגופן זמין (לפי לקח קודם: document.fonts.status אינו אמין).
   ========================================================================== */

let _measureCanvas = null;
let _measureCtx = null;
const _wordWidthCache = new Map();
const _WORD_WIDTH_CACHE_MAX = 8000;
// מטמון רוחב רווח לכל תיאור גופן — חיוני לאלגוריתם ה-greedy.
const _spaceWidthCache = new Map();

/**
 * _getCanvasCtx — מחזיר הקשר 2d של canvas יחיד גלובלי.
 * יצירת canvas יקרה; לכן נשמרת מופע יחיד.
 */
function _getCanvasCtx() {
    if (!_measureCanvas) {
        try {
            _measureCanvas = document.createElement('canvas');
            _measureCanvas.width = 10;
            _measureCanvas.height = 10;
            _measureCtx = _measureCanvas.getContext('2d');
        } catch (e) {
            console.warn('canvasMeasure: canvas not available', e);
            _measureCtx = null;
        }
    }
    return _measureCtx;
}

/**
 * _fontDescriptor — בונה מחרוזת font תקנית ל-canvas (למשל "16px 'FrankRuehl'").
 * תומך ברשימת fallback (למשל "'Frank Ruhl Libre', serif") — משאיר אותה כמו שהיא.
 * @param {object} styleObj — { fontFamily, fontSize }
 */
function _fontDescriptor(styleObj) {
    const size = styleObj.fontSize || '16px';
    let family = String(styleObj.fontFamily || 'serif').trim();
    // אם family מכיל פסיק — זו רשימת fallback, נשתמש בה כמו שהיא.
    if (family.includes(',')) {
        return `${size} ${family}`;
    }
    // אחרת — זו משפחה אחת. נסיר גרשיים קיימים ונעטוף מחדש אם יש רווחים.
    const cleanFamily = family.replace(/^['"]|['"]$/g, '').trim();
    const needsQuotes = /\s/.test(cleanFamily);
    const quotedFamily = needsQuotes ? `'${cleanFamily}'` : cleanFamily;
    return `${size} ${quotedFamily}`;
}

/**
 * _isFontAvailable — בודק האם הגופן זמין באמצעות document.fonts.check().
 * אם אינו זמין, נחזיר false ונסתפק במדידת DOM כ-fallback.
 * תומך ברשימת fallback (למשל "'Frank Ruhl Libre', serif") — מעביר את
 * כל הרשימה ל-document.fonts.check, שבודק את המשפחה הראשונה.
 */
function _isFontAvailable(styleObj) {
    if (typeof document === 'undefined' || !document.fonts || !document.fonts.check) {
        return false;
    }
    const size = styleObj.fontSize || '16px';
    const family = styleObj.fontFamily || 'serif';
    try {
        // document.fonts.check מקבל font shorthand ובודק את המשפחה הראשונה.
        // נעביר את ה-fontFamily כמות שהוא (כולל רשימת fallback).
        return document.fonts.check(`${size} ${family}`);
    } catch (e) {
        return false;
    }
}

/**
 * _cacheKeyForWord — מפתח ייחודי למילה במטמון.
 */
function _cacheKeyForWord(word, fontDesc) {
    return `${fontDesc}|${word}`;
}

/**
 * measureWordWidth — מודד רוחב מילה בודדת בעזרת canvas, עם מטמון.
 * אם canvas אינו זמין או הגופן אינו טעון — נופל למדידת DOM.
 *
 * @param {string} word
 * @param {object} styleObj — { fontFamily, fontSize }
 * @returns {number} רוחב בפיקסלים (שבר אבסולוטי)
 */
function measureWordWidth(word, styleObj) {
    if (!word) return 0;
    const fontDesc = _fontDescriptor(styleObj);
    const key = _cacheKeyForWord(word, fontDesc);
    const cached = _wordWidthCache.get(key);
    if (cached !== undefined) return cached;

    // ניקוי מטמון אם מלא
    if (_wordWidthCache.size >= _WORD_WIDTH_CACHE_MAX) {
        const keys = Array.from(_wordWidthCache.keys());
        for (let i = 0; i < keys.length / 2; i++) _wordWidthCache.delete(keys[i]);
    }

    const ctx = _getCanvasCtx();
    if (!ctx || !_isFontAvailable(styleObj)) {
        // Fallback: DOM measurement
        let fallbackW = 0;
        try {
            const span = document.createElement('span');
            span.style.cssText = `position:absolute; visibility:hidden; white-space:pre; font:${fontDesc};`;
            span.textContent = word;
            document.body.appendChild(span);
            fallbackW = span.offsetWidth;
            document.body.removeChild(span);
        } catch (e) { fallbackW = 0; }
        _wordWidthCache.set(key, fallbackW);
        return fallbackW;
    }

    ctx.font = fontDesc;
    const width = ctx.measureText(word).width;
    _wordWidthCache.set(key, width);
    return width;
}

/**
 * measureLineWidthCanvas — מודד רוחב שורה שלמה (מילים מופרדות ברווח) ב-canvas.
 * משתמש במטמון. מתאים ל-RTL כיוון שרוחב אינו תלוי בכיוון.
 *
 * @param {string} text — השורה כולה
 * @param {object} styleObj
 * @returns {number}
 */
function measureLineWidthCanvas(text, styleObj) {
    if (!text) return 0;
    const fontDesc = _fontDescriptor(styleObj);
    const key = `__line__|${fontDesc}|${text}`;
    const cached = _wordWidthCache.get(key);
    if (cached !== undefined) return cached;

    const ctx = _getCanvasCtx();
    if (!ctx || !_isFontAvailable(styleObj)) {
        // Fallback ל-DOM (מקרה נדיר — הגופן אמור להיות טעון בעת המדידה)
        let fallbackW = 0;
        try {
            const span = document.createElement('span');
            span.style.cssText = `position:absolute; visibility:hidden; white-space:pre; font:${fontDesc};`;
            span.textContent = text;
            document.body.appendChild(span);
            fallbackW = span.offsetWidth;
            document.body.removeChild(span);
        } catch (e) { fallbackW = 0; }
        _wordWidthCache.set(key, fallbackW);
        return fallbackW;
    }

    ctx.font = fontDesc;
    const width = ctx.measureText(text).width;
    // נשמור במטמון רק אם אינו גדול מדי (כדי לא להציף מטמון מילים בשורות)
    if (text.length <= 80) {
        _wordWidthCache.set(key, width);
    }
    return width;
}

/**
 * _getSpaceWidth — מודד רוחב רווח בודד בגופן, עם מטמון נפרד.
 */
function _getSpaceWidth(styleObj) {
    const fontDesc = _fontDescriptor(styleObj);
    const cached = _spaceWidthCache.get(fontDesc);
    if (cached !== undefined) return cached;

    const ctx = _getCanvasCtx();
    if (!ctx || !_isFontAvailable(styleObj)) {
        // אומדן גס: רוחב רווח ≈ 25% מגובה הגופן
        const sizeMatch = String(styleObj.fontSize || '16px').match(/([\d.]+)/);
        const sizeNum = sizeMatch ? parseFloat(sizeMatch[1]) : 16;
        const est = sizeNum * 0.25;
        _spaceWidthCache.set(fontDesc, est);
        return est;
    }
    ctx.font = fontDesc;
    const w = ctx.measureText(' ').width;
    _spaceWidthCache.set(fontDesc, w);
    return w;
}

/**
 * estimateLineCountCanvas — אומדן מהיר של מספר שורות בעזרת canvas.
 * אלגוריתם greedy: מצרף מילים עד שהרוחב עובר את colWidth, אז יורד שורה.
 * מתחשב ב-word-spacing ו-rtl — אך אינו מבצע הצדקה (justify) או שבירת
 * מילים (hyphenation). מתאים לאומדן בלבד.
 *
 * @param {string[]} words
 * @param {number} colWidth
 * @param {object} styleObj
 * @param {object} opts — { wordSpacing?: number }
 * @returns {{ numLines: number, lineTexts: string[], lastLineWidth: number, lineStartIdx: number[] }}
 */
function estimateLineCountCanvas(words, colWidth, styleObj, opts = {}) {
    if (!words || words.length === 0) {
        return { numLines: 0, lineTexts: [], lastLineWidth: 0, lineStartIdx: [] };
    }
    const ctx = _getCanvasCtx();
    if (!ctx || !_isFontAvailable(styleObj)) {
        // Fallback: נחזיר 0 כדי שהקריאה תדע לנסות מסלול אחר
        return { numLines: 0, lineTexts: [], lastLineWidth: 0, lineStartIdx: [] };
    }

    const spaceW = _getSpaceWidth(styleObj);
    const wordSpacing = (typeof opts.wordSpacing === 'number') ? opts.wordSpacing : 0;
    // תיקון לפי letterSpacing (אופציונלי)
    const lsPerChar = (typeof opts.letterSpacing === 'number') ? opts.letterSpacing : 0;

    const lineTexts = [];
    const lineStartIdx = [];
    let currentLine = [];
    let currentWidth = 0;
    let currentStartIdx = 0;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordW = measureWordWidth(word, styleObj) + (lsPerChar * word.length);
        // רוחב נוסף: רווח + wordSpacing (רק אם אינה המילה הראשונה בשורה)
        const addedW = currentLine.length === 0
            ? wordW
            : (spaceW + wordSpacing + wordW);

        if (currentWidth + addedW > colWidth && currentLine.length > 0) {
            lineTexts.push(currentLine.join(' '));
            lineStartIdx.push(currentStartIdx);
            currentLine = [word];
            currentWidth = wordW;
            currentStartIdx = i;
        } else {
            if (currentLine.length === 0) currentStartIdx = i;
            currentLine.push(word);
            currentWidth += addedW;
        }
    }
    if (currentLine.length > 0) {
        lineTexts.push(currentLine.join(' '));
        lineStartIdx.push(currentStartIdx);
    }

    const lastLine = lineTexts[lineTexts.length - 1] || '';
    const lastLineWidth = lastLine ? measureLineWidthCanvas(lastLine, styleObj) : 0;

    return {
        numLines: lineTexts.length,
        lineTexts,
        lastLineWidth,
        lineStartIdx,
    };
}

/**
 * resetWordWidthCache — מנקה את מטמון רוחבי המילים.
 * נקרא מ-performTypeset כדי לאפס מצב בין רינדורים (למשל אחרי שינוי גופן).
 * שים לב: המטמון אינו חייב להתאפס כי רוחב מילה בגופן נתון אינו תלוי בעמוד.
 * אך נאפס אם חל שינוי בהגדרות הגופן הגלובליות.
 */
function resetWordWidthCache() {
    _wordWidthCache.clear();
    _spaceWidthCache.clear();
}

/**
 * getWordWidthCacheStats — לצורכי דיבאג: מחזיר סטטיסטיקות מטמון.
 */
function getWordWidthCacheStats() {
    return {
        wordCount: _wordWidthCache.size,
        spaceCount: _spaceWidthCache.size,
        wordMax: _WORD_WIDTH_CACHE_MAX,
    };
}

/* ==========================================================================
   3ב. Knuth-Plass — שבירת שורות אופטימלית (פעולה 4)
   ==========================================================================
   מימוש מלא של אלגוריתם Knuth-Plass (TeX, 1981) לשבירת שורות אופטימלית
   ברמת הפסקה. בניגוד לאלגוריתם הגרידי (חמדן) הממלא כל שורה עד אפס מקום,
   Knuth-Plass משתמש בתכנון דינמי על גרף נקודות שבירה כדי למצוא את
   המסלול בעל עלות הדמריטס הכוללת המינימלית עבור הפסקה כולה.

   מודל האובייקטים (לפי מחקר סעיף 2.1):
   - **תיבות (Boxes)**: מילים בעלות רוחב קבוע (נמדדות דרך Canvas).
   - **דבק (Glue)**: רווחים בין-מילים עם יכולת התרחבות (stretch) והתכווצות (shrink).
     CSS `text-align: justify` מאפשר ~50% מתיחה ו-~33% כיווץ מעבר לרוחב הרווח
     הטבעי.
   - **קנסות (Penalties)**: קנס קווי (linePenalty) לכל שורה, קנס אלמנה (widowPenalty)
     על שורה אחרונה בת מילה אחת, קנס יתום (orphanPenalty) על שורה ראשונה בת
     מילה אחת, קנס שורה אחרונה ריקה (lastLinePenalty).

   נוסחאות:
   - **Badness**: 100 * (|stretch_used / stretch_max|)^3 — מודד כמה נדרש למתוח
     את הדבק. מוגבל ל-10000 (אינסוף).
   - **Demerits (עלות שורה)**: linePenalty + badness^2 + penalty^2 — לפי TeX.
   - **Demerits כולל**: סכום דמריטס של כל השורות. Knuth-Plass מוצא את המסלול
     עם הסכום המינימלי.

   פסילת שורות לא-אפשריות:
   - אם badness > tolerance, השורה נפסלת.
   - אם הרוחב הטבעי עולה על colWidth והכיווץ המקסימלי אינו מספיק — השורה נפסלת.
   - אם מילה בודדת רחבה מ-colWidth — נאלצים לאפשר שורת "overfull" עם קנס גבוה
     (אין ברירה אחרת).

   אופטימיזציה:
   - משתמש ברשימת "active nodes" — רק נקודות שבירה שנמצאו אפשריות ממשיכות
     להיות מורחבות. זה מפחית את הסיבוכיות מ-O(N^3) ל-O(N^2) במקרה הממוצע.
   - מטמון נפרד לתוצאות Knuth-Plass (לפי hash של טקסט + רוחב + סגנון).

   הערות RTL:
   - האלגוריתם תלוי-כיוון רק במובן של סדר המילים. הסדר נשמר כמות שהוא.
   - הדפדפן אחראי לסידור הויזואלי ב-`direction: rtl`, לא Knuth-Plass.
   ========================================================================== */

// מטמון תוצאות Knuth-Plass
const _kpCache = new Map();
const _KP_CACHE_MAX = 1500;

// ברירת מחדל: Knuth-Plass פעיל אם Canvas זמין. ניתן לכבות דרך UI.
let _kpEnabled = true;
// פעולה 4 — דגל להפעלת <br> ברינדור.
// כבוי במהלך probe renders של balanceColumns (שרצים פעמים רבות),
// דלוק רק ברינדור הסופי. מונע קריסת זיכרון.
let _kpBrEnabled = false;

/**
 * isKnuthPlassAvailable — בודק האם Knuth-Plass יכול לרוץ (Canvas + גופן זמינים).
 */
function isKnuthPlassAvailable(styleObj) {
    if (!_kpEnabled) return false;
    const ctx = _getCanvasCtx();
    if (!ctx) return false;
    return _isFontAvailable(styleObj || { fontFamily: "'Frank Ruhl Libre', serif", fontSize: '16px' });
}

/**
 * setKnuthPlassEnabled — הפעלה/כיבוי גלובלי של Knuth-Plass.
 * נקרא מ-UI checkbox.
 */
function setKnuthPlassEnabled(enabled) {
    _kpEnabled = !!enabled;
    // נקה מטמון כדי שקריאות עתידיות יחשבו מחדש
    _kpCache.clear();
    _linesCache.clear();
}

function isKnuthPlassEnabled() { return _kpEnabled; }

/**
 * _kpCacheKey — מפתח ייחודי לתוצאות Knuth-Plass.
 */
function _kpCacheKey(words, colWidth, styleObj, opts) {
    const fp = styleObj.fontFamily || '';
    const fs = styleObj.fontSize || '';
    const ws = styleObj.wordSpacing || '';
    const ls = styleObj.letterSpacing || '';
    const tol = opts.tolerance || 200;
    const lp = opts.linePenalty || 10;
    // לא נכלול את כל המילים ב-key כי הן ארוכות; נשתמש ב-hash קצר.
    // נספר מילים וניקח hash מ-3 המילים הראשונות + 3 האחרונות.
    const n = words.length;
    const head = n > 0 ? words.slice(0, Math.min(3, n)).join('|') : '';
    const tail = n > 6 ? words.slice(-3).join('|') : '';
    const mid = n > 6 ? words[Math.floor(n / 2)] : '';
    return `kp|${n}|${colWidth}|${fp}|${fs}|${ws}|${ls}|${tol}|${lp}|${head}|${mid}|${tail}`;
}

/**
 * knuthPlassBreak — האלגוריתם הראשי. מקבל מערך מילים ומחזיר חלוקה אופטימלית לשורות.
 *
 * @param {string[]} words — מערך מילים (אחרי עיבוד: הערות, runt prevention, וכו').
 * @param {number} colWidth — רוחב הטור בפיקסלים.
 * @param {object} styleObj — { fontFamily, fontSize, wordSpacing?, letterSpacing? }
 * @param {object} opts — פרמטרים אופציונליים:
 *   - tolerance: מקסימום badness מותר (ברירת מחדל 200, כמו TeX).
 *   - linePenalty: קנס קווי לכל שורה (ברירת מחדל 10).
 *   - widowPenalty: קנס על שורה אחרונה בת מילה אחת (ברירת מחדל 150).
 *   - orphanPenalty: קנס על שורה ראשונה בת מילה אחת (ברירת מחדל 150).
 *   - lastLinePenalty: קנס על שורה אחרונה ריקה (ברירת מחדל 0).
 *   - overfullPenalty: קנס על שורת overfull (ברירת מחדל 1000).
 *   - firstLineWidthReduction: הפחתת רוחב לשורה ראשונה (ל-drop word).
 * @returns {{ lines: string[], numLines: number, totalCost: number,
 *            lastLineWidth: number, lineWidths: number[], feasibility: 'optimal'|'overfull'|'fallback' }}
 */
function knuthPlassBreak(words, colWidth, styleObj, opts = {}) {
    if (!words || words.length === 0) {
        return { lines: [], numLines: 0, totalCost: 0, lastLineWidth: 0, lineWidths: [], feasibility: 'optimal' };
    }

    // בדוק מטמון
    const cacheKey = _kpCacheKey(words, colWidth, styleObj, opts);
    const cached = _kpCache.get(cacheKey);
    if (cached) return cached;

    // ניקוי מטמון אם מלא
    if (_kpCache.size >= _KP_CACHE_MAX) {
        const keys = Array.from(_kpCache.keys());
        for (let i = 0; i < keys.length / 2; i++) _kpCache.delete(keys[i]);
    }

    const tolerance = opts.tolerance != null ? opts.tolerance : 200;
    const linePenalty = opts.linePenalty != null ? opts.linePenalty : 10;
    const widowPenalty = opts.widowPenalty != null ? opts.widowPenalty : 150;
    const orphanPenalty = opts.orphanPenalty != null ? opts.orphanPenalty : 150;
    const lastLinePenalty = opts.lastLinePenalty != null ? opts.lastLinePenalty : 0;
    const overfullPenalty = opts.overfullPenalty != null ? opts.overfullPenalty : 1000;
    const firstLineWidthReduction = opts.firstLineWidthReduction || 0;
    // פעולה 4 — פרמטרים מתקדמים (לפי מחקרים):
    // looseness: מאפשר לאלגוריתם להוסיף/להסיר שורות מהאופטימום הטבעי.
    //   looseness=+1 → חפש פתרון עם שורה אחת יותר (למניעת אלמנות/איזון טורים).
    //   looseness=-1 → חפש פתרון עם שורה אחת פחות (למניעת יתומים/חיסכון מקום).
    const looseness = opts.looseness || 0;
    // adjdemerits: קנס נוסף כאשר שתי שורות עוקבות הן בקטגוריות כושר (fitness)
    // בלתי-תואמות (למשל "tight" אחרי "very loose"). מונע ניגודים חזותיים חריפים.
    const adjdemerits = opts.adjdemerits != null ? opts.adjdemerits : 3000;
    // parfillskip: האם לתת לשורה האחרונה מתיחה אינסופית (כמו TeX).
    // אם true — השורה האחרונה אינה נדרשת להגיע לרוחב הטור, ו-badness=0 תמיד.
    const parfillskip = opts.parfillskip !== false; // ברירת מחדל: true
    // clubpenalties: מערך קנסות לשורות הראשונות של פסקה אחרי כותרת (לפי מחקר 1,
    // סעיף "מניעה רב-שורתית באמצעות \clubpenalties").
    // דוגמה: [10000, 10000, 150] — אוסר שבירה אחרי שורה 1 ו-2, מאפשר משורה 3.
    // אם לא מסופק, ברירת מחדל: רק orphanPenalty לשורה הראשונה.
    const clubpenalties = opts.clubpenalties || null;

    // רוחב רווח טבעי וגבולות מתיחה/כיווץ
    const spaceW = _getSpaceWidth(styleObj);
    // CSS justify יכול למתוח ולכווץ רווחים באופן גמיש למדי — אין גבול קשיח בתקן.
    // בפועל, דפדפנים מאפשרים:
    //   - מתיחה עד פי 2-3 מהרוחב הטבעי (לעתים יותר)
    //   - כיווץ עד כדי העלמות הרווח לגמרי (100% כיווץ)
    // ערכים קטנים מדי יגרמו לאלגוריתם לסמן שורות נורמליות כ-overfull ולהעדיף
    // מילה בודדת בכל שורה.
    const spaceStretch = spaceW * 2.5;
    const spaceShrink = spaceW * 1.0;

    // תיקון letterSpacing
    const lsPerChar = parseFloat(styleObj.letterSpacing) || 0;
    // תיקון wordSpacing נוסף
    const wsExtra = parseFloat(styleObj.wordSpacing) || 0;

    // רוחבי מילים
    const N = words.length;
    const wordWs = new Float64Array(N);
    for (let i = 0; i < N; i++) {
        wordWs[i] = measureWordWidth(words[i], styleObj) + lsPerChar * words[i].length;
    }

    // סכומים מצטברים (prefix sums) לחישוב O(1) של רוחב שורה.
    // prefixW[i] = sum(wordWs[0..i-1]) — סכום רוחבי המילים מ-0 עד i-1.
    const prefixW = new Float64Array(N + 1);
    prefixW[0] = 0;
    for (let i = 0; i < N; i++) prefixW[i + 1] = prefixW[i] + wordWs[i];

    // רוחב יעד לשורה ראשונה (עם הפחתת drop word אם יש)
    const firstLineTarget = colWidth - firstLineWidthReduction;

    // פונקציית עזר: חישוב רוחב טבעי של שורה מ-word[a] עד word[b-1] (כולל)
    // משמע: b-a מילים, עם (b-a-1) רווחים ביניהן
    // O(1) בזכות prefix sums.
    function lineNaturalWidth(a, b) {
        const wordsWidth = prefixW[b] - prefixW[a];
        const numSpaces = b - a - 1;
        return wordsWidth + numSpaces * (spaceW + wsExtra);
    }

    // פונקציית עזר: חישוב עלות שורה (badness + demerits)
    // מחזירה { feasible, badness, demerits, isOverfull, fitnessClass, ratio }
    // פעולה 4 — lineNumInPara: מספר השורה בפסקה (1-based), לצורך clubpenalties
    function lineCost(a, b, isLastLine, isFirstLine, lineNumInPara) {
        const target = isFirstLine ? firstLineTarget : colWidth;
        const natural = lineNaturalWidth(a, b);
        const numSpaces = b - a - 1; // רווחים בין מילים בשורה
        const lineStretch = numSpaces * spaceStretch;
        const lineShrink = numSpaces * spaceShrink;

        let badness = 0;
        let isOverfull = false;

        if (isLastLine) {
            // שורה אחרונה: מותר להיות underfull (קצרה מהטור) עם badness=0.
            // אבל אסור להיות overfull (ארוכה מהטור) — הדפדפן לא יכול לכווץ רווחים
            // מתחת לאפס, ולכן שורה ארוכה מדי תגלוש מחוץ לטור.
            if (natural > target + 0.5) {
                if (numSpaces === 0) {
                    isOverfull = true;
                    badness = 10000;
                } else {
                    const shrinkUsed = natural - target;
                    if (shrinkUsed > lineShrink + 0.5) {
                        isOverfull = true;
                        badness = 10000;
                    } else {
                        // אפשר לכווץ — badness נמוך כי זו שורה אחרונה
                        badness = 0;
                    }
                }
            } else {
                // underfull או מושלם — badness 0 לשורה אחרונה
                badness = 0;
            }
        } else if (natural > target) {
            // צריך לכווץ
            if (numSpaces === 0) {
                // מילה אחת שרחבה מהטור — overfull אמיתי
                if (natural > target + 0.5) {
                    isOverfull = true;
                    badness = 10000; // אינסוף
                } else {
                    badness = 0;
                }
            } else {
                const shrinkUsed = natural - target;
                // CSS יכול לכווץ רווחים עד כדי העלמותם (maxShrink = numSpaces * spaceW)
                // אבל אנחנו משתמשים ב-lineShrink = numSpaces * spaceShrink (עם spaceShrink = spaceW)
                // כך שזה תואם.
                if (shrinkUsed > lineShrink + 0.5) {
                    // אי-אפשר לכווץ מספיק — overfull אמיתי
                    isOverfull = true;
                    badness = 10000;
                } else {
                    const ratio = shrinkUsed / lineShrink;
                    badness = Math.min(10000, Math.round(100 * Math.pow(ratio, 3)));
                }
            }
        } else if (natural < target) {
            // צריך למתוח
            if (numSpaces === 0) {
                // מילה אחת קצרה מהטור — שורה דלילה מאוד. BADNESS גבוה כדי להרתיע.
                // נתייחס ל-target כאל יכולת המתיחה המקסימלית (כי אין רווחים למתוח).
                const stretchNeeded = target - natural;
                const ratio = stretchNeeded / target;
                badness = Math.min(10000, Math.round(100 * Math.pow(ratio, 3)));
            } else {
                const stretchUsed = target - natural;
                const ratio = stretchUsed / lineStretch;
                badness = Math.min(10000, Math.round(100 * Math.pow(ratio, 3)));
            }
        } else {
            badness = 0;
        }

        // פסילה אם badness > tolerance ואינה שורת overfull כפויה
        let feasible = true;
        if (badness > tolerance && !isOverfull) {
            feasible = false;
        }
        // שורת overfull כפויה: אפשרית אך עם קנס גבוה
        if (isOverfull) {
            feasible = true;
        }

        // חישוב demerits (עלות) לפי TeX:
        // demerits = linePenalty + badness^2 + penalty^2
        // כאשר penalty כולל: widowPenalty / orphanPenalty / lastLinePenalty / overfullPenalty
        let penalty = 0;
        const numWordsInLine = b - a;
        if (isLastLine && numWordsInLine === 1) penalty += widowPenalty;
        if (isFirstLine && numWordsInLine === 1) penalty += orphanPenalty;
        if (isOverfull) penalty += overfullPenalty;
        if (isLastLine && numWordsInLine === 0) penalty += lastLinePenalty;

        // פעולה 4 — clubpenalties: אם סופק מערך קנסות ויש לנו מספר שורה,
        // החל את הקנס המתאים. זה מאפשר "שתי שורות אחרי כותרת" (לפי מחקר 1).
        if (clubpenalties && lineNumInPara && lineNumInPara <= clubpenalties.length) {
            penalty += clubpenalties[lineNumInPara - 1];
        }

        // TeX נוסחת demerits: D = (linePenalty + badness)^2 + penalty^2 (אם penalty >= 0)
        // נשתמש בנוסחה הקלאסית: demerits = linePenalty + badness^2 + penalty^2
        const demerits = linePenalty + badness * badness + penalty * penalty;

        // פעולה 4 — fitness class (לפי מחקר 2, סעיף "fitness classes"):
        // 4 קטגוריות לפי יחס ההתאמה r:
        //   0 (tight):    r < -0.5  (כיווץ משמעותי)
        //   1 (decent):   -0.5 <= r <= 0.5  (נורמלי)
        //   2 (loose):    0.5 < r < 1  (מתיחה מתונה)
        //   3 (very loose): r >= 1  (מתיחה קיצונית)
        // נשתמש בזה ל-adjdemerits (קנס על מעבר בין קטגוריות בלתי-תואמות).
        let fitnessClass = 1; // ברירת מחדל: decent
        let ratio = 0;
        if (!isLastLine && !isOverfull && numSpaces > 0) {
            if (natural > target) {
                ratio = -(natural - target) / lineShrink;
            } else if (natural < target) {
                ratio = (target - natural) / lineStretch;
            }
            if (ratio < -0.5) fitnessClass = 0;
            else if (ratio <= 0.5) fitnessClass = 1;
            else if (ratio < 1) fitnessClass = 2;
            else fitnessClass = 3;
        }

        return { feasible, badness, demerits, isOverfull, natural, fitnessClass, ratio };
    }

    // ===== תכנון דינמי =====
    // פעולה 4 — מימוש looseness עם אופטימיזציה:
    // אם looseness=0 (ברירת מחדל), נשתמש ב-DP פשוט (נקודה אחת לכל end).
    // אם looseness!=0, נשתמש ב-bestByLineCount (שמירת נקודות לפי lineCount).
    // זה מונע בעיית ביצועים כשלא צריך looseness.

    const useLooseness = (looseness !== 0);

    if (!useLooseness) {
        // מסלול מהיר: DP פשוט (נקודה אחת לכל end)
        const best = new Array(N + 1).fill(null);
        best[0] = { cost: 0, parent: -1, lineStart: 0, fitnessClass: 1, lineCount: 0 };
        let activeStarts = [0];

        for (let end = 1; end <= N; end++) {
            let bestForEnd = null;
            for (let sIdx = activeStarts.length - 1; sIdx >= 0; sIdx--) {
                const a = activeStarts[sIdx];
                if (a >= end) continue;
                const isLastLine = (end === N);
                const isFirstLine = (a === 0);
                const lc = lineCost(a, end, isLastLine, isFirstLine, null);

                if (!lc.feasible) {
                    if (lc.natural > (isFirstLine ? firstLineTarget : colWidth)) break;
                }

                let lcWithClub = lc;
                // פעולה 4 — אופטימיזציה: רק אם יש clubpenalties ויש lineNumInPara רלוונטי,
                // חשב מחדש. אחרת, השתמש ב-lc המקורי.
                if (clubpenalties && best[a].lineCount < clubpenalties.length) {
                    lcWithClub = lineCost(a, end, isLastLine, isFirstLine, (best[a].lineCount || 0) + 1);
                }
                const prevFitness = best[a].fitnessClass;
                const currFitness = lcWithClub.fitnessClass;
                let adjDem = 0;
                if (Math.abs(prevFitness - currFitness) > 1) adjDem = adjdemerits;

                const candidateCost = best[a].cost + lcWithClub.demerits + adjDem;
                if (!bestForEnd || candidateCost < bestForEnd.cost) {
                    bestForEnd = {
                        cost: candidateCost, parent: a, lineStart: a,
                        fitnessClass: currFitness, lineCount: (best[a].lineCount || 0) + 1,
                    };
                }
            }

            if (bestForEnd) {
                best[end] = bestForEnd;
            } else {
                const fallbackParent = end - 1;
                const fallbackCost = (best[fallbackParent] ? best[fallbackParent].cost : 0) + overfullPenalty * 10;
                best[end] = { cost: fallbackCost, parent: fallbackParent, lineStart: fallbackParent, fitnessClass: 1, lineCount: (best[fallbackParent]?.lineCount || 0) + 1 };
            }

            const newActive = [];
            for (const a of activeStarts) {
                if (a >= end) continue;
                const natural = lineNaturalWidth(a, end);
                const numSpaces = end - a - 1;
                const lineShrink = numSpaces * spaceShrink;
                if (natural > colWidth + lineShrink + 1 && numSpaces > 0) continue;
                newActive.push(a);
            }
            newActive.push(end);
            activeStarts = newActive;
        }

        // שחזור מסלול
        const breakPoints = [];
        let cur = N;
        let feasibility = 'optimal';
        while (cur > 0) {
            const node = best[cur];
            if (!node) { feasibility = 'fallback'; break; }
            breakPoints.unshift(node.lineStart);
            if (node.parent === -1) break;
            cur = node.parent;
        }
        breakPoints.push(N);

        // בנה שורות
        const lines = [];
        const lineWidths = [];
        for (let i = 0; i < breakPoints.length - 1; i++) {
            const a = breakPoints[i], b = breakPoints[i + 1];
            lines.push(words.slice(a, b).join(' '));
            const isFirstLine = (a === 0);
            const target = isFirstLine ? firstLineTarget : colWidth;
            lineWidths.push(Math.min(lineNaturalWidth(a, b), target));
        }
        const totalCost = best[N] ? best[N].cost : 0;
        const lastLineWidth = lineWidths.length > 0 ? lineWidths[lineWidths.length - 1] : 0;
        for (let i = 0; i < lines.length; i++) {
            if (i === lines.length - 1) continue;
            const a = breakPoints[i], b = breakPoints[i + 1];
            const isFirstLine = (a === 0);
            const target = isFirstLine ? firstLineTarget : colWidth;
            if (lineNaturalWidth(a, b) > target + 1) { feasibility = 'overfull'; break; }
        }
        const result = { lines, numLines: lines.length, totalCost, lastLineWidth, lineWidths, feasibility };
        _kpCache.set(cacheKey, result);
        return result;
    }

    // מסלול looseness: שמירת נקודות לפי lineCount (רק כש-looseness != 0)
    const bestByLineCount = new Array(N + 1).fill(null);
    bestByLineCount[0] = new Map();
    bestByLineCount[0].set(0, { cost: 0, parent: -1, lineStart: 0, fitnessClass: 1, lineCount: 0 });

    let activeStarts = [0];
    let minLineCount = 0, maxLineCount = 0;

    for (let end = 1; end <= N; end++) {
        const endMap = new Map();

        for (let sIdx = activeStarts.length - 1; sIdx >= 0; sIdx--) {
            const a = activeStarts[sIdx];
            if (a >= end) continue;
            const isLastLine = (end === N);
            const isFirstLine = (a === 0);
            const lc = lineCost(a, end, isLastLine, isFirstLine, null);

            if (!lc.feasible) {
                if (lc.natural > (isFirstLine ? firstLineTarget : colWidth)) break;
            }

            const aMap = bestByLineCount[a];
            if (!aMap) continue;
            for (const [aLineCount, aNode] of aMap) {
                if (aLineCount < minLineCount - 3 || aLineCount > maxLineCount + 3) continue;

                let lcWithClub = lc;
                if (clubpenalties) {
                    lcWithClub = lineCost(a, end, isLastLine, isFirstLine, aLineCount + 1);
                }
                const prevFitness = aNode.fitnessClass;
                const currFitness = lcWithClub.fitnessClass;
                let adjDem = 0;
                if (Math.abs(prevFitness - currFitness) > 1) adjDem = adjdemerits;

                const candidateCost = aNode.cost + lcWithClub.demerits + adjDem;
                const candidateLineCount = aLineCount + 1;

                const existing = endMap.get(candidateLineCount);
                if (!existing || candidateCost < existing.cost) {
                    endMap.set(candidateLineCount, {
                        cost: candidateCost, parent: a, parentLineCount: aLineCount,
                        lineStart: a, fitnessClass: currFitness, lineCount: candidateLineCount,
                    });
                }
            }
        }

        if (endMap.size > 0) {
            const lineCounts = Array.from(endMap.keys());
            const endMin = Math.min(...lineCounts);
            const endMax = Math.max(...lineCounts);
            if (end === 1 || endMin < minLineCount) minLineCount = endMin;
            if (endMax > maxLineCount) maxLineCount = endMax;
        }

        if (endMap.size === 0) {
            const fallbackParent = end - 1;
            const fallbackParentMap = bestByLineCount[fallbackParent];
            let fallbackParentNode = null, fallbackParentLC = 0;
            if (fallbackParentMap) {
                for (const [lc, node] of fallbackParentMap) {
                    if (!fallbackParentNode || node.cost < fallbackParentNode.cost) {
                        fallbackParentNode = node; fallbackParentLC = lc;
                    }
                }
            }
            const fallbackCost = (fallbackParentNode ? fallbackParentNode.cost : 0) + overfullPenalty * 10;
            const fallbackLC = (fallbackParentNode ? fallbackParentLC : 0) + 1;
            endMap.set(fallbackLC, {
                cost: fallbackCost, parent: fallbackParent, parentLineCount: fallbackParentLC,
                lineStart: fallbackParent, fitnessClass: 1, lineCount: fallbackLC,
            });
        }
        bestByLineCount[end] = endMap;

        const newActive = [];
        for (const a of activeStarts) {
            if (a >= end) continue;
            const natural = lineNaturalWidth(a, end);
            const numSpaces = end - a - 1;
            const lineShrink = numSpaces * spaceShrink;
            if (natural > colWidth + lineShrink + 1 && numSpaces > 0) continue;
            newActive.push(a);
        }
        newActive.push(end);
        activeStarts = newActive;
    }

    // פעולה 4 — looseness: בחר נקודת סיום עם מספר שורות = optimal + looseness
    // ראשית, מצא את הנקודה האופטימלית (העלות המינימלית) ב-bestByLineCount[N]
    const endMapN = bestByLineCount[N];
    let optimalNode = null;
    let optimalLineCount = 0;
    if (endMapN) {
        for (const [lc, node] of endMapN) {
            if (!optimalNode || node.cost < optimalNode.cost) {
                optimalNode = node;
                optimalLineCount = lc;
            }
        }
    }

    // אם looseness != 0, חפש נקודה עם targetLineCount = optimalLineCount + looseness
    let chosenNode = optimalNode;
    if (looseness !== 0 && endMapN) {
        const targetLineCount = optimalLineCount + looseness;
        const targetNode = endMapN.get(targetLineCount);
        if (targetNode) {
            chosenNode = targetNode;
        }
        // אם אין נקודה עם targetLineCount, השאר את האופטימלית
    }

    // שחזור המסלול מ-chosenNode
    const breakPoints = [];
    let cur = N;
    let curLineCount = chosenNode ? chosenNode.lineCount : 0;
    let feasibility = 'optimal';
    while (cur > 0) {
        const curMap = bestByLineCount[cur];
        if (!curMap) { feasibility = 'fallback'; break; }
        const node = curMap.get(curLineCount);
        if (!node) { feasibility = 'fallback'; break; }
        breakPoints.unshift(node.lineStart);
        if (node.parent === -1) break;
        cur = node.parent;
        curLineCount = node.parentLineCount;
    }
    breakPoints.push(N);

    // בנה מערך שורות
    const lines = [];
    const lineWidths = [];
    for (let i = 0; i < breakPoints.length - 1; i++) {
        const a = breakPoints[i];
        const b = breakPoints[i + 1];
        const lineWords = words.slice(a, b);
        lines.push(lineWords.join(' '));
        const isFirstLine = (a === 0);
        const target = isFirstLine ? firstLineTarget : colWidth;
        const natural = lineNaturalWidth(a, b);
        // אם השורה ארוכה מהטור — overfull; אחרת השתמש ב-natural
        lineWidths.push(Math.min(natural, target));
    }

    const totalCost = chosenNode ? chosenNode.cost : 0;
    const lastLineWidth = lineWidths.length > 0 ? lineWidths[lineWidths.length - 1] : 0;

    // בדוק אם היתה שורת overfull כלשהי (למעט השורה האחרונה שמקבלת יחס מקל)
    for (let i = 0; i < lines.length; i++) {
        if (i === lines.length - 1) continue; // שורה אחרונה — מדלגים
        const a = breakPoints[i];
        const b = breakPoints[i + 1];
        const natural = lineNaturalWidth(a, b);
        const isFirstLine = (a === 0);
        const target = isFirstLine ? firstLineTarget : colWidth;
        if (natural > target + 1) {
            feasibility = 'overfull';
            break;
        }
    }

    const result = {
        lines,
        numLines: lines.length,
        totalCost,
        lastLineWidth,
        lineWidths,
        feasibility,
    };
    _kpCache.set(cacheKey, result);
    return result;
}

/**
 * resetKpCache — מנקה את מטמון Knuth-Plass.
 * נקרא מ-performTypeset.
 */
function resetKpCache() {
    _kpCache.clear();
}

/**
 * getKpCacheStats — לצורכי דיבאג.
 */
function getKpCacheStats() {
    return {
        kpCount: _kpCache.size,
        kpMax: _KP_CACHE_MAX,
        kpEnabled: _kpEnabled,
    };
}

function getLinesFromParagraph(text, colWidth, styleObj, useWindowIfMultipleLines, looseness) {
    // בדוק מטמון (כולל looseness במפתח)
    const loosenessKey = looseness || 0;
    const key = _cacheKey(text, colWidth, styleObj, useWindowIfMultipleLines) + '|l' + loosenessKey;
    const cached = _linesCache.get(key);
    if (cached) return cached;

    // אם המטמון מלא — נקה חצי
    if (_linesCache.size >= _LINES_CACHE_MAX) {
        const keys = Array.from(_linesCache.keys());
        for (let i = 0; i < keys.length / 2; i++) _linesCache.delete(keys[i]);
    }

    const measureContainer = document.getElementById('measuring-box');
    measureContainer.style.width = colWidth + 'px';
    measureContainer.style.fontFamily = styleObj.fontFamily;
    measureContainer.style.fontSize = styleObj.fontSize;
    measureContainer.style.lineHeight = styleObj.lineHeight;
    measureContainer.style.textAlign = 'justify';
    measureContainer.style.textJustify = 'inter-word';
    measureContainer.style.direction = 'rtl';
    measureContainer.innerHTML = '';

    const fnOpen = document.getElementById('fn-delim-open')?.value?.trim() || '[';
    const fnClose = document.getElementById('fn-delim-close')?.value?.trim() || ']';
    let safeText = text.trim();

    // מניעת מילה בודדת בשורה האחרונה (Runt Prevention)
    // אם הפסקה מכילה 4 מילים ומעלה ואינה מסתיימת בהערה, נחבר את שתי המילים האחרונות ברווח בלתי-נתיק
    const rawWords = safeText.split(/\s+/);
    if (rawWords.length >= 4 && !rawWords[rawWords.length - 1].endsWith(fnClose)) {
        safeText = rawWords.slice(0, -2).join(' ') + ' ' + rawWords[rawWords.length - 2] + '\u00A0' + rawWords[rawWords.length - 1];
    }

    if (fnOpen && fnClose) {
        const escO = fnOpen.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const escC = fnClose.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        // תיקון קריטי: החלף את טקסט ההערה בסמן קטן (אות אחת) לפני המדידה.
        // הרינדור בפועל מחליף את ההערה בסמן על-כתבי קטן, אז המדידה צריכה לשקף זאת.
        safeText = safeText.replace(new RegExp(escO + '[\\s\\S]*?' + escC, 'g'), '\u05D0');
    }

    const words = safeText.split(/\s+/);
    if (words.length === 0) {
        return { lines: [], hasWindow: false, numLines: 0 };
    }

    // פעולה 4 — Knuth-Plass: נסה שבירת שורות אופטימלית לפני המסלול הישן.
    // אם Knuth-Plass זמין (Canvas + גופן טעון), הוא יחשב חלוקה אופטימלית
    // ונחזור מיד — ללא צורך ב-DOM probe יקר.
    if (isKnuthPlassAvailable(styleObj)) {
        try {
            const kpOpts = {
                tolerance: 200,
                linePenalty: 10,
                widowPenalty: 150,
                orphanPenalty: 150,
                lastLinePenalty: 0,
                overfullPenalty: 1000,
            };
            // אם יש drop word, נפחית את רוחב השורה הראשונה בגודל משוער של החלון.
            // נשתמש באומדן גס: רוחב המילה הראשונה * 1.5 (כדי לכסות את ה"חלון").
            // בעתיד אפשר למדוד את ה-CSS first-word-window במדויק.
            let firstLineWidthReduction = 0;
            const dropWordMode = document.getElementById('drop-word-mode')?.value || 'window';
            const dropWordCount = parseInt(document.getElementById('drop-word-count')?.value, 10) || 1;
            const dropWordMinLines = parseInt(document.getElementById('drop-word-min-lines')?.value, 10) || 2;
            // אומדן מהיר של מספר שורות כדי להחליט אם להפעיל drop word
            const quickEstimate = estimateLineCountCanvas(words, colWidth, styleObj, {
                wordSpacing: parseFloat(styleObj.wordSpacing) || 0,
                letterSpacing: parseFloat(styleObj.letterSpacing) || 0,
            });
            const shouldApplyWindowKP = useWindowIfMultipleLines
                && (quickEstimate.numLines >= dropWordMinLines)
                && (dropWordMode === 'window');

            if (shouldApplyWindowKP) {
                // רוחב החלון: רוחב המילים הראשונות + padding כלשהו
                const dropWordsStr = words.slice(0, Math.min(dropWordCount, words.length)).join(' ');
                const dropW = measureLineWidthCanvas(dropWordsStr, styleObj);
                // ה"חלון" תופס את העמודה הימנית של השורה הראשונה, בגובה 2-3 שורות.
                // השפעתו על רוחב השורה הראשונה: הוא מוריד את הרוחב הזמין בערך רוחב המילה.
                firstLineWidthReduction = Math.max(0, dropW - 10);
            }

            const kpResult = knuthPlassBreak(words, colWidth, styleObj, {
                ...kpOpts,
                firstLineWidthReduction,
                looseness: loosenessKey,  // פעולה 4 — העבר looseness
            });

            if (kpResult.lines.length > 0) {
                const result = {
                    lines: kpResult.lines,
                    hasWindow: shouldApplyWindowKP,
                    numLines: kpResult.numLines,
                    _fromKp: true,  // סימון שהשורות הגיעו מ-Knuth-Plass
                    // שדות נוספים לצורכי דיבאג
                    _kpTotalCost: kpResult.totalCost,
                    _kpFeasibility: kpResult.feasibility,
                    _kpLastLineWidth: kpResult.lastLineWidth,
                };
                _linesCache.set(key, result);
                return result;
            }
        } catch (e) {
            console.warn('Knuth-Plass failed, falling back to DOM:', e);
        }
    }

    const pMeasure = document.createElement('p');
    pMeasure.style.margin = '0';
    pMeasure.style.padding = '0';
    pMeasure.style.lineHeight = styleObj.lineHeight;

    // פעולה 3 חלק ב' — אומדן מהיר של מספר שורות בעזרת Canvas API.
    // במקום שני קריאות offsetHeight יקרות (Layout Thrashing), נשתמש ב-canvas
    // לאומדן גרידי של מספר השורות. אם canvas אינו זמין או הגופן אינו טעון —
    // נפול בחזרה למסלול ה-DOM הישן (singleLineHeight / oneLineH).
    let numLinesEstimated = 0;
    const canvasEstimate = estimateLineCountCanvas(words, colWidth, styleObj, {
        wordSpacing: parseFloat(styleObj.wordSpacing) || 0,
        letterSpacing: parseFloat(styleObj.letterSpacing) || 0,
    });
    if (canvasEstimate.numLines > 0) {
        numLinesEstimated = canvasEstimate.numLines;
    } else {
        // Fallback: מדידה ישנה ב-DOM
        pMeasure.textContent = text;
        measureContainer.appendChild(pMeasure);
        const singleLineHeight = pMeasure.offsetHeight;
        pMeasure.textContent = "א";
        const oneLineH = pMeasure.offsetHeight;
        numLinesEstimated = Math.max(1, Math.round(singleLineHeight / oneLineH));
    }

    const minLines = parseInt(document.getElementById('drop-word-min-lines')?.value, 10) || 2;
    const mode = document.getElementById('drop-word-mode')?.value || 'window';
    let shouldApplyWindow = useWindowIfMultipleLines && (numLinesEstimated >= minLines) && (mode === 'window');

    const wordCount = parseInt(document.getElementById('drop-word-count')?.value, 10) || 1;
    const dropWords = words.slice(0, Math.min(wordCount, words.length)).join(' ').replace(/\uE000/g, ' ');

    // FIX: אם נראה שצריך drop word — בונים את ה-HTML עם ה-float, מודדים מחדש,
    // ומעדכנים numLinesEstimated לערך האמיתי שכולל את השפעת ה-float.
    // זה מונע מצב שבו ה-drop word דוחף שורה נוספת שלא חושבה.
    let html = '';
    if (shouldApplyWindow) {
        html += `<span class="first-word-window" id="mw-0">${escapeHTML(dropWords)}</span> `;
        for (let i = wordCount; i < words.length; i++) {
            const w = words[i];
            const isNote = w.startsWith(fnOpen) && w.endsWith(fnClose);
            const displayW = isNote ? ' א ' : escapeHTML(w.replace(/\uE000/g, ' '));
            html += `<span id="mw-${i}">${displayW}</span> `;
        }
    } else {
        for (let i = 0; i < words.length; i++) {
            const w = words[i];
            const isNote = w.startsWith(fnOpen) && w.endsWith(fnClose);
            const displayW = isNote ? ' א ' : escapeHTML(w.replace(/\uE000/g, ' '));
            html += `<span id="mw-${i}">${displayW}</span> `;
        }
    }

    pMeasure.innerHTML = html;
    // נוודא ש-pMeasure מחובר ל-DOM לפני קריאת offsetTop של ה-spans הפנימיים.
    // במסלול ה-canvas לא בוצע appendChild מוקדם יותר, לכן נעשה זאת כאן.
    if (!pMeasure.parentNode) {
        measureContainer.appendChild(pMeasure);
    }

    // FIX: מדידה מחדש של numLines עם ה-drop word בפועל.
    // אם ה-drop word דחף שורה נוספת, numLines יהיה גבוה יותר מ-numLinesEstimated.
    // כעת נשתמש בערך המדויק לכל החישובים הבאים.
    const lines = [];
    let currentLine = [];
    let currentTop = -1;
    const startIndex = shouldApplyWindow ? wordCount : 0;
    if (shouldApplyWindow) {
        currentLine.push(dropWords);
    }

    for (let i = startIndex; i < words.length; i++) {
        const span = document.getElementById(`mw-${i}`);
        if (!span) continue;
        const top = span.offsetTop;
        if (currentTop === -1) currentTop = top;
        const realWord = words[i].replace(/\uE000/g, ' ');
        if (Math.abs(top - currentTop) > 8 && currentLine.length > 0) {
            lines.push(currentLine.join(' '));
            currentLine = [realWord];
            currentTop = top;
        } else {
            currentLine.push(realWord);
        }
    }
    if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
    }

    measureContainer.innerHTML = '';
    const result = {
        lines,
        hasWindow: shouldApplyWindow,
        numLines: lines.length
    };
    // שמור במטמון
    _linesCache.set(key, result);
    return result;
}

/* ==========================================================================
   4א. תשתית מדידה מבודדת ומלאה (V2) — שלב א' מהרפאקטורינג הארכיטקטוני
   ==========================================================================
   הבעיה שפותר מודול זה:
   ה-`getLinesFromParagraph` הישן מודד ב-`#measuring-box` עם סט בסיסי של
   textAlign/textJustify/direction, אבל אינו משכפל את הסגנונות האמיתיים
   של הפסקה ב-DOM החי — class, font, font-size, line-height, margins,
   spans פנימיים (drop-word, dibbur-hamatchil), הערות שוליים, המשך פסקה.
   
   התוצאה: חישוב ≠ דפדפן, ואז `distributeColumnJustification` מנסה "לתקן"
   בעזרת word-spacing/margin-bottom, אבל חלוקת המילים כבר שגויה.
   
   הפתרון: בניית עותק DOM מלא של הפסקה כפי שתיראה בפועל, ומדידתו.
   ========================================================================== */

/**
 * _measureBoxV2 — מכולת מדידה מבודדת ייעודית ל-V2.
 * מופעלת רק דרך measureCandidateLines; אינה חולקת מצב עם הישן.
 */
let _measureBoxV2 = null;

function _getMeasureBoxV2() {
    if (!_measureBoxV2) {
        _measureBoxV2 = document.createElement('div');
        _measureBoxV2.id = 'measuring-box-v2';
        _measureBoxV2.setAttribute('aria-hidden', 'true');
        // מיקום מחוץ למסך; נשאר ב-flow הרגיל כדי שה-CSS הגלובלי יחול.
        _measureBoxV2.style.cssText = 'position:absolute; top:-99999px; left:-99999px; visibility:hidden; pointer-events:none; z-index:-1;';
        document.body.appendChild(_measureBoxV2);
    }
    return _measureBoxV2;
}

/**
 * buildMeasureClone — בונה עותק DOM מלא של פסקה כפי שתיראה בפועל.
 * 
 * @param {object} opts
 * @param {string} opts.rawText — טקסט הפסקה הגולמי (עם תוחמי הערות)
 * @param {number} opts.colWidth — רוחב הטור בפיקסלים
 * @param {object} opts.styleObj — { fontFamily, fontSize, lineHeight }
 * @param {boolean} opts.isContinuation — האם פסקת המשך (אין drop-word / dibbur)
 * @param {boolean} opts.isSingleLine — האם ידוע שפסקה בת שורה אחת
 * @param {number} opts.numLines — אומדן מספר שורות (להחלטת drop-word)
 * @param {string} opts.contextClass — class נוסף לפסקה ('p-cut' | 'p-end' | '')
 * @param {boolean} opts.applyDelimiters — הא להפעיל applyDelimiterStyles
 * @param {string[]} opts.noteSpans — מערך תוחמי הערות שזוהו (למדידה מדויקת גובה)
 * @returns {HTMLElement} אלמנט p שניתן למדידה (offsetHeight, scrollHeight)
 */
function buildMeasureClone(opts) {
    const {
        rawText = '',
        colWidth,
        styleObj = {},
        isContinuation = false,
        isSingleLine = false,
        numLines = 0,
        contextClass = '',
        applyDelimiters = true,
    } = opts;
    
    if (!rawText) return null;
    
    const box = _getMeasureBoxV2();
    box.innerHTML = '';
    box.style.width = colWidth + 'px';
    box.style.fontFamily = styleObj.fontFamily || "'פרנק רוהל ליברה רגיל', serif";
    box.style.fontSize = styleObj.fontSize || "'פרנק רוהל ליברה רגיל', serif";
    box.style.lineHeight = String(styleObj.lineHeight || 1.34);
    box.style.textAlign = 'justify';
    box.style.textJustify = 'inter-word';
    box.style.direction = 'rtl';
    
    // בונים את אלמנט ה-<p> עם כל ה-classים שיחולו בפועל
    const p = document.createElement('p');
    const classes = ['main-paragraph'];
    if (isContinuation) classes.push('p-cut');
    else classes.push('p-end');
    if (contextClass && !classes.includes(contextClass)) classes.push(contextClass);
    p.className = classes.join(' ');
    p.style.margin = '0';
    p.style.padding = '0';
    
    // עטיפת הטקסט ב-drop-word + dibbur-hamatchil באופן זהה לפונקציות האמיתיות
    // אבל בלי לעבוד על HTML גולמי — משתמשים ב-createDropWord שכבר מבצע escapeHTML
    let html;
    if (isContinuation) {
        // פסקת המשך: אין drop-word, אין dibbur-hamatchil; רק טקסט מאוסקייפ
        html = escapeHTML(rawText);
    } else {
        html = createDropWord(rawText, isContinuation, isSingleLine, numLines || 2);
    }
    p.innerHTML = html;
    
    box.appendChild(p);
    
    // אם יש הערות שוליים שיוזרמו לתחתית העמוד, הן לא משפיעות על גובה הפסקה —
    // אבל כן משפיעות על "החלפת תוכן הערה בתו דמה" שצריך להתבצע.
    if (applyDelimiters && typeof applyDelimiterStyles === 'function') {
        // דגל isDryRun=true מונע שינוי state גלובלי (הוספת הערה לתור).
        try {
            applyDelimiterStyles(p, 'body', getBodySizePt ? getBodySizePt() : 11, true);
        } catch (e) {
            console.warn('buildMeasureClone: applyDelimiterStyles failed', e);
        }
    }
    
    return p;
}

/**
 * measureCandidateLines — מודד פסקה בעותק מבודד ומחזיר נתוני שורות מדויקים.
 * 
 * @param {object} opts — אותם אפשרויות כמו buildMeasureClone
 * @returns {{ lines: string[], numLines: number, height: number, lastLineWidth: number,
 *            lastLineCharCount: number, hasWindow: boolean }}
 */
function measureCandidateLines(opts) {
    const p = buildMeasureClone(opts);
    if (!p) {
        return { lines: [], numLines: 0, height: 0, lastLineWidth: 0, lastLineCharCount: 0, hasWindow: false };
    }
    
    // עטיפת כל מילה ב-<span> למדידת offsetTop
    const fnOpen = document.getElementById('fn-delim-open')?.value?.trim() || '[';
    const fnClose = document.getElementById('fn-delim-close')?.value?.trim() || ']';
    let safeText = (opts.rawText || '').trim();
    
    // Atomic Lock: נעילת רווחים בתוך תוחמי הערות
    if (fnOpen && fnClose) {
        const escO = fnOpen.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const escC = fnClose.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        // תיקון קריטי: החלף את טקסט ההערה בסמן קטן (אות אחת) לפני המדידה.
        // הרינדור בפועל מחליף את ההערה בסמן על-כתבי קטן, אז המדידה צריכה לשקף זאת.
        safeText = safeText.replace(new RegExp(escO + '[\\s\\S]*?' + escC, 'g'), '\u05D0');
    }
    
    const words = safeText.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) {
        return { lines: [], numLines: 0, height: 0, lastLineWidth: 0, lastLineCharCount: 0, hasWindow: false };
    }
    
    // עטיפת כל מילה ב-span עם id ייחודי לכדי מדידת offsetTop
    // ה-id כולל prefix ייחודי כדי לא להתנגש עם mw-* של הישן
    const measureId = 'mc-' + Math.random().toString(36).slice(2, 8);
    const dropMode = document.getElementById('drop-word-mode')?.value || 'window';
    const wordCount = parseInt(document.getElementById('drop-word-count')?.value, 10) || 1;
    const minLines = parseInt(document.getElementById('drop-word-min-lines')?.value, 10) || 2;
    const meetsThreshold = (opts.numLines >= minLines) && !opts.isSingleLine && !opts.isContinuation;
    const shouldApplyWindow = (dropMode === 'window') && meetsThreshold;
    
    let html = '';
    if (shouldApplyWindow) {
        const dropWords = escapeHTML(words.slice(0, Math.min(wordCount, words.length)).join(' ').replace(/\uE000/g, ' '));
        html += `<span class="first-word-window" id="${measureId}-0">${dropWords}</span> `;
        for (let i = wordCount; i < words.length; i++) {
            const w = words[i];
            const isNote = w.startsWith(fnOpen) && w.endsWith(fnClose);
            const displayW = isNote ? ' א ' : escapeHTML(w.replace(/\uE000/g, ' '));
            html += `<span id="${measureId}-${i}">${displayW}</span> `;
        }
    } else {
        for (let i = 0; i < words.length; i++) {
            const w = words[i];
            const isNote = w.startsWith(fnOpen) && w.endsWith(fnClose);
            const displayW = isNote ? ' א ' : escapeHTML(w.replace(/\uE000/g, ' '));
            html += `<span id="${measureId}-${i}">${displayW}</span> `;
        }
    }
    
    p.innerHTML = html;
    
    // דגימת offsetTop של כל מילה כדי לחלק שורות
    const lines = [];
    let currentLine = [];
    let currentTop = -1;
    const startIndex = shouldApplyWindow ? wordCount : 0;
    if (shouldApplyWindow) {
        currentLine.push(words.slice(0, wordCount).join(' ').replace(/\uE000/g, ' '));
    }
    
    const TOL = 8; // tolerance px לזיהוי מעבר שורה
    for (let i = startIndex; i < words.length; i++) {
        const span = document.getElementById(`${measureId}-${i}`);
        if (!span) continue;
        const top = span.offsetTop;
        if (currentTop === -1) currentTop = top;
        const realWord = words[i].replace(/\uE000/g, ' ');
        if (Math.abs(top - currentTop) > TOL && currentLine.length > 0) {
            lines.push(currentLine.join(' '));
            currentLine = [realWord];
            currentTop = top;
        } else {
            currentLine.push(realWord);
        }
    }
    if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
    }
    
    // ניקוי ה-ids הזמניים
    for (let i = 0; i < words.length; i++) {
        const span = document.getElementById(`${measureId}-${i}`);
        if (span) span.removeAttribute('id');
    }
    
    const height = p.offsetHeight;
    const lastLine = lines[lines.length - 1] || '';
    
    // פעולה 3 חלק ב' — מדידת רוחב השורה האחרונה בעזרת Canvas API.
    // במקום יצירת span זמני וקריאת offsetWidth (Layout Thrashing), נשתמש
    // ב-canvas.measureText שאינו מזיז reflow. אם canvas אינו זמין או הגופן
    // אינו טעון — נפול בחזרה למדידת ה-DOM הישנה.
    // שים לב: נשתמש ב-getComputedStyle(p) כדי לקבל את הגופן בפועל שהופעל
    // על הפסקה (כולל פולבק מ-buildMeasureClone), במקום להסתמך על opts.styleObj
    // שעלול להיות חלקי.
    let lastLineWidth = 0;
    if (lastLine) {
        let computedStyleObj = opts.styleObj || {};
        try {
            const cs = getComputedStyle(p);
            if (cs.fontFamily && cs.fontSize) {
                computedStyleObj = { fontFamily: cs.fontFamily, fontSize: cs.fontSize };
            }
        } catch (e) { /* fallback ל-opts.styleObj */ }
        const canvasW = measureLineWidthCanvas(lastLine, computedStyleObj);
        if (canvasW > 0) {
            lastLineWidth = canvasW;
        } else {
            // Fallback: DOM span measurement
            const measureSpan = document.createElement('span');
            measureSpan.style.cssText = 'display:inline-block; visibility:hidden;';
            measureSpan.textContent = lastLine;
            p.appendChild(measureSpan);
            lastLineWidth = measureSpan.offsetWidth;
            p.removeChild(measureSpan);
        }
    }
    
    // ניקוי
    _getMeasureBoxV2().innerHTML = '';
    
    return {
        lines,
        numLines: lines.length,
        height,
        lastLineWidth,
        lastLineCharCount: lastLine.length,
        lastLineWordCount: lastLine.split(/\s+/).filter(w => w.length > 0).length,
        hasWindow: shouldApplyWindow,
    };
}

/**
 * measureParagraphHeight — פונקציית עזר פשוטה שמחזירה רק גובה מדויק של פסקה.
 * משמש ל-balanceColumns החדש כדי להשוות מועמדים בעלות נמוכה.
 */
function measureParagraphHeight(rawText, colWidth, styleObj, opts = {}) {
    const result = measureCandidateLines({
        rawText,
        colWidth,
        styleObj,
        isContinuation: opts.isContinuation || false,
        isSingleLine: opts.isSingleLine || false,
        numLines: opts.numLines || 0,
        contextClass: opts.contextClass || '',
        applyDelimiters: opts.applyDelimiters !== false,
    });
    return result.height;
}

/**
 * measurePartialLines — מודד רק N השורות הראשונות של פסקה.
 * משמש לחישוב "כמה מקום תופסות K שורות מתוך פסקה באורך M".
 * 
 * @returns {{ lines: string[], height: number, lastLineWidth: number, allLines: string[] }}
 */
function measurePartialLines(rawText, colWidth, styleObj, lineCount, opts = {}) {
    const full = measureCandidateLines({
        rawText,
        colWidth,
        styleObj,
        isContinuation: opts.isContinuation || false,
        isSingleLine: false,
        numLines: 0,
        contextClass: opts.contextClass || '',
        applyDelimiters: opts.applyDelimiters !== false,
    });
    
    if (lineCount >= full.lines.length) {
        return {
            lines: full.lines,
            height: full.height,
            lastLineWidth: full.lastLineWidth,
            allLines: full.lines,
        };
    }
    
    // נמדוד מחדש את K השורות הראשונות בלבד
    const partialText = full.lines.slice(0, lineCount).join(' ');
    const partial = measureCandidateLines({
        rawText: partialText,
        colWidth,
        styleObj,
        isContinuation: opts.isContinuation || false,
        isSingleLine: (lineCount === 1),
        numLines: lineCount,
        contextClass: opts.contextClass || 'p-cut',
        applyDelimiters: false,  // הערות כבר טופלו ב-measureCandidateLines הראשון
    });
    
    return {
        lines: partial.lines,
        height: partial.height,
        lastLineWidth: partial.lastLineWidth,
        allLines: full.lines,
    };
}

function getWidowOrphanPrefs() {
    return {
        avoidOrphans: document.getElementById('avoid-orphans')?.checked ?? true,
        avoidWidows: document.getElementById('avoid-widows')?.checked ?? true
    };
}

function lineBreakCharIndex(lines, lineCount) {
    if (lineCount <= 0) return 0;
    if (lineCount >= lines.length) return lines.join(' ').length;
    return lines.slice(0, lineCount).join(' ').length + 1;
}

function lineBreakCrossesNoteSpan(lines, fit) {
    if (fit <= 0 || fit >= lines.length) return false;
    const fullText = lines.join(' ');
    const spans = findDelimiterMatches(fullText, 'body');
    if (!spans.length) return false;
    const cutAt = lineBreakCharIndex(lines, fit);
    return spans.some(m => cutAt > m.start && cutAt < m.end);
}

function adjustFitLineForNoteSpans(lines, bestFitLine) {
    if (bestFitLine <= 0 || bestFitLine >= lines.length) return bestFitLine;
    if (!lineBreakCrossesNoteSpan(lines, bestFitLine)) return bestFitLine;
    for (let fit = bestFitLine; fit > 0; fit--) {
        if (!lineBreakCrossesNoteSpan(lines, fit)) return fit;
    }
    for (let fit = bestFitLine + 1; fit <= lines.length; fit++) {
        if (!lineBreakCrossesNoteSpan(lines, fit)) return fit;
    }
    return bestFitLine;
}

function applyWidowOrphanToFitLine(lines, fit, pageHasContent) {
    const { avoidOrphans, avoidWidows } = getWidowOrphanPrefs();
    if (fit <= 0 || fit >= lines.length) {
        return { fit, forcePageBreak: false };
    }
    const remainingAfterSplit = lines.length - fit;
    if (avoidWidows && fit === 1 && pageHasContent) {
        return { fit: 0, forcePageBreak: true };
    }
    if (avoidOrphans && remainingAfterSplit === 1) {
        if (fit > 1) {
            return { fit: fit - 1, forcePageBreak: false };
        }
        if (pageHasContent) {
            return { fit: 0, forcePageBreak: true };
        }
    }
    return { fit, forcePageBreak: false };
}

function refineParagraphFitLine(lines, initialFit, pageHasContent, maxFit) {
    let fit = Math.min(initialFit, maxFit);
    const hardMax = maxFit;
    for (let guard = 0; guard < 16; guard++) {
        const prev = fit;
        fit = adjustFitLineForNoteSpans(lines, fit);
        fit = Math.min(fit, hardMax);
        const wo = applyWidowOrphanToFitLine(lines, fit, pageHasContent);
        if (wo.forcePageBreak) {
            return { fit: 0, forcePageBreak: true };
        }
        fit = Math.min(wo.fit, hardMax);
        fit = adjustFitLineForNoteSpans(lines, fit);
        fit = Math.min(fit, hardMax);
        if (fit === prev) break;
    }
    return { fit, forcePageBreak: false };
}

function renderParagraphProbe(pElem, testText, isContinuation, hasWindow, totalLines, isEndOfP) {
    pElem.className = isEndOfP ? 'p-end' : 'p-cut';
    pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow, totalLines);
    applyDelimiterStyles(pElem, 'body', getBodySizePt(), true);
}

function measureMaxFitLines(pElem, targetCol, lines, isContinuation, hasWindow, availH) {
    let bestFitLine = 0;
    for (let i = 1; i <= lines.length; i++) {
        const testText = lines.slice(0, i).join(' ');
        renderParagraphProbe(pElem, testText, isContinuation, hasWindow, lines.length, i === lines.length);
        if (targetCol.scrollHeight <= availH) bestFitLine = i;
        else break;
    }
    return bestFitLine;
}

function shrinkFitUntilFitsDry(pElem, targetCol, lines, fit, isContinuation, hasWindow, availH) {
    let f = fit;
    while (f > 0) {
        renderParagraphProbe(
            pElem,
            lines.slice(0, f).join(' '),
            isContinuation,
            hasWindow,
            lines.length,
            f === lines.length
        );
        if (targetCol.scrollHeight <= availH) return f;
        f--;
    }
    return 0;
}

/**
 * pullWordsToLastLine — מושך מילים מהשורה הבאה (המשך) לשורה האחרונה של ה-p-cut
 * כדי למנוע שורה אחרונה דלילה עם רווחים עצומים מ-text-align-last: justify.
 *
 * @param {Array} lines - כל השורות של הפסקה
 * @param {number} bestFitLine - כמות השורות שנכנסות בטור הנוכחי
 * @param {number} colWidth - רוחב הטור
 * @param {object} styleObj - { fontFamily, fontSize, lineHeight }
 * @returns {object} { chunkLines, remainingLines } — שורות מעודכנות
 */
function pullWordsToLastLine(lines, bestFitLine, colWidth, styleObj) {
    if (bestFitLine >= lines.length || bestFitLine < 1) {
        return { chunkLines: lines.slice(0, bestFitLine), remainingLines: lines.slice(bestFitLine) };
    }

    const lastLine = lines[bestFitLine - 1];
    const nextLine = lines[bestFitLine];
    if (!lastLine || !nextLine) {
        return { chunkLines: lines.slice(0, bestFitLine), remainingLines: lines.slice(bestFitLine) };
    }

    // בדוק אם השורה האחרונה דלילה (פחות מ-70% מילוי)
    const lastLineWidth = measureLineWidthCanvas(lastLine, styleObj);
    if (lastLineWidth > colWidth * 0.7) {
        // השורה מלאה מספיק — לא צריך למשוך מילים
        return { chunkLines: lines.slice(0, bestFitLine), remainingLines: lines.slice(bestFitLine) };
    }

    // נסה למשוך מילים מהשורה הבאה לשורה האחרונה
    const nextWords = nextLine.split(/\s+/).filter(w => w.length > 0);
    const lastWords = lastLine.split(/\s+/).filter(w => w.length > 0);

    let pulled = 0;
    let newLastWords = lastWords.slice();
    let remainingNextWords = nextWords.slice();

    while (remainingNextWords.length > 0 && pulled < 10) {
        const candidateWords = newLastWords.concat([remainingNextWords[0]]);
        const candidateLine = candidateWords.join(' ');
        const candidateWidth = measureLineWidthCanvas(candidateLine, styleObj);

        // בדוק אם המילה הנוספת עדיין נכנסת ברוחב הטור (עם רווח)
        if (candidateWidth <= colWidth) {
            newLastWords = candidateWords;
            remainingNextWords = remainingNextWords.slice(1);
            pulled++;
        } else {
            break;
        }
    }

    if (pulled === 0) {
        // לא הצלחנו למשוך אף מילה
        return { chunkLines: lines.slice(0, bestFitLine), remainingLines: lines.slice(bestFitLine) };
    }

    // בנה את השורות החדשות
    const newLastLine = newLastWords.join(' ');
    const newNextLine = remainingNextWords.join(' ');

    const newChunkLines = lines.slice(0, bestFitLine - 1).concat([newLastLine]);
    let newRemainingLines = lines.slice(bestFitLine + 1);
    if (newNextLine.length > 0) {
        newRemainingLines = [newNextLine].concat(newRemainingLines);
    }

    return { chunkLines: newChunkLines, remainingLines: newRemainingLines };
}

function canHeadingFitWithBody(targetCol, headingTok, nextToks, colWidth, styleObj, availH) {
    const { avoidOrphans } = getWidowOrphanPrefs();
    if (!avoidOrphans) return true;

    const hProbe = document.createElement('div');
    hProbe.className = headingTok.customStyleId ? 'title-level-custom' : `title-level-${headingTok.level}`;
    hProbe.textContent = headingTok.text;
    targetCol.appendChild(hProbe);

    let nextIdx = 0;
    let intermediateHeadings = [];

    while (nextIdx < nextToks.length && nextToks[nextIdx] && nextToks[nextIdx].type.startsWith('h')) {
        const nextH = nextToks[nextIdx];
        const subHProbe = document.createElement('div');
        subHProbe.className = nextH.customStyleId ? 'title-level-custom' : `title-level-${nextH.level}`;
        subHProbe.textContent = nextH.text;
        targetCol.appendChild(subHProbe);
        intermediateHeadings.push(subHProbe);
        nextIdx++;
    }

    const bodyTok = nextToks[nextIdx];
    let fits = false;

    if (bodyTok && bodyTok.type === 'p') {
        const linesInfo = getLinesFromParagraph(bodyTok.text, colWidth, styleObj, true);
        if (linesInfo.lines.length > 0) {
            const needLines = linesInfo.lines.length >= 2 ? 2 : 1;
            const pProbe = document.createElement('p');
            targetCol.appendChild(pProbe);
            renderParagraphProbe(
                pProbe,
                linesInfo.lines.slice(0, needLines).join(' '),
                false,
                linesInfo.hasWindow,
                linesInfo.lines.length,
                needLines === linesInfo.lines.length
            );
            fits = (targetCol.scrollHeight <= availH);
            targetCol.removeChild(pProbe);
        } else {
            fits = (targetCol.scrollHeight <= availH);
        }
    } else {
        fits = false;
    }

    intermediateHeadings.forEach(el => targetCol.removeChild(el));
    targetCol.removeChild(hProbe);
    return fits;
}

/* ==========================================================================
   5. תקצוב גובה דטרמיניסטי לעמוד ולטורים
   ========================================================================== */
function getPageFlowBudget(pageEl, extraFootnoteQueue = []) {
    const wrapper = pageEl ? pageEl.querySelector('.page-content-wrapper') : null;
    const header = pageEl ? pageEl.querySelector('.top-header-grid') : null;
    const footer = pageEl ? pageEl.querySelector('.page-number-footer') : null;

    const totalWrapperH = wrapper ? wrapper.clientHeight : 1009;
    const headerH = header ? (header.offsetHeight + 4) : 30;
    const footerH = footer ? footer.offsetHeight : 24;
    const flowMt = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--flow-mt')) || 20;
    const flowMb = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--flow-mb')) || 20;

    const allFn = (footnoteQueueForPage || []).concat(extraFootnoteQueue || []);
    const cfg0 = allFn.length ? getNoteConfig(allFn[0].styleId) : {};
    const colCount = parseInt(document.getElementById('fn-columns')?.value, 10) || cfg0.columns || 1;
    const fnReserveH = allFn.length ? measureFootnoteAreaReserve(allFn, colCount) : 0;

    return Math.max(0, totalWrapperH - headerH - footerH - flowMt - flowMb - fnReserveH);
}

function getBlockColumnBudget(bodyFlow, pageEl, activeBlock = null, extraFootnoteQueue = []) {
    const totalFlowBudget = getPageFlowBudget(pageEl, extraFootnoteQueue);
    let usedAbove = 0;
    if (bodyFlow) {
        for (const child of bodyFlow.children) {
            if (activeBlock && child === activeBlock) break;
            const st = window.getComputedStyle(child);
            usedAbove += child.offsetHeight + (parseFloat(st.marginTop) || 0) + (parseFloat(st.marginBottom) || 0);
        }
    }
    return Math.max(0, totalFlowBudget - usedAbove - 2);
}

/* ==========================================================================
   6. יישור טורים לפי סדרי עדיפויות מדויקים (1 עד 5) + חלוקה מדורגת
   ========================================================================== */
function isInlineHeadingLevel3456(el) {
    if (!el || !el.className) return false;
    if (/title-level-[3-6]\b/.test(String(el.className))) return true;
    return el.classList.contains('title-level-custom');
}

function measureColScrollDelta(col, fn) {
    const before = col.scrollHeight;
    fn();
    return Math.max(0, col.scrollHeight - before);
}

function distributeColumnJustification(shortCol, neededGrowth, styleObj, heightCeiling, colWidth, traceObj = null) {
    if (!shortCol || neededGrowth <= 2) return 0;

    let remaining = neededGrowth;
    const logDetails = { neededGrowth, heightCeiling, tiersApplied: {} };

    function colOverCeiling() {
        return heightCeiling < Infinity && shortCol.scrollHeight > heightCeiling + 1;
    }

    function queryHeadings() {
        return Array.from(shortCol.querySelectorAll('.title-level-3, .title-level-4, .title-level-5, .title-level-6, .title-level-custom'))
            .filter(isInlineHeadingLevel3456);
    }

    // 1. הגדלת רווח לפני כותרת (כותרות 3,4,5,6 - למעט כותרת בראש הטור)
    function applyPriority1_HeadingBefore(budget) {
        const headings = queryHeadings().filter(h => h !== shortCol.firstElementChild);
        if (!headings.length || budget <= 0.5) return 0;
        const perHead = Math.min(30, budget / headings.length);
        let applied = 0;
        headings.forEach(h => {
            if (applied >= budget - 0.5 || colOverCeiling()) return;
            const share = Math.min(perHead, budget - applied);
            const base = parseFloat(window.getComputedStyle(h).marginTop) || 0;
            const prev = h.style.marginTop;
            const delta = measureColScrollDelta(shortCol, () => {
                h.style.marginTop = (base + share) + 'px';
            });
            if (colOverCeiling()) {
                h.style.marginTop = prev;
            } else {
                applied += delta;
            }
        });
        logDetails.tiersApplied['priority1_headingBefore'] = (logDetails.tiersApplied['priority1_headingBefore'] || 0) + applied;
        return applied;
    }

    // 2. הגדלת רווח אחרי כותרת (כותרות 3,4,5,6)
    function applyPriority2_HeadingAfter(budget) {
        const headings = queryHeadings();
        if (!headings.length || budget <= 0.5) return 0;
        const perHead = Math.min(22, budget / headings.length);
        let applied = 0;
        headings.forEach(h => {
            if (applied >= budget - 0.5 || colOverCeiling()) return;
            const share = Math.min(perHead, budget - applied);
            const base = parseFloat(window.getComputedStyle(h).marginBottom) || 0;
            const prev = h.style.marginBottom;
            const delta = measureColScrollDelta(shortCol, () => {
                h.style.marginBottom = (base + share) + 'px';
            });
            if (colOverCeiling()) {
                h.style.marginBottom = prev;
            } else {
                applied += delta;
            }
        });
        logDetails.tiersApplied['priority2_headingAfter'] = (logDetails.tiersApplied['priority2_headingAfter'] || 0) + applied;
        return applied;
    }

    // 2.5 הגדלת margin-bottom של H5 דווקא (בלוף איזון ייעודי)
    // P2.5 — תיקון ייעודי לבעיית H5 בטור: H5 יוצר גובה עודף של ~16px
    // ש-P1-P5 הרגילים לא מצליחים לפצות עליו. ה-tier הזה מגדיל את
    // margin-bottom של H5 דווקא כדי למלא את הפער.
    function applyPriority2_5_H5MarginBottom(budget) {
        const h5Headings = queryHeadings().filter(h => h.classList.contains('title-level-5'));
        if (!h5Headings.length || budget <= 0.5) return 0;
        const perHead = Math.min(18, budget / h5Headings.length);
        let applied = 0;
        h5Headings.forEach(h => {
            if (applied >= budget - 0.5 || colOverCeiling()) return;
            const share = Math.min(perHead, budget - applied);
            const base = parseFloat(window.getComputedStyle(h).marginBottom) || 0;
            const prev = h.style.marginBottom;
            const delta = measureColScrollDelta(shortCol, () => {
                h.style.marginBottom = (base + share) + 'px';
            });
            if (colOverCeiling()) {
                h.style.marginBottom = prev;
            } else {
                applied += delta;
            }
        });
        logDetails.tiersApplied['priority2_5_h5MarginBottom'] = (logDetails.tiersApplied['priority2_5_h5MarginBottom'] || 0) + applied;
        return applied;
    }

    // 3. הגדלת רווח בין פסקאות
    function applyPriority3_ParagraphSpacing(budget) {
        const pElements = Array.from(shortCol.querySelectorAll('p'));
        if (pElements.length < 2 || budget <= 0.5) return 0;
        const perGap = Math.min(24, budget / (pElements.length - 1));
        let applied = 0;
        pElements.slice(0, -1).forEach(p => {
            if (applied >= budget - 0.5 || colOverCeiling()) return;
            const share = Math.min(perGap, budget - applied);
            const base = parseFloat(window.getComputedStyle(p).marginBottom) || 7;
            const prev = p.style.marginBottom;
            const delta = measureColScrollDelta(shortCol, () => {
                p.style.marginBottom = (base + share) + 'px';
            });
            if (colOverCeiling()) {
                p.style.marginBottom = prev;
            } else {
                applied += delta;
            }
        });
        logDetails.tiersApplied['priority3_paragraphSpacing'] = (logDetails.tiersApplied['priority3_paragraphSpacing'] || 0) + applied;
        return applied;
    }

    // 4. הגדלת רווח בין שורות (Line-Height)
    function applyPriority4_LineHeight(budget) {
        const pElements = Array.from(shortCol.querySelectorAll('p'));
        if (!pElements.length || budget <= 0.5) return 0;
        const baseLh = parseFloat(styleObj.lineHeight) || 1.34;
        const fontSizePx = parseFloat(styleObj.fontSize) * 1.333 || 15;
        let applied = 0;
        pElements.forEach(p => {
            if (applied >= budget - 0.5 || colOverCeiling()) return;
            const linesInfo = getLinesFromParagraph(
                p.getAttribute('data-raw-text') || p.textContent,
                colWidth || shortCol.offsetWidth,
                styleObj,
                false
            );
            const n = Math.max(1, linesInfo.lines.length);
            const extraLh = Math.min((budget - applied) / n / fontSizePx, 0.18);  // חזר ל-0.18
            if (extraLh <= 0.001) return;
            const prev = p.style.lineHeight;
            const delta = measureColScrollDelta(shortCol, () => {
                p.style.lineHeight = (baseLh + extraLh).toString();
            });
            if (colOverCeiling()) {
                p.style.lineHeight = prev;
            } else {
                // תיקון קריטי: הסרנו את refuse-to-fill-with-runt מ-P4.
                // line-height לא משנה את שבירת השורות (רק מרווח אנכי),
                // ולכן הבדיקה תמיד ראתה את אותו מספר מילים בשורה האחרונה וחסמה כל גידול.
                // ה-refuse-to-fill-with-runt רלוונטי רק ל-P5 (word-spacing) שכן משנה שבירת שורות.
                applied += delta;
            }
        });
        logDetails.tiersApplied['priority4_lineHeight'] = (logDetails.tiersApplied['priority4_lineHeight'] || 0) + applied;
        return applied;
    }

    // 5. הגדלת רווח בין מילים בפיסקה שבטור הקצר (ליצירת תוספת של שורה)
    // תיקון v12: שימוש בצעדים עדינים (0.1px) עם חיפוש בינארי לדיוק מקסימלי.
    // לפני זה, הצעדים היו 0.5px — כל צעד יכול היה להוסיף ~21px, מה שגרם ל-overshoot.
    function applyPriority5_WordSpacing(budget) {
        const pElements = Array.from(shortCol.querySelectorAll('p'));
        const p = pElements[pElements.length - 1];
        if (!p || budget <= 0.5) return 0;
        const raw = p.getAttribute('data-raw-text') || p.textContent || '';
        if (!raw.trim()) return 0;

        const colWidthLocal = colWidth || shortCol.offsetWidth;
        const beforeHeight = shortCol.scrollHeight;
        let applied = 0;
        let lastGood = '';

        // שלב א': חיפוש לינארי עם צעדים עדינים (0.1px)
        for (let ws = 0.1; ws <= 8; ws += 0.1) {
            if (applied >= budget - 0.3) break;
            const prev = p.style.wordSpacing;
            const delta = measureColScrollDelta(shortCol, () => {
                p.style.wordSpacing = ws.toFixed(1) + 'px';
            });
            if (colOverCeiling()) {
                p.style.wordSpacing = lastGood;
                break;
            }
            if (delta > 0.3) {
                // refuse-to-fill-with-runt: בדוק רק אם המצב החמיר
                const beforeLines = getLinesFromParagraph(raw, colWidthLocal, { ...styleObj, wordSpacing: prev }, false);
                const beforeLastWords = beforeLines.lines.length > 0
                    ? beforeLines.lines[beforeLines.lines.length - 1].split(/\s+/).filter(w => w.length > 0).length
                    : 99;
                const afterLines = getLinesFromParagraph(raw, colWidthLocal, styleObj, false);
                const afterLastLine = afterLines.lines[afterLines.lines.length - 1] || '';
                const afterLastWords = afterLastLine.split(/\s+/).filter(w => w.length > 0).length;
                if (beforeLastWords >= 3 && afterLastWords > 0 && afterLastWords <= 2) {
                    p.style.wordSpacing = lastGood || prev;
                    break;
                }
                applied += delta;
                lastGood = ws.toFixed(1) + 'px';
                // אם חרגנו ב-2px+ מה-budget, חזור אחורה
                if (applied > budget + 2) {
                    p.style.wordSpacing = lastGood;
                    applied -= delta;
                    break;
                }
            } else {
                p.style.wordSpacing = prev;
            }
        }

        // שלב ב': אם עדיין חסר (applied < budget - 2), נסה חיפוש בינארי עדין יותר
        if (applied < budget - 2 && lastGood) {
            // נסה להגדיל את ws בעדינות של 0.01px
            const lastWsVal = parseFloat(lastGood);
            for (let ws = lastWsVal + 0.01; ws <= lastWsVal + 1 && ws <= 8; ws += 0.01) {
                const prev = p.style.wordSpacing;
                const delta = measureColScrollDelta(shortCol, () => {
                    p.style.wordSpacing = ws.toFixed(2) + 'px';
                });
                if (colOverCeiling()) {
                    p.style.wordSpacing = lastGood;
                    break;
                }
                if (delta > 0.1 && applied + delta <= budget + 1) {
                    applied += delta;
                    lastGood = ws.toFixed(2) + 'px';
                    if (applied >= budget - 0.5) break;
                } else {
                    p.style.wordSpacing = lastGood;
                }
            }
        }

        logDetails.tiersApplied['priority5_wordSpacing'] = (logDetails.tiersApplied['priority5_wordSpacing'] || 0) + applied;
        return applied;
    }

    const priorityTiers = [
        { name: 'P1 (רווח לפני כותרת)', fn: applyPriority1_HeadingBefore, weight: 6 },
        { name: 'P2 (רווח אחרי כותרת)', fn: applyPriority2_HeadingAfter, weight: 4 },
        { name: 'P2.5 (margin-bottom H5)', fn: applyPriority2_5_H5MarginBottom, weight: 3.5 },
        { name: 'P3 (רווח פסקאות)', fn: applyPriority3_ParagraphSpacing, weight: 3 },
        { name: 'P4 (רווח שורות)', fn: applyPriority4_LineHeight, weight: 2 },
        { name: 'P5 (רווח מילים)', fn: applyPriority5_WordSpacing, weight: 1 }
    ];

    const totalWeight = priorityTiers.reduce((acc, t) => acc + t.weight, 0);

    // חלוקה ראשונה משוקללת לפי סדרי העדיפויות
    for (const tier of priorityTiers) {
        if (remaining <= 2 || colOverCeiling()) break;
        const share = remaining * (tier.weight / totalWeight);
        const gained = tier.fn(share);
        remaining -= gained;
    }

    // סגירת יתרת הפער באופן סדרתי לפי סדר העדיפויות
    for (const tier of priorityTiers) {
        if (remaining <= 2 || colOverCeiling()) break;
        const gained = tier.fn(remaining);
        remaining -= gained;
    }

    // תיקון ישיר: אם עדיין יש פער משמעותי, חשב את ה-line-height המדויק הדרוש
    // והחל אותו על הפסקה האחרונה בטור הקצר. זה עוקף את מערכת ה-budget המורכבת.
    if (remaining > 5 && !colOverCeiling()) {
        const allP = Array.from(shortCol.querySelectorAll('p'));
        if (allP.length > 0) {
            const lastP = allP[allP.length - 1];
            if (!lastP.querySelector('.first-word-window')) {
                const raw = lastP.getAttribute('data-raw-text') || lastP.textContent || '';
                const li = getLinesFromParagraph(raw, colWidth || shortCol.offsetWidth, styleObj, false);
                const n = Math.max(1, li.lines.length);
                const fp = parseFloat(styleObj.fontSize) * 1.333 || 16;
                // חשב את ה-extraLh המדויק הדרוש להשלמת הפער
                const exactExtraLh = remaining / (n * fp);
                if (exactExtraLh > 0 && exactExtraLh <= 0.40) {
                    // הגדל את ה-extraLh על ידי עדכון line-height
                    const baseLh = parseFloat(styleObj.lineHeight) || 1.34;
                    const currentLh = lastP.style.lineHeight ? parseFloat(lastP.style.lineHeight) : baseLh;
                    const currentExtraLh = currentLh - baseLh;
                    const newExtraLh = currentExtraLh + exactExtraLh;
                    if (newExtraLh <= 0.40) {
                        const newLh = baseLh + newExtraLh;
                        const prev = lastP.style.lineHeight;
                        lastP.style.lineHeight = newLh.toString();
                        const newH = shortCol.scrollHeight;
                        if (!colOverCeiling() && newH <= (heightCeiling < Infinity ? heightCeiling : Infinity)) {
                            remaining = 0;
                            logDetails.tiersApplied['directFix_lineHeight'] = (logDetails.tiersApplied['directFix_lineHeight'] || 0) + (newH - shortCol.scrollHeight + remaining);
                        } else {
                            lastP.style.lineHeight = prev;
                        }
                    }
                }
            }
        }
    }

    if (traceObj) {
        traceObj.justificationLog = logDetails;
    }

    const appliedTotal = neededGrowth - remaining;
    
    // תיקון: ביטול layoutInvalidator — הוא מפעיל re-balance עם balanceColumnsV2
    // שמבצע פחות טוב מ-V1 ודורס את התיקונים שלנו. ה-rebalance הסינכרוני
    // ב-finalizeTwoColumnBlockLayout מטפל בכל שינוי גובה.
    // if (appliedTotal > 2 && typeof layoutInvalidator !== 'undefined') {
    //     const block = shortCol.closest('.block-2col');
    //     if (block) {
    //         layoutInvalidator.invalidateBlock(block);
    //     }
    // }
    
    return appliedTotal;
}

function justifyColumnsPair(rCol, lCol, styleObj, heightCeiling, colWidth, traceObj = null) {
    if (!rCol || !lCol) return;
    let rH = rCol.scrollHeight;
    let lH = lCol.scrollHeight;
    let diff = rH - lH;
    if (Math.abs(diff) <= 2) return;

    const maxJustify = 140;
    if (Math.abs(diff) > maxJustify) return;

    const shortCol = diff > 0 ? lCol : rCol;
    let targetH = diff > 0 ? rH : lH;
    if (heightCeiling < Infinity) {
        targetH = Math.min(targetH, heightCeiling);
    }
    const needed = targetH - shortCol.scrollHeight;
    if (needed <= 2) return;

    // תיקון קריטי: ה-ceiling ל-growing הטור הקצר צריך להיות ה-targetH (גובה הטור הארוך),
    // ולא ה-budget הגלובלי. אחרת, הפונקציה עלולה לגדול PAST הטור הארוך וליצור חוסר איזון הפוך.
    // נקודת חסם: targetH + 1 (טולרנס 1px לעיגול).
    const growthCeiling = targetH + 1;  // חזר ל-1
    distributeColumnJustification(shortCol, needed, styleObj, growthCeiling, colWidth, traceObj);
}

function stripOneColumnJustifyLayer(block) {
    const rCol = block.querySelector('.right-col');
    const lCol = block.querySelector('.left-col');
    const cols = [rCol, lCol].filter(Boolean);
    for (const col of cols) {
        const ps = col.querySelectorAll('p');
        for (let i = ps.length - 1; i >= 0; i--) {
            if (ps[i].style.wordSpacing) {
                ps[i].style.wordSpacing = '';
                return true;
            }
        }
    }
    for (const col of cols) {
        for (const p of col.querySelectorAll('p')) {
            if (p.style.lineHeight) {
                p.style.lineHeight = '';
                return true;
            }
        }
    }
    for (const col of cols) {
        for (const p of col.querySelectorAll('p')) {
            if (p.style.marginBottom) {
                p.style.marginBottom = '';
                return true;
            }
        }
    }
    for (const col of cols) {
        for (const h of col.querySelectorAll('.title-level-3, .title-level-4, .title-level-5, .title-level-6, .title-level-custom')) {
            if (h.style.marginBottom) {
                h.style.marginBottom = '';
                return true;
            }
        }
    }
    for (const col of cols) {
        for (const h of col.querySelectorAll('.title-level-3, .title-level-4, .title-level-5, .title-level-6, .title-level-custom')) {
            if (h.style.marginTop) {
                h.style.marginTop = '';
                return true;
            }
        }
    }
    return false;
}

function enforceBlockColumnsWithinCeiling(block, heightCeiling) {
    const rCol = block.querySelector('.right-col');
    const lCol = block.querySelector('.left-col');
    if (!rCol || !lCol) return 0;
    if (heightCeiling >= Infinity) return Math.max(rCol.scrollHeight, lCol.scrollHeight);

    let guard = 0;
    // טולרנטיות של 4px למניעת איפוס יתר עקב שגיאות עיגול תתי-פיקסל
    while (Math.max(rCol.scrollHeight, lCol.scrollHeight) > heightCeiling + 4 && guard++ < 250) {
        if (!stripOneColumnJustifyLayer(block)) break;
    }
    return Math.max(rCol.scrollHeight, lCol.scrollHeight);
}

function finalizeTwoColumnBlockLayout(block, bodyFlow, pageEl, styleObj, colWidth, didBalance, traceObj = null) {
    const budget = getBlockColumnBudget(bodyFlow, pageEl, block);
    const rCol = block.querySelector('.right-col');
    const lCol = block.querySelector('.left-col');
    if (!rCol || !lCol) return 0;

    if (!didBalance) {
        const diff = rCol.scrollHeight - lCol.scrollHeight;
        if (Math.abs(diff) > 2 && Math.abs(diff) <= 140 && Math.max(rCol.scrollHeight, lCol.scrollHeight) <= budget + 1) {
            justifyColumnsPair(rCol, lCol, styleObj, budget, colWidth, traceObj);
        }
    }
    
    // נקודה 2: tightenRunts curative pass — מבוסס על postext §3.2.
    // פועל אחרי איזון הטורים. אם נותרה שורה אחרונה דלילה (runt), ננסה להדוף tracking
    // כדי למשוך מילה נוספת לשורה הקודמת. עברית אינה שפה מחברת ולכן מותר להשתמש ב-tracking.
    try {
        const improved = tightenRuntsInBlock(block, colWidth, styleObj);
        // תיקון: אל נא לקרוא ל-layoutInvalidator.invalidateBlock — הוא מפעיל re-balance
        // עם balanceColumnsV2 שמבצע פחות טוב מ-V1 ודורס את התיקונים שלנו.
        // ה-rebalance הסינכרוני למטה מטפל בכל שינוי גובה.
        // if (improved > 0 && typeof layoutInvalidator !== 'undefined') {
        //     layoutInvalidator.invalidateBlock(block);
        // }
    } catch (e) {
        console.warn('tightenRunts failed:', e);
    }

    // תיקון: rebalance אחרי tightenRunts.
    // tightenRunts עלול לכווץ פסקה בטור אחד וליצור חוסר איזון הפוך.
    // לכן נריץ שוב justifyColumnsPair כדי להשוות את הטורים.
    // נשתמש ב-growth ceiling של targetH+1 כדי למנוע overshoot.
    try {
        const rH = rCol.scrollHeight;
        const lH = lCol.scrollHeight;
        const newDiff = rH - lH;
        if (Math.abs(newDiff) > 2 && Math.abs(newDiff) <= 140 && Math.max(rH, lH) <= budget + 1) {
            const beforeShortH = Math.min(rH, lH);
            justifyColumnsPair(rCol, lCol, styleObj, budget, colWidth, traceObj);
            const afterRH = rCol.scrollHeight;
            const afterLH = lCol.scrollHeight;
            const afterDiff = afterRH - afterLH;
            if (Math.abs(afterDiff) > 5) {
                // עדיין חוסר איזון — נסה עם reset ו-ceiling רחב יותר
                const shortCol = afterDiff > 0 ? lCol : rCol;
                const tallH = afterDiff > 0 ? afterRH : afterLH;
                const needed2 = tallH - shortCol.scrollHeight;
                if (needed2 > 2) {
                    // נקה סגנונות ישנים — distributeColumnJustification לא יכול לגדול טור
                    // שכבר מכיל word-spacing/line-height קודם
                    if (typeof resetColumnJustificationStyles === 'function') {
                        resetColumnJustificationStyles(shortCol);
                    }
                    // תיקון קריטי: ceiling צריך להיות tallH + 3 (לא tallH + 30).
                    // tallH + 30 איפשר 30px יתרון וגרם ל-OVERSHOOT של 16-21px.
                    // tallH + 3 מאפשר טולרנס קטן (3px) ומונע overshoot.
                    distributeColumnJustification(shortCol, needed2, styleObj, tallH + 3, colWidth, traceObj);  // חזר ל-3
                }
            }
        }
    } catch (e) {
        console.warn('rebalance after tightenRunts failed:', e);
    }

    // ==================================================================
    // תיקון קריטי: משוך מילים מההמשך לשורה האחרונה של p-cut
    // ==================================================================
    // אחרי כל העיבוד, בדוק אם ה-p-cut (הפסקה המקוטעת בסוף טור) מסתיימת
    // בשורה עם מעט מילים. אם כן, משוך מילים מההמשך (ה-p-end בטור השני).
    // זה מונע את המראה של "סיבת המצווה." עם רווחים עצומים.
    // ==================================================================
    try {
        console.log('[finalize-pull] checking block, rCol.children=' + rCol.children.length + ' lCol.children=' + lCol.children.length);
        [rCol, lCol].forEach(function(sourceCol, sourceIdx) {
            const targetCol = sourceIdx === 0 ? lCol : rCol;
            const pCut = sourceCol.querySelector('p.p-cut');
            console.log('[finalize-pull] sourceCol=' + (sourceIdx===0?'R':'L') + ' pCut=' + (pCut ? 'found' : 'none'));
            if (!pCut) return;
            const pEnd = targetCol.querySelector('p.p-end, p.p-cut');
            if (!pEnd) return;

            void pCut.offsetHeight; // אלץ reflow
            const range = document.createRange();
            range.selectNodeContents(pCut);
            const rects = range.getClientRects();
            if (rects.length < 2) return;

            const colRect = sourceCol.getBoundingClientRect();
            // ספור את מספר המילים בשורה האחרונה על ידי בדיקת כמה מילים נכנסות
            // ברוחב שנותר אחרי השורה הקודמת
            const rText = pCut.getAttribute('data-raw-text') || '';
            const lText = pEnd.getAttribute('data-raw-text') || '';
            const rWords = rText.trim().split(/\s+/).filter(w => w.length > 0);
            const lWords = lText.trim().split(/\s+/).filter(w => w.length > 0);

            if (lWords.length === 0) return;

            // תמיד נסה למשוך מילים מההמשך כדי למלא את השורה האחרונה
            // המערכת תעצור כשלא יהיה עוד מקום
            {
                // נסה למשוך מילים מההמשך
                let newRWords = rWords.slice();
                let newLWords = lWords.slice();
                let pulled = 0;
                const maxPull = Math.min(5, newLWords.length);

                while (newLWords.length > 0 && pulled < maxPull) {
                    newRWords.push(newLWords[0]);
                    newLWords = newLWords.slice(1);
                    pulled++;

                    // בדוק אם עדיין נכנס בגובה
                    const newRText = newRWords.join(' ');
                    const isCont = pCut.getAttribute('data-is-cont') === 'true';
                    pCut.innerHTML = createDropWord(newRText, isCont, false, newRWords.length);
                    applyDelimiterStyles(pCut, 'body', getBodySizePt(), false);
                    void pCut.offsetHeight;

                    if (sourceCol.scrollHeight > budget) {
                        // יותר מדי — החזר
                        newLWords.unshift(newRWords.pop());
                        pulled--;
                        break;
                    }
                }

                if (pulled > 0) {
                    const newRText = newRWords.join(' ');
                    const newLText = newLWords.join(' ');
                    pCut.setAttribute('data-raw-text', newRText);
                    const isCont = pCut.getAttribute('data-is-cont') === 'true';
                    pCut.innerHTML = createDropWord(newRText, isCont, false, newRWords.length);
                    applyDelimiterStyles(pCut, 'body', getBodySizePt(), false);
                    pEnd.setAttribute('data-raw-text', newLText);
                    pEnd.innerHTML = createDropWord(newLText, true, false, newLWords.length);
                    applyDelimiterStyles(pEnd, 'body', getBodySizePt(), false);
                }
            }
        });
    } catch (e) {
        console.warn('pull words in finalize failed:', e);
    }

    // ==================================================================
    // תיקון: מילוי טור עד הסוף כשהשורה האחרונה דלילה
    // ==================================================================
    // אם האלמנט האחרון בטור הוא p-end והשורה האחרונה שלו דלילה (פחות מ-70% מילוי),
    // ויש מקום פנוי בתחתית הטור (הטור לא מלא עד ה-budget),
    // נמתח את הפסקה האחרונה על ידי הגדלת line-height כדי למלא את המקום הפנוי.
    // זה מונע את המראה של "שורה ריקה בסוף הטור".
    // ==================================================================
    try {
        const maxH = Math.max(rCol.scrollHeight, lCol.scrollHeight);
        const minH = Math.min(rCol.scrollHeight, lCol.scrollHeight);
        const freeSpace = budget - minH;
        
        // רק אם יש מקום פנוי משמעותי (יותר מ-20px) והטורים מאוזנים יחסית
        if (freeSpace > 20 && Math.abs(maxH - minH) <= 30) {
            [rCol, lCol].forEach(function(col) {
                const lastEl = col.lastElementChild;
                if (!lastEl || lastEl.tagName !== 'P') return;
                
                // בדוק אם השורה האחרונה דלילה
                const range = document.createRange();
                range.selectNodeContents(lastEl);
                const rects = range.getClientRects();
                if (rects.length < 2) return;
                
                const colRect = col.getBoundingClientRect();
                const lastRect = rects[rects.length - 1];
                const lastWidth = lastRect.right - colRect.left;
                const fillPct = colRect.width > 0 ? lastWidth / colRect.width : 1;
                
                if (fillPct < 0.7) {
                    // חשב כמה מקום פנוי יש בטור הזה
                    const colFree = budget - col.scrollHeight;
                    if (colFree > 10) {
                        // חשב את ה-line-height הנדרש כדי למלא את המקום
                        const currentLineHeight = parseFloat(getComputedStyle(lastEl).lineHeight) || 20;
                        const numLines = rects.length;
                        const extraPerLine = colFree / numLines;
                        const newLineHeight = currentLineHeight + extraPerLine;
                        
                        // הגבל את המתיחה ל-60% מעל ה-line-height המקורי (היה 30%)
                        const maxLineHeight = currentLineHeight * 1.6;
                        const finalLineHeight = Math.min(newLineHeight, maxLineHeight);
                        
                        if (finalLineHeight > currentLineHeight + 0.5) {
                            lastEl.style.lineHeight = finalLineHeight + 'px';
                        }
                    }
                }
            });
        }
    } catch (e) {
        console.warn('fill column bottom failed:', e);
    }

    // פעולה 4 — איזון טורים איטרטיבי עם looseness (לפי מחקר 1, סעיף "lua-widow-control").
    // הערה: מנוטרל זמנית עקב בעיית ביצועים. המסלול האיטי של looseness (bestByLineCount)
    // גורם להאטה חמורה כשנקרא עבור כל בלוק. יש להפעיל רק כשצריך, ולא בתוך לולאת איזון.
    /*
    try {
        const rH = rCol.scrollHeight;
        const lH = lCol.scrollHeight;
        const diff = Math.abs(rH - lH);
        if (diff > 20) {
            const tallCol = rH > lH ? rCol : lCol;
            const shortCol = rH > lH ? lCol : rCol;
            const lastP = tallCol.querySelector('p:last-child');
            if (lastP && lastP.getAttribute('data-raw-text')) {
                const rawText = lastP.getAttribute('data-raw-text');
                const isCont = lastP.classList.contains('p-cut');
                const linesInfo = getLinesFromParagraph(rawText, colWidth, styleObj, !isCont, -1);
                if (linesInfo._fromKp && linesInfo.numLines > 0) {
                    const currentLines = (lastP.innerHTML.match(/<br>/g) || []).length + 1;
                    if (linesInfo.numLines < currentLines) {
                        lastP.innerHTML = linesInfo.lines.map(l => escapeHTML(l)).join('<br>');
                    }
                }
            }
        }
    } catch (e) {
        console.warn('looseness-based rebalance failed:', e);
    }
    */

    // נקודה 5: tryLookAheadWordPull מנוטרל — מבוסס על postext §Q + recommendation #9.
    
    // נקודה 6: תיקון אלמנות cross-column (פעולה 1 — מטריצת עדיפויות).
    // סדר העדיפויות לפי מחקר:
    //   1. No Content Loss (אין לדרוס טקסט)
    //   2. מניעת יתום/אלמנה (הקנס העליון)
    //   3. מניעת כותרת תלויה
    //   4. איזון טורים
    //   5. מניעת שורות דלילות
    // המטריצה מבוצעת אחרי האיזון וה-tightenRunts, כדי לתקן אלמנות שנוצרו למרות ה-look-ahead.
    try {
        const fixed = fixWidowContinuation(block, colWidth, styleObj);
        // אם fixWidowContinuation שינה טקסט, הרץ שוב tightenRunts כדי לטפל
        // בשורה אחרונה דלילה שעלולה להיווצר ב-p-cut (קונפליקט אלמנה→דלילות).
        if (fixed) {
            tightenRuntsInBlock(block, colWidth, styleObj);
        }
    } catch (e) {
        console.warn('fixWidowContinuation failed:', e);
    }
    
    return enforceBlockColumnsWithinCeiling(block, budget);
}

/**
 * fixWidowContinuation — תיקון אלמנות cross-column (פעולה 1).
 *
 * מטריצת עדיפויות לפי מחקר:
 *   1. No Content Loss — אין לדרוס טקסט
 *   2. מניעת יתום/אלמנה — הקנס העליון
 *   3. מניעת כותרת תלויה
 *   4. איזון טורים
 *   5. מניעת שורות דלילות
 *
 * אם הפסקה הראשונה בטור השני היא המשך (data-is-cont) עם שורה אחת בודדת,
 * מעביר מילים מסוף ה-p-cut לתחילת ההמשך עד שלהמשך ≥2 שורות.
 * Fallback (שלב 3 לפי מחקר): אם העברת מילים לא הצליחה, משוך את האלמנה
 * חזרה לטור הראשון (מזג את ההמשך חזרה ל-p-cut).
 */
function fixWidowContinuation(block, colWidth, styleObj) {
    const rCol = block.querySelector('.right-col');
    const lCol = block.querySelector('.left-col');
    if (!rCol || !lCol) return false;

    let anyFixed = false;

    // בדוק שני כיוונים: R→L (p-cut ב-R, המשך ב-L) ו-L→R (p-cut ב-L, המשך ב-R)
    for (const [cutCol, contCol] of [[rCol, lCol], [lCol, rCol]]) {
        const cutParas = Array.from(cutCol.querySelectorAll('p'));
        const contParas = Array.from(contCol.querySelectorAll('p'));
        if (!cutParas.length || !contParas.length) continue;

        const lastCut = cutParas[cutParas.length - 1];
        const firstCont = contParas[0];

        // הפסקה האחרונה בטור הראשון חייבת להיות p-cut
        if (!lastCut.classList.contains('p-cut')) continue;
        // הפסקה הראשונה בטור השני חייבת להיות המשך
        if (firstCont.getAttribute('data-is-cont') !== 'true') continue;

        // ספור שורות בהמשך באמצעות getClientRects (DOM אמיתי)
        const range = document.createRange();
        range.selectNodeContents(firstCont);
        const rects = range.getClientRects();
        const lineTops = new Set();
        for (const rect of rects) {
            if (rect.height > 0) lineTops.add(Math.round(rect.top));
        }
        const contLines = lineTops.size;

        // רק אם ההמשך הוא שורה אחת בודדת — תיקן!
        if (contLines !== 1) continue;

        // קח את הטקסט של שתי הפסקאות
        const cutText = lastCut.textContent.trim();
        const contText = firstCont.textContent.trim();

        // חלק את ה-p-cut למילים
        const cutWords = cutText.split(/\s+/);
        if (cutWords.length < 5) continue; // צריך מספיק מילים ב-p-cut

        // שלב 1: העבר מילים מסוף ה-p-cut לתחילת ההמשך עד שלהמשך ≥2 שורות
        const movedWords = [];
        const maxMove = Math.min(8, cutWords.length - 3);
        for (let w = 0; w < maxMove; w++) {
            const word = cutWords.pop();
            if (!word) break;
            movedWords.unshift(word);

            // עדכן את ה-p-cut
            const fww = lastCut.querySelector('.first-word-window');
            const newCutText = cutWords.join(' ') + '.';
            if (fww) {
                const afterFww = fww.nextSibling;
                if (afterFww && afterFww.nodeType === 3) {
                    afterFww.textContent = ' ' + newCutText;
                } else {
                    lastCut.appendChild(document.createTextNode(' ' + newCutText));
                }
            } else {
                lastCut.textContent = newCutText;
            }

            // עדכן את ההמשך
            const contFww = firstCont.querySelector('.first-word-window');
            const newContText = movedWords.join(' ') + ' ' + contText;
            if (contFww) {
                const afterFww = contFww.nextSibling;
                if (afterFww && afterFww.nodeType === 3) {
                    afterFww.textContent = ' ' + newContText;
                }
            } else {
                firstCont.textContent = newContText;
            }

            // בדוק אם ההמשך כעת ≥2 שורות
            const range2 = document.createRange();
            range2.selectNodeContents(firstCont);
            const rects2 = range2.getClientRects();
            const lineTops2 = new Set();
            for (const rect of rects2) {
                if (rect.height > 0) lineTops2.add(Math.round(rect.top));
            }
            if (lineTops2.size >= 2) break;
        }

        // בדוק שוב אם ההמשך עדיין שורה אחת (המילים לא הספיקו)
        const range3 = document.createRange();
        range3.selectNodeContents(firstCont);
        const rects3 = range3.getClientRects();
        const lineTops3 = new Set();
        for (const rect of rects3) {
            if (rect.height > 0) lineTops3.add(Math.round(rect.top));
        }
        if (lineTops3.size < 2) {
            // שלב 3 (Fallback לפי מחקר): משוך את האלמנה חזרה לטור הראשון.
            // מזג את ההמשך חזרה ל-p-cut — שחזר את הטקסט המלא והפוך ל-p-end.
            const fww = lastCut.querySelector('.first-word-window');
            const fullText = cutText; // הטקסט המקורי של ה-p-cut
            if (fww) {
                const afterFww = fww.nextSibling;
                if (afterFww && afterFww.nodeType === 3) {
                    afterFww.textContent = ' ' + fullText;
                }
            } else {
                lastCut.textContent = fullText;
            }
            // הסר את ההמשך מהטור השני
            firstCont.remove();
            // שנה את ה-p-cut ל-p-end (הפסקה שלמה, לא חתוכה)
            lastCut.classList.remove('p-cut');
            lastCut.classList.add('p-end');
            lastCut.removeAttribute('data-is-cont');
            console.log('fixWidowContinuation: מיזגתי המשך קצר חזרה ל-p-cut (fallback)');
            anyFixed = true;
            continue;
        }

        console.log('fixWidowContinuation: העברתי מילים מ-p-cut להמשך');
        anyFixed = true;
    }
    return anyFixed;
}

/**
 * tryLookAheadWordPull — מזהה שורה אחרונה דלילה בטור ימין ומנסה למשוך מילה
 * מתחילת טור שמאל (המשך הפסקה) כדי למלא את השורה האחרונה.
 * 
 * זהו "look-ahead line breaking" — הרבה יותר נכון מ-word-spacing מלאכותי.
 */
function tryLookAheadWordPull(block, rCol, lCol, styleObj, colWidth, budget) {
    if (!rCol || !lCol) return;
    if (rCol.children.length === 0 || lCol.children.length === 0) return;
    
    const rLast = rCol.lastElementChild;
    const lFirst = lCol.firstElementChild;
    if (!rLast || !lFirst) return;
    
    // בודק שהאחרון בימין הוא p-cut (פסקה חתוכה) והראשון בשמאל הוא המשך של אותה פסקה
    if (rLast.tagName !== 'P' || !rLast.classList.contains('p-cut')) return;
    if (lFirst.tagName !== 'P') return;
    
    // משיגת טקסט הפסקה האחרונה בימין
    const rText = rLast.textContent || '';
    const rWords = rText.split(/\s+/).filter(w => w.length > 0);
    if (rWords.length < 4) return; // פסקה קצרה מדי — לא ניתן לנתח
    
    // מקבל את מספר השורות בפועל
    // FIX: אם הפסקה מכילה first-word-window — יש למדוד עם ה-drop word!
    const hasWindow = rLast.querySelector('.first-word-window') !== null;
    const rLines = getLinesFromParagraph(rText, colWidth, styleObj, hasWindow);
    if (!rLines.lines || rLines.lines.length < 2) return;
    
    // בודק את השורה האחרונה
    const lastLine = rLines.lines[rLines.lines.length - 1];
    const lastLineWords = lastLine.split(/\s+/).filter(w => w.length > 0);
    
    // FIX: בודק יחס מילוי של השורה האחרונה.
    // אם השורה ממלאת פחות מ-60% מרוחב הטור — היא דלילה ומצריכה העברת מילה.
    // הערכה: יחס מילוי = אורך השורה / אורך שורה מלאה ממוצע.
    const avgLineLength = rLines.lines.reduce(function(s, l) { return s + l.length; }, 0) / rLines.lines.length;
    const lastLineRatio = avgLineLength > 0 ? lastLine.length / avgLineLength : 1;
    const isSparse = lastLineWords.length < 3 || lastLineRatio < 0.6;
    
    if (!isSparse) return;
    
    // משיגת המילה הראשונה מטור שמאל
    const lText = lFirst.textContent || '';
    const lWords = lText.split(/\s+/).filter(w => w.length > 0);
    if (lWords.length < 2) return; // אם שמאל מכיל רק מילה אחת — לא נוכל לקחת
    
    // FIX: מדידת מספר שורות בשמאל לפני השינוי
    const lHasWindow = lFirst.querySelector('.first-word-window') !== null;
    const lLinesInfo = getLinesFromParagraph(lText, colWidth, styleObj, lHasWindow);
    
    // ננסה להעביר 1-3 מילים משמאל לימין
    for (let pullCount = 1; pullCount <= 3 && pullCount < lWords.length; pullCount++) {
        const pulledWords = lWords.slice(0, pullCount).join(' ');
        const newRText = rText + ' ' + pulledWords;
        const newLText = lWords.slice(pullCount).join(' ');
        
        if (!newLText.trim()) break; // לא נשאר כלום בשמאל
        
        // מודד את התוצאה — עם הדגל הנכון
        const newRLines = getLinesFromParagraph(newRText, colWidth, styleObj, hasWindow);
        const newLLines = getLinesFromParagraph(newLText, colWidth, styleObj, lHasWindow);
        
        // מחשב גבהים
        const rHBefore = rCol.scrollHeight;
        const lHBefore = lCol.scrollHeight;
        const oldDiff = Math.abs(rHBefore - lHBefore);
        
        // מעריך גבהים חדשים
        const rLineH = rHBefore / Math.max(1, rLines.numLines);
        const lLineH = lHBefore / Math.max(1, lLinesInfo.numLines);
        
        const rLinesDelta = newRLines.numLines - rLines.numLines;
        const lLinesDelta = lLinesInfo.numLines - newLLines.numLines;
        const estNewRH = rHBefore + rLinesDelta * rLineH;
        const estNewLH = lHBefore - lLinesDelta * lLineH;
        
        const newDiff = Math.abs(estNewRH - estNewLH);
        
        // רק אם האיזון משתפר ואין חריגה — מבצע
        if (newDiff < oldDiff && estNewRH <= budget + 2 && estNewLH <= budget + 2) {
            // FIX: שומר class ו-data-token-id.
            // אם הפסקה הייתה עם drop word — יוצר מחדש עם createDropWord.
            // אם הייתה המשך (p-cut continuation) — משתמש ב-escapeHTML.
            const rClass = rLast.className;
            const rId = rLast.getAttribute('data-token-id');
            const rIsContinuation = rClass.includes('p-cut') && !hasWindow;
            rLast.innerHTML = hasWindow 
                ? createDropWord(newRText, false, rLines.numLines <= 1, rLines.numLines || 2)
                : escapeHTML(newRText);
            rLast.className = rClass;
            if (rId) rLast.setAttribute('data-token-id', rId);
            
            const lClass = lFirst.className;
            const lId = lFirst.getAttribute('data-token-id');
            lFirst.innerHTML = lHasWindow
                ? createDropWord(newLText, false, newLLines.numLines <= 1, newLLines.numLines || 2)
                : escapeHTML(newLText);
            lFirst.className = lClass;
            if (lId) lFirst.setAttribute('data-token-id', lId);
            
            // מחשיב מחדש את השורה האחרונה של ימין
            const finalLastLine = newRLines.lines[newRLines.lines.length - 1] || '';
            const finalLastWords = finalLastLine.split(/\s+/).filter(w => w.length > 0);
            
            // אם השורה האחרונה עדיין דלילה — נסה למשוך עוד מילה
            if (finalLastWords.length < 3 && pullCount < 3) continue;
            
            // הצלחה — יוצא
            break;
        }
    }
}

/* ==========================================================================
   6.1 פונקציות עזר לבקרה, איפוס סגנונות ומניעת כותרות/פסקאות יתומות
   ========================================================================== */
function resetColumnJustificationStyles(col) {
    if (!col) return;
    col.querySelectorAll('p').forEach(p => {
        p.style.marginBottom = '';
        p.style.lineHeight = '';
        p.style.wordSpacing = '';
        p.style.letterSpacing = '';  // reset tracking ladder
    });
    col.querySelectorAll('.title-level-3, .title-level-4, .title-level-5, .title-level-6, .title-level-7, .title-level-custom').forEach(h => {
        h.style.marginTop = '';
        h.style.marginBottom = '';
    });
}

/**
 * tightenRunts — טיפול יזום בשורות אחרונות דלילות (runt last lines).
 *
 * פוסט-מודן: מבוסס על postext §3.2 "tightenRunts curative pass".
 * כשפסקה מסתיימת בשורה אחרונה עם 1–3 מילים בלבד (runt), ננסה להדוף מעט
 * את הריווח בין אותיות (letter-spacing / tracking) במטרה להכניס מילה נוספת
 * לשורה הקודמת ולצמצם את הריק בשורה האחרונה.
 *
 * סולם ה-tracking (על-פי postext, מותאם לעברית שאינה שפה מחברת):
 *   [0, 0.04em, 0.08em, 0.12em]  — מינימלי, כמעט בלתי-נראה לעין.
 *
 * הפונקציה פועלת בשני מצבים:
 *   1. tighten — מנסה למשוך מילה מהשורה האחרונה לקודמת (כיווץ)
 *   2. accept-only-if-better — מקבלת שינוי רק אם השורה האחרונה אכן התמלאה
 *
 * @param {HTMLElement} col — הטור שמכיל את הפסקה לבדיקה
 * @param {number} colWidth — רוחב הטור בפיקסלים
 * @param {object} styleObj — סגנון גוף הטקסט
 * @returns {number} — מספר הפסקאות ששופרו
 */
function tightenRunts(col, colWidth, styleObj) {
    if (!col || colWidth <= 0) return 0;

    // סולם tracking — חיובי מרחיב, שלילי מכווץ.
    // ל-runt (שורה אחרונה עם מעט מילים) רוצים לכווץ כדי למשוך מילה למעלה.
    const TRACKING_LADDER = [0, -0.01, -0.02, -0.03, -0.04, -0.05, -0.06]; // em (שלילי = מכווץ)
    const MIN_RUNT_WORDS = 1;
    const MAX_RUNT_WORDS = 3;
    const MIN_RUNT_FILL_RATIO = 0.55;

    let improved = 0;
    let candidates = 0;

    const paragraphs = Array.from(col.querySelectorAll('p'));
    for (const p of paragraphs) {
        // דלג על פסקאות עם first-word-window (drop word) — אסור לשנות את המידה
        if (p.querySelector('.first-word-window')) continue;

        const rawText = p.classList.contains('p-cut')
            ? (p.textContent || '')  // p-cut: השתמש בטקסט המוצג בפועל (חלק ראשון בלבד)
            : (p.getAttribute('data-raw-text') || p.textContent || '');  // p-end: הטקסט המלא
        if (!rawText.trim()) continue;

        // דלג על פסקאות חד-שוריות
        const baseline = getLinesFromParagraph(rawText, colWidth, styleObj, false);
        if (!baseline.lines || baseline.lines.length < 2) continue;

        const lastLine = baseline.lines[baseline.lines.length - 1] || '';
        const lastLineWords = lastLine.split(/\s+/).filter(w => w.length > 0);

        const isRunt = (lastLineWords.length >= MIN_RUNT_WORDS && lastLineWords.length <= MAX_RUNT_WORDS)
            || (baseline.lastLineWidth > 0 && (baseline.lastLineWidth / colWidth) < MIN_RUNT_FILL_RATIO && lastLineWords.length <= MAX_RUNT_WORDS + 2);

        if (!isRunt) continue;
        candidates++;

        // שמירת מצב מקורי
        const prevLetterSpacing = p.style.letterSpacing;
        const prevHeight = p.offsetHeight;
        // קוד השורה של הפסקה = offsetHeight / single-line-height
        const oneLineH = parseFloat(styleObj.fontSize) * 1.333 * parseFloat(styleObj.lineHeight) || 18;
        const baselineLines = Math.max(1, Math.round(prevHeight / oneLineH));

        let bestLadder = null;

        // ניסיון לכווץ tracking כדי למשוך מילה מהשורה האחרונה לקודמת
        for (const lsEm of TRACKING_LADDER) {
            if (lsEm === 0) continue;
            p.style.letterSpacing = lsEm + 'em';
            // מדידה ישירה ב-DOM — מבוססת על offsetHeight
            const newHeight = p.offsetHeight;
            const newLines = Math.max(1, Math.round(newHeight / oneLineH));

            // הצלחה א' — מספר השורות ירד (מילה נבלעה בשורה הקודמת)
            if (newLines < baselineLines) {
                bestLadder = lsEm;
                break;  // יציאה מיידית
            }
            // הצלחה ב' — הגובה ירד משמעותית (≥0.7 שורה) בלי ירידה במספר השורות המלא
            if (newHeight < prevHeight - 5 && newLines === baselineLines) {
                if (bestLadder === null || Math.abs(lsEm) < Math.abs(bestLadder)) {
                    bestLadder = lsEm;
                }
            }
        }

        if (bestLadder !== null) {
            p.style.letterSpacing = bestLadder + 'em';
            improved++;
        } else {
            p.style.letterSpacing = prevLetterSpacing;  // שחזור
        }
    }

    if (candidates > 0) {
        console.log(`tightenRunts: ${candidates} candidates, ${improved} improved (col w=${colWidth})`);
    }
    return improved;
}

/**
 * tightenRuntsInBlock — עובר על שני הטורים בבלוק ומפעיל tightenRunts.
 * @param {HTMLElement} block — בלוק דו-טורי
 * @param {number} colWidth — רוחב טור
 * @param {object} styleObj — סגנון
 * @returns {number} — סה"כ פסקאות ששופרו
 */
function tightenRuntsInBlock(block, colWidth, styleObj) {
    if (!block) return 0;
    let total = 0;
    const rCol = block.querySelector('.right-col');
    const lCol = block.querySelector('.left-col');
    if (!rCol || !lCol) return 0;

    const rH = rCol.scrollHeight;
    const lH = lCol.scrollHeight;
    const IMBALANCE_THRESHOLD = 10;

    // שלב 1: זיהוי פסקאות p-cut עם שורה דלילה
    // p-cut = פסקה חתוכה שממשיכה בטור הבא.
    // אם יש p-cut בטור הקצר, נאפשר כיווץ גם שם —
    // כי כיווץ מושך מילה מהשורה הדלילה למעלה ומבטל אותה,
    // וה-rebalance אחר כך יאזן מחדש.
    const hasCutR = !!rCol.querySelector('p.p-cut');
    const hasCutL = !!lCol.querySelector('p.p-cut');
    const canTightenR = hasCutR || !(lH > rH + IMBALANCE_THRESHOLD);
    const canTightenL = hasCutL || !(rH > lH + IMBALANCE_THRESHOLD);

    if (canTightenR) total += tightenRunts(rCol, colWidth, styleObj);
    if (canTightenL) total += tightenRunts(lCol, colWidth, styleObj);
    return total;
}

// שמירה על הפונקציה הישנה לתאימות לאחור (אם יש קריאות ישירות)
function tightenRuntsInBlock_legacy(block, colWidth, styleObj) {
    if (!block) return 0;
    let total = 0;
    const rCol = block.querySelector('.right-col');
    const lCol = block.querySelector('.left-col');
    if (rCol) total += tightenRunts(rCol, colWidth, styleObj);
    if (lCol) total += tightenRunts(lCol, colWidth, styleObj);
    return total;
}

function isAnyHeadingElement(el) {
    if (!el || !el.className) return false;
    const cls = String(el.className);
    return /title-level-\d+\b/.test(cls) || el.classList.contains('title-level-custom') || el.classList.contains('block-h3-span') || el.classList.contains('title-level-2-standalone');
}

function rollbackColumnTail(col, colWidth, styleObj, onRollback) {
    if (!col || col.children.length === 0) return false;
    let anyChanged = false;
    let changed = true;

    while (changed && col.children.length > 0) {
        changed = false;
        const lastEl = col.lastElementChild;
        if (!lastEl) break;

        // כלל 1: שום כותרת אינה יכולה להיות האלמנט המסיים של טור!
        if (isAnyHeadingElement(lastEl)) {
            const hId = lastEl.getAttribute('data-token-id');
            col.removeChild(lastEl);
            if (onRollback) onRollback({ type: 'h', id: hId, elem: lastEl });
            changed = true;
            anyChanged = true;
            continue;
        }

        // כלל 2: אם האלמנט האחרון הוא פסקה
        if (lastEl.tagName === 'P') {
            const prevEl = lastEl.previousElementSibling;
            const pRaw = lastEl.getAttribute('data-raw-text') || lastEl.textContent || '';
            const isCont = lastEl.getAttribute('data-is-cont') === 'true';
            const linesInfo = getLinesFromParagraph(pRaw, colWidth, styleObj, !isCont);
            const lineCount = linesInfo.lines.length;

            // כלל 2א: אם קדמה לה כותרת באותו טור, הפסקה חייבת להכיל לפחות 2 שורות!
            if (prevEl && isAnyHeadingElement(prevEl) && lineCount < 2) {
                const pId = lastEl.getAttribute('data-token-id');
                col.removeChild(lastEl);
                if (onRollback) onRollback({ type: 'p', id: pId, elem: lastEl, rawText: pRaw, linesInfo });
                changed = true;
                anyChanged = true;
                continue; // באיטרציה הבאה תוסר גם הכותרת שהתייתמה!
            }

            // כלל 2ב: אם הפסקה מקוטעת (p-cut), היא חייבת להכיל לפחות 2 שורות!
            if (lastEl.classList.contains('p-cut') && lineCount < 2) {
                const pId = lastEl.getAttribute('data-token-id');
                col.removeChild(lastEl);
                if (onRollback) onRollback({ type: 'p', id: pId, elem: lastEl, rawText: pRaw, linesInfo });
                changed = true;
                anyChanged = true;
                continue;
            }
        }
    }
    return anyChanged;
}

/* ==========================================================================
   7. איזון טורים (balanceColumns)
   ========================================================================== */

/* ==========================================================================
   7א. ארכיטקטורה חדשה: calculateCandidateLayout (שלב ב' מהרפאקטורינג)
   ==========================================================================
   פונקציה טהורה שמייצרת מועמד פריסה לבלוק דו-טורי בלי לגעת ב-DOM הקבוע.
   מקבלת רשימת פריטים (tokens או פסקאות חלקיות) ונקודת פיצול מועמדת,
   ומחזירה אובייקט עם תוכן טור ימין, תוכן טור שמאל, גבהים מדויקים,
   וסטטיסטיקות איכות (lastLineWordCount, overflow, orphans).
   ========================================================================== */

/**
 * LayoutCandidate — מבנה נתונים מתאר מועמד פריסה.
 * כל השדות נגזרים מחישוב טהור; אין תלות ב-DOM החי.
 */
class LayoutCandidate {
    constructor() {
        this.rightCol = [];   // [{ itemId, type: 'heading'|'paragraph'|'continuation', text, lines: int, partialLines: [] }]
        this.leftCol = [];
        this.pendingWordTokens = null;  // טוקן חלקי שנשאר לעמוד הבא
        this.heights = { right: 0, left: 0 };
        this.overflow = { right: 0, left: 0 };  // px חריגה מ-availHeight
        this.quality = {
            rightLastLineWordCount: 0,
            leftFirstLineWordCount: 0,
            rightHasOrphan: false,
            leftHasOrphan: false,
            rightHasWidow: false,
            leftHasWidow: false,
            headingAtEndOfRight: false,
            headingAtEndOfLeft: false,
        };
        this.score = Infinity;  // נקבע על-ידי scoreCandidate
        this.splitPoint = null;  // { itemId, lineIdx } — נקודת החיתוך שנבחרה
        this.candidateBreakpoints = [];  // היסטוריה של נקודות שנבדקו
    }
}

/**
 * buildLayoutItems — בונה רשימת פריטים מתוך טוקנים של בלוק.
 * הפריטים כוללים כותרות ופסקאות. פסקה חלקית מיוצגת כ-{ type: 'paragraph',
 * text, totalLines, partialLineIdx: null }.
 * 
 * @param {Array} tokens — מערך טוקנים של הבלוק
 * @param {object} styleObj — { fontFamily, fontSize, lineHeight }
 * @param {number} colWidth — רוחב טור בפיקסלים
 * @param {number} availHeight — גובה זמין בפיקסלים
 * @param {object} pendingWordTokens — טוקן חלקי שנכנס מבלוק קודם
 * @returns {{ items: Array, error: string|null }}
 */
function buildLayoutItems(tokens, styleObj, colWidth, pendingWordTokens) {
    const items = [];
    
    // הוספת pendingWordTokens כפריט ראשון אם קיים
    if (pendingWordTokens && pendingWordTokens.token) {
        const tok = pendingWordTokens.token;
        if (tok.type === 'p') {
            // פסקת המשך — יש לה רק שורות שנותרו מהבלוק הקודם
            items.push({
                id: tok.id + '-cont',
                type: 'paragraph',
                subType: 'continuation',
                text: tok.text,
                totalLines: pendingWordTokens.remainingLines.length,
                remainingLines: pendingWordTokens.remainingLines.slice(),
                isContinuation: true,
                measured: false,
                lines: [],
                height: 0,
            });
        } else if (tok.type.startsWith('h')) {
            items.push({
                id: tok.id,
                type: 'heading',
                level: tok.level,
                text: tok.text,
                customStyleId: tok.customStyleId || null,
                isContinuation: false,
                measured: false,
                height: 0,
            });
        }
    }
    
    // הוספת טוקנים רגילים
    for (const tok of tokens) {
        if (tok.type === 'p') {
            // מדידת פסקה מלאה כדי לדעת כמה שורות יש
            const measure = measureCandidateLines({
                rawText: tok.text,
                colWidth,
                styleObj,
                isContinuation: false,
                isSingleLine: false,
                numLines: 0,
                contextClass: '',
                applyDelimiters: true,
            });
            items.push({
                id: tok.id,
                type: 'paragraph',
                subType: 'full',
                text: tok.text,
                totalLines: measure.numLines,
                allLines: measure.lines.slice(),
                measuredHeight: measure.height,
                lastLineWidth: measure.lastLineWidth,
                lastLineWordCount: measure.lastLineWordCount,
                isContinuation: false,
                measured: true,
                lines: measure.lines.slice(),
                height: measure.height,
            });
        } else if (tok.type.startsWith('h')) {
            items.push({
                id: tok.id,
                type: 'heading',
                level: tok.level,
                text: tok.text,
                customStyleId: tok.customStyleId || null,
                isContinuation: false,
                measured: false,
                height: 0,  // יחושב ב-onDemand
            });
        }
    }
    
    return { items, error: null };
}

/**
 * measureHeadingHeight — מודד גובה כותרת ברוחב טור.
 * כותרות משתמשות ב-class title-level-N עם סגנונות משלהן.
 */
function measureHeadingHeight(item, colWidth, styleObj) {
    if (item.type !== 'heading') return 0;
    const box = _getMeasureBoxV2();
    box.innerHTML = '';
    box.style.width = colWidth + 'px';
    box.style.fontFamily = styleObj.fontFamily || "'פרנק רוהל ליברה רגיל', serif";
    box.style.fontSize = styleObj.fontSize || "'פרנק רוהל ליברה רגיל', serif";
    box.style.lineHeight = String(styleObj.lineHeight || 1.34);
    box.style.direction = 'rtl';
    box.style.textAlign = 'right';
    
    const h = document.createElement('div');
    h.className = item.customStyleId ? 'title-level-custom' : `title-level-${item.level}`;
    h.setAttribute('data-token-id', item.id);
    h.textContent = item.text;
    box.appendChild(h);
    
    const height = h.offsetHeight;
    box.innerHTML = '';
    return height;
}

/**
 * calculateCandidateLayout — מייצר מועמד פריסה לבלוק דו-טורי.
 * 
 * @param {object} opts
 * @param {Array} opts.items — רשימת פריטים מ-buildLayoutItems
 * @param {number} opts.colWidth — רוחב טור
 * @param {object} opts.styleObj
 * @param {number} opts.availHeight — גובה פנוי ב-balance block
 * @param {object} opts.splitAt — { itemIdx, lineIdx }: פסקה באינדקס itemIdx תחותך אחרי שורה lineIdx
 * @param {number} opts.footnoteReserve — גובה שמור להערות שוליים
 * @returns {LayoutCandidate}
 */
function calculateCandidateLayout(opts) {
    const { items, colWidth, styleObj, availHeight, splitAt, footnoteReserve = 0 } = opts;
    const candidate = new LayoutCandidate();
    candidate.splitPoint = splitAt;
    
    const effectiveAvailH = availHeight - footnoteReserve;
    let heightRight = 0;
    let heightLeft = 0;
    let pendingItem = null;  // לטוקן חלקי שעובר לעמוד הבא
    
    // שלב 1: מילוי טור ימין
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // האם זו נקודת הפיצול?
        const isSplitItem = (i === splitAt.itemIdx);
        
        if (item.type === 'heading') {
            const h = measureHeadingHeight(item, colWidth, styleObj);
            item.height = h;
            
            // Keep-With-Next: כותרת לא יכולה להישאר בודדת בסוף טור
            if (heightRight + h > effectiveAvailH - 30) {
                // אין מקום — דחיפה לטור שמאל או לעמוד הבא
                if (heightRight === 0) {
                    // הכותרת הראשונה בבלוק — חובה לשים בימין; נמשיך בכל זאת
                    candidate.rightCol.push({ ...item });
                    heightRight += h;
                } else {
                    pendingItem = { ...item, type: 'heading' };
                    break;
                }
            } else {
                candidate.rightCol.push({ ...item });
                heightRight += h;
            }
        } else if (item.type === 'paragraph') {
            if (isSplitItem && splitAt.lineIdx < item.totalLines) {
                // פסקה חלקית: לוקחים רק splitAt.lineIdx שורות
                const partial = measurePartialLines(
                    item.text, colWidth, styleObj,
                    splitAt.lineIdx,
                    { isContinuation: item.isContinuation }
                );
                candidate.rightCol.push({
                    ...item,
                    subType: 'partialHead',
                    lines: partial.lines.slice(),
                    height: partial.height,
                    partialLineIdx: splitAt.lineIdx,
                });
                heightRight += partial.height;
                
                // השארית הולכת לטור שמאל
                const remainingLines = item.allLines.slice(splitAt.lineIdx);
                if (remainingLines.length > 0) {
                    // FIX: מדידת גובה ה-partialTail כדי ש-heightLeft יהיה מדויק.
                    const tailMeasure = measureCandidateLines({
                        rawText: remainingLines.join(' '),
                        colWidth,
                        styleObj,
                        isContinuation: true,
                        isSingleLine: false,
                        numLines: 0,
                        contextClass: 'p-cut',
                        applyDelimiters: false,
                    });
                    candidate.leftCol.push({
                        ...item,
                        id: item.id + '-cont',
                        subType: 'partialTail',
                        lines: remainingLines.slice(),
                        isContinuation: true,
                        text: remainingLines.join(' '),
                        height: tailMeasure.height,
                    });
                    heightLeft += tailMeasure.height;
                }
                // FIX: אחרי פריט הפיצול החלקי, עוצרים את מילוי ימין — השאר הולך לשמאל.
                break;
            } else if (isSplitItem && splitAt.lineIdx >= item.totalLines) {
                // הפיצול נופל אחרי הפסקה — הפסקה שלמה בימין
                candidate.rightCol.push({ ...item });
                heightRight += item.height;
                // FIX: אחרי פריט הפיצול, עוצרים את מילוי ימין — השאר הולך לשמאל.
                break;
            } else {
                // פסקה שלמה — בודקים אם נכנסת בימין
                if (heightRight + item.height <= effectiveAvailH) {
                    candidate.rightCol.push({ ...item });
                    heightRight += item.height;
                } else {
                    // לא נכנסת — הולכת לשמאל (או לעמוד הבא אם גם שמאל מלא)
                    pendingItem = item;
                    break;
                }
            }
        }
    }
    
    // שלב 2: מילוי טור שמאל — ממשיך מאיפה שימין עצר
    let startIdxLeft = 0;
    if (pendingItem && candidate.leftCol.length === 0) {
        // הפריט הראשון של שמאל הוא ה-pendingItem — פריט שלא נכנס בימין
        if (pendingItem.type === 'paragraph') {
            candidate.leftCol.push({ ...pendingItem, subType: 'full' });
            heightLeft += pendingItem.height || 0;
        } else if (pendingItem.type === 'heading') {
            const h = measureHeadingHeight(pendingItem, colWidth, styleObj);
            pendingItem.height = h;
            candidate.leftCol.push({ ...pendingItem });
            heightLeft += h;
        }
        startIdxLeft = (items.indexOf(pendingItem) !== -1) ? items.indexOf(pendingItem) + 1 : 0;
    } else if (candidate.leftCol.length > 0) {
        // כבר יש פסקת המשך בשמאל (מ-splitAt חלקי) — נמשיך מאחריה
        startIdxLeft = splitAt.itemIdx + 1;
    } else {
        // FIX: כשהפיצול הוא "full" (פסקה שלמה בימין, ללא pendingItem וללא partialTail בשמאל),
        // טור שמאל חייב להתחיל מ- splitAt.itemIdx + 1 — אחרת הוא מכפיל את כל הפריטים!
        startIdxLeft = splitAt.itemIdx + 1;
    }
    
    for (let i = startIdxLeft; i < items.length; i++) {
        const item = items[i];
        if (item.type === 'heading') {
            const h = measureHeadingHeight(item, colWidth, styleObj);
            item.height = h;
            if (heightLeft + h <= effectiveAvailH) {
                candidate.leftCol.push({ ...item });
                heightLeft += h;
            } else {
                // לא נכנס בשמאל — יעבור לעמוד הבא כ-pending
                candidate.pendingWordTokens = { token: item, remainingLines: [] };
                break;
            }
        } else if (item.type === 'paragraph') {
            if (heightLeft + item.height <= effectiveAvailH) {
                candidate.leftCol.push({ ...item });
                heightLeft += item.height;
            } else {
                // פסקה לא נכנסת — ננסה חלוקה חלקית של שמאל
                // נמצא את K השורות המקסימליות שנכנסות
                let bestK = 0;
                let bestHeight = 0;
                for (let k = 1; k <= item.totalLines; k++) {
                    const partial = measurePartialLines(
                        item.text, colWidth, styleObj, k,
                        { isContinuation: false }
                    );
                    if (heightLeft + partial.height <= effectiveAvailH) {
                        bestK = k;
                        bestHeight = partial.height;
                    } else break;
                }
                if (bestK > 0) {
                    const partial = measurePartialLines(
                        item.text, colWidth, styleObj, bestK,
                        { isContinuation: false }
                    );
                    candidate.leftCol.push({
                        ...item,
                        subType: 'partialHead',
                        lines: partial.lines.slice(),
                        height: partial.height,
                        partialLineIdx: bestK,
                    });
                    heightLeft += bestHeight;
                    
                    // שארית הולכת לעמוד הבא
                    const remainingLines = item.allLines.slice(bestK);
                    if (remainingLines.length > 0) {
                        candidate.pendingWordTokens = {
                            token: { id: item.id, type: 'p', text: item.text },
                            remainingLines: remainingLines.slice(),
                        };
                    }
                } else {
                    // אפילו שורה אחת לא נכנסת — כל הפסקה לעמוד הבא
                    candidate.pendingWordTokens = {
                        token: { id: item.id, type: 'p', text: item.text },
                        remainingLines: item.allLines.slice(),
                    };
                }
                break;
            }
        }
    }
    
    // שלב 3: חישוב overflow ו-quality
    candidate.heights.right = heightRight;
    candidate.heights.left = heightLeft;
    candidate.overflow.right = Math.max(0, heightRight - effectiveAvailH);
    candidate.overflow.left = Math.max(0, heightLeft - effectiveAvailH);
    
    // נתוני איכות
    if (candidate.rightCol.length > 0) {
        const last = candidate.rightCol[candidate.rightCol.length - 1];
        if (last.type === 'heading') {
            candidate.quality.headingAtEndOfRight = true;
        } else if (last.subType === 'partialHead') {
            candidate.quality.rightLastLineWordCount = last.lines[last.lines.length - 1]
                ? last.lines[last.lines.length - 1].split(/\s+/).filter(w => w.length > 0).length
                : 0;
        }
    }
    if (candidate.leftCol.length > 0) {
        const first = candidate.leftCol[0];
        if (first.subType === 'partialTail') {
            candidate.quality.leftFirstLineWordCount = first.lines[0]
                ? first.lines[0].split(/\s+/).filter(w => w.length > 0).length
                : 0;
        }
    }
    
    return candidate;
}

/**
 * scoreCandidate — מחשב ציון איכות למועמד. נמוך יותר = טוב יותר.
 * 
 * @param {LayoutCandidate} candidate
 * @param {number} availHeight
 * @returns {number} score
 */
function scoreCandidate(candidate, availHeight) {
    const heights = candidate.heights;
    const overflow = candidate.overflow;
    const quality = candidate.quality;
    
    // 1. Height Penalty — חריגה אסורה (כפי שהוגדר ב-EC-01)
    let score = 0;
    score += overflow.right * 5000;  // ימין חורג — קריטי
    score += overflow.left * 5000;   // שמאל חורג — קריטי
    
    if (overflow.right > 0 || overflow.left > 0) {
        candidate.score = score;
        return score;  // אין טעם להמשיך — חריגה פוסלת
    }
    
    // 2. Base score: |ΔH| עם עדיפות עברית (ימין ארוך מעט יותר משמאל)
    const deltaH = heights.right - heights.left;
    if (deltaH >= 0 && deltaH <= 24) {
        score += deltaH * 0.6;  // בונוס — מבנה עברי טבעי
    } else if (deltaH < 0) {
        score += Math.abs(deltaH) * 1.3;  // קנס — שמאל ארוך מימין
    } else {
        score += deltaH;  // ניטרלי
    }
    
    // 3. Quality penalties
    if (quality.headingAtEndOfRight) score += 200;  // כותרת יתוממה
    // Runt penalty עם graded cost (מבוסס על postext §3.1)
    // 1-word runt (single word stranded on last line) — קנס חמור ביותר
    // 2-word runt — קנס בינוני-חזק
    // 3-word runt — קנס קל
    if (quality.rightLastLineWordCount === 1) {
        score += 1000;  // runt במילה בודדת — המצב הגרוע ביותר
    } else if (quality.rightLastLineWordCount === 2) {
        score += 500;   // runt בשתי מילים
    } else if (quality.rightLastLineWordCount === 3) {
        score += 200;   // runt בשלוש מילים
    }
    if (quality.leftFirstLineWordCount > 0 && quality.leftFirstLineWordCount < 2) {
        score += 50;  // שורה ראשונה קצרה מדי בשמאל
    }
    
    candidate.score = score;
    return score;
}

/**
 * findBestSplitPoint — בוחן כל נקודות הפיצול החוקיות ומחזיר את המועמד הטוב ביותר.
 * זהו הלב של איזון הטורים החדש: במקום "לתקן" אחרי רינדור, בוחרים breakpoint מראש.
 * 
 * @param {object} opts — אותם אפשרויות כמו calculateCandidateLayout, בלי splitAt
 * @returns {{ best: LayoutCandidate, candidates: LayoutCandidate[] }}
 */
function findBestSplitPoint(opts) {
    const { items } = opts;
    const candidates = [];
    let best = null;
    let bestScore = Infinity;
    
    // יצירת נקודות פיצול מועמדות
    // לכל פסקה באינדקס i, נסה חיתוך אחרי שוראות 1, 2, ..., totalLines-1, totalLines (שלם)
    const splitPoints = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type === 'paragraph' && item.totalLines > 1) {
            // חיתוך חלקי אחרי שורה K (1 ≤ K < totalLines)
            for (let k = 1; k < item.totalLines; k++) {
                splitPoints.push({ itemIdx: i, lineIdx: k, type: 'partial' });
            }
        }
        // חיתוך "שלם" — אחרי הפריט כולו
        splitPoints.push({ itemIdx: i, lineIdx: item.totalLines || 0, type: 'full' });
    }
    
    // אם אין נקודות פיצול (בלוק בן פריט אחד בלבד) — נסה חלוקה חלקית
    if (splitPoints.length === 0 && items.length === 1 && items[0].type === 'paragraph') {
        for (let k = 1; k < items[0].totalLines; k++) {
            splitPoints.push({ itemIdx: 0, lineIdx: k, type: 'partial' });
        }
    }
    
    for (const sp of splitPoints) {
        try {
            const candidate = calculateCandidateLayout({
                ...opts,
                splitAt: sp,
            });
            scoreCandidate(candidate, opts.availHeight);
            candidate.candidateBreakpoints = splitPoints.slice();  // שמירת היסטוריה
            candidates.push({ splitPoint: sp, score: candidate.score, candidate });
            
            if (candidate.score < bestScore) {
                bestScore = candidate.score;
                best = candidate;
            }
        } catch (e) {
            console.warn('findBestSplitPoint: candidate failed at', sp, e);
        }
    }
    
    return { best, candidates };
}

/* ==========================================================================
   שלב ד' — continuationLineQuality + Look-ahead Line Breaking
   ==========================================================================
   הבעיה שפותר שלב זה:
   אם השורה האחרונה בטור ימין מכילה מילה בודדת או שני מילים עם רווח עצום
   ביניהן, ננסה להעביר 1–3 מילים מתחילת טור שמאל חזרה לסוף ימין.
   
   זהו look-ahead line breaking — הרבה יותר נכון מאשר word-spacing מלאכותי.
   ========================================================================== */

/**
 * continuationLineQuality — מחשב את איכות השורה האחרונה בטור ימין והראשונה בשמאל.
 * @returns {{ lastLineWordCount: number, lastLineFillRatio: number,
 *            firstLineWordCount: number, needsLookAhead: boolean }}
 */
function continuationLineQuality(candidate, colWidth) {
    if (candidate.rightCol.length === 0 || candidate.leftCol.length === 0) {
        return { lastLineWordCount: 0, lastLineFillRatio: 0, firstLineWordCount: 0, needsLookAhead: false };
    }
    
    const lastRight = candidate.rightCol[candidate.rightCol.length - 1];
    const firstLeft = candidate.leftCol[0];
    
    if (lastRight.type !== 'paragraph' || lastRight.subType !== 'partialHead') {
        return { lastLineWordCount: 0, lastLineFillRatio: 0, firstLineWordCount: 0, needsLookAhead: false };
    }
    
    const lastLine = lastRight.lines[lastRight.lines.length - 1] || '';
    const lastLineWords = lastLine.split(/\s+/).filter(w => w.length > 0);
    const lastLineWidth = lastRight.lastLineWidth || 0;
    
    // יחס מילוי: רוחב השורה האחרונה חלקי רוחב הטור
    const fillRatio = colWidth > 0 ? lastLineWidth / colWidth : 0;
    
    // האם צריך look-ahead?
    // נכון אם: שורה אחרונה בעלת פחות מ-3 מילים, או יחס מילוי נמוך (< 50%)
    const needsLookAhead = (lastLineWords.length < 3) || (fillRatio < 0.5 && lastLineWords.length < 5);
    
    let firstLineWordCount = 0;
    if (firstLeft.subType === 'partialTail' && firstLeft.lines && firstLeft.lines.length > 0) {
        firstLineWordCount = firstLeft.lines[0].split(/\s+/).filter(w => w.length > 0).length;
    }
    
    return {
        lastLineWordCount: lastLineWords.length,
        lastLineFillRatio: fillRatio,
        firstLineWordCount,
        needsLookAhead,
    };
}

/**
 * lookAheadLineBreak — מנסה להעביר 1–3 מילים מתחילת טור שמאל לסוף טור ימין
 * ובודק אם התוצאה טובה יותר.
 * 
 * @param {LayoutCandidate} candidate — המועמד הנוכחי
 * @param {object} opts — אפשרויות calculateCandidateLayout
 * @returns {LayoutCandidate} — המועמד המשופר או המקורי
 */
function lookAheadLineBreak(candidate, opts) {
    const quality = continuationLineQuality(candidate, opts.colWidth);
    if (!quality.needsLookAhead) return candidate;
    
    const sp = candidate.splitPoint;
    if (!sp) return candidate;
    
    // נסה להזיז את נקודת החיתוך ב-1, 2, 3 שורות קדימה
    // (כלומר: לקחת שורה אחת נוספת משמאל לתוך ימין)
    let bestCandidate = candidate;
    let bestScore = candidate.score;
    
    for (let delta = 1; delta <= 3; delta++) {
        const newLineIdx = sp.lineIdx + delta;
        const item = opts.items[sp.itemIdx];
        if (!item || newLineIdx >= item.totalLines) break;
        
        try {
            const altCandidate = calculateCandidateLayout({
                ...opts,
                splitAt: { itemIdx: sp.itemIdx, lineIdx: newLineIdx, type: 'partial' },
            });
            scoreCandidate(altCandidate, opts.availHeight);
            
            // אם יש חריגה — לא טוב יותר
            if (altCandidate.overflow.right > 0 || altCandidate.overflow.left > 0) continue;
            
            // נשווה ציון + נתוני איכות
            const altQuality = continuationLineQuality(altCandidate, opts.colWidth);
            
            // שיפור אם: הציון טוב יותר, או שהשורה האחרונה בימין מלאה יותר
            if (altCandidate.score < bestScore ||
                (altQuality.lastLineWordCount > quality.lastLineWordCount && altCandidate.score <= bestScore + 20)) {
                bestScore = altCandidate.score;
                bestCandidate = altCandidate;
            }
        } catch (e) {
            // דילוג בשקט
        }
    }
    
    return bestCandidate;
}

/**
 * applyCandidateLayoutToDOM — מצייר LayoutCandidate אל DOM חי.
 * זהו השלב הסופי: לוקחים את המועמד הזוכה ומכניסים אותו לעמוד.
 * 
 * @param {HTMLElement} block — אלמנט .block-2col
 * @param {LayoutCandidate} candidate
 * @param {object} styleObj
 * @param {number} colWidth
 */
function applyCandidateLayoutToDOM(block, candidate, styleObj, colWidth) {
    const rCol = block.querySelector('.right-col');
    const lCol = block.querySelector('.left-col');
    if (!rCol || !lCol) return;
    
    // ניקוי טורים
    rCol.innerHTML = '';
    lCol.innerHTML = '';
    
    // נטרול שכבות יישור ישנות
    if (typeof resetColumnJustificationStyles === 'function') {
        resetColumnJustificationStyles(rCol);
        resetColumnJustificationStyles(lCol);
    }
    
    function renderItem(target, item) {
        if (item.type === 'heading') {
            const h = document.createElement('div');
            h.className = item.customStyleId ? 'title-level-custom' : `title-level-${item.level}`;
            h.setAttribute('data-token-id', item.id);
            h.textContent = item.text;
            target.appendChild(h);
        } else if (item.type === 'paragraph') {
            const p = document.createElement('p');
            const isPartialHead = item.subType === 'partialHead';
            const isPartialTail = item.subType === 'partialTail';
            const isCont = item.isContinuation || isPartialTail;
            
            p.className = isCont ? 'p-cut' : (isPartialHead ? 'p-cut' : 'p-end');
            p.setAttribute('data-token-id', item.id);
            
            // פעולה 4 — תיקון אינטגרציה קריטי: ה-renderer חייב לכבד את השורות
            // ש-Knuth-Plass חישב. בעבר, הקוד עשה item.lines.join(' ') והדפדפן
            // שבר שורות מחדש — מה שביטל לחלוטין את עבודת KP וגרם לרגרסיות.
            //
            // עכשיו: אם יש שורות מ-KP (מסומנות _fromKp), נכניס <br> ביניהן
            // כדי לכפות את החלוקה. השורות עצמן יעברו escapeHTML וייושרו ע"י הדפדפן.
            // השורה האחרונה תקבל text-align-last: right (או var) כדי לא למתוח אותה.
            let text = item.text;
            let usedKpLines = false;
            if (_kpBrEnabled && item._fromKp && item.lines && item.lines.length > 1) {
                // שורות מ-KP — נכבד אותן עם <br>
                text = item.lines.map(line => escapeHTML(line)).join('<br>');
                usedKpLines = true;
            } else if (item.lines && item.lines.length > 0) {
                // שורות מ-DOM probe הישן — נשתמש ב-join(' ') כמו קודם
                text = item.lines.join(' ');
            }
            
            // יישום drop-word/dibbur-hamatchil
            if (isCont || usedKpLines) {
                // פסקת המשך או פסקה עם שורות KP — אין drop-word
                // (drop-word רלוונטי רק לפסקה ראשונה, ו-KP כבר התחשב בו)
                if (usedKpLines) {
                    p.innerHTML = text;
                } else {
                    p.innerHTML = escapeHTML(text);
                }
            } else {
                p.innerHTML = createDropWord(text, false, item.totalLines === 1, item.totalLines || 2);
            }
            
            target.appendChild(p);
            
            // יישום delimiters
            if (typeof applyDelimiterStyles === 'function') {
                applyDelimiterStyles(p, 'body', getBodySizePt ? getBodySizePt() : 11, false);
            }
        }
    }
    
    // רינדור ימין
    for (const item of candidate.rightCol) {
        renderItem(rCol, item);
    }
    // רינדור שמאל
    for (const item of candidate.leftCol) {
        renderItem(lCol, item);
    }
    
    // עדכון קו מפריד אנכי
    const divider = block.querySelector('.col-gutter-divider');
    if (divider && rCol && lCol) {
        const minH = Math.min(rCol.scrollHeight, lCol.scrollHeight);
        divider.style.alignSelf = 'start';
        divider.style.height = minH + 'px';
    }
}

/**
 * balanceColumnsV2 — הפונקציה החדשה שמחליפה את הישנה בארכיטקטורה.
 * בונה items, מוצא breakpoint אופטימלי, מפעיל look-ahead, ומצייר ל-DOM.
 * 
 * @param {HTMLElement} block — אלמנט .block-2col
 * @param {number} colWidth
 * @param {object} styleObj
 * @param {Array} tokens — טוקנים של הבלוק
 * @param {object} pendingWordTokensIn — טוקן חלקי מבלוק קודם
 * @param {number} availHeight
 * @param {number} footnoteReserve
 * @returns {{ pendingWordTokens: object|null, didBalance: boolean, candidate: LayoutCandidate }}
 */
function balanceColumnsV2(block, colWidth, styleObj, tokens, pendingWordTokensIn, availHeight, footnoteReserve = 0) {
    // 1. בניית רשימת פריטים מטוקנים
    const { items } = buildLayoutItems(tokens, styleObj, colWidth, pendingWordTokensIn);
    
    if (items.length === 0) {
        return { pendingWordTokens: null, didBalance: false, candidate: null };
    }
    
    // 2. חיפוש נקודת הפיצול הטובה ביותר
    const { best, candidates } = findBestSplitPoint({
        items,
        colWidth,
        styleObj,
        availHeight,
        footnoteReserve,
    });
    
    if (!best) {
        console.warn('balanceColumnsV2: no valid candidate found');
        return { pendingWordTokens: null, didBalance: false, candidate: null };
    }
    
    // 3. Look-ahead line breaking
    const improved = lookAheadLineBreak(best, {
        items,
        colWidth,
        styleObj,
        availHeight,
        footnoteReserve,
    });
    
    // 4. רישום החלטה ל-debug
    if (window.__layoutDecisionsLog) {
        window.__layoutDecisionsLog.push({
            blockId: block.id || 'unknown',
            chosenSplitPoint: improved.splitPoint,
            candidateCount: candidates.length,
            score: improved.score,
            heights: improved.heights,
            quality: continuationLineQuality(improved, colWidth),
            lookedAhead: (improved !== best),
            alternatives: candidates.slice(0, 5).map(c => ({
                splitPoint: c.splitPoint,
                score: c.score,
            })),
        });
    }
    
    // 5. רינדור ל-DOM
    applyCandidateLayoutToDOM(block, improved, styleObj, colWidth);
    
    // 6. עדכון _lastLayoutPerBlock למנגנון ה-reflow
    if (typeof _lastLayoutPerBlock !== 'undefined' && _lastLayoutPerBlock) {
        _lastLayoutPerBlock.set(block, {
            candidate: improved,
            tokens,
            pendingWordTokensIn,
            colWidth,
            styleObj,
            availHeight,
            footnoteReserve,
            timestamp: Date.now(),
        });
    }
    
    return {
        pendingWordTokens: improved.pendingWordTokens,
        didBalance: true,
        candidate: improved,
    };
}

/* ==========================================================================
   שלב ה' — Reflow Invalidation
   ==========================================================================
   הבעיה שפותר שלב זה:
   כל שינוי שמאוחר יותר משפיע על גובה (line-height, margin-bottom, heading margin,
   font-size, word-spacing) אסור להמשיך כאילו חלוקת המילים הקודמת עדיין תקפה.
   
   צריך: mutation → invalidate → remeasure → reflow affected block → 
   reflow following pages if necessary.
   ========================================================================== */

// מפה של פריסות אחרונות לכל בלוק, לשימוש ב-reflow
const _lastLayoutPerBlock = new Map();
// מערך גלובלי של "עמודים מושפעים" שדורשים reflow
const _reflowQueue = { pending: new Set(), processing: false };

/**
 * layoutInvalidator — מנגנון שינוי שמשדרג את העמודים המושפעים.
 */
const layoutInvalidator = {
    /**
     * invalidateBlock — מסמן בלוק כ-"dirty" ומפעיל reflow ב-rAF הבא.
     * @param {HTMLElement} block — אלמנט .block-2col
     */
    invalidateBlock(block) {
        if (!block) return;
        _reflowQueue.pending.add(block);
        this._scheduleReflow();
    },
    
    /**
     * invalidateFromTokenIdx — מסמן את כל העמודים מ-idx זה ואילך כ-dirty.
     * משמש כאשר שינוי גלובלי (font-size, line-height) משפיע על הכל.
     * @param {number} fromTokenIdx
     */
    invalidateFromTokenIdx(fromTokenIdx) {
        // נסרוק את כל הבלוקים בעמודים מ-tokenIdx ואילך
        const blocks = document.querySelectorAll('.a4-page .block-2col');
        let started = false;
        for (const block of blocks) {
            const layout = _lastLayoutPerBlock.get(block);
            if (!layout) continue;
            // בדיקה: האם הבלוק הזה מכיל טוקן מ-fromTokenIdx ואילך?
            const tokenIds = layout.tokens.map(t => parseInt(t.id, 10)).filter(n => !isNaN(n));
            const minTokenId = tokenIds.length > 0 ? Math.min(...tokenIds) : 0;
            if (minTokenId >= fromTokenIdx || started) {
                started = true;
                _reflowQueue.pending.add(block);
            }
        }
        this._scheduleReflow();
    },
    
    /**
     * _scheduleReflow — מתזמן טיפול בתור ה-reflow ב-rAF הבא.
     */
    _scheduleReflow() {
        if (_reflowQueue.processing) return;  // כבר מתוזמן
        _reflowQueue.processing = true;
        requestAnimationFrame(() => {
            this._processReflowQueue();
        });
    },
    
    /**
     * _processReflowQueue — מעבד את הבלוקים שבתור.
     * קורא מחדש ל-balanceColumnsV2 עבור כל בלוק dirty, עם הפרמטרים המקוריים.
     */
    _processReflowQueue() {
        _reflowQueue.processing = false;
        if (_reflowQueue.pending.size === 0) return;
        
        const toProcess = Array.from(_reflowQueue.pending);
        _reflowQueue.pending.clear();
        
        for (const block of toProcess) {
            if (!document.body.contains(block)) continue;  // הוסר מ-DOM
            const layout = _lastLayoutPerBlock.get(block);
            if (!layout) continue;
            
            try {
                const result = balanceColumnsV2(
                    block,
                    layout.colWidth,
                    layout.styleObj,
                    layout.tokens,
                    layout.pendingWordTokensIn,
                    layout.availHeight,
                    layout.footnoteReserve
                );
                
                // אם ה-pendingWordTokens השתנה — ייתכן שהעמוד הבא צריך reflow
                if (result.pendingWordTokens && 
                    JSON.stringify(result.pendingWordTokens) !== JSON.stringify(layout.pendingWordTokensIn || null)) {
                    // נסמן את הבלוק הבא כ-dirty גם כן (cascade reflow)
                    const nextPage = block.closest('.a4-page')?.nextElementSibling;
                    if (nextPage) {
                        const nextBlock = nextPage.querySelector('.block-2col');
                        if (nextBlock) this.invalidateBlock(nextBlock);
                    }
                }
            } catch (e) {
                console.error('Reflow failed for block', block.id, e);
            }
        }
        
        // אם התווספו בלוקים חדשים בינתיים — נקלוט אותם ב-rAF הבא
        if (_reflowQueue.pending.size > 0) {
            this._scheduleReflow();
        }
    },
};

/**
 * triggerReflowFromMutation — מופעל כאשר distributeColumnJustification או פונקציה
 * אחרת משנה גובה. בודק אם השינוי משמעותי ומפעיל reflow.
 */
function triggerReflowFromMutation(block, beforeHeight, afterHeight) {
    if (!block) return;
    const delta = Math.abs(afterHeight - beforeHeight);
    if (delta <= 2) return;  // שינוי זניח — אין צורך ב-reflow
    layoutInvalidator.invalidateBlock(block);
}

/* ==========================================================================
   שלב ו' — לינטר חכם שמתעד החלטות
   ========================================================================== */

/**
 * LayoutDecisionsLinter — לינטר שמתעד החלטות עימוד ובודק את איכותן.
 * בניגוד ללינטר הישן שבדק תוצאות (height diff, overflow), לינטר זה בודק
 * החלטות: האם האלגוריתם בחר breakpoint גרוע למרות שקיימת חלופה טובה יותר?
 */
class LayoutDecisionsLinter {
    constructor() {
        this.reports = [];  // דוחות לכל בלוק
    }
    
    /**
     * lintBlock — בודק בלוק בודד ומייצר דוח.
     */
    lintBlock(blockId, candidate, candidates, block) {
        const report = {
            blockId,
            timestamp: Date.now(),
            chosen: candidate ? {
                splitPoint: candidate.splitPoint,
                score: candidate.score,
                heights: candidate.heights,
                overflow: candidate.overflow,
                quality: continuationLineQuality(candidate, 
                    block ? (block.offsetWidth || 272) : 272),
            } : null,
            alternatives: candidates.slice(0, 10).map(c => ({
                splitPoint: c.splitPoint,
                score: c.score,
            })),
            issues: [],
            recommendations: [],
        };
        
        if (!candidate) {
            report.issues.push('NO_VALID_CANDIDATE: אף מועמד לא נמצא');
            this.reports.push(report);
            return report;
        }
        
        // בדיקה 1: האם יש חלופה טובה יותר מהנבחרת?
        const sorted = [...candidates].sort((a, b) => a.score - b.score);
        if (sorted.length > 1 && sorted[0].splitPoint !== candidate.splitPoint) {
            report.issues.push(`BETTER_ALTERNATIVE_REJECTED: נבחר ${JSON.stringify(candidate.splitPoint)} (score ${candidate.score}) אך קיימת חלופה ${JSON.stringify(sorted[0].splitPoint)} (score ${sorted[0].score})`);
        }
        
        // בדיקה 2: חריגת גובה
        if (candidate.overflow.right > 0) {
            report.issues.push(`RIGHT_OVERFLOW: טור ימין חורג ב-${candidate.overflow.right.toFixed(1)}px`);
        }
        if (candidate.overflow.left > 0) {
            report.issues.push(`LEFT_OVERFLOW: טור שמאל חורג ב-${candidate.overflow.left.toFixed(1)}px`);
        }
        
        // בדיקה 3: כותרת יתוממה בסוף טור
        if (candidate.quality.headingAtEndOfRight) {
            report.issues.push('HEADING_ORPHAN: כותרת נותרה בודדת בסוף טור ימין');
            report.recommendations.push('יש להעביר את הכותרת לטור שמאל או לעמוד הבא');
        }
        
        // בדיקה 4: שורה אחרונה דלילה
        const quality = continuationLineQuality(candidate, block ? (block.offsetWidth || 272) : 272);
        if (quality.lastLineWordCount > 0 && quality.lastLineWordCount < 3) {
            report.issues.push(`SPARSE_LAST_LINE: השורה האחרונה בימין מכילה ${quality.lastLineWordCount} מילים בלבד (יחס מילוי ${(quality.lastLineFillRatio * 100).toFixed(0)}%)`);
            report.recommendations.push('יש לבצע look-ahead line breaking כדי להעביר מילים נוספות משמאל');
        }
        
        // בדיקה 5: פער גובה גדול בין טורים
        const deltaH = Math.abs(candidate.heights.right - candidate.heights.left);
        if (deltaH > 60) {
            report.issues.push(`LARGE_HEIGHT_DIFFERENCE: פער של ${deltaH.toFixed(1)}px בין הטורים`);
        }
        
        // בדיקה 6: לא נמצא מועמד עם score נמוך מ-50 (כל המועמדים גרועים)
        const bestScore = sorted.length > 0 ? sorted[0].score : Infinity;
        if (bestScore > 50) {
            report.issues.push(`NO_GOOD_CANDIDATE: הציון הטוב ביותר הוא ${bestScore.toFixed(1)} — אין מועמד איכותי`);
            report.recommendations.push('ייתכן שהבלוק גדול מדי או שסך התוכן אינו מתאים לשני טורים');
        }
        
        this.reports.push(report);
        return report;
    }
    
    /**
     * getReportHTML — מייצר דוח HTML מכל ה-reports.
     */
    getReportHTML() {
        const issues = this.reports.filter(r => r.issues.length > 0);
        const totalBlocks = this.reports.length;
        const totalIssues = issues.reduce((sum, r) => sum + r.issues.length, 0);
        
        let html = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<title>דוח החלטות עימוד</title>
<style>
body { font-family: 'Assistant', 'פרנק רוהל ליברה רגיל', serif; padding: 20px; max-width: 1000px; margin: 0 auto; }
h1 { color: #1e3a8a; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
.summary { background: #f8fafc; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 11pt; }
.block { border: 1px solid #e2e8f0; padding: 12px; margin-bottom: 12px; border-radius: 6px; }
.block-ok { background: #f0fdf4; border-color: #86efac; }
.block-warn { background: #fefce8; border-color: #fde047; }
.block-error { background: #fef2f2; border-color: #fca5a5; }
.issue { color: #dc2626; font-size: 10pt; margin: 4px 0; }
.recommendation { color: #2563eb; font-size: 10pt; margin: 4px 0; font-style: italic; }
.candidate-table { font-size: 9pt; width: 100%; border-collapse: collapse; margin-top: 8px; }
.candidate-table th, .candidate-table td { border: 1px solid #cbd5e1; padding: 4px 8px; }
.candidate-table th { background: #f1f5f9; }
.chosen { background: #fef9c3; font-weight: bold; }
</style>
</head>
<body>
<h1>📊 דוח החלטות עימוד — Layout Decisions Linter</h1>
<div class="summary">
<strong>סיכום:</strong> ${totalBlocks} בלוקים נבדקו | ${issues.length} עם בעיות | סך ${totalIssues} בעיות
</div>
`;
        
        for (const report of this.reports) {
            const cls = report.issues.length === 0 ? 'block-ok' : 
                       (report.issues.length <= 2 ? 'block-warn' : 'block-error');
            html += `<div class="block ${cls}">`;
            html += `<strong>בלוק ${escapeHTML(report.blockId)}</strong>`;
            if (report.chosen) {
                html += ` — נקודת חיתוך: <code>${JSON.stringify(report.chosen.splitPoint)}</code>`;
                html += ` | ציון: ${report.chosen.score.toFixed(1)}`;
                html += ` | גובה ימין: ${report.chosen.heights.right.toFixed(0)}px`;
                html += ` | גובה שמאל: ${report.chosen.heights.left.toFixed(0)}px`;
            }
            
            for (const issue of report.issues) {
                html += `<div class="issue">⚠️ ${escapeHTML(issue)}</div>`;
            }
            for (const rec of report.recommendations) {
                html += `<div class="recommendation">💡 ${escapeHTML(rec)}</div>`;
            }
            
            if (report.alternatives.length > 1) {
                html += '<table class="candidate-table"><thead><tr><th>נקודת חיתוך</th><th>ציון</th><th>סטטוס</th></tr></thead><tbody>';
                const sorted = [...report.alternatives].sort((a, b) => a.score - b.score);
                for (const alt of sorted.slice(0, 5)) {
                    const isChosen = report.chosen && JSON.stringify(alt.splitPoint) === JSON.stringify(report.chosen.splitPoint);
                    html += `<tr class="${isChosen ? 'chosen' : ''}"><td>${escapeHTML(JSON.stringify(alt.splitPoint))}</td><td>${alt.score.toFixed(1)}</td><td>${isChosen ? '✓ נבחר' : ''}</td></tr>`;
                }
                html += '</tbody></table>';
            }
            
            html += '</div>';
        }
        
        html += '</body></html>';
        return html;
    }
    
    /**
     * clear — מנקה את כל ה-reports.
     */
    clear() {
        this.reports = [];
    }
}

// גלובלי: לינטר יחיד לכל המסמך
const layoutLinter = new LayoutDecisionsLinter();
// גלובלי: יומן החלטות (משמש גם את exportPageDebugReport)
window.__layoutDecisionsLog = window.__layoutDecisionsLog || [];

// ייצוא מפורש של מחלקות/אובייקטים ל-window — חיוני כדי שיהיו זמינים לסקריפטים חיצוניים
// (במצב רגיל, const ו-class אינם מצורפים ל-window אוטומטית).
window.LayoutCandidate = LayoutCandidate;
window.LayoutDecisionsLinter = LayoutDecisionsLinter;
window.layoutLinter = layoutLinter;
window.layoutInvalidator = layoutInvalidator;
window.buildMeasureClone = buildMeasureClone;
window.measureCandidateLines = measureCandidateLines;
window.measureParagraphHeight = measureParagraphHeight;
window.measurePartialLines = measurePartialLines;
// פעולה 3 חלק ב' — Canvas API
window.measureWordWidth = measureWordWidth;
window.measureLineWidthCanvas = measureLineWidthCanvas;
window.estimateLineCountCanvas = estimateLineCountCanvas;
window.resetWordWidthCache = resetWordWidthCache;
window.getWordWidthCacheStats = getWordWidthCacheStats;
// פעולה 4 — Knuth-Plass
window.knuthPlassBreak = knuthPlassBreak;
window.isKnuthPlassAvailable = isKnuthPlassAvailable;
window.isKnuthPlassEnabled = isKnuthPlassEnabled;
window.setKnuthPlassEnabled = setKnuthPlassEnabled;
window.resetKpCache = resetKpCache;
window.getKpCacheStats = getKpCacheStats;
window.buildLayoutItems = buildLayoutItems;
window.measureHeadingHeight = measureHeadingHeight;
window.calculateCandidateLayout = calculateCandidateLayout;
window.scoreCandidate = scoreCandidate;
window.findBestSplitPoint = findBestSplitPoint;
window.continuationLineQuality = continuationLineQuality;
window.lookAheadLineBreak = lookAheadLineBreak;
window.applyCandidateLayoutToDOM = applyCandidateLayoutToDOM;
window.balanceColumnsV2 = balanceColumnsV2;
window.triggerReflowFromMutation = triggerReflowFromMutation;

function balanceColumns(block, colWidth, styleObj, snapshot, availableHeight = Infinity, traceObj = null) {
    if (snapshot) {
        footnoteQueueForPage.length = snapshot.footnoteQueueLen;
        endnoteQueueForPart.length = snapshot.endnoteQueueLen;
        noteCounters.footnote = snapshot.footnoteCounter;
        noteCounters.endnote = snapshot.endnoteCounter;
        noteUidCounter = snapshot.noteUid;
    }

    const rCol = block.querySelector('.right-col');
    const lCol = block.querySelector('.left-col');
    if (!rCol || !lCol) return;
    const allChildren = [...Array.from(rCol.children), ...Array.from(lCol.children)];
    if (allChildren.length === 0) return;

    let mergedItems = [];
    for (let child of allChildren) {
        if (child.tagName === 'P') {
            let id = child.getAttribute('data-token-id');
            let text = child.getAttribute('data-raw-text');
            let isCont = child.getAttribute('data-is-cont') === 'true';
            let sideNote = child.getAttribute('data-side-note');
            let endNote = child.getAttribute('data-end-note');
            let sideNoteStyleId = child.getAttribute('data-note-style-id');
            let lastItem = mergedItems[mergedItems.length - 1];
            if (lastItem && lastItem.type === 'p' && lastItem.id === id) {
                lastItem.rawText += ' ' + text;
                if (sideNote && !lastItem.sideNote) {
                    lastItem.sideNote = sideNote;
                    lastItem.sideNoteStyleId = sideNoteStyleId;
                }
                if (endNote && !lastItem.endNote) lastItem.endNote = endNote;
            } else {
                mergedItems.push({
                    type: 'p',
                    id: id,
                    rawText: text,
                    isCont: isCont,
                    sideNote: sideNote,
                    endNote: endNote,
                    sideNoteStyleId: sideNoteStyleId
                });
            }
        } else {
            mergedItems.push({
                type: 'h',
                id: child.getAttribute('data-token-id'),
                html: child.outerHTML,
                level: child.className.match(/title-level-(\d+)/)?.[1]
            });
        }
    }

    const items = mergedItems.map(item => {
        if (item.type === 'p') {
            let linesInfo = getLinesFromParagraph(item.rawText, colWidth, styleObj, !item.isCont);
            return {
                ...item,
                lines: linesInfo.lines,
                isSingleLine: linesInfo.lines.length <= 1,
                hasWindow: linesInfo.hasWindow,
                numLines: linesInfo.lines.length,
                _fromKp: !!linesInfo._fromKp,  // העבר סימון KP ל-renderer
            };
        }
        return item;
    });

    const { avoidOrphans, avoidWidows } = getWidowOrphanPrefs();

    const splitPoints = [];
    for (let i = 0; i <= items.length; i++) {
        if (i < items.length && items[i].type === 'p') {
            let lines = items[i].lines;
            splitPoints.push({ itemIndex: i, lineIndex: 0 });
            for (let l = 1; l < lines.length; l++) {
                if (avoidWidows && l === 1) continue;
                if (avoidOrphans && (lines.length - l) === 1) continue;
                if (lineBreakCrossesNoteSpan(lines, l)) continue;

                // מניעת שורה בודדת לאחר כותרת בטור ימין
                if (i > 0 && items[i - 1].type === 'h' && l < 2) continue;

                // פסילת חיתוכים שבהם השורה האחרונה בטור ימין מכילה פחות מ-3 מילים
                if (l > 0) {
                    const cutLineWords = (lines[l - 1] || '').trim().split(/\s+/);
                    if (cutLineWords.length < 3 && lines.length > 2) continue;
                }

                splitPoints.push({ itemIndex: i, lineIndex: l, lines: lines });
            }
        } else {
            splitPoints.push({ itemIndex: i, lineIndex: 0 });
        }
    }

    const validSplitPoints = splitPoints.filter(sp => {
        if (sp.lineIndex > 0) {
            if (sp.lines && lineBreakCrossesNoteSpan(sp.lines, sp.lineIndex)) return false;
            return true;
        }
        if (sp.itemIndex > 0 && items[sp.itemIndex - 1].type === 'h') return false;
        if (items.length > 0 && items[items.length - 1].type === 'h') return false;
        if (sp.itemIndex < items.length && items[sp.itemIndex].type === 'h') {
            if (sp.itemIndex === items.length - 1) return false;
        }
        return true;
    });

    let pointsToEvaluate = validSplitPoints.length > 0 ? validSplitPoints : splitPoints;
    if (pointsToEvaluate.length === 0) return;

    function renderSingleItemFast(col, item) {
        if (item.type === 'h') {
            col.insertAdjacentHTML('beforeend', item.html);
        } else {
            const p = document.createElement('p');
            p.className = 'p-end';
            // פעולה 4 — כבד שורות KP עם <br>
            if (_kpBrEnabled && item._fromKp && item.lines && item.lines.length > 1) {
                p.innerHTML = item.lines.map(line => escapeHTML(line)).join('<br>');
            } else {
                p.innerHTML = createDropWord(item.rawText, item.isCont, item.isSingleLine, item.numLines);
            }
            applyDelimiterStyles(p, 'body', getBodySizePt(), true);
            col.appendChild(p);
        }
    }

    let bestSplit = pointsToEvaluate[0];
    let minScore = Infinity;
    let bestDiff = Infinity;

    for (let sp of pointsToEvaluate) {
        rCol.innerHTML = '';
        for (let i = 0; i < sp.itemIndex; i++) renderSingleItemFast(rCol, items[i]);
        if (sp.lineIndex > 0) {
            let item = items[sp.itemIndex];
            let pRight = document.createElement('p');
            pRight.className = 'p-cut';
            // פעולה 4 — כבד שורות KP עם <br> בפיצול טורים
            let rightText;
            if (item._fromKp) {
                rightText = sp.lines.slice(0, sp.lineIndex).map(l => escapeHTML(l)).join('<br>');
                pRight.innerHTML = rightText;
            } else {
                rightText = sp.lines.slice(0, sp.lineIndex).join(' ');
                pRight.innerHTML = createDropWord(rightText, item.isCont, false, sp.lineIndex);
            }
            applyDelimiterStyles(pRight, 'body', getBodySizePt(), true);
            rCol.appendChild(pRight);
        }
        let rHeight = rCol.scrollHeight;

        lCol.innerHTML = '';
        if (sp.lineIndex > 0) {
            let item = items[sp.itemIndex];
            let pLeft = document.createElement('p');
            pLeft.className = 'p-end';
            // פעולה 4 — כבד שורות KP עם <br> בפיצול טורים
            let leftText;
            if (item._fromKp) {
                leftText = sp.lines.slice(sp.lineIndex).map(l => escapeHTML(l)).join('<br>');
                pLeft.innerHTML = leftText;
            } else {
                leftText = sp.lines.slice(sp.lineIndex).join(' ');
                pLeft.innerHTML = createDropWord(leftText, true, false, item.lines.length - sp.lineIndex);
            }
            applyDelimiterStyles(pLeft, 'body', getBodySizePt(), true);
            lCol.appendChild(pLeft);
        }
        for (let i = sp.lineIndex > 0 ? sp.itemIndex + 1 : sp.itemIndex; i < items.length; i++) {
            renderSingleItemFast(lCol, items[i]);
        }
        let lHeight = lCol.scrollHeight;

        let diff = rHeight - lHeight;
        let absDiff = Math.abs(diff);

        // בונוס משמעותי לחלוקה שבה טור ימין ארוך במעט או שווה לטור שמאל (מבנה עברי תקני)
        let balanceQualityScore = absDiff;
        if (diff >= 0 && diff <= 24) {
            balanceQualityScore *= 0.6;
        } else if (diff < 0) {
            balanceQualityScore *= 1.3;
        }

        let heightPenalty = 0;
        if (availableHeight && availableHeight < Infinity) {
            if (rHeight > availableHeight) heightPenalty += (rHeight - availableHeight) * 5000;
            if (lHeight > availableHeight) heightPenalty += (lHeight - availableHeight) * 5000;
        }

        // Runt penalty: אם נקודת החיתוך יוצרת שורה דלילה בסוף טור ימין (p-cut).
        // sp.lines[sp.lineIndex - 1] היא השורה האחרונה של החלק שנשאר בימין.
        // אם יש בה 1-3 מילים — זה runt. הענק penalty כדי שהמערכת תעדיף חיתוך ללא runt.
        let runtPenalty = 0;
        if (sp.lineIndex > 0 && sp.lines[sp.lineIndex - 1]) {
            const lastLineAtSplit = sp.lines[sp.lineIndex - 1];
            const wordsAtSplit = lastLineAtSplit.split(/\s+/).filter(w => w.length > 0).length;
            if (wordsAtSplit === 1) runtPenalty = 1000;
            else if (wordsAtSplit === 2) runtPenalty = 500;
            else if (wordsAtSplit === 3) runtPenalty = 200;
        }

        // === Look-ahead: Widow/Orphan penalty (חדש — פעולה 2) ===
        // בדוק כמה שורות יהיו בהמשך (טור שמאל) אחרי החיתוך.
        // אם ההמשך הוא שורה אחת בודדת — זו אלמנה! הענק קנס כבד.
        // אם החלק שנשאר בימין הוא שורה אחת — זה יתום! הענק קנס כבד.
        let widowPenalty = 0;
        if (sp.lineIndex > 0 && sp.lines) {
            const linesInRight = sp.lineIndex;
            const linesInLeft = sp.lines.length - sp.lineIndex;
            // יתום: שורה אחת בימין (תחילת פסקה שעוברת לשמאל)
            if (linesInRight === 1) widowPenalty += 10000;
            // אלמנה: שורה אחת בשמאל (שארית פסקה מימין)
            if (linesInLeft === 1) widowPenalty += 10000;
            // כמעט-אלמנה: 2 שורות בשמאל
            if (linesInLeft === 2) widowPenalty += 3000;
        }

        let score = balanceQualityScore + heightPenalty + runtPenalty + widowPenalty;

        if (score < minScore) {
            minScore = score;
            bestSplit = sp;
            bestDiff = diff;
        } else if (score === minScore && diff >= 0) {
            bestSplit = sp;
            bestDiff = diff;
        }
    }

    rCol.innerHTML = '';
    lCol.innerHTML = '';
    const rMargin = block.querySelector('.right-margin');
    const lMargin = block.querySelector('.left-margin');
    if (rMargin) rMargin.innerHTML = '';
    if (lMargin) lMargin.innerHTML = '';
    const finalNotes = [];

    function appendItemFinal(col, margin, item, isRight, isPartial, partialText, isCont, isCut) {
        if (item.type === 'h') {
            col.insertAdjacentHTML('beforeend', item.html);
        } else {
            const p = document.createElement('p');
            const isTruncated = isCut || (isPartial && isRight);
            p.className = isTruncated ? 'p-cut' : 'p-end';
            p.setAttribute('data-token-id', item.id);

            let textToRender = isPartial ? partialText : item.rawText;
            p.setAttribute('data-raw-text', textToRender);
            p.setAttribute('data-is-cont', isCont ? 'true' : 'false');
            if (item.sideNote) p.setAttribute('data-side-note', item.sideNote);
            if (item.endNote) p.setAttribute('data-end-note', item.endNote);
            if (item.sideNoteStyleId) p.setAttribute('data-note-style-id', item.sideNoteStyleId);

            let isSingleLine = false;
            let currentLineCount = item.numLines || 2;
            if (!isPartial) {
                isSingleLine = item.isSingleLine;
            } else {
                let linesInfo = getLinesFromParagraph(textToRender, colWidth, styleObj, !isCont);
                isSingleLine = linesInfo.lines.length <= 1;
                currentLineCount = linesInfo.lines.length;
            }

            p.innerHTML = createDropWord(textToRender, isCont, isSingleLine, currentLineCount);
            applyDelimiterStyles(p, 'body', getBodySizePt(), false);

            if (item.endNote && !isCont) {
                const marker = createNoteMarkerAndQueue(item.endNote, null, 'endnote');
                p.appendChild(marker);
            }

            col.appendChild(p);

            if (item.sideNote && !isCont && margin) {
                const noteElem = document.createElement('div');
                noteElem.className = 'side-note-anchor';
                noteElem.textContent = item.sideNote;
                if (item.sideNoteStyleId) {
                    const inst = findExtTextStyle(item.sideNoteStyleId);
                    if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
                }
                margin.appendChild(noteElem);
                finalNotes.push({ elem: noteElem, pElem: p });
            }
        }
    }

    // ==================================================================
    // תיקון חיתוך תוך-שורה (Intra-line split refinement)
    // ==================================================================
    // אחרי בחירת bestSplit, נבדוק אם השורה האחרונה בימין דלילה (≤3 מילים).
    // אם כן, ננסה להעביר מילה אחת מסוף השורה הקודמת לתחילת השורה האחרונה,
    // כדי למלא את השורה האחרונה ולמנוע דלילות ב-p-cut.
    // קריטריונים:
    //   1. bestSplit.lineIndex > 0 (יש חיתוך תוך-פסקתי)
    //   2. השורה האחרונה בימין (lines[lineIndex-1]) מכילה ≤3 מילים
    //   3. השורה הקודמת (lines[lineIndex-2]) מכילה ≥5 מילים
    //   4. העברת מילה אחת תשפר את המצב (לא תיצור דלילות חדשה)
    // ==================================================================
    if (bestSplit.lineIndex > 1 && bestSplit.lines && bestSplit.lineIndex < bestSplit.lines.length) {
        const lastLineIdx = bestSplit.lineIndex - 1;
        const prevLineIdx = bestSplit.lineIndex - 2;
        const lastLine = bestSplit.lines[lastLineIdx];
        const prevLine = bestSplit.lines[prevLineIdx];
        const lastWords = lastLine.trim().split(/\s+/).filter(w => w.length > 0);
        const prevWords = prevLine.trim().split(/\s+/).filter(w => w.length > 0);

        // בדיקת קריטריונים: שורה אחרונה דלילה + שורה קודמת מספיק מלאה
        if (lastWords.length >= 1 && lastWords.length <= 3 && prevWords.length >= 5) {
            // נסה להעביר מילה אחת מסוף prevLine לתחילת lastLine
            const wordToMove = prevWords[prevWords.length - 1];
            const newPrevLine = prevWords.slice(0, -1).join(' ');
            const newLastLine = wordToMove + ' ' + lastLine;

            // בדיקה: האם השורה הקודמת החדשה עדיין מכילה מספיק מילים (≥3)?
            const newPrevWords = newPrevLine.trim().split(/\s+/).filter(w => w.length > 0);
            if (newPrevWords.length >= 3) {
                // בצע את השינוי — עדכן את השורות
                const newLines = bestSplit.lines.slice();
                newLines[prevLineIdx] = newPrevLine;
                newLines[lastLineIdx] = newLastLine;
                bestSplit = { ...bestSplit, lines: newLines };
                if (traceObj) {
                    traceObj.steps = traceObj.steps || [];
                    traceObj.steps.push(`בוצע חיתוך תוך-שורה: הועברה מילה "${wordToMove}" משורה ${prevLineIdx} לשורה ${lastLineIdx} למניעת דלילות`);
                }
            }
        }
    }

    // ==================================================================
    // תיקון נוסף: משוך מילים מההמשך (טור שמאל) לשורה האחרונה בימין
    // ==================================================================
    // אם השורה האחרונה בימין עדיין דלילה אחרי החיתוך התוך-שורה,
    // נסה למשוך מילים מהשורה הראשונה בשמאל (ההמשך) לשורה האחרונה בימין.
    // זה מונע את המראה של "סיבת המצווה." כשורה אחרונה עם 2 מילים
    // ורווחים עצומים מ-text-align-last: justify.
    // ==================================================================
    if (bestSplit.lineIndex > 0 && bestSplit.lines && bestSplit.lineIndex < bestSplit.lines.length) {
        const lastLineIdx = bestSplit.lineIndex - 1;
        const nextLineIdx = bestSplit.lineIndex;
        const lastLine = bestSplit.lines[lastLineIdx];
        const nextLine = bestSplit.lines[nextLineIdx];
        const lastWords = lastLine.trim().split(/\s+/).filter(w => w.length > 0);
        const nextWords = nextLine.trim().split(/\s+/).filter(w => w.length > 0);

        // רק אם השורה האחרונה דלילה (פחות מ-4 מילים) ויש מילים בהמשך
        if (lastWords.length < 4 && nextWords.length > 0) {
            // נסה למשוך מילים מהשורה הבאה לשורה האחרונה
            let newLastWords = lastWords.slice();
            let newNextWords = nextWords.slice();
            let pulled = 0;
            const maxPull = Math.min(5, newNextWords.length);

            while (newNextWords.length > 0 && pulled < maxPull) {
                const candidate = newLastWords.concat([newNextWords[0]]);
                const candidateLine = candidate.join(' ');
                const candidateWidth = measureLineWidthCanvas(candidateLine, styleObj);

                // בדוק אם המילה הנוספת עדיין נכנסת ברוחב הטור
                if (candidateWidth <= colWidth) {
                    newLastWords = candidate;
                    newNextWords = newNextWords.slice(1);
                    pulled++;
                } else {
                    break;
                }
            }

            if (pulled > 0) {
                const newLastLine = newLastWords.join(' ');
                const newNextLine = newNextWords.join(' ');
                const newLines = bestSplit.lines.slice();
                newLines[lastLineIdx] = newLastLine;
                if (newNextLine.length > 0) {
                    newLines[nextLineIdx] = newNextLine;
                } else {
                    // כל השורה הבאה עברה — הסר אותה
                    newLines.splice(nextLineIdx, 1);
                    bestSplit = { ...bestSplit, lineIndex: bestSplit.lineIndex };
                }
                bestSplit = { ...bestSplit, lines: newLines };
                if (traceObj) {
                    traceObj.steps = traceObj.steps || [];
                    traceObj.steps.push(`בוצע משיכת מילים: ${pulled} מילים מהמשך לשורה האחרונה למניעת דלילות`);
                }
            }
        }
    }

    for (let i = 0; i < bestSplit.itemIndex; i++) {
        appendItemFinal(rCol, rMargin, items[i], true, false, null, items[i].isCont, false);
    }
    if (bestSplit.lineIndex > 0) {
        let item = items[bestSplit.itemIndex];
        let rightText = bestSplit.lines.slice(0, bestSplit.lineIndex).join(' ');
        appendItemFinal(rCol, rMargin, item, true, true, rightText, item.isCont, true);
        let leftText = bestSplit.lines.slice(bestSplit.lineIndex).join(' ');
        appendItemFinal(lCol, lMargin, item, false, true, leftText, true, false);
    }
    for (let i = bestSplit.lineIndex > 0 ? bestSplit.itemIndex + 1 : bestSplit.itemIndex; i < items.length; i++) {
        appendItemFinal(lCol, lMargin, items[i], false, false, null, items[i].isCont, false);
    }

    resetColumnJustificationStyles(rCol);
    resetColumnJustificationStyles(lCol);
    let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
    const justifyCeiling = (availableHeight && availableHeight < Infinity) ? availableHeight : Infinity;
    if (Math.abs(finalDiff) > 2 && Math.abs(finalDiff) <= 140) {
        justifyColumnsPair(rCol, lCol, styleObj, justifyCeiling, colWidth, traceObj);
    }
    enforceBlockColumnsWithinCeiling(block, justifyCeiling);

    finalizeNotePositions(finalNotes, Math.min(Math.max(rCol.scrollHeight, lCol.scrollHeight), justifyCeiling));

    if (traceObj) {
        traceObj.balanceLog = {
            totalItems: items.length,
            bestSplit,
            rHeightBefore: rCol.scrollHeight,
            lHeightBefore: lCol.scrollHeight,
            diff: finalDiff,
            availableHeight
        };
    }
}

function finalizeNotePositions(notesList, columnBoundaryHeight) {
    // תיקון 2: כותרת 7 (צד) — הנמכה מעט מתחילת הפסקה שלה.
    // מיקום ברירת מחדל: תחילת הפסקה + 4px (כדי שהכותרת תהיה נמוכה מעט מהפסקה).
    const SIDE_NOTE_OFFSET_TOP = 4;
    const byMargin = new Map();
    notesList.forEach(item => {
        if (!item.elem || !item.pElem) return;
        const marg = item.elem.parentElement;
        if (!marg) return;
        if (!byMargin.has(marg)) byMargin.set(marg, []);
        byMargin.get(marg).push(item);
    });
    byMargin.forEach(group => {
        group.sort((a, b) => a.pElem.offsetTop - b.pElem.offsetTop);
        group.forEach((item, idx) => {
            const noteHeight = item.elem.getBoundingClientRect().height || item.elem.offsetHeight || 0;
            let top = item.pElem.offsetTop + SIDE_NOTE_OFFSET_TOP;
            if (top + noteHeight > columnBoundaryHeight) {
                const prev = idx > 0 ? group[idx - 1] : null;
                const prevBottom = prev ? (parseFloat(prev.elem.style.top || 0) + (prev.elem.getBoundingClientRect().height || 0)) : 0;
                const minTop = prev ? prevBottom + 6 : 0;
                const raisedTop = columnBoundaryHeight - noteHeight;
                if (raisedTop >= minTop) {
                    top = raisedTop;
                } else {
                    const tokenId = item.pElem.getAttribute('data-token-id');
                    const contElem = tokenId ? document.querySelector('p[data-token-id="' + tokenId + '"][data-is-cont="true"]') : null;
                    if (contElem && contElem !== item.pElem) {
                        const page = contElem.closest('.a4-page');
                        const isRightCol = !!contElem.closest('.right-col');
                        const destMargin = page ? page.querySelector(isRightCol ? '.right-margin' : '.left-margin') : null;
                        if (destMargin) {
                            const next = idx < group.length - 1 ? group[idx + 1] : null;
                            const maxTop = next ? (parseFloat(next.elem.style.top || Infinity) - noteHeight - 6) : Infinity;
                            const contTop = contElem.offsetTop;
                            if (contTop <= maxTop) {
                                destMargin.appendChild(item.elem);
                                top = contTop;
                            }
                        }
                    }
                }
            }
            item.elem.style.top = top + 'px';
        });
    });
}

/* ==========================================================================
   8. תוחמים (Delimiters), הערות שוליים וסיום
   ========================================================================== */
function findDelimiterMatches(text, hostContextKey) {
    const activeStyles = [];
    const fnOpen = document.getElementById('fn-delim-open')?.value?.trim();
    const fnClose = document.getElementById('fn-delim-close')?.value?.trim();
    if (fnOpen && fnClose) {
        activeStyles.push({
            def: {
                trigger: { type: 'delimiterPair', open: fnOpen, close: fnClose },
                target: 'footnote'
            },
            instanceId: 'builtin-footnote'
        });
    }

    if (typeof importedTextStyles !== 'undefined') {
        importedTextStyles.forEach(inst => {
            const trig = inst.def && inst.def.trigger;
            if (!trig || trig.type !== 'delimiterPair' || !trig.open || !trig.close) return;
            const scope = trig.appliesWithin;
            if (scope && scope.textStyles && scope.textStyles.length && scope.textStyles.indexOf(hostContextKey) === -1) return;
            activeStyles.push(inst);
        });
    }

    if (!activeStyles.length) return [];

    let matches = [];
    activeStyles.forEach(inst => {
        const trig = inst.def.trigger;
        let searchFrom = 0;
        while (true) {
            const oIdx = text.indexOf(trig.open, searchFrom);
            if (oIdx === -1) break;
            const cIdx = text.indexOf(trig.close, oIdx + trig.open.length);
            if (cIdx === -1) break;
            matches.push({ start: oIdx, end: cIdx + trig.close.length, inst });
            searchFrom = cIdx + trig.close.length;
        }
    });
    matches.sort((a, b) => a.start - b.start);
    const dedup = [];
    let lastEnd = -1;
    matches.forEach(m => {
        if (m.start >= lastEnd) {
            dedup.push(m);
            lastEnd = m.end;
        }
    });
    return dedup;
}

function applyDelimiterStyles(containerEl, hostContextKey, hostSizePt, isDryRun = false) {
    const effHostSize = hostSizePt || 12;
    const walker = document.createTreeWalker(containerEl, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let n;
    while (n = walker.nextNode()) textNodes.push(n);

    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const dedup = findDelimiterMatches(text, hostContextKey);
        if (!dedup.length) return;

        const frag = document.createDocumentFragment();
        let cursor = 0;
        dedup.forEach(m => {
            if (m.start > cursor) {
                let textBefore = text.slice(cursor, m.start);
                if (m.inst.def.target === 'footnote' || m.inst.def.target === 'endnote') {
                    textBefore = textBefore.replace(/\s+$/, '');
                }
                frag.appendChild(document.createTextNode(textBefore));
            }
            if (m.inst.def.target === 'footnote' || m.inst.def.target === 'endnote') {
                const openLen = m.inst.def.trigger.open.length;
                const closeLen = m.inst.def.trigger.close.length;
                const innerText = text.slice(m.start + openLen, m.end - closeLen);

                if (isDryRun) {
                    const dummyMarker = document.createElement('a');
                    dummyMarker.className = 'note-marker';
                    dummyMarker.textContent = 'א';
                    applyNoteMarkerStyle(dummyMarker, false);
                    frag.appendChild(dummyMarker);
                } else {
                    const marker = createNoteMarkerAndQueue(innerText, m.inst.instanceId, m.inst.def.target);
                    frag.appendChild(marker);
                }
            } else {
                const span = document.createElement('span');
                span.textContent = text.slice(m.start, m.end);
                applyExtStyleToNode(span, m.inst.def.style, effHostSize);
                frag.appendChild(span);
            }
            cursor = m.end;
        });
        if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
        textNode.parentNode.replaceChild(frag, textNode);
    });
}

function getHostSizePt(level, customStyleId) {
    if (customStyleId && typeof findExtTextStyle === 'function') {
        const inst = findExtTextStyle(customStyleId);
        if (inst && inst.def.style && typeof inst.def.style.size === 'number') return inst.def.style.size;
        return 12;
    }
    const el = document.getElementById('s-h' + level);
    return el ? parseFloat(el.value) : 12;
}

function getBodySizePt() {
    const el = document.getElementById('size-body');
    return el ? parseFloat(el.value) : 12;
}

function getNoteConfig(styleId) {
    const inst = (typeof findExtTextStyle === 'function') ? findExtTextStyle(styleId) : null;
    return (inst && inst.def.noteConfig) || {};
}

function formatNoteMarker(n, styleId) {
    const cfg = getNoteConfig(styleId);
    const globalNumStyle = document.getElementById('note-numbering-style')?.value || 'gematria';
    const numStyle = cfg.numberingStyle || globalNumStyle;

    if (numStyle === 'decimal') return String(n);
    if (numStyle === 'gematria_geresh') return toGematriaWithGeresh(n);
    if (numStyle === 'asterisks') return '*'.repeat(Math.min(n, 10));
    if (numStyle === 'parens') return `(${toGematria(n)})`;
    return toGematria(n) || String(n);
}

function resetNoteCounterIfNeeded(target, trigger) {
    const globalResetMode = document.getElementById('fn-reset-mode')?.value || 'page';
    let shouldReset = false;

    if (globalResetMode === 'continuous') {
        shouldReset = false;
    } else if (globalResetMode === trigger) {
        shouldReset = true;
    }

    if (target === 'endnote' && trigger === 'part') shouldReset = true;

    if (typeof importedTextStyles !== 'undefined') {
        importedTextStyles.forEach(inst => {
            if (inst.def && inst.def.target === target) {
                const resetAt = (inst.def.noteConfig && inst.def.noteConfig.resetAt);
                if (resetAt === trigger) shouldReset = true;
            }
        });
    }

    if (shouldReset) {
        noteCounters[target] = 0;
    }
}

function applyNoteMarkerStyle(el, isBacklink) {
    const typeEl = document.getElementById('note-marker-type');
    const sizeEl = isBacklink ? document.getElementById('note-listing-num-size') : document.getElementById('note-marker-size');
    const type = (!isBacklink && typeEl) ? typeEl.value : 'normal';
    const size = sizeEl ? parseFloat(sizeEl.value) : 8;
    el.style.fontSize = size + 'pt';
    el.style.fontWeight = '700';
    el.style.textDecoration = 'none';
    el.style.color = 'inherit';
    el.style.cursor = 'pointer';
    if (type === 'super') {
        el.style.verticalAlign = 'super';
        el.style.lineHeight = '0';
    } else if (type === 'sub') {
        el.style.verticalAlign = 'sub';
        el.style.lineHeight = '0';
    } else {
        el.style.verticalAlign = 'baseline';
    }
    if (!isBacklink && type === 'brackets') {
        el.textContent = '[' + el.textContent + ']';
    }
}

function createNoteMarkerAndQueue(text, styleId, target) {
    noteCounters[target] = (noteCounters[target] || 0) + 1;
    const num = noteCounters[target];
    const markerText = formatNoteMarker(num, styleId);
    const uid = 'n' + (noteUidCounter++);
    const marker = document.createElement('a');
    marker.className = 'note-marker';
    marker.href = '#note-' + uid;
    marker.id = 'noteref-' + uid;
    marker.textContent = markerText;
    applyNoteMarkerStyle(marker, false);
    const item = {
        number: markerText,
        text: text,
        styleId: styleId,
        uid: uid
    };
    if (target === 'footnote') footnoteQueueForPage.push(item);
    else endnoteQueueForPart.push(item);
    return marker;
}

function buildNoteBlockElement(queue, columns) {
    const wrap = document.createElement('div');
    const cols = columns || parseInt(document.getElementById('fn-columns')?.value, 10) || 1;
    wrap.className = `note-block cols-${cols}`;

    const sepEl = document.getElementById('note-num-separator');
    const globalSep = sepEl ? sepEl.value : '.';

    queue.forEach(item => {
        const line = document.createElement('div');
        line.className = 'note-line';
        line.id = 'note-' + item.uid;
        const num = document.createElement('a');
        num.className = 'note-line-num';
        num.href = '#noteref-' + item.uid;
        num.textContent = item.number + globalSep + ' ';
        applyNoteMarkerStyle(num, true);
        const body = document.createElement('span');
        body.className = 'note-body-text';
        // תיקון: נקה את תו U+E000 (נעילת רווחים בתוך הערות) לפני הצגה.
        // אחרת, התו מופיע כריבוע/תו לא מזוהה במקום רווח.
        body.textContent = (item.text || '').replace(/\uE000/g, ' ');
        const inst = (typeof findExtTextStyle === 'function') ? findExtTextStyle(item.styleId) : null;
        if (inst && inst.def.style) applyExtStyleToNode(body, inst.def.style, 10);
        line.appendChild(num);
        line.appendChild(body);
        wrap.appendChild(line);
    });
    return wrap;
}

function flushFootnotesInto(pageEl) {
    if (!footnoteQueueForPage.length) {
        resetNoteCounterIfNeeded('footnote', 'page');
        return;
    }

    const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
    const colCount = parseInt(document.getElementById('fn-columns')?.value, 10) || cfg0.columns || 1;
    const rule = buildNoteRuleElement();
    const block = buildNoteBlockElement(footnoteQueueForPage, colCount);
    const area = document.createElement('div');
    area.className = 'footnote-area';

    const titleText = document.getElementById('fn-title-text')?.value?.trim();
    if (titleText) {
        const titleWrap = document.createElement('div');
        titleWrap.className = 'footnote-header-wrap';

        const ornR = document.getElementById('note-header-orn-r')?.value;
        const ornL = document.getElementById('note-header-orn-l')?.value;

        if (ornR && ornR !== 'none' && typeof renderSideOrnamentHTML === 'function') {
            const rElem = document.createElement('span');
            rElem.className = 'note-header-ornament-right';
            rElem.innerHTML = renderSideOrnamentHTML(ornR, false, 'note');
            titleWrap.appendChild(rElem);
        }

        const tSpan = document.createElement('span');
        tSpan.className = 'footnote-header-title';
        tSpan.textContent = titleText;
        titleWrap.appendChild(tSpan);

        if (ornL && ornL !== 'none' && typeof renderSideOrnamentHTML === 'function') {
            const lElem = document.createElement('span');
            lElem.className = 'note-header-ornament-left';
            lElem.innerHTML = renderSideOrnamentHTML(ornL, true, 'note');
            titleWrap.appendChild(lElem);
        }

        area.appendChild(titleWrap);
    }

    if (rule && rule.style.display !== 'none') {
        area.appendChild(rule);
    }
    area.appendChild(block);

    const wrapper = pageEl.querySelector('.page-content-wrapper');
    const footer = pageEl.querySelector('.page-number-footer');
    if (wrapper && footer) {
        wrapper.insertBefore(area, footer);
    } else {
        pageEl.appendChild(area);
    }

    footnoteQueueForPage = [];
    resetNoteCounterIfNeeded('footnote', 'page');
}

function flushEndnotesForPart(container, pIdx) {
    if (!endnoteQueueForPart.length) {
        resetNoteCounterIfNeeded('endnote', 'part');
        return 0;
    }
    const cfg0 = getNoteConfig(endnoteQueueForPart[0].styleId);
    const columns = cfg0.columns || 1;
    let pagesUsed = 0;
    let remaining = endnoteQueueForPart.slice();
    while (remaining.length) {
        const page = document.createElement('div');
        page.className = 'a4-page';
        applyContentBg(page, 'regular');
        const title = document.createElement('div');
        title.className = 'title-level-2-standalone';
        title.textContent = pagesUsed === 0 ? 'הערות' : 'הערות (המשך)';
        page.appendChild(title);
        const wrap = document.createElement('div');
        wrap.className = 'note-block endnote-page-block';
        if (columns === 2) wrap.style.columnCount = '2';
        page.appendChild(wrap);
        container.appendChild(page);
        let fit = 0;
        for (let i = 0; i < remaining.length; i++) {
            const testBlock = buildNoteBlockElement(remaining.slice(0, i + 1), columns);
            wrap.innerHTML = '';
            wrap.appendChild(testBlock);
            if (wrap.scrollHeight > page.clientHeight - 60 && i > 0) break;
            fit = i + 1;
        }
        remaining = remaining.slice(fit);
        pagesUsed++;
        if (pagesUsed > 200) break;
    }
    endnoteQueueForPart = [];
    resetNoteCounterIfNeeded('endnote', 'part');
    return pagesUsed;
}

function measureNoteBlockHeight(queue, columns) {
    if (!queue.length) return 0;
    const probe = buildNoteBlockElement(queue, columns);
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    const wMargin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--w-margin')) || 7.5;
    const wGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--w-gap')) || 2;
    const pct = 100 - 2 * (wMargin + wGap);
    probe.style.width = `calc(180mm * ${pct / 100})`;
    document.body.appendChild(probe);
    const h = probe.offsetHeight;
    document.body.removeChild(probe);
    return h;
}

function getFootnotesReservedHeight() {
    if (!footnoteQueueForPage.length) return 0;
    const cfg0 = getNoteConfig(footnoteQueueForPage[0].styleId);
    const colCount = parseInt(document.getElementById('fn-columns')?.value, 10) || cfg0.columns || 1;
    return measureFootnoteAreaReserve(footnoteQueueForPage, colCount);
}

function measureFootnoteAreaReserve(queue, colCount) {
    if (!queue || !queue.length) return 0;
    const titleText = document.getElementById('fn-title-text')?.value?.trim();
    const headerH = titleText ? 24 : 0;
    return measureNoteBlockHeight(queue, colCount) + 24 + headerH;
}

function appendMainSubParts(hostElem, mainText, subText, def) {
    const mainPart = document.createElement('div');
    mainPart.textContent = mainText.trim();
    applyExtStyleToNode(mainPart, def.style, 14);
    hostElem.appendChild(mainPart);
    if (subText && subText.trim()) {
        const subPart = document.createElement('div');
        subPart.textContent = subText.trim();
        subPart.style.fontSize = '0.68em';
        subPart.style.opacity = '0.78';
        subPart.style.marginTop = '3px';
        hostElem.appendChild(subPart);
    }
}

function renderCustomHeadingInto(hostElem, inst, text) {
    const def = inst.def;
    hostElem.innerHTML = '';

    if (def.parseMode === 'splitFirstDash' && /[-–—]/.test(text)) {
        appendMainSubParts(hostElem, text.split(/[-–—]/)[0], text.split(/[-–—]/).slice(1).join(' - '), def);
        return;
    }
    if (def.parseMode === 'splitCustomDelimiter' && def.parseDelimiter && text.indexOf(def.parseDelimiter) > -1) {
        const idx = text.indexOf(def.parseDelimiter);
        appendMainSubParts(hostElem, text.slice(0, idx), text.slice(idx + def.parseDelimiter.length), def);
        return;
    }
    if (def.parseMode === 'regexGroups' && def.parseRegex) {
        let match = null;
        try { match = text.match(new RegExp(def.parseRegex)); } catch (e) {}
        if (match && match.groups && Object.keys(match.groups).length) {
            const vals = Object.values(match.groups).filter(v => v !== undefined);
            if (vals.length) {
                appendMainSubParts(hostElem, vals[0], vals.slice(1).join(' '), def);
                return;
            }
        }
    }
    hostElem.textContent = text;
    applyExtStyleToNode(hostElem, def.style, 12);
}

/* ==========================================================================
   9. מבנה מעטפת עמוד, כותרות עליונות, עיטורים וכפתור דיבאג צף
   ========================================================================== */
function resolveHeaderAlign(align, slot) {
    if (align === 'outer') return slot === 'r' ? 'right' : 'left';
    if (align === 'inner') return slot === 'r' ? 'left' : 'right';
    return align;
}

function fitOneHeadingOrnament(ornWrap, isTop) {
    const fitInner = ornWrap.querySelector('.heading-ornament-wrap.fit-heading-text');
    if (!fitInner) return;
    const targetEl = isTop ? ornWrap.nextElementSibling : ornWrap.previousElementSibling;
    if (!targetEl) return;
    const textWidth = targetEl.getBoundingClientRect().width;
    if (textWidth > 0) {
        fitInner.style.width = textWidth + 'px';
        fitInner.style.maxWidth = '90%';
    }
}

function fitSideOrnamentsToText(wrap) {
    const textEl = wrap.querySelector('.title-level-2-standalone, .h3-title-text');
    if (!textEl) return;
    const textHeight = textEl.getBoundingClientRect().height;
    if (textHeight <= 0) return;
    wrap.querySelectorAll('.h2-title-ornament-right, .h2-title-ornament-left, .h3-ornament-right, .h3-ornament-left').forEach(ornEl => {
        ornEl.style.maxHeight = textHeight + 'px';
        const innerImg = ornEl.querySelector('svg, img');
        if (innerImg) {
            innerImg.style.maxHeight = textHeight + 'px';
            innerImg.style.height = 'auto';
        }
    });
}

function createPageLayout(container, h2Text, h2TokenId, pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL, pageRole, pageContext = {}) {
    const page = document.createElement('div');
    page.className = 'a4-page';
    page.setAttribute('data-page-index', String(pNum));
    applyContentBg(page, pageRole || 'regular');

    const isEven = (pNum % 2 === 0);
    const isDistinct = document.getElementById('hdr-distinct-even-odd')?.checked;

    let oddR = document.getElementById('hdr-r-type')?.value || 'h1';
    let oddC = document.getElementById('hdr-c-type')?.value || 'spear';
    let oddL = document.getElementById('hdr-l-type')?.value || 'h2';
    let oddRAlign = document.getElementById('hdr-r-align')?.value || 'right';
    let oddCAlign = document.getElementById('hdr-c-align')?.value || 'center';
    let oddLAlign = document.getElementById('hdr-l-align')?.value || 'left';
    let oddRFont = document.getElementById('f-hdr-r')?.value || "'ליבורנה מודגש','פרנק רוהל ליברה מודגש',serif";
    let oddRSize = (document.getElementById('s-hdr-r')?.value || 15) + 'pt';
    let oddLFont = document.getElementById('f-hdr-l')?.value || "'ליבורנה מודגש','פרנק רוהל ליברה מודגש',serif";
    let oddLSize = (document.getElementById('s-hdr-l')?.value || 15) + 'pt';

    let evenR = document.getElementById('hdr-verso-r-type')?.value || 'same_as_odd';
    let evenC = document.getElementById('hdr-verso-c-type')?.value || 'same_as_odd';
    let evenL = document.getElementById('hdr-verso-l-type')?.value || 'same_as_odd';
    let evenRAlign = document.getElementById('hdr-verso-r-align')?.value || 'right';
    let evenCAlign = document.getElementById('hdr-verso-c-align')?.value || 'center';
    let evenLAlign = document.getElementById('hdr-verso-l-align')?.value || 'left';
    let evenRFont = document.getElementById('f-hdr-verso-r')?.value || oddRFont;
    let evenRSize = (document.getElementById('s-hdr-verso-r')?.value || 15) + 'pt';
    let evenLFont = document.getElementById('f-hdr-verso-l')?.value || oddLFont;
    let evenLSize = (document.getElementById('s-hdr-verso-l')?.value || 15) + 'pt';

    let hdrRType, hdrCType, hdrLType, hdrRAlign, hdrCAlign, hdrLAlign, hdrRFont, hdrRSize, hdrLFont, hdrLSize;
    let cR = customR, cL = customL, cC = customC;

    if (isDistinct && isEven) {
        hdrRType = (evenR === 'same_as_odd') ? oddR : evenR;
        hdrCType = (evenC === 'same_as_odd') ? oddC : evenC;
        hdrLType = (evenL === 'same_as_odd') ? oddL : evenL;
        hdrRAlign = evenRAlign; hdrCAlign = evenCAlign; hdrLAlign = evenLAlign;
        hdrRFont = evenRFont; hdrRSize = evenRSize; hdrLFont = evenLFont; hdrLSize = evenLSize;
        const vCustR = document.getElementById('hdr-verso-r-custom')?.value;
        const vCustL = document.getElementById('hdr-verso-l-custom')?.value;
        if (vCustR) cR = vCustR;
        if (vCustL) cL = vCustL;
    } else {
        hdrRType = (oddR === 'same_as_even' && evenR !== 'same_as_odd') ? evenR : oddR;
        hdrCType = (oddC === 'same_as_even' && evenC !== 'same_as_odd') ? evenC : oddC;
        hdrLType = (oddL === 'same_as_even' && evenL !== 'same_as_odd') ? evenL : oddL;
        hdrRAlign = oddRAlign; hdrCAlign = oddCAlign; hdrLAlign = oddLAlign;
        hdrRFont = oddRFont; hdrRSize = oddRSize; hdrLFont = oddLFont; hdrLSize = oddLSize;
    }

    hdrRAlign = resolveHeaderAlign(hdrRAlign, 'r');
    hdrCAlign = resolveHeaderAlign(hdrCAlign, 'c');
    hdrLAlign = resolveHeaderAlign(hdrLAlign, 'l');

    if (document.getElementById('hdr-title-split')?.checked && bookTitle) {
        const words = bookTitle.trim().split(/\s+/);
        const mid = Math.ceil(words.length / 2);
        hdrRType = 'custom';
        cR = words.slice(0, mid).join(' ');
        hdrLType = 'custom';
        cL = words.slice(mid).join(' ');
    }

    const contextExtra = {
        ...pageContext,
        pageNum: toGematria(pNum)
    };

    const hdrRHTML = renderHeaderSectionHTML(hdrRType, cR, h1Title, h2Title, h3Title, bookTitle, '', contextExtra);
    const hdrCHTML = renderHeaderSectionHTML(hdrCType, cC, h1Title, h2Title, h3Title, bookTitle, '', contextExtra);
    const hdrLHTML = renderHeaderSectionHTML(hdrLType, cL, h1Title, h2Title, h3Title, bookTitle, '', contextExtra);

    const { displayPageNum, framedPageNum, pageNumPos } = formatPageNumberDisplay(pNum);
    const footerClass = (pageNumPos === 'bottom_outer') ? 'pos-outer' : 'pos-center';
    const showFooter = (pageNumPos === 'bottom_center' || pageNumPos === 'bottom_outer') && displayPageNum;

    page.innerHTML = `
    <button type="button" class="page-debug-btn" data-debug-page="${pNum}" title="הורד דוח דיבאג מקיף לעמוד זה">🐛 דיבאג עמוד ${escapeHTML(toGematria(pNum) || String(pNum))}</button>
    <div class="page-content-wrapper">
      <div class="top-header-grid">
        <div class="header-col-r" style="text-align:${escapeHTML(hdrRAlign)}; justify-content:${escapeHTML(hdrRAlign)}; font-family:${escapeHTML(hdrRFont)}; font-size:${escapeHTML(hdrRSize)};">${hdrRHTML}</div>
        <div class="header-col-c" style="text-align:${escapeHTML(hdrCAlign)}; justify-content:${escapeHTML(hdrCAlign)};">${hdrCHTML}</div>
        <div class="header-col-l" style="text-align:${escapeHTML(hdrLAlign)}; justify-content:${escapeHTML(hdrLAlign)}; font-family:${escapeHTML(hdrLFont)}; font-size:${escapeHTML(hdrLSize)};">${hdrLHTML}</div>
      </div>
      <div class="page-body-flow ${h2Text ? 'h2-flow-page' : ''}">
        ${h2Text ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" ${h2TokenId !== undefined ? `data-token-id="${escapeHTML(String(h2TokenId))}" id="heading-tok-${escapeHTML(String(h2TokenId))}"` : ''}>${h2Text}</div>` : ''}
      </div>
      <div class="page-number-footer ${footerClass}">${showFooter ? escapeHTML(String(framedPageNum)) : ''}</div>
    </div>
  `;

    container.appendChild(page);
    const bodyFlow = page.querySelector('.page-body-flow');
    return { page, bodyFlow };
}

function parseMetadataFromText(rawText) {
    const lines = rawText.split('\n');
    const cleanLines = [];

    for (let line of lines) {
        const trimmed = line.trim();
        let match = false;

        if (/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
            const el = document.getElementById('inp-book-title');
            if (el) el.value = trimmed.replace(/^(?:שם הספר[:\s]*)?שם הספר\s*[-–—:]\s*/i, '').trim();
            match = true;
        } else if (/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
            const el = document.getElementById('inp-book-subtitle');
            if (el) el.value = trimmed.replace(/^(?:נושא(?:\\|\/)כותרת משנה[:\s]*)?נושא\s*[-–—:]\s*/i, '').trim();
            match = true;
        } else if (/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
            const el = document.getElementById('inp-book-desc');
            if (el) el.value = trimmed.replace(/^(?:נושא מפורט\s*(?:\\|\/)\s*תיאור[:\s]*)?נושא מפורט\s*[-–—:]\s*/i, '').trim();
            match = true;
        } else if (/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
            const el = document.getElementById('inp-book-sections');
            if (el) el.value = trimmed.replace(/^(?:פרטי מהדורא\s*(?:\\|\/)\s*חלקים[:\s]*)?פרטי מהדורא\s*[-–—:]\s*/i, '').trim();
            match = true;
        } else if (/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
            const el = document.getElementById('inp-book-author');
            if (el) el.value = trimmed.replace(/^(?:שם המחבר[:\s]*)?שם המחבר\s*[-–—:]\s*/i, '').trim();
            match = true;
        } else if (/^(?:שמירת זכויות[:\s]*)?שמירת זכויות\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
            const el = document.getElementById('inp-book-back-copyright');
            if (el) el.value = trimmed.replace(/^(?:שמירת זכויות[:\s]*)?שמירת זכויות\s*[-–—:]\s*/i, '').trim();
            match = true;
        } else if (/^(?:פרטי הוצאה לאור[:\s]*)?פרטי הוצאה לאור\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
            const el = document.getElementById('inp-book-back-publishing');
            if (el) el.value = trimmed.replace(/^(?:פרטי הוצאה לאור[:\s]*)?פרטי הוצאה לאור\s*[-–—:]\s*/i, '').trim();
            match = true;
        } else if (/^(?:פרטי קשר[:\s]*)?פרטי קשר\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
            const el = document.getElementById('inp-book-back-contact');
            if (el) el.value = trimmed.replace(/^(?:פרטי קשר[:\s]*)?פרטי קשר\s*[-–—:]\s*/i, '').trim();
            match = true;
        } else if (/^(?:פרטים נוספים[:\s]*)?פרטים נוספים\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
            const el = document.getElementById('inp-book-back-extra');
            if (el) el.value = trimmed.replace(/^(?:פרטים נוספים[:\s]*)?פרטים נוספים\s*[-–—:]\s*/i, '').trim();
            match = true;
        } else if (/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*(.*)$/i.test(trimmed)) {
            const el = document.getElementById('inp-book-year');
            if (el) el.value = trimmed.replace(/^(?:מקום ושנת הוצאה[:\s]*)?מקום ושנת הוצאה\s*[-–—:]\s*/i, '').trim();
            match = true;
        }

        if (!match) {
            cleanLines.push(line);
        }
    }
    return cleanLines.join('\n');
}

/* ==========================================================================
   10. תוכן עניינים (TOC)
   ========================================================================== */
function buildStructuredTOC(tokenList, showLevels, groupLevels) {
    const entries = [];
    const minGroupLevel = groupLevels.length > 0 ? Math.min(...groupLevels) : 99;
    let currentGroupItems = [];

    function flushGroup() {
        if (currentGroupItems.length > 0) {
            entries.push({ isGroup: true, items: currentGroupItems.slice() });
            currentGroupItems = [];
        }
    }

    tokenList.forEach(t => {
        const lvl = t.type.startsWith('h') ? t.level : (t.sideNote ? 7 : null);
        const txt = t.type.startsWith('h') ? t.text : t.sideNote;
        if (lvl === null || !txt) return;
        if (!showLevels.includes(lvl)) return;

        if (lvl >= minGroupLevel) {
            currentGroupItems.push({ id: t.id, level: lvl, text: txt });
        } else {
            flushGroup();
            entries.push({ id: t.id, level: lvl, text: txt, isGroup: false });
        }
    });

    flushGroup();
    return entries;
}

function renderPaginatedTOC(container, entries, titleText, bookTitle, h1Title, pageIndex, curH1, curH2, tocPrefix) {
    if (entries.length === 0) return 0;

    let pagesCount = 0;
    let currentEntryIdx = 0;
    let lastRenderedGrid = null;
    let lastRenderedPage = null;

    const hdrRType = document.getElementById('hdr-r-type')?.value || 'h1';
    const hdrCType = document.getElementById('hdr-c-type')?.value || 'spear';
    const hdrLType = document.getElementById('hdr-l-type')?.value || 'h2';
    const hdrRAlign = resolveHeaderAlign(document.getElementById('hdr-r-align')?.value || 'right', 'r');
    const hdrCAlign = resolveHeaderAlign(document.getElementById('hdr-c-align')?.value || 'center', 'c');
    const hdrLAlign = resolveHeaderAlign(document.getElementById('hdr-l-align')?.value || 'left', 'l');

    const customR = document.getElementById('hdr-r-custom')?.value || '';
    const customC = document.getElementById('hdr-c-custom')?.value || '';
    const customL = document.getElementById('hdr-l-custom')?.value || '';

    const hdrRHTML = renderHeaderSectionHTML(hdrRType, customR, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
    const hdrCHTML = renderHeaderSectionHTML(hdrCType, customC, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);
    const hdrLHTML = renderHeaderSectionHTML(hdrLType, customL, curH1 || titleText, curH2 || titleText, '', bookTitle, titleText);

    function getTocStyle(level) {
        const f = document.getElementById(`f-${tocPrefix}-${level}`);
        const s = document.getElementById(`s-${tocPrefix}-${level}`);
        if (f && s) return `font-family: ${f.value}; font-size: ${s.value}pt;`;
        return '';
    }

    const showNum = (tocPrefix === 'dtoc')
        ? document.getElementById('detailed-toc-show-numbering')?.checked !== false
        : document.getElementById('general-toc-show-numbering')?.checked !== false;

    while (currentEntryIdx < entries.length) {
        const isFirstTOCPage = (pagesCount === 0);
        pagesCount++;
        const tocPNum = pageIndex + pagesCount - 1;
        const { framedPageNum: tocFramedNum } = formatPageNumberDisplay(tocPNum);

        const page = document.createElement('div');
        page.className = 'a4-page toc-page';
        page.setAttribute('data-page-index', String(tocPNum));
        applyContentBg(page, isFirstTOCPage ? 'tocFirst' : 'tocRegular');
        lastRenderedPage = page;

        page.innerHTML = `
      <button type="button" class="page-debug-btn" data-debug-page="${tocPNum}" title="הורד דוח דיבאג מקיף לעמוד זה">🐛 דיבאג עמוד ${escapeHTML(toGematria(tocPNum) || String(tocPNum))}</button>
      <div class="page-content-wrapper">
        <div class="top-header-grid">
          <div class="header-col-r" style="text-align:${escapeHTML(hdrRAlign)}; justify-content:${escapeHTML(hdrRAlign)};">${hdrRHTML}</div>
          <div class="header-col-c" style="text-align:${escapeHTML(hdrCAlign)}; justify-content:${escapeHTML(hdrCAlign)};">${hdrCHTML}</div>
          <div class="header-col-l" style="text-align:${escapeHTML(hdrLAlign)}; justify-content:${escapeHTML(hdrLAlign)};">${hdrLHTML}</div>
        </div>
        <div class="page-body-flow">
          ${isFirstTOCPage ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" style="margin-top: 0; margin-bottom: 25px;">${escapeHTML(titleText)}</div>` : ''}
          <div class="toc-grid-full"></div>
        </div>
        <div class="page-number-footer">${showNum ? escapeHTML(String(tocFramedNum)) : ''}</div>
      </div>
    `;
        container.appendChild(page);

        const gridFull = page.querySelector('.toc-grid-full');
        lastRenderedGrid = gridFull;

        const bodyFlow = page.querySelector('.page-body-flow');
        const maxH = bodyFlow.clientHeight || 870;

        let pageStartIndex = currentEntryIdx;
        let lastSubjectIdx = currentEntryIdx;

        while (currentEntryIdx < entries.length) {
            const it = entries[currentEntryIdx];
            if (!it.isGroup && (it.level === 1 || it.level === 2)) {
                lastSubjectIdx = currentEntryIdx;
            }

            let itemHTML = '';
            if (it.isGroup) {
                const inlineSpans = it.items.map(grp => `<span class="grp-item grp-lvl-${grp.level}" style="${getTocStyle(grp.level)}"><a href="#heading-tok-${escapeHTML(String(grp.id))}" style="text-decoration: none; color: inherit; outline: none;"><span class="grp-title">${escapeHTML(grp.text)}</span> - <span class="grp-page" data-target-id="${escapeHTML(String(grp.id))}"></span></a></span>`).join('<span class="grp-sep">|</span>');
                itemHTML = `<div class="toc-entry-group"><div class="toc-grouped-block">${inlineSpans}</div></div>`;
            } else {
                itemHTML = `
          <div class="toc-entry-group" style="${getTocStyle(it.level)}">
            <a href="#heading-tok-${escapeHTML(String(it.id))}" class="toc-item toc-lvl-${it.level}" style="text-decoration: none; color: inherit; outline: none;">
              <span class="toc-title">${escapeHTML(it.text)}</span>
              <span class="toc-dots"></span>
              <span class="toc-page-num" data-target-id="${escapeHTML(String(it.id))}"></span>
            </a>
          </div>
        `;
            }

            gridFull.insertAdjacentHTML('beforeend', itemHTML);

            if (bodyFlow.scrollHeight > maxH) {
                gridFull.lastElementChild.remove();
                // הסר עוד 2 פריטים כדי לפצות על margins שלא נספרים ב scrollHeight
                for (let extra = 0; extra < 2 && gridFull.children.length > 1; extra++) {
                    gridFull.lastElementChild.remove();
                    currentEntryIdx--;
                }
                if (gridFull.children.length > 0) {
                    if (lastSubjectIdx > pageStartIndex && currentEntryIdx > lastSubjectIdx) {
                        const itemsToRemove = currentEntryIdx - lastSubjectIdx;
                        for (let k = 0; k < itemsToRemove; k++) {
                            if (gridFull.children.length === 0) break;
                            gridFull.lastElementChild.remove();
                            currentEntryIdx--;
                        }
                    }
                    break;
                } else {
                    gridFull.insertAdjacentHTML('beforeend', itemHTML);
                    currentEntryIdx++;
                    break;
                }
            }
            currentEntryIdx++;
        }
    }

    if (lastRenderedGrid) lastRenderedGrid.style.justifyContent = 'flex-start';
    if (lastRenderedPage) applyContentBg(lastRenderedPage, 'tocLast');
    return pagesCount;
}

/* ==========================================================================
   11. מנוע העימוד המרכזי (performTypeset)
   ========================================================================== */
let typesetTimer = null;
function typesetDocument() {
    if (typesetTimer) clearTimeout(typesetTimer);
    typesetTimer = setTimeout(() => {
        performTypeset();
    }, 400);
}

/**
 * applyKpLineBreaks — פוסט-פרוססינג: החל <br> על כל הפסקאות ש-KP חישב.
 * רצה אחרי performTypesetInner מסיים, כדי למנוע קריסת זיכרון ב-probe renders.
 */
function applyKpLineBreaks() {
    if (!_kpEnabled) return;
    _kpBrEnabled = true;
    try {
        const styleObj = {
            fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body') || "'Frank Ruhl Libre', serif",
            fontSize: (getBodySizePt ? getBodySizePt() : 11) + 'pt',
            lineHeight: getComputedStyle(document.documentElement).getPropertyValue('--line-height-body') || '1.34',
        };
        const pages = document.querySelectorAll('#book-container .a4-page');
        let applied = 0;
        pages.forEach(pg => {
            pg.querySelectorAll('p[data-raw-text]').forEach(p => {
                const rawText = p.getAttribute('data-raw-text');
                if (!rawText) return;
                const isCont = p.classList.contains('p-cut');
                // Get colWidth from the parent column
                const col = p.closest('.right-col, .left-col, .page-body-flow');
                const colWidth = col ? col.clientWidth : 280;
                const linesInfo = getLinesFromParagraph(rawText, colWidth, styleObj, !isCont);
                if (linesInfo._fromKp && linesInfo.lines && linesInfo.lines.length > 1) {
                    p.innerHTML = linesInfo.lines.map(l => escapeHTML(l)).join('<br>');
                    applied++;
                }
            });
        });
        if (applied > 0) {
            console.log('applyKpLineBreaks: applied <br> to ' + applied + ' paragraphs');
        }
    } catch (e) {
        console.warn('applyKpLineBreaks failed:', e);
    }
    _kpBrEnabled = false;
}

function performTypeset() {
    // איפוס מצב גלובלי לפני תחילת כל מחזור עימוד (מונע דליפת state בין רינדורים).
    // פעולה 3: נקה מטמון מדידות — הטקסט או ההגדרות עשויים להשתנות.
    _linesCache.clear();
    // פעולה 3 חלק ב': נקה גם את מטמון רוחבי המילים של Canvas.
    // הגופן או הגדרות העימוד עשויות להשתנות, לכן יש לנקות כדי למנוע מדידות שגויות.
    if (typeof resetWordWidthCache === 'function') resetWordWidthCache();
    // פעולה 4: נקה גם את מטמון Knuth-Plass.
    if (typeof resetKpCache === 'function') resetKpCache();
    if (typeof clearPendingChanges === 'function') clearPendingChanges();
    updateGrid();
    updateStyles();

    noteCounters = {
        footnote: 0,
        endnote: 0
    };
    noteUidCounter = 0;
    footnoteQueueForPage = [];
    endnoteQueueForPart = [];
    window.__pageDebugStore = {};

    // פעולה 4 — כבה <br> במהלך העימוד (מונע קריסת זיכרון ב-probe renders)
    _kpBrEnabled = false;

    // עטיפת הלולאה הראשית ב-try/catch — מונעת קריסה חלקית של התצוגה במקרה של
    // טוקן יחיד שזורק (למשל def.parseRegex שגוי, או מבנה טקסט לא צפוי).
    // במקרה של שגיאה: מציג הודעת toast לא חוסמת, ולא משאיר את התצוגה ריקה.
    try {
        performTypesetInner();
        // פעולה 4 — applyKpLineBreaks מבוטל: <br> שובר את text-align: justify
        // כי דפדפנים מתייחסים לכל שורה לפני <br> כ"שורה אחרונה" ומחילים
        // text-align-last (center) במקום justify. זה גורם לכל השורות להיות
        // ממורכזות ולהיראות כפסקאות נפרדות.
        // KP עדיין משמש לחישוב numLines (לאיזון טורים ושבירת עמודים),
        // אבל הדפדפן שובר שורות בעצמו (greedy) עם justify תקין.
        // applyKpLineBreaks();
    } catch (err) {
        // TRACE HOOK: עצירה יזומה ע"י trace-manager אינה שגיאה אמיתית — היא משמשת לעצירת העימוד בנקודה מסוימת
        if (err && err.message === '__TRACE_STOP__') {
            console.log('[trace] העימוד הופסק יזומת ע"י trace-manager');
            if (typeof window.__traceOnStopped === 'function') {
                try { window.__traceOnStopped(); } catch (e) {}
            }
        } else {
            console.error('typeset failed:', err);
            const stats = document.getElementById('editor-stats');
            if (stats) {
                stats.textContent = '⚠️ שגיאת עימוד: ' + (err && err.message ? err.message : String(err));
                stats.style.color = '#dc2626';
            }
            // הצגת הודעת alert לא חוסמת דרך setTimeout כדי לא להקפיא את ה-Main Thread.
            setTimeout(() => {
                if (typeof window.showToast === 'function') {
                    window.showToast('שגיאת עימוד: ' + (err && err.message ? err.message : String(err)));
                }
            }, 0);
        }
    }
}

function performTypesetInner() {

    const pageBreaks = [];
    const recordedBreakLines = new Set();

    function recordPageBreak(pNum, lineIdx) {
        if (lineIdx === undefined || lineIdx === null || lineIdx < 0) return;
        if (pNum <= 1 || recordedBreakLines.has(lineIdx)) return;
        recordedBreakLines.add(lineIdx);
        pageBreaks.push({
            pageNum: pNum,
            gematria: toGematria(pNum),
            lineIdx: lineIdx
        });
    }

    let rawText = (typeof getCleanEditorText === 'function') ? getCleanEditorText() : (document.getElementById('raw-input')?.value || '');
    if (!rawText.trim()) return;

    rawText = stripEditorialNotes(rawText);
    rawText = parseMetadataFromText(rawText);

    const fnOpen = document.getElementById('fn-delim-open')?.value?.trim() || '[';
    if (fnOpen) {
        const escO = fnOpen.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        rawText = rawText.replace(new RegExp('\\s+(' + escO + ')', 'g'), '$1');
    }
    const autoSimanH2 = document.getElementById('h2-auto-siman')?.checked ?? false;
    const resetSimanOnH1 = document.getElementById('h2-reset-siman')?.checked ?? true;
    let simanCounter = 0;

    const h2OrnTopStyle = document.getElementById('h2-ornament-top-style')?.value || 'none';
    const h2OrnBtmStyle = document.getElementById('h2-ornament-bottom-style')?.value || 'none';
    const h3OrnR = document.getElementById('h3-ornament-r')?.value || 'none';
    const h3OrnL = document.getElementById('h3-ornament-l')?.value || 'none';
    const colDividerStyle = document.getElementById('col-divider-style')?.value || 'none';
    const showSubShaar = document.getElementById('show-sub-shaar')?.checked ?? true;

    const container = document.getElementById('book-container');
    if (!container) return;
    container.innerHTML = '';

    const enLinePrefix = document.getElementById('en-line-prefix')?.value?.trim() || 'הערת סיום -';

    const lines = rawText.split('\n');
    const tokens = [];
    globalTokens = tokens;
    let pendingSideNote = null;
    let pendingSideNoteStyleId = null;
    let pendingEndNote = null;
    let pendingRunInHeading = null;
    lineToTokenMap = [];

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx].trim();
        if (!line) {
            lineToTokenMap[lineIdx] = null;
            continue;
        }

        if (enLinePrefix && line.startsWith(enLinePrefix)) {
            pendingEndNote = line.slice(enLinePrefix.length).replace(/^[:\-–—]\s*/, '').trim();
            lineToTokenMap[lineIdx] = null;
            continue;
        }

        const hMatch = line.match(/^כותרת\s*(\d+).*?[-–—]\s*(.*)$/);
        if (hMatch) {
            const lvl = parseInt(hMatch[1], 10);
            const txt = hMatch[2].trim();
            if (lvl === 7 && (document.getElementById('mode-h7')?.value || 'side_note') === 'side_note') {
                pendingSideNote = txt;
                pendingSideNoteStyleId = null;
                lineToTokenMap[lineIdx] = null;
            } else {
                const hMode = document.getElementById('mode-h' + lvl)?.value;
                if (hMode === 'run_in') {
                    pendingRunInHeading = { level: lvl, text: txt, lineIdx: lineIdx };
                    lineToTokenMap[lineIdx] = null;
                } else {
                    const tokenObj = {
                        id: tokens.length,
                        type: 'h' + lvl,
                        level: lvl,
                        text: txt,
                        lineIdx: lineIdx
                    };
                    tokens.push(tokenObj);
                    lineToTokenMap[lineIdx] = tokenObj.id;
                }
            }
        } else {
            let customMatch = null;
            if (typeof importedTextStyles !== 'undefined') {
                for (const inst of importedTextStyles) {
                    const trig = inst.def && inst.def.trigger;
                    if (trig && trig.type === 'linePrefix' && trig.prefix && line.startsWith(trig.prefix)) {
                        customMatch = {
                            inst,
                            text: line.slice(trig.prefix.length).replace(/^[:\-–—]\s*/, '').trim()
                        };
                        break;
                    }
                }
            }
            if (customMatch) {
                if (customMatch.inst.def.target === 'endnote') {
                    pendingEndNote = customMatch.text;
                    lineToTokenMap[lineIdx] = null;
                } else if (customMatch.inst.def.layoutMode === 'side_note') {
                    pendingSideNote = customMatch.text;
                    pendingSideNoteStyleId = customMatch.inst.instanceId;
                    lineToTokenMap[lineIdx] = null;
                } else if (customMatch.inst.def.layoutMode === 'run_in') {
                    pendingRunInHeading = {
                        level: customMatch.inst.syntheticLevel,
                        text: customMatch.text,
                        lineIdx: lineIdx,
                        customStyleId: customMatch.inst.instanceId
                    };
                    lineToTokenMap[lineIdx] = null;
                } else {
                    const lvl = customMatch.inst.syntheticLevel;
                    const tokenObj = {
                        id: tokens.length,
                        type: 'h' + lvl,
                        level: lvl,
                        text: customMatch.text,
                        lineIdx: lineIdx,
                        customStyleId: customMatch.inst.instanceId
                    };
                    tokens.push(tokenObj);
                    lineToTokenMap[lineIdx] = tokenObj.id;
                }
            } else {
                let paragraphText = line;
                if (pendingRunInHeading) {
                    paragraphText = `<span class="heading-run-in title-level-${pendingRunInHeading.level}">${pendingRunInHeading.text}</span> ` + paragraphText;
                    pendingRunInHeading = null;
                }

                const tokenObj = {
                    id: tokens.length,
                    type: 'p',
                    text: paragraphText,
                    sideNote: pendingSideNote,
                    sideNoteStyleId: pendingSideNoteStyleId,
                    endNote: pendingEndNote,
                    lineIdx: lineIdx
                };
                tokens.push(tokenObj);
                lineToTokenMap[lineIdx] = tokenObj.id;
                pendingSideNote = null;
                pendingSideNoteStyleId = null;
                pendingEndNote = null;
            }
        }
    }

    const headingModes = {
        0: document.getElementById('mode-h0')?.value || 'new_page_1col',
        1: document.getElementById('mode-h1')?.value || 'sub_shaar',
        2: document.getElementById('mode-h2')?.value || 'new_page_1col',
        3: document.getElementById('mode-h3')?.value || 'span_1col',
        4: document.getElementById('mode-h4')?.value || 'inline_2col',
        5: document.getElementById('mode-h5')?.value || 'inline_2col',
        6: document.getElementById('mode-h6')?.value || 'inline_2col',
        7: document.getElementById('mode-h7')?.value || 'side_note'
    };
    if (typeof importedTextStyles !== 'undefined') {
        importedTextStyles.forEach(inst => {
            if (inst.syntheticLevel != null) headingModes[inst.syntheticLevel] = inst.def.layoutMode;
        });
    }

    const oddPageRequired = {
        0: document.getElementById('odd-h0')?.checked ?? false,
        1: document.getElementById('odd-h1')?.checked ?? false,
        2: document.getElementById('odd-h2')?.checked ?? false
    };
    if (typeof importedTextStyles !== 'undefined') {
        importedTextStyles.forEach(inst => {
            if (inst.syntheticLevel != null) oddPageRequired[inst.syntheticLevel] = !!inst.def.startOnOddPage;
        });
    }

    function ensureOddPageStart(level) {
        if (!oddPageRequired[level]) return;
        if (pageIndex % 2 === 0) {
            const blank = document.createElement('div');
            blank.className = 'a4-page blank-page';
            container.appendChild(blank);
            pageIndex++;
        }
    }

    const sections = [];
    let currentSection = { type: 'body', tokens: [] };

    tokens.forEach(t => {
        let mode = t.type.startsWith('h') ? headingModes[t.level] : 'inline_2col';
        if (mode === 'sub_shaar' && !showSubShaar) {
            mode = 'new_page_1col';
        }

        if (mode === 'sub_shaar') {
            if (currentSection.tokens.length > 0) sections.push(currentSection);
            sections.push({ type: 'sub_shaar', token: t, tokens: [] });
            currentSection = { type: 'body', tokens: [] };
        } else if (mode === 'new_page_1col' || mode === 'new_page_2col') {
            if (currentSection.tokens.length > 0) sections.push(currentSection);
            currentSection = {
                type: 'body',
                isNewPage: true,
                is2ColNewPage: (mode === 'new_page_2col'),
                hToken: t,
                tokens: []
            };
        } else {
            currentSection.tokens.push(t);
        }
    });
    if (currentSection.tokens.length > 0 || currentSection.type === 'sub_shaar' || currentSection.isNewPage) {
        sections.push(currentSection);
    }

    // TRACE HOOK: דיווח רשימת הפרקים ל-trace-manager (אם מופעל)
    if (typeof window.__traceOnChaptersBuilt === 'function') {
        try {
            const traceChapters = sections.map((s, i) => ({
                idx: i,
                type: s.type,
                title: s.isNewPage ? (s.hToken ? s.hToken.text : '') : (s.token ? s.token.text : 'תוכן ראשוני'),
                level: s.isNewPage ? (s.hToken ? s.hToken.level : 0) : (s.token ? s.token.level : 0),
                lineIdx: s.isNewPage ? (s.hToken ? s.hToken.lineIdx : 0) : (s.token ? s.token.lineIdx : 0),
                tokenCount: (s.tokens || []).length,
                isSubShaar: s.type === 'sub_shaar',
                isNewPage: !!s.isNewPage
            }));
            window.__traceOnChaptersBuilt(traceChapters);
        } catch (e) { console.warn('[trace] chapters built hook failed:', e); }
    }

    const gtocShows = Array.from(document.querySelectorAll('.gtoc-show:checked')).map(cb => parseInt(cb.value, 10));
    const gtocGroups = Array.from(document.querySelectorAll('.gtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
    if (typeof importedTextStyles !== 'undefined') {
        importedTextStyles.forEach(inst => {
            if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
                gtocShows.push(inst.syntheticLevel);
                if (inst.def.toc.grouping) gtocGroups.push(inst.syntheticLevel);
            }
        });
    }

    const headingPageMap = {};
    let pageIndex = 1;
    let currentH1Title = '';
    let currentH2Title = '';

    const bookTitle = document.getElementById('inp-book-title')?.value || "ספר";
    const showMainShaar = document.getElementById('show-main-shaar')?.checked ?? true;
    const showBackShaar = document.getElementById('show-back-shaar')?.checked ?? false;
    const activeThemeId = document.getElementById('active-theme-select')?.value || 'builtin_1';
    const secDivStyle = document.getElementById('section-divider-style')?.value || 'spear';
    const enableGeneralTOC = document.getElementById('enable-general-toc')?.checked ?? true;
    const enableDetailedTOC = document.getElementById('enable-detailed-toc')?.checked ?? true;

    const customR = document.getElementById('hdr-r-custom')?.value || '';
    const customC = document.getElementById('hdr-c-custom')?.value || '';
    const customL = document.getElementById('hdr-l-custom')?.value || '';

    // TRACE HOOK: כשמסננים לפרק בודד, דלג על שער הפתיחה ושער הסיום
    const __traceFiltering = (typeof window.__traceChapterFilter === 'number');

    if (showMainShaar && !__traceFiltering) {
        renderExtAnchor(container, 'beforeAll', rawText);
        renderMainShaar(container, activeThemeId, pageIndex);
        if (document.getElementById('main-shaar-count-numbering')?.checked) pageIndex++;
        renderExtAnchor(container, 'afterMainShaar', rawText);
    } else if (!__traceFiltering) {
        renderExtAnchor(container, 'beforeAll', rawText);
    }

    if (showBackShaar && !__traceFiltering) {
        renderBackShaar(container, activeThemeId, pageIndex);
        if (document.getElementById('back-shaar-count-numbering')?.checked) pageIndex++;
    }

    if (enableGeneralTOC && !__traceFiltering) {
        const generalTocEntries = buildStructuredTOC(tokens, gtocShows, gtocGroups);
        const pagesRendered = renderPaginatedTOC(container, generalTocEntries, "תוכן עניינים כללי", bookTitle, "תוכן עניינים כללי", pageIndex, "תוכן עניינים כללי", "תוכן עניינים כללי", "gtoc");
        if (document.getElementById('general-toc-count-numbering')?.checked !== false) {
            pageIndex += pagesRendered;
        }
    }
    if (!__traceFiltering) renderExtAnchor(container, 'afterGeneralToc', rawText);

    const styleObj = {
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
        lineHeight: getComputedStyle(document.documentElement).getPropertyValue('--line-height-body') || '1.34'
    };

    let hasOpenPart = false;
    let prevPageEl = null;

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const sec = sections[sIdx];

        // TRACE HOOK: עדכון פרק נוכחי + סינון פרקים (לרינדור פרק בודד)
        if (typeof window.__traceOnChapterStart === 'function') {
            try { window.__traceOnChapterStart(sIdx, sections.length); } catch (e) {}
        }
        // אם trace-manager מבקש לעבד רק פרק מסוים — דלג על כל השאר
        if (typeof window.__traceChapterFilter === 'number' && sIdx !== window.__traceChapterFilter) {
            // עדיין צריך לעדכן מצב גלובלי כדי שהפרק שיוצג לא יישבר — אבל קפיצה מ-0 ל-M תיתן מספור עמודים נכון מ-1
            if (typeof window.__traceChapterFilter === 'number' && sIdx === window.__traceChapterFilter) {
                // (לא יקרה — כבר טופל למעלה)
            }
            continue;
        }
        // איפוס pageIndex כשמתחילים מפרק מסוים — כדי שהמספור יתחיל מ-1
        if (typeof window.__traceChapterFilter === 'number' && sIdx === window.__traceChapterFilter && sIdx > 0) {
            pageIndex = 1;
            currentH1Title = '';
            currentH2Title = '';
            hasOpenPart = false;
            prevPageEl = null;
        }

        if (sec.type === 'sub_shaar') {
            if (prevPageEl) {
                flushFootnotesInto(prevPageEl);
                prevPageEl = null;
            }
            if (hasOpenPart) {
                flushEndnotesForPart(container, pageIndex);
                renderExtAnchor(container, 'endOfEachPart', rawText);
            }
            renderExtAnchor(container, 'beforeEachPart', rawText);
            hasOpenPart = true;

            if (resetSimanOnH1) simanCounter = 0;
            resetNoteCounterIfNeeded('footnote', 'part');

            ensureOddPageStart(sec.token.level);
            renderSubShaar(container, sec.token, activeThemeId, pageIndex);
            const subShaarPage = container.lastElementChild;
            if (subShaarPage) {
                subShaarPage.setAttribute('data-page-index', String(pageIndex));
                subShaarPage.setAttribute('data-first-line-idx', String(sec.token.lineIdx));
            }
            recordPageBreak(pageIndex, sec.token.lineIdx);
            if (document.getElementById('sub-shaar-count-numbering')?.checked) {
                pageIndex++;
            }

            currentH1Title = sec.token.text.split(/[-–—]/)[0].trim();
            headingPageMap[sec.token.id] = toGematria(pageIndex);

            if (enableDetailedTOC) {
                let inThisH1 = false;
                const thisH1Tokens = [];
                for (let t of tokens) {
                    if (t.id === sec.token.id) { inThisH1 = true; continue; }
                    if (inThisH1 && t.type.startsWith('h') && headingModes[t.level] === 'sub_shaar') break;
                    if (inThisH1) thisH1Tokens.push(t);
                }

                const dtocShows = Array.from(document.querySelectorAll('.dtoc-show:checked')).map(cb => parseInt(cb.value, 10));
                const dtocGroups = Array.from(document.querySelectorAll('.dtoc-grp:checked')).map(cb => parseInt(cb.value, 10));
                if (typeof importedTextStyles !== 'undefined') {
                    importedTextStyles.forEach(inst => {
                        if (inst.syntheticLevel != null && inst.def.toc && inst.def.toc.include) {
                            dtocShows.push(inst.syntheticLevel);
                            if (inst.def.toc.grouping) dtocGroups.push(inst.syntheticLevel);
                        }
                    });
                }
                const detailedTocEntries = buildStructuredTOC(thisH1Tokens, dtocShows, dtocGroups);
                const dtocPages = renderPaginatedTOC(container, detailedTocEntries, "תוכן עניינים מפורט", bookTitle, currentH1Title, pageIndex, currentH1Title, "תוכן עניינים מפורט", "dtoc");
                if (document.getElementById('detailed-toc-count-numbering')?.checked !== false) {
                    pageIndex += dtocPages;
                }
            }
            renderExtAnchor(container, 'afterEachPart', rawText);
            continue;
        }

        let isFirstPage = true;
        let rawH2Text = sec.isNewPage ? sec.hToken.text : '';
        let h2Id = sec.isNewPage ? sec.hToken.id : undefined;
        let isH0 = sec.isNewPage && sec.hToken.level === 0 && !sec.is2ColNewPage;

        let simanLabel = '';
        let displayH2Text = rawH2Text;
        let h2Text = rawH2Text;

        if (autoSimanH2 && sec.isNewPage && sec.hToken && sec.hToken.level === 2) {
            simanCounter++;
            simanLabel = 'סימן ' + toGematria(simanCounter);
            displayH2Text = rawH2Text.replace(/^סימן\s+[א-ת]+[:\-–—\s]*/i, '').trim();
            h2Text = simanLabel + (displayH2Text ? ' - ' + displayH2Text : '');
        }

        if (h2Text) {
            currentH2Title = h2Text;
            headingPageMap[h2Id] = toGematria(pageIndex);
            resetNoteCounterIfNeeded('footnote', 'siman');
        }

        let secTokens = sec.tokens.slice();
        let tokenIndex = 0;
        let pendingWordTokens = null;

        while (tokenIndex < secTokens.length || pendingWordTokens) {
            if (prevPageEl) flushFootnotesInto(prevPageEl);
            if (isFirstPage && h2Text && sec.hToken) ensureOddPageStart(sec.hToken.level);

            const pageRole = isFirstPage ? (isH0 ? 'h0Open' : (h2Text ? 'h2Open' : 'regular')) : 'regular';
            const pageContext = {
                simanBadge: simanLabel,
                rawH2WithoutSiman: displayH2Text,
                h4Title: currentH4Title
            };

            const currentPageNum = pageIndex;
            let pageLayout = createPageLayout(container, isFirstPage ? h2Text : '', isFirstPage ? h2Id : undefined, pageIndex, currentH1Title, currentH2Title, currentH3Title, bookTitle, customR, customC, customL, pageRole, pageContext);
            pageIndex++;
            prevPageEl = pageLayout.page;

            const pageTrace = {
                pageIndex: currentPageNum,
                gematria: toGematria(currentPageNum),
                pageRole,
                pageContext,
                h2Text: isFirstPage ? h2Text : '',
                initialBudget: getPageFlowBudget(pageLayout.page),
                tokensPlaced: [],
                steps: [],
                justificationLog: null,
                balanceLog: null,
                domMetrics: {}
            };
            window.__pageDebugStore[currentPageNum] = pageTrace;

            const firstLineIdxOnPage = (isFirstPage && h2Text && sec.hToken) ? sec.hToken.lineIdx : (pendingWordTokens ? pendingWordTokens.token.lineIdx : (secTokens[tokenIndex] ? secTokens[tokenIndex].lineIdx : null));
            if (firstLineIdxOnPage !== null && firstLineIdxOnPage !== undefined) {
                pageLayout.page.setAttribute('data-first-line-idx', String(firstLineIdxOnPage));
                recordPageBreak(pageIndex - 1, firstLineIdxOnPage);
            }

            if (isFirstPage && h2Text) {
                const title = pageLayout.bodyFlow.querySelector('.title-level-2-standalone');
                if (title) {
                    if (sec.hToken.customStyleId) {
                        const inst = findExtTextStyle(sec.hToken.customStyleId);
                        if (inst) renderCustomHeadingInto(title, inst, displayH2Text || h2Text);
                    } else if (displayH2Text) {
                        title.textContent = displayH2Text;
                    }

                    let simanElem = null;
                    if (simanLabel) {
                        simanElem = document.createElement('div');
                        simanElem.className = 'h2-siman-badge';
                        simanElem.textContent = simanLabel;
                        title.parentNode.insertBefore(simanElem, title);
                    }

                    const topOrnHTML = (h2OrnTopStyle && h2OrnTopStyle !== 'none') ? getHeadingOrnamentHTML(h2OrnTopStyle, true, true) : '';
                    const btmOrnHTML = (h2OrnBtmStyle && h2OrnBtmStyle !== 'none') ? getHeadingOrnamentHTML(h2OrnBtmStyle, false, true) : '';

                    if (topOrnHTML) {
                        const ornWrap = document.createElement('div');
                        ornWrap.className = 'h2-ornament-top';
                        ornWrap.innerHTML = topOrnHTML;
                        const insertTarget = simanElem || title;
                        insertTarget.parentNode.insertBefore(ornWrap, insertTarget);
                        fitOneHeadingOrnament(ornWrap, true);
                    }
                    if (btmOrnHTML) {
                        const ornWrap = document.createElement('div');
                        ornWrap.className = 'h2-ornament-bottom';
                        ornWrap.innerHTML = btmOrnHTML;
                        const insertAfter = simanElem || title;
                        insertAfter.parentNode.insertBefore(ornWrap, insertAfter === title ? title.nextSibling : title);
                        fitOneHeadingOrnament(ornWrap, false);
                    }

                    const h2TitleOrnMode = document.getElementById('h2-title-orn-mode')?.value || 'none';
                    if (h2TitleOrnMode === 'top_bottom') {
                        const titleTopStyle = document.getElementById('h2-title-ornament-top-style')?.value || 'none';
                        const titleBtmStyle = document.getElementById('h2-title-ornament-bottom-style')?.value || 'none';
                        const titleTopHTML = (titleTopStyle !== 'none') ? getHeadingOrnamentHTML(titleTopStyle, true, true) : '';
                        const titleBtmHTML = (titleBtmStyle !== 'none') ? getHeadingOrnamentHTML(titleBtmStyle, false, true) : '';
                        if (titleTopHTML) {
                            const ornWrap = document.createElement('div');
                            ornWrap.className = 'h2-ornament-top';
                            ornWrap.innerHTML = titleTopHTML;
                            title.parentNode.insertBefore(ornWrap, title);
                            fitOneHeadingOrnament(ornWrap, true);
                        }
                        if (titleBtmHTML) {
                            const ornWrap = document.createElement('div');
                            ornWrap.className = 'h2-ornament-bottom';
                            ornWrap.innerHTML = titleBtmHTML;
                            title.parentNode.insertBefore(ornWrap, title.nextSibling);
                            fitOneHeadingOrnament(ornWrap, false);
                        }
                    } else if (h2TitleOrnMode === 'side' && typeof renderSideOrnamentHTML === 'function') {
                        const titleOrnR = document.getElementById('h2-title-ornament-r')?.value || 'none';
                        const titleOrnL = document.getElementById('h2-title-ornament-l')?.value || 'none';
                        const ornRHTML = renderSideOrnamentHTML(titleOrnR, false, 'h2title');
                        const effectiveL = (titleOrnL !== 'none') ? titleOrnL : titleOrnR;
                        const ornLHTML = renderSideOrnamentHTML(effectiveL, true, 'h2title');
                        if (ornRHTML || ornLHTML) {
                            const sideWrap = document.createElement('div');
                            sideWrap.className = 'block-h2-title-side';
                            title.parentNode.insertBefore(sideWrap, title);
                            if (ornRHTML) {
                                const ornR = document.createElement('div');
                                ornR.className = 'h2-title-ornament-right';
                                ornR.innerHTML = ornRHTML;
                                sideWrap.appendChild(ornR);
                            }
                            sideWrap.appendChild(title);
                            if (ornLHTML) {
                                const ornL = document.createElement('div');
                                ornL.className = 'h2-title-ornament-left';
                                ornL.innerHTML = ornLHTML;
                                sideWrap.appendChild(ornL);
                            }
                            fitSideOrnamentsToText(sideWrap);
                        }
                    }
                }
            }

            isFirstPage = false;

            /* מודל הקדמה (כותרת 0 - טור יחיד רחב) */
            if (isH0) {
                const singleBlock = document.createElement('div');
                singleBlock.className = 'block-single-col';
                singleBlock.innerHTML = `<div class="single-wide-col"></div>`;
                pageLayout.bodyFlow.appendChild(singleBlock);
                const targetCol = singleBlock.querySelector('.single-wide-col');
                let pageHasContent = false;

                while (tokenIndex < secTokens.length || pendingWordTokens) {
                    const currentAvailH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, singleBlock);
                    if (targetCol.scrollHeight >= currentAvailH - 8 && targetCol.children.length > 0) break;

                    let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];

                    if (currentTok.type.startsWith('h')) {
                        if (currentTok.level === 3) currentH3Title = currentTok.text;
                        if (currentTok.level === 4) currentH4Title = currentTok.text;
                        const nextToks = secTokens.slice(tokenIndex + 1);
                        if (!canHeadingFitWithBody(targetCol, currentTok, nextToks, 580, styleObj, currentAvailH)) {
                            pageTrace.steps.push(`כותרת [${currentTok.id}] נדחתה כדי למנוע כותרת יתומה בתחתית טור`);
                            break;
                        }

                        const hElem = document.createElement('div');
                        hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                        hElem.setAttribute('data-token-id', currentTok.id);
                        if (currentTok.customStyleId) {
                            const inst = findExtTextStyle(currentTok.customStyleId);
                            if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text);
                            else hElem.textContent = currentTok.text;
                        } else {
                            hElem.textContent = currentTok.text;
                        }
                        applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId), false);
                        targetCol.appendChild(hElem);

                        pageTrace.tokensPlaced.push({ id: currentTok.id, type: currentTok.type, text: currentTok.text });
                        headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                        tokenIndex++;
                        continue;
                    }

                    if (currentTok.type === 'p') {
                        let linesInfo = getLinesFromParagraph(currentTok.text, 580, styleObj, true);
                        let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                        let isContinuation = pendingWordTokens ? (pendingWordTokens.remainingLines.length < linesInfo.lines.length) : false;
                        let hasWindow = isContinuation ? false : linesInfo.hasWindow;

                        const pElem = document.createElement('p');
                        pElem.setAttribute('data-token-id', currentTok.id);
                        targetCol.appendChild(pElem);

                        const availH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, singleBlock);
                        let bestFitLine = measureMaxFitLines(pElem, targetCol, lines, isContinuation, hasWindow, availH);

                        if (bestFitLine === 0) {
                            targetCol.removeChild(pElem);
                            break;
                        }

                        const refined = refineParagraphFitLine(lines, bestFitLine, pageHasContent, bestFitLine);
                        if (refined.forcePageBreak) {
                            targetCol.removeChild(pElem);
                            break;
                        }
                        bestFitLine = refined.fit;
                        bestFitLine = shrinkFitUntilFitsDry(pElem, targetCol, lines, bestFitLine, isContinuation, hasWindow, availH);

                        if (bestFitLine <= 0) {
                            targetCol.removeChild(pElem);
                            break;
                        }

                        pageHasContent = true;
                        
                        // תיקון: משוך מילים מההמשך לשורה האחרונה כדי למנוע שורה דלילה
                        let chunkLines = lines.slice(0, bestFitLine);
                        let remainingLines = lines.slice(bestFitLine);
                        const isEndOfP = (bestFitLine === lines.length);
                        
                        if (!isEndOfP && typeof pullWordsToLastLine === 'function') {
                            const pullResult = pullWordsToLastLine(lines, bestFitLine, 580, styleObj);
                            chunkLines = pullResult.chunkLines;
                            remainingLines = pullResult.remainingLines;
                        }
                        
                        pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                        pElem.setAttribute('data-raw-text', chunkLines.join(' '));
                        // פעולה 4 — כבד שורות KP עם <br> במסלול טור יחיד
                        if (_kpBrEnabled && linesInfo._fromKp && chunkLines.length > 1) {
                            pElem.innerHTML = chunkLines.map(l => escapeHTML(l)).join('<br>');
                        } else {
                            const chunk = chunkLines.join(' ');
                            pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow, lines.length);
                        }
                        applyDelimiterStyles(pElem, 'body', getBodySizePt(), false);

                        pageTrace.tokensPlaced.push({ id: currentTok.id, type: 'p', linesPlaced: bestFitLine, totalLines: lines.length, isEndOfP });

                        if (isEndOfP) {
                            pendingWordTokens = null;
                            tokenIndex++;
                        } else {
                            pendingWordTokens = {
                                token: currentTok,
                                remainingLines: remainingLines
                            };
                            break;
                        }
                    }
                }
                continue;
            }

            let pagePendingNotes = [];

            /* מודל שני טורים (גוף הספר) */
            while (tokenIndex < secTokens.length || pendingWordTokens) {
                let peekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                const peekMode = peekTok && peekTok.type.startsWith('h') ? headingModes[peekTok.level] : 'inline_2col';

                /* כותרת 3 רוחבית (Span 1 Column) */
                if (peekMode === 'span_1col' && !pendingWordTokens) {
                    const currentAvailH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, null);
                    // פעולה 4 — תיקון "עמודים קצרים לפני H3":
                    // הסף הישן (190px) גרם לעמודים קצרים מדי. הסף החדש מבוסס על
                    // דרישת "שתי שורות טקסט אחרי H3" (לפי מחקר 1, סעיף "קיבוע כותרות").
                    // גובה H3 + 2 שורות טקסט ≈ 60px + 2*20px = 100px. נשתמש ב-120px
                    // כדי לאפשר גם margin.
                    // אבל: אם currentAvailH קטן מ-120, דחה את ה-H3. אחרת, אפשר לו
                    // להיכנס גם אם יש רק שורה אחת אחריו — עדיף על עמוד קצר.
                    if (currentAvailH < 120) {
                        pageTrace.steps.push(`כותרת רוחבית [${peekTok.id}] נדחתה לעמוד הבא עקב חוסר מקום (${currentAvailH}px < 120px)`);
                        break;
                    }

                    const nextToks = secTokens.slice(tokenIndex + 1);
                    const dummyCol = document.createElement('div');
                    dummyCol.style.width = '270px';
                    if (!canHeadingFitWithBody(dummyCol, peekTok, nextToks, 270, styleObj, currentAvailH)) {
                        pageTrace.steps.push(`כותרת רוחבית [${peekTok.id}] נדחתה לעמוד הבא למניעת יתמות`);
                        break;
                    }

                    if (peekTok.level === 3) currentH3Title = peekTok.text;
                    if (peekTok.level === 4) currentH4Title = peekTok.text;
                    const spanBlock = document.createElement('div');
                    spanBlock.className = 'block-h3-span';

                    const ornRHTML = renderSideOrnamentHTML(h3OrnR, false, 'h3');
                    if (ornRHTML) {
                        const ornR = document.createElement('div');
                        ornR.className = 'h3-ornament-right';
                        ornR.innerHTML = ornRHTML;
                        spanBlock.appendChild(ornR);
                    }

                    const spanTitle = document.createElement('div');
                    spanTitle.className = 'h3-title-text';
                    spanTitle.setAttribute('data-token-id', peekTok.id);
                    spanTitle.id = `heading-tok-${peekTok.id}`;
                    if (peekTok.customStyleId) {
                        const inst = findExtTextStyle(peekTok.customStyleId);
                        if (inst) renderCustomHeadingInto(spanTitle, inst, peekTok.text);
                        else spanTitle.textContent = peekTok.text;
                    } else {
                        spanTitle.textContent = peekTok.text;
                    }
                    applyDelimiterStyles(spanTitle, 'h' + peekTok.level, getHostSizePt(peekTok.level, peekTok.customStyleId), false);
                    spanBlock.appendChild(spanTitle);

                    const ornLHTML = renderSideOrnamentHTML(h3OrnL, true, 'h3');
                    if (ornLHTML) {
                        const ornL = document.createElement('div');
                        ornL.className = 'h3-ornament-left';
                        ornL.innerHTML = ornLHTML;
                        spanBlock.appendChild(ornL);
                    }

                    pageLayout.bodyFlow.appendChild(spanBlock);
                    fitSideOrnamentsToText(spanBlock);

                    const spanHeight = spanBlock.offsetHeight + 4;
                    if (spanHeight > getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, null)) {
                        pageLayout.bodyFlow.removeChild(spanBlock);
                        break;
                    }

                    pageTrace.tokensPlaced.push({ id: peekTok.id, type: 'h-span', text: peekTok.text });
                    headingPageMap[peekTok.id] = toGematria(pageIndex - 1);
                    tokenIndex++;
                    continue;
                }

                // בדיקת תקציב לפני פתיחת בלוק שני טורים
                const availForBlock = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, null);
                if (availForBlock < 70) {
                    break;
                }

                const block2Col = document.createElement('div');
                block2Col.className = 'block-2col';
                block2Col.innerHTML = `
          <div class="margin-notes-column right-margin"></div>
          <div></div>
          <div class="main-column right-col"></div>
          <div class="col-gutter-divider col-rule-${colDividerStyle}"></div>
          <div class="main-column left-col"></div>
          <div></div>
          <div class="margin-notes-column left-margin"></div>
        `;
                pageLayout.bodyFlow.appendChild(block2Col);

                const blockNoteSnapshot = {
                    footnoteQueueLen: footnoteQueueForPage.length,
                    endnoteQueueLen: endnoteQueueForPart.length,
                    footnoteCounter: noteCounters.footnote || 0,
                    endnoteCounter: noteCounters.endnote || 0,
                    noteUid: noteUidCounter
                };

                const rCol = block2Col.querySelector('.right-col');
                const lCol = block2Col.querySelector('.left-col');
                const rMargin = block2Col.querySelector('.right-margin');
                const lMargin = block2Col.querySelector('.left-margin');
                const colWidth = rCol.offsetWidth || 272;
                let pageHasContent = false;

                ['right', 'left'].forEach((colName) => {
                    let targetCol = colName === 'right' ? rCol : lCol;
                    let targetMargin = colName === 'right' ? rMargin : lMargin;

                    while (tokenIndex < secTokens.length || pendingWordTokens) {
                        let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                        const curMode = currentTok.type.startsWith('h') ? headingModes[currentTok.level] : 'inline_2col';

                        if (curMode === 'span_1col' && !pendingWordTokens) break;

                        const currentAvailH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, block2Col);
                        if (targetCol.scrollHeight >= currentAvailH - 6 && targetCol.children.length > 0) break;

                        if (currentTok.type.startsWith('h')) {
                            if (currentTok.level === 3) currentH3Title = currentTok.text;
                            if (currentTok.level === 4) currentH4Title = currentTok.text;

                            const nextToks = secTokens.slice(tokenIndex + 1);
                            if (!canHeadingFitWithBody(targetCol, currentTok, nextToks, colWidth, styleObj, currentAvailH)) {
                                pageTrace.steps.push(`כותרת [${currentTok.id}] נדחתה מ-${colName} למניעת כותרת יתומה`);
                                break;
                            }

                            const hElem = document.createElement('div');
                            hElem.className = currentTok.customStyleId ? 'title-level-custom' : `title-level-${currentTok.level}`;
                            hElem.setAttribute('data-token-id', currentTok.id);
                            hElem.id = `heading-tok-${currentTok.id}`;
                            if (currentTok.customStyleId) {
                                const inst = findExtTextStyle(currentTok.customStyleId);
                                if (inst) renderCustomHeadingInto(hElem, inst, currentTok.text);
                                else hElem.textContent = currentTok.text;
                            } else {
                                hElem.textContent = currentTok.text;
                            }
                            applyDelimiterStyles(hElem, 'h' + currentTok.level, getHostSizePt(currentTok.level, currentTok.customStyleId), false);
                            targetCol.appendChild(hElem);

                            if (targetCol.scrollHeight > getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, block2Col) && targetCol.children.length > 1) {
                                targetCol.removeChild(hElem);
                                break;
                            }

                            pageTrace.tokensPlaced.push({ id: currentTok.id, type: currentTok.type, col: colName, text: currentTok.text });
                            if (!headingPageMap[currentTok.id]) {
                                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                            }
                            tokenIndex++;
                            continue;
                        }

                        if (currentTok.type === 'p') {
                            let linesInfo = getLinesFromParagraph(currentTok.text, colWidth, styleObj, true);
                            let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                            let isContinuation = pendingWordTokens ? (pendingWordTokens.remainingLines.length < linesInfo.lines.length) : false;
                            let hasWindow = isContinuation ? false : linesInfo.hasWindow;

                            const pElem = document.createElement('p');
                            pElem.setAttribute('data-token-id', currentTok.id);
                            pElem.setAttribute('data-is-cont', isContinuation ? 'true' : 'false');
                            if (currentTok.endNote) pElem.setAttribute('data-end-note', currentTok.endNote);
                            targetCol.appendChild(pElem);

                            if (currentTok.sideNote && !headingPageMap[currentTok.id]) {
                                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                            }

                            const fullRemainingText = lines.join(' ');
                            const pendingFnMatches = findDelimiterMatches(fullRemainingText, 'body').filter(m => m.inst.def.target === 'footnote');
                            let lastFnCount = -1;
                            let cachedAvailH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, block2Col);

                            let bestFitLine = 0;
                            for (let i = 1; i <= lines.length; i++) {
                                const testText = lines.slice(0, i).join(' ');
                                renderParagraphProbe(pElem, testText, isContinuation, hasWindow, lines.length, i === lines.length);

                                if (pendingFnMatches.length) {
                                    const newOnes = pendingFnMatches.filter(m => m.end <= testText.length);
                                    if (newOnes.length !== lastFnCount) {
                                        lastFnCount = newOnes.length;
                                        const extraQueue = newOnes.map((m, idx) => ({
                                            number: 'א', uid: 'probe' + idx, styleId: m.inst.instanceId,
                                            text: fullRemainingText.slice(m.start + m.inst.def.trigger.open.length, m.end - m.inst.def.trigger.close.length)
                                        }));
                                        cachedAvailH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, block2Col, extraQueue);
                                    }
                                }

                                if (targetCol.scrollHeight <= cachedAvailH) bestFitLine = i;
                                else break;
                            }

                            if (bestFitLine === 0) {
                                targetCol.removeChild(pElem);
                                if (targetCol.children.length > 0) {
                                    let lastEl = targetCol.lastElementChild;
                                    while (lastEl && (lastEl.className.startsWith('title-level-') || lastEl.classList.contains('title-level-custom'))) {
                                        targetCol.removeChild(lastEl);
                                        tokenIndex--;
                                        lastEl = targetCol.lastElementChild;
                                    }
                                }
                                break;
                            }

                            const refined = refineParagraphFitLine(lines, bestFitLine, pageHasContent, bestFitLine);
                            if (refined.forcePageBreak) {
                                targetCol.removeChild(pElem);
                                if (targetCol.children.length > 0) {
                                    let lastEl = targetCol.lastElementChild;
                                    while (lastEl && (lastEl.className.startsWith('title-level-') || lastEl.classList.contains('title-level-custom'))) {
                                        targetCol.removeChild(lastEl);
                                        tokenIndex--;
                                        lastEl = targetCol.lastElementChild;
                                    }
                                }
                                break;
                            }
                            bestFitLine = refined.fit;
                            bestFitLine = shrinkFitUntilFitsDry(pElem, targetCol, lines, bestFitLine, isContinuation, hasWindow, cachedAvailH);

                            if (bestFitLine <= 0) {
                                targetCol.removeChild(pElem);
                                break;
                            }

                            pageHasContent = true;
                            
                            // תיקון: משוך מילים מההמשך לשורה האחרונה כדי למנוע שורה דלילה
                            let chunkLines = lines.slice(0, bestFitLine);
                            let remainingLines = lines.slice(bestFitLine);
                            const isEndOfP = (bestFitLine === lines.length);
                            
                            pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                            pElem.setAttribute('data-raw-text', chunkLines.join(' '));
                            // פעולה 4 — כבד שורות KP עם <br> במסלול דו-טורי
                            if (_kpBrEnabled && linesInfo._fromKp && chunkLines.length > 1) {
                                pElem.innerHTML = chunkLines.map(l => escapeHTML(l)).join('<br>');
                            } else {
                                const chunk = chunkLines.join(' ');
                                pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow, lines.length);
                            }
                            applyDelimiterStyles(pElem, 'body', getBodySizePt(), false);

                            // תיקון קריטי: בדוק את השורה האחרונה בפועל אחרי הרינדור
                            // אם היא דלילה (פחות מ-50% מילוי או פחות מ-4 מילים),
                            // משוך מילים מההמשך ורנדר מחדש
                            if (!isEndOfP && remainingLines.length > 0) {
                                void pElem.offsetHeight; // אלץ reflow
                                var range = document.createRange();
                                range.selectNodeContents(pElem);
                                var rects = range.getClientRects();
                                console.log('[fill-last] p-cut rendered, rects=' + rects.length + ', remaining=' + remainingLines.length);
                                if (rects.length >= 2) {
                                    var colRect = targetCol.getBoundingClientRect();
                                    var lastRect = rects[rects.length - 1];
                                    var lastWidth = lastRect.right - colRect.left;
                                    var fillPct = colRect.width > 0 ? lastWidth / colRect.width : 1;
                                    var lastText = chunkLines[chunkLines.length - 1] || '';
                                    var lastWords = lastText.trim().split(/\s+/).filter(function(w) { return w.length > 0; });
                                    console.log('[fill-last] fillPct=' + Math.round(fillPct*100) + '% lastWords=' + lastWords.length + ' lastText="' + lastText.substring(0,40) + '"');
                                    
                                    if (fillPct < 0.5 || lastWords.length < 4) {
                                        // השורה האחרונה דלילה — נסה למשוך מילים מההמשך
                                        var fullText = chunkLines.join(' ') + ' ' + remainingLines.join(' ');
                                        var allWords = fullText.split(/\s+/).filter(function(w) { return w.length > 0; });
                                        var chunkWords = chunkLines.join(' ').split(/\s+/).filter(function(w) { return w.length > 0; });
                                        var nextWords = remainingLines.join(' ').split(/\s+/).filter(function(w) { return w.length > 0; });
                                        
                                        // נסה למשוך עד 5 מילים מההמשך
                                        var pulled = 0;
                                        var newChunkWords = chunkWords.slice();
                                        var newNextWords = nextWords.slice();
                                        while (newNextWords.length > 0 && pulled < 5) {
                                            newChunkWords.push(newNextWords[0]);
                                            newNextWords = newNextWords.slice(1);
                                            pulled++;
                                            // בדוק אם עדיין נכנס בגובה הזמין
                                            var testText = newChunkWords.join(' ');
                                            renderParagraphProbe(pElem, testText, isContinuation, hasWindow, lines.length, false);
                                            if (targetCol.scrollHeight > cachedAvailH) {
                                                // יותר מדי — החזר את המילה האחרונה
                                                newNextWords.unshift(newChunkWords.pop());
                                                pulled--;
                                                break;
                                            }
                                        }
                                        
                                        if (pulled > 0) {
                                            var newChunkText = newChunkWords.join(' ');
                                            pElem.setAttribute('data-raw-text', newChunkText);
                                            pElem.innerHTML = createDropWord(newChunkText, isContinuation, !hasWindow, lines.length);
                                            applyDelimiterStyles(pElem, 'body', getBodySizePt(), false);
                                            remainingLines = newNextWords.length > 0 ? [newNextWords.join(' ')] : [];
                                        }
                                    }
                                }
                            }

                            pageTrace.tokensPlaced.push({ id: currentTok.id, type: 'p', col: colName, linesPlaced: bestFitLine, totalLines: lines.length, isEndOfP });

                            if (targetCol.scrollHeight > getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, block2Col)) {
                                targetCol.removeChild(pElem);
                                if (targetCol.children.length > 0) {
                                    let lastEl = targetCol.lastElementChild;
                                    while (lastEl && (lastEl.className.startsWith('title-level-') || lastEl.classList.contains('title-level-custom'))) {
                                        targetCol.removeChild(lastEl);
                                        tokenIndex--;
                                        lastEl = targetCol.lastElementChild;
                                    }
                                }
                                break;
                            }

                            if (currentTok.endNote && isEndOfP) {
                                const marker = createNoteMarkerAndQueue(currentTok.endNote, null, 'endnote');
                                pElem.appendChild(marker);
                            }

                            if (!isContinuation && currentTok.sideNote) {
                                pElem.setAttribute('data-side-note', currentTok.sideNote);
                                if (currentTok.sideNoteStyleId) pElem.setAttribute('data-note-style-id', currentTok.sideNoteStyleId);
                                const noteElem = document.createElement('div');
                                noteElem.className = 'side-note-anchor';
                                noteElem.textContent = currentTok.sideNote;
                                if (currentTok.sideNoteStyleId) {
                                    const inst = findExtTextStyle(currentTok.sideNoteStyleId);
                                    if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
                                }
                                targetMargin.appendChild(noteElem);
                                pagePendingNotes.push({ elem: noteElem, pElem: pElem });
                            }

                            if (isEndOfP) {
                                pendingWordTokens = null;
                                tokenIndex++;
                            } else {
                                pendingWordTokens = {
                                    token: currentTok,
                                    remainingLines: remainingLines
                                };
                                break;
                            }
                        }
                    }
                });

                if (rCol.children.length === 0 && lCol.children.length === 0) {
                    if (blockNoteSnapshot) {
                        footnoteQueueForPage.length = blockNoteSnapshot.footnoteQueueLen;
                        endnoteQueueForPart.length = blockNoteSnapshot.endnoteQueueLen;
                        noteCounters.footnote = blockNoteSnapshot.footnoteCounter;
                        noteCounters.endnote = blockNoteSnapshot.endnoteCounter;
                        noteUidCounter = blockNoteSnapshot.noteUid;
                    }
                    pageLayout.bodyFlow.removeChild(block2Col);
                    let lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                    while (lastFlowEl && lastFlowEl.classList.contains('block-h3-span')) {
                        pageLayout.bodyFlow.removeChild(lastFlowEl);
                        tokenIndex--;
                        lastFlowEl = pageLayout.bodyFlow.lastElementChild;
                    }
                    break;
                }

                let actualAvailH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, block2Col);
                let didBalance = false;
                const sectionEnd = tokenIndex >= secTokens.length && !pendingWordTokens;

                // Feature flag: אם מופעל, נשתמש ב-balanceColumnsV2 החדש שמבוסס על
                // חישוב מועמדים לפני רינדור. הדגל נשלט ע"י המשתמש דרך:
                //   window.__useBalanceV2 = true
                // ומופעל אוטומטית כשמופעל layoutLinter.
                const useV2 = (typeof window.__useBalanceV2 === 'boolean' && window.__useBalanceV2) ||
                              (typeof window.__enableLayoutLinter === 'boolean' && window.__enableLayoutLinter);
                
                // FIX: הגדרת nextPeekTok לפני כל ה-branches — V2 וגם V1 משתמשים בו.
                const nextPeekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                const nextPeekMode = nextPeekTok && nextPeekTok.type.startsWith('h')
                    ? headingModes[nextPeekTok.level]
                    : 'inline_2col';
                const isNextSpan1Col = (nextPeekMode === 'span_1col') && !pendingWordTokens;
                
                if (useV2) {
                    // איסוף הטוקנים של הבלוק הנוכחי — כל מה שכבר עבר לטורים + הטוקן הנוכחי
                    // הערה: זוהי אינטגרציה זהירה — נקרא ל-V2 רק עבור sectionEnd ו-span_1col,
                    // לא עבור כל בלוק (כי ה-V2 דורש רשימת טוקנים מלאה).
                    if (sectionEnd || isNextSpan1Col) {
                        try {
                            // איסוף טוקנים: מה שכבר נכנס ל-block + הטוקן הנוכחי והלאה
                            // למעשה, נבנה רשימת tokens מתוך מה שכבר ב-DOM (ע"י data-token-id)
                            const collectedTokens = [];
                            const allPElems = block2Col.querySelectorAll('p[data-token-id]');
                            const allHElems = block2Col.querySelectorAll('[data-token-id]:not(p)');
                            for (const p of allPElems) {
                                const id = parseInt(p.getAttribute('data-token-id'), 10);
                                const rawText = p.getAttribute('data-raw-text') || p.textContent;
                                const tok = secTokens.find(t => t.id === id);
                                if (tok) collectedTokens.push(tok);
                            }
                            for (const h of allHElems) {
                                const id = parseInt(h.getAttribute('data-token-id'), 10);
                                const tok = secTokens.find(t => t.id === id);
                                if (tok) collectedTokens.push(tok);
                            }
                            
                            const footnoteReserve = (typeof measureFootnoteAreaReserve === 'function') 
                                ? measureFootnoteAreaReserve(footnoteQueueForPage, pageLayout.page)
                                : 0;
                            
                            const result = balanceColumnsV2(
                                block2Col, colWidth, styleObj, collectedTokens, pendingWordTokens,
                                actualAvailH, footnoteReserve
                            );
                            didBalance = result.didBalance;
                            if (result.pendingWordTokens) {
                                pendingWordTokens = result.pendingWordTokens;
                            }
                            // FIX: אחרי ש-V2 רינדר את הבלוק, הלולאה הפנימית חייבת לצאת.
                            // אחרת, הלולאה תמשיך להוסיף פריטים לבלוק שכבר רונדר — וזה יוצר כפילות.
                            if (didBalance) {
                                break;
                            }
                        } catch (e) {
                            console.warn('balanceColumnsV2 failed, falling back to V1:', e);
                            balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, pageTrace);
                            didBalance = true;
                        }
                    } else if (rCol.scrollHeight > actualAvailH || Math.abs(rCol.scrollHeight - lCol.scrollHeight) > 50) {
                        // מצב שוטף — V1 בינתיים (V2 דורש רשימת טוקנים מלאה)
                        balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, pageTrace);
                        didBalance = true;
                    }
                } else if (sectionEnd) {
                    balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, pageTrace);
                    didBalance = true;
                } else {
                    // FIX: nextPeekTok ו-nextPeekMode כבר הוגדרו למעלה — נשתמש בהם.
                    if (isNextSpan1Col) {
                        balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, pageTrace);
                        didBalance = true;
                    } else if (rCol.scrollHeight > actualAvailH || Math.abs(rCol.scrollHeight - lCol.scrollHeight) > 50) {
                        balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, pageTrace);
                        didBalance = true;
                    }
                }

                // PushBack במקרה של חריגה אמיתית מתקציב הדף
                // תיקון: במקום להסיר פסקה שלמה, ננסה קודם להסיר שורה אחת מהפסקה האחרונה.
                // רק אם הפסקה מכילה שורה אחת בלבד (או שהסרת שורה לא מספיקה) — נסיר את כל הפסקה.
                actualAvailH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, block2Col);
                let pushBackGuard = 0; // מניעת לולאה אינסופית
                while ((rCol.scrollHeight > actualAvailH + 2 || lCol.scrollHeight > actualAvailH + 2) && (rCol.children.length + lCol.children.length > 1) && pushBackGuard < 200) {
                    pushBackGuard++;
                    const popCol = lCol.children.length > 0 ? lCol : rCol;
                    const poppedChild = popCol.lastElementChild;
                    if (!poppedChild) break;

                    const pId = poppedChild.getAttribute('data-token-id');
                    if (poppedChild.tagName === 'P') {
                        const rawPText = poppedChild.getAttribute('data-raw-text') || '';
                        const linesInfo = getLinesFromParagraph(rawPText, colWidth, styleObj, false);
                        const pLineCount = linesInfo.lines.length;

                        // תיקון PushBack חכם: אם הפסקה מכילה יותר משורה אחת,
                        // נסה להסיר רק שורה אחת מהסוף לפני הסרת כל הפסקה.
                        if (pLineCount > 1) {
                            // בדוק כמה שורות גולשות מעבר לתקציב
                            const overflowPx = Math.max(0, popCol.scrollHeight - actualAvailH);
                            // אומדן גס: גובה שורה אחת ≈ lineHeight * fontSize
                            const styleLineHeight = parseFloat(styleObj.lineHeight) || 1.34;
                            const styleFontSize = parseFloat(styleObj.fontSize) || 11;
                            const oneLinePx = styleLineHeight * styleFontSize * 1.333; // pt → px
                            const linesToRemove = Math.max(1, Math.ceil(overflowPx / oneLinePx));

                            // אם צריך להסיר פחות שורות ממספר השורות בפסקה — נסיר רק את השורות הדרושות
                            if (linesToRemove < pLineCount) {
                                const linesToKeep = linesInfo.lines.slice(0, pLineCount - linesToRemove);
                                const linesToRemoveArr = linesInfo.lines.slice(pLineCount - linesToRemove);

                                // עדכן את הפסקה במקום (השאר רק את השורות שנשארות)
                                if (linesToKeep.length > 0) {
                                    const newText = linesToKeep.join(' ');
                                    poppedChild.setAttribute('data-raw-text', newText);
                                    // רנדר מחדש את הפסקה עם הטקסט המקוצר
                                    const isCont = poppedChild.getAttribute('data-is-cont') === 'true';
                                    const newLinesInfo = getLinesFromParagraph(newText, colWidth, styleObj, !isCont);
                                    const isSingleLine = newLinesInfo.lines.length <= 1;
                                    poppedChild.innerHTML = createDropWord(newText, isCont, isSingleLine, newLinesInfo.lines.length);
                                    applyDelimiterStyles(poppedChild, 'body', getBodySizePt(), false);

                                    // העבר את השורות שהוסרו ל-pendingWordTokens
                                    if (pendingWordTokens && pendingWordTokens.token.id === parseInt(pId, 10)) {
                                        pendingWordTokens.remainingLines = linesToRemoveArr.concat(pendingWordTokens.remainingLines);
                                    } else {
                                        const tokObj = secTokens.find(t => t.id === parseInt(pId, 10));
                                        if (tokObj) {
                                            pendingWordTokens = {
                                                token: tokObj,
                                                remainingLines: linesToRemoveArr
                                            };
                                        }
                                    }
                                    pageTrace.steps.push(`בוצע PushBack חלקי — הוסרו ${linesToRemove} שורות מפסקה [${pId}] (מתוך ${pLineCount}) עקב חריגה (${actualAvailH}px)`);
                                } else {
                                    // כל השורות הוסרו — מחק את הפסקה
                                    if (pendingWordTokens && pendingWordTokens.token.id === parseInt(pId, 10)) {
                                        pendingWordTokens.remainingLines = linesInfo.lines.concat(pendingWordTokens.remainingLines);
                                    } else {
                                        const tokObj = secTokens.find(t => t.id === parseInt(pId, 10));
                                        if (tokObj) {
                                            pendingWordTokens = {
                                                token: tokObj,
                                                remainingLines: linesInfo.lines
                                            };
                                        }
                                    }
                                    popCol.removeChild(poppedChild);
                                    pageTrace.steps.push(`בוצע PushBack מלא לפסקה [${pId}] (${pLineCount} שורות) עקב חריגה (${actualAvailH}px)`);
                                }
                            } else {
                                // צריך להסיר יותר שורות ממה שיש — הסר את כל הפסקה
                                if (pendingWordTokens && pendingWordTokens.token.id === parseInt(pId, 10)) {
                                    pendingWordTokens.remainingLines = linesInfo.lines.concat(pendingWordTokens.remainingLines);
                                } else {
                                    const tokObj = secTokens.find(t => t.id === parseInt(pId, 10));
                                    if (tokObj) {
                                        pendingWordTokens = {
                                            token: tokObj,
                                            remainingLines: linesInfo.lines
                                        };
                                    }
                                }
                                popCol.removeChild(poppedChild);
                                pageTrace.steps.push(`בוצע PushBack מלא לפסקה [${pId}] (${pLineCount} שורות) עקב חריגה גדולה (${actualAvailH}px)`);
                            }
                        } else {
                            // פסקה בעלת שורה אחת — הסר אותה כולה
                            if (pendingWordTokens && pendingWordTokens.token.id === parseInt(pId, 10)) {
                                pendingWordTokens.remainingLines = linesInfo.lines.concat(pendingWordTokens.remainingLines);
                            } else {
                                const tokObj = secTokens.find(t => t.id === parseInt(pId, 10));
                                if (tokObj) {
                                    pendingWordTokens = {
                                        token: tokObj,
                                        remainingLines: linesInfo.lines
                                    };
                                }
                            }
                            popCol.removeChild(poppedChild);
                            pageTrace.steps.push(`בוצע PushBack לפסקה חד-שורתית [${pId}] עקב חריגה (${actualAvailH}px)`);
                        }
                    } else {
                        tokenIndex--;
                        popCol.removeChild(poppedChild);
                        pageTrace.steps.push(`בוצע PushBack לכותרת [${pId}] עקב חריגה (${actualAvailH}px)`);
                    }
                    actualAvailH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, block2Col);
                    balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, pageTrace);
                }

                // הפעלת מנגנון נסיגה מפלתי על טור שמאל למניעת כותרות יתומות לאחר PushBack
                rollbackColumnTail(lCol, colWidth, styleObj, (rb) => {
                    if (rb.type === 'h') {
                        tokenIndex--;
                        pageTrace.steps.push(`הוסגה כותרת יתומה [${rb.id}] מתחתית טור שמאל לעמוד הבא`);
                    } else if (rb.type === 'p') {
                        if (pendingWordTokens && pendingWordTokens.token.id === parseInt(rb.id, 10)) {
                            pendingWordTokens.remainingLines = rb.linesInfo.lines.concat(pendingWordTokens.remainingLines);
                        } else {
                            const tokObj = secTokens.find(t => t.id === parseInt(rb.id, 10));
                            if (tokObj) {
                                pendingWordTokens = { token: tokObj, remainingLines: rb.linesInfo.lines };
                            }
                        }
                        pageTrace.steps.push(`הוסגה פסקה מקוטעת/יתומה [${rb.id}] מתחתית טור שמאל לעמוד הבא`);
                    }
                });

                // אם נותרה פסקה מקוטעת בטור שמאל עם המשך בעמוד הבא, נוודא שהיא מוגדרת כ-p-cut מתוחה
                if (lCol.lastElementChild && lCol.lastElementChild.tagName === 'P') {
                    const lastP = lCol.lastElementChild;
                    const lastPId = lastP.getAttribute('data-token-id');
                    if (pendingWordTokens && pendingWordTokens.token && String(pendingWordTokens.token.id) === lastPId) {
                        lastP.className = 'p-cut';
                    }
                }

                const blockUsedH = finalizeTwoColumnBlockLayout(
                    block2Col, pageLayout.bodyFlow, pageLayout.page, styleObj, colWidth, didBalance, pageTrace
                );
                finalizeNotePositions(pagePendingNotes, Math.min(blockUsedH, actualAvailH));

                // ==================================================================
                // תיקון: מניעת טורים ריקים/דלילים בסוף פרק או לפני כותרת 3
                // ==================================================================
                // אם הבלוק מכיל מעט פריטים (עד 2) ויש חוסר איזון קיצוני בין הטורים
                // (טור אחד קצר מאוד יחסית לשני), וזה לא תחילת עמוד חדש —
                // נדחוף את כל התוכן לעמוד הבא.
                // זה מונע מצב שבו יש פסקה אחת קצרה בטור אחד ופסקה ארוכה בטור השני.
                // ==================================================================
                const rItemCount = rCol.children.length;
                const lItemCount = lCol.children.length;
                const totalItems = rItemCount + lItemCount;
                const rH = rCol.scrollHeight;
                const lH = lCol.scrollHeight;
                const minColH = Math.min(rH, lH);
                const maxColH = Math.max(rH, lH);
                const hasPriorContent = pageLayout.bodyFlow.children.length > 1;

                // תנאים לדחיפה:
                // 1. יש כבר תוכן בעמוד (לא תחילת עמוד)
                // 2. יש מעט פריטים (עד 2) — זה מצב שלא ניתן לאזן
                // 3. הטור הקצר מאוד קצר (פחות מ-40% מהטור הארוך) — חוסר איזון קיצוני
                // 4. או שזה סוף פרק (sectionEnd) או שהבא הוא H3
                const _followingTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                const _followingMode = _followingTok && _followingTok.type.startsWith('h') ? headingModes[_followingTok.level] : 'inline_2col';
                const isBeforeH3 = (_followingMode === 'span_1col');
                const imbalanceRatio = maxColH > 0 ? minColH / maxColH : 1;
                const shouldPushToNextPage = hasPriorContent && totalItems <= 2 && imbalanceRatio < 0.4 && (sectionEnd || isBeforeH3);

                if (shouldPushToNextPage) {
                    // אסוף את כל הטוקנים מהבלוק והחזר אותם ל-pendingWordTokens
                    const allChildren = [...Array.from(rCol.children), ...Array.from(lCol.children)];
                    // בנה מחדש את pendingWordTokens עם כל התוכן
                    let collectedTokens = [];
                    for (const child of allChildren) {
                        const pId = child.getAttribute('data-token-id');
                        if (child.tagName === 'P') {
                            const rawPText = child.getAttribute('data-raw-text') || '';
                            const linesInfo = getLinesFromParagraph(rawPText, colWidth, styleObj, false);
                            const tokObj = secTokens.find(t => t.id === parseInt(pId, 10));
                            if (tokObj) {
                                if (pendingWordTokens && pendingWordTokens.token.id === parseInt(pId, 10)) {
                                    // כבר יש pending — הוסף לפניו
                                    pendingWordTokens.remainingLines = linesInfo.lines.concat(pendingWordTokens.remainingLines);
                                } else {
                                    collectedTokens.push({ tok: tokObj, lines: linesInfo.lines });
                                }
                            }
                        } else {
                            // כותרת — החזר אותה ל-tokenIndex
                            const tokObj = secTokens.find(t => t.id === parseInt(pId, 10));
                            if (tokObj) {
                                const tIdx = secTokens.indexOf(tokObj);
                                if (tIdx >= 0 && tIdx < tokenIndex) tokenIndex = tIdx;
                            }
                        }
                    }
                    // אם אספנו טוקנים שאינם pending, צור pending חדש מהראשון
                    if (collectedTokens.length > 0 && !pendingWordTokens) {
                        pendingWordTokens = {
                            token: collectedTokens[0].tok,
                            remainingLines: collectedTokens[0].lines
                        };
                        // אם יש יותר מאחד, נדרש להחזיר את האחרים ל-tokenIndex
                        for (let i = 1; i < collectedTokens.length; i++) {
                            const tIdx = secTokens.indexOf(collectedTokens[i].tok);
                            if (tIdx >= 0 && tIdx < tokenIndex) tokenIndex = tIdx;
                        }
                    }
                    // הסר את הבלוק
                    pageLayout.bodyFlow.removeChild(block2Col);
                    pageTrace.steps.push(`בוצע דחיפת בלוק לא מאוזן לעמוד הבא (${totalItems} פריטים, יחס איזון ${Math.round(imbalanceRatio * 100)}%, ${sectionEnd ? 'סוף פרק' : 'לפני H3'})`);
                    break;
                }

                if (sectionEnd) {
                    const divHTML = getSectionDividerHTML(secDivStyle);
                    if (divHTML) {
                        const divContainer = document.createElement('div');
                        divContainer.innerHTML = divHTML;
                        pageLayout.bodyFlow.appendChild(divContainer.firstElementChild);
                    }
                    break;
                }

                // מניעת יצירת בלוק כפול עוקב באותו עמוד ללא כותרת רוחבית מפרידה
                let followingTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                const followingMode = followingTok && followingTok.type.startsWith('h') ? headingModes[followingTok.level] : 'inline_2col';
                if (followingMode !== 'span_1col') {
                    break;
                }
            }

            pageTrace.domMetrics = {
                bodyFlowClientHeight: pageLayout.bodyFlow.clientHeight,
                bodyFlowScrollHeight: pageLayout.bodyFlow.scrollHeight,
                finalBudget: getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, null),
                footnotesQueuedCount: footnoteQueueForPage.length,
                footnotesHeightMeasured: getFootnotesReservedHeight()
            };
        }
    }

    if (prevPageEl) {
        flushFootnotesInto(prevPageEl);
        prevPageEl = null;
    }
    if (hasOpenPart) {
        flushEndnotesForPart(container, pageIndex);
        renderExtAnchor(container, 'endOfEachPart', rawText);
    } else if (endnoteQueueForPart.length) {
        flushEndnotesForPart(container, pageIndex);
    }
    renderExtAnchor(container, 'afterAll', rawText);

    document.querySelectorAll('.toc-page-num[data-target-id], .grp-page[data-target-id]').forEach(span => {
        const targetId = span.getAttribute('data-target-id');
        if (targetId && headingPageMap[targetId]) {
            span.textContent = headingPageMap[targetId];
        }
    });

    if (typeof updateEditorWithPageBreaks === 'function') {
        updateEditorWithPageBreaks(pageBreaks);
    }

    if (typeof updatePreviewScale === 'function') {
        updatePreviewScale();
    }

    if (typeof applyHeadingOrnamentTextFit === 'function') {
        applyHeadingOrnamentTextFit();
    }

    document.querySelectorAll('.block-2col').forEach(block => {
        const divider = block.querySelector('.col-gutter-divider');
        const rCol = block.querySelector('.right-col');
        const lCol = block.querySelector('.left-col');
        if (!divider || !rCol || !lCol) return;
        const minH = Math.min(rCol.scrollHeight, lCol.scrollHeight);
        divider.style.alignSelf = 'start';
        divider.style.height = minH + 'px';
    });
}

/* ==========================================================================
   12. מנוע הפקת דוח דיבאג עצמאי לעמוד (HTML Diagnostic Report Generator)
   ========================================================================== */
window.exportPageDebugReport = function(pageIndex) {
    const pageEl = document.querySelector(`.a4-page[data-page-index="${pageIndex}"]`);
    if (!pageEl) {
        alert('לא נמצא אלמנט עמוד עבור עמוד ' + pageIndex);
        return;
    }

    const trace = window.__pageDebugStore[pageIndex] || {
        pageIndex,
        pageRole: 'unknown',
        steps: ['אין נתוני טרייס מוקלטים'],
        tokensPlaced: []
    };

    const rCol = pageEl.querySelector('.right-col');
    const lCol = pageEl.querySelector('.left-col');
    const fnArea = pageEl.querySelector('.footnote-area');
    const bodyFlow = pageEl.querySelector('.page-body-flow');

    const domInspection = {
        rightCol: rCol ? {
            scrollHeight: rCol.scrollHeight,
            offsetHeight: rCol.offsetHeight,
            childrenCount: rCol.children.length,
            children: Array.from(rCol.children).map(c => ({
                tag: c.tagName,
                className: c.className,
                textSnippet: c.textContent.slice(0, 50),
                offsetHeight: c.offsetHeight,
                marginTop: window.getComputedStyle(c).marginTop,
                marginBottom: window.getComputedStyle(c).marginBottom,
                lineHeight: window.getComputedStyle(c).lineHeight
            }))
        } : null,
        leftCol: lCol ? {
            scrollHeight: lCol.scrollHeight,
            offsetHeight: lCol.offsetHeight,
            childrenCount: lCol.children.length,
            children: Array.from(lCol.children).map(c => ({
                tag: c.tagName,
                className: c.className,
                textSnippet: c.textContent.slice(0, 50),
                offsetHeight: c.offsetHeight,
                marginTop: window.getComputedStyle(c).marginTop,
                marginBottom: window.getComputedStyle(c).marginBottom,
                lineHeight: window.getComputedStyle(c).lineHeight
            }))
        } : null,
        footnoteArea: fnArea ? {
            offsetHeight: fnArea.offsetHeight,
            scrollHeight: fnArea.scrollHeight,
            notesCount: fnArea.querySelectorAll('.note-line').length
        } : null,
        bodyFlow: bodyFlow ? {
            clientHeight: bodyFlow.clientHeight,
            scrollHeight: bodyFlow.scrollHeight
        } : null
    };

    const warnings = [];
    if (rCol && lCol) {
        const diff = Math.abs(rCol.scrollHeight - lCol.scrollHeight);
        if (diff > 5) warnings.push(`⚠️ פער גובה בין הטורים: ${diff.toFixed(1)}px (ימין: ${rCol.scrollHeight}px, שמאל: ${lCol.scrollHeight}px)`);
    }
    if (bodyFlow && bodyFlow.scrollHeight > bodyFlow.clientHeight + 2) {
        warnings.push(`🚨 גלישת טקסט מעבר לגבול ה-Flow: גובה תכולה ${bodyFlow.scrollHeight}px לעומת גובה מותר ${bodyFlow.clientHeight}px`);
    }
    if (fnArea && bodyFlow) {
        const totalUsed = bodyFlow.offsetHeight + fnArea.offsetHeight + 40;
        if (totalUsed > 1009) warnings.push(`🚨 סכנת חפיפה עם הערות שוליים: סך הגובה (${totalUsed}px) חורג מגובה הדף (1009px)`);
    }

    const pageClone = pageEl.cloneNode(true);
    pageClone.querySelectorAll('.page-debug-btn').forEach(b => b.remove());
    const pageHTMLClean = pageClone.outerHTML;

    const reportHTML = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>דוח דיאגנוסטיקה ודיבאג — עמוד ${toGematria(pageIndex) || pageIndex}</title>
  <link rel="stylesheet" href="style.css">
  <style>
    body { background: #1e293b; color: #f8fafc; font-family: 'Assistant', sans-serif; padding: 20px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
    .diag-header { background: #0f172a; border: 1px solid #334155; padding: 15px 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
    .diag-title { font-size: 16pt; font-weight: 800; color: #38bdf8; }
    .diag-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .diag-card { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 15px; overflow: hidden; display: flex; flex-direction: column; }
    .diag-card h3 { color: #94a3b8; font-size: 11pt; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 10px; }
    .page-preview-box { background: #475569; padding: 20px; border-radius: 6px; display: flex; justify-content: center; overflow: auto; max-height: 800px; }
    .page-preview-box .a4-page { transform: scale(0.8); transform-origin: top center; margin-bottom: 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    pre { background: #020617; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; font-family: monospace; font-size: 8.5pt; color: #38bdf8; overflow-x: auto; max-height: 400px; }
    .warn-badge { background: #7f1d1d; border: 1px solid #ef4444; color: #fecaca; padding: 6px 12px; border-radius: 6px; font-size: 9pt; margin-bottom: 6px; font-weight: bold; }
    .ok-badge { background: #064e3b; border: 1px solid #10b981; color: #a7f3d0; padding: 6px 12px; border-radius: 6px; font-size: 9pt; margin-bottom: 6px; }
    .step-log-item { font-size: 8pt; padding: 4px 6px; border-bottom: 1px dashed #334155; color: #cbd5e1; }
    .btn-copy { background: #2563eb; color: #fff; border: none; padding: 6px 12px; border-radius: 5px; font-weight: bold; cursor: pointer; }
    .btn-copy:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="diag-header">
    <div>
      <div class="diag-title">🐛 דוח דיאגנוסטיקה לעימוד — עמוד ${toGematria(pageIndex) || pageIndex} (${pageIndex})</div>
      <div style="font-size:9pt; color:#94a3b8; margin-top:3px;">הופק אוטומטית ע"י מנוע העימוד | תפקיד: ${trace.pageRole}</div>
    </div>
    <button class="btn-copy" onclick="copyFullJSON()">📋 העתק JSON מלא</button>
  </div>

  ${warnings.length > 0 ? `<div>${warnings.map(w => `<div class="warn-badge">${w}</div>`).join('')}</div>` : `<div class="ok-badge">✅ לא זוהו חריגות גובה או שגיאות קריטיות בעמוד זה</div>`}

  <div class="diag-grid">
    <div class="diag-card">
      <h3>🖼️ תצוגה חיה של העמוד</h3>
      <div class="page-preview-box">
        ${pageHTMLClean}
      </div>
    </div>

    <div class="diag-card">
      <h3>📊 מדדי DOM ונתוני גובה מדויקים</h3>
      <pre id="json-dom">${JSON.stringify(domInspection, null, 2)}</pre>

      <h3 style="margin-top:15px;">📜 יומן שלבי עימוד (Trace Log)</h3>
      <div style="max-height:220px; overflow-y:auto; background:#020617; border-radius:6px; padding:6px;">
        ${trace.steps && trace.steps.length ? trace.steps.map(s => `<div class="step-log-item">🔹 ${s}</div>`).join('') : '<div class="step-log-item">אין שלבים מיוחדים מתועדים</div>'}
      </div>

      <h3 style="margin-top:15px;">⚖️ פירוט יישור ואיזון טורים (Justification & Balancing)</h3>
      <pre>${JSON.stringify({ balanceLog: trace.balanceLog, justificationLog: trace.justificationLog }, null, 2)}</pre>
    </div>
  </div>

  <div class="diag-card">
    <h3>📄 קוד ה-HTML של העמוד (OuterHTML)</h3>
    <pre>${pageHTMLClean.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>

  <script>
    const fullDebugPayload = {
      pageIndex: ${pageIndex},
      trace: ${JSON.stringify(trace).replace(/<\//g, '<\\/')},
      domInspection: ${JSON.stringify(domInspection).replace(/<\//g, '<\\/')},
      warnings: ${JSON.stringify(warnings).replace(/<\//g, '<\\/')}
    };

    function copyFullJSON() {
      navigator.clipboard.writeText(JSON.stringify(fullDebugPayload, null, 2)).then(() => {
        alert('נתוני הדיבאג הועתקו ללוח בהצלחה!');
      });
    }
  <\/script>
</body>
</html>`;

    const blob = new Blob([reportHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-page-${pageIndex}.html`;
    a.click();
    URL.revokeObjectURL(url);
};

/* ==========================================================================
   API גלובלי לשליטה במערכת החדשה (שלבים א'-ו')
   ========================================================================== */

// הפעלת מנוע האיזון החדש (V2)
window.__useBalanceV2 = false;

// הפעלת לינטר החלטות העימוד
window.__enableLayoutLinter = false;

// איפוס יומן ההחלטות
window.__resetLayoutDecisionsLog = function() {
    if (window.__layoutDecisionsLog) window.__layoutDecisionsLog.length = 0;
    if (typeof layoutLinter !== 'undefined') layoutLinter.clear();
};

// הפקת דוח HTML מלא של החלטות העימוד
window.exportLayoutDecisionsReport = function() {
    if (typeof layoutLinter === 'undefined') {
        alert('לינטר החלטות העימוד אינו זמין.');
        return;
    }
    
    // מילוי ה-linter מתוך __layoutDecisionsLog
    if (window.__layoutDecisionsLog && window.__layoutDecisionsLog.length > 0) {
        layoutLinter.clear();
        for (const entry of window.__layoutDecisionsLog) {
            layoutLinter.reports.push({
                blockId: entry.blockId,
                timestamp: Date.now(),
                chosen: {
                    splitPoint: entry.chosenSplitPoint,
                    score: entry.score || 0,
                    heights: entry.heights || { right: 0, left: 0 },
                    overflow: { right: 0, left: 0 },
                    quality: entry.quality || {},
                },
                alternatives: entry.alternatives || [],
                issues: [],
                recommendations: [],
            });
        }
    }
    
    const html = layoutLinter.getReportHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `layout-decisions-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
};

// הפעלה מהירה של כל המערכת החדשה
window.enableNewLayoutEngine = function() {
    window.__useBalanceV2 = true;
    window.__enableLayoutLinter = true;
    window.__resetLayoutDecisionsLog();
    console.log('✓ מנוע העימוד החדש הופעל. יש ללחוץ על "עדכן ועמד מחדש" כדי לראות את התוצאות.');
    console.log('  • window.__useBalanceV2 =', window.__useBalanceV2);
    console.log('  • window.__enableLayoutLinter =', window.__enableLayoutLinter);
    console.log('  • אחרי העימוד: window.exportLayoutDecisionsReport() להפקת דוח');
};

// כיבוי המערכת החדשה (חזרה ל-V1)
window.disableNewLayoutEngine = function() {
    window.__useBalanceV2 = false;
    window.__enableLayoutLinter = false;
    console.log('✗ מנוע העימוד החדש כבוי. משתמש ב-V1.');
};

// הפעלת reflow יזום על כל העמודים
window.triggerGlobalReflow = function() {
    if (typeof layoutInvalidator === 'undefined') {
        alert('מנגנון ה-reflow אינו זמין.');
        return;
    }
    layoutInvalidator.invalidateFromTokenIdx(0);
    console.log('✓ reflow גלובלי הופעל.');
};

console.log('📊 מערכת העימוד החדשה נטענה. פקודות זמינות:');
console.log('  • window.enableNewLayoutEngine() — הפעלת V2 + linter');
console.log('  • window.disableNewLayoutEngine() — חזרה ל-V1');
console.log('  • window.exportLayoutDecisionsReport() — הפקת דוח החלטות');
console.log('  • window.triggerGlobalReflow() — reflow יזום');

