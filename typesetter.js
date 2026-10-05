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

// מאגר גלובלי לאחסון נתוני דיבאג וטרייס לכל עמוד
window.__pageDebugStore = {};

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
    if (num === 15) return "טו";
    if (num === 16) return "טז";
    const hundreds = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];
    const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
    const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
    let str = "";
    let h = Math.floor(num / 100);
    if (h > 0) {
        if (h <= 4) str += ["", "ק", "ר", "ש", "ת"][h];
        else if (h < hundreds.length) str += hundreds[h];
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

    root.style.setProperty('--fn-header-r', getFontVal('f-hdr-r', "'Livorna', 'David Libre', serif"));
    root.style.setProperty('--sz-header-r', (document.getElementById('s-hdr-r')?.value || 15) + 'pt');
    root.style.setProperty('--fn-header-c', getFontVal('f-hdr-c', "'Livorna', 'David Libre', serif"));
    root.style.setProperty('--sz-header-c', (document.getElementById('s-hdr-c')?.value || 11) + 'pt');
    root.style.setProperty('--fn-header-l', getFontVal('f-hdr-l', "'Livorna', 'David Libre', serif"));
    root.style.setProperty('--sz-header-l', (document.getElementById('s-hdr-l')?.value || 15) + 'pt');

    root.style.setProperty('--fn-note-body', document.getElementById('f-note-body')?.value || 'inherit');
    root.style.setProperty('--sz-note-body', (document.getElementById('s-note-body')?.value || '') ? document.getElementById('s-note-body').value + 'pt' : 'inherit');
    root.style.setProperty('--last-line-align', document.getElementById('body-last-line-align')?.value || 'center');

    const hdrDividerMode = document.getElementById('hdr-divider-style')?.value || 'gray';
    const hdrDividerColorMap = { none: 'transparent', gray: 'rgba(0,0,0,0.06)', black: '#000' };
    root.style.setProperty('--hdr-divider-color', hdrDividerColorMap[hdrDividerMode] || hdrDividerColorMap.gray);

    root.style.setProperty('--fn-h0', getFontVal('f-h0', "'AlphaBlack', 'David Libre', serif"));
    root.style.setProperty('--sz-h0', (document.getElementById('s-h0')?.value || 26) + 'pt');
    root.style.setProperty('--fn-h0-body', getFontVal('f-h0-body', "'Frank Ruhl Libre', serif"));
    root.style.setProperty('--sz-h0-body', (document.getElementById('s-h0-body')?.value || 11.5) + 'pt');

    root.style.setProperty('--fn-h1', getFontVal('f-h1', "'Lia Sgula', 'Bellefair', serif"));
    root.style.setProperty('--sz-h1', (document.getElementById('s-h1')?.value || 50) + 'pt');

    root.style.setProperty('--fn-h2', getFontVal('f-h2', "'AlphaBlack', 'David Libre', serif"));
    root.style.setProperty('--sz-h2', (document.getElementById('s-h2')?.value || 17) + 'pt');
    root.style.setProperty('--h2-top-distance', document.getElementById('h2-top-distance')?.value || '22%');

    const fSiman = document.getElementById('f-siman')?.value;
    const sSiman = document.getElementById('s-siman')?.value;
    if (fSiman) root.style.setProperty('--fn-siman', fSiman);
    if (sSiman) root.style.setProperty('--sz-siman', sSiman + 'pt');

    root.style.setProperty('--fn-h3', getFontVal('f-h3', "'Alpha', 'Noto Serif Hebrew', serif"));
    root.style.setProperty('--sz-h3', (document.getElementById('s-h3')?.value || 13.5) + 'pt');
    root.style.setProperty('--fn-h4', getFontVal('f-h4', "'Alpha', 'Frank Ruhl Libre', serif"));
    root.style.setProperty('--sz-h4', (document.getElementById('s-h4')?.value || 12.5) + 'pt');
    root.style.setProperty('--fn-h5', getFontVal('f-h5', "'AlphaLight', 'David Libre', serif"));
    root.style.setProperty('--sz-h5', (document.getElementById('s-h5')?.value || 11.5) + 'pt');
    root.style.setProperty('--fn-h6', getFontVal('f-h6', "'Noto Serif Hebrew', serif"));
    root.style.setProperty('--sz-h6', (document.getElementById('s-h6')?.value || 10.5) + 'pt');
    root.style.setProperty('--fn-h7', getFontVal('f-h7', "'Hadassah Friedlaender', 'David Libre', serif"));
    root.style.setProperty('--sz-h7', (document.getElementById('s-h7')?.value || 6) + 'pt');

    root.style.setProperty('--fn-sh-title', getFontVal('f-sh-title', "'Lia Sgula', 'Bellefair', serif"));
    root.style.setProperty('--sz-sh-title', (document.getElementById('s-sh-title')?.value || 46) + 'pt');
    root.style.setProperty('--fn-sh-sub', getFontVal('f-sh-sub', "'Livorna', 'David Libre', serif"));
    root.style.setProperty('--sz-sh-sub', (document.getElementById('s-sh-sub')?.value || 21) + 'pt');
    root.style.setProperty('--fn-sh-desc', getFontVal('f-sh-desc', "'Livorna', 'Frank Ruhl Libre', serif"));
    root.style.setProperty('--sz-sh-desc', (document.getElementById('s-sh-desc')?.value || 12) + 'pt');
    root.style.setProperty('--fn-sh-sec', document.getElementById('f-sh-sec')?.value || 'serif');
    root.style.setProperty('--sz-sh-sec', (document.getElementById('s-sh-sec')?.value || 11.5) + 'pt');
    root.style.setProperty('--fn-sh-author', document.getElementById('f-sh-author')?.value || 'serif');
    root.style.setProperty('--sz-sh-author', (document.getElementById('s-sh-author')?.value || 15) + 'pt');
    root.style.setProperty('--fn-sh-year', document.getElementById('f-sh-year')?.value || 'serif');
    root.style.setProperty('--sz-sh-year', (document.getElementById('s-sh-year')?.value || 12) + 'pt');

    root.style.setProperty('--fn-body', getFontVal('font-body', "'Guttman Rashi', 'Frank Ruhl Libre', serif"));
    root.style.setProperty('--sz-body', (document.getElementById('size-body')?.value || 11.2) + 'pt');
    root.style.setProperty('--line-height-body', document.getElementById('line-height-body')?.value || '1.34');
    root.style.setProperty('--fn-first-word', getFontVal('font-first-word', "'FrankReal', 'Frank Ruhl Libre', serif"));
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
        return `<span class="dibbur-hamatchil">${match[1]}</span> ${match[2]}`;
    }
    return text;
}

function createDropWord(text, isContinuation, isSingleLine, numLines = 2) {
    if (isContinuation) return text;
    text = text.trim();
    if (!text) return '';

    const mode = document.getElementById('drop-word-mode')?.value || 'window';
    if (mode === 'none') return applyDibburHamatchil(text);

    const wordCount = parseInt(document.getElementById('drop-word-count')?.value, 10) || 1;
    const minLines = parseInt(document.getElementById('drop-word-min-lines')?.value, 10) || 2;
    const meetsLineThreshold = (numLines >= minLines) && !isSingleLine;

    const words = text.split(/\s+/);
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

/* ==========================================================================
   4. מדידת שורות אטומית עם הגנת הערות שוליים (\uE000)
   ========================================================================== */
function getLinesFromParagraph(text, colWidth, styleObj, useWindowIfMultipleLines) {
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

    if (fnOpen && fnClose) {
        const escO = fnOpen.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const escC = fnClose.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        safeText = safeText.replace(new RegExp(escO + '([\\s\\S]*?)' + escC, 'g'), (m, inner) => {
            return fnOpen + inner.replace(/\s+/g, '\uE000') + fnClose;
        });
    }

    const words = safeText.split(/\s+/);
    if (words.length === 0) {
        return { lines: [], hasWindow: false, numLines: 0 };
    }

    const pMeasure = document.createElement('p');
    pMeasure.style.margin = '0';
    pMeasure.style.padding = '0';
    pMeasure.style.lineHeight = styleObj.lineHeight;

    pMeasure.textContent = text;
    measureContainer.appendChild(pMeasure);
    const singleLineHeight = pMeasure.offsetHeight;
    pMeasure.textContent = "א";
    const oneLineH = pMeasure.offsetHeight;
    const numLinesEstimated = Math.max(1, Math.round(singleLineHeight / oneLineH));

    const minLines = parseInt(document.getElementById('drop-word-min-lines')?.value, 10) || 2;
    const mode = document.getElementById('drop-word-mode')?.value || 'window';
    const shouldApplyWindow = useWindowIfMultipleLines && (numLinesEstimated >= minLines) && (mode === 'window');

    const wordCount = parseInt(document.getElementById('drop-word-count')?.value, 10) || 1;
    const dropWords = words.slice(0, Math.min(wordCount, words.length)).join(' ').replace(/\uE000/g, ' ');

    let html = '';
    if (shouldApplyWindow) {
        html += `<span class="first-word-window" id="mw-0">${dropWords}</span> `;
        for (let i = wordCount; i < words.length; i++) {
            const w = words[i];
            const isNote = w.startsWith(fnOpen) && w.endsWith(fnClose);
            const displayW = isNote ? ' א ' : w.replace(/\uE000/g, ' ');
            html += `<span id="mw-${i}">${displayW}</span> `;
        }
    } else {
        for (let i = 0; i < words.length; i++) {
            const w = words[i];
            const isNote = w.startsWith(fnOpen) && w.endsWith(fnClose);
            const displayW = isNote ? ' א ' : w.replace(/\uE000/g, ' ');
            html += `<span id="mw-${i}">${displayW}</span> `;
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
    return {
        lines,
        hasWindow: shouldApplyWindow,
        numLines: lines.length
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
            const extraLh = Math.min((budget - applied) / n / fontSizePx, 0.12);
            if (extraLh <= 0.001) return;
            const prev = p.style.lineHeight;
            const delta = measureColScrollDelta(shortCol, () => {
                p.style.lineHeight = (baseLh + extraLh).toString();
            });
            if (colOverCeiling()) {
                p.style.lineHeight = prev;
            } else {
                applied += delta;
            }
        });
        logDetails.tiersApplied['priority4_lineHeight'] = (logDetails.tiersApplied['priority4_lineHeight'] || 0) + applied;
        return applied;
    }

    // 5. הגדלת רווח בין מילים בפיסקה שבטור הקצר (ליצירת תוספת של שורה)
    function applyPriority5_WordSpacing(budget) {
        const pElements = Array.from(shortCol.querySelectorAll('p'));
        const p = pElements[pElements.length - 1];
        if (!p || budget <= 0.5) return 0;
        const raw = p.getAttribute('data-raw-text') || p.textContent || '';
        if (!raw.trim()) return 0;
        let applied = 0;
        let lastGood = '';
        for (let ws = 0.5; ws <= 8; ws += 0.5) {
            if (applied >= budget - 0.5) break;
            const prev = p.style.wordSpacing;
            const delta = measureColScrollDelta(shortCol, () => {
                p.style.wordSpacing = ws + 'px';
            });
            if (colOverCeiling()) {
                p.style.wordSpacing = lastGood;
                break;
            }
            if (delta > 0.5) {
                applied = delta;
                lastGood = ws + 'px';
            } else {
                p.style.wordSpacing = prev;
            }
        }
        logDetails.tiersApplied['priority5_wordSpacing'] = (logDetails.tiersApplied['priority5_wordSpacing'] || 0) + applied;
        return Math.min(applied, budget);
    }

    const priorityTiers = [
        { name: 'P1 (רווח לפני כותרת)', fn: applyPriority1_HeadingBefore, weight: 6 },
        { name: 'P2 (רווח אחרי כותרת)', fn: applyPriority2_HeadingAfter, weight: 4 },
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

    if (traceObj) {
        traceObj.justificationLog = logDetails;
    }

    return neededGrowth - remaining;
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

    distributeColumnJustification(shortCol, needed, styleObj, heightCeiling, colWidth, traceObj);
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
    return enforceBlockColumnsWithinCeiling(block, budget);
}

/* ==========================================================================
   7. איזון טורים (balanceColumns)
   ========================================================================== */
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
                numLines: linesInfo.lines.length
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
            p.innerHTML = createDropWord(item.rawText, item.isCont, item.isSingleLine, item.numLines);
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
            let rightText = sp.lines.slice(0, sp.lineIndex).join(' ');
            pRight.innerHTML = createDropWord(rightText, item.isCont, false, sp.lineIndex);
            applyDelimiterStyles(pRight, 'body', getBodySizePt(), true);
            rCol.appendChild(pRight);
        }
        let rHeight = rCol.scrollHeight;

        lCol.innerHTML = '';
        if (sp.lineIndex > 0) {
            let item = items[sp.itemIndex];
            let pLeft = document.createElement('p');
            pLeft.className = 'p-end';
            let leftText = sp.lines.slice(sp.lineIndex).join(' ');
            pLeft.innerHTML = createDropWord(leftText, true, false, item.lines.length - sp.lineIndex);
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

        let score = balanceQualityScore + heightPenalty;

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

    function appendItemFinal(col, margin, item, isRight, isPartial, partialText, isCont) {
        if (item.type === 'h') {
            col.insertAdjacentHTML('beforeend', item.html);
        } else {
            const p = document.createElement('p');
            p.className = isPartial && isRight ? 'p-cut' : 'p-end';
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

    for (let i = 0; i < bestSplit.itemIndex; i++) {
        appendItemFinal(rCol, rMargin, items[i], true, false, null, items[i].isCont);
    }
    if (bestSplit.lineIndex > 0) {
        let item = items[bestSplit.itemIndex];
        let rightText = bestSplit.lines.slice(0, bestSplit.lineIndex).join(' ');
        appendItemFinal(rCol, rMargin, item, true, true, rightText, item.isCont);
        let leftText = bestSplit.lines.slice(bestSplit.lineIndex).join(' ');
        appendItemFinal(lCol, lMargin, item, false, true, leftText, true);
    }
    for (let i = bestSplit.lineIndex > 0 ? bestSplit.itemIndex + 1 : bestSplit.itemIndex; i < items.length; i++) {
        appendItemFinal(lCol, lMargin, items[i], false, false, null, items[i].isCont);
    }

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
            let top = item.pElem.offsetTop;
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
        body.textContent = item.text;
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
    let oddRFont = document.getElementById('f-hdr-r')?.value || "'Livorna','David Libre',serif";
    let oddRSize = (document.getElementById('s-hdr-r')?.value || 15) + 'pt';
    let oddLFont = document.getElementById('f-hdr-l')?.value || "'Livorna','David Libre',serif";
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
    <button type="button" class="page-debug-btn" onclick="event.stopPropagation(); window.exportPageDebugReport(${pNum})" title="הורד דוח דיבאג מקיף לעמוד זה">🐛 דיבאג עמוד ${toGematria(pNum) || pNum}</button>
    <div class="page-content-wrapper">
      <div class="top-header-grid">
        <div class="header-col-r" style="text-align:${hdrRAlign}; justify-content:${hdrRAlign}; font-family:${hdrRFont}; font-size:${hdrRSize};">${hdrRHTML}</div>
        <div class="header-col-c" style="text-align:${hdrCAlign}; justify-content:${hdrCAlign};">${hdrCHTML}</div>
        <div class="header-col-l" style="text-align:${hdrLAlign}; justify-content:${hdrLAlign}; font-family:${hdrLFont}; font-size:${hdrLSize};">${hdrLHTML}</div>
      </div>
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
      <button type="button" class="page-debug-btn" onclick="event.stopPropagation(); window.exportPageDebugReport(${tocPNum})" title="הורד דוח דיבאג מקיף לעמוד זה">🐛 דיבאג עמוד ${toGematria(tocPNum) || tocPNum}</button>
      <div class="page-content-wrapper">
        <div class="top-header-grid">
          <div class="header-col-r" style="text-align:${hdrRAlign}; justify-content:${hdrRAlign};">${hdrRHTML}</div>
          <div class="header-col-c" style="text-align:${hdrCAlign}; justify-content:${hdrCAlign};">${hdrCHTML}</div>
          <div class="header-col-l" style="text-align:${hdrLAlign}; justify-content:${hdrLAlign};">${hdrLHTML}</div>
        </div>
        <div class="page-body-flow">
          ${isFirstTOCPage ? `<div class="h2-spacer"></div><div class="title-level-2-standalone" style="margin-top: 0; margin-bottom: 25px;">${titleText}</div>` : ''}
          <div class="toc-grid-full"></div>
        </div>
        <div class="page-number-footer">${showNum ? tocFramedNum : ''}</div>
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
   11. מנוע העימוד המרכזי (performTypeset)
   ========================================================================== */
let typesetTimer = null;
function typesetDocument() {
    if (typesetTimer) clearTimeout(typesetTimer);
    typesetTimer = setTimeout(() => {
        performTypeset();
    }, 400);
}

function performTypeset() {
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
        if (document.getElementById('general-toc-count-numbering')?.checked !== false) {
            pageIndex += pagesRendered;
        }
    }
    renderExtAnchor(container, 'afterGeneralToc', rawText);

    const styleObj = {
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--fn-body'),
        fontSize: getComputedStyle(document.documentElement).getPropertyValue('--sz-body'),
        lineHeight: getComputedStyle(document.documentElement).getPropertyValue('--line-height-body') || '1.34'
    };

    let hasOpenPart = false;
    let prevPageEl = null;

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
                        let isContinuation = !!pendingWordTokens;
                        let hasWindow = pendingWordTokens ? false : linesInfo.hasWindow;

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
                        const chunk = lines.slice(0, bestFitLine).join(' ');
                        const isEndOfP = (bestFitLine === lines.length);
                        pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                        pElem.setAttribute('data-raw-text', chunk);
                        pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow, lines.length);
                        applyDelimiterStyles(pElem, 'body', getBodySizePt(), false);

                        pageTrace.tokensPlaced.push({ id: currentTok.id, type: 'p', linesPlaced: bestFitLine, totalLines: lines.length, isEndOfP });

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
                    // דרישת מינימום 190px כדי לא להשאיר כותרת וטקסט קטוע בתחתית עמוד
                    if (currentAvailH < 190) {
                        pageTrace.steps.push(`כותרת רוחבית [${peekTok.id}] נדחתה לעמוד הבא עקב חוסר מקום מספיק לגוף (${currentAvailH}px)`);
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
                            const chunk = lines.slice(0, bestFitLine).join(' ');
                            const isEndOfP = (bestFitLine === lines.length);
                            pElem.className = isEndOfP ? 'p-end' : 'p-cut';
                            pElem.setAttribute('data-raw-text', chunk);
                            pElem.innerHTML = createDropWord(chunk, isContinuation, !hasWindow, lines.length);
                            applyDelimiterStyles(pElem, 'body', getBodySizePt(), false);

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

                let actualAvailH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, block2Col);
                let didBalance = false;
                const sectionEnd = tokenIndex >= secTokens.length && !pendingWordTokens;

                if (sectionEnd) {
                    balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, pageTrace);
                    didBalance = true;
                } else {
                    let nextPeekTok = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                    const nextPeekMode = nextPeekTok && nextPeekTok.type.startsWith('h') ? headingModes[nextPeekTok.level] : 'inline_2col';

                    if (nextPeekMode === 'span_1col' && !pendingWordTokens) {
                        balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, pageTrace);
                        didBalance = true;
                    } else if (rCol.scrollHeight > actualAvailH || Math.abs(rCol.scrollHeight - lCol.scrollHeight) > 50) {
                        balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, pageTrace);
                        didBalance = true;
                    }
                }

                // PushBack במקרה של חריגה אמיתית מתקציב הדף
                actualAvailH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, block2Col);
                while ((rCol.scrollHeight > actualAvailH + 2 || lCol.scrollHeight > actualAvailH + 2) && (rCol.children.length + lCol.children.length > 1)) {
                    const popCol = lCol.children.length > 0 ? lCol : rCol;
                    const poppedChild = popCol.lastElementChild;
                    if (!poppedChild) break;

                    const pId = poppedChild.getAttribute('data-token-id');
                    if (poppedChild.tagName === 'P') {
                        const rawPText = poppedChild.getAttribute('data-raw-text') || '';
                        const linesInfo = getLinesFromParagraph(rawPText, colWidth, styleObj, false);
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
                    } else {
                        tokenIndex--;
                    }
                    popCol.removeChild(poppedChild);
                    pageTrace.steps.push(`בוצע PushBack לאלמנט [${pId}] עקב חריגה מגובה התקציב (${actualAvailH}px)`);
                    actualAvailH = getBlockColumnBudget(pageLayout.bodyFlow, pageLayout.page, block2Col);
                    balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, pageTrace);
                }

                const blockUsedH = finalizeTwoColumnBlockLayout(
                    block2Col, pageLayout.bodyFlow, pageLayout.page, styleObj, colWidth, didBalance, pageTrace
                );
                finalizeNotePositions(pagePendingNotes, Math.min(blockUsedH, actualAvailH));

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
      trace: ${JSON.stringify(trace)},
      domInspection: ${JSON.stringify(domInspection)},
      warnings: ${JSON.stringify(warnings)}
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