import sys, json
sys.path.insert(0, '.')
from checker import run
from playwright.sync_api import sync_playwright

port = int(sys.argv[1])
GAP_JS = """() => {
  const pages = Array.from(document.querySelectorAll('#book-container .a4-page'));
  const rows = [];
  pages.forEach((pg, i) => {
    const footer = pg.querySelector('.page-number-footer'); if (!footer) return;
    const kids = Array.from(pg.querySelectorAll('.block-2col .right-col > *, .block-2col .left-col > *, .single-wide-col > *, .block-h3-span'));
    if (!kids.length) return;
    let bottom = 0; kids.forEach(k => { bottom = Math.max(bottom, k.getBoundingClientRect().bottom); });
    const isH2 = !!pg.querySelector('.title-level-2-standalone') && !pg.querySelector('.toc-page-num');
    rows.push({ i, gap: Math.round(footer.getBoundingClientRect().top - bottom), isH2 });
  });
  const reg = rows.filter(r => !r.isH2).map(r => r.gap).sort((a,b)=>a-b);
  return { med: reg[Math.floor(reg.length/2)], ch: rows.filter(r => r.isH2).map(r => r.gap) };
}"""
CONFIGS = [
  ("no ornaments", None),
  ("siman+title ornaments + h3 side", """() => {
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
      set('h2-ornament-top-style','ud1'); set('h2-ornament-bottom-style','ud1');
      set('h2-title-ornament-top-style','ud1'); set('h2-title-ornament-bottom-style','ud1');
      set('h3-ornament-r','lr1'); set('h3-ornament-l','lr1');
  }"""),
]
with open('test_doc.txt', encoding='utf-8') as f: doc = f.read()
for label, js in CONFIGS:
    with sync_playwright() as p:
        b = p.chromium.launch(); page = b.new_page(viewport={"width":1600,"height":1200})
        page.goto(f"http://localhost:{port}/index.html"); page.wait_for_timeout(5000)
        page.evaluate("(t) => { document.getElementById('raw-input').value = t; }", doc)
        if js: page.evaluate(js)
        page.evaluate("() => { performTypeset(); }"); page.wait_for_timeout(9000)
        g = page.evaluate(GAP_JS)
        b.close()
    res = run(port, js, label)
    print('   gaps: median(regular)=', g['med'], ' chapter-first=', g['ch'])
