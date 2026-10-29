import sys, json
from playwright.sync_api import sync_playwright
port = int(sys.argv[1])
with open('test_doc.txt', encoding='utf-8') as f: doc = f.read()
with sync_playwright() as p:
    b = p.chromium.launch(); page = b.new_page(viewport={"width":1600,"height":1200})
    page.goto(f"http://localhost:{port}/index.html"); page.wait_for_timeout(5000)
    page.evaluate("(t) => { document.getElementById('raw-input').value = t; }", doc)
    page.evaluate("() => { document.getElementById('size-body').value = 12.6; performTypeset(); }")
    page.wait_for_timeout(8000)
    r = page.evaluate("""() => {
      const els = Array.from(document.querySelectorAll('p[data-token-id="295"]'));
      return els.map(e => {
        const col = e.parentElement; const cs = getComputedStyle(e);
        return { cls: e.className, cont: e.getAttribute('data-is-cont'), colClass: col.className, colW: Math.round(col.getBoundingClientRect().width),
                 pW: Math.round(e.getBoundingClientRect().width), pH: Math.round(e.getBoundingClientRect().height), lh: cs.lineHeight, fs: cs.fontSize,
                 textLen: e.textContent.length, txt: e.textContent.slice(0, 60), pl: cs.paddingRight, ml: cs.marginRight, ti: cs.textIndent, ta: cs.textAlign, tal: cs.textAlignLast };
      });
    }""")
    for x in r: print(json.dumps(x, ensure_ascii=False))
    b.close()
