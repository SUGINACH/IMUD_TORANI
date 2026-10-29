import sys, json
from playwright.sync_api import sync_playwright
port = int(sys.argv[1])
with open('test_doc.txt', encoding='utf-8') as f: doc = f.read()
SET = """() => {
  const set = (id, v) => { const el = document.getElementById(id); if (el) { if (el.type === 'checkbox') el.checked = v; else el.value = v; } };
  set('hdr-alternating', true);
  set('hdr-r-type', 'book_title'); set('hdr-l-type', 'h1'); set('hdr-c-type', 'h2');
  set('hdr-r-align', 'outer'); set('hdr-l-align', 'outer'); set('hdr-c-align', 'center');
}"""
MEASURE = """() => {
  const pages = Array.from(document.querySelectorAll('#book-container .a4-page')).filter(p => p.querySelector('.top-header-grid .header-col-r'));
  const out = [];
  [5, 6, 7, 8].forEach(k => {
    const pg = pages[k]; if (!pg) return;
    const grid = pg.querySelector('.top-header-grid'); const g = grid.getBoundingClientRect();
    const zone = (sel) => { const el = grid.querySelector(sel); if (!el || !el.textContent.trim()) return null;
      const r = document.createRange(); r.selectNodeContents(el); const b = r.getBoundingClientRect();
      return { text: el.textContent.trim().slice(0, 18), fromLeft: Math.round(b.left - g.left), fromRight: Math.round(g.right - b.right), centerOff: Math.round((b.left + b.right) / 2 - (g.left + g.right) / 2) }; };
    out.push({ pageIdx: pg.getAttribute('data-page-index'), R: zone('.header-col-r'), C: zone('.header-col-c'), L: zone('.header-col-l') });
  });
  return out;
}"""
with sync_playwright() as p:
    b = p.chromium.launch(); page = b.new_page(viewport={"width":1600,"height":1200})
    page.goto(f"http://localhost:{port}/index.html"); page.wait_for_timeout(5000)
    page.evaluate("(t) => { document.getElementById('raw-input').value = t; }", doc)
    page.evaluate(SET)
    page.evaluate("() => { performTypeset(); }"); page.wait_for_timeout(9000)
    for row in page.evaluate(MEASURE): print(json.dumps(row, ensure_ascii=False))
    b.close()
