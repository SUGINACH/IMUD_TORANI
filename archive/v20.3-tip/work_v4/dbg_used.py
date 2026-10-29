import sys, json
from playwright.sync_api import sync_playwright
port = int(sys.argv[1])
with open('test_doc.txt', encoding='utf-8') as f: doc = f.read()
with sync_playwright() as p:
    b = p.chromium.launch(); page = b.new_page(viewport={"width":1600,"height":1200})
    page.goto(f"http://localhost:{port}/index.html"); page.wait_for_timeout(5000)
    page.evaluate("() => { window.__DBG = true; }")
    page.evaluate("(t) => { document.getElementById('raw-input').value = t; }", doc)
    page.evaluate("() => { performTypeset(); }"); page.wait_for_timeout(9000)
    log = page.evaluate("() => window.__usedLog")
    actual = page.evaluate("""() => {
      const pages = Array.from(document.querySelectorAll('#book-container .a4-page'));
      const out = [];
      pages.forEach((pg, i) => {
        if (!pg.querySelector('.title-level-2-standalone') || pg.querySelector('.toc-page-num')) return;
        const flow = pg.querySelector('.page-body-flow'); if (!flow) return;
        const blk = flow.querySelector('.block-2col'); if (!blk) return;
        out.push({ i, flowH: Math.round(flow.clientHeight), firstBlockTop: Math.round(blk.getBoundingClientRect().top - flow.getBoundingClientRect().top),
                   children: Array.from(flow.children).map(c => String(c.className).slice(0,22) + ':' + Math.round(c.getBoundingClientRect().height)).slice(0,8) });
      });
      return out;
    }""")
    print('engine used/totalFlowH per first page:', json.dumps(log))
    for a in actual[:4]: print(json.dumps(a, ensure_ascii=False))
    b.close()
