/* ==========================================================================
   typesetter-compat.js — שכבת תאימות למנוע העימוד הפשוט
   ==========================================================================
   מטרה: לספק מימושים (פשוטים או stub) של פונקציות שהמנוע הפשוט אינו מספק,
   אבל קבצי העזר (test-suite.js, debug-panel.js, trace-manager.js) מצפים להן.

   הפונקציות האלה אינן חלק ממנוע העימוד עצמו — הן רק כלי עזר לבדיקות.
   כל שינוי במנוע העימוד עצמו ייעשה ב-typesetter.js בלבד.
   ========================================================================== */

(function () {
    'use strict';

    /* ----- Canvas API (לבדיקות measureLineWidthCanvas, estimateLineCountCanvas, measureWordWidth) ----- */
    let _canvasCtx = null;
    function _getCanvasCtx() {
        if (_canvasCtx) return _canvasCtx;
        try {
            const c = document.createElement('canvas');
            c.width = 512; c.height = 64;
            _canvasCtx = c.getContext('2d');
        } catch (e) {
            _canvasCtx = null;
        }
        return _canvasCtx;
    }

    function _fontDescriptor(styleObj) {
        // styleObj יכול להיות אובייקט מ-getComputedStyle פשוט {fontFamily, fontSize, fontWeight, fontStyle}
        const so = styleObj || {};
        const size = so.fontSize || '12pt';
        const family = so.fontFamily || 'serif';
        const weight = so.fontWeight || 'normal';
        const style = so.fontStyle || 'normal';
        return style + ' ' + weight + ' ' + size + ' ' + family;
    }

    function measureWordWidth(word, styleObj) {
        const ctx = _getCanvasCtx();
        if (!ctx || !word) return 0;
        ctx.font = _fontDescriptor(styleObj);
        try { return ctx.measureText(word).width; } catch (e) { return 0; }
    }

    function measureLineWidthCanvas(text, styleObj) {
        const ctx = _getCanvasCtx();
        if (!ctx || !text) return 0;
        ctx.font = _fontDescriptor(styleObj);
        try { return ctx.measureText(text).width; } catch (e) { return 0; }
    }

    function estimateLineCountCanvas(words, colWidth, styleObj, opts) {
        if (!words || !words.length || !colWidth) return 0;
        const ctx = _getCanvasCtx();
        if (!ctx) return 0;
        ctx.font = _fontDescriptor(styleObj);
        const spaceW = (() => { try { return ctx.measureText(' ').width; } catch (e) { return 4; } })();
        let lines = 1;
        let curW = 0;
        for (let i = 0; i < words.length; i++) {
            const w = words[i];
            let ww = 0;
            try { ww = ctx.measureText(w).width; } catch (e) { ww = 0; }
            if (curW === 0) {
                curW = ww;
            } else if (curW + spaceW + ww > colWidth) {
                lines++;
                curW = ww;
            } else {
                curW += spaceW + ww;
            }
        }
        return lines;
    }

    /* ----- Width cache (לבדיקות) ----- */
    let _wordCache = { size: 0, hits: 0, misses: 0 };
    function resetWordWidthCache() { _wordCache = { size: 0, hits: 0, misses: 0 }; }
    function getWordWidthCacheStats() { return _wordCache; }

    /* ----- Knuth-Plass stubs (מנוע KP אינו פעיל בגרסה הפשוטה) ----- */
    let _kpEnabled = false;
    function isKnuthPlassAvailable() { return false; }
    function isKnuthPlassEnabled() { return _kpEnabled; }
    function setKnuthPlassEnabled(v) { _kpEnabled = !!v; }
    function knuthPlassBreak(words, colWidth, styleObj, opts) {
        // Fallback פשוט: greedy line break.
        const ctx = _getCanvasCtx();
        if (!ctx || !words || !words.length) return { lines: [], lineCount: 0, totalCost: 0 };
        ctx.font = _fontDescriptor(styleObj);
        const spaceW = (() => { try { return ctx.measureText(' ').width; } catch (e) { return 4; } })();
        const lines = [];
        let cur = [];
        let curW = 0;
        for (let i = 0; i < words.length; i++) {
            const w = words[i];
            let ww = 0;
            try { ww = ctx.measureText(w).width; } catch (e) { ww = 0; }
            if (cur.length === 0) { cur.push(w); curW = ww; }
            else if (curW + spaceW + ww > colWidth) { lines.push(cur); cur = [w]; curW = ww; }
            else { cur.push(w); curW += spaceW + ww; }
        }
        if (cur.length) lines.push(cur);
        return {
            lines: lines.map(arr => ({ words: arr, ratio: 0 })),
            lineCount: lines.length,
            totalCost: 0
        };
    }
    function resetKpCache() {}
    function getKpCacheStats() { return { size: 0, hits: 0, misses: 0 }; }

    /* ----- Hooks ל-trace-manager (אופציונלי; אם המנוע הפשוט לא קורא להם, אין נזק) ----- */
    if (typeof window.__traceOnChaptersBuilt !== 'function') {
        window.__traceOnChaptersBuilt = function (_chapters) { /* stub */ };
    }
    if (typeof window.__traceOnChapterStart !== 'function') {
        window.__traceOnChapterStart = function (_sIdx, _total) { /* stub */ };
    }
    if (typeof window.__traceOnStopped !== 'function') {
        window.__traceOnStopped = function () { /* stub */ };
    }

    /* ----- חשיפה על window (תואם ל-API ש-v18 חשף, לטובת test-suite/debug-panel) ----- */
    window.measureWordWidth = measureWordWidth;
    window.measureLineWidthCanvas = measureLineWidthCanvas;
    window.estimateLineCountCanvas = estimateLineCountCanvas;
    window.resetWordWidthCache = resetWordWidthCache;
    window.getWordWidthCacheStats = getWordWidthCacheStats;
    window.knuthPlassBreak = knuthPlassBreak;
    window.isKnuthPlassAvailable = isKnuthPlassAvailable;
    window.isKnuthPlassEnabled = isKnuthPlassEnabled;
    window.setKnuthPlassEnabled = setKnuthPlassEnabled;
    window.resetKpCache = resetKpCache;
    window.getKpCacheStats = getKpCacheStats;

    /* ----- דגל גלובלי: המערכת כעת במצב "מנוע פשוט" ----- */
    window.__engineMode = 'simple';

    /* ----- Stub של פונקציות ש-v18 חשף אך אינן קיימות בפשוט ----- */
    // פונקציות אלו מחזירות נתונים ריקים/סטנדרטיים כדי שכל בדיקה שמצפה להן לא תקרוס.
    // אם מישהו יקרא להן בפועל, נקבל תוצאות ריקות (ולא קריסה).
    const _stubArr = [];
    const _stubObj = {};
    const _stubFn = function () { return _stubObj; };
    [
        'LayoutCandidate', 'LayoutDecisionsLinter', 'layoutLinter', 'layoutInvalidator',
        'buildMeasureClone', 'measureCandidateLines', 'measureParagraphHeight', 'measurePartialLines',
        'buildLayoutItems', 'measureHeadingHeight', 'calculateCandidateLayout', 'scoreCandidate',
        'findBestSplitPoint', 'continuationLineQuality', 'lookAheadLineBreak', 'applyCandidateLayoutToDOM',
        'balanceColumnsV2', 'triggerReflowFromMutation', 'applyKpLineBreaks',
        'enableNewLayoutEngine', 'disableNewLayoutEngine', 'triggerGlobalReflow',
        '__resetLayoutDecisionsLog', 'exportLayoutDecisionsReport', 'exportPageDebugReport'
    ].forEach(function (name) {
        if (typeof window[name] === 'undefined') {
            window[name] = (name === 'LayoutCandidate' || name === 'LayoutDecisionsLinter')
                ? function () { return _stubObj; }
                : _stubFn;
        }
    });
    if (typeof window.__pageDebugStore === 'undefined') window.__pageDebugStore = {};
    if (typeof window.__layoutDecisionsLog === 'undefined') window.__layoutDecisionsLog = _stubArr;
    if (typeof window.__useBalanceV2 === 'undefined') window.__useBalanceV2 = false;
    if (typeof window.__enableLayoutLinter === 'undefined') window.__enableLayoutLinter = false;

    console.log('[typesetter-compat] loaded. Engine mode: simple. Stubbed ' +
        'KP/Canvas/LayoutCandidate APIs for test-suite compatibility.');
})();
