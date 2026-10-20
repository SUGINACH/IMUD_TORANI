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

function rectOf(el) {
    const r = el.getBoundingClientRect();
    return {
        x: r.left, y: r.top,
        w: r.width, h: r.height,
        right: r.right, bottom: r.bottom
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
    if (cls.includes('page-number-footer')) return { type: 'page-number', tag };
    if (cls.includes('footnote-area')) return { type: 'footnote-area', tag };
    if (cls.includes('footnote-header-wrap')) return { type: 'fn-header', tag };
    if (cls.includes('note-rule-') || cls.includes('note-rule')) return { type: 'fn-rule', tag };
    if (cls.includes('note-block')) return { type: 'fn-block', tag };
    if (cls.includes('note-line')) return { type: 'fn-line', tag };
    if (cls.includes('note-line-num')) return { type: 'fn-num', tag };
    if (cls.includes('block-2col')) return { type: 'block-2col', tag };
    if (cls.includes('block-h3-span')) return { type: 'block-h3-span', tag };
    if (cls.includes('block-single-col')) return { type: 'block-single-col', tag };
    if (cls.includes('main-column')) return { type: 'column', tag, side: cls.includes('right-col') ? 'right' : (cls.includes('left-col') ? 'left' : '?') };
    if (cls.includes('single-wide-col')) return { type: 'column', tag, side: 'single' };
    if (cls.includes('margin-notes-column')) return { type: 'margin-col', tag, side: cls.includes('right-margin') ? 'right' : 'left' };
    if (cls.includes('col-gutter-divider')) return { type: 'gutter', tag };
    if (cls.includes('h2-spacer')) return { type: 'h2-spacer', tag };
    if (cls.includes('h2-siman-badge')) return { type: 'h2-siman', tag };
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
    'header': '#a78bfa', 'page-number': '#f472b6',
    'footnote-area': '#dc2626', 'fn-header': '#ef4444', 'fn-rule': '#f87171',
    'fn-block': '#fca5a5', 'fn-line': '#fecaca', 'fn-num': '#fee2e2',
    'block-2col': '#059669', 'block-h3-span': '#10b981', 'block-single-col': '#34d399',
    'column': '#34d399', 'margin-col': '#6ee7b7', 'gutter': '#a7f3d0',
    'h2-spacer': '#d97706', 'h2-siman': '#f59e0b', 'h2-title': '#fbbf24',
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
    'page', 'wrapper', 'body-flow', 'footnote-area',
    'block-2col', 'block-h3-span', 'block-single-col',
    'column', 'margin-col', 'fn-block'
]);

/* רכיבים שהם "טקסט" — נמדוד את השורות שלהם */
const TEXT_TYPES = new Set(['p', 'p-cut', 'p-end', 'fn-line', 'h2-title', 'h3-title', 'h3', 'h4', 'h5', 'h6', 'h7']);

/* אוסף שורות טקסט מתוך אלמנט טקסט ע"י getClientRects על Range */
function collectLines(el) {
    const lines = [];
    try {
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = range.getClientRects();
        const seen = new Set();
        for (let i = 0; i < rects.length; i++) {
            const r = rects[i];
            if (r.height < 1 || r.width < 1) continue;
            // דה-דופליקציה לפי Y (לפעמים יש כפילויות)
            const key = Math.round(r.top) + ':' + Math.round(r.height);
            if (seen.has(key)) continue;
            seen.add(key);
            lines.push({
                x: r.left, y: r.top, w: r.width, h: r.height,
                right: r.right, bottom: r.bottom,
                idx: lines.length
            });
        }
    } catch (e) {
        // אם הטקסט ריק או שגיאה — מחזיר מערך ריק
    }
    // מיון לפי Y עולה
    lines.sort((a, b) => a.y - b.y || a.x - b.x);
    lines.forEach((l, i) => l.idx = i);
    return lines;
}

/* בונה את העץ הגיאומטרי מתוך אלמנט */
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

    const node = {
        id: (el.id || '') + ':' + Math.random().toString(36).slice(2, 8),
        type: cls.type,
        tag: cls.tag,
        cls: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
        text: '',
        rect,
        children: [],
        lines: [],
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
            idx: pIdx,
            label: (pgEl.querySelector('.page-number-footer')?.textContent?.trim() || String(pIdx + 1)),
            rect: pgRect,
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
    const t1 = performance.now();
    return { pages, stats: { pageCount: pages.length, extractMs: +(t1 - t0).toFixed(2) } };
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
        if (!rContains(node, child, TOL.containment)) {
            const overflow = {
                left: Math.max(0, node.rect.x - child.rect.x),
                top: Math.max(0, node.rect.y - child.rect.y),
                right: Math.max(0, child.rect.right - node.rect.right),
                bottom: Math.max(0, child.rect.bottom - node.rect.bottom)
            };
            issues.push({
                kind: 'containment',
                severity: 'high',
                pageIdx: getPageIdx(node),
                location: describePath(node),
                childType: child.type,
                childText: child.text,
                overflow,
                message: `תיבת ${child.type} בולטת מ-${node.type}: ${JSON.stringify(overflow)}`
            });
        }
        auditContainment(child, issues);
    }
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
            const ov = rOverlap(a, b);
            if (ov > TOL.overlap) {
                // אם שניהם טורים (column) באותו בלוק — זה תקין (ם נמצאים זה ליד זה, לא חופפים)
                if (a.type === 'column' && b.type === 'column') continue;
                // הערות בתוך fn-line — לפעמים חופפות עם note-line-num
                if (a.parentType === 'fn-line' || b.parentType === 'fn-line') continue;
                issues.push({
                    kind: 'overlap',
                    severity: 'high',
                    pageIdx: getPageIdx(node),
                    location: describePath(node),
                    aType: a.type, aText: a.text,
                    bType: b.type, bText: b.text,
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
        const right = node.children.find(c => c.type === 'column' && c.side === 'right');
        const left = node.children.find(c => c.type === 'column' && c.side === 'left');
        if (right && left) {
            const diff = Math.abs(right.rect.h - left.rect.h);
            if (diff > TOL.balance) {
                issues.push({
                    kind: 'imbalance',
                    severity: diff > 30 ? 'high' : (diff > 10 ? 'medium' : 'low'),
                    pageIdx: getPageIdx(node),
                    location: describePath(node),
                    rightH: Math.round(right.rect.h),
                    leftH: Math.round(left.rect.h),
                    diff: Math.round(diff),
                    message: `אי-איזון טורים: ימין=${Math.round(right.rect.h)}px שמאל=${Math.round(left.rect.h)}px פער=${Math.round(diff)}px`
                });
            }
        }
    }
    for (const c of node.children) auditColumnBalance(c, issues);
}

function auditWidowOrphan(node, issues) {
    // בכל טור — בדוק את הפסקה הראשונה והאחרונה
    if (node.type === 'column') {
        const ps = node.children.filter(c => c.type === 'p' || c.type === 'p-cut' || c.type === 'p-end');
        if (ps.length > 0) {
            const first = ps[0];
            // אלמנה: פסקה אחרונה בטור עם שורה אחת
            const last = ps[ps.length - 1];
            if (last.lines.length === 1 && last.type === 'p-end') {
                issues.push({
                    kind: 'widow',
                    severity: 'medium',
                    pageIdx: getPageIdx(node),
                    location: describePath(node),
                    pText: last.text,
                    message: `אלמנה: שורה אחת בודדת בסוף טור ${node.side} ("${last.text.slice(0, 30)}...")`
                });
            }
            // יתום: פסקה ראשונה בטור עם שורה אחת שהיא p-cut (ממשיכה מהטור הקודם)
            if (first.lines.length === 1 && first.type === 'p-cut' && ps.length > 1) {
                issues.push({
                    kind: 'orphan',
                    severity: 'medium',
                    pageIdx: getPageIdx(node),
                    location: describePath(node),
                    pText: first.text,
                    message: `יתום: שורה אחת בודדת בתחילת טור ${node.side} ("${first.text.slice(0, 30)}...")`
                });
            }
        }
    }
    for (const c of node.children) auditWidowOrphan(c, issues);
}

function auditSparseLastLine(node, issues) {
    // בפסקאות p-cut — השורה האחרונה לרוב דלילה
    if ((node.type === 'p-cut' || node.type === 'p-end') && node.lines.length > 1) {
        const lastLine = node.lines[node.lines.length - 1];
        const firstLine = node.lines[0];
        if (firstLine.w > 0 && lastLine.w < firstLine.w * TOL.sparseLastLine) {
            issues.push({
                kind: 'sparse-line',
                severity: 'low',
                pageIdx: getPageIdx(node),
                location: describePath(node),
                lastW: Math.round(lastLine.w),
                firstW: Math.round(firstLine.w),
                pText: node.text,
                message: `שורה דלילה בסוף פסקה: רוחב אחרון=${Math.round(lastLine.w)}px ראשון=${Math.round(firstLine.w)}px`
            });
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
                message: `גוף חופף למספר עמוד בעמוד ${page.label}: ${Math.round(-gap)}px`
            });
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
            auditSiblingOverlap(c, issues);
            auditColumnBalance(c, issues);
            auditWidowOrphan(c, issues);
            auditSparseLastLine(c, issues);
        }
        auditOverflowToFootnote(page, issues);
        auditPageOverflow(page, issues);
    }
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
        byKind: {}
    };
    issues.forEach(i => { summary.byKind[i.kind] = (summary.byKind[i.kind] || 0) + 1; });
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
    const level = opts.level || 2; // 0=issues only, 1=blocks, 2=paragraphs, 3=lines, 4=words
    const showLabels = opts.labels !== false;

    // מפת סוגים לבעיות — כדי להדגיש
    const issuesByNode = new Map(); // id -> [issues]
    if (auditResult) {
        for (const iss of auditResult.issues) {
            // נסמן את ה-page הרלוונטי
            // (הבעיות מתויגות לפי pageIdx, נסמן את העמוד כולו)
        }
    }

    // צור מכל עליון לתוויות
    const labelContainer = document.createElement('div');
    labelContainer.id = OVERLAY_CONTAINER_ID;
    labelContainer.style.cssText = 'position:absolute;top:0;left:0;width:0;height:0;pointer-events:none;z-index:99999;';
    document.body.appendChild(labelContainer);

    function paintNode(node, depth) {
        // סינון לפי רמה
        if (level === 0 && !node._hasIssue) {
            // רמה 0: רק בעיות — נדלג על רכיבים תקינים
        } else if (level === 1) {
            // רמה 1: רק בלוקים (block-2col, block-h3-span, block-single-col, footnote-area, h2-title)
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
        // רמה 3 = הכל חוץ מ-micro, רמה 4 = הכל

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

            // תווית
            if (showLabels && (level >= 2 || node._hasIssue)) {
                const label = document.createElement('div');
                label.style.cssText = `
                    position:absolute;
                    top:${node.rect.y}px; left:${node.rect.x}px;
                    background:${color}; color:white;
                    font-size:8px; font-family:monospace;
                    padding:1px 3px; border-radius:2px;
                    pointer-events:none; z-index:100000;
                    direction:ltr;
                `;
                let labelText = node.type;
                if (node.type === 'column') labelText += `:${node.side}`;
                if (node.type === 'block-2col' || node.type === 'column' || node.type === 'footnote-area' || node.type === 'body-flow') {
                    labelText += ` ${Math.round(node.rect.w)}×${Math.round(node.rect.h)}`;
                }
                if (node._hasIssue) {
                    labelText = '⚠ ' + labelText + ` (${node._issues.length})`;
                }
                label.textContent = labelText;
                labelContainer.appendChild(label);
            }
        }
        for (const c of node.children) paintNode(c, depth + 1);
        // ציור שורות טקסט
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
        parentType: parent ? parent.type : null,
        _parent: parent  // [תיקון] חיוני כדי שgetPageIdx יעבוד
    };
    _nodeToEl.set(node, el);

    if (TEXT_TYPES.has(cls.type)) {
        node.lines = collectLines(el);
        node.text = (el.innerText || '').slice(0, 40).replace(/\n/g, ' ');
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

window.__geomAudit = {
    extract: extractGeometryWithDomRefs,
    audit: auditGeometry,
    paint: paintOverlay,
    clear: clearOverlay,
    types: TYPE_COLORS
};

console.log('[geometry-audit] נטען. השתמש ב-window.__geomAudit.extract()/.audit()/.paint()/.clear()');

})();
