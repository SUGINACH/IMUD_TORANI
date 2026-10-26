// מריץ את balanceColumns האמיתית (מתוך typesetter.js) על תרחישים אקראיים במודל גבהים דטרמיניסטי.
// שימוש: node test_balance.js [נתיב ל-index.html]   (ברירת מחדל: /tmp/bomrun/index.html - עותק עם BOM, ראו סעיף 7.1)
const { JSDOM, VirtualConsole } = require("jsdom");
const htmlPath = process.argv[2] || "/tmp/bomrun/index.html";
function rng(seed){ return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

(async () => {
  const dom = await JSDOM.fromFile(htmlPath, { url: "file://" + htmlPath, resources: "usable", runScripts: "dangerously",
    pretendToBeVisual: true, virtualConsole: new VirtualConsole(),
    beforeParse(w) {
      Object.defineProperty(w, 'onload', { configurable: true, set() {}, get() { return null; } });
      w.alert = () => {};
    } });
  const { window } = dom; const { document } = window;
  await new Promise(r => { window.addEventListener('load', r); setTimeout(r, 4000); });

  // ---- מודל גבהים דטרמיניסטי: מילה = שורה = 20px, כותרת = 40px ----
  const words = el => (el.textContent || '').replace(/\u00a0/g, ' ').trim().split(/\s+/).filter(Boolean);
  const H = el => {
    if (el.tagName === 'P') return words(el).length * 20;
    if (typeof el.className === 'string' && /title-level-/.test(el.className)) return 40;
    let s = 0; for (const c of el.children) s += H(c); return s;
  };
  Object.defineProperty(window.HTMLElement.prototype, 'scrollHeight', { configurable: true, get() { return H(this); } });
  Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', { configurable: true, get() { return H(this); } });
  Object.defineProperty(window.HTMLElement.prototype, 'offsetTop', { configurable: true, get() { return 0; } });
  Object.defineProperty(window.HTMLElement.prototype, 'offsetWidth', { configurable: true, get() { return 280; } });
  window.HTMLElement.prototype.getBoundingClientRect = function () { const h = H(this); return { top: 0, bottom: h, left: 0, right: 280, width: 280, height: h, x: 0, y: 0 }; };
  // כל "מילה" בקלט היא שורה אחת - כך שליטה מלאה במספר השורות של כל פסקה
  window.getLinesFromParagraph = (text) => ({ lines: text.trim().split(/\s+/).filter(Boolean), hasWindow: false });

  const setFlags = (W, O) => { document.getElementById('avoid-widows').checked = W; document.getElementById('avoid-orphans').checked = O; };

  function buildScenario(rand) {
    const n = 1 + Math.floor(rand() * 8);
    const items = [];
    for (let i = 0; i < n; i++) {
      if (rand() < 0.3 && i < n - 0) items.push({ type: 'h', id: 'h' + i });
      else items.push({ type: 'p', id: 't' + i, lines: 1 + Math.floor(rand() * 12) });
    }
    if (!items.some(x => x.type === 'p')) items.push({ type: 'p', id: 'tx', lines: 3 });
    return items;
  }
  function render(items) {
    const block = document.createElement('div'); block.className = 'block-2col';
    block.innerHTML = '<div class="margin-notes-column right-margin"></div><div></div><div class="main-column right-col"></div><div class="col-gutter-divider"></div><div class="main-column left-col"></div><div></div><div class="margin-notes-column left-margin"></div>';
    const rCol = block.querySelector('.right-col');
    const tokens = [];
    items.forEach(it => {
      if (it.type === 'h') {
        const d = document.createElement('div'); d.className = 'title-level-4'; d.setAttribute('data-token-id', it.id); d.textContent = 'H_' + it.id; rCol.appendChild(d); tokens.push('H_' + it.id);
      } else {
        const ws = Array.from({ length: it.lines }, (_, k) => it.id + '_' + (k + 1));
        const p = document.createElement('p'); p.className = 'p-end'; p.setAttribute('data-token-id', it.id); p.setAttribute('data-is-cont', 'false');
        p.setAttribute('data-raw-text', ws.join(' ')); p.textContent = ws.join(' '); rCol.appendChild(p); tokens.push(...ws);
      }
    });
    document.body.appendChild(block);
    return { block, tokens };
  }

  // מונה בלתי-תלוי של כל נקודות החיתוך החוקיות (לפי הכללים המתועדים) - להשוואת אופטימליות
  function legalRightHeights(items, W, O) {
    const lh = it => it.type === 'h' ? 40 : it.lines * 20;
    const total = items.reduce((s, it) => s + lh(it), 0);
    const out = []; let acc = 0;
    for (let i = 0; i <= items.length; i++) {
      const it = items[i];
      if (!(i > 0 && items[i - 1].type === 'h')) out.push(acc);          // אסור חיתוך מיד אחרי כותרת
      if (it && it.type === 'p') for (let l = 1; l < it.lines; l++) { if (W && l === 1) continue; if (O && it.lines - l === 1) continue; out.push(acc + l * 20); }
      if (it) acc += lh(it);
    }
    return { total, out };
  }
  function bestPossibleDiff(items, W, O) {
    const { total, out } = legalRightHeights(items, W, O);
    return Math.min(...out.map(r => Math.abs(r - (total - r))));
  }

  function runMany(count, seed, W, O, avail) {
    const rand = rng(seed); const stats = { runs: 0, exceptions: 0, lost: 0, orderBroken: 0, widow: 0, orphan: 0, headingAtBottom: 0, notOptimal: 0, cuts: 0 };
    const examples = {};
    for (let s = 0; s < count; s++) {
      const items = buildScenario(rand);
      setFlags(W, O);
      const { block, tokens } = render(items);
      stats.runs++;
      try { window.balanceColumns(block, 280, { fontFamily: 'serif', fontSize: '11pt', lineHeight: '1.34' }, null, avail); }
      catch (e) { stats.exceptions++; examples.exc = examples.exc || e.message; block.remove(); continue; }
      const R = Array.from(block.querySelector('.right-col').children), L = Array.from(block.querySelector('.left-col').children);
      const out = []; [...R, ...L].forEach(el => out.push(...words(el)));
      if (out.length !== tokens.length) { stats.lost++; examples.lost = examples.lost || JSON.stringify({ items, out: out.length, exp: tokens.length }); }
      else if (out.some((t, i) => t !== tokens[i])) { stats.orderBroken++; examples.order = examples.order || JSON.stringify({ items }); }
      // פסקאות שנחתכו בין הטורים
      const idOf = el => el.getAttribute('data-token-id');
      const rIds = new Map(), lIds = new Map();
      R.forEach(el => { if (el.tagName === 'P') rIds.set(idOf(el), (rIds.get(idOf(el)) || 0) + words(el).length); });
      L.forEach(el => { if (el.tagName === 'P') lIds.set(idOf(el), (lIds.get(idOf(el)) || 0) + words(el).length); });
      rIds.forEach((rn, id) => { if (lIds.has(id)) {
        stats.cuts++; const ln = lIds.get(id);
        if (rn === 1) { stats.widow++; examples.widow = examples.widow || JSON.stringify({ items, W, O, right: rn, left: ln }); }
        if (ln === 1) { stats.orphan++; examples.orphan = examples.orphan || JSON.stringify({ items, W, O, right: rn, left: ln }); }
      } });
      const lastR = R[R.length - 1];
      if (lastR && lastR.tagName !== 'P' && L.length > 0) { stats.headingAtBottom++; examples.heading = examples.heading || JSON.stringify({ items }); }
      if (avail === Infinity) {
        const rH = R.reduce((a, el) => a + H(el), 0), lH = L.reduce((a, el) => a + H(el), 0);
        if (Math.abs(rH - lH) !== bestPossibleDiff(items, W, O)) { stats.notOptimal++; examples.opt = examples.opt || JSON.stringify({ items, W, O, got: Math.abs(rH - lH), want: bestPossibleDiff(items, W, O) }); }
      }
      block.remove();
    }
    return { stats, examples };
  }

  // בדיקת גובה: כשקיימת חלוקה חוקית שנכנסת - חייבת להיבחר; אחרת - זו שגולשת הכי פחות
  function runFit(count, seed, W, O) {
    const rand = rng(seed); const s = { runs: 0, mustFitButOverflowed: 0, notLeastOverflow: 0, fitCases: 0, overflowCases: 0 }; let ex = null;
    for (let k = 0; k < count; k++) {
      const items = buildScenario(rand); setFlags(W, O);
      const { total, out } = legalRightHeights(items, W, O);
      const minMax = Math.min(...out.map(r => Math.max(r, total - r)));
      for (const delta of [-60, -20, 0, 20, 100]) {
        const avail = minMax + delta; const { block } = render(items);
        window.balanceColumns(block, 280, { fontFamily: 'serif', fontSize: '11pt', lineHeight: '1.34' }, null, avail);
        const R = Array.from(block.querySelector('.right-col').children), L = Array.from(block.querySelector('.left-col').children);
        const got = Math.max(R.reduce((a, e) => a + H(e), 0), L.reduce((a, e) => a + H(e), 0));
        s.runs++;
        if (delta >= 0) { s.fitCases++; if (got > avail) { s.mustFitButOverflowed++; ex = ex || JSON.stringify({ items, W, O, avail, got, minMax }); } }
        else { s.overflowCases++; if (got !== minMax) { s.notLeastOverflow++; ex = ex || JSON.stringify({ items, W, O, avail, got, minMax }); } }
        block.remove();
      }
    }
    return { stats: s, examples: ex ? { first: ex } : {} };
  }

  const show = (label, r) => { console.log(label); console.log('  ', JSON.stringify(r.stats)); Object.entries(r.examples).forEach(([k, v]) => console.log('    דוגמה', k + ':', v.slice(0, 230))); };
  show('=== כללים דולקים (W+O), גובה פנוי אינסופי ===', runMany(600, 1234, true, true, Infinity));
  show('=== כללים דולקים (W+O), גובה פנוי צר (400px) ===', runMany(600, 99, true, true, 400));
  show('=== רק widow דולק ===', runMany(400, 5, true, false, Infinity));
  show('=== רק orphan דולק ===', runMany(400, 6, false, true, Infinity));
  show('=== בקרה: כללים כבויים (מצופות הפרות - מוכיח שהגלאי לא עיוור) ===', runMany(600, 1234, false, false, Infinity));
  show('=== בדיקת גובה: חלוקה שנכנסת תיבחר; ואם אין - הגולשת הכי פחות (W+O) ===', runFit(400, 777, true, true));
  show('=== בדיקת גובה (הכללים כבויים) ===', runFit(400, 778, false, false));
  window.close();
})().catch(e => { console.error('FATAL:', e.stack); process.exit(2); });
