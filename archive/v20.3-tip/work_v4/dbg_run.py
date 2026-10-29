import sys
from playwright.sync_api import sync_playwright
port = int(sys.argv[1])
with open('test_doc.txt', encoding='utf-8') as f: doc = f.read()
with sync_playwright() as p:
    b = p.chromium.launch(); page = b.new_page(viewport={"width":1600,"height":1200})
    logs = []
    page.on("console", lambda m: logs.append(m.text) if m.text.startswith('DBG') else None)
    page.goto(f"http://localhost:{port}/index.html"); page.wait_for_timeout(5000)
    page.evaluate("() => { window.__DBG = true; }")
    page.evaluate("(t) => { document.getElementById('raw-input').value = t; }", doc)
    page.evaluate("() => { document.getElementById('size-body').value = 12.6; performTypeset(); }")
    page.wait_for_timeout(8000)
    for l in logs: print(l)
    b.close()
