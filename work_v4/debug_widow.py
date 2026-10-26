import json, sys
sys.path.insert(0, '.')
from playwright.sync_api import sync_playwright
port = int(sys.argv[1]); pIdx = int(sys.argv[2]); size = sys.argv[3]
with open('test_doc.txt', encoding='utf-8') as f: doc = f.read()
with sync_playwright() as p:
    b = p.chromium.launch(); page = b.new_page(viewport={"width":1600,"height":1200})
    page.goto(f"http://localhost:{port}/index.html"); page.wait_for_timeout(5000)
    page.evaluate("(t) => { document.getElementById('raw-input').value = t; }", doc)
    page.evaluate(f"() => {{ document.getElementById('size-body').value = {size}; performTypeset(); }}")
    page.wait_for_timeout(3000)
    last=-1
    for _ in range(40):
        c = page.evaluate("() => document.querySelectorAll('#book-container .a4-page').length")
        if c==last: break
        last=c; page.wait_for_timeout(500)
    r = page.evaluate("""(pIdx) => {
      function lines(p){const range=document.createRange();range.selectNodeContents(p);const rects=Array.from(range.getClientRects()).filter(r=>r.width>1&&r.height>1);const lh=parseFloat(getComputedStyle(p).lineHeight)||16;const t=[];rects.forEach(r=>{const m=r.top+r.height/2;if(!t.some(x=>Math.abs(x-m)<lh*0.45))t.push(m)});return t.length;}
      const pages = Array.from(document.querySelectorAll('#book-container .a4-page'));
      const out = [];
      [pIdx-1, pIdx].forEach(i => {
        const pg = pages[i];
        pg.querySelectorAll('.block-2col').forEach((blk, bi) => {
          ['right-col','left-col'].forEach(cn => {
            const col = blk.querySelector('.'+cn);
            out.push({page:i, block:bi, col:cn, kids:Array.from(col.children).map(k=>({tag:k.tagName, cls:String(k.className).slice(0,22), tid:k.getAttribute('data-token-id'), cont:k.getAttribute('data-is-cont'), n:k.tagName==='P'?lines(k):null, txt:k.textContent.trim().slice(0,14)}))});
          });
        });
      });
      return out;
    }""", pIdx)
    for row in r: print(json.dumps(row, ensure_ascii=False))
    b.close()
