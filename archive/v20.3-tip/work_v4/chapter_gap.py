import sys, json
from playwright.sync_api import sync_playwright
port = int(sys.argv[1])
with open('test_doc.txt', encoding='utf-8') as f: doc = f.read()
JS = """() => {
  const pages = Array.from(document.querySelectorAll('#book-container .a4-page'));
  const rows = [];
  let h0 = 0;
  pages.forEach((pg, i) => {
    const footer = pg.querySelector('.page-number-footer');
    if (!footer) return;
    if (pg.querySelector('.single-wide-col')) h0++;
    const footerTop = footer.getBoundingClientRect().top;
    const kids = Array.from(pg.querySelectorAll('.block-2col .right-col > *, .block-2col .left-col > *, .single-wide-col > *, .block-h3-span'));
    if (!kids.length) return;
    let bottom = 0; kids.forEach(k => { bottom = Math.max(bottom, k.getBoundingClientRect().bottom); });
    const isH2 = !!pg.querySelector('.title-level-2-standalone') && !pg.querySelector('.toc-page-num');
    rows.push({ i, gap: Math.round(footerTop - bottom), isH2 });
  });
  return { h0pages: h0, rows };
}"""
with sync_playwright() as p:
    b = p.chromium.launch(); page = b.new_page(viewport={"width":1600,"height":1200})
    page.goto(f"http://localhost:{port}/index.html"); page.wait_for_timeout(5000)
    page.evaluate("(t) => { document.getElementById('raw-input').value = t; }", doc)
    page.evaluate("() => { performTypeset(); }"); page.wait_for_timeout(9000)
    r = page.evaluate(JS)
    gaps_h2 = [x['gap'] for x in r['rows'] if x['isH2']]
    gaps_other = sorted([x['gap'] for x in r['rows'] if not x['isH2']])
    med = gaps_other[len(gaps_other)//2]
    print('H0 single-col pages:', r['h0pages'])
    print('median gap (regular pages):', med, ' 90th pct:', gaps_other[int(len(gaps_other)*0.9)])
    print('chapter-first-page gaps:', gaps_h2)
    b.close()
