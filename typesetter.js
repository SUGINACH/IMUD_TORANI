/* ==========================================================================
   typesetter.js - מנוע העימוד המרכזי לדפי A4
   חלק א' מתוך ג': משתנים, פונקציות יסוד, שבירת שורות דינמית ומבנה עמוד
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

/* ==========================================================================
   סינון הערות עריכה (##...##) מהמסמך
   ========================================================================== */
function stripEditorialNotes(text) {
    if (!text || typeof text !== 'string')
        return text || '';
    return text.replace(/##[\s\S]*?##/g, '').replace(/[ \t]{2,}/g, ' ').replace(/\s+([,.:;!?])/g, '$1').trim();
}

/* מספור עמודים משותף - כדי ששער משנה (אם יוגדר להציג מספר) ישתמש
   באותו פורמט/מסגרת/עמוד-התחלה בדיוק כמו עמודי תוכן רגילים */
function formatPageNumberDisplay(pNum) {
    const pageNumPos = document.getElementById('page-num-position')?.value || 'bottom_center';
    const pageNumFormat = document.getElementById('page-num-format')?.value || 'gematria';
    const pageNumFrame = document.getElementById('page-num-frame')?.value || 'none';
    const startIdx = parseInt(document.getElementById('page-num-start-idx')?.value, 10) || 1;

    let displayPageNum = '';
    if (pageNumPos !== 'none' && pNum >= startIdx) {
        const effectiveNum = pNum - startIdx + 1;
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

function toGematria(num) {
    num = parseInt(num, 10);
    if (isNaN(num) || num <= 0)
        return "";
    if (num === 15)
        return "טו";
    if (num === 16)
        return "טז";
    const hundreds = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];
    const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
    const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
    let str = "";
    let h = Math.floor(num / 100);
    if (h > 0) {
        if (h <= 4)
            str += ["", "ק", "ר", "ש", "ת"][h];
        else if (h < hundreds.length)
            str += hundreds[h];
        num %= 100;
    }
    let t = Math.floor(num / 10);
    let o = num % 10;
    if (t === 1 && (o === 5 || o === 6)) {
        str += (o === 5) ? "טו" : "טז";
    } else {
        str += tens[t] + ones[o];
    }
    return str;
}

function toGematriaWithGeresh(num) {
    const raw = toGematria(num);
    if (!raw) return "";
    if (raw.length === 1) return raw + "'";
    return raw.slice(0, -1) + '"' + raw.slice(-1);
}

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

/* משתני הגופן והגודל של טקסטי השערים בלבד */
function updateCoverStyles() {
    const root = document.documentElement;
    root.style.setProperty('--fn-sh-title', document.getElementById('f-sh-title')?.value || 'serif');
    root.style.setProperty('--sz-sh-title', (document.getElementById('s-sh-title')?.value || 46) + 'pt');
    root.style.setProperty('--fn-sh-sub', document.getElementById('f-sh-sub')?.value || 'serif');
    root.style.setProperty('--sz-sh-sub', (document.getElementById('s-sh-sub')?.value || 21) + 'pt');
    root.style.setProperty('--fn-sh-desc', document.getElementById('f-sh-desc')?.value || 'serif');
    root.style.setProperty('--sz-sh-desc', (document.getElementById('s-sh-desc')?.value || 12) + 'pt');
    root.style.setProperty('--fn-sh-sec', document.getElementById('f-sh-sec')?.value || 'serif');
    root.style.setProperty('--sz-sh-sec', (document.getElementById('s-sh-sec')?.value || 11.5) + 'pt');
    root.style.setProperty('--fn-sh-author', document.getElementById('f-sh-author')?.value || 'serif');
    root.style.setProperty('--sz-sh-author', (document.getElementById('s-sh-author')?.value || 15) + 'pt');
    root.style.setProperty('--fn-sh-year', document.getElementById('f-sh-year')?.value || 'serif');
    root.style.setProperty('--sz-sh-year', (document.getElementById('s-sh-year')?.value || 12) + 'pt');
}

function updateStyles() {
    const root = document.documentElement;
    
    // רוחב חלקי כותרת עליונה
    root.style.setProperty('--hdr-w-r', document.getElementById('hdr-w-r')?.value || '33.33%');
    root.style.setProperty('--hdr-w-c', document.getElementById('hdr-w-c')?.value || '33.34%');
    root.style.setProperty('--hdr-w-l', document.getElementById('hdr-w-l')?.value || '33.33%');

    // גופני כותרת עליונה
    root.style.setProperty('--fn-header-r', document.getElementById('f-hdr-r')?.value || 'serif');
    root.style.setProperty('--sz-header-r', (document.getElementById('s-hdr-r')?.value || 13) + 'pt');
    root.style.setProperty('--fn-header-c', document.getElementById('f-hdr-c')?.value || 'serif');
    root.style.setProperty('--sz-header-c', (document.getElementById('s-hdr-c')?.value || 11) + 'pt');
    root.style.setProperty('--fn-header-l', document.getElementById('f-hdr-l')?.value || 'serif');
    root.style.setProperty('--sz-header-l', (document.getElementById('s-hdr-l')?.value || 13) + 'pt');

    // קו מפריד בין הכותרת העליונה לגוף הטקסט
    const hdrDividerMode = document.getElementById('hdr-divider-style')?.value || 'gray';
    const hdrDividerColorMap = { none: 'transparent', gray: 'rgba(0,0,0,0.06)', black: '#000' };
    root.style.setProperty('--hdr-divider-color', hdrDividerColorMap[hdrDividerMode] || hdrDividerColorMap.gray);

    // כותרות 0 עד 7
    root.style.setProperty('--fn-h0', document.getElementById('f-h0')?.value || 'serif');
    root.style.setProperty('--sz-h0', (document.getElementById('s-h0')?.value || 26) + 'pt');
    root.style.setProperty('--fn-h0-body', document.getElementById('f-h0-body')?.value || 'serif');
    root.style.setProperty('--sz-h0-body', (document.getElementById('s-h0-body')?.value || 11.5) + 'pt');

    root.style.setProperty('--fn-h1', document.getElementById('f-h1')?.value || 'serif');
    root.style.setProperty('--sz-h1', (document.getElementById('s-h1')?.value || 50) + 'pt');
    
    root.style.setProperty('--fn-h2', document.getElementById('f-h2')?.value || 'serif');
    root.style.setProperty('--sz-h2', (document.getElementById('s-h2')?.value || 17) + 'pt');
    root.style.setProperty('--h2-top-distance', document.getElementById('h2-top-distance')?.value || '22%');

    const fSiman = document.getElementById('f-siman')?.value;
    const sSiman = document.getElementById('s-siman')?.value;
    if (fSiman) root.style.setProperty('--fn-siman', fSiman);
    if (sSiman) root.style.setProperty('--sz-siman', sSiman + 'pt');

    root.style.setProperty('--fn-h3', document.getElementById('f-h3')?.value || 'serif');
    root.style.setProperty('--sz-h3', (document.getElementById('s-h3')?.value || 13.5) + 'pt');
    root.style.setProperty('--fn-h4', document.getElementById('f-h4')?.value || 'serif');
    root.style.setProperty('--sz-h4', (document.getElementById('s-h4')?.value || 12.5) + 'pt');
    root.style.setProperty('--fn-h5', document.getElementById('f-h5')?.value || 'serif');
    root.style.setProperty('--sz-h5', (document.getElementById('s-h5')?.value || 11.5) + 'pt');
    root.style.setProperty('--fn-h6', document.getElementById('f-h6')?.value || 'serif');
    root.style.setProperty('--sz-h6', (document.getElementById('s-h6')?.value || 10.5) + 'pt');
    root.style.setProperty('--fn-h7', document.getElementById('f-h7')?.value || 'serif');
    root.style.setProperty('--sz-h7', (document.getElementById('s-h7')?.value || 6) + 'pt');

    // שערים (פונקציה נפרדת - מתעדכנת גם בעדכון חי של שער, בלי לגעת במשתני העימוד האחרים)
    updateCoverStyles();

    // גוף הטקסט, מילה ראשונה וריווח שורות
    root.style.setProperty('--fn-body', document.getElementById('font-body')?.value || 'serif');
    root.style.setProperty('--sz-body', (document.getElementById('size-body')?.value || 11.2) + 'pt');
    root.style.setProperty('--line-height-body', document.getElementById('line-height-body')?.value || '1.34');
    root.style.setProperty('--fn-first-word', document.getElementById('font-first-word')?.value || 'serif');
    root.style.setProperty('--sz-first-word', (document.getElementById('size-first-word')?.value || 1.5) + 'em');

    // דיבור המתחיל
    const fDh = document.getElementById('f-dh')?.value;
    if (fDh) root.style.setProperty('--fn-dh', fDh);

    // כותרת הערות שוליים
    const fNoteTitle = document.getElementById('f-note-title')?.value;
    const sNoteTitle = document.getElementById('s-note-title')?.value;
    if (fNoteTitle) root.style.setProperty('--fn-note-title', fNoteTitle);
    if (sNoteTitle) root.style.setProperty('--sz-note-title', (sNoteTitle || 9) + 'pt');
}

/* ============================================================
   עיבוד דיבור המתחיל (ד"ה)
   ============================================================ */
/* [תיקון] פסקה שפותחת בכותרת מובלעת (run-in): הכותרת היא הפתיח של הפסקה - לא מוחלים עליה "מילה ראשונה" ולא "ד"ה" אוטומטי.
   (קודם הטקסט הגולמי של התגית <span class="heading-run-in ..."> פוצל לפי רווחים/מקפים והוצג כטקסט גולמי בעמוד) */
const RUN_IN_START_RE = /^\s*<span class="heading-run-in/;

function applyDibburHamatchil(text) {
    const isDhEnabled = document.getElementById('auto-dh')?.checked;
    if (!isDhEnabled || !text) return text;
    if (RUN_IN_START_RE.test(text)) return text;

    /* זיהוי פתיח עד נקודה או מקף/קו מפריד (הראשון בטקסט, ובתוך 80 התווים הראשונים).
       [תיקון] הסריקה מדלגת על תגיות HTML. קודם הביטוי הרגולרי רץ על ה-HTML שכבר כלל את תגית מילת הפתיחה,
       ומקף בשם המחלקה (first-word-window / first-word-bold / first-word-inline) נחשב "מפריד": התגית נחתכה באמצע,
       ה-HTML נשבר והפסקה כולה יצאה מודגשת בתוך תגית שבורה. כלומר "ד"ה אוטומטי" עבד רק כשמילת הפתיחה כבויה.
       גם הקינון נשמר: אם המפריד נפל בתוך אלמנט פתוח (מילת פתיחה כמו "א."), הפתיח מורחב עד סגירת האלמנט. */
    const isSep = (c) => c === '.' || c === '-' || c === '–' || c === '—';
    const stack = [];
    let vis = 0, sepIdx = -1;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '<' && /[A-Za-z\/!]/.test(text[i + 1] || '')) {
            const j = text.indexOf('>', i);
            if (j < 0) return text;
            const tag = text.slice(i, j + 1);
            if (tag[1] === '/') stack.pop();
            else if (tag[tag.length - 2] !== '/' && !/^<(br|hr|img|input|wbr)\b/i.test(tag)) stack.push(tag);
            i = j;
            continue;
        }
        vis++;
        if (isSep(ch)) { if (vis >= 2 && vis <= 81) sepIdx = i + 1; break; }
        if (vis > 81) break;
    }
    if (sepIdx < 0) return text;
    let end = sepIdx;
    // המפריד בתוך אלמנט פתוח: ממשיכים עד שכל התגיות שנפתחו לפניו נסגרות
    for (let i = sepIdx; stack.length && i < text.length; i++) {
        if (text[i] === '<' && /[A-Za-z\/!]/.test(text[i + 1] || '')) {
            const j = text.indexOf('>', i);
            if (j < 0) return text;
            const tag = text.slice(i, j + 1);
            if (tag[1] === '/') stack.pop();
            else if (tag[tag.length - 2] !== '/' && !/^<(br|hr|img|input|wbr)\b/i.test(tag)) stack.push(tag);
            i = j;
            end = j + 1;
        }
    }
    if (stack.length) return text;   // HTML לא מאוזן - לא נוגעים
    return `<span class="dibbur-hamatchil">${text.slice(0, end)}</span> ${text.slice(end).replace(/^\s+/, '')}`;
}

/* ==========================================================================
   פיצול טקסט ל"מילים" למדידה ולחיתוך שורות.
   גוף של הערת שוליים/סיום (מה שבין תוחמי ההערה) נחשב יחידה אטומית יחד עם המילה שלפניו.
   [תיקון באג שאותר בהרצה אמיתית] בלי זה, הערה שנפרשה על כמה שורות נחתכה באמצע בין שני
   קטעי פסקה (גם הגובה נמדד כאילו גוף ההערה יושב בתוך הפסקה), ובתצוגה הסופית נשפך
   לגוף הטקסט גוף ההערה עם סוגריים גולמיים.
   מחזיר מערך של {raw, html}: raw = הטקסט המקורי (לחיבור חזרה לשורות),
   html = מה שנמדד בפועל (סימון הערה זעיר במקום גוף ההערה, כמו בתצוגה הסופית).
   ========================================================================== */
function getDummyNoteMarkerHTML() {
    const dm = document.createElement('a');
    dm.className = 'note-marker';
    dm.textContent = 'א';
    applyNoteMarkerStyle(dm, false);
    return dm.outerHTML;
}

/* פיצול לפי רווחים שמחוץ לתגיות HTML (כדי שתגית כמו <span class="..."> לא תיחתך באמצע). בטקסט בלי תגיות - פיצול רגיל. */
function splitWordsKeepingTags(text) {
    if (text.indexOf('<') < 0) return text.split(/\s+/);
    const out = [];
    let cur = '', inTag = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (!inTag && ch === '<' && /[A-Za-z\/!]/.test(text[i + 1] || '')) inTag = true;
        else if (inTag && ch === '>') inTag = false;
        if (!inTag && /\s/.test(ch)) { if (cur) { out.push(cur); cur = ''; } continue; }
        cur += ch;
    }
    if (cur) out.push(cur);
    return out;
}

function splitIntoMeasureWords(text) {
    text = (text || '').trim();
    if (!text) return [];
    const matches = findDelimiterMatches(text, 'body').filter(m => m.inst.def.target === 'footnote' || m.inst.def.target === 'endnote');
    if (!matches.length) return splitWordsKeepingTags(text).map(w => ({ raw: w, html: w }));

    const dummy = getDummyNoteMarkerHTML();
    const units = [];
    let cur = null;
    let i = 0, mi = 0;
    let inTag = false;   // בתוך תגית HTML (למשל <span class="...">) - רווחים שם אינם גבול מילה
    const flush = () => { if (cur && cur.raw) units.push(cur); cur = null; };
    while (i < text.length) {
        const m = matches[mi];
        if (m && i === m.start) {
            if (!cur) cur = { raw: '', html: '' };
            cur.raw += text.slice(m.start, m.end);
            cur.html += dummy;
            i = m.end;
            mi++;
            continue;
        }
        const ch = text[i];
        if (!inTag && ch === '<' && /[A-Za-z\/!]/.test(text[i + 1] || '')) inTag = true;
        else if (inTag && ch === '>') inTag = false;
        if (!inTag && /\s/.test(ch)) {
            // רווח שאחריו מיד גוף הערה: ההערה נדבקת למילה שלפניה (כך גם מוצגת בפועל)
            let j = i;
            while (j < text.length && /\s/.test(text[j])) j++;
            if (cur && matches[mi] && matches[mi].start === j) {
                cur.raw += text.slice(i, j);
                i = j;
                continue;
            }
            flush();
            i++;
            continue;
        }
        if (!cur) cur = { raw: '', html: '' };
        cur.raw += ch;
        cur.html += ch;
        i++;
    }
    flush();
    return units;
}

/* ============================================================
   עיבוד מילה ראשונה (חלון / מוגדל / מודגש)
   ============================================================ */
function createDropWord(text, isContinuation, isSingleLine, numLines = 2) {
    if (isContinuation) return text;
    text = text.trim();
    if (!text) return '';
    if (RUN_IN_START_RE.test(text)) return text;   // כותרת מובלעת היא הפתיח - בלי עיצוב מילה ראשונה

    const mode = document.getElementById('drop-word-mode')?.value || 'window';
    if (mode === 'none') {
        return applyDibburHamatchil(text);
    }

    const wordCount = parseInt(document.getElementById('drop-word-count')?.value, 10) || 1;
    const minLines = parseInt(document.getElementById('drop-word-min-lines')?.value, 10) || 2;
    const meetsLineThreshold = (numLines >= minLines) && !isSingleLine;

    // פיצול למספר מילים ראשונות מבוקש (הערת שוליים אינה נחתכת באמצע)
    const words = splitIntoMeasureWords(text).map(u => u.raw);
    if (words.length === 0) return '';
    const dropWords = words.slice(0, Math.min(wordCount, words.length)).join(' ');
    const restOfText = words.slice(Math.min(wordCount, words.length)).join(' ');

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
    return applyDibburHamatchil(fullText);
}

/* מדידת שורות לפי ה-DOM האמיתי: מרנדרים את הפסקה בדיוק כמו בעמוד (createDropWord + סימוני הערות במצב יבש)
   וקובעים לכל מילה את השורה שלה לפי מלבן התו הראשון שלה (Range). מחזיר מערך שורות (טקסט גולמי של המילים),
   או null כשמספר המילים ב-DOM שונה ממספר היחידות (אז המדידה הישנה, מילה-מילה, משמשת כגיבוי). */
function measureLinesByRealMarkup(pMeasure, units, text, useWindow, shouldApplyWindow, numLinesEstimated, wordCount, withEndMarker = false) {
    try {
        const words = units.map(u => u.raw);
        pMeasure.innerHTML = createDropWord(text, !useWindow, !shouldApplyWindow, numLinesEstimated);
        applyDelimiterStyles(pMeasure, 'body', getBodySizePt(), true);
        // [תיקון] סימון הערת סיום שיוצמד לסוף הפסקה נכלל במדידה (ראו createDryEndNoteMarker)
        if (withEndMarker) pMeasure.appendChild(createDryEndNoteMarker(withEndMarker));

        // הטקסט הנראה כולו (בצמתי טקסט לפי הסדר) ומיקום תחילת כל צומת בתוכו
        const nodes = [];
        let full = '';
        const tw = document.createTreeWalker(pMeasure, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = tw.nextNode())) { nodes.push({ node: n, start: full.length }); full += n.nodeValue; }
        const toks = [];
        const re = /\S+/g;
        let m;
        while ((m = re.exec(full))) toks.push(m.index);
        if (toks.length !== words.length) return null;

        const range = document.createRange();
        const lhPx = parseFloat(window.getComputedStyle(pMeasure).lineHeight) || 18;
        const thr = Math.max(6, lhPx * 0.5);
        const startIndex = shouldApplyWindow ? Math.min(wordCount, words.length) : 0;
        const lines = [];
        let currentLine = [];
        let currentMid = null;
        if (shouldApplyWindow) currentLine.push(words.slice(0, startIndex).join(' '));
        for (let i = startIndex; i < words.length; i++) {
            let lo = 0, hi = nodes.length - 1;
            while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (nodes[mid].start <= toks[i]) lo = mid; else hi = mid - 1; }
            const off = toks[i] - nodes[lo].start;
            range.setStart(nodes[lo].node, off);
            range.setEnd(nodes[lo].node, off + 1);
            const r = range.getClientRects()[0] || range.getBoundingClientRect();
            const mid = (r.top + r.bottom) / 2;
            if (currentMid === null) currentMid = mid;
            if (Math.abs(mid - currentMid) > thr && currentLine.length > 0) {
                lines.push(currentLine.join(' '));
                currentLine = [words[i]];
                currentMid = mid;
            } else {
                currentLine.push(words[i]);
            }
        }
        if (currentLine.length > 0) lines.push(currentLine.join(' '));
        return lines;
    } catch (e) {
        return null;
    }
}

/* ============================================================
   מדידת שורות וחלוקת פסקאות דינמית לפי גופן, גודל ו-Line-Height
   ============================================================ */
function getLinesFromParagraph(text, colWidth, styleObj, useWindowIfMultipleLines, withEndMarker = false) {
    const measureContainer = document.getElementById('measuring-box');
    measureContainer.style.width = colWidth + 'px';
    measureContainer.style.fontFamily = styleObj.fontFamily;
    measureContainer.style.fontSize = styleObj.fontSize;
    measureContainer.style.lineHeight = styleObj.lineHeight;
    measureContainer.style.textAlign = 'justify';
    measureContainer.style.textJustify = 'inter-word';
    measureContainer.style.direction = 'rtl';
    measureContainer.innerHTML = '';

    const pMeasure = document.createElement('p');
    pMeasure.style.margin = '0';
    pMeasure.style.padding = '0';
    pMeasure.style.lineHeight = styleObj.lineHeight;

    const units = splitIntoMeasureWords(text);
    const words = units.map(u => u.raw);
    if (words.length === 0) {
        return { lines: [], hasWindow: false };
    }

    pMeasure.innerHTML = units.map(u => u.html).join(' ');
    measureContainer.appendChild(pMeasure);
    const singleLineHeight = pMeasure.offsetHeight;
    pMeasure.textContent = "א";
    const oneLineH = pMeasure.offsetHeight;
    const numLinesEstimated = Math.max(1, Math.round(singleLineHeight / oneLineH));
    
    const minLines = parseInt(document.getElementById('drop-word-min-lines')?.value, 10) || 2;
    const mode = document.getElementById('drop-word-mode')?.value || 'window';
    const shouldApplyWindow = useWindowIfMultipleLines && (numLinesEstimated >= minLines) && (mode === 'window') && !RUN_IN_START_RE.test(text);

    const wordCount = parseInt(document.getElementById('drop-word-count')?.value, 10) || 1;
    const dropWords = words.slice(0, Math.min(wordCount, words.length)).join(' ');
    const dropHtml = units.slice(0, Math.min(wordCount, words.length)).map(u => u.html).join(' ');

    /* [תיקון] מדידה במבנה האמיתי של הפסקה: אותו HTML שהעמוד יקבל בפועל (עיצוב מילה ראשונה לפי המצב, ד"ה אוטומטי,
       סימוני הערות), ובכך השורות שנמדדות הן השורות שיוצגו. קודם כל מילה נעטפה ב-span נפרד והמדידה התעלמה מעיצוב
       המילה הראשונה (מודגשת/מוגדלת) ומד"ה - ולכן בכמה מצבים הפסקה נרנדרה בשורות אחרות ממה שנמדד: חיתוכים
       שנוחתים בשורה בודדת, טורים לא מאוזנים ופערי תחתית. כשהמיפוי אינו חד-חד-ערכי חוזרים לשיטה הישנה. */
    const realLines = measureLinesByRealMarkup(pMeasure, units, text, useWindowIfMultipleLines, shouldApplyWindow, numLinesEstimated, wordCount, withEndMarker);
    if (realLines) {
        measureContainer.innerHTML = '';
        return { lines: realLines, hasWindow: shouldApplyWindow, numLines: realLines.length };
    }

    let html = '';
    if (shouldApplyWindow) {
        html += `<span class="first-word-window" id="mw-0">${dropHtml}</span> `;
        for (let i = wordCount; i < words.length; i++) {
            html += `<span id="mw-${i}">${units[i].html}</span> `;
        }
    } else {
        for (let i = 0; i < words.length; i++) {
            html += `<span id="mw-${i}">${units[i].html}</span> `;
        }
    }

    pMeasure.innerHTML = html;

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
        if (Math.abs(top - currentTop) > 8 && currentLine.length > 0) {
            lines.push(currentLine.join(' '));
            currentLine = [words[i]];
            currentTop = top;
        } else {
            currentLine.push(words[i]);
        }
    }
    if (currentLine.length > 0) {
        lines.push(currentLine.join(' '));
    }

    measureContainer.innerHTML = '';
    return {
        lines,
        hasWindow: shouldApplyWindow,
        numLines: lines.length
    };
}

/* ============================================================
   בניית מעטפת עמוד (Page Layout) כולל כותרות מתחלפות ומספור עמודים
   ============================================================ */
/* "חיצוני"/"פנימי" מתורגם לימין/שמאל לפי העמודה הפיזית (ולא לפי איזה
   תוכן יושב בה) - כך שכותרת שמוגדרת "חיצונית" תמיד תיצמד לשוליים
   החיצוניים של הדף, גם בעמוד ימני וגם בעמוד שמאלי (אחרי היפוך בכותרות
   מתחלפות). ערכים אחרים (ימין/שמאל/מרכז מוחלטים) עוברים ללא שינוי. */
function resolveHeaderAlign(align, slot) {
    if (align === 'outer') return slot === 'r' ? 'right' : 'left';
    if (align === 'inner') return slot === 'r' ? 'left' : 'right';
    return align;
}

/* [חדש] בונה את HTML של פס הכותרת העליונה (שלוש עמודות) לעמוד לפי כל הגדרות הכותרות העליונות:
   כותרות מתחלפות (בעמוד זוגי), "פצל שם ספר", יישור חיצוני/פנימי לפי העמודה הפיזית, וגופן/גודל לכל צד.
   משמש גם את עמודי התוכן וגם את עמודי תוכן העניינים - כך שההתנהגות זהה בכל עמוד בספר.
   tocFallback: טקסט חלופי כשהכותרת ריקה (בעמודי תוכן העניינים - שם התוכן). */
function buildHeaderGridHTML(pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL, pageContext = {}, tocFallback = '') {
    const isEven = (pNum % 2 === 0);
    // טוגל "פצל שם ספר": קובע בעצמו את תוכן הכותרת הימנית (חצי ראשון של שם הספר) והשמאלית (חצי שני),
    // בלי לבחור ידנית בכל כותרת, ומבטל את ההחלפה בין עמודים (כותרות מתחלפות) - שתי האפשרויות סותרות.
    const isSplitTitle = !!document.getElementById('hdr-split-title')?.checked;
    const isAlternating = !isSplitTitle && document.getElementById('hdr-alternating')?.checked;

    let hdrRType = document.getElementById('hdr-r-type')?.value || 'h1';
    let hdrCType = document.getElementById('hdr-c-type')?.value || 'spear';
    let hdrLType = document.getElementById('hdr-l-type')?.value || 'h2';
    if (isSplitTitle) { hdrRType = 'book_title_split_r'; hdrLType = 'book_title_split_l'; }

    let hdrRAlign = document.getElementById('hdr-r-align')?.value || 'right';
    let hdrCAlign = document.getElementById('hdr-c-align')?.value || 'center';
    let hdrLAlign = document.getElementById('hdr-l-align')?.value || 'left';

    let hdrRFont = document.getElementById('f-hdr-r')?.value || "'Livorna','David Libre',serif";
    let hdrRSize = (document.getElementById('s-hdr-r')?.value || 13) + 'pt';
    let hdrLFont = document.getElementById('f-hdr-l')?.value || "'Livorna','David Libre',serif";
    let hdrLSize = (document.getElementById('s-hdr-l')?.value || 13) + 'pt';

    let cR = customR, cL = customL;

    // היפוך תוכן (לא יישור) בעמודים זוגיים בעת הפעלת כותרות מתחלפות.
    // היישור נשאר צמוד לעמודה הפיזית ונפתר למטה דרך resolveHeaderAlign,
    // כך ש"חיצוני/פנימי" ממשיך להצביע על הקצה הנכון גם אחרי ההיפוך.
    // הגופן/הגודל מתחלפים יחד עם התוכן - אחרת תוכן שעבר לעמודה השנייה
    // ימשיך להיראות בגופן שהוגדר לעמודה המקורית שלו, לא לתוכן שבו.
    if (isAlternating && isEven) {
        const tempType = hdrRType; hdrRType = hdrLType; hdrLType = tempType;
        const tempCust = cR; cR = cL; cL = tempCust;
        const tempFont = hdrRFont; hdrRFont = hdrLFont; hdrLFont = tempFont;
        const tempSize = hdrRSize; hdrRSize = hdrLSize; hdrLSize = tempSize;
    }

    hdrRAlign = resolveHeaderAlign(hdrRAlign, 'r');
    hdrCAlign = resolveHeaderAlign(hdrCAlign, 'c');
    hdrLAlign = resolveHeaderAlign(hdrLAlign, 'l');

    const contextExtra = {
        ...pageContext,
        pageNum: toGematria(pNum)
    };

    // טקסט כותרת עליונה נעטף ב-.hdr-txt: כשהטקסט ארוך מרוחב העמודה הוא נחתך בסופו עם "…" (ולא נחתך בתחילתו
    // בלי סימן, כפי שקרה כשהטקסט היה צאצא ישיר של מיכל ה-flex). עיטורים (SVG) לא נעטפים.
    const wrapHdrText = html => (html && !/^<span class="header-ornament-wrap"/.test(html)) ? `<span class="hdr-txt">${html}</span>` : html;
    const hdrRHTML = wrapHdrText(renderHeaderSectionHTML(hdrRType, cR, h1Title, h2Title, h3Title, bookTitle, tocFallback, contextExtra));
    const hdrCHTML = wrapHdrText(renderHeaderSectionHTML(hdrCType, customC, h1Title, h2Title, h3Title, bookTitle, tocFallback, contextExtra));
    const hdrLHTML = wrapHdrText(renderHeaderSectionHTML(hdrLType, cL, h1Title, h2Title, h3Title, bookTitle, tocFallback, contextExtra));

    // [חדש] "מיקום מספור: משולב בכותרת עליונה חיצונית" - מספר העמוד נכנס לפס הכותרת בפינה החיצונית
    // (שמאל בעמוד אי-זוגי וימין בזוגי - כמו מספור תחתון "חיצוני"; ההחלטה ב-CSS לפי מיקום העמוד בספר),
    // בפורמט/מסגרת/עמוד-התחלה של המספור הרגיל. הכותרת בעמודה החיצונית מקבלת ריווח כדי שלא תחפוף את המספר.
    const pnInfo = formatPageNumberDisplay(pNum);
    const hdrPn = (pnInfo.pageNumPos === 'header_outer' && !!pnInfo.displayPageNum);

    return `<div class="top-header-grid${hdrPn ? ' has-hdr-pn' : ''}">
        <div class="header-col-r" style="text-align:${hdrRAlign}; justify-content:${hdrRAlign}; font-family:${hdrRFont}; font-size:${hdrRSize};">${hdrRHTML}</div>
        <div class="header-col-c" style="text-align:${hdrCAlign}; justify-content:${hdrCAlign};">${hdrCHTML}</div>
        <div class="header-col-l" style="text-align:${hdrLAlign}; justify-content:${hdrLAlign}; font-family:${hdrLFont}; font-size:${hdrLSize};">${hdrLHTML}</div>${hdrPn ? `
        <span class="hdr-pagenum">${pnInfo.framedPageNum}</span>` : ''}
      </div>`;
}

function createPageLayout(container, h2Text, h2TokenId, pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL, pageRole, pageContext = {}) {
    const page = document.createElement('div');
    page.className = 'a4-page';
    page.setAttribute('data-page-index', String(pNum));
    applyContentBg(page, pageRole || 'regular');

    const headerGridHTML = buildHeaderGridHTML(pNum, h1Title, h2Title, h3Title, bookTitle, customR, customC, customL, pageContext, '');

    // עיצוב מספור עמודים ומסגרות
    const { displayPageNum, framedPageNum, pageNumPos } = formatPageNumberDisplay(pNum);

    const footerClass = (pageNumPos === 'bottom_outer') ? 'pos-outer' : 'pos-center';
    const showFooter = (pageNumPos === 'bottom_center' || pageNumPos === 'bottom_outer') && displayPageNum;

    page.innerHTML = `
    <div class="page-content-wrapper">
      ${headerGridHTML}
      <div class="page-body-flow ${h2Text ? 'h2-flow-page' : ''}">
        ${h2Text ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" ${h2TokenId !== undefined ? `data-token-id="${h2TokenId}" id="heading-tok-${h2TokenId}"` : ''}>${h2Text}</div>` : ''}
      </div>
      <div class="page-number-footer ${footerClass}">${showFooter ? framedPageNum : ''}</div>
    </div>
  `;

    container.appendChild(page);
    const bodyFlow = page.querySelector('.page-body-flow');
    return { page, bodyFlow };
}

/* ============================================================
   חילוץ מטא-דאטה ראשוני מהטקסט המוזן
   ============================================================ */
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
   typesetter.js - מנוע העימוד המרכזי לדפי A4
   חלק ב' מתוך ג': איזון טורים, הערות שוליים/סיום, תוחמים ותוכן עניינים
   (יש להדביק חלק זה מיד בהמשך חלק א')
   ========================================================================== */

function estimateSectionFillRatio(tokens) {
    const sampleFlow = document.querySelector('.page-body-flow');
    const perPageCapacity = (sampleFlow ? sampleFlow.clientHeight : 900) * 2;
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;width:580px;';
    probe.className = 'page-body-flow';
    document.body.appendChild(probe);
    let totalHeight = 0;
    tokens.forEach(t => {
        if (t.type === 'p') {
            const p = document.createElement('p');
            p.innerHTML = createDropWord(t.text, false, true);
            probe.appendChild(p);
            totalHeight += layoutHeightOf(p);
            probe.removeChild(p);
        } else if (t.type.startsWith('h')) {
            const h = document.createElement('div');
            h.className = t.customStyleId ? 'title-level-custom' : `title-level-${t.level}`;
            h.textContent = t.text;
            probe.appendChild(h);
            totalHeight += layoutHeightOf(h);
            const hStyle = window.getComputedStyle(h);
            totalHeight += parseFloat(hStyle.marginTop) + parseFloat(hStyle.marginBottom);
            probe.removeChild(h);
        }
    });
    document.body.removeChild(probe);
    if (totalHeight <= 0) return 1;
    const naivePages = Math.ceil(totalHeight / perPageCapacity);
    if (naivePages <= 1) return 1;
    const ratio = totalHeight / (naivePages * perPageCapacity);
    return Math.max(0.3, Math.min(1, ratio));
}

/* ==========================================================================
   כללי חיתוך פסקאות והחזרת כותרות - מקור אמת יחיד לכל מנגנוני העימוד
   (מילוי עמוד, איזון טורים). כולל:
   - אין שורה בודדת בסוף טור/עמוד (תיבת "מנע שורות בודדות בסוף עמוד") ואין שורה בודדת בראשו
     (תיבת "מנע שורות בודדות בראש עמוד") - כל חלק של פסקה חתוכה חייב להיות בן 2 שורות לפחות.
   - כותרת (רמות 2-6) לעולם לא נשארת לבדה בתחתית טור: היא עוברת יחד עם הפסקה שאחריה.
   ========================================================================== */
function getSplitRules() {
    const avoidWidows = document.getElementById('avoid-widows')?.checked ?? true;   // שורה בודדת בסוף טור/עמוד
    const avoidOrphans = document.getElementById('avoid-orphans')?.checked ?? true; // שורה בודדת בראש טור/עמוד
    return { minFirst: avoidWidows ? 2 : 1, minLast: avoidOrphans ? 2 : 1 };
}

/* כמה שורות להציב מפסקה בת totalLines שורות כשבפועל נכנסות fitLines שורות.
   מחזיר 0 כשאי אפשר לפצל בלי להפר את הכללים - הפסקה כולה (והכותרות שלפניה) עוברות לטור/עמוד הבא.
   mustPlace=true כשזו הפסקה הראשונה בעמוד ואין לאן לדחות (מונע לולאה אינסופית). */
function resolveParagraphSplit(totalLines, fitLines, mustPlace) {
    if (fitLines >= totalLines) return totalLines;
    const { minFirst, minLast } = getSplitRules();
    const k = Math.min(fitLines, totalLines - minLast);
    if (k >= minFirst) return k;
    if (mustPlace && fitLines >= 1) return Math.max(1, Math.min(fitLines, totalLines - 1));
    return 0;
}

/* מסיר מסוף הטור את הכותרות הרצופות (כדי שיעברו יחד עם הפסקה שלא נכנסה). מחזיר כמה הוסרו */
function rollbackTrailingHeadings(col) {
    let n = 0;
    let last = col.lastElementChild;
    while (last && /(^|\s)title-level-/.test(last.className)) {
        col.removeChild(last);
        n++;
        last = col.lastElementChild;
    }
    return n;
}

/* מספר השורות המרבי של פסקה שנכנס בטור (נמדד בפועל, כולל סימוני הערות ועיצוב תוחמים).
   getAvail(testText) מחזיר את הגובה הפנוי עבור קטע הטקסט הנבדק (כולל שטח להערות שהוא מכניס). */
function computeBestFitLine(pElem, targetCol, lines, isContinuation, hasWindow, getAvail, withEndMarker = false) {
    let best = 0;
    for (let i = 1; i <= lines.length; i++) {
        const testText = lines.slice(0, i).join(' ');
        pElem.className = (i === lines.length) ? 'p-end' : 'p-cut';
        pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow, lines.length);
        applyDelimiterStyles(pElem, 'body', getBodySizePt(), true);
        // [תיקון] בבדיקת הפסקה כולה גם סימון הערת הסיום שיוצמד לסופה תופס מקום (ראו createDryEndNoteMarker)
        if (withEndMarker && i === lines.length) pElem.appendChild(createDryEndNoteMarker());
        if (targetCol.scrollHeight <= getAvail(testText)) best = i;
        else break;
    }
    return best;
}

let PAGE_STRETCH_MAX = 48;      // תקרת המתיחה (px) של בלוק אחרון בעמוד לצורך ישור תחתית
const JUSTIFY_MAX_GAP = 9;      // תקרת הרווח הכולל (px) שמתווסף אחרי פסקה
const JUSTIFY_MAX_LH_EXTRA = 3; // תקרת התוספת (px) לגובה שורה כשהרווחים בין הפסקאות לא מספיקים
const JUSTIFY_BALANCE_LH_RATIO = 0.35; // באיזון שני טורים של בלוק (הפרש עד שורה): תקרת התוספת לשורה כאחוז מגובה השורה
const BALANCE_FINAL_JUSTIFY_MAX = 100; // תקרת ההפרש (px) שמיושר בסוף איזון טורים. קודם 60: בלוק שבו טור אחד הוא פסקה ארוכה בודדת
                                       // (אין רווחים בין פסקאות למתוח) נשאר עם טורים לא מיושרים בהפרש של 3-4 שורות. התוספת לשורה עדיין
                                       // מוגבלת ב-JUSTIFY_BALANCE_LH_RATIO, כלומר אי אפשר "למתוח" מעבר ליכולת הטור.

/* ==========================================================================
   יישור אנכי עדין של טור: מותח את הטור ל-targetHeight כך שתחתיות הטורים נוחתות על אותו קו.
   - הרווח מתווסף כ-padding-bottom ולא כ-margin-bottom: שוליים סמוכים "קורסים" זה לתוך זה,
     ולכן תוספת margin הייתה נבלעת ברווח הקיים והטור לא היה מגיע ליעד.
   - הרווח מתווסף רק אחרי פסקאות (לא אחרי כותרת), כדי שכותרת תישאר צמודה לפסקה שאחריה,
     ועם תקרה כוללת לכל רווח (JUSTIFY_MAX_GAP) כדי שהטור לא ייראה "מרוח".
   - מה שנשאר (כשיש מעט פסקאות) נפרס באופן אחיד על גובה השורות, עם תקרה (JUSTIFY_MAX_LH_EXTRA).
     בפסקה עם "חלון" מילה ראשונה גם גובה החלון מוגדל באותו יחס - כך מספר השורות שנגללות סביבו
     (ולכן חלוקת השורות של הפסקה) נשאר בדיוק כמו שנמדד.
   - הפונקציה מחזירה את הגובה שהושג בפועל (ייתכן קטן מהיעד אם נגמרה היכולת למתוח).
   ========================================================================== */
function paraLineInfo(p) {
    const cs = getComputedStyle(p);
    const lh = parseFloat(cs.lineHeight) || (parseFloat(cs.fontSize) * 1.34) || 18;
    const inner = p.offsetHeight - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0);
    return { lh, lines: Math.max(1, Math.round(inner / lh)) };
}

/* כמה px אפשר עוד למתוח בטור, לפי הרווחים הפנויים אחרי פסקאות ותקרת התוספת לשורות */
function columnStretchCapacity(col, lhCap = JUSTIFY_MAX_LH_EXTRA) {
    const kids = Array.from(col.children);
    let cap = 0;
    kids.forEach((k, i) => {
        if (k.tagName !== 'P') return;
        if (i < kids.length - 1) cap += Math.max(0, JUSTIFY_MAX_GAP - (parseFloat(k.style.paddingBottom) || 0));
        const { lh, lines } = paraLineInfo(k);
        const base = parseFloat(k.getAttribute('data-base-lh')) || lh;
        cap += lines * Math.max(0, lhCap - (lh - base));
    });
    return cap;
}

function justifyColumnVertically(col, targetHeight, styleObj, maxStretch = 60, lhCap = null) {
    let diff = targetHeight - col.scrollHeight;
    if (!(diff > 0.5 && diff <= maxStretch)) return col.scrollHeight;

    const kids = Array.from(col.children);

    // 1. רווחים בין פסקאות (עד התקרה הכוללת לכל רווח)
    const gapKids = kids.filter((k, i) => k.tagName === 'P' && i < kids.length - 1);
    if (gapKids.length) {
        const per = diff / gapKids.length;
        gapKids.forEach(k => {
            const cur = parseFloat(k.style.paddingBottom) || 0;
            const add = Math.max(0, Math.min(per, JUSTIFY_MAX_GAP - cur));
            if (add > 0) k.style.paddingBottom = (cur + add) + 'px';
        });
    }

    // 2. שארית: מותחים את גובה השורה של כל הפסקאות באופן אחיד (עם תקרה).
    // [תיקון] גובה פסקה אינו תמיד ליניארי בגובה השורה: בפסקה עם ד"ה/מילה ראשונה בגופן שונה, הדפדפן מעגל את
    // חצאי-הריווח של כל גופן בנפרד, ולכן מתיחה אחת מפספסת לפעמים בכמה פיקסלים והטורים נגמרו בפער של ~3px.
    // לכן מודדים מחדש וחוזרים על המתיחה (עד 3 מעברים בסך הכול). המעבר הראשון זהה למקור, ומעברים נוספים
    // מתבצעים רק כשנשאר פער של יותר מחצי פיקסל וגם נשארה יכולת למתוח - כך עימוד שכבר מיושר לא משתנה.
    for (let pass = 0; pass < 3; pass++) {
        const rest = targetHeight - col.scrollHeight;
        if (!(rest > 0.5)) break;
        const infos = kids.filter(k => k.tagName === 'P').map(p => {
            const { lh, lines } = paraLineInfo(p);
            return { p, lh, lines, base: parseFloat(p.getAttribute('data-base-lh')) || lh };
        });
        const totalLines = infos.reduce((a, i) => a + i.lines, 0);
        if (!(totalLines > 0)) break;
        const e = rest / totalLines;
        let changed = false;
        infos.forEach(i => {
            const cap = (lhCap === null) ? Math.max(JUSTIFY_MAX_LH_EXTRA, i.base * JUSTIFY_BALANCE_LH_RATIO) : lhCap;
            const newLh = Math.min(i.lh + e, i.base + cap);
            if (newLh <= i.lh + 0.01) return;
            const win = i.p.querySelector('.first-word-window');
            // במעבר ראשון כמו במקור (offsetHeight); במעברים נוספים נשענים על הגובה המדויק שנקבע קודם, בלי נדידת עיגול
            const setH = win ? parseFloat(win.style.height) : NaN;
            const winH = win ? ((pass > 0 && isFinite(setH) && setH > 0) ? setH : win.offsetHeight) : 0;
            if (!i.p.hasAttribute('data-base-lh')) i.p.setAttribute('data-base-lh', String(i.lh));
            i.p.style.lineHeight = newLh + 'px';
            // החלון גדל באותו יחס, כדי שמספר השורות שמתחתיו/לצדו לא ישתנה (כולל השוליים הקבועים שלו - 1px)
            if (win && winH > 0) win.style.height = (((winH + 1) * newLh / i.lh) - 1) + 'px';
            changed = true;
        });
        if (!changed) break;
    }
    return col.scrollHeight;
}

/* מתיחת הבלוק האחרון בעמוד שהפרק ממשיך אחריו עד תחתית השטח הפנוי, כך שכל העמודים נגמרים על אותו קו.
   freeSpace = הרווח הפנוי בפועל (מדוד) בין תחתית הבלוק לתחתית השטח הפנוי בעמוד.
   בבלוק דו-טורי שני הטורים נמתחים לאותו יעד, והיעד מוגבל ליכולת המתיחה של הטור החלש יותר -
   כדי שתחתיות שני הטורים תמיד יישארו על אותו קו (עדיף פער קטן בתחתית העמוד מטורים לא מיושרים). */
function stretchLastBlockToBottom(bodyFlow, freeSpace, styleObj, maxStretch) {
    if (!(freeSpace > 0.5 && freeSpace <= maxStretch)) return false;
    const last = bodyFlow.lastElementChild;
    if (!last) return false;
    if (last.classList.contains('block-2col')) {
        const rCol = last.querySelector('.right-col');
        const lCol = last.querySelector('.left-col');
        if (!rCol || !lCol) return false;
        const rH = rCol.scrollHeight, lH = lCol.scrollHeight;
        const top = Math.max(rH, lH);
        const reach = Math.min(rH + columnStretchCapacity(rCol), lH + columnStretchCapacity(lCol));
        const target = Math.min(top + freeSpace, reach);
        if (target - top < 0.5) return false;
        justifyColumnVertically(rCol, target, styleObj, maxStretch + 40, JUSTIFY_MAX_LH_EXTRA);
        justifyColumnVertically(lCol, target, styleObj, maxStretch + 40, JUSTIFY_MAX_LH_EXTRA);
        repositionBlockNotes(last, Math.max(rCol.scrollHeight, lCol.scrollHeight));
        return true;
    }
    if (last.classList.contains('block-single-col')) {
        const col = last.querySelector('.single-wide-col');
        if (!col) return false;
        const h = col.scrollHeight;
        const target = Math.min(h + freeSpace, h + columnStretchCapacity(col));
        if (target - h < 0.5) return false;
        justifyColumnVertically(col, target, styleObj, maxStretch + 1, JUSTIFY_MAX_LH_EXTRA);
        repositionBlockNotes(last, col.scrollHeight);   // הערות צד של ההקדמה נשארות מול הפסקאות שלהן אחרי המתיחה
        return true;
    }
    return false;
}

/* [חדש] סגנון הערת צד לפי הרמה: כותרת 7 (ברירת מחדל) מעוצבת בעמודת השוליים עצמה; כותרת 5/6 במצב "כותרת צד"
   מעוצבות בגופן ובגודל שהוגדרו לרמה שלהן, כך שהבקרים של הרמה משפיעים גם כשהכותרת עברה לשוליים. */
function applySideNoteLevelStyle(noteElem, level) {
    const lv = parseInt(level, 10);
    if (!lv || lv === 7) return;
    noteElem.style.fontFamily = 'var(--fn-h' + lv + ')';
    noteElem.style.fontSize = 'var(--sz-h' + lv + ')';
    noteElem.style.fontWeight = '700';
}

/* [תיקון] מפריד סוף-פרק שלא נכנס בתחתית העמוד. כשעמוד סוף הפרק מלא עד הסוף, המפריד (שמתווסף אחרי הבלוק האחרון)
   חרג מאזור הגוף וחפף את מספר העמוד / אזור הערות השוליים (ובגרסה המקורית גם יצר גלילה בתוך העמוד).
   limitBottom = הקו התחתון המותר (תחתית אזור הגוף פחות אזור הערות השוליים).
   - נכנס: לא נוגעים (עמודים שבהם המפריד נכנס נשארים בדיוק כפי שהיו).
   - נכנס אם מצמצמים את המרווח שמעליו (עד 4px): מצמצמים.
   - אחרת: מוותרים עליו בעמוד זה - הפרק הבא מתחיל בעמוד חדש ממילא, וקישוט שחופף את תחתית העמוד גרוע מהיעדרו. */
function fitSectionDividerToPage(divEl, limitBottom) {
    if (!divEl || !divEl.classList || !divEl.classList.contains('sec-divider-wrap')) return;
    const over = divEl.getBoundingClientRect().bottom - limitBottom;
    if (over <= 0.5) return;
    const MIN_TOP_MARGIN = 4;
    const topMargin = parseFloat(window.getComputedStyle(divEl).marginTop) || 0;
    if (over <= topMargin - MIN_TOP_MARGIN + 0.5) {
        divEl.style.marginTop = Math.max(MIN_TOP_MARGIN, topMargin - over) + 'px';
        return;
    }
    if (divEl.parentNode) divEl.parentNode.removeChild(divEl);
}


/* מיקום מחדש של הערות הצד בבלוק (אחרי ששינינו את גובה הפסקאות בו) */
function repositionBlockNotes(block, boundaryHeight) {
    const list = [];
    block.querySelectorAll('.side-note-anchor').forEach(elem => {
        const tid = elem.getAttribute('data-for-token');
        if (tid === null) return;
        const pElem = block.querySelector('p[data-token-id="' + tid + '"][data-is-cont="false"]');
        if (pElem) list.push({ elem, pElem });
    });
    finalizeNotePositions(list, boundaryHeight);
}

/* ==========================================================================
   איזון טורים: מאחד את תוכן שני הטורים של בלוק, ובוחר מחדש את נקודת הפיצול הטובה ביותר
   - נקודות פיצול חוקיות בלבד: אין פיצול שמשאיר שורה בודדת בתחילת/סוף חלק, אין כותרת בתחתית
     טור הימני, ואחרי כותרת חייבות להישאר לפחות 2 שורות מהפסקה.
   - פיצול שנכנס בגובה הפנוי (availableHeight) תמיד עדיף על פיצול שלא נכנס;
     בין פיצולים שווי-מעמד נבחר הקרוב ביותר לגובה שווה (בשוויון: טור ימין גבוה יותר).
   - החיפוש בינארי (diff = R-L עולה מונוטונית עם נקודת הפיצול) ולא סריקה מלאה: מהיר פי כמה.
   - חלק פסקה שממשיך לעמוד הבא נשאר p-cut, וסימון הערת סיום מוצמד לסוף הפסקה האמיתי.
   ========================================================================== */
function balanceColumns(block, colWidth, styleObj, snapshot, availableHeight = Infinity) {
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

    // ---- 1. איחוד חלקי פסקאות רצופים של אותו טוקן ----
    const mergedItems = [];
    for (const child of allChildren) {
        if (child.tagName === 'P') {
            const id = child.getAttribute('data-token-id');
            const text = child.getAttribute('data-raw-text') || child.textContent;
            const isCont = child.getAttribute('data-is-cont') === 'true';
            const cut = child.classList.contains('p-cut'); // החלק ממשיך מעבר לבלוק (לעמוד הבא)
            const sideNote = child.getAttribute('data-side-note');
            const endNote = child.getAttribute('data-end-note');
            const sideNoteStyleId = child.getAttribute('data-note-style-id');
            const sideNoteLevel = child.getAttribute('data-note-level');
            const lastItem = mergedItems[mergedItems.length - 1];
            if (lastItem && lastItem.type === 'p' && lastItem.id === id) {
                lastItem.rawText += ' ' + text;
                lastItem.cut = cut;
                if (sideNote && !lastItem.sideNote) {
                    lastItem.sideNote = sideNote;
                    lastItem.sideNoteStyleId = sideNoteStyleId;
                    lastItem.sideNoteLevel = sideNoteLevel;
                }
                if (endNote && !lastItem.endNote) lastItem.endNote = endNote;
            } else {
                mergedItems.push({ type: 'p', id, rawText: text, isCont, cut, sideNote, endNote, sideNoteStyleId, sideNoteLevel });
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

    // [תיקון] טקסט סימון הערת הסיום של כל פסקה בבלוק, לפי הסדר שבו הסימונים ייווצרו בפועל בעימוד הסופי
    // (המונה כבר אופס לתמונת המצב שבתחילת הפונקציה) - כדי שהמדידה תכלול סימון באותו רוחב בדיוק כמו האמיתי.
    let endMarkerSeq = noteCounters.endnote || 0;
    mergedItems.forEach(item => {
        if (item.type === 'p' && item.endNote && !item.cut) item.endMarkerText = formatNoteMarker(++endMarkerSeq, null);
    });

    const items = mergedItems.map(item => {
        if (item.type === 'p') {
            const linesInfo = getLinesFromParagraph(item.rawText, colWidth, styleObj, !item.isCont, item.endMarkerText || false);
            return { ...item, lines: linesInfo.lines, isSingleLine: linesInfo.lines.length <= 1, hasWindow: linesInfo.hasWindow, numLines: linesInfo.lines.length };
        }
        return item;
    });

    // ---- 2. נקודות פיצול חוקיות, מסודרות לפי מיקום (יותר תוכן בטור ימין = אינדקס גבוה יותר) ----
    // מועמד {i, l}: פריטים 0..i-1 בשלמותם בטור ימין; אם l>0 גם l שורות ראשונות של פריט i; השאר בשמאל.
    const rules = getSplitRules();
    const cands = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].type === 'p') {
            const n = items[i].lines.length;
            const prevIsHeading = i > 0 && items[i - 1].type === 'h';
            for (let l = 1; l < n; l++) {
                if (l < rules.minFirst || n - l < rules.minLast) continue; // שורה בודדת בתחילת/סוף חלק
                if (prevIsHeading && l < 2) continue;                        // כותרת + שורה אחת בלבד
                cands.push({ i, l });
            }
            cands.push({ i: i + 1, l: 0 }); // הטור הימני מסתיים בסוף פסקה שלמה (לא בכותרת)
        }
    }
    if (cands.length === 0) {
        finalizeNotePositions([], 0);
        return;
    }

    function renderSingleItemFast(col, item) {
        if (item.type === 'h') {
            col.insertAdjacentHTML('beforeend', item.html);
        } else {
            const p = document.createElement('p');
            p.className = item.cut ? 'p-cut' : 'p-end';
            p.innerHTML = createDropWord(item.rawText, item.isCont, item.isSingleLine, item.numLines);
            applyDelimiterStyles(p, 'body', getBodySizePt(), true);
            if (item.endMarkerText) p.appendChild(createDryEndNoteMarker(item.endMarkerText));   // סימון הערת הסיום שיוצמד לסוף הפסקה
            col.appendChild(p);
        }
    }

    // ---- 3. הערכת מועמד (רינדור ניסיוני של שני הטורים ומדידה) ----
    const memo = new Map();
    function evalCand(k) {
        if (memo.has(k)) return memo.get(k);
        const c = cands[k];
        rCol.innerHTML = '';
        lCol.innerHTML = '';
        for (let i = 0; i < c.i; i++) renderSingleItemFast(rCol, items[i]);
        if (c.l > 0) {
            const item = items[c.i];
            const pRight = document.createElement('p');
            pRight.className = 'p-cut';
            pRight.innerHTML = createDropWord(item.lines.slice(0, c.l).join(' '), item.isCont, false, c.l);
            applyDelimiterStyles(pRight, 'body', getBodySizePt(), true);
            rCol.appendChild(pRight);

            const pLeft = document.createElement('p');
            pLeft.className = item.cut ? 'p-cut' : 'p-end';
            pLeft.innerHTML = createDropWord(item.lines.slice(c.l).join(' '), true, false, item.lines.length - c.l);
            applyDelimiterStyles(pLeft, 'body', getBodySizePt(), true);
            if (item.endMarkerText) pLeft.appendChild(createDryEndNoteMarker(item.endMarkerText));   // סימון הערת הסיום שיוצמד לסוף הפסקה
            lCol.appendChild(pLeft);
        }
        for (let i = c.l > 0 ? c.i + 1 : c.i; i < items.length; i++) renderSingleItemFast(lCol, items[i]);
        const rH = rCol.scrollHeight, lH = lCol.scrollHeight;
        const diff = rH - lH;
        const res = { k, rH, lH, diff, abs: Math.abs(diff), fits: Math.max(rH, lH) <= availableHeight, over: Math.max(rH, lH) };
        memo.set(k, res);
        return res;
    }
    function better(a, b) {
        if (a.fits !== b.fits) return a.fits;
        if (!a.fits) return a.over < b.over; // אף אחד לא נכנס: הפחות גולש
        if (a.abs !== b.abs) return a.abs < b.abs;
        return a.diff >= 0 && b.diff < 0; // שוויון: עדיפות לטור ימין גבוה יותר
    }

    // חיפוש בינארי של נקודת החצייה (R-L הופך מחיובי לשלילי) ובדיקת סביבתה
    const m = cands.length;
    let lo = 0, hi = m - 1, cross = m - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (evalCand(mid).diff >= 0) { cross = mid; hi = mid - 1; } else lo = mid + 1;
    }
    let best = null;
    const consider = (k) => {
        if (k < 0 || k >= m) return;
        const e = evalCand(k);
        if (!best || better(e, best)) best = e;
    };
    for (let k = cross - 3; k <= cross + 3; k++) consider(k);
    // אם שום מועמד בסביבה לא נכנס בגובה הפנוי - מרחיבים החוצה עד שנמצא כזה
    for (let d = 4; d <= 80 && !best.fits && (cross - d >= 0 || cross + d < m); d++) {
        consider(cross - d);
        consider(cross + d);
    }
    const bestSplit = cands[best.k];

    // ---- 4. רינדור סופי ----
    rCol.innerHTML = '';
    lCol.innerHTML = '';
    const rMargin = block.querySelector('.right-margin');
    const lMargin = block.querySelector('.left-margin');
    if (rMargin) rMargin.innerHTML = '';
    if (lMargin) lMargin.innerHTML = '';
    const finalNotes = [];

    function appendItemFinal(col, margin, item, isRight, isPartial, partialText, isCont) {
        if (item.type === 'h') {
            col.insertAdjacentHTML('beforeend', item.html);
            return;
        }
        const p = document.createElement('p');
        // חלק ימני של פסקה מפוצלת תמיד p-cut; חלק שממשיך מעבר לבלוק גם הוא p-cut (שורה אחרונה מיושרת)
        p.className = (isPartial && isRight) ? 'p-cut' : (item.cut ? 'p-cut' : 'p-end');
        p.setAttribute('data-token-id', item.id);

        const textToRender = isPartial ? partialText : item.rawText;
        p.setAttribute('data-raw-text', textToRender);
        p.setAttribute('data-is-cont', isCont ? 'true' : 'false');
        if (item.sideNote && !isCont) p.setAttribute('data-side-note', item.sideNote); // הערת צד שייכת רק לחלק הראשון של הפסקה
        if (item.endNote) p.setAttribute('data-end-note', item.endNote);
        if (item.sideNoteStyleId && !isCont) p.setAttribute('data-note-style-id', item.sideNoteStyleId);
        if (item.sideNoteLevel && !isCont) p.setAttribute('data-note-level', item.sideNoteLevel);

        let isSingleLine = false;
        let currentLineCount = item.numLines || 2;
        if (!isPartial) {
            isSingleLine = item.isSingleLine;
        } else {
            const linesInfo = getLinesFromParagraph(textToRender, colWidth, styleObj, !isCont);
            isSingleLine = linesInfo.lines.length <= 1;
            currentLineCount = linesInfo.lines.length;
        }

        p.innerHTML = createDropWord(textToRender, isCont, isSingleLine, currentLineCount);
        applyDelimiterStyles(p, 'body', getBodySizePt(), false);

        // סימון הערת סיום מוצמד לסוף הפסקה האמיתי: החלק האחרון, ורק אם הפסקה לא ממשיכה לעמוד הבא
        const isLastChunk = !isPartial || !isRight;
        if (item.endNote && isLastChunk && !item.cut) {
            p.appendChild(createNoteMarkerAndQueue(item.endNote, null, 'endnote'));
        }

        col.appendChild(p);

        if (item.sideNote && !isCont && margin) {
            const noteElem = document.createElement('div');
            noteElem.className = 'side-note-anchor';
            noteElem.setAttribute('data-for-token', item.id);
            noteElem.textContent = item.sideNote;
            if (item.sideNoteStyleId) {
                const inst = findExtTextStyle(item.sideNoteStyleId);
                if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
            }
            applySideNoteLevelStyle(noteElem, item.sideNoteLevel);
            margin.appendChild(noteElem);
            finalNotes.push({ elem: noteElem, pElem: p });
        }
    }

    for (let i = 0; i < bestSplit.i; i++) {
        appendItemFinal(rCol, rMargin, items[i], true, false, null, items[i].isCont);
    }
    if (bestSplit.l > 0) {
        const item = items[bestSplit.i];
        appendItemFinal(rCol, rMargin, item, true, true, item.lines.slice(0, bestSplit.l).join(' '), item.isCont);
        appendItemFinal(lCol, lMargin, item, false, true, item.lines.slice(bestSplit.l).join(' '), true);
    }
    for (let i = bestSplit.l > 0 ? bestSplit.i + 1 : bestSplit.i; i < items.length; i++) {
        appendItemFinal(lCol, lMargin, items[i], false, false, null, items[i].isCont);
    }

    // ---- 5. יישור עדין של הבסיס התחתון ----
    const finalDiff = rCol.scrollHeight - lCol.scrollHeight;
    if (finalDiff > 0.5) justifyColumnVertically(lCol, rCol.scrollHeight, styleObj, BALANCE_FINAL_JUSTIFY_MAX);
    else if (finalDiff < -0.5) justifyColumnVertically(rCol, lCol.scrollHeight, styleObj, BALANCE_FINAL_JUSTIFY_MAX);

    finalizeNotePositions(finalNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
    return { rH: rCol.scrollHeight, lH: lCol.scrollHeight, fits: Math.max(rCol.scrollHeight, lCol.scrollHeight) <= availableHeight };
}

/* ==========================================================================
   מיקום הערות צד (שוליים) בגובה הפסקה שלהן, בלי חפיפה ובלי חריגה מהבלוק
   --------------------------------------------------------------------------
   כל הערה רוצה לשבת מול תחילת הפסקה שלה. כשהערה ארוכה "תופסת" את מקום הערה הבאה:
   (1) מעבר קדימה: כל הערה לא יכולה להתחיל לפני סוף הקודמת (+ מרווח), כלומר נדחפת מטה.
   (2) מעבר אחורה: אם ההערות האחרונות חורגות מתחתית הבלוק, מעלים אותן (ואת מי שמעליהן לפי הצורך).
   (3) הערה שעדיין לא נכנסת בשוליים הללו עוברת לשוליים של המשך הפסקה (אם קיים), ושם נפרסת מחדש.
   ========================================================================== */
function finalizeNotePositions(notesList, columnBoundaryHeight) {
    const GAP = 4; // מרווח מינימלי בין הערות סמוכות (px)
    const groups = new Map();

    function addToGroup(marg, item, desired) {
        if (!groups.has(marg)) groups.set(marg, []);
        groups.get(marg).push({ item, desired, h: 0, top: 0, fits: true });
    }

    notesList.forEach(item => {
        if (!item.elem || !item.pElem) return;
        const marg = item.elem.parentElement;
        if (!marg) return;
        addToGroup(marg, item, item.pElem.offsetTop);
    });

    function layoutGroup(entries) {
        entries.sort((a, b) => a.desired - b.desired);
        entries.forEach(e => {
            e.h = layoutHeightOf(e.item.elem) || e.item.elem.offsetHeight || 0;
        });
        // (1) קדימה: דחיפה מטה למניעת חפיפה
        let cursor = 0;
        entries.forEach(e => {
            e.top = Math.max(e.desired, cursor);
            cursor = e.top + e.h + GAP;
        });
        // (2) אחורה: הרמה כדי לא לחרוג מתחתית הבלוק
        let limit = columnBoundaryHeight;
        for (let i = entries.length - 1; i >= 0; i--) {
            const e = entries[i];
            if (e.top + e.h > limit) e.top = limit - e.h;
            limit = e.top - GAP;
        }
        // אם אין מקום לכולן (ההערה הראשונה יצאה מעל 0) - מצמידים ל-0 ודוחפים שוב מטה
        cursor = 0;
        entries.forEach(e => {
            if (e.top < cursor) e.top = cursor;
            cursor = e.top + e.h + GAP;
            e.fits = e.top >= -0.5 && e.top + e.h <= columnBoundaryHeight + 0.5;
        });
    }

    groups.forEach(entries => layoutGroup(entries));

    // (3) העברת הערות שלא נכנסו לשוליים של המשך הפסקה (למשל פסקה שנחתכה בין הטורים)
    for (let pass = 0; pass < 2; pass++) {
        let moved = false;
        const snapshot = [];
        groups.forEach((entries, marg) => snapshot.push([marg, entries.slice()]));
        snapshot.forEach(([marg, entries]) => {
            entries.forEach(e => {
                if (e.fits) return;
                const tokenId = e.item.pElem.getAttribute('data-token-id');
                const contElem = tokenId ? document.querySelector('p[data-token-id="' + tokenId + '"][data-is-cont="true"]') : null;
                if (!contElem || contElem === e.item.pElem) return;
                const page = contElem.closest('.a4-page');
                const isRightCol = !!contElem.closest('.right-col');
                const block = contElem.closest('.block-2col');
                const destMargin = block ? block.querySelector(isRightCol ? '.right-margin' : '.left-margin')
                    : (page ? page.querySelector(isRightCol ? '.right-margin' : '.left-margin') : null);
                if (!destMargin || destMargin === marg) return;
                const idx = groups.get(marg).indexOf(e);
                if (idx >= 0) groups.get(marg).splice(idx, 1);
                destMargin.appendChild(e.item.elem);
                addToGroup(destMargin, e.item, contElem.offsetTop);
                moved = true;
            });
        });
        if (!moved) break;
        groups.forEach(entries => layoutGroup(entries));
    }

    groups.forEach(entries => entries.forEach(e => {
        e.item.elem.style.top = e.top + 'px';
    }));
}

/* ==========================================================================
   תוחמים (Delimiters) והערות שוליים
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

/* [חדש] סוג כותרת עליונה "מילה ראשונה עד אחרונה": בקובץ המקורי האפשרות לא חישבה שום ערך והכותרת נשארה ריקה.
   אחרי שכל העמודים סופיים, לכל עמוד גוף מציבים את המילה הראשונה (תחילת הטור הימני) ואת האחרונה (סוף הטור השמאלי)
   של טקסט הפסקאות, מופרדות במקף: "ראשונה – אחרונה". סימוני הערות ופיסוק בקצה המילה אינם נכללים.
   עמוד בלי פסקאות (שער, תוכן עניינים) נשאר ריק. */
function fillHeaderFirstLastWords(container) {
    const holders = container ? container.querySelectorAll('.hdr-firstlast') : [];
    if (!holders.length) return;
    const TRIM = /^[\s"'“”‘’(){}\[\]<>.,;:!?\-–—…]+|[\s"'“”‘’(){}\[\]<>.,;:!?\-–—…]+$/g;
    const wordsOf = el => {
        let s = '';
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
            acceptNode: n => (n.parentElement && n.parentElement.closest('.note-marker')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        });
        while (w.nextNode()) s += w.currentNode.nodeValue;
        return s.split(/\s+/).map(x => x.replace(TRIM, '')).filter(Boolean);
    };
    const byPage = new Map();
    holders.forEach(h => {
        const pg = h.closest('.a4-page');
        if (!pg) return;
        if (!byPage.has(pg)) byPage.set(pg, []);
        byPage.get(pg).push(h);
    });
    byPage.forEach((hs, pg) => {
        const paras = pg.querySelectorAll('.main-column p, .single-wide-col p');
        let first = '', last = '';
        for (let i = 0; i < paras.length && !first; i++) { const w = wordsOf(paras[i]); if (w.length) first = w[0]; }
        for (let i = paras.length - 1; i >= 0 && !last; i--) { const w = wordsOf(paras[i]); if (w.length) last = w[w.length - 1]; }
        const txt = (first && last && first !== last) ? (first + ' \u2013 ' + last) : (first || last);
        hs.forEach(h => { h.textContent = txt; });
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

/* ==========================================================================
   עיצוב ואיפוס מונחי מספור הערות (כולל גרש, כוכביות וסוגריים)
   ========================================================================== */
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

/* [חדש] סימון הערת סיום "יבש" - למדידה בלבד (לא נרשם בתור ההערות ולא מקדם את המונה).
   סימון הערת הסיום מוצמד לסוף הפסקה רק אחרי שהיא הוצבה, ולכן קודם הוא לא נלקח בחשבון במדידת השורות: כשהמילה האחרונה
   נחתה בדיוק בקצה השורה, הסימון דחף אותה לשורה נוספת (שורה בודדת של מילה + סימון), והפסקה נרנדרה בשורה אחת יותר ממה
   שנמדד (פער בין המדידה לעימוד בפועל). הסימון היבש הוא באותו מספר (הבא בתור), גודל וסגנון כמו האמיתי. */
function createDryEndNoteMarker(markerText) {
    const m = document.createElement('a');
    m.className = 'note-marker';
    // markerText (מחרוזת) - טקסט הסימון בפועל, כשהוא ידוע (למשל בבדיקת מדידה אחרי העימוד); אחרת המספר הבא בתור
    m.textContent = (typeof markerText === 'string' && markerText) ? markerText : formatNoteMarker((noteCounters.endnote || 0) + 1, null);
    applyNoteMarkerStyle(m, false);
    return m;
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
        body.textContent = item.text;
        const inst = (typeof findExtTextStyle === 'function') ? findExtTextStyle(item.styleId) : null;
        if (inst && inst.def.style) applyExtStyleToNode(body, inst.def.style, 10);
        line.appendChild(num);
        line.appendChild(body);
        wrap.appendChild(line);
    });
    return wrap;
}

/* בונה את אזור הערות השוליים המלא (כותרת + קו + הערות) מתור נתון.
   משמש גם להצבה בפועל בעמוד וגם למדידה מדויקת של השטח שהוא תופס. */
function buildFootnoteAreaElement(queue) {
    const cfg0 = getNoteConfig(queue[0].styleId);
    const colCount = parseInt(document.getElementById('fn-columns')?.value, 10) || cfg0.columns || 1;
    const rule = buildNoteRuleElement();
    const block = buildNoteBlockElement(queue, colCount);
    const area = document.createElement('div');
    area.className = 'footnote-area';

    // כותרת מעל הערות שוליים ועיטורי צד (אם מוגדר)
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
    return area;
}

/* גובה מדויק (כולל שוליים) שאזור הערות השוליים יתפוס בעמוד.
   [תיקון] קודם הוא נאמד לפי גוף ההערות בלבד + 24px, בלי הקו המפריד והכותרת, ולכן נוצרה
   חפיפה/גלישה של עד ~16px בעמודים עם הערות. */
const __fnAreaHeightCache = new Map();
function measureFootnoteAreaHeight(queue) {
    if (!queue.length) return 0;
    const key = queue.map(i => i.uid + ':' + i.number + ':' + (i.text || '').length + ':' + (i.styleId || '')).join('|');
    if (__fnAreaHeightCache.has(key)) return __fnAreaHeightCache.get(key);
    const area = buildFootnoteAreaElement(queue);
    const refWrapper = document.querySelector('#book-container .page-content-wrapper');
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;visibility:hidden;left:-99999px;top:0;display:block;width:' + (refWrapper ? refWrapper.clientWidth + 'px' : '180mm') + ';';
    host.appendChild(area);
    document.body.appendChild(host);
    const cs = getComputedStyle(area);
    const h = Math.ceil(area.offsetHeight + (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0));
    document.body.removeChild(host);
    __fnAreaHeightCache.set(key, h);
    return h;
}

/* גופי הערות השוליים שמצויים בטקסט נתון ועוד לא נכנסו לתור (כדי לחשב מראש את השטח שיידרש להם) */
function getPendingFootnoteItems(text) {
    if (!text) return [];
    const out = [];
    findDelimiterMatches(text, 'body').forEach((m, idx) => {
        if (m.inst.def.target !== 'footnote') return;
        const openLen = m.inst.def.trigger.open.length, closeLen = m.inst.def.trigger.close.length;
        out.push({ number: 'א', text: text.slice(m.start + openLen, m.end - closeLen), styleId: m.inst.instanceId, uid: 'pend' + idx });
    });
    return out;
}

/* השטח שיש לשמור לתחתית העמוד עבור הערות השוליים: ההערות שכבר בתור + (אופציונלי) הערות
   שגלומות בטקסט שעומד להיות מוצב ועוד לא נכנסו לתור. */
function getFootnotesReservedHeight(extraText) {
    const extra = extraText ? getPendingFootnoteItems(extraText) : [];
    if (!footnoteQueueForPage.length && !extra.length) return 0;
    return measureFootnoteAreaHeight(footnoteQueueForPage.concat(extra));
}

function flushFootnotesInto(pageEl) {
    if (!footnoteQueueForPage.length) {
        resetNoteCounterIfNeeded('footnote', 'page');
        return;
    }

    const area = buildFootnoteAreaElement(footnoteQueueForPage);

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
    const h = probe.getBoundingClientRect().height;
    document.body.removeChild(probe);
    return h;
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

/* כותרת מובלעת בראש פסקה (run-in): כל מילה בכותרת עטופה ב-span משלה, כדי שחיתוך הפסקה לשורות/טורים/עמודים
   (שמפצל לפי רווחים) לעולם לא יחתוך תגית באמצע. למילה האחרונה יש ריווח אחריה; לשאר hri-mid (בלי ריווח נוסף).
   בסגנון מיובא (ext) העיצוב המוגדר בו (גופן/גודל/משקל/צבע/מסגרת) נכנס כ-style על כל span. */
function buildRunInHeadingHTML(ri) {
    const words = String(ri.text || '').split(/\s+/).filter(Boolean);
    let styleAttr = '';
    if (ri.customStyleId && typeof findExtTextStyle === 'function' && typeof applyExtStyleToNode === 'function') {
        const inst = findExtTextStyle(ri.customStyleId);
        if (inst) {
            const tmp = document.createElement('span');
            applyExtStyleToNode(tmp, inst.def.style, (typeof getBodySizePt === 'function') ? getBodySizePt() : 12);
            const css = tmp.getAttribute('style');
            if (css) styleAttr = ` style="${css.replace(/"/g, '&quot;')}"`;
        }
    }
    return words.map((w, i) => `<span class="heading-run-in${i < words.length - 1 ? ' hri-mid' : ''} title-level-${ri.level}"${styleAttr}>${w}</span>`).join(' ');
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

/* ============================================================
   בנייה ורינדור של תוכן העניינים (TOC)
   ============================================================ */
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
        const lvl = t.type.startsWith('h') ? t.level : (t.sideNote ? (t.sideNoteLevel || 7) : null);
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

    // הכותרת העליונה נבנית לכל עמוד בנפרד (buildHeaderGridHTML), כדי שגם בתוכן העניינים יחולו כותרות מתחלפות,
    // פיצול שם ספר, חיתוך טקסט ארוך ומספר עמוד - בדיוק כמו בעמודי התוכן.
    const customR = document.getElementById('hdr-r-custom')?.value || '';
    const customC = document.getElementById('hdr-c-custom')?.value || '';
    const customL = document.getElementById('hdr-l-custom')?.value || '';

    function getTocStyle(level) {
        const f = document.getElementById(`f-${tocPrefix}-${level}`);
        const s = document.getElementById(`s-${tocPrefix}-${level}`);
        if (f && s) return `font-family: ${f.value}; font-size: ${s.value}pt;`;
        return '';
    }

    while (currentEntryIdx < entries.length) {
        const isFirstTOCPage = (pagesCount === 0);
        pagesCount++;

        const page = document.createElement('div');
        page.className = 'a4-page toc-page';
        page.setAttribute('data-page-index', String(pageIndex + pagesCount - 1));
        applyContentBg(page, isFirstTOCPage ? 'tocFirst' : 'tocRegular');
        lastRenderedPage = page;

        const tocHeaderHTML = buildHeaderGridHTML(pageIndex + pagesCount - 1, curH1 || titleText, curH2 || titleText, '', bookTitle, customR, customC, customL, {}, titleText);
        // [תיקון] מספר העמוד בתחתית עמוד תוכן עניינים נגזר מאותן הגדרות מספור כמו עמודי התוכן (מיקום, פורמט, מסגרת, עמוד התחלה).
        // בברירת המחדל (אותיות, תחתית במרכז, מתחיל מ-1) התוצאה זהה לקודמת.
        const tocPN = formatPageNumberDisplay(pageIndex + pagesCount - 1);
        const tocFooterClass = (tocPN.pageNumPos === 'bottom_outer') ? 'pos-outer' : 'pos-center';
        const tocShowFooter = (tocPN.pageNumPos === 'bottom_center' || tocPN.pageNumPos === 'bottom_outer') && tocPN.displayPageNum;
        page.innerHTML = `
      <div class="page-content-wrapper">
        ${tocHeaderHTML}
        <div class="page-body-flow">
          ${isFirstTOCPage ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" style="margin-top: 0; margin-bottom: 25px;">${titleText}</div>` : ''}
          <div class="toc-grid-full"></div>
        </div>
        <div class="page-number-footer ${tocFooterClass}">${tocShowFooter ? tocPN.framedPageNum : ''}</div>
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
                const inlineSpans = it.items.map(grp => `<span class="grp-item grp-lvl-${grp.level}" style="${getTocStyle(grp.level)}"><a href="#heading-tok-${grp.id}" style="text-decoration: none; color: inherit; outline: none;"><span class="grp-title">${grp.text}</span> - <span class="grp-page" data-target-id="${grp.id}"></span></a></span>`).join('<span class="grp-sep">|</span>');
                itemHTML = `<div class="toc-entry-group"><div class="toc-grouped-block">${inlineSpans}</div></div>`;
            } else {
                itemHTML = `
          <div class="toc-entry-group" style="${getTocStyle(it.level)}">
            <a href="#heading-tok-${it.id}" class="toc-item toc-lvl-${it.level}" style="text-decoration: none; color: inherit; outline: none;">
              <span class="toc-title">${it.text}</span>
              <span class="toc-dots"></span>
              <span class="toc-page-num" data-target-id="${it.id}"></span>
            </a>
          </div>
        `;
            }

            gridFull.insertAdjacentHTML('beforeend', itemHTML);

            if (bodyFlow.scrollHeight > maxH) {
                gridFull.lastElementChild.remove();
                if (gridFull.children.length > 0) {
                    if (lastSubjectIdx > pageStartIndex) {
                        const itemsToRemove = currentEntryIdx - lastSubjectIdx;
                        for (let k = 0; k < itemsToRemove; k++) gridFull.lastElementChild.remove();
                        currentEntryIdx = lastSubjectIdx;
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
   typesetter.js - מנוע העימוד המרכזי לדפי A4
   חלק ג'1: מנוע העימוד (typesetDocument), טוקנים, Run-in ושערים
   (יש להדביק חלק זה מיד בהמשך חלק ב')
   ========================================================================== */

/* ==========================================================================
   [תיקון באג קריטי שאותר בהרצה אמיתית] עימוד שתלוי בגודל חלון הדפדפן
   --------------------------------------------------------------------------
   #book-container מוקטן/מוגדל ב-transform:scale (זום התצוגה המקדימה, שנקבע לפי רוחב החלון).
   getBoundingClientRect() מחזיר מידות *אחרי* הסקאלה, ולכן כל מדידה דרכו בתוך הדפים
   (גובה כותרת פרק ועיטוריה, גובה הערות צד, גובה כותרת-רוחב) הייתה תלויה ברוחב החלון:
   אותו מסמך יצא 99 עמודים בחלון צר, 104 בחלון רחב, ועמוד תחילת הפרק נחתך מוקדם/מאוחר מדי.
   הפתרון הכפול:
   (1) typesetDocument עוטפת את הליבה ומקפיאה את הסקאלה (transform:none) לאורך כל העימוד,
       ומחזירה אותה בסיומו - כך כל מדידה היא בפיקסלי פריסה אמיתיים.
   (2) layoutHeightOf מחלקת בסקאלה הנוכחית - רשת ביטחון לכל מדידה שתתבצע מחוץ לעטיפה.
   ========================================================================== */
function getPreviewScaleFactor() {
    const host = document.getElementById('book-container');
    if (!host) return 1;
    const cs = getComputedStyle(host).transform;
    if (!cs || cs === 'none') return 1;
    const m = cs.match(/^matrix\(([^,]+),/);
    const s = m ? parseFloat(m[1]) : 1;
    return (s > 0 && isFinite(s)) ? s : 1;
}

function layoutHeightOf(el) {
    return el.getBoundingClientRect().height / getPreviewScaleFactor();
}

/* [תיקון] רוחב פריסה מדויק (עם שבר) של אלמנט. offsetWidth מעגל למספר שלם (269.42 -> 269), ושימוש בו כרוחב
   למדידת שורות יצר פער בין השורות שנמדדו לשורות שהתקבלו בפועל: שורה שנמדדה כגולשת ברוחב 269 נכנסת בפועל
   ברוחב 269.42, ופסקה שהוחלט לחתוך 4+2 נרנדרה 4+1 (שורה בודדת בראש טור). כשהשבר מעל 0.5 הפער הפוך (גלישה).
   getComputedStyle מחזיר את הרוחב הלא-מוקטן, ולכן גם לא תלוי בסקאלת התצוגה. */
function exactWidthOf(el) {
    if (!el) return 0;
    const w = parseFloat(window.getComputedStyle(el).width);
    /* getComputedStyle מחזיר רק 3 ספרות אחרי הנקודה (274.859 במקום 274.859375). הרוחב האמיתי תמיד כפולה של 1/64 פיקסל
       (יחידת הפריסה של הדפדפן), ולכן ההחזרה לכפולה הקרובה משחזרת אותו במדויק. קודם הקיצוץ ל-3 ספרות צמצם את הרוחב
       במדידה בעד 0.016px, ושורה שנכנסה בקושי נמדדה כגולשת (פסקה שנמדדה בחמש שורות נרנדרה בארבע). */
    return (w > 0) ? Math.round(w * 64) / 64 : (el.offsetWidth || 0);
}

/* [חדש] רוחב הטקסט האמיתי של אלמנט (השורה הרחבה ביותר) ביחידות פריסה.
   רוחב תיבת הכותרת עצמה הוא תמיד רוחב הטור, ולכן מודדים את תוכן הטקסט בעזרת Range. */
function measureTextWidthOf(el) {
    if (!el) return 0;
    const rng = document.createRange();
    rng.selectNodeContents(el);
    return rng.getBoundingClientRect().width / getPreviewScaleFactor();
}

/* [חדש] "התאם רוחב עיטור לרוחב טקסט הכותרת" (כותרת 2): מקבע לעיטורים העליון והתחתון את רוחב הטקסט שהם מלווים.
   תחולה "על שניהם": הרחב מבין שורת הסימן והכותרת; "רק שורת הסימן": רוחב הסימן; "רק טקסט הכותרת": רוחב הכותרת.
   הרוחב נקבע בפיקסלים לפי מדידה אמיתית בדפדפן (ולכן מדויק לכל גופן וכל אורך כותרת). מחזיר את הרוחב שנקבע (0 = לא נקבע). */
function fitH2OrnamentsToText(flowEl, scope, simanElem, titleEl) {
    const wTitle = measureTextWidthOf(titleEl);
    const wSiman = simanElem ? measureTextWidthOf(simanElem) : 0;
    let w;
    if (scope === 'siman_only' && simanElem) w = wSiman;
    else if (scope === 'title_only') w = wTitle;
    else w = Math.max(wTitle, wSiman);
    if (!(w > 1)) return 0;
    w = Math.round(w * 10) / 10;
    flowEl.querySelectorAll('.h2-ornament-top .fit-heading-text .ornament-svg-inner, .h2-ornament-bottom .fit-heading-text .ornament-svg-inner, .h2-ornament-top .fit-heading-text > img, .h2-ornament-bottom .fit-heading-text > img').forEach(box => {
        box.style.width = w + 'px';
        box.style.maxWidth = '100%';
    });
    return w;
}

/* [חדש] קו ההפרדה האנכי בין הטורים: מותאם בדיוק לתחום הטקסט של הבלוק - מראש השורה הראשונה ועד סוף השורה האחרונה
   (בטור הארוך מבין השניים) - ולא לגובה כל תא ה-grid, שכולל את רווח סוף הפסקה האחרונה (כ-7px) ועוד הזחה של הקו עצמו,
   ולכן הקו בלט כ-11px מתחת לקצה הטקסט. הקו מקבל הזחה קבועה מלמעלה ומלמטה (כמו המרווח המקורי שלו).
   נקרא פעם אחת בסוף העימוד, אחרי שכל הבלוקים סופיים (איזון, ישור וגובה תחתון). קריאות כל המדידות לפני כל הכתיבות. */
const COL_DIVIDER_INSET_PX = 4;
function fitColumnDividers(container) {
    if (!container) return 0;
    const scale = getPreviewScaleFactor() || 1;
    const plan = [];
    container.querySelectorAll('.block-2col').forEach(blk => {
        const dv = blk.querySelector(':scope > .col-gutter-divider');
        if (!dv || dv.classList.contains('col-rule-none')) return;
        let top = Infinity, bottom = -Infinity;
        blk.querySelectorAll(':scope > .main-column').forEach(col => {
            const kids = Array.from(col.children).filter(k => k.getBoundingClientRect().height > 0);
            if (!kids.length) return;
            top = Math.min(top, kids[0].getBoundingClientRect().top);
            bottom = Math.max(bottom, kids[kids.length - 1].getBoundingClientRect().bottom);
        });
        if (!isFinite(top) || !isFinite(bottom)) return;
        plan.push({ dv, offset: (top - blk.getBoundingClientRect().top) / scale, h: (bottom - top) / scale });
    });
    plan.forEach(({ dv, offset, h }) => {
        const len = Math.max(0, h - 2 * COL_DIVIDER_INSET_PX);
        dv.style.marginTop = (offset + COL_DIVIDER_INSET_PX).toFixed(2) + 'px';
        dv.style.marginBottom = '0';
        dv.style.height = len.toFixed(2) + 'px';
    });
    return plan.length;
}

/* תווית מספר עמוד לתוכן עניינים - זהה לתצוגה בתחתית העמוד (פורמט, מסגרת-בלי, עמוד התחלה), עם נפילה לגימטריה */
function getTocPageLabel(pNum) {
    const d = formatPageNumberDisplay(pNum).displayPageNum;
    return d || toGematria(pNum);
}

/* בונה מחדש את מפת "כותרת -> מספר עמוד" לפי מה שנמצא בפועל בעמודים שנוצרו.
   כותרת (רמות 2-6 ורוחביות) או פסקה עם הערת צד - המופע הראשון (לא המשך) קובע את העמוד. */
function rebuildHeadingPageMapFromDOM(container, headingPageMap) {
    const seen = new Set();
    container.querySelectorAll('.a4-page').forEach(pg => {
        const flow = pg.querySelector('.page-body-flow');
        const idx = parseInt(pg.getAttribute('data-page-index'), 10);
        if (!flow || !idx) return;
        const label = getTocPageLabel(idx);
        flow.querySelectorAll('[data-token-id]').forEach(el => {
            const id = el.getAttribute('data-token-id');
            if (seen.has(id)) return;
            const isHeading = /(^|\s)(title-level-|h3-title-text)/.test(el.className);
            const isSideNoteP = el.tagName === 'P' && el.hasAttribute('data-side-note') && el.getAttribute('data-is-cont') !== 'true';
            if (isHeading || isSideNoteP) {
                seen.add(id);
                headingPageMap[id] = label;
            }
        });
    });
}

/* ==========================================================================
   מנגנון "עדכן ועמד מחדש"
   עימוד מלא של מסמך ארוך אורך כחמש שניות, ולכן הגדרות שמשפיעות על חלוקת העמודים (גופנים, גדלים, ריווח,
   מצבי כותרות, הערות, כותרות עליונות, רשת העמוד, תוכן עניינים וכו') לא מעמידות את המסמך בכל שינוי:
   הן רק מסמנות "יש שינויים ממתינים" ומדליקות את כפתורי "עדכן ועמד מחדש".
   הגדרות שאינן משנות את חלוקת העמודים - איור השערים, טקסטי השער ורקעי העמודים - מתעדכנות מיד ומקומית:
   מוחלפים רק עמודי השער / מוחל מחדש הרקע, בלי לעמד את המסמך.
   ההבחנה נעשית לפי האלמנט שיצר את האירוע (window.event.target): רק פקד הגדרות (input/select/textarea בתוך
   #settings-pane) נחשב "שינוי הגדרה". כל קריאה אחרת - כפתור העדכון, ייבוא קובץ, אתחול, פעולות מפורשות -
   מעמידה מיד כמו קודם.
   ========================================================================== */
let settingsDirty = false;
let __typesetTimer = null;

const LIVE_COVER_ID_RE = /^(active-theme-select|select-shaar-(main|back|sub)|inp-book-(title|subtitle|desc|sections|author|year)|[fs]-sh-[a-z]+)$/;
const LIVE_BG_ID_RE = /^cbg-/;

/* מסווג את פקד ההגדרות שיצר את האירוע: 'cover' / 'bg' / 'doc', או null אם זו לא "הגדרה" (כפתור, קובץ, מחוץ ללוח) */
function classifySettingControl(el) {
    if (!el || el.nodeType !== 1) return null;
    const tag = el.tagName;
    if (tag !== 'INPUT' && tag !== 'SELECT' && tag !== 'TEXTAREA') return null;
    if (tag === 'INPUT' && (el.type === 'file' || el.type === 'button' || el.type === 'submit')) return null;
    if (!el.closest || !el.closest('#settings-pane')) return null;
    const id = el.id || '';
    if (LIVE_COVER_ID_RE.test(id)) return 'cover';
    if (LIVE_BG_ID_RE.test(id)) return 'bg';
    return 'doc';
}

/* מדליק/מכבה את חיווי "יש שינויים שטרם הוחלו" בכפתורי העדכון */
function setSettingsDirty(flag) {
    settingsDirty = !!flag;
    document.body.classList.toggle('has-pending-settings', settingsDirty);
    document.querySelectorAll('[data-retypeset-btn]').forEach(b => {
        b.classList.toggle('has-pending', settingsDirty);
        b.title = settingsDirty ? 'יש שינויים בהגדרות שטרם הוחלו על העימוד - לחץ להחלה' : 'עימוד מחדש של המסמך לפי ההגדרות הנוכחיות';
    });
}

/* מצב "מעמד..." על כפתורי העדכון (נותן לדפדפן לצייר אותו לפני העבודה הסינכרונית הכבדה) */
function setTypesetBusy(flag) {
    document.body.classList.toggle('is-typesetting', !!flag);
    document.querySelectorAll('[data-retypeset-btn]').forEach(b => {
        if (flag) {
            if (!b.hasAttribute('data-label')) b.setAttribute('data-label', b.textContent);
            b.textContent = '⏳ מעמד…';
            b.disabled = true;
        } else {
            if (b.hasAttribute('data-label')) { b.textContent = b.getAttribute('data-label'); b.removeAttribute('data-label'); }
            b.disabled = false;
        }
    });
}

/* מחליף במקום את עמודי השער (ראשי/אחורי/משנה) לפי ההגדרות הנוכחיות, בלי עימוד מחדש. מחזיר true אם נמצא מה לרענן */
function refreshCoversInPlace() {
    const container = document.getElementById('book-container');
    if (!container) return false;
    updateCoverStyles();
    const themeId = document.getElementById('active-theme-select')?.value || 'builtin_1';
    let found = 0;
    const swap = (oldPage, build) => {
        const tmp = document.createElement('div');
        build(tmp);
        const fresh = tmp.firstElementChild;
        if (!fresh) return;
        // שומרים את מאפייני העימוד שהוצמדו לעמוד אחרי יצירתו (אינדקס עמוד, שורה ראשונה בטקסט וכו')
        for (const a of Array.from(oldPage.attributes)) {
            if (a.name.startsWith('data-')) fresh.setAttribute(a.name, a.value);
        }
        oldPage.replaceWith(fresh);
        found++;
    };
    container.querySelectorAll('.a4-page.main-shaar-page').forEach(p => swap(p, tmp => renderMainShaar(tmp, themeId)));
    container.querySelectorAll('.a4-page.back-shaar-page').forEach(p => swap(p, tmp => renderBackShaar(tmp, themeId)));
    container.querySelectorAll('.a4-page.sub-shaar-page').forEach(p => {
        const id = p.getAttribute('data-token-id');
        const tok = (globalTokens || []).find(x => String(x.id) === String(id));
        if (tok) swap(p, tmp => renderSubShaar(tmp, tok, themeId));
    });
    return found > 0;
}

/* מחיל מחדש את רקעי העמודים (ללא עימוד): כל עמוד זוכר באיזה תפקיד רקע הוא (data-bg-role) */
function refreshContentBackgrounds() {
    const container = document.getElementById('book-container');
    if (!container) return false;
    const pages = container.querySelectorAll('.a4-page[data-bg-role]');
    pages.forEach(p => {
        ['backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat'].forEach(k => { p.style[k] = ''; });
        (p.getAttribute('data-bg-role') || '').split(' ').filter(Boolean).forEach(role => applyContentBg(p, role));
    });
    return pages.length > 0;
}

/* תמונה שהועלתה מהקובץ (FileReader) - מתעדכנת מיד אם זה רקע עמוד, אחרת ממתינה ללחיצה על "עדכן ועמד מחדש" */
function applyUploadedImageSetting(targetInputId) {
    if (/^data-cbg-/.test(targetInputId)) {
        if (!refreshContentBackgrounds()) setSettingsDirty(true);
    } else if (/^data-builder-/.test(targetInputId)) {
        // קובצי SVG של "יצירת ערכת נושא": נשמרים בשדה בלבד עד הלחיצה על "הטמע ערכת נושא"
    } else {
        setSettingsDirty(true);
    }
}

/* נקודת הכניסה היחידה לעימוד - כל ה-oninput/onchange בלוח ההגדרות וכפתור העדכון קוראים לה.
   delay (מילישניות) - רק לקריאות מפורשות (כפתור העדכון / טעינה): מצייר "מעמד..." ומעמד אחרי ההשהיה */
function typesetDocument(delay) {
    const ev = (typeof window !== 'undefined') ? window.event : null;
    const src = ev && ev.target && ev.target.nodeType === 1 ? ev.target : null;
    const kind = classifySettingControl(src);
    if (kind === 'cover') {
        const refreshed = refreshCoversInPlace();
        if (!refreshed || src.id === 'inp-book-title') setSettingsDirty(true); // שם הספר מופיע גם בכותרות העליונות ובתוכן העניינים
        return;
    }
    if (kind === 'bg') {
        if (!refreshContentBackgrounds()) setSettingsDirty(true);
        return;
    }
    if (kind === 'doc') {
        setSettingsDirty(true);
        return;
    }
    if (typeof delay === 'number' && delay > 0) {
        clearTimeout(__typesetTimer);
        setTypesetBusy(true);
        __typesetTimer = setTimeout(() => {
            requestAnimationFrame(() => setTimeout(() => {
                try { typesetDocumentNow(); } finally { setTypesetBusy(false); }
            }, 0));
        }, delay);
        return;
    }
    return typesetDocumentNow();
}

/* העימוד עצמו (עוטף את הליבה): מקפיא את סקאלת התצוגה לאורך כל העימוד ומכבה את חיווי "שינויים ממתינים" */
function typesetDocumentNow() {
    const host = document.getElementById('book-container');
    const prevTransform = host ? host.style.transform : '';
    const prevTransition = host ? host.style.transition : '';
    if (host) {
        host.style.transition = 'none';
        host.style.transform = 'none';
    }
    try {
        return typesetDocumentCore();
    } finally {
        if (host) {
            host.style.transform = prevTransform;
            host.offsetWidth; // כופה חישוב-סגנון לפני החזרת האנימציה, כדי שלא תתרחש אנימציית זום מיותרת
            host.style.transition = prevTransition;
        }
        setSettingsDirty(false);
        if (typeof updatePreviewScale === 'function') updatePreviewScale();
    }
}

/* הדפסה / PDF: אם יש שינויים ממתינים - מעמדים קודם, כדי שההדפסה תתאים להגדרות שמוצגות */
function printDocument() {
    if (settingsDirty) typesetDocumentNow();
    window.print();
}
window.addEventListener('beforeprint', () => { if (settingsDirty) typesetDocumentNow(); });

function typesetDocumentCore() {
    updateGrid();
    updateStyles();

    noteCounters = {
        footnote: 0,
        endnote: 0
    };
    noteUidCounter = 0;
    footnoteQueueForPage = [];
    endnoteQueueForPart = [];
    __fnAreaHeightCache.clear();

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

    let rawText = document.getElementById('raw-input')?.value || '';
    if (!rawText.trim()) return;

    rawText = stripEditorialNotes(rawText);
    if (typeof extPageSourceText !== 'undefined') extPageSourceText = rawText;   // [חדש] מקור שורות לעמודים מיובאים (לפני הסרת המטא-דאטה)
    rawText = parseMetadataFromText(rawText);
    if (typeof blankExtPageTypeLines === 'function') rawText = blankExtPageTypeLines(rawText, extPageSourceText);   // [חדש] שורות שמזינות עמוד מיובא אינן טקסט גוף
    // ביטול רווחים לפני סוגר פותח של הערה כדי להדביק אותה למילה שלפניה (מונע שבירת שורה ויתמות)
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
    const h2OrnScope = document.getElementById('h2-orn-scope')?.value || 'both';
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
    let pendingSideNoteLevel = null;   // רמת הכותרת שהפכה להערת צד (5/6 במצב "כותרת צד"); null = כותרת 7 רגילה
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
            pendingEndNote = line.slice(enLinePrefix.length).replace(/^\s*[:\-–—]\s*/, '').trim();
            lineToTokenMap[lineIdx] = null;
            continue;
        }

        const hMatch = line.match(/^כותרת\s*(\d+).*?[-–—]\s*(.*)$/);
        if (hMatch) {
            const lvl = parseInt(hMatch[1], 10);
            const txt = hMatch[2].trim();
            const hModeSel = document.getElementById('mode-h' + lvl)?.value;
            if (lvl === 7 && hModeSel !== 'inline_2col') {
                // כותרת 7 היא הערת צד, אלא אם נבחר "רציף ב-2 טורים" - אז היא כותרת רגילה בתוך הטור
                pendingSideNote = txt;
                pendingSideNoteStyleId = null;
                pendingSideNoteLevel = null;
                lineToTokenMap[lineIdx] = null;
            } else if ((lvl === 5 || lvl === 6) && hModeSel === 'side_note') {
                // [חדש] כותרת 5/6 במצב "כותרת צד": עוברת לשוליים מול הפסקה שאחריה, בעיצוב של הרמה שלה
                pendingSideNote = txt;
                pendingSideNoteStyleId = null;
                pendingSideNoteLevel = lvl;
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
                            text: line.slice(trig.prefix.length).replace(/^\s*[:\-–—]\s*/, '').trim()
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
                    pendingSideNoteLevel = null;
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
                    paragraphText = buildRunInHeadingHTML(pendingRunInHeading) + ' ' + paragraphText;
                    pendingRunInHeading = null;
                }

                const tokenObj = {
                    id: tokens.length,
                    type: 'p',
                    text: paragraphText,
                    sideNote: pendingSideNote,
                    sideNoteStyleId: pendingSideNoteStyleId,
                    sideNoteLevel: pendingSideNote ? pendingSideNoteLevel : null,
                    endNote: pendingEndNote,
                    lineIdx: lineIdx
                };
                tokens.push(tokenObj);
                lineToTokenMap[lineIdx] = tokenObj.id;
                pendingSideNote = null;
                pendingSideNoteStyleId = null;
                pendingSideNoteLevel = null;
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
    let currentH3Title = '';
    let currentH4Title = '';

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

    if (showMainShaar) {
        renderExtAnchor(container, 'beforeAll', rawText);
        renderMainShaar(container, activeThemeId, pageIndex);
        if (document.getElementById('main-shaar-count-numbering')?.checked) pageIndex++;
        renderExtAnchor(container, 'afterMainShaar', rawText);
    } else {
        renderExtAnchor(container, 'beforeAll', rawText);
    }

    if (showBackShaar) {
        renderBackShaar(container, activeThemeId, pageIndex);
        if (document.getElementById('back-shaar-count-numbering')?.checked) pageIndex++;
    }

    if (enableGeneralTOC) {
        const generalTocEntries = buildStructuredTOC(tokens, gtocShows, gtocGroups);
        const pagesRendered = renderPaginatedTOC(container, generalTocEntries, "תוכן עניינים כללי", bookTitle, "תוכן עניינים כללי", pageIndex, "תוכן עניינים כללי", "תוכן עניינים כללי", "gtoc");
        pageIndex += pagesRendered;
    }
    renderExtAnchor(container, 'afterGeneralToc', rawText);

    const styleObj = {
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
        lineHeight: getComputedStyle(document.documentElement).getPropertyValue('--line-height-body') || '1.34'
    };

    // (getFootnotesReservedHeight מוגדרת עכשיו ברמת הקובץ ומודדת את אזור ההערות המלא בדיוק)

    let hasOpenPart = false;
    let prevPageEl = null;

    /* ניסיון חוזר ברמת עמוד: הערות שוליים שנכנסות לעמוד דרך פסקה בטור השמאלי מקטינות את הגובה הפנוי
       לשני הטורים, אבל הטור הימני כבר מולא בגובה הגדול יותר (ההערה עוד לא הייתה ידועה).
       בסוף העמוד בודקים אם השטח הפנוי מכסה את אזור ההערות בפועל; אם לא - בונים את העמוד מחדש
       כשהשטח שנשמר להערות נקבע מראש כגובה האמיתי שנמצא. */
    let pageReserveFloor = 0, redoAttempts = 0, redoPending = false;
    const reservedNow = (txt) => Math.max(getFootnotesReservedHeight(txt), pageReserveFloor);

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
        const sec = sections[sIdx];

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
                // [תוקן] הפרמטר הרביעי הוא שם הספר (קודם הועבר כאן שם החלק, ולכן כותרת עליונה מסוג "שם הספר" הציגה את שם החלק בתוכן המפורט)
                const dtocPages = renderPaginatedTOC(container, detailedTocEntries, "תוכן עניינים מפורט", bookTitle, "תוכן עניינים מפורט", pageIndex, currentH1Title, "תוכן עניינים מפורט", "dtoc");
                pageIndex += dtocPages;
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

            if (!redoPending) { pageReserveFloor = 0; redoAttempts = 0; }
            redoPending = false;
            const pageState = {
                tokenIndex, pendingWordTokens, isFirstPage, pageIndex,
                fnQ: footnoteQueueForPage.length, enQ: endnoteQueueForPart.length,
                cFn: noteCounters.footnote, cEn: noteCounters.endnote, uid: noteUidCounter,
                h1: currentH1Title, h2: currentH2Title, h3: currentH3Title, h4: currentH4Title,
                prevPageEl
            };

            const pageRole = isFirstPage ? (isH0 ? 'h0Open' : (h2Text ? 'h2Open' : 'regular')) : 'regular';
            const pageContext = {
                simanBadge: simanLabel,
                rawH2WithoutSiman: displayH2Text,
                h4Title: currentH4Title
            };

            let pageLayout = createPageLayout(container, isFirstPage ? h2Text : '', isFirstPage ? h2Id : undefined, pageIndex, currentH1Title, currentH2Title, currentH3Title, bookTitle, customR, customC, customL, pageRole, pageContext);
            pageIndex++;
            prevPageEl = pageLayout.page;

            const firstLineIdxOnPage = (isFirstPage && h2Text && sec.hToken) ? sec.hToken.lineIdx : (pendingWordTokens ? pendingWordTokens.token.lineIdx : (secTokens[tokenIndex] ? secTokens[tokenIndex].lineIdx : null));
            if (firstLineIdxOnPage !== null && firstLineIdxOnPage !== undefined) {
                pageLayout.page.setAttribute('data-first-line-idx', String(firstLineIdxOnPage));
                recordPageBreak(pageIndex - 1, firstLineIdxOnPage);
            }

            let totalFlowH = pageLayout.bodyFlow.clientHeight || 870;
            let used = 0;

            if (isFirstPage && h2Text) {
                const spacer = pageLayout.bodyFlow.querySelector('.h2-spacer');
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

                    // טיפול בתחולת עיטורי כותרת 2 (על שניהם / רק סימן / רק כותרת)
                    const topOrnHTML = (h2OrnTopStyle && h2OrnTopStyle !== 'none') ? getHeadingOrnamentHTML(h2OrnTopStyle, true, true) : '';
                    const btmOrnHTML = (h2OrnBtmStyle && h2OrnBtmStyle !== 'none') ? getHeadingOrnamentHTML(h2OrnBtmStyle, false, true) : '';

                    if (h2OrnScope === 'both' || !simanElem) {
                        if (topOrnHTML) {
                            const ornWrap = document.createElement('div');
                            ornWrap.className = 'h2-ornament-top';
                            ornWrap.innerHTML = topOrnHTML;
                            const insertTarget = simanElem || title;
                            insertTarget.parentNode.insertBefore(ornWrap, insertTarget);
                        }
                        if (btmOrnHTML) {
                            const ornWrap = document.createElement('div');
                            ornWrap.className = 'h2-ornament-bottom';
                            ornWrap.innerHTML = btmOrnHTML;
                            title.parentNode.insertBefore(ornWrap, title.nextSibling);
                        }
                    } else if (h2OrnScope === 'siman_only' && simanElem) {
                        if (topOrnHTML) {
                            const ornWrap = document.createElement('div');
                            ornWrap.className = 'h2-ornament-top';
                            ornWrap.innerHTML = topOrnHTML;
                            simanElem.parentNode.insertBefore(ornWrap, simanElem);
                        }
                        if (btmOrnHTML) {
                            const ornWrap = document.createElement('div');
                            ornWrap.className = 'h2-ornament-bottom';
                            ornWrap.innerHTML = btmOrnHTML;
                            simanElem.parentNode.insertBefore(ornWrap, title);
                        }
                    } else if (h2OrnScope === 'title_only') {
                        if (topOrnHTML) {
                            const ornWrap = document.createElement('div');
                            ornWrap.className = 'h2-ornament-top';
                            ornWrap.innerHTML = topOrnHTML;
                            title.parentNode.insertBefore(ornWrap, title);
                        }
                        if (btmOrnHTML) {
                            const ornWrap = document.createElement('div');
                            ornWrap.className = 'h2-ornament-bottom';
                            ornWrap.innerHTML = btmOrnHTML;
                            title.parentNode.insertBefore(ornWrap, title.nextSibling);
                        }
                    }

                    // [חדש] התאמת רוחב העיטורים לרוחב טקסט הכותרת (כשהאפשרות מסומנת)
                    if (document.getElementById('h2-orn-fit-text')?.checked && (topOrnHTML || btmOrnHTML)) {
                        fitH2OrnamentsToText(pageLayout.bodyFlow, h2OrnScope, simanElem, title);
                    }
                }

                if (spacer) used += layoutHeightOf(spacer);
                const headerEls = pageLayout.bodyFlow.querySelectorAll('.h2-ornament-top, .h2-siman-badge, .title-level-2-standalone, .h2-ornament-bottom');
                headerEls.forEach(el => {
                    used += layoutHeightOf(el);
                    const st = window.getComputedStyle(el);
                    used += (parseFloat(st.marginTop) || 0) + (parseFloat(st.marginBottom) || 0);
                });
            }

            let remPageHeight = isFirstPage ? (totalFlowH - used) : totalFlowH;
            isFirstPage = false;

            const redoCheck = () => {
                const reserve = getFootnotesReservedHeight();
                if (!reserve || remPageHeight - reserve >= -0.5 || redoAttempts >= 2) return false;
                if (pageLayout.page.parentNode) pageLayout.page.parentNode.removeChild(pageLayout.page);
                tokenIndex = pageState.tokenIndex;
                pendingWordTokens = pageState.pendingWordTokens;
                isFirstPage = pageState.isFirstPage;
                pageIndex = pageState.pageIndex;
                footnoteQueueForPage.length = pageState.fnQ;
                endnoteQueueForPart.length = pageState.enQ;
                noteCounters.footnote = pageState.cFn;
                noteCounters.endnote = pageState.cEn;
                noteUidCounter = pageState.uid;
                currentH1Title = pageState.h1; currentH2Title = pageState.h2;
                currentH3Title = pageState.h3; currentH4Title = pageState.h4;
                prevPageEl = pageState.prevPageEl;
                pageReserveFloor = reserve;
                redoAttempts++;
                redoPending = true;
                return true;
            };

            /* [חדש] ישור תחתית העמוד: בעמוד שהפרק ממשיך אחריו, הרווח שנשאר מתחת לבלוק האחרון נפרס על הרווחים
               שבין הפסקאות, כך שכל העמודים נגמרים על אותו קו תחתון (בלי "שיניים" בתחתית העמוד).
               העמוד האחרון בפרק אינו נמתח (שם סיום לא-מלא הוא תקין). */
            const stretchPageToBottom = () => {
                if (!(tokenIndex < secTokens.length || pendingWordTokens)) return;
                const flow = pageLayout.bodyFlow;
                const lastEl = flow.lastElementChild;
                if (!lastEl || !(lastEl.classList.contains('block-2col') || lastEl.classList.contains('block-single-col'))) return;
                const flowBottom = flow.getBoundingClientRect().top + totalFlowH;
                const free = (flowBottom - reservedNow()) - lastEl.getBoundingClientRect().bottom - 1;
                stretchLastBlockToBottom(flow, free, styleObj, PAGE_STRETCH_MAX);
            };
			if (isH0) {
                const singleBlock = document.createElement('div');
                singleBlock.className = 'block-single-col';
                singleBlock.innerHTML = `<div class="single-wide-col"></div>`;
                pageLayout.bodyFlow.appendChild(singleBlock);
                const targetCol = singleBlock.querySelector('.single-wide-col');
                let pageHasContent = false;

                /* [תיקון] מדידת השורות לפי הרוחב והגופן האמיתיים של טור ההקדמה. קודם נמדד תמיד ברוחב 580px ובגופן
                   גוף הספר, בעוד הטור ברוחב אחר ובגופן "טקסט כותרת 0" - ולכן שורה אחרונה של חלק חתוך (בתחתית עמוד)
                   נחתכה באמצע שורה אמיתית ו"נמתחה" על כל הרוחב. */
                const h0RootCs = window.getComputedStyle(document.documentElement);
                const h0Style = {
                    fontFamily: h0RootCs.getPropertyValue('--fn-h0-body') || styleObj.fontFamily,
                    fontSize: h0RootCs.getPropertyValue('--sz-h0-body') || styleObj.fontSize,
                    lineHeight: styleObj.lineHeight
                };
                const h0ColWidth = exactWidthOf(targetCol) || 580;
                /* [תיקון] הערות צד והערות סיום בהקדמה: קודם נעלמו בשקט. שוליים להערות נוצרים רק כשיש הערת צד,
                   כך שהקדמה בלי הערות נשארת זהה לחלוטין. */
                let h0Margin = null;
                const h0PendingNotes = [];

                while (tokenIndex < secTokens.length || pendingWordTokens) {
                    const currentAvailH = remPageHeight - reservedNow();
                    if (targetCol.scrollHeight >= currentAvailH - 10 && targetCol.children.length > 0) {
                        tokenIndex -= rollbackTrailingHeadings(targetCol);
                        break;
                    }

                    let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];

                    if (currentTok.type.startsWith('h')) {
                        if (currentTok.level === 3) currentH3Title = currentTok.text;
                        if (currentTok.level === 4) currentH4Title = currentTok.text;
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

                        if (targetCol.scrollHeight > (remPageHeight - reservedNow()) && targetCol.children.length > 1) {
                            targetCol.removeChild(hElem);
                            tokenIndex -= rollbackTrailingHeadings(targetCol);
                            break;
                        }
                        headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                        tokenIndex++;
                        continue;
                    }

                    if (currentTok.type === 'p') {
                        let linesInfo = getLinesFromParagraph(currentTok.text, h0ColWidth, h0Style, true, !!currentTok.endNote);
                        let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                        let isContinuation = !!pendingWordTokens;
                        let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                        const pElem = document.createElement('p');
                        pElem.setAttribute('data-token-id', currentTok.id);
                        pElem.setAttribute('data-is-cont', isContinuation ? 'true' : 'false');
                        if (currentTok.endNote) pElem.setAttribute('data-end-note', currentTok.endNote);
                        targetCol.appendChild(pElem);

                        if (currentTok.sideNote && !headingPageMap[currentTok.id]) {
                            headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                        }

                        let bestFitLine = computeBestFitLine(pElem, targetCol, lines, isContinuation, hasWindow,
                            (txt) => remPageHeight - reservedNow(txt), !!currentTok.endNote);

                        // [תיקון] החלטת חיתוך אחת לכל הכללים: אין שורה בודדת בתחילת/סוף חיתוך, וכותרות לא נשארות לבדן
                        const placeLines = resolveParagraphSplit(lines.length, bestFitLine, !pageHasContent);
                        if (placeLines === 0) {
                            targetCol.removeChild(pElem);
                            tokenIndex -= rollbackTrailingHeadings(targetCol);
                            break;
                        }
                        bestFitLine = placeLines;

                        pageHasContent = true;

                        const chunk = lines.slice(0, bestFitLine).join(' ');
                        const isEndOfP = (bestFitLine === lines.length);
                        pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                        pElem.setAttribute('data-raw-text', chunk);
                        pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow, lines.length);
                        applyDelimiterStyles(pElem, 'body', getBodySizePt(), false);

                        if (currentTok.endNote && isEndOfP) {
                            pElem.appendChild(createNoteMarkerAndQueue(currentTok.endNote, null, 'endnote'));
                        }

                        if (!isContinuation && currentTok.sideNote) {
                            pElem.setAttribute('data-side-note', currentTok.sideNote);
                            if (currentTok.sideNoteStyleId) pElem.setAttribute('data-note-style-id', currentTok.sideNoteStyleId);
                            if (currentTok.sideNoteLevel) pElem.setAttribute('data-note-level', currentTok.sideNoteLevel);
                            if (!h0Margin) {
                                h0Margin = document.createElement('div');
                                h0Margin.className = 'margin-notes-column right-margin';
                                singleBlock.insertBefore(h0Margin, targetCol);
                            }
                            const noteElem = document.createElement('div');
                            noteElem.className = 'side-note-anchor';
                            noteElem.setAttribute('data-for-token', currentTok.id);
                            noteElem.textContent = currentTok.sideNote;
                            if (currentTok.sideNoteStyleId) {
                                const inst = findExtTextStyle(currentTok.sideNoteStyleId);
                                if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
                            }
                            applySideNoteLevelStyle(noteElem, currentTok.sideNoteLevel);
                            h0Margin.appendChild(noteElem);
                            h0PendingNotes.push({ elem: noteElem, pElem: pElem });
                        }

                        if (isEndOfP) {
                            pendingWordTokens = null;
                            tokenIndex++;
                        } else {
                            pendingWordTokens = {
                                token: currentTok,
                                remainingLines: lines.slice(bestFitLine)
                            };
                            break;
                        }
                    }
                }
                if (h0PendingNotes.length) finalizeNotePositions(h0PendingNotes, targetCol.scrollHeight);
                if (redoCheck()) continue;
                stretchPageToBottom();
                continue;
            }

            let pagePendingNotes = [];  // מתאפס בתחילת כל בלוק (הערות של בלוקים קודמים כבר מוקמו)
            let pageBodyHasContent = false; // האם כבר הוצב תוכן גוף בעמוד (כדי לדעת מתי חייבים להציב ואי אפשר לדחות)

            while ((tokenIndex < secTokens.length || pendingWordTokens) && (remPageHeight - reservedNow()) > 45) {
                let peekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                const peekMode = peekTok && peekTok.type.startsWith('h') ? headingModes[peekTok.level] : 'inline_2col';

                if (peekMode === 'span_1col' && !pendingWordTokens) {
                    const currentAvailH = remPageHeight - reservedNow();
                    if (currentAvailH < 60) break;
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

                    const spanHeight = layoutHeightOf(spanBlock) + 4;
                    /* [תיקון] כותרת רוחבית לא נשארת יתומה בתחתית העמוד: אחרי הצבתה חייב להישאר מקום לשתי שורות תוכן לפחות
                       (הלולאה הזו לא פותחת בלוק חדש כשנשארו 45px או פחות - ואז הכותרת הייתה נשארת אחרונה בעמוד בלי טקסט אחריה).
                       בעמוד שעוד אין בו תוכן גוף הכותרת מוצבת בכל מקרה (אחרת העמוד היה נשאר ריק לנצח). */
                    const spanFree = remPageHeight - reservedNow();
                    if (spanHeight > spanFree || (pageBodyHasContent && spanFree - spanHeight <= 45)) {
                        pageLayout.bodyFlow.removeChild(spanBlock);
                        break;
                    }

                    headingPageMap[peekTok.id] = toGematria(pageIndex - 1);
                    remPageHeight -= spanHeight;
                    tokenIndex++;
                    continue;
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
                pagePendingNotes = [];

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
                const colWidth = exactWidthOf(rCol) || 272;   // רוחב מדויק (שבר) - ראו exactWidthOf
                let pageHasContent = false;

                ['right', 'left'].forEach((colName) => {
                    let targetCol = colName === 'right' ? rCol : lCol;
                    let targetMargin = colName === 'right' ? rMargin : lMargin;

                    while (tokenIndex < secTokens.length || pendingWordTokens) {
                        let currentTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                        const curMode = currentTok.type.startsWith('h') ? headingModes[currentTok.level] : 'inline_2col';

                        if (curMode === 'span_1col' && !pendingWordTokens) break;

                        const currentAvailH = remPageHeight - reservedNow();
                        if (targetCol.scrollHeight >= currentAvailH - 10 && targetCol.children.length > 0) {
                            tokenIndex -= rollbackTrailingHeadings(targetCol);
                            break;
                        }

                        if (currentTok.type.startsWith('h')) {
                            if (currentTok.level === 3) currentH3Title = currentTok.text;
                            if (currentTok.level === 4) currentH4Title = currentTok.text;
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

                            if (targetCol.scrollHeight > (remPageHeight - reservedNow()) && targetCol.children.length > 1) {
                                targetCol.removeChild(hElem);
                                tokenIndex -= rollbackTrailingHeadings(targetCol);
                                break;
                            }

                            if (!headingPageMap[currentTok.id]) {
                                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                            }
                            tokenIndex++;
                            continue;
                        }

                        if (currentTok.type === 'p') {
                            let linesInfo = getLinesFromParagraph(currentTok.text, colWidth, styleObj, true, !!currentTok.endNote);
                            let lines = pendingWordTokens ? pendingWordTokens.remainingLines : linesInfo.lines;
                            let isContinuation = !!pendingWordTokens;
                            let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

                            const pElem = document.createElement('p');
                            pElem.setAttribute('data-token-id', currentTok.id);
                            pElem.setAttribute('data-is-cont', isContinuation ? 'true' : 'false');
                            if (currentTok.endNote) pElem.setAttribute('data-end-note', currentTok.endNote);
                            targetCol.appendChild(pElem);

                            if (currentTok.sideNote && !headingPageMap[currentTok.id]) {
                                headingPageMap[currentTok.id] = toGematria(pageIndex - 1);
                            }

                            let bestFitLine = computeBestFitLine(pElem, targetCol, lines, isContinuation, hasWindow,
                                (txt) => remPageHeight - reservedNow(txt), !!currentTok.endNote);

                            // [תיקון] החלטת חיתוך אחת לכל הכללים: אין שורה בודדת בתחילת/סוף חיתוך, וכותרות לא נשארות לבדן
                            const placeLines = resolveParagraphSplit(lines.length, bestFitLine, !pageHasContent && !pageBodyHasContent);
                            if (placeLines === 0) {
                                targetCol.removeChild(pElem);
                                tokenIndex -= rollbackTrailingHeadings(targetCol);
                                break;
                            }
                            bestFitLine = placeLines;

                            pageHasContent = true;

                            const chunk = lines.slice(0, bestFitLine).join(' ');
                            const isEndOfP = (bestFitLine === lines.length);
                            pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                            pElem.setAttribute('data-raw-text', chunk);
                            pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow, lines.length);
                            applyDelimiterStyles(pElem, 'body', getBodySizePt(), false);

                            if (currentTok.endNote && isEndOfP) {
                                const marker = createNoteMarkerAndQueue(currentTok.endNote, null, 'endnote');
                                pElem.appendChild(marker);
                            }

                            if (!isContinuation && currentTok.sideNote) {
                                pElem.setAttribute('data-side-note', currentTok.sideNote);
                                if (currentTok.sideNoteStyleId) pElem.setAttribute('data-note-style-id', currentTok.sideNoteStyleId);
                                if (currentTok.sideNoteLevel) pElem.setAttribute('data-note-level', currentTok.sideNoteLevel);
                                const noteElem = document.createElement('div');
                                noteElem.className = 'side-note-anchor';
                                noteElem.setAttribute('data-for-token', currentTok.id);
                                noteElem.textContent = currentTok.sideNote;
                                if (currentTok.sideNoteStyleId) {
                                    const inst = findExtTextStyle(currentTok.sideNoteStyleId);
                                    if (inst) applyExtStyleToNode(noteElem, inst.def.style, 6);
                                }
                                applySideNoteLevelStyle(noteElem, currentTok.sideNoteLevel);
                                targetMargin.appendChild(noteElem);
                                pagePendingNotes.push({ elem: noteElem, pElem: pElem });
                            }

                            if (isEndOfP) {
                                pendingWordTokens = null;
                                tokenIndex++;
                            } else {
                                pendingWordTokens = {
                                    token: currentTok,
                                    remainingLines: lines.slice(bestFitLine)
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

                // חישוב הגובה המותר האמיתי לשני הטורים (לאחר שכל הערות העמוד ידועות!)
                const actualAvailH = remPageHeight - reservedNow();

                // 1. סיום פרק
                if (tokenIndex >= secTokens.length && !pendingWordTokens) {
                    // "איזון סוף-פרק": ברירת המחדל (כן, וגם כל ערך ישן/ריק מתבניות שמורות) מאזנת את שני הטורים בסוף הפרק.
                    // רק הערך 'fill' ("לא - מילוי עמוד") משאיר את מילוי הטורים כפי שנוצר (ימין מלא ואז שמאל),
                    // ורק כשהבלוק נכנס בגובה הפנוי - אחרת מאזנים כרגיל כדי לא לחרוג מהעמוד.
                    const keepChapterEndUnbalanced =
                        document.getElementById('balance-chapter-end')?.value === 'fill' &&
                        Math.max(rCol.scrollHeight, lCol.scrollHeight) <= actualAvailH;
                    if (!keepChapterEndUnbalanced) {
                        balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH);
                    } else {
                        // בלי איזון: הערות הצד שנוצרו במילוי הרגיל עדיין לא מוקמו (balanceColumns מקים את שלו בעצמו, וה-break שלמטה מדלג על ההקמה הרגילה)
                        finalizeNotePositions(pagePendingNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
                    }

                    const divHTML = getSectionDividerHTML(secDivStyle);
                    if (divHTML) {
                        const divContainer = document.createElement('div');
                        divContainer.innerHTML = divHTML;
                        const divEl = divContainer.firstElementChild;
                        pageLayout.bodyFlow.appendChild(divEl);
                        // המפריד חייב להיכנס בגוף העמוד (מעל אזור הערות השוליים) - ראו fitSectionDividerToPage
                        fitSectionDividerToPage(divEl, pageLayout.bodyFlow.getBoundingClientRect().top + totalFlowH - reservedNow());
                    }
                    /* [תיקון] גם בבלוק האחרון של הפרק מנכים את גובהו מהנותר בעמוד: בלי זה בדיקת עתודת הערות השוליים (redoCheck)
                       ראתה את העמוד כאילו ריק, ולא זיהתה הערה מאוחרת בטור השמאלי שהגדילה את אזור ההערות אחרי שהטור הימני כבר מולא
                       (בהערות שוליים ב-2 טורים הטקסט חרג אל תוך אזור ההערות). כשהכול נכנס - אין שום שינוי. */
                    remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);
                    break;
                } else {
                    let nextPeekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                    const nextPeekMode = nextPeekTok && nextPeekTok.type.startsWith('h') ? headingModes[nextPeekTok.level] : 'inline_2col';

                    // 2. לפני כותרת 3 רוחבית
                    if (nextPeekMode === 'span_1col' && !pendingWordTokens) {
                        balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH);
                    } 
                    // 3. הטור הימני גלש לתוך שטח ההערה (כי ההערה הייתה בטור שמאל) או שיש פער משמעותי
                    else if (rCol.scrollHeight > actualAvailH || Math.abs(rCol.scrollHeight - lCol.scrollHeight) > 60) {
                        balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH);
                    } 
                    // 4. עמוד רגיל מאוזן שדורש רק יישור שורות עדין
                    else {
                        let usedBlockH = Math.max(rCol.scrollHeight, lCol.scrollHeight);
                        let finalDiff = rCol.scrollHeight - lCol.scrollHeight;
                        if (usedBlockH <= remPageHeight) {
                            if (finalDiff > 2 && finalDiff <= 60) {
                                justifyColumnVertically(lCol, rCol.scrollHeight, styleObj);
                            } else if (finalDiff < -2 && Math.abs(finalDiff) <= 60) {
                                justifyColumnVertically(rCol, lCol.scrollHeight, styleObj);
                            }
                        }
                    }
                }

                remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);
                pageBodyHasContent = true;
                finalizeNotePositions(pagePendingNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));
            }
            if (redoCheck()) continue;
            stretchPageToBottom();
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

    // [חדש] קווי ההפרדה בין הטורים מותאמים לקצוות הטקסט בפועל (אחרי שכל הבלוקים סופיים)
    fitColumnDividers(container);

    // [חדש] כותרת עליונה מסוג "מילה ראשונה עד אחרונה" - ממולאת אחרי שכל העמודים סופיים
    fillHeaderFirstLastWords(container);

    // [תיקון] מספרי העמודים בתוכן העניינים נגזרים מהמיקום הסופי בפועל ב-DOM (ולא מהרישום תוך כדי מילוי),
    // כי כותרת שהוחזרה לעמוד הבא יחד עם הפסקה שאחריה השאירה ברישום את העמוד הישן.
    rebuildHeadingPageMapFromDOM(container, headingPageMap);

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
}