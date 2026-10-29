import json, sys, time
from playwright.sync_api import sync_playwright

CHECK_JS = r"""
() => {
  const pages = Array.from(document.querySelectorAll('#book-container .a4-page'));
  const res = { pageCount: pages.length, overflow: [], footerCollide: [], headingOrphans: [], pageEndHeading: [], lineOrphans: [], lineWidows: [], colDiffBig: [] };
  function countLines(p) {
    const range = document.createRange();
    range.selectNodeContents(p);
    const rects = Array.from(range.getClientRects()).filter(r => r.width > 1 && r.height > 1);
    const lh = parseFloat(getComputedStyle(p).lineHeight) || 16;
    const tops = [];
    rects.forEach(r => {
      const mid = r.top + r.height / 2;
      if (!tops.some(t => Math.abs(t - mid) < lh * 0.45)) tops.push(mid);
    });
    return tops.length;
  }
  pages.forEach((pg, pIdx) => {
    const pgRect = pg.getBoundingClientRect();
    const footer = pg.querySelector('.page-number-footer');
    const footerTop = footer ? footer.getBoundingClientRect().top : pgRect.bottom;
    const flow = pg.querySelector('.page-body-flow');
    if (flow && flow.lastElementChild) {
      const le = flow.lastElementChild;
      const cls = String(le.className || '');
      if (cls.includes('block-h3-span') || cls.startsWith('title-level-') || cls.includes('block-h2-title-side') || cls.includes('h2-ornament-bottom')) {
        pg.__x = 1;
        res.pageEndHeading.push({ pIdx, cls: cls.slice(0, 30), text: le.textContent.trim().slice(0, 30) });
      }
    }
    const colEls = Array.from(pg.querySelectorAll('.block-2col .right-col, .block-2col .left-col, .single-wide-col'));
    colEls.forEach((col, ci) => {
      if (!col.children.length) return;
      const kids = Array.from(col.children);
      const last = kids[kids.length - 1];
      const lr = last.getBoundingClientRect();
      if (lr.bottom > pgRect.bottom + 2) res.overflow.push({ pIdx, ci, by: Math.round(lr.bottom - pgRect.bottom) });
      else if (lr.bottom > footerTop + 1) res.footerCollide.push({ pIdx, ci, by: Math.round(lr.bottom - footerTop) });
      if (last.className && String(last.className).startsWith('title-level-')) {
        res.headingOrphans.push({ pIdx, ci, text: last.textContent.trim().slice(0, 30) });
      }
      if (last.tagName === 'P' && last.classList.contains('p-cut') && countLines(last) === 1) {
        res.lineOrphans.push({ pIdx, ci, text: last.textContent.trim().slice(0, 30) });
      }
      const first = kids[0];
      if (first.tagName === 'P' && first.getAttribute('data-is-cont') === 'true' && countLines(first) === 1) {
        res.lineWidows.push({ pIdx, ci, text: first.textContent.trim().slice(0, 30) });
      }
    });
    pg.querySelectorAll('.block-2col').forEach(block => {
      const r = block.querySelector('.right-col'), l = block.querySelector('.left-col');
      if (r && l && r.children.length && l.children.length && Math.abs(r.scrollHeight - l.scrollHeight) > 90)
        res.colDiffBig.push({ pIdx, diff: Math.round(Math.abs(r.scrollHeight - l.scrollHeight)) });
    });
  });
  return res;
}
"""

def run(port, settings_js, label, doc_path='/mnt/user-data/outputs/work_v4/test_doc.txt', show=False):
    with open(doc_path, encoding='utf-8') as f:
        doc_text = f.read()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width":1600,"height":1200})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(f"http://localhost:{port}/index.html")
        page.wait_for_timeout(5000)
        page.evaluate("(t) => { document.getElementById('raw-input').value = t; }", doc_text)
        if settings_js:
            page.evaluate(settings_js)
        t0 = time.time()
        page.evaluate("() => { performTypeset(); }")
        page.wait_for_timeout(3000)
        last = -1
        for _ in range(40):
            c = page.evaluate("() => document.querySelectorAll('#book-container .a4-page').length")
            if c == last: break
            last = c
            page.wait_for_timeout(500)
        el = time.time() - t0
        res = page.evaluate(CHECK_JS)
        browser.close()
    summary = {k: (len(v) if isinstance(v, list) else v) for k, v in res.items()}
    print(f"[{label}] t={el:.0f}s err={errors[:2]} ->", json.dumps(summary, ensure_ascii=False))
    if show:
        for k in ('overflow','footerCollide','headingOrphans','pageEndHeading','lineOrphans','lineWidows'):
            if res[k]: print('    ', k, json.dumps(res[k][:5], ensure_ascii=False))
    return res

if __name__ == '__main__':
    port = int(sys.argv[1])
    sizes = [None, 11, 12.6, 13.4, 14.2]
    for s in sizes:
        js = None if s is None else f"() => {{ document.getElementById('size-body').value = {s}; }}"
        run(port, js, 'baseline' if s is None else f'body {s}pt', show=True)
