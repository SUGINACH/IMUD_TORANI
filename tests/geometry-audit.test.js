'use strict';
/* בדיקות יחידה לבודק הגיאומטרי (geometry-audit.js) — מודלים סינתטיים, בלי דפדפן ובלי DOM.
   הרצה:  node --test tests/                                                              */
const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('../geometry-audit.js');

/* ---------- בונים למודל ---------- */
const R = (x, y, w, h) => ({ x, y, w, h, right: x + w, bottom: y + h });
const Ln = (x, y, w, h = 20) => ({ x, y, w, h, right: x + w, bottom: y + h, idx: 0 });
const node = (type, rect, extra = {}) =>
    Object.assign({ type, tag: 'div', cls: '', text: '', rect, children: [], lines: [], cont: false, pua: false }, extra);

function para(type, x, y, w, nLines, extra = {}) {
    const lines = [];
    for (let i = 0; i < nLines; i++) lines.push(Ln(x, y + i * 20, w));
    return node(type, R(x, y, w, nLines * 20), Object.assign({ text: 'טקסט בדיקה', lines }, extra));
}
function head(type, x, y, w) { return node(type, R(x, y, w, 20), { text: 'כותרת בדיקה', lines: [Ln(x, y, w)] }); }
function column(side, x, items, w = 380, y = 100) {
    const bottom = items.reduce((m, it) => Math.max(m, it.rect.bottom), y + 20);
    return node('column', R(x, y, w, bottom - y), { side, children: items });
}
function block(cols) {
    const x = Math.min(...cols.map(c => c.rect.x)), right = Math.max(...cols.map(c => c.rect.right));
    const y = Math.min(...cols.map(c => c.rect.y)), bottom = Math.max(...cols.map(c => c.rect.bottom));
    return node('block-2col', R(x, y, right - x, bottom - y), { children: cols });
}
function page(idx, flowChildren, opts = {}) {
    const flow = node('body-flow', R(10, 90, 780, 800), { children: flowChildren });
    const kids = [flow];
    if (opts.fn) kids.push(node('footnote-area', R(10, opts.fn, 780, 100)));
    if (opts.pn) kids.push(node('page-number', R(350, opts.pn, 100, 20)));
    const wrapper = node('wrapper', R(0, 0, 800, 1100), { children: kids });
    return node('page', R(0, 0, 800, 1100), { idx, label: String(idx + 1), children: [wrapper] });
}
const modelOf = (...pages) => ({ pages });
const kinds = (res, k) => res.issues.filter(i => i.kind === k);
const RX = 410, LX = 10;   // טור ימין / שמאל

/* ---------- אלמנה ויתום (בעיות 1-2) ---------- */
test('אלמנה: פסקת המשך בראש טור עם שורה אחת', () => {
    const m = modelOf(page(0, [block([column('right', RX, [para('p-end', RX, 100, 380, 1, { cont: true }), para('p-end', RX, 120, 380, 3)]), column('left', LX, [])])]));
    assert.equal(kinds(api.audit(m), 'widow').length, 1);
});
test('אלמנה: פסקת המשך עם שתי שורות — תקין', () => {
    const m = modelOf(page(0, [block([column('right', RX, [para('p-end', RX, 100, 380, 2, { cont: true })]), column('left', LX, [])])]));
    assert.equal(kinds(api.audit(m), 'widow').length, 0);
});
test('p-end של שורה אחת בסוף טור — פסקה קצרה שלמה, לא אלמנה ולא יתום', () => {
    const m = modelOf(page(0, [block([column('right', RX, [para('p-end', RX, 100, 380, 3), para('p-end', RX, 160, 380, 1)]), column('left', LX, [])])]));
    const r = api.audit(m);
    assert.equal(kinds(r, 'widow').length + kinds(r, 'orphan').length, 0);
});
test('יתום: p-cut עם שורה אחת בסוף טור', () => {
    const m = modelOf(page(0, [block([column('right', RX, [para('p-end', RX, 100, 380, 3), para('p-cut', RX, 160, 380, 1)]), column('left', LX, [])])]));
    assert.equal(kinds(api.audit(m), 'orphan').length, 1);
});

/* ---------- שורה דלילה (בעיה 3) ---------- */
function sparseModel(type, lastW, extraItem) {
    const p = para(type, RX, 100, 380, 3);
    p.lines[2] = Ln(RX, 140, lastW);
    const items = [p];
    if (extraItem) items.push(extraItem);
    return modelOf(page(0, [block([column('right', RX, items), column('left', LX, [])])]));
}
test('שורה דלילה: p-cut אחרון בטור, שורה אחרונה 10% מהטור', () => {
    assert.equal(kinds(api.audit(sparseModel('p-cut', 38)), 'sparse-line').length, 1);
});
test('שורה דלילה: p-end עם שורה קצרה — טבעי, לא מדווח', () => {
    assert.equal(kinds(api.audit(sparseModel('p-end', 38)), 'sparse-line').length, 0);
});
test('שורה דלילה: p-cut שאינו האחרון בטור — לא מדווח', () => {
    assert.equal(kinds(api.audit(sparseModel('p-cut', 38, para('p-end', RX, 160, 380, 2))), 'sparse-line').length, 0);
});
test('שורה דלילה: p-cut עם שורה אחרונה 60% — תקין', () => {
    assert.equal(kinds(api.audit(sparseModel('p-cut', 228)), 'sparse-line').length, 0);
});

/* ---------- גלישה לאזור הערות / מספר עמוד לפי תוכן (לא לפי תיבות) ---------- */
test('טקסט שחודר לאזור ההערות גם כשתיבת body-flow תקינה', () => {
    // body-flow נגמר ב-890, אזור ההערות מתחיל ב-950, אבל שורת טקסט מגיעה עד 990
    const p = para('p-end', RX, 940, 380, 2);
    const m = modelOf(page(0, [block([column('right', RX, [p]), column('left', LX, [])])], { fn: 950, pn: 1060 }));
    const hit = kinds(api.audit(m), 'fn-overflow');
    assert.equal(hit.length, 1);
    assert.equal(hit[0].basis, 'text');
    assert.equal(hit[0].overlapPx, 30);
});
test('טקסט שנגמר מעל אזור ההערות — אין גלישה', () => {
    const m = modelOf(page(0, [block([column('right', RX, [para('p-end', RX, 800, 380, 2)]), column('left', LX, [])])], { fn: 950, pn: 1060 }));
    const r = api.audit(m);
    assert.equal(kinds(r, 'fn-overflow').length + kinds(r, 'pn-overflow').length, 0);
});

/* ---------- כותרת בתחתית טור (בעיה 5) ---------- */
test('כותרת h4 כפריט אחרון בטור', () => {
    const m = modelOf(page(0, [block([column('right', RX, [para('p-end', RX, 100, 380, 3), head('h4', RX, 160, 380)]), column('left', LX, [])])]));
    assert.equal(kinds(api.audit(m), 'heading-at-bottom').filter(i => i.severity === 'high').length, 1);
});
test('כותרת ואחריה שורת גוף אחת של p-cut — high; של p-end שלם — medium', () => {
    const mk = type => modelOf(page(0, [block([column('right', RX, [head('h5', RX, 100, 380), para(type, RX, 120, 380, 1)]), column('left', LX, [])])]));
    assert.equal(kinds(api.audit(mk('p-cut')), 'heading-at-bottom')[0].severity, 'high');
    assert.equal(kinds(api.audit(mk('p-end')), 'heading-at-bottom')[0].severity, 'medium');
});
test('כותרת ואחריה שתי שורות גוף — תקין', () => {
    const m = modelOf(page(0, [block([column('right', RX, [head('h4', RX, 100, 380), para('p-end', RX, 120, 380, 2)]), column('left', LX, [])])]));
    assert.equal(kinds(api.audit(m), 'heading-at-bottom').length, 0);
});

/* ---------- שרשרת המשך ---------- */
test('שרשרת: p-cut בטור ימין ופסקת המשך בראש טור שמאל — תקין', () => {
    const m = modelOf(page(0, [block([column('right', RX, [para('p-cut', RX, 100, 380, 3)]), column('left', LX, [para('p-end', LX, 100, 380, 2, { cont: true })])])]));
    assert.equal(kinds(api.audit(m), 'chain-broken').length, 0);
});
test('שרשרת: p-cut בלי המשך — שבור', () => {
    const m = modelOf(page(0, [block([column('right', RX, [para('p-cut', RX, 100, 380, 3)]), column('left', LX, [para('p-end', LX, 100, 380, 2)])])]));
    assert.equal(kinds(api.audit(m), 'chain-broken').length, 1);
});
test('שרשרת: פסקת המשך בלי p-cut לפניה — שבור', () => {
    const m = modelOf(page(0, [block([column('right', RX, [para('p-end', RX, 100, 380, 3)]), column('left', LX, [para('p-end', LX, 100, 380, 2, { cont: true })])])]));
    assert.equal(kinds(api.audit(m), 'chain-broken').length, 1);
});

/* ---------- U+E000 וטור ריק ---------- */
test('תו U+E000 בפסקה', () => {
    const m = modelOf(page(0, [block([column('right', RX, [para('p-end', RX, 100, 380, 2, { pua: true })]), column('left', LX, [])])]));
    assert.equal(kinds(api.audit(m), 'pua-char').length, 1);
});
test('טור ריק: high באמצע עמוד, low בסוף פרק', () => {
    const mk = (nextHasH2) => {
        const p0 = page(0, [block([column('right', RX, [para('p-end', RX, 100, 380, 3)]), column('left', LX, [])])]);
        const p1 = page(1, nextHasH2 ? [node('h2-title', R(10, 90, 780, 40), { lines: [Ln(10, 90, 780)] })] : []);
        return modelOf(p0, p1);
    };
    assert.equal(kinds(api.audit(mk(false)), 'empty-column')[0].severity, 'high');
    assert.equal(kinds(api.audit(mk(true)), 'empty-column')[0].severity, 'low');
});

/* ---------- דטרמיניזם וייצוא ---------- */
test('דטרמיניזם: אותו מודל → אותם ממצאים, וה-JSON המיוצא ללא מעגלים', () => {
    const build = () => modelOf(page(0, [block([column('right', RX, [para('p-end', RX, 100, 380, 1, { cont: true }), para('p-cut', RX, 120, 380, 1)]), column('left', LX, [])])], { fn: 950 }));
    const a = api.audit(build()), b = api.audit(build());
    assert.equal(JSON.stringify(a), JSON.stringify(b));
    const m = build(); api.audit(m);
    const cleaned = api.cleanForExport(m.pages[0]);
    assert.doesNotThrow(() => JSON.stringify(cleaned));
    assert.equal(JSON.stringify(cleaned).includes('_parent'), false);
});
