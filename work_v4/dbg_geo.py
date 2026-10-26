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
    log = page.evaluate("() => window.__geoLog || []")
    diffs = [g - f for f, g in log]
    big = [(f, g) for f, g in log if abs(g - f) > 4]
    print('blocks:', len(log), ' |diff|>4px:', len(big), ' mean diff:', round(sum(diffs)/max(1,len(diffs)),1))
    print('sample big diffs (formula, geometric):', big[:12])
    b.close()
