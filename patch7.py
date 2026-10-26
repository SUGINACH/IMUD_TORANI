import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1, label=''):
    global s
    c = s.count(old); assert c == count, f"[{label}] expected {count}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)

# (a) עזרי מדידה מוחלטת בתוך זרימת העמוד (כולל שולי אלמנטים), ביחידות layout
helpers = r'''
// תחתית התוכן בזרימת העמוד (כולל השוליים התחתונים של האלמנט האחרון), ביחידות layout.
// נמדד ע"י אלמנט-בדיקה בגובה אפס בסוף הזרימה — כך כל השוליים נספרים אוטומטית.
function flowBottomOf(flow) {
    const probe = document.createElement('div');
    probe.style.cssText = 'height:0;margin:0;padding:0;border:0;';
    flow.appendChild(probe);
    const fr = flow.getBoundingClientRect(), pr = probe.getBoundingClientRect();
    flow.removeChild(probe);
    const sc = (flow.offsetWidth && fr.width) ? fr.width / flow.offsetWidth : 1;
    return (pr.top - fr.top) / sc;
}
// מיקום ראש אלמנט ביחס לראש הזרימה, ביחידות layout.
function flowTopOfEl(flow, el) {
    const fr = flow.getBoundingClientRect(), er = el.getBoundingClientRect();
    const sc = (flow.offsetWidth && fr.width) ? fr.width / flow.offsetWidth : 1;
    return (er.top - fr.top) / sc;
}

'''
rep("function balanceColumns(", helpers + "function balanceColumns(", label='helpers')  # first occurrence only? ensure count

# (b) כותרת span: גובה כולל שוליים
rep("                    pageLayout.bodyFlow.appendChild(spanBlock);\n\n                    const spanHeight = spanBlock.offsetHeight + 4;",
    "                    const spanU0 = flowBottomOf(pageLayout.bodyFlow);\n"
    "                    pageLayout.bodyFlow.appendChild(spanBlock);\n\n"
    "                    const spanHeight = Math.max(spanBlock.offsetHeight + 4, flowBottomOf(pageLayout.bodyFlow) - spanU0);", label='span-height')

# (c) תחילת בלוק: תקציב מדויק לפי מיקום הבלוק בפועל בזרימה
rep("                pageLayout.bodyFlow.appendChild(block2Col);",
    "                pageLayout.bodyFlow.appendChild(block2Col);\n"
    "                remPageHeight = totalFlowH - flowTopOfEl(pageLayout.bodyFlow, block2Col);", label='block-budget')

# (d) סוף בלוק: תקציב שנותר לפי תחתית הזרימה בפועל (כולל שוליים)
rep("                remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);",
    "                remPageHeight = totalFlowH - flowBottomOf(pageLayout.bodyFlow);", label='block-after')

open(path, 'w', encoding='utf-8').write(s)
print('patch7 applied')
