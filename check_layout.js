window.__checkLayout = function (opts) {
  opts = opts || {};
  const TOL = 1.0;
  const out = [];
  const pages = Array.from(document.querySelectorAll('#book-container .a4-page'));
  const fragsByTok = {};
  const lineCount = (p, scale) => {
    const range = document.createRange();
    range.selectNodeContents(p);
    const rects = Array.from(range.getClientRects()).filter(r => r.width > 1 && r.height > 1);
    const lh = parseFloat(getComputedStyle(p).lineHeight) || 20;
    const tops = [];
    rects.forEach(r => {
      if (r.height / scale > lh * 1.6) return;
      const t = r.top / scale;
      if (!tops.some(x => Math.abs(x - t) < lh * 0.45)) tops.push(t);
    });
    return tops.length;
  };
  pages.forEach((page, pIdx) => {
    const pr = page.getBoundingClientRect();
    const scale = (page.offsetWidth ? pr.width / page.offsetWidth : 1) || 1;
    const pageNo = page.getAttribute('data-page-index') || ('#' + pIdx);
    if (!page.querySelector('.block-2col') && !page.querySelector('.block-single-col')) return;
    const fnArea = page.querySelector('.footnote-area');
    const footer = page.querySelector('.page-number-footer');
    const limitEl = fnArea || footer;
    const limit = limitEl ? limitEl.getBoundingClientRect().top / scale : Infinity;
    const blocks = Array.from(page.querySelectorAll('.block-2col'));
    blocks.forEach((b, bIdx) => {
      const rCol = b.querySelector('.right-col'), lCol = b.querySelector('.left-col');
      const bot = col => { const last = col.lastElementChild; return last ? last.getBoundingClientRect().bottom / scale : null; };
      const rB = bot(rCol), lB = bot(lCol);
      [['right', rB], ['left', lB]].forEach(([nm, v]) => {
        if (v !== null && v > limit + 0.5) out.push({ page: pageNo, type: 'OVERFLOW', col: nm, by: +(v - limit).toFixed(1) });
      });
      if (rB !== null && lB !== null && Math.abs(rB - lB) > TOL) {
        const shorter = rB < lB ? rCol : lCol;
        const lh = parseFloat(getComputedStyle(shorter).lineHeight) || 20;
        const gaps = Array.from(shorter.children).slice(0, -1).filter(k => k.tagName === 'P').length;
        const unavoidable = gaps === 0 && Math.abs(rB - lB) <= lh * 3.6;
        out.push({ page: pageNo, type: unavoidable ? 'GRANULARITY(ok)' : 'MISALIGNED', diff: +(rB - lB).toFixed(1), block: bIdx, ofBlocks: blocks.length, gaps });
      }
      [['right', rCol], ['left', lCol]].forEach(([nm, col]) => {
        const last = col.lastElementChild;
        if (last && last.tagName !== 'P' && /title-level|heading/.test(last.className)
            && !(b.nextElementSibling && b.nextElementSibling.classList.contains('block-h3-span'))
            && !(typeof globalTokens !== 'undefined' && globalTokens.length && (() => {
                 const hid = String(last.getAttribute('data-token-id'));
                 const ix = globalTokens.findIndex(t => String(t.id) === hid);
                 if (ix < 0) return false;
                 const nx = globalTokens[ix + 1];
                 return !nx || nx.type === 'h1' || nx.type === 'h2' || nx.type === 'h0';   // סוף סעיף: אין טקסט אחריה בכלל
               })()))
          out.push({ page: pageNo, type: 'HEADING_ORPHAN_COL', col: nm, text: last.textContent.trim().slice(0, 25) });
      });
      [['right', rCol], ['left', lCol]].forEach(([nm, col]) => {
        Array.from(col.children).forEach(el => {
          if (el.tagName !== 'P') return;
          const id = el.getAttribute('data-token-id');
          (fragsByTok[id] = fragsByTok[id] || []).push({
            page: pageNo, pIdx, col: nm, cls: el.className,
            cont: el.getAttribute('data-is-cont') === 'true',
            lines: lineCount(el, scale), raw: el.getAttribute('data-raw-text') || ''
          });
        });
      });
    });
    Array.from(page.querySelectorAll('.block-single-col .single-wide-col')).forEach(col => {
      const last = col.lastElementChild;
      if (last) { const v = last.getBoundingClientRect().bottom / scale; if (v > limit + 0.5) out.push({ page: pageNo, type: 'OVERFLOW', col: 'single', by: +(v - limit).toFixed(1) }); }
      if (last && last.tagName !== 'P' && /title-level|heading/.test(last.className)) out.push({ page: pageNo, type: 'HEADING_ORPHAN_COL', col: 'single', text: last.textContent.trim().slice(0, 25) });
      Array.from(col.children).forEach(el => {
        if (el.tagName !== 'P') return;
        const id = el.getAttribute('data-token-id');
        (fragsByTok[id] = fragsByTok[id] || []).push({ page: pageNo, pIdx, col: 'single', cls: el.className, cont: el.getAttribute('data-is-cont') === 'true', lines: lineCount(el, scale), raw: el.getAttribute('data-raw-text') || '' });
      });
    });
    const flow = page.querySelector('.page-body-flow');
    if (flow) {
      const kids = Array.from(flow.children).filter(k => !k.classList.contains('sec-divider-wrap'));
      const last = kids[kids.length - 1];
      if (last && last.classList.contains('block-h3-span')) out.push({ page: pageNo, type: 'SPAN_HEADING_ORPHAN', text: last.textContent.trim().slice(0, 25) });
      if (last && last.classList.contains('block-2col') && !last.querySelector('.right-col').children.length && !last.querySelector('.left-col').children.length)
        out.push({ page: pageNo, type: 'EMPTY_BLOCK' });
    }
  });
  Object.keys(fragsByTok).forEach(id => {
    const ordered = fragsByTok[id];
    if (ordered.length > 1) {
      ordered.forEach((f, i) => {
        const isLast = i === ordered.length - 1;
        if (!isLast && !/p-cut/.test(f.cls)) out.push({ page: f.page, type: 'FRAGMENT_NOT_CUT', tok: id, cls: f.cls, col: f.col });
        if (isLast && /p-cut/.test(f.cls)) out.push({ page: f.page, type: 'LAST_FRAGMENT_CUT', tok: id, cls: f.cls });
        if (f.lines === 1) out.push({ page: f.page, type: isLast ? 'ORPHAN_LINE_TOP' : (i === 0 ? 'WIDOW_LINE_BOTTOM' : 'MID_FRAGMENT_1LINE'), tok: id, col: f.col });
      });
    } else if (ordered.length === 1 && /p-cut/.test(ordered[0].cls)) {
      out.push({ page: ordered[0].page, type: 'SINGLE_FRAGMENT_CUT', tok: id });
    }
  });
  if (typeof globalTokens !== 'undefined' && opts.checkText !== false) {
    const norm = s => (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    globalTokens.forEach(t => {
      if (t.type !== 'p') return;
      const fr = fragsByTok[String(t.id)];
      if (!fr) { out.push({ type: 'TEXT_MISSING', tok: t.id, text: norm(t.text).slice(0, 25) }); return; }
      const joined = norm(fr.map(f => f.raw).join(' '));
      if (joined !== norm(t.text)) out.push({ type: 'TEXT_MISMATCH', tok: t.id, got: joined.slice(0, 30), want: norm(t.text).slice(0, 30), len: [joined.length, norm(t.text).length] });
    });
  }
  return out;
};
