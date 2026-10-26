/* ==========================================================================
   geometry-audit.js — מודל גיאומטרי מלא + בודק מתמטי + overlay ויזואלי
   ==========================================================================
   מטרה: לחלץ גיאומטריה מדויקת של כל רכיב בעמוד (page → column → block →
   line → word) כך שניתן יהיה לבדוק מתמטית הכלה, חפיפה, איזון טורים,
   אלמנות/יתומים, גלישות וכו' — ולהציג את התוצאות כקווי גבול על הדף.

   יחידה: פיקסלים ב-float (מ-DOM). בעתיד נעבור ל-fixed-point 1/64px.

   הקובץ נטען בתוך ה-iframe (renderer.html) ולכן יש לו גישה ישירה ל-DOM.
   ========================================================================== */
(function() {
'use strict';

/* ========================================================================
   חלק 1: חילוץ גיאומטריה מ-DOM
   ======================================================================== */

const EPS = 0.5; // סף לעיגול (חצי פיקסל)

/* [תיקון חשוב] מחזיר קואורדינטות יחסיות ל-#book-container.
   ה-overlay container מצורף לתוך #book-container, ולכן הקואורדינטות
   צריכות להיות יחסיות אליו. כך, כשגוללים, ה-overlay זז יחד עם העמודים. */
function getBookContainerOffset() {
    const bc = document.getElementById('book-container');
    if (!bc) return { x: 0, y: 0 };
    const r = bc.getBoundingClientRect();
    return { x: r.left, y: r.top };
}

function rectOf(el) {
    const r = el.getBoundingClientRect();
    const off = getBookContainerOffset();
    return {
        x: r.left - off.x, y: r.top - off.y,
        w: r.width, h: r.height,
        right: r.right - off.x, bottom: r.bottom - off.y
    };
}

/* Resolve note-marker styles directly from the live DOM when the tree's inline
   diagnostic is missing. Matching by the full relative rectangle avoids relying on
   text content (which may be empty for some generated marker nodes) or on unstable IDs. */
function resolveNoteMarkerInlineGeometry(targetRect) {
    const markers = Array.from(document.querySelectorAll('#book-container .note-marker'));
    let best = null;
    for (const el of markers) {
        const rect = rectOf(el);
        const score = Math.abs(rect.x - targetRect.x) + Math.abs(rect.y - targetRect.y) +
            Math.abs(rect.w - targetRect.w) + Math.abs(rect.h - targetRect.h);
        if (!best || score < best.score) best = { el, rect, score };
    }
    const round = value => Number.isFinite(value) ? Math.round(value * 1000) / 1000 : null;
    if (!best || best.score > 2) {
        return {
            source: 'live-dom-rect-match',
            lookupStatus: 'not-found',
            candidateCount: markers.length,
            bestRectDeltaPx: best ? round(best.score) : null
        };
    }
    const cs = getComputedStyle(best.el);
    const parent = best.el.parentElement;
    const ps = parent ? getComputedStyle(parent) : null;
    const pr = parent ? rectOf(parent) : null;

    // The serialized tree can lack paragraph line fragments for generated/split
    // note markers. Recover actual neighboring text line boxes from live Range
    // geometry instead of reporting only the paragraph's outer rectangle.
    const off = getBookContainerOffset();
    const markerCenter = best.rect.y + best.rect.h / 2;
    let nearestLine = null;
    let nearestLineDistance = Infinity;
    if (parent) {
        const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                if (node.parentElement && node.parentElement.closest('.note-marker')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        const range = document.createRange();
        const fragments = [];
        let textNode;
        while ((textNode = walker.nextNode())) {
            range.selectNodeContents(textNode);
            for (const lineRect of Array.from(range.getClientRects())) {
                if (lineRect.width <= 0 || lineRect.height <= 0) continue;
                fragments.push({
                    x: lineRect.left - off.x, y: lineRect.top - off.y,
                    right: lineRect.right - off.x, bottom: lineRect.bottom - off.y,
                    h: lineRect.height
                });
            }
        }
        range.detach();

        // Range rectangles are inline fragments, not guaranteed one-per-line.
        // Merge them with the same vertical-center clustering used by collectLines().
        fragments.sort((a, b) => ((a.y + a.bottom) / 2) - ((b.y + b.bottom) / 2) || a.x - b.x);
        const lineClusters = [];
        for (const fragment of fragments) {
            const center = (fragment.y + fragment.bottom) / 2;
            let bestCluster = null;
            let bestDistance = Infinity;
            for (const cluster of lineClusters) {
                const clusterCenter = (cluster.y + cluster.bottom) / 2;
                const maxCenterDelta = Math.max(9, Math.min(11, Math.max(fragment.h, cluster.bottom - cluster.y) * 0.45));
                const distance = Math.abs(center - clusterCenter);
                if (distance <= maxCenterDelta && distance < bestDistance) {
                    bestCluster = cluster;
                    bestDistance = distance;
                }
            }
            if (!bestCluster) {
                lineClusters.push({ x: fragment.x, y: fragment.y, right: fragment.right, bottom: fragment.bottom, fragmentCount: 1 });
            } else {
                bestCluster.x = Math.min(bestCluster.x, fragment.x);
                bestCluster.y = Math.min(bestCluster.y, fragment.y);
                bestCluster.right = Math.max(bestCluster.right, fragment.right);
                bestCluster.bottom = Math.max(bestCluster.bottom, fragment.bottom);
                bestCluster.fragmentCount++;
            }
        }
        for (const line of lineClusters) {
            const distance = Math.abs(markerCenter - (line.y + line.bottom) / 2);
            if (distance < nearestLineDistance) {
                nearestLineDistance = distance;
                nearestLine = { y: line.y, bottom: line.bottom, h: line.bottom - line.y, fragmentCount: line.fragmentCount };
            }
        }
    }
    return {
        source: 'live-dom-rect-match',
        lookupStatus: 'matched',
        rectDeltaPx: round(best.score),
        verticalAlign: cs.verticalAlign,
        lineHeight: cs.lineHeight,
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        display: cs.display,
        position: cs.position,
        marginTop: cs.marginTop,
        transform: cs.transform,
        parentDisplay: ps ? ps.display : null,
        parentLineHeight: ps ? ps.lineHeight : null,
        markerTop: round(best.rect.y),
        markerBottom: round(best.rect.bottom),
        parentTop: pr ? round(pr.y) : null,
        parentBottom: pr ? round(pr.bottom) : null,
        nearestLine: nearestLine ? {
            y: round(nearestLine.y),
            bottom: round(nearestLine.bottom),
            height: round(nearestLine.h),
            topDelta: round(best.rect.y - nearestLine.y),
            bottomDelta: round(best.rect.bottom - nearestLine.bottom),
            centerDistance: round(nearestLineDistance),
            fragmentCount: nearestLine.fragmentCount,
            source: 'live-text-range-fragment-union'
        } : null
    };
}

/* מזהה את סוג הרכיב לפי ה-class וה-tag */
function classifyElement(el) {
    const cls = el.className || '';
    const tag = el.tagName.toLowerCase();
    if (typeof cls !== 'string') return { type: 'unknown', tag };

    if (cls.includes('a4-page')) return { type: 'page', tag };
    if (cls.includes('page-content-wrapper')) return { type: 'wrapper', tag };
    if (cls.includes('page-body-flow')) return { type: 'body-flow', tag };
    if (cls.includes('page-header')) return { type: 'header', tag };
    if (cls.includes('top-header-grid')) return { type: 'header', tag };
    if (cls.includes('header-col-r') || cls.includes('header-col-c') || cls.includes('header-col-l')) return { type: 'header-col', tag };
    if (cls.includes('header-ornament-wrap')) return { type: 'header-ornament', tag };
    if (cls.includes('hdr-txt')) return { type: 'header-text', tag };
    if (cls.includes('hdr-pagenum')) return { type: 'header-page-number', tag };
    if (cls.includes('note-header-ornament-right') || cls.includes('note-header-ornament-left')) return { type: 'fn-ornament', tag };
    if (cls.includes('footnote-header-title')) return { type: 'fn-header-title', tag };
    if (cls.includes('page-number-footer')) return { type: 'page-number', tag };
    if (cls.includes('footnote-area')) return { type: 'footnote-area', tag };
    if (cls.includes('footnote-header-wrap')) return { type: 'fn-header', tag };
    if (cls.includes('note-rule-') || cls.includes('note-rule')) return { type: 'fn-rule', tag };
    if (cls.includes('note-block')) return { type: 'fn-block', tag };
    if (cls.includes('note-line-num')) return { type: 'fn-num', tag };
    if (cls.includes('note-line')) return { type: 'fn-line', tag };
    if (cls.includes('block-2col')) return { type: 'block-2col', tag };
    if (cls.includes('block-h3-span')) return { type: 'block-h3-span', tag };
    if (cls.includes('block-single-col')) return { type: 'block-single-col', tag };
    if (cls.includes('main-column')) return { type: 'column', tag, side: cls.includes('right-col') ? 'right' : (cls.includes('left-col') ? 'left' : '?') };
    if (cls.includes('single-wide-col')) return { type: 'column', tag, side: 'single' };
    if (cls.includes('margin-notes-column')) return { type: 'margin-col', tag, side: cls.includes('right-margin') ? 'right' : 'left' };
    if (cls.includes('col-gutter-divider')) return { type: 'gutter', tag };
    if (cls.includes('h2-spacer')) return { type: 'h2-spacer', tag };
    if (cls.includes('h2-siman-badge')) return { type: 'h2-siman', tag };
    if (cls.includes('block-h2-title-side')) return { type: 'h2-title-side-block', tag };
    if (cls.includes('h2-title-ornament-right')) return { type: 'h2-title-orn-r', tag };
    if (cls.includes('h2-title-ornament-left')) return { type: 'h2-title-orn-l', tag };
    if (cls.includes('h2-title-ornament-top')) return { type: 'h2-title-orn-top', tag };
    if (cls.includes('h2-title-ornament-bottom')) return { type: 'h2-title-orn-btm', tag };
    if (cls.includes('title-level-2-standalone')) return { type: 'h2-title', tag };
    if (cls.includes('h2-ornament-top')) return { type: 'h2-orn-top', tag };
    if (cls.includes('h2-ornament-bottom')) return { type: 'h2-orn-btm', tag };
    if (cls.includes('title-level-3')) return { type: 'h3', tag };
    if (cls.includes('title-level-4')) return { type: 'h4', tag };
    if (cls.includes('title-level-5')) return { type: 'h5', tag };
    if (cls.includes('title-level-6')) return { type: 'h6', tag };
    if (cls.includes('title-level-7')) return { type: 'h7', tag };
    if (cls.includes('title-level-custom')) return { type: 'h-custom', tag };
    if (cls.includes('h3-title-text')) return { type: 'h3-title', tag };
    if (cls.includes('h3-ornament-right')) return { type: 'h3-orn-r', tag };
    if (cls.includes('h3-ornament-left')) return { type: 'h3-orn-l', tag };
    if (cls.includes('p-cut')) return { type: 'p-cut', tag };
    if (cls.includes('p-end')) return { type: 'p-end', tag };
    if (tag === 'p') return { type: 'p', tag };
    if (cls.includes('side-note-anchor')) return { type: 'side-note', tag };
    if (cls.includes('section-divider')) return { type: 'sec-div', tag };
    if (cls.includes('drop-word')) return { type: 'drop-word', tag };
    if (cls.includes('note-marker')) return { type: 'note-marker', tag };
    return { type: 'other', tag, cls: cls.slice(0, 60) };
}

/* צבע לכל סוג רכיב (ל-overlay) */
const TYPE_COLORS = {
    'page': '#1e40af', 'wrapper': '#3b82f6', 'body-flow': '#60a5fa',
    'header': '#a78bfa', 'header-col': '#c4b5fd', 'header-ornament': '#818cf8', 'header-text': '#a5b4fc', 'header-page-number': '#f472b6', 'fn-ornament': '#fb7185', 'fn-header-title': '#fca5a5', 'page-number': '#f472b6',
    'footnote-area': '#dc2626', 'fn-header': '#ef4444', 'fn-rule': '#f87171',
    'fn-block': '#fca5a5', 'fn-line': '#fecaca', 'fn-num': '#fee2e2',
    'block-2col': '#059669', 'block-h3-span': '#10b981', 'block-single-col': '#34d399',
    'column': '#34d399', 'margin-col': '#6ee7b7', 'gutter': '#a7f3d0',
    'h2-spacer': '#d97706', 'h2-siman': '#f59e0b', 'h2-title': '#fbbf24',
    'h2-title-side-block': '#f59e0b', 'h2-title-orn-r': '#fb923c', 'h2-title-orn-l': '#fdba74',
    'h2-title-orn-top': '#fcd34d', 'h2-title-orn-btm': '#fde68a',
    'h2-orn-top': '#fcd34d', 'h2-orn-btm': '#fde68a',
    'h3': '#7c3aed', 'h4': '#8b5cf6', 'h5': '#a78bfa', 'h6': '#c4b5fd', 'h7': '#ddd6fe',
    'h3-title': '#7c3aed', 'h3-orn-r': '#a78bfa', 'h3-orn-l': '#a78bfa',
    'h-custom': '#7c3aed',
    'p': '#475569', 'p-cut': '#0ea5e9', 'p-end': '#0891b2',
    'side-note': '#db2777', 'sec-div': '#9333ea',
    'drop-word': '#16a34a', 'note-marker': '#dc2626',
    'other': '#94a3b8', 'unknown': '#cbd5e1'
};

/* רכיבים שכדאי לרדת לתוכם רקורסיבית */
const DESCEND_INTO = new Set([
    'page', 'wrapper', 'body-flow', 'header', 'header-col', 'footnote-area', 'fn-header',
    'block-2col', 'block-h3-span', 'block-single-col',
    'column', 'margin-col', 'fn-block'
]);

/* רכיבים שהם "טקסט" — נמדוד את השורות שלהם */
const TEXT_TYPES = new Set(['p', 'p-cut', 'p-end', 'fn-line', 'h2-title', 'h3-title', 'h3', 'h4', 'h5', 'h6', 'h7', 'header-text', 'header-page-number', 'fn-header-title']);

/* אוסף שורות טקסט מתוך אלמנט טקסט ע"י getClientRects על Range */
function collectLines(el) {
    const fragments = [];
    try {
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = range.getClientRects();
        const off = getBookContainerOffset();
        for (let i = 0; i < rects.length; i++) {
            const r = rects[i];
            if (r.height < 1 || r.width < 0.5) continue;
            fragments.push({
                x: r.left - off.x,
                y: r.top - off.y,
                w: r.width,
                h: r.height,
                right: r.right - off.x,
                bottom: r.bottom - off.y
            });
        }
    } catch (e) {
        // Empty text or Range errors yield an empty line list.
    }

    // Range.getClientRects() returns inline fragments, not necessarily one
    // rectangle per visual line. Merge fragments by vertical center, then
    // measure each line as the union of all its fragments. Keeping only the
    // first rectangle (the previous behavior) understated line widths whenever
    // a line contained multiple text nodes/spans, such as parentheses or markers.
    const clusters = [];
    fragments.sort((a, b) => ((a.y + a.bottom) / 2) - ((b.y + b.bottom) / 2) || a.x - b.x);
    for (const fragment of fragments) {
        const center = (fragment.y + fragment.bottom) / 2;
        let best = null;
        let bestDistance = Infinity;
        for (const cluster of clusters) {
            const clusterCenter = (cluster.y + cluster.bottom) / 2;
            const maxCenterDelta = Math.max(9, Math.min(11, Math.max(fragment.h, cluster.bottom - cluster.y) * 0.45));
            const distance = Math.abs(center - clusterCenter);
            if (distance <= maxCenterDelta && distance < bestDistance) {
                best = cluster;
                bestDistance = distance;
            }
        }
        if (!best) {
            clusters.push({
                x: fragment.x,
                y: fragment.y,
                right: fragment.right,
                bottom: fragment.bottom,
                fragmentCount: 1
            });
        } else {
            best.x = Math.min(best.x, fragment.x);
            best.y = Math.min(best.y, fragment.y);
            best.right = Math.max(best.right, fragment.right);
            best.bottom = Math.max(best.bottom, fragment.bottom);
            best.fragmentCount++;
        }
    }

    clusters.sort((a, b) => a.y - b.y || a.x - b.x);
    return clusters.map((line, idx) => ({
        x: line.x,
        y: line.y,
        w: line.right - line.x,
        h: line.bottom - line.y,
        right: line.right,
        bottom: line.bottom,
        fragmentCount: line.fragmentCount,
        idx
    }));
}

/* [חדש] אוסף מילים ורווחים מתוך אלמנט טקסט ע"י TreeWalker + Range.
   כל טוקן (מילה או רווח) מקבל קואורדינטות מוחלטות.
   רווחים נשמרים בנפרד כדי שנוכל למדוד את רוחבם (חשוב ליישור שורה). */
function collectWordsAndSpaces(el) {
    const tokens = [];
    if (!el || !document.createTreeWalker) return tokens;

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            const parent = node.parentNode;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            if (tag === 'script' || tag === 'style') return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    // [תיקון] קואורדינטות יחסיות ל-#book-container
    const off = getBookContainerOffset();

    let textNode;
    let tokenIdx = 0;
    while ((textNode = walker.nextNode())) {
        const textContent = textNode.textContent;
        if (!textContent) continue;
        // חלוקה לטוקנים: \S+ = מילה (כולל ניקוד/טעמים/פיסוק צמוד), \s+ = רווח
        const regex = /(\S+)|(\s+)/g;
        let match;
        while ((match = regex.exec(textContent)) !== null) {
            const isWord = !!match[1];
            const start = match.index;
            const end = start + match[0].length;
            try {
                const range = document.createRange();
                range.setStart(textNode, start);
                range.setEnd(textNode, end);
                const rects = range.getClientRects();
                for (let i = 0; i < rects.length; i++) {
                    const r = rects[i];
                    if (r.height < 0.5 || r.width < 0.5) continue;
                    tokens.push({
                        idx: tokenIdx++,
                        type: isWord ? 'word' : 'space',
                        text: match[0],
                        x: r.left - off.x, y: r.top - off.y,
                        w: r.width, h: r.height,
                        right: r.right - off.x, bottom: r.bottom - off.y
                    });
                }
            } catch (e) {
                // ignore
            }
        }
    }

    return tokens;
}

function buildNode(el, parent, pageOffset) {
    if (!el || el.nodeType !== 1) return null;
    const cls = classifyElement(el);
    if (cls.type === 'other' && el.children.length === 0) {
        // דלג על טקסט סטטי בלבד — span, br, וכו'
        // אבל אל תדלג על דברים עם class
        if (typeof el.className !== 'string' || !el.className) return null;
    }
    const rect = rectOf(el);
    // דלג על אלמנטים בלי גודל
    if (rect.w < 1 || rect.h < 1) return null;

    const siblingIndex = parent && Array.isArray(parent.children) ? parent.children.length : 0;
    const node = {
        // Stable traversal-path IDs make repeated geometry exports comparable.
        // Do not use Math.random(): it makes identical layouts produce different reports.
        id: (parent && parent.id ? parent.id : 'root') + '/' + cls.type + '[' + siblingIndex + ']',
        type: cls.type,
        tag: cls.tag,
        cls: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
        text: '',
        rect,
        children: [],
        lines: [],
        tokenId: el.getAttribute('data-token-id') || null,
        isContinuation: el.getAttribute('data-is-cont') === 'true',
        rawText: (el.getAttribute('data-raw-text') || '').slice(0, 160),
        footnoteReflowMetrics: cls.type === 'page' ? {
            queueCount: el.getAttribute('data-fn-reflow-queue-count'),
            predictedHeight: el.getAttribute('data-fn-reflow-predicted-height'),
            beforeFlowHeight: el.getAttribute('data-fn-reflow-before-flow-height'),
            afterFlowHeight: el.getAttribute('data-fn-reflow-after-flow-height'),
            flowHeightDelta: el.getAttribute('data-fn-reflow-flow-height-delta'),
            beforeLastBlockHeight: el.getAttribute('data-fn-reflow-before-last-block-height'),
            afterLastBlockHeight: el.getAttribute('data-fn-reflow-after-last-block-height'),
            afterLastBlockOverflow: el.getAttribute('data-fn-reflow-after-last-block-overflow'),
            lastBlockTopOffset: el.getAttribute('data-fn-reflow-last-block-top-offset')
        } : null,
        inlineGeometry: cls.type === 'note-marker' ? (() => {
            const cs = getComputedStyle(el);
            const markerRect = el.getBoundingClientRect();
            const parentRect = el.parentElement?.getBoundingClientRect?.() || null;
            const parentLines = Array.isArray(parent?.lines) ? parent.lines : [];
            const off = getBookContainerOffset();
            const markerCenter = ((markerRect.top + markerRect.bottom) / 2) - off.y;
            let nearestLine = null;
            let nearestLineDistance = Infinity;
            for (const line of parentLines) {
                const lineCenter = line.y + line.h / 2;
                const distance = Math.abs(markerCenter - lineCenter);
                if (distance < nearestLineDistance) {
                    nearestLine = line;
                    nearestLineDistance = distance;
                }
            }
            const round = value => Number.isFinite(value) ? Math.round(value * 1000) / 1000 : null;
            return {
                verticalAlign: cs.verticalAlign,
                lineHeight: cs.lineHeight,
                fontSize: cs.fontSize,
                fontFamily: cs.fontFamily,
                display: cs.display,
                position: cs.position,
                markerTop: round(rect.y),
                markerBottom: round(rect.bottom),
                parentTop: round(parent?.rect?.y),
                parentBottom: round(parent?.rect?.bottom),
                offsetFromParentTop: round(rect.y - (parent?.rect?.y ?? rect.y)),
                nearestLine: nearestLine ? {
                    y: round(nearestLine.y),
                    bottom: round(nearestLine.y + nearestLine.h),
                    topDelta: round(rect.y - nearestLine.y),
                    bottomDelta: round(rect.bottom - (nearestLine.y + nearestLine.h)),
                    centerDistance: round(nearestLineDistance)
                } : null,
                parentDomTop: parentRect ? round(parentRect.top - off.y) : null,
                parentDomBottom: parentRect ? round(parentRect.bottom - off.y) : null
            };
        })() : null,
        layoutMetrics: cls.type === 'block-2col' ? {
            fillRemaining: el.getAttribute('data-layout-fill-remaining'),
            fillFlowHeight: el.getAttribute('data-layout-fill-flow-height'),
            fillTopOffset: el.getAttribute('data-layout-fill-top-offset'),
            balanceCalled: el.getAttribute('data-layout-balance-called'),
            balanceStatus: el.getAttribute('data-layout-balance-status'),
            balanceSkipReason: el.getAttribute('data-layout-balance-skip-reason'),
            balanceRouting: el.getAttribute('data-layout-balance-routing'),
            lightJustifyResidualDiff: (() => {
                const value = el.getAttribute('data-layout-balance-light-residual-diff');
                const number = value === null ? NaN : Number(value);
                return Number.isFinite(number) ? number : null;
            })(),
            finalJustifyOvershootAfterShrink: (() => {
                const value = el.getAttribute('data-layout-final-justify-overshoot-after-shrink');
                const number = value === null || value === 'none' ? NaN : Number(value);
                return Number.isFinite(number) ? number : null;
            })(),
            finalJustifyCapacityAfter: (() => {
                const raw = el.getAttribute('data-layout-final-justify-capacity-after');
                if (!raw) return null;
                try { return JSON.parse(raw); } catch { return { parseError: true }; }
            })(),
            balanceInputHeight: el.getAttribute('data-layout-balance-input-height'),
            balanceAvailable: el.getAttribute('data-layout-balance-available'),
            balanceCandidates: el.getAttribute('data-layout-balance-candidates'),
            balanceItems: el.getAttribute('data-layout-balance-items'),
            balanceFits: el.getAttribute('data-layout-balance-fits'),
            balanceValid: el.getAttribute('data-layout-balance-valid'),
            balanceRightPartLines: el.getAttribute('data-layout-balance-right-part-lines'),
            balanceLeftPartLines: el.getAttribute('data-layout-balance-left-part-lines'),
            balanceOver: el.getAttribute('data-layout-balance-over'),
            balanceRight: el.getAttribute('data-layout-balance-right'),
            balanceLeft: el.getAttribute('data-layout-balance-left'),
            balanceDiff: el.getAttribute('data-layout-balance-diff'),
            pageFinalJustifyDiagnostic: el.getAttribute('data-layout-page-final-justify-diagnostic'),
            globalJustifyDiagnostic: el.getAttribute('data-layout-global-justify-diagnostic'),
            stageGeometryDiagnostic: (() => {
                const raw = el.getAttribute('data-layout-stage-geometry-diagnostic');
                if (!raw) return null;
                try { return JSON.parse(raw); } catch { return { parseError: true }; }
            })(),
            stageGeometryDiagnosticError: el.getAttribute('data-layout-stage-geometry-diagnostic-error'),
            finalPhase: el.getAttribute('data-layout-final-phase'),
            finalRightHeight: el.getAttribute('data-layout-final-right-height'),
            finalLeftHeight: el.getAttribute('data-layout-final-left-height'),
            finalDiff: el.getAttribute('data-layout-final-diff'),
            finalInnerHeight: el.getAttribute('data-layout-final-inner-height'),
            finalOuterHeight: el.getAttribute('data-layout-final-outer-height'),
            finalFits: el.getAttribute('data-layout-final-fits'),
            finalJustifyRollbackReason: el.getAttribute('data-layout-final-justify-rollback-reason'),
            postfitTriggered: el.getAttribute('data-layout-postfit-triggered'),
            postfitOuterOverflow: el.getAttribute('data-layout-postfit-outer-overflow'),
            postfitInnerOverflow: el.getAttribute('data-layout-postfit-inner-overflow'),
            globalJustifyRolledBack: el.getAttribute('data-layout-global-justify-rolled-back'),
            globalJustifyRollbackReason: el.getAttribute('data-layout-global-justify-rollback-reason'),
            globalJustifyBeforeRight: el.getAttribute('data-layout-global-justify-before-right'),
            globalJustifyBeforeLeft: el.getAttribute('data-layout-global-justify-before-left'),
            globalJustifyAfterRight: el.getAttribute('data-layout-global-justify-after-right'),
            globalJustifyAfterLeft: el.getAttribute('data-layout-global-justify-after-left'),
            globalJustifyOvershootBeforeShrink: el.getAttribute('data-layout-global-justify-overshoot-before-shrink'),
            globalJustifyOvershootAfterShrink: el.getAttribute('data-layout-global-justify-overshoot-after-shrink'),
            pageFinalJustifyRolledBack: el.getAttribute('data-layout-page-final-justify-rolled-back'),
            decisionRecord: (() => {
                const raw = el.getAttribute('data-layout-decision-record');
                if (!raw) return null;
                try { return JSON.parse(raw); } catch { return { parseError: true }; }
            })()
        } : null,
        parentType: parent ? parent.type : null
    };

    // אם זה רכיע טקסט — אסוף שורות
    if (TEXT_TYPES.has(cls.type)) {
        node.lines = collectLines(el);
        // טקסט קצר (לתוויות)
        node.text = (el.innerText || '').slice(0, 40).replace(/\n/g, ' ');
    }

    // רד רקורסיבית
    if (DESCEND_INTO.has(cls.type) || cls.type === 'page' || cls.type === 'wrapper' || cls.type === 'body-flow' || cls.type === 'fn-block') {
        for (const child of el.children) {
            const childNode = buildNode(child, node, pageOffset);
            if (childNode) node.children.push(childNode);
        }
    } else {
        // גם ברכיבים אחרים — בדוק ילדים שהם בעלי משמעות (drop-word, note-marker)
        for (const child of el.children) {
            const childCls = classifyElement(child);
            if (childCls.type !== 'other' && childCls.type !== 'unknown') {
                const childNode = buildNode(child, node, pageOffset);
                if (childNode) node.children.push(childNode);
            }
        }
    }

    return node;
}

/* חילוץ גיאומטריה מלאה מכל העמודים */
function extractGeometry() {
    const t0 = performance.now();
    const pages = [];
    const pageEls = document.querySelectorAll('#book-container .a4-page');
    pageEls.forEach((pgEl, pIdx) => {
        const pgRect = rectOf(pgEl);
        const page = {
            id: 'page-' + pIdx,
            idx: pIdx,
            label: (pgEl.querySelector('.page-number-footer')?.textContent?.trim() || String(pIdx + 1)),
            rect: pgRect,
            // The CLI report uses this synthetic page node (not the DOM page node).
            // Copy instrumentation attributes here so page-level reflow measurements survive serialization.
            footnoteReflowMetrics: {
                queueCount: pgEl.getAttribute('data-fn-reflow-queue-count'),
                predictedHeight: pgEl.getAttribute('data-fn-reflow-predicted-height'),
                beforeFlowHeight: pgEl.getAttribute('data-fn-reflow-before-flow-height'),
                afterFlowHeight: pgEl.getAttribute('data-fn-reflow-after-flow-height'),
                flowHeightDelta: pgEl.getAttribute('data-fn-reflow-flow-height-delta'),
                beforeLastBlockHeight: pgEl.getAttribute('data-fn-reflow-before-last-block-height'),
                afterLastBlockHeight: pgEl.getAttribute('data-fn-reflow-after-last-block-height'),
                afterLastBlockOverflow: pgEl.getAttribute('data-fn-reflow-after-last-block-overflow'),
                lastBlockTopOffset: pgEl.getAttribute('data-fn-reflow-last-block-top-offset')
            },
            children: [],
            issues: []
        };
        // חפש wrapper
        const wrapper = pgEl.querySelector('.page-content-wrapper');
        if (wrapper) {
            const wrapperNode = buildNode(wrapper, page, pgRect);
            if (wrapperNode) page.children.push(wrapperNode);
        }
        pages.push(page);
    });
    const sideNoteFitCorrections = Array.from(document.querySelectorAll('#book-container .a4-page .side-note-anchor[data-side-note-fit-correction]')).map(el => {
        const pageEl = el.closest('.a4-page');
        const pageIdx = Array.from(pageEls).indexOf(pageEl);
        const rect = rectOf(el);
        return {
            pageIdx,
            pageLabel: pageEl?.querySelector('.page-number-footer')?.textContent?.trim() || String(pageIdx + 1),
            tokenId: el.getAttribute('data-for-token'),
            correction: el.getAttribute('data-side-note-fit-correction'),
            shiftPx: Number(el.getAttribute('data-side-note-fit-shift-px')) || 0,
            noteText: (el.textContent || '').trim().slice(0, 160),
            rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.w * 10) / 10,
                h: Math.round(rect.h * 10) / 10, bottom: Math.round(rect.bottom * 10) / 10 }
        };
    });
    const t1 = performance.now();
    return { pages, sideNoteFitCorrections, stats: { pageCount: pages.length, extractMs: +(t1 - t0).toFixed(2) } };
}

/* ========================================================================
   חלק 2: בודק מתמטי
   ======================================================================== */

const TOL = {
    containment: 1.0,   // תיבה יכולה לבלוט עד 1px מאב (עיגול)
    overlap: 1.0,       // חפיפה עד 1px מותרת (עיגול)
    balance: 5,         // הפרש טורים עד 5px תקין
    orphanWidow: 1,     // שורה אחת בודדת = אלמנה/יתום
    sparseLastLine: 0.5 // שורה אחרונה ב-p-cut עם רוחב < 50% מהטור
};

function rContains(parent, child, tol) {
    tol = tol || 0;
    return child.rect.x >= parent.rect.x - tol &&
           child.rect.y >= parent.rect.y - tol &&
           child.rect.right <= parent.rect.right + tol &&
           child.rect.bottom <= parent.rect.bottom + tol;
}

function rOverlap(a, b) {
    const dx = Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.x, b.rect.x));
    const dy = Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.y, b.rect.y));
    return dx * dy;
}

function auditContainment(node, issues) {
    for (const child of node.children) {
        // Side notes are absolutely positioned anchors. Their height intentionally
        // does not contribute to the margin-column box, so containment against that
        // box is not a valid geometric invariant; audit them against body/page bounds below.
        if (node.type === 'margin-col' && child.type === 'side-note') {
            auditContainment(child, issues);
            continue;
        }
        if (!rContains(node, child, TOL.containment)) {
            const overflow = {
                left: Math.max(0, node.rect.x - child.rect.x),
                top: Math.max(0, node.rect.y - child.rect.y),
                right: Math.max(0, child.rect.right - node.rect.right),
                bottom: Math.max(0, child.rect.bottom - node.rect.bottom)
            };
            const overflowPx = Math.max(overflow.left, overflow.top, overflow.right, overflow.bottom);

            // [תיקון] התאם את החומרה והסיווג לפי סוג הגלישה:
            // - block-2col שגולש מ-body-flow: מסווגים לפי גודל הגלישה בלבד.
            //   אין להסיק שהגלישה נגרמה מ-stretchPageToBottom בלי ראיה ממדדי הפריסה.
            // - note-marker שגולש מ-p-cut/p-end: עיגול פיקסלים של סמן הערה (1.3px) = low.
            // - side-note שגולש מ-margin-col: גלישה אמיתית של הערות צד.
            // - כל השאר: גלישה אמיתית.
            let severity = 'high';
            let kind = 'containment';
            let note = '';
            const isBlockFromBodyFlow = child.type === 'block-2col' && node.type === 'body-flow';
            const isNoteMarker = child.type === 'note-marker';
            const isSideNote = child.type === 'side-note';

            if (isBlockFromBodyFlow) {
                if (overflowPx <= 10) {
                    severity = 'low';
                    note = ' (גלישה קטנה של block-2col מ-body-flow)';
                } else if (overflowPx <= 20) {
                    severity = 'medium';
                    note = ' (גלישת block-2col מ-body-flow)';
                } else {
                    severity = 'high';
                    note = ' (גלישה חמורה של block-2col מ-body-flow; נדרשת בדיקת מקור)';
                }
            } else if (isNoteMarker && overflowPx <= 3) {
                // Inline/superscript note markers can extend slightly beyond the paragraph
                // line box; a ~2–3px vertical protrusion is not a page-layout failure.
                severity = 'low';
                kind = 'containment-rounding';
                note = ' (חריגה אנכית קטנה של סמן הערה בתוך שורת טקסט)';
            } else if (child.type === 'header-col') {
                // Header text/SVG can exceed the grid row by a few pixels because of line boxes.
                // Keep small overflow visible as a warning, not a critical geometry failure.
                severity = overflowPx > 8 ? 'high' : (overflowPx > 3 ? 'medium' : 'low');
                note = ' (חריגה אנכית של עמודת כותרת)';
            } else if (isSideNote) {
                severity = overflowPx > 20 ? 'high' : 'medium';
                note = ' (הערת צד גולשת משטח המרזב)';
            }

            issues.push({
                kind: kind,
                severity: severity,
                pageIdx: getPageIdx(node),
                location: describePath(node),
                childType: child.type,
                childText: child.text,
                parentRect: { x: Math.round(node.rect.x), y: Math.round(node.rect.y), w: Math.round(node.rect.w), h: Math.round(node.rect.h), bottom: Math.round(node.rect.bottom) },
                previousSiblings: node.children.slice(Math.max(0, node.children.indexOf(child) - 5), node.children.indexOf(child)).map(s => ({
                    type: s.type, cls: s.cls, text: s.text,
                    rect: { x: Math.round(s.rect.x), y: Math.round(s.rect.y), w: Math.round(s.rect.w), h: Math.round(s.rect.h), bottom: Math.round(s.rect.bottom) }
                })),
                childRect: { x: Math.round(child.rect.x), y: Math.round(child.rect.y), w: Math.round(child.rect.w), h: Math.round(child.rect.h), bottom: Math.round(child.rect.bottom) },
                layoutMetrics: child.layoutMetrics || null,
                inlineGeometry: child.inlineGeometry || (child.type === 'note-marker' ? resolveNoteMarkerInlineGeometry(child.rect) : null),
                inlineGeometrySource: child.inlineGeometry ? 'tree-extraction' : (child.type === 'note-marker' ? 'live-dom-fallback' : null),
                childDetails: child.type === 'block-2col' ? child.children.filter(c => c.type === 'column').map(col => ({
                    side: col.side,
                    rect: { x: Math.round(col.rect.x), y: Math.round(col.rect.y), w: Math.round(col.rect.w), h: Math.round(col.rect.h), bottom: Math.round(col.rect.bottom) },
                    paragraphCount: col.children.filter(p => ['p', 'p-cut', 'p-end'].includes(p.type)).length,
                    firstParagraphs: col.children.filter(p => ['p', 'p-cut', 'p-end'].includes(p.type)).slice(0, 2).map(p => ({
                        type: p.type, tokenId: p.tokenId, isContinuation: p.isContinuation, lineCount: p.lines.length, text: p.rawText || p.text
                    })),
                    lastParagraphs: col.children.filter(p => ['p', 'p-cut', 'p-end'].includes(p.type)).slice(-3).map(p => ({
                        type: p.type, tokenId: p.tokenId, isContinuation: p.isContinuation, lineCount: p.lines.length, text: p.rawText || p.text
                    }))
                })) : undefined,
                overflow,
                overflowPx: Math.round(overflowPx * 10) / 10,
                note: note.trim(),
                message: `תיבת ${child.type} בולטת מ-${node.type}: ${JSON.stringify(overflow)}${note}`
            });
        }
        auditContainment(child, issues);
    }
}

function auditSideNoteBounds(node, issues) {
    if (node.type === 'side-note') {
        let ancestor = node._parent;
        let marginCol = null, bodyFlow = null;
        while (ancestor) {
            if (!marginCol && ancestor.type === 'margin-col') marginCol = ancestor;
            if (!bodyFlow && ancestor.type === 'body-flow') bodyFlow = ancestor;
            ancestor = ancestor._parent;
        }
        const horizontalOverflow = marginCol ? Math.max(
            0,
            marginCol.rect.x - node.rect.x,
            node.rect.right - marginCol.rect.right
        ) : 0;
        const verticalOverflow = bodyFlow ? Math.max(
            0,
            bodyFlow.rect.y - node.rect.y,
            node.rect.bottom - bodyFlow.rect.bottom
        ) : 0;
        const overflowPx = Math.max(horizontalOverflow, verticalOverflow);
        if (overflowPx > TOL.containment) {
            const el = _nodeToEl.get(node);
            const pageEl = el?.closest('.a4-page');
            const blockEl = el?.closest('.block-2col, .block-single-col');
            const marginEl = el?.parentElement;
            const tokenId = el?.getAttribute('data-for-token') || node.tokenId || null;
            const findAnchor = (block, id) => block && id
                ? Array.from(block.querySelectorAll('p[data-token-id]')).find(p =>
                    p.getAttribute('data-token-id') === id && p.getAttribute('data-is-cont') !== 'true') || null
                : null;
            const anchorEl = findAnchor(blockEl, tokenId);
            const toRect = elem => {
                if (!elem) return null;
                const r = rectOf(elem);
                return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.w * 10) / 10,
                    h: Math.round(r.h * 10) / 10, bottom: Math.round(r.bottom * 10) / 10 };
            };
            const currentRect = toRect(el);
            const rightMargin = !!marginEl?.classList.contains('right-margin');
            const leftMargin = !!marginEl?.classList.contains('left-margin');
            const nearbyNotes = pageEl ? Array.from(pageEl.querySelectorAll('.margin-notes-column .side-note-anchor'))
                .filter(note => {
                    const m = note.parentElement;
                    return (!!m?.classList.contains('right-margin') === rightMargin)
                        && (!!m?.classList.contains('left-margin') === leftMargin);
                })
                .map(note => {
                    const r = toRect(note);
                    const id = note.getAttribute('data-for-token');
                    const noteBlock = note.closest('.block-2col, .block-single-col');
                    const noteAnchor = findAnchor(noteBlock, id);
                    return { tokenId: id, text: (note.textContent || '').trim().slice(0, 160),
                        rect: r, anchorRect: toRect(noteAnchor),
                        blockRect: toRect(noteBlock) };
                })
                .filter(note => note.rect && currentRect && Math.abs(note.rect.y - currentRect.y) <= 180)
                .sort((x, y) => x.rect.y - y.rect.y) : [];
            const cs = el ? getComputedStyle(el) : null;
            issues.push({
                kind: 'side-note-overflow',
                severity: overflowPx > 20 ? 'high' : (overflowPx > 8 ? 'medium' : 'low'),
                pageIdx: getPageIdx(node),
                location: describePath(node),
                tokenId,
                noteText: (el?.textContent || '').trim().slice(0, 300),
                childRect: { x: Math.round(node.rect.x), y: Math.round(node.rect.y), w: Math.round(node.rect.w), h: Math.round(node.rect.h), bottom: Math.round(node.rect.bottom) },
                marginRect: marginCol ? { x: Math.round(marginCol.rect.x), y: Math.round(marginCol.rect.y), w: Math.round(marginCol.rect.w), h: Math.round(marginCol.rect.h), bottom: Math.round(marginCol.rect.bottom) } : null,
                bodyFlowRect: bodyFlow ? { x: Math.round(bodyFlow.rect.x), y: Math.round(bodyFlow.rect.y), w: Math.round(bodyFlow.rect.w), h: Math.round(bodyFlow.rect.h), bottom: Math.round(bodyFlow.rect.bottom) } : null,
                blockRect: toRect(blockEl),
                anchorRect: toRect(anchorEl),
                anchorText: (anchorEl?.getAttribute('data-raw-text') || anchorEl?.textContent || '').trim().slice(0, 160),
                noteStyle: cs ? { top: cs.top, position: cs.position, fontSize: cs.fontSize, lineHeight: cs.lineHeight,
                    fitCorrection: el?.getAttribute('data-side-note-fit-correction') || null,
                    fitShiftPx: el?.getAttribute('data-side-note-fit-shift-px') || null } : null,
                nearbySameSideNotes: nearbyNotes,
                overflowPx: Math.round(overflowPx * 10) / 10,
                message: 'הערת צד חורגת מתחום השוליים או מגבולות גוף העמוד: ' + Math.round(overflowPx * 10) / 10 + 'px'
            });
        }
    }
    for (const child of node.children) auditSideNoteBounds(child, issues);
}

function auditSiblingOverlap(node, issues) {
    if (node.children.length < 2) {
        for (const c of node.children) auditSiblingOverlap(c, issues);
        return;
    }
    // בדוק כל זוגות הילדים — אבל רק כאלה שאמורים לא לחפוף (לא טורים מקבילים)
    for (let i = 0; i < node.children.length; i++) {
        for (let j = i + 1; j < node.children.length; j++) {
            const a = node.children[i], b = node.children[j];
            const dx = Math.max(0, Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.x, b.rect.x));
            const dy = Math.max(0, Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.y, b.rect.y));
            const ov = dx * dy;
            // Ignore edge-only/subpixel contacts: area alone can label a 1px-wide seam
            // as a serious overlap even when the rectangles are merely touching after rounding.
            if (dx > 1.5 && dy > 1.5 && ov > TOL.overlap) {
                // אם שניהם טורים (column) באותו בלוק — זה תקין (ם נמצאים זה ליד זה, לא חופפים)
                if (a.type === 'column' && b.type === 'column') continue;
                // הערות בתוך fn-line — לפעמים חופפות עם note-line-num
                if (a.parentType === 'fn-line' || b.parentType === 'fn-line') continue;
                issues.push({
                    kind: 'overlap',
                    severity: ov > 100 ? 'high' : (ov > 25 ? 'medium' : 'low'),
                    pageIdx: getPageIdx(node),
                    location: describePath(node),
                    aType: a.type, aText: a.text,
                    bType: b.type, bText: b.text,
                    aRect: { x: Math.round(a.rect.x), y: Math.round(a.rect.y), w: Math.round(a.rect.w), h: Math.round(a.rect.h) },
                    bRect: { x: Math.round(b.rect.x), y: Math.round(b.rect.y), w: Math.round(b.rect.w), h: Math.round(b.rect.h) },
                    overlapPx: Math.round(ov),
                    message: `חפיפה בין ${a.type} ו-${b.type} ב-${node.type}: ${Math.round(ov)}px²`
                });
            }
        }
    }
    for (const c of node.children) auditSiblingOverlap(c, issues);
}

function auditColumnBalance(node, issues) {
    if (node.type === 'block-2col') {
        const rightNode = node.children.find(c => c.type === 'column' && c.side === 'right') || null;
        const leftNode = node.children.find(c => c.type === 'column' && c.side === 'left') || null;
        const blockEl = _nodeToEl.get(node) || null;

        // buildNodeWithRefs intentionally omits rectangles < 1px high. That is
        // correct for the general geometry tree, but it must not make a fully
        // empty column invisible to the balance audit. Recover both sides from
        // the live DOM, including zero-height rectangles, whenever possible.
        function resolveColumnGeometry(side, existingNode) {
            if (existingNode) {
                return {
                    rect: existingNode.rect,
                    node: existingNode,
                    source: 'geometry-model',
                    elementPresent: true
                };
            }
            if (blockEl) {
                const candidates = Array.from(blockEl.querySelectorAll('.main-column'));
                const el = candidates.find(candidate => {
                    const cls = typeof candidate.className === 'string' ? candidate.className : '';
                    return side === 'right' ? cls.includes('right-col') : cls.includes('left-col');
                });
                if (el) {
                    return {
                        rect: rectOf(el),
                        node: null,
                        source: 'live-dom-including-zero-height',
                        elementPresent: true
                    };
                }
            }
            // Missing markup is not silently ignored: model it as zero geometry
            // and label the source so the report distinguishes malformed/missing
            // DOM from an actual empty column element.
            const blockRect = node.rect || { x: 0, y: 0, w: 0, h: 0, right: 0, bottom: 0 };
            return {
                rect: { x: blockRect.x, y: blockRect.y, w: 0, h: 0, right: blockRect.x, bottom: blockRect.y },
                node: null,
                source: 'missing-dom-column',
                elementPresent: false
            };
        }

        const right = resolveColumnGeometry('right', rightNode);
        const left = resolveColumnGeometry('left', leftNode);
        if (right && left) {
            const rightHeight = Number.isFinite(right.rect.h) ? right.rect.h : 0;
            const leftHeight = Number.isFinite(left.rect.h) ? left.rect.h : 0;
            const diff = Math.abs(rightHeight - leftHeight);
            if (diff > TOL.balance) {
                const metrics = node.layoutMetrics || {};
                const decision = metrics.decisionRecord || {};
                const selection = decision.selection || {};
                const finalJustify = decision.finalJustify || {};
                const routing = metrics.balanceRouting || selection.routing;
                const residualDiff = Number.isFinite(metrics.lightJustifyResidualDiff)
                    ? metrics.lightJustifyResidualDiff : selection.lightJustify?.residualDiff;
                const overshootAfterShrink = Number.isFinite(metrics.finalJustifyOvershootAfterShrink)
                    ? metrics.finalJustifyOvershootAfterShrink : finalJustify.overshootAfterShrink;
                const capacityAfter = metrics.finalJustifyCapacityAfter || finalJustify.capacityAfter || {};
                const shorterSide = rightHeight <= leftHeight ? 'right' : 'left';
                const shorterCapacity = capacityAfter[shorterSide];
                let balanceOutcome = 'unclassified-residual';
                let acceptedResidualLimitPx = null;
                if (routing === 'light-justify' &&
                    Number.isFinite(residualDiff) &&
                    Math.abs(residualDiff) <= 8) {
                    balanceOutcome = 'policy-accepted-light-justify-residual';
                    acceptedResidualLimitPx = 8;
                } else if (routing === 'balanceColumns' &&
                    Number.isFinite(overshootAfterShrink) &&
                    overshootAfterShrink < -0.5 &&
                    shorterCapacity &&
                    Number.isFinite(shorterCapacity.totalCapacity) &&
                    shorterCapacity.totalCapacity <= 0.5) {
                    balanceOutcome = 'capacity-limited-residual';
                }

                const roundRect = rect => ({
                    x: Math.round(Number.isFinite(rect.x) ? rect.x : 0),
                    y: Math.round(Number.isFinite(rect.y) ? rect.y : 0),
                    w: Math.round(Number.isFinite(rect.w) ? rect.w : 0),
                    h: Math.round(Number.isFinite(rect.h) ? rect.h : 0)
                });
                const emptySide = rightHeight <= leftHeight ? 'right' : 'left';
                const emptyHeight = emptySide === 'right' ? rightHeight : leftHeight;
                const isCompletelyEmpty = emptyHeight < 1;

                issues.push({
                    kind: 'imbalance',
                    severity: isCompletelyEmpty ? 'high' : (diff > 30 ? 'high' : (diff > 10 ? 'medium' : 'low')),
                    pageIdx: getPageIdx(node),
                    location: describePath(node),
                    rightH: Math.round(rightHeight),
                    leftH: Math.round(leftHeight),
                    diff: Math.round(diff),
                    balanceOutcome: isCompletelyEmpty ? 'one-column-empty' : balanceOutcome,
                    acceptedResidualLimitPx,
                    emptyColumnSide: isCompletelyEmpty ? emptySide : null,
                    columnGeometrySource: {
                        right: right.source,
                        left: left.source
                    },
                    columnElementPresent: {
                        right: right.elementPresent,
                        left: left.elementPresent
                    },
                    injectedEmptyColumnTest: blockEl?.getAttribute('data-geometry-audit-test-empty-column') === 'true',
                    rightRect: roundRect(right.rect),
                    leftRect: roundRect(left.rect),
                    layoutMetrics: metrics ? {
                        globalJustifyDiagnostic: metrics.globalJustifyDiagnostic || null,
                        pageFinalJustifyDiagnostic: metrics.pageFinalJustifyDiagnostic || null,
                        balanceStatus: metrics.balanceStatus || null,
                        balanceSkipReason: metrics.balanceSkipReason || null,
                        balanceDiff: metrics.balanceDiff || null,
                        decisionRecord: decision,
                        stageGeometryDiagnostic: metrics.stageGeometryDiagnostic || null
                    } : null,
                    message: isCompletelyEmpty
                        ? `אי-איזון חמור: הטור ${emptySide === 'right' ? 'הימני' : 'השמאלי'} ריק לחלוטין (גובה ${Math.round(emptyHeight)}px); הטור השני בגובה ${Math.round(emptySide === 'right' ? leftHeight : rightHeight)}px; פער=${Math.round(diff)}px`
                        : `אי-איזון טורים: ימין=${Math.round(rightHeight)}px שמאל=${Math.round(leftHeight)}px פער=${Math.round(diff)}px [${balanceOutcome}]`
                });
            }
        }
    }
    for (const c of node.children) auditColumnBalance(c, issues);
}

function auditWidowOrphan(node, issues) {
    if (node.type === 'column') {
        const ps = node.children.filter(c => c.type === 'p' || c.type === 'p-cut' || c.type === 'p-end');
        if (ps.length > 0) {
            const first = ps[0];
            const last = ps[ps.length - 1];

            // A short complete paragraph is NOT a widow. A widow is the single
            // final line of a paragraph continued from a previous column/page,
            // stranded at the top of this column.
            if (first.lines.length === 1 && first.type === 'p-end' && first.isContinuation) {
                issues.push({
                    kind: 'widow',
                    severity: 'medium',
                    pageIdx: getPageIdx(node),
                    location: describePath(node),
                    tokenId: first.tokenId,
                    pText: first.text,
                    childRect: { x: Math.round(first.rect.x), y: Math.round(first.rect.y), w: Math.round(first.rect.w), h: Math.round(first.rect.h) },
                    message: `אלמנה: השורה האחרונה של פסקה נמשכת מופיעה לבדה בראש טור ${node.side} ("${first.text.slice(0, 30)}...")`
                });
            }

            // An orphan is the first line of a paragraph stranded at the bottom
            // of a column while the same paragraph continues in the next column/page.
            if (last.lines.length === 1 && last.type === 'p-cut') {
                const lastEl = _nodeToEl.get(last);
                const splitAttr = name => lastEl?.getAttribute(name) ?? null;
                const cs = lastEl ? getComputedStyle(lastEl) : null;
                issues.push({
                    kind: 'orphan',
                    severity: 'medium',
                    pageIdx: getPageIdx(node),
                    location: describePath(node),
                    tokenId: last.tokenId,
                    pText: last.text,
                    className: last.cls,
                    isContinuation: last.isContinuation,
                    renderedLineCount: last.lines.length,
                    renderedLineWidths: last.lines.map(line => Math.round(line.w * 100) / 100),
                    splitDiagnostics: {
                        inputLines: splitAttr('data-layout-split-input-lines'),
                        fitLines: splitAttr('data-layout-split-fit-lines'),
                        placedLines: splitAttr('data-layout-split-placed-lines'),
                        minFirst: splitAttr('data-layout-split-min-first'),
                        minLast: splitAttr('data-layout-split-min-last'),
                        insideParen: splitAttr('data-layout-split-inside-paren'),
                        fontSize: cs?.fontSize ?? null,
                        lineHeight: cs?.lineHeight ?? null,
                        textAlignLast: cs?.textAlignLast ?? null
                    },
                    childRect: { x: Math.round(last.rect.x), y: Math.round(last.rect.y), w: Math.round(last.rect.w), h: Math.round(last.rect.h) },
                    message: `יתום: שורה ראשונה של פסקה מופיעה לבדה בתחתית טור ${node.side} ("${last.text.slice(0, 30)}...")`
                });
            }
        }
    }
    for (const c of node.children) auditWidowOrphan(c, issues);
}

function auditSparseLastLine(node, issues) {
    // Only p-cut fragments are checked: a cut paragraph should not end with
    // an unusually short line because its next line did not fit.
    if (node.type === 'p-cut' && node.lines.length > 1) {
        const lastLine = node.lines[node.lines.length - 1];
        const firstLine = node.lines[0];
        if (firstLine.w > 0 && lastLine.w < firstLine.w * TOL.sparseLastLine) {
            // Parenthetical text is intentionally set smaller and can look sparse
            // while still carrying a full line of content.
            const el = _nodeToEl.get(node);
            let hasParenOnLastLine = false;
            if (el) {
                const parenSpans = el.querySelectorAll('.paren-text');
                const lastLineTop = Math.round(lastLine.y);
                for (const span of parenSpans) {
                    const sr = span.getBoundingClientRect();
                    const off = getBookContainerOffset();
                    const spanTop = Math.round(sr.top - off.y);
                    if (Math.abs(spanTop - lastLineTop) < 8) {
                        hasParenOnLastLine = true;
                        break;
                    }
                }
            }
            if (!hasParenOnLastLine) {
                const lineTokens = line => (Array.isArray(node.words) ? node.words : [])
                    .filter(token => Math.abs(token.y - line.y) < Math.max(4, line.h * 0.35))
                    .sort((a, b) => a.idx - b.idx)
                    .map(token => ({
                        text: token.text,
                        type: token.type,
                        x: Math.round(token.x * 100) / 100,
                        width: Math.round(token.w * 100) / 100
                    }));
                const compactLine = line => {
                    const tokens = lineTokens(line);
                    return {
                        y: Math.round(line.y * 100) / 100,
                        width: Math.round(line.w * 100) / 100,
                        height: Math.round(line.h * 100) / 100,
                        text: tokens.map(token => token.text).join('').slice(0, 240),
                        tokens: tokens.slice(0, 40)
                    };
                };
                const splitAttr = name => el?.getAttribute(name) ?? null;
                const cs = el ? getComputedStyle(el) : null;
                issues.push({
                    kind: 'sparse-line',
                    severity: 'low',
                    pageIdx: getPageIdx(node),
                    location: describePath(node),
                    lastW: Math.round(lastLine.w),
                    firstW: Math.round(firstLine.w),
                    pText: node.text,
                    firstLine: compactLine(firstLine),
                    lastLine: compactLine(lastLine),
                    splitDiagnostics: {
                        inputLines: splitAttr('data-layout-split-input-lines'),
                        fitLines: splitAttr('data-layout-split-fit-lines'),
                        placedLines: splitAttr('data-layout-split-placed-lines'),
                        minFirst: splitAttr('data-layout-split-min-first'),
                        minLast: splitAttr('data-layout-split-min-last'),
                        insideParen: splitAttr('data-layout-split-inside-paren'),
                        fontSize: cs?.fontSize ?? null,
                        lineHeight: cs?.lineHeight ?? null,
                        textAlignLast: cs?.textAlignLast ?? null
                    },
                    childRect: { x: Math.round(lastLine.x), y: Math.round(lastLine.y), w: Math.round(lastLine.w), h: Math.round(lastLine.h) },
                    message: `שורה דלילה בסוף p-cut: רוחב אחרון=${Math.round(lastLine.w)}px ראשון=${Math.round(firstLine.w)}px`
                });
            }
        }
    }
    for (const c of node.children) auditSparseLastLine(c, issues);
}

function auditOverflowToFootnote(page, issues) {
    // בדוק שתחתית ה-body-flow לא חודרת לתוך אזור ההערות
    const wrapper = page.children[0];
    if (!wrapper) return;
    const bodyFlow = findChild(wrapper, 'body-flow');
    const fnArea = findChild(wrapper, 'footnote-area');
    const pageNumber = findChild(wrapper, 'page-number');
    if (bodyFlow && fnArea) {
        const gap = fnArea.rect.y - bodyFlow.rect.bottom;
        if (gap < -TOL.containment) {
            issues.push({
                kind: 'fn-overflow',
                severity: 'high',
                pageIdx: page.idx,
                location: `page ${page.label}`,
                overlapPx: Math.round(-gap),
                bodyBottom: Math.round(bodyFlow.rect.bottom),
                fnTop: Math.round(fnArea.rect.y),
                childRect: { x: Math.round(fnArea.rect.x), y: Math.round(fnArea.rect.y), w: Math.round(fnArea.rect.w), h: Math.round(fnArea.rect.h) },
                message: `גוף חופף לאזור הערות בעמוד ${page.label}: ${Math.round(-gap)}px`
            });
        }
    }
    if (bodyFlow && pageNumber) {
        const gap = pageNumber.rect.y - bodyFlow.rect.bottom;
        if (gap < -TOL.containment) {
            issues.push({
                kind: 'pn-overflow',
                severity: 'high',
                pageIdx: page.idx,
                location: `page ${page.label}`,
                overlapPx: Math.round(-gap),
                bodyBottom: Math.round(bodyFlow.rect.bottom),
                pnTop: Math.round(pageNumber.rect.y),
                childRect: { x: Math.round(pageNumber.rect.x), y: Math.round(pageNumber.rect.y), w: Math.round(pageNumber.rect.w), h: Math.round(pageNumber.rect.h) },
                message: `גוף חופף למספר עמוד בעמוד ${page.label}: ${Math.round(-gap)}px`
            });
        }
    }
    // [חדש] בדוק ש-fn-area לא חורג מתחתית העמוד
    if (fnArea) {
        const pageBottom = page.rect.bottom;
        if (fnArea.rect.bottom > pageBottom + TOL.containment) {
            issues.push({
                kind: 'fn-page-overflow',
                severity: 'high',
                pageIdx: page.idx,
                location: `page ${page.label}`,
                overflowPx: Math.round(fnArea.rect.bottom - pageBottom),
                fnBottom: Math.round(fnArea.rect.bottom),
                pageBottom: Math.round(pageBottom),
                childRect: { x: Math.round(fnArea.rect.x), y: Math.round(fnArea.rect.y), w: Math.round(fnArea.rect.w), h: Math.round(fnArea.rect.h) },
                message: `אזור הערות חורג מתחתית עמוד ${page.label}: ${Math.round(fnArea.rect.bottom - pageBottom)}px`
            });
        }
    }
    // [חדש] בדוק ש-fn-area לא חופף ל-page-number
    if (fnArea && pageNumber) {
        const gap = pageNumber.rect.y - fnArea.rect.bottom;
        if (gap < -TOL.containment) {
            issues.push({
                kind: 'fn-pn-overflow',
                severity: 'high',
                pageIdx: page.idx,
                location: `page ${page.label}`,
                overlapPx: Math.round(-gap),
                fnBottom: Math.round(fnArea.rect.bottom),
                pnTop: Math.round(pageNumber.rect.y),
                childRect: { x: Math.round(fnArea.rect.x), y: Math.round(fnArea.rect.y), w: Math.round(fnArea.rect.w), h: Math.round(fnArea.rect.h) },
                message: `אזור הערות חופף למספר עמוד בעמוד ${page.label}: ${Math.round(-gap)}px`
            });
        }
    }
    // [חדש] בדוק הכלה פנימית באזור ההערות: fn-block בתוך fn-area, fn-line בתוך fn-block
    if (fnArea) {
        auditFnContainment(fnArea, page, issues);
    }
}

/* [חדש] בודק הכלה פנימית באזור ההערות:
   - fn-block בתוך fn-area
   - fn-line בתוך fn-block
   - fn-rule בתוך fn-area
   - fn-header בתוך fn-area */
function auditFnContainment(fnAreaNode, page, issues) {
    for (const child of fnAreaNode.children) {
        // fn-block צריך להיות בתוך fn-area
        if (child.type === 'fn-block' || child.type === 'fn-rule' || child.type === 'fn-header') {
            if (!rContains(fnAreaNode, child, TOL.containment)) {
                const overflowPx = Math.max(
                    Math.max(0, fnAreaNode.rect.x - child.rect.x),
                    Math.max(0, fnAreaNode.rect.y - child.rect.y),
                    Math.max(0, child.rect.right - fnAreaNode.rect.right),
                    Math.max(0, child.rect.bottom - fnAreaNode.rect.bottom)
                );
                issues.push({
                    kind: 'fn-containment',
                    severity: overflowPx > 5 ? 'high' : 'medium',
                    pageIdx: page.idx,
                    location: `page ${page.label}`,
                    childType: child.type,
                    overflowPx: Math.round(overflowPx * 10) / 10,
                    childRect: { x: Math.round(child.rect.x), y: Math.round(child.rect.y), w: Math.round(child.rect.w), h: Math.round(child.rect.h) },
                    message: `${child.type} בולט מ-fn-area בעמוד ${page.label}: ${Math.round(overflowPx)}px`
                });
            }
        }
        // fn-line צריך להיות בתוך fn-block
        if (child.type === 'fn-block') {
            for (const line of child.children) {
                if (line.type === 'fn-line') {
                    if (!rContains(child, line, TOL.containment)) {
                        const overflowPx = Math.max(
                            Math.max(0, child.rect.x - line.rect.x),
                            Math.max(0, child.rect.y - line.rect.y),
                            Math.max(0, line.rect.right - child.rect.right),
                            Math.max(0, line.rect.bottom - child.rect.bottom)
                        );
                        issues.push({
                            kind: 'fn-line-overflow',
                            severity: overflowPx > 5 ? 'medium' : 'low',
                            pageIdx: page.idx,
                            location: `page ${page.label}`,
                            childType: 'fn-line',
                            overflowPx: Math.round(overflowPx * 10) / 10,
                            childRect: { x: Math.round(line.rect.x), y: Math.round(line.rect.y), w: Math.round(line.rect.w), h: Math.round(line.rect.h) },
                            message: `שורת הערה בולטת מבלוק הערות בעמוד ${page.label}: ${Math.round(overflowPx)}px`
                        });
                    }
                }
            }
        }
    }
}

function auditPageOverflow(page, issues) {
    // בדוק שאף רכיב לא חורג מתחתית העמוד
    const pageBottom = page.rect.bottom;
    function checkRecursive(node) {
        if (node.rect.bottom > pageBottom + TOL.containment) {
            issues.push({
                kind: 'page-overflow',
                severity: 'high',
                pageIdx: page.idx,
                location: `page ${page.label}`,
                nodeType: node.type,
                nodeText: node.text,
                overflowPx: Math.round(node.rect.bottom - pageBottom),
                message: `${node.type} חורג מתחתית עמוד ${page.label}: ${Math.round(node.rect.bottom - pageBottom)}px`
            });
        }
        for (const c of node.children) checkRecursive(c);
    }
    for (const c of page.children) checkRecursive(c);
}

function findChild(node, type) {
    return node.children.find(c => c.type === type);
}

function getPageIdx(node) {
    // עולה בעץ דרך _parent עד ל-page
    let n = node;
    while (n) {
        if (n.type === 'page') return n.idx;
        n = n._parent;
    }
    return -1;
}

function describePath(node) {
    const parts = [];
    let n = node;
    while (n) {
        parts.unshift(n.type + (n.text ? `("${n.text.slice(0, 20)}")` : ''));
        n = n._parent;
    }
    return parts.join(' > ');
}

/* הוסף _parent לכל נקודה בעץ כדי ש-describePath יעבוד */
function annotateParents(node, parent) {
    node._parent = parent;
    for (const c of node.children) annotateParents(c, node);
}

function findPageIdxInTree(node) {
    let n = node;
    while (n && n.type !== 'page') n = n._parent;
    return n ? n.idx : -1;
}

/* בדיקת תפוסה נמוכה של עמודי תוכן.
   זו בדיקת אבחון בלבד: היא אינה משנה את העימוד ואינה מסיקה שחוסר איזון הוא תקלה.
   עמוד סוף פרק מוחרג כאשר העמוד הבא נפתח בכותרת 2; בעמוד תחילת פרק
   שטח הכותרת והמרווח שמעל הטקסט אינם נחשבים לשטח טקסט חסר. */
function auditSparsePage(page, issues) {
    const pageEl = _nodeToEl && _nodeToEl.get(page);
    if (!pageEl) return;

    const pageEls = Array.from(document.querySelectorAll('#book-container .a4-page'));
    const pageIndex = pageEls.indexOf(pageEl);
    const bodyFlow = pageEl.querySelector('.page-body-flow');
    if (!bodyFlow) return;

    const flowRect = bodyFlow.getBoundingClientRect();
    if (!(flowRect.height > 0)) return;

    const heading2Selector = '.title-level-2-standalone';
    const nextPage = pageIndex >= 0 ? pageEls[pageIndex + 1] : null;
    const nextHeading2 = nextPage?.querySelector(heading2Selector);
    const nextFlow = nextPage?.querySelector('.page-body-flow');
    const nextFlowRect = nextFlow?.getBoundingClientRect();
    const nextHeadingRect = nextHeading2?.getBoundingClientRect();
    const nextPageStartsChapter = !!(
        nextHeadingRect && nextFlowRect && nextFlowRect.height > 0 &&
        nextHeadingRect.top < nextFlowRect.top + nextFlowRect.height * 0.45
    );

    // סוף פרק: כותרת 2 בראש העמוד הבא מעידה שהעמוד הנוכחי מסתיים לפני פרק חדש.
    if (nextPageStartsChapter) return;

    const heading2 = pageEl.querySelector(heading2Selector);
    const headingRect = heading2?.getBoundingClientRect();
    const startsChapter = !!(
        headingRect && headingRect.top < flowRect.top + flowRect.height * 0.45
    );
    const contentStartY = startsChapter
        ? Math.max(flowRect.top, headingRect.bottom)
        : flowRect.top;

    // המכנה חייב להיות השטח הזמין בעמוד, לא גובה הבלוקים שנוצרו בפועל:
    // שימוש בגובה הבלוקים היה מנרמל עמוד קצר כאילו כל השטח הזמין נוצל.
    // עמודי תוכן דו-טוריים נמדדים מול שתי עמודות; עמוד חד-טורי מול אחת.
    const hasTwoColumnBlock = !!bodyFlow.querySelector('.block-2col');
    const columnCapacityMultiplier = hasTwoColumnBlock ? 2 : 1;
    const capacityPx = Math.max(0, flowRect.bottom - contentStartY) * columnCapacityMultiplier;
    if (!(capacityPx > 0)) return;
    const referenceColumn = bodyFlow.querySelector('.main-column') || bodyFlow.querySelector('.single-wide-col');
    const referenceColumnWidth = referenceColumn?.getBoundingClientRect().width || 0;

    const textSelector = [
        '.main-column p', '.single-wide-col p',
        '.main-column .title-level-2-standalone',
        '.main-column .title-level-3', '.main-column .title-level-4',
        '.main-column .title-level-5', '.main-column .title-level-6',
        '.main-column .title-level-7', '.main-column .title-level-custom',
        '.single-wide-col .title-level-2-standalone',
        '.single-wide-col .title-level-3', '.single-wide-col .title-level-4',
        '.single-wide-col .title-level-5', '.single-wide-col .title-level-6',
        '.single-wide-col .title-level-7', '.single-wide-col .title-level-custom'
    ].join(',');
    const textEls = Array.from(new Set(bodyFlow.querySelectorAll(textSelector)));
    let occupiedPx = 0;
    let paragraphCount = 0;
    let contentElementCount = 0;
    let lineCount = 0;
    let firstTextTop = Infinity;
    let lastTextBottom = -Infinity;
    for (const el of textEls) {
        // הערות שוליים, הערות צד ואלמנטים שאינם נראים אינם חלק מתפוסת גוף הטקסט.
        if (el.closest('.footnote-area, .margin-notes-column')) continue;
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0 || r.bottom <= contentStartY) continue;
        const effectiveTop = Math.max(r.top, contentStartY);
        const effectiveHeight = Math.max(0, r.bottom - effectiveTop);
        // Convert each element's height to column-equivalent occupancy. A full-width
        // heading consumes about two column-heights on a two-column page; counting it
        // as one would systematically understate occupancy on pages with spanning H3s.
        const widthWeight = referenceColumnWidth > 0
            ? Math.min(2.5, Math.max(0.5, r.width / referenceColumnWidth))
            : 1;
        occupiedPx += effectiveHeight * widthWeight;
        contentElementCount++;
        if (el.matches('p')) paragraphCount++;
        const raw = el.getAttribute('data-raw-text') || el.textContent || '';
        if (raw.trim()) lineCount += Math.max(1, Math.round(r.height /
            (parseFloat(getComputedStyle(el).lineHeight) || Math.max(1, r.height))));
        firstTextTop = Math.min(firstTextTop, effectiveTop);
        lastTextBottom = Math.max(lastTextBottom, r.bottom);
    }
    // Heading-only pages still have content and must be eligible for sparse-page
    // diagnostics; paragraphCount is retained as a report metric, not a gate.
    if (contentElementCount === 0 || !Number.isFinite(lastTextBottom)) return;

    // גובהי פסקאות נמדדים בנפרד לכל טור; היחס אינו "אחוז דיו" אלא אומדן
    // שמרני של תפוסת שטח העימוד. הסף נמוך בכוונה כדי למנוע התרעות שווא.
    const fillRatio = occupiedPx / capacityPx;
    const roundedRatio = Math.round(fillRatio * 1000) / 1000;
    if (fillRatio >= 0.24) return;

    const severity = fillRatio < 0.12 ? 'medium' : 'low';
    issues.push({
        kind: 'sparse-page',
        severity,
        pageIdx: page.idx,
        pageLabel: page.label,
        fillRatio: roundedRatio,
        occupiedColumnEquivalentPx: Math.round(occupiedPx * 100) / 100,
        occupancyMethod: 'visible text-element height weighted by element width relative to one column',
        estimatedCapacityPx: Math.round(capacityPx * 100) / 100,
        availableBodyHeightPx: Math.round(Math.max(0, flowRect.bottom - contentStartY) * 100) / 100,
        excludedChapterStartPx: Math.round(Math.max(0, contentStartY - flowRect.top) * 100) / 100,
        columnCapacityMultiplier,
        referenceColumnWidthPx: referenceColumnWidth > 0 ? Math.round(referenceColumnWidth * 100) / 100 : null,
        paragraphCount,
        contentElementCount,
        estimatedLineCount: lineCount,
        startsChapter,
        firstTextTop: Number.isFinite(firstTextTop) ? Math.round(firstTextTop - flowRect.top) : null,
        lastTextBottom: Math.round(lastTextBottom - flowRect.top),
        message: `תפוסת טקסט נמוכה בעמוד ${page.label}: ${Math.round(fillRatio * 100)}% מהקיבולת המשוערת${startsChapter ? ' (כותרת תחילת הפרק הוחרגה מהחישוב)' : ''}`
    });
}

/* בדיקת טווחי סוגריים מרובעים במקור, לפני שמסתמכים על ה-DOM המעוצב.
   היא מאתרת סוגריים לא מאוזנים, וכן זוגות שחוצים פסקאות/טורים/עמודים.
   זוג מקומי באותה פסקה ובאותו טור אינו מדווח כדי למנוע רעש מכל הערת שוליים רגילה. */
function auditSquareBracketScopes(issues) {
    const pageEls = Array.from(document.querySelectorAll('#book-container .a4-page'));
    const paragraphs = [];
    pageEls.forEach((pageEl, pageIdx) => {
        const pageLabel = pageEl.querySelector('.page-number-footer')?.textContent?.trim() || String(pageIdx + 1);
        const ps = Array.from(pageEl.querySelectorAll('.page-body-flow p[data-raw-text]'));
        ps.forEach((p, localIdx) => {
            const rawText = p.getAttribute('data-raw-text') || '';
            if (!rawText) return;
            const col = p.closest('.main-column, .single-wide-col');
            const tokenId = p.getAttribute('data-token-id') || null;
            const fragmentIndex = paragraphs.length;
            paragraphs.push({
                el: p, rawText, pageIdx, pageLabel,
                // DOM fragments are not necessarily source paragraphs: one logical
                // paragraph may be split into p-cut/p-end fragments across columns/pages.
                fragmentIndex,
                tokenId,
                logicalParagraphId: tokenId !== null ? `token:${tokenId}` : `fragment:${fragmentIndex}`,
                localParagraphIndex: localIdx,
                isContinuation: p.getAttribute('data-is-cont') === 'true',
                column: col?.classList.contains('left-col') ? 'left' :
                    col?.classList.contains('right-col') ? 'right' :
                    col?.classList.contains('single-wide-col') ? 'single' : 'unknown'
            });
        });
    });

    // Assign stable logical paragraph ordinals by source token ID. This makes
    // reports distinguish a true paragraph transition from a continuation fragment.
    const logicalOrdinals = new Map();
    let nextLogicalOrdinal = 0;
    for (const para of paragraphs) {
        if (!logicalOrdinals.has(para.logicalParagraphId)) {
            logicalOrdinals.set(para.logicalParagraphId, nextLogicalOrdinal++);
        }
        para.logicalParagraphIndex = logicalOrdinals.get(para.logicalParagraphId);
    }

    const stack = [];
    const emitUnmatchedClose = (para, offset) => issues.push({
        kind: 'square-bracket-unmatched',
        severity: 'high',
        pageIdx: para.pageIdx,
        pageLabel: para.pageLabel,
        paragraphIndex: para.logicalParagraphIndex,
        fragmentIndex: para.fragmentIndex,
        tokenId: para.tokenId,
        offset,
        bracket: ']',
        message: `סוגר מרובע סוגר ללא פתיחה תואמת בעמוד ${para.pageLabel}, פסקה מקורית ${para.logicalParagraphIndex + 1}`
    });

    for (const para of paragraphs) {
        for (let offset = 0; offset < para.rawText.length; offset++) {
            const ch = para.rawText[offset];
            if (ch === '[') {
                stack.push({ para, offset });
                continue;
            }
            if (ch !== ']') continue;
            if (!stack.length) {
                emitUnmatchedClose(para, offset);
                continue;
            }
            const open = stack.pop();
            const crossedParagraph = open.para.logicalParagraphId !== para.logicalParagraphId;
            const crossedColumn = open.para.column !== para.column;
            const crossedPage = open.para.pageIdx !== para.pageIdx;
            if (!crossedParagraph && !crossedColumn && !crossedPage) continue;

            const boundaries = [];
            const boundaryLabels = [];
            if (crossedParagraph) { boundaries.push('paragraph'); boundaryLabels.push('פסקאות'); }
            if (crossedColumn) { boundaries.push('column'); boundaryLabels.push('טורים'); }
            if (crossedPage) { boundaries.push('page'); boundaryLabels.push('עמודים'); }
            const severity = crossedPage || crossedColumn ? 'medium' : 'low';
            let spanRawChars = 0;
            for (let fi = open.para.fragmentIndex; fi <= para.fragmentIndex; fi++) {
                const current = paragraphs[fi];
                if (!current) continue;
                const from = fi === open.para.fragmentIndex ? open.offset : 0;
                const to = fi === para.fragmentIndex ? offset + 1 : current.rawText.length;
                spanRawChars += Math.max(0, to - from);
                // Count a separator only when moving between different source paragraphs,
                // not when the renderer split one source paragraph into multiple fragments.
                if (fi < para.fragmentIndex &&
                    current.logicalParagraphId !== paragraphs[fi + 1]?.logicalParagraphId) {
                    spanRawChars += 1;
                }
            }
            issues.push({
                kind: 'square-bracket-scope',
                severity,
                startPageIdx: open.para.pageIdx,
                pageIdx: para.pageIdx,
                startPageLabel: open.para.pageLabel,
                pageLabel: para.pageLabel,
                startParagraphIndex: open.para.logicalParagraphIndex,
                endParagraphIndex: para.logicalParagraphIndex,
                startFragmentIndex: open.para.fragmentIndex,
                endFragmentIndex: para.fragmentIndex,
                startTokenId: open.para.tokenId,
                endTokenId: para.tokenId,
                startIsContinuation: open.para.isContinuation,
                endIsContinuation: para.isContinuation,
                startColumn: open.para.column,
                endColumn: para.column,
                startOffset: open.offset,
                endOffset: offset,
                crossedParagraph,
                crossedColumn,
                crossedPage,
                boundaries,
                spanRawChars,
                startPreview: open.para.rawText.slice(Math.max(0, open.offset - 55), Math.min(open.para.rawText.length, open.offset + 125)),
                endPreview: para.rawText.slice(Math.max(0, offset - 90), Math.min(para.rawText.length, offset + 60)),
                message: `טווח סוגריים מרובעים/הערת שוליים חוצה ${boundaryLabels.join(', ')}: עמוד ${open.para.pageLabel} → ${para.pageLabel}; ${crossedParagraph ? `פסקאות מקור ${open.para.logicalParagraphIndex + 1}–${para.logicalParagraphIndex + 1}` : 'אותה פסקת מקור'}`
            });
        }
    }
    for (const open of stack) {
        issues.push({
            kind: 'square-bracket-unmatched',
            severity: 'high',
            pageIdx: open.para.pageIdx,
            pageLabel: open.para.pageLabel,
            paragraphIndex: open.para.logicalParagraphIndex,
            fragmentIndex: open.para.fragmentIndex,
            tokenId: open.para.tokenId,
            offset: open.offset,
            bracket: '[',
            message: `סוגר מרובע פותח ללא סגירה תואמת בעמוד ${open.para.pageLabel}, פסקה מקורית ${open.para.logicalParagraphIndex + 1}`
        });
    }
}

/* הפעלת כל הבדיקות */
function auditGeometry(model) {
    const issues = [];
    for (const page of model.pages) {
        for (const c of page.children) annotateParents(c, page);
        page._parent = null;
        page.type = 'page';
        // עדכן getPageIdx דרך _parent
        for (const c of page.children) {
            auditContainment(c, issues);
            auditSideNoteBounds(c, issues);
            auditSiblingOverlap(c, issues);
            auditColumnBalance(c, issues);
            auditWidowOrphan(c, issues);
            auditSparseLastLine(c, issues);
        }
        auditSparsePage(page, issues);
        auditOverflowToFootnote(page, issues);
        auditPageOverflow(page, issues);
    }
    auditSquareBracketScopes(issues);
    // עדכן pageIdx בכל בעיה ע"י חיפוש בעץ
    issues.forEach(iss => {
        if (iss.pageIdx === -1 || iss.pageIdx === undefined) {
            // ננסה למצוא לפי מיקום Y
        }
    });
    // סיכום
    const summary = {
        total: issues.length,
        high: issues.filter(i => i.severity === 'high').length,
        medium: issues.filter(i => i.severity === 'medium').length,
        low: issues.filter(i => i.severity === 'low').length,
        byKind: {},
        byBalanceOutcome: {}
    };
    issues.forEach(i => {
        summary.byKind[i.kind] = (summary.byKind[i.kind] || 0) + 1;
        if (i.kind === 'imbalance') {
            const outcome = i.balanceOutcome || 'unclassified-residual';
            summary.byBalanceOutcome[outcome] = (summary.byBalanceOutcome[outcome] || 0) + 1;
        }
    });
    return { issues, summary };
}

/* ========================================================================
   חלק 3: Overlay ויזואלי
   ======================================================================== */

const OVERLAY_ATTR = 'data-geom-overlay';
const OVERLAY_CONTAINER_ID = '__geom-overlay-container__';

function clearOverlay() {
    document.querySelectorAll('[' + OVERLAY_ATTR + ']').forEach(el => {
        el.removeAttribute(OVERLAY_ATTR);
        el.style.outline = el.getAttribute('data-prev-outline') || '';
        el.style.outlineOffset = el.getAttribute('data-prev-outline-offset') || '';
        el.removeAttribute('data-prev-outline');
        el.removeAttribute('data-prev-outline-offset');
    });
    const c = document.getElementById(OVERLAY_CONTAINER_ID);
    if (c) c.remove();
}

function paintOverlay(model, auditResult, opts) {
    clearOverlay();
    opts = opts || {};
    // 0=issues only, 1=blocks, 2=paragraphs, 3=lines, 4=words, 5=spaces
    const level = opts.level || 2;
    const showLabels = opts.labels !== false;

    // צור מכל עליון לתוויות — מצורף לתוך #book-container כדי שיגלל יחד עם העמודים
    const bookContainer = document.getElementById('book-container') || document.body;
    const labelContainer = document.createElement('div');
    labelContainer.id = OVERLAY_CONTAINER_ID;
    labelContainer.style.cssText = 'position:absolute;top:0;left:0;width:0;height:0;pointer-events:none;z-index:99999;';
    bookContainer.appendChild(labelContainer);

    // [חדש] סופר רכיבים לתצוגה בתווית העמוד
    function countInSubtree(node, type) {
        let n = 0;
        if (node.type === type) n++;
        if (node.children) for (const c of node.children) n += countInSubtree(c, type);
        if (node.words) for (const w of node.words) if (w.type === type) n++;
        return n;
    }
    function countWordsInSubtree(node) {
        let n = 0;
        if (node.words) n += node.words.filter(w => w.type === 'word').length;
        if (node.children) for (const c of node.children) n += countWordsInSubtree(c);
        return n;
    }
    function countLinesInSubtree(node) {
        let n = 0;
        if (node.lines) n += node.lines.length;
        if (node.children) for (const c of node.children) n += countLinesInSubtree(c);
        return n;
    }

    function paintNode(node, depth) {
        // סינון לפי רמה
        if (level === 0 && !node._hasIssue) {
            // רמה 0: רק בעיות — נדלג על רכיבים תקינים
        } else if (level === 1) {
            // רמה 1: רק בלוקים
            const showTypes = new Set(['block-2col', 'block-h3-span', 'block-single-col', 'footnote-area', 'h2-title', 'h2-siman', 'h3-title', 'fn-block', 'page-number', 'header']);
            if (!showTypes.has(node.type) && !node._hasIssue) {
                for (const c of node.children) paintNode(c, depth + 1);
                return;
            }
        } else if (level === 2) {
            // רמה 2: בלוקים + טורים + פסקאות + כותרות
            const hideTypes = new Set(['fn-line', 'fn-num', 'drop-word', 'note-marker', 'side-note']);
            if (hideTypes.has(node.type) && !node._hasIssue) {
                for (const c of node.children) paintNode(c, depth + 1);
                return;
            }
        }
        // רמה 3 = הכל + שורות, רמה 4 = + מילים, רמה 5 = + רווחים

        const el = findDomForNode(node);
        if (el) {
            const prevOutline = el.style.outline;
            const prevOffset = el.style.outlineOffset;
            if (prevOutline) el.setAttribute('data-prev-outline', prevOutline);
            if (prevOffset) el.setAttribute('data-prev-outline-offset', prevOffset);
            el.setAttribute(OVERLAY_ATTR, '1');
            const color = node._hasIssue ? '#dc2626' : (TYPE_COLORS[node.type] || '#94a3b8');
            const thickness = node._hasIssue ? '3px' : '1px';
            el.style.outline = `${thickness} solid ${color}`;
            el.style.outlineOffset = node._hasIssue ? '1px' : '0px';

            // תווית — עשירה יותר ברמות גבוהות
            if (showLabels && (level >= 2 || node._hasIssue)) {
                const label = document.createElement('div');
                label.style.cssText = `
                    position:absolute;
                    top:${node.rect.y}px; left:${node.rect.x}px;
                    background:${color}; color:white;
                    font-size:8px; font-family:monospace;
                    padding:1px 3px; border-radius:2px;
                    pointer-events:none; z-index:100000;
                    direction:ltr; max-width:200px; white-space:nowrap;
                    overflow:hidden; text-overflow:ellipsis;
                `;
                let labelText = node.type;
                // [חדש] פירוט עשיר לכל סוג רכיב
                if (node.type === 'column') {
                    const pCount = node.children.filter(c => c.type === 'p' || c.type === 'p-cut' || c.type === 'p-end').length;
                    const lCount = countLinesInSubtree(node);
                    const wCount = countWordsInSubtree(node);
                    labelText = `col:${node.side} ${Math.round(node.rect.w)}×${Math.round(node.rect.h)} | ${pCount}p ${lCount}l ${wCount}w`;
                } else if (node.type === 'block-2col' || node.type === 'block-single-col' || node.type === 'block-h3-span') {
                    labelText = `${node.type} ${Math.round(node.rect.w)}×${Math.round(node.rect.h)}`;
                } else if (node.type === 'footnote-area' || node.type === 'body-flow') {
                    labelText = `${node.type} ${Math.round(node.rect.w)}×${Math.round(node.rect.h)}`;
                } else if (node.type === 'p' || node.type === 'p-cut' || node.type === 'p-end') {
                    labelText = `${node.type} ${node.lines.length}l ${node.wordCount || 0}w`;
                    if (node.text) labelText += ` "${node.text.slice(0, 20)}"`;
                } else if (node.type === 'fn-line') {
                    labelText = `fn-line ${node.lines.length}l ${node.wordCount || 0}w`;
                } else if (node.type === 'h2-title' || node.type === 'h3-title' || node.type === 'h3' || node.type === 'h4' || node.type === 'h5' || node.type === 'h6' || node.type === 'h7') {
                    labelText = `${node.type} ${node.lines.length}l`;
                    if (node.text) labelText += ` "${node.text.slice(0, 25)}"`;
                }
                if (node._hasIssue) {
                    labelText = '⚠ ' + labelText + ` (${node._issues.length})`;
                }
                label.textContent = labelText;
                labelContainer.appendChild(label);
            }
        }
        for (const c of node.children) paintNode(c, depth + 1);

        // [רמה 3+] ציור שורות טקסט
        if (level >= 3 && node.lines && node.lines.length > 0) {
            for (const line of node.lines) {
                const lineDiv = document.createElement('div');
                lineDiv.style.cssText = `
                    position:absolute;
                    left:${line.x}px; top:${line.y}px;
                    width:${line.w}px; height:${line.h}px;
                    border:0.5px dashed rgba(71,85,105,0.5);
                    pointer-events:none; z-index:99998;
                    box-sizing:border-box;
                `;
                labelContainer.appendChild(lineDiv);
                // [חדש] תווית רוחב לשורה (בצד שמאל של השורה)
                if (showLabels && level >= 3) {
                    const lineLabel = document.createElement('div');
                    lineLabel.style.cssText = `
                        position:absolute;
                        top:${line.y}px; left:${line.x - 30}px;
                        background:rgba(71,85,105,0.85); color:white;
                        font-size:6px; font-family:monospace;
                        padding:0 2px; pointer-events:none; z-index:100000;
                        direction:ltr;
                    `;
                    lineLabel.textContent = `${Math.round(line.w)}`;
                    labelContainer.appendChild(lineLabel);
                }
            }
        }

        // [רמה 4+] ציור מילים — כל מילה מקבלת outline דק כתום
        if (level >= 4 && node.words) {
            for (const word of node.words) {
                if (word.type !== 'word') continue;
                const wordDiv = document.createElement('div');
                wordDiv.style.cssText = `
                    position:absolute;
                    left:${word.x}px; top:${word.y}px;
                    width:${word.w}px; height:${word.h}px;
                    border:1px solid rgba(245, 158, 11, 0.95);
                    background:rgba(245, 158, 11, 0.15);
                    pointer-events:none; z-index:100002;
                    box-sizing:border-box;
                `;
                labelContainer.appendChild(wordDiv);
                // תווית רוחב מילה (מעל)
                if (showLabels) {
                    const wordLabel = document.createElement('div');
                    wordLabel.style.cssText = `
                        position:absolute;
                        top:${word.y - 9}px; left:${word.x}px;
                        background:rgba(245, 158, 11, 1); color:white;
                        font-size:6px; font-family:monospace;
                        padding:0 2px; pointer-events:none; z-index:100003;
                        direction:ltr; font-weight:bold;
                    `;
                    wordLabel.textContent = `${Math.round(word.w)}`;
                    labelContainer.appendChild(wordLabel);
                }
            }
        }

        // [רמה 5] ציור רווחים — כל רווח מקבל רקע כחול חצי-שקוף + תווית רוחב
        if (level >= 5 && node.words) {
            for (const space of node.words) {
                if (space.type !== 'space') continue;
                const spaceDiv = document.createElement('div');
                spaceDiv.style.cssText = `
                    position:absolute;
                    left:${space.x}px; top:${space.y}px;
                    width:${space.w}px; height:${space.h}px;
                    background:rgba(59, 130, 246, 0.55);
                    border:1px dashed rgba(59, 130, 246, 1);
                    pointer-events:none; z-index:100001;
                    box-sizing:border-box;
                `;
                labelContainer.appendChild(spaceDiv);
                // תווית רוחב רווח (מתחת)
                if (showLabels) {
                    const spaceLabel = document.createElement('div');
                    spaceLabel.style.cssText = `
                        position:absolute;
                        top:${space.y + space.h + 1}px; left:${space.x}px;
                        background:rgba(59, 130, 246, 1); color:white;
                        font-size:6px; font-family:monospace;
                        padding:0 2px; pointer-events:none; z-index:100003;
                        direction:ltr; font-weight:bold;
                    `;
                    spaceLabel.textContent = `${Math.round(space.w)}`;
                    labelContainer.appendChild(spaceLabel);
                }
            }
        }
    }

    // סמן רכיבים עם בעיות
    if (auditResult) {
        // לכל בעיה — מצא את העמוד וסמן אותו
        for (const iss of auditResult.issues) {
            const page = model.pages[iss.pageIdx];
            if (page) {
                page._hasIssue = true;
                page._issues = page._issues || [];
                page._issues.push(iss);
            }
        }
    }

    for (const page of model.pages) {
        for (const c of page.children) paintNode(c, 0);
        // תווית עמוד
        if (showLabels) {
            const pageLabel = document.createElement('div');
            const issueCount = page._issues ? page._issues.length : 0;
            pageLabel.style.cssText = `
                position:absolute;
                top:${page.rect.y - 2}px; left:${page.rect.x}px;
                background:${issueCount > 0 ? '#dc2626' : '#1e40af'};
                color:white; font-size:10px; font-family:monospace;
                padding:2px 6px; border-radius:3px;
                pointer-events:none; z-index:100001;
                direction:ltr;
            `;
            pageLabel.textContent = `page ${page.label}${issueCount > 0 ? ` (⚠${issueCount})` : ''}`;
            labelContainer.appendChild(pageLabel);
        }
    }
}

/* מצא את אלמנט ה-DOM שמתאים ל-node — לא פשוט כי ה-node נבנה רק מ-rect */
/* נשתמש ב-cache של el -> node ולהיפך */
let _nodeToEl = new WeakMap();

function findDomForNode(node) {
    return _nodeToEl.get(node);
}

/* בונה מחדש את העץ עם references ל-DOM */
function extractGeometryWithDomRefs() {
    const t0 = performance.now();
    const pages = [];
    const pageEls = document.querySelectorAll('#book-container .a4-page');
    _nodeToEl = new WeakMap();
    pageEls.forEach((pgEl, pIdx) => {
        const pgRect = rectOf(pgEl);
        const page = {
            idx: pIdx,
            label: (pgEl.querySelector('.page-number-footer')?.textContent?.trim() || String(pIdx + 1)),
            rect: pgRect,
            // Page metrics must be read from pgEl here: the page itself is represented
            // by this synthetic node, while buildNodeWithRefs starts at the wrapper.
            footnoteReflowMetrics: {
                queueCount: pgEl.getAttribute('data-fn-reflow-queue-count'),
                predictedHeight: pgEl.getAttribute('data-fn-reflow-predicted-height'),
                beforeFlowHeight: pgEl.getAttribute('data-fn-reflow-before-flow-height'),
                afterFlowHeight: pgEl.getAttribute('data-fn-reflow-after-flow-height'),
                flowHeightDelta: pgEl.getAttribute('data-fn-reflow-flow-height-delta'),
                beforeLastBlockHeight: pgEl.getAttribute('data-fn-reflow-before-last-block-height'),
                afterLastBlockHeight: pgEl.getAttribute('data-fn-reflow-after-last-block-height'),
                afterLastBlockOverflow: pgEl.getAttribute('data-fn-reflow-after-last-block-overflow'),
                lastBlockTopOffset: pgEl.getAttribute('data-fn-reflow-last-block-top-offset')
            },
            children: [],
            issues: [],
            type: 'page'
        };
        _nodeToEl.set(page, pgEl);
        const wrapper = pgEl.querySelector('.page-content-wrapper');
        if (wrapper) {
            const wrapperNode = buildNodeWithRefs(wrapper, page);
            if (wrapperNode) page.children.push(wrapperNode);
        }
        pages.push(page);
    });
    const t1 = performance.now();
    return { pages, stats: { pageCount: pages.length, extractMs: +(t1 - t0).toFixed(2) } };
}

function buildNodeWithRefs(el, parent) {
    if (!el || el.nodeType !== 1) return null;
    const cls = classifyElement(el);
    if (cls.type === 'other' && el.children.length === 0) {
        if (typeof el.className !== 'string' || !el.className) return null;
    }
    const rect = rectOf(el);
    if (rect.w < 1 || rect.h < 1) return null;

    const node = {
        type: cls.type,
        tag: cls.tag,
        side: cls.side,
        cls: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
        text: '',
        rect,
        children: [],
        lines: [],
        footnoteReflowMetrics: cls.type === 'page' ? {
            queueCount: el.getAttribute('data-fn-reflow-queue-count'),
            predictedHeight: el.getAttribute('data-fn-reflow-predicted-height'),
            beforeFlowHeight: el.getAttribute('data-fn-reflow-before-flow-height'),
            afterFlowHeight: el.getAttribute('data-fn-reflow-after-flow-height'),
            flowHeightDelta: el.getAttribute('data-fn-reflow-flow-height-delta'),
            beforeLastBlockHeight: el.getAttribute('data-fn-reflow-before-last-block-height'),
            afterLastBlockHeight: el.getAttribute('data-fn-reflow-after-last-block-height'),
            afterLastBlockOverflow: el.getAttribute('data-fn-reflow-after-last-block-overflow'),
            lastBlockTopOffset: el.getAttribute('data-fn-reflow-last-block-top-offset')
        } : null,
        layoutMetrics: cls.type === 'block-2col' ? {
            fillRemaining: el.getAttribute('data-layout-fill-remaining'),
            fillFlowHeight: el.getAttribute('data-layout-fill-flow-height'),
            fillTopOffset: el.getAttribute('data-layout-fill-top-offset'),
            balanceCalled: el.getAttribute('data-layout-balance-called'),
            balanceStatus: el.getAttribute('data-layout-balance-status'),
            balanceSkipReason: el.getAttribute('data-layout-balance-skip-reason'),
            balanceRouting: el.getAttribute('data-layout-balance-routing'),
            lightJustifyResidualDiff: (() => {
                const value = el.getAttribute('data-layout-balance-light-residual-diff');
                const number = value === null ? NaN : Number(value);
                return Number.isFinite(number) ? number : null;
            })(),
            finalJustifyOvershootAfterShrink: (() => {
                const value = el.getAttribute('data-layout-final-justify-overshoot-after-shrink');
                const number = value === null || value === 'none' ? NaN : Number(value);
                return Number.isFinite(number) ? number : null;
            })(),
            finalJustifyCapacityAfter: (() => {
                const raw = el.getAttribute('data-layout-final-justify-capacity-after');
                if (!raw) return null;
                try { return JSON.parse(raw); } catch { return { parseError: true }; }
            })(),
            stageGeometryDiagnostic: (() => {
                const raw = el.getAttribute('data-layout-stage-geometry-diagnostic');
                if (!raw) return null;
                try { return JSON.parse(raw); } catch { return { parseError: true }; }
            })(),
            stageGeometryDiagnosticError: el.getAttribute('data-layout-stage-geometry-diagnostic-error'),
            decisionRecord: (() => {
                const raw = el.getAttribute('data-layout-decision-record');
                if (!raw) return null;
                try { return JSON.parse(raw); } catch { return { parseError: true }; }
            })(),
            balanceInputHeight: el.getAttribute('data-layout-balance-input-height'),
            balanceAvailable: el.getAttribute('data-layout-balance-available'),
            balanceCandidates: el.getAttribute('data-layout-balance-candidates'),
            balanceItems: el.getAttribute('data-layout-balance-items'),
            balanceFits: el.getAttribute('data-layout-balance-fits'),
            balanceValid: el.getAttribute('data-layout-balance-valid'),
            balanceRightPartLines: el.getAttribute('data-layout-balance-right-part-lines'),
            balanceLeftPartLines: el.getAttribute('data-layout-balance-left-part-lines'),
            balanceOver: el.getAttribute('data-layout-balance-over'),
            balanceRight: el.getAttribute('data-layout-balance-right'),
            balanceLeft: el.getAttribute('data-layout-balance-left'),
            balanceDiff: el.getAttribute('data-layout-balance-diff'),
            pageFinalJustifyDiagnostic: el.getAttribute('data-layout-page-final-justify-diagnostic'),
            globalJustifyDiagnostic: el.getAttribute('data-layout-global-justify-diagnostic')
        } : null,
        parentType: parent ? parent.type : null,
        _parent: parent  // [תיקון] חיוני כדי שgetPageIdx יעבוד
    };
    _nodeToEl.set(node, el);

    if (TEXT_TYPES.has(cls.type)) {
        node.lines = collectLines(el);
        node.text = (el.innerText || '').slice(0, 40).replace(/\n/g, ' ');
        // [חדש] אסוף מילים ורווחים לפירוט מלא
        node.words = collectWordsAndSpaces(el);
        node.wordCount = node.words.filter(t => t.type === 'word').length;
        node.spaceCount = node.words.filter(t => t.type === 'space').length;
    }

    if (DESCEND_INTO.has(cls.type) || cls.type === 'page' || cls.type === 'wrapper' || cls.type === 'body-flow' || cls.type === 'fn-block') {
        for (const child of el.children) {
            const childNode = buildNodeWithRefs(child, node);
            if (childNode) node.children.push(childNode);
        }
    } else {
        for (const child of el.children) {
            const childCls = classifyElement(child);
            if (childCls.type !== 'other' && childCls.type !== 'unknown') {
                const childNode = buildNodeWithRefs(child, node);
                if (childNode) node.children.push(childNode);
            }
        }
    }
    return node;
}

/* ========================================================================
   חלק 4: API ציבורי
   ======================================================================== */

/* [חדש] מסמן בעיה ספציפית במסגרת מהבהבת על הדף.
   מקבל אובייקט issue עם childRect/aRect/bRect/rightRect/leftRect.
   מצייר מסגרת כתומה מהבהבת על האזור הבעייתי למשך 3 שניות. */
let __highlightElements = [];
function highlightIssue(issue) {
    // נקה הבהובים קודמים
    clearHighlight();

    if (!issue) return;

    // אוסוף את כל ה-rects שצריך להדגיש
    const rects = [];
    if (issue.childRect) rects.push(issue.childRect);
    if (issue.aRect) rects.push(issue.aRect);
    if (issue.bRect) rects.push(issue.bRect);
    if (issue.rightRect) rects.push(issue.rightRect);
    if (issue.leftRect) rects.push(issue.leftRect);

    if (rects.length === 0) return;

    // צור מכל להבהובים — מצורף לתוך #book-container כדי שיגלל יחד עם העמודים
    const bookContainer = document.getElementById('book-container') || document.body;
    const container = document.getElementById('__geom-highlight-container__') || (() => {
        const c = document.createElement('div');
        c.id = '__geom-highlight-container__';
        c.style.cssText = 'position:absolute;top:0;left:0;width:0;height:0;pointer-events:none;z-index:100010;';
        bookContainer.appendChild(c);
        return c;
    })();

    // צבע לפי חומרה
    const color = issue.severity === 'high' ? '#dc2626' : (issue.severity === 'medium' ? '#d97706' : '#0ea5e9');

    rects.forEach(rect => {
        // [תיקון] ודא שהמסגרת לפחות 30×30 — כדי שתהיה תמיד נראית
        const minSize = 30;
        const w = Math.max(rect.w, minSize);
        const h = Math.max(rect.h, minSize);
        // מרכז את המסגרת על האזור המקורי
        const x = rect.x - (w - rect.w) / 2;
        const y = rect.y - (h - rect.h) / 2;
        
        const div = document.createElement('div');
        div.style.cssText = `
            position:absolute;
            left:${x}px; top:${y}px;
            width:${w}px; height:${h}px;
            border:4px solid ${color};
            background:${color}33;
            box-shadow:0 0 16px ${color}, 0 0 32px ${color}cc, inset 0 0 8px ${color}44;
            pointer-events:none; z-index:100010;
            box-sizing:border-box;
            border-radius:4px;
            animation: __geom-blink 0.4s ease-in-out infinite alternate;
        `;
        container.appendChild(div);
        __highlightElements.push(div);
    });

    // הוסף animation אם לא קיים
    if (!document.getElementById('__geom-highlight-style')) {
        const style = document.createElement('style');
        style.id = '__geom-highlight-style';
        style.textContent = `
            @keyframes __geom-blink {
                from { opacity: 0.4; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // נקה אוטומטית אחרי 4 שניות
    setTimeout(clearHighlight, 4000);
}

function clearHighlight() {
    __highlightElements.forEach(el => el.remove());
    __highlightElements = [];
    const c = document.getElementById('__geom-highlight-container__');
    if (c) c.remove();
}

window.__geomAudit = {
    extract: extractGeometryWithDomRefs,
    audit: auditGeometry,
    paint: paintOverlay,
    clear: clearOverlay,
    highlightIssue: highlightIssue,
    clearHighlight: clearHighlight,
    types: TYPE_COLORS,
    // [חדש] מנקה את העץ מ-_parent (circular) לפני ייצוא JSON
    cleanForExport: function(node) {
        if (!node) return node;
        const cleaned = { ...node };
        delete cleaned._parent;
        delete cleaned._hasIssue;
        delete cleaned._issues;
        delete cleaned._nodeToEl;
        if (cleaned.children) {
            cleaned.children = cleaned.children.map(c => this.cleanForExport(c));
        }
        if (cleaned.lines) {
            cleaned.lines = cleaned.lines.map(l => ({ ...l }));
        }
        if (cleaned.words) {
            cleaned.words = cleaned.words.map(w => ({ ...w }));
        }
        if (cleaned.issues) {
            cleaned.issues = cleaned.issues.map(i => ({ ...i }));
        }
        return cleaned;
    }
};

console.log('[geometry-audit] נטען. השתמש ב-window.__geomAudit.extract()/.audit()/.paint()/.clear()');

})();
