import sys, json
from playwright.sync_api import sync_playwright
port = int(sys.argv[1]); pi = int(sys.argv[2])
with open('test_doc.txt', encoding='utf-8') as f: doc = f.read()
with sync_playwright() as p:
    b = p.chromium.launch(); page = b.new_page(viewport={"width":1600,"height":1200})
    page.goto(f"http://localhost:{port}/index.html"); page.wait_for_timeout(5000)
    page.evaluate("(t) => { document.getElementById('raw-input').value = t; }", doc)
    page.evaluate("() => { performTypeset(); }"); page.wait_for_timeout(9000)
    r = page.evaluate("""(pi) => {
      const pg = document.querySelectorAll('#book-container .a4-page')[pi];
      const flow = pg.querySelector('.page-body-flow'); const ft = flow.getBoundingClientRect().top;
      const footer = pg.querySelector('.page-number-footer').getBoundingClientRect().top - ft;
      const wrap = pg.querySelector('.page-content-wrapper');
      const rows = Array.from(flow.children).map(c => { const r = c.getBoundingClientRect(); const cs = getComputedStyle(c);
        return { cls: String(c.className).slice(0,24), top: Math.round(r.top - ft), bottom: Math.round(r.bottom - ft), h: Math.round(r.height), mt: cs.marginTop, mb: cs.marginBottom, pos: cs.position }; });
      const cs2 = getComputedStyle(flow);
      return { flowH: Math.round(flow.getBoundingClientRect().height), flowOverflow: cs2.overflow, footerTopRel: Math.round(footer), rows };
    }""", pi)
    print(json.dumps(r, ensure_ascii=False, indent=1))
    b.close()
