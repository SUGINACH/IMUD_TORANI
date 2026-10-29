import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1, label=''):
    global s
    c = s.count(old); assert c == count, f"[{label}] expected {count}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)

def block(ind, with_state):
    i = ' ' * ind
    hid = ""
    if with_state:
        hid = (f"{i}        const hid0 = lastEl.getAttribute('data-token-id');\n")
    del_line = (f"{i}        if (hid0 !== null && !blockStartState.headingKeys.has(hid0)) delete headingPageMap[hid0];\n" if with_state else "")
    return (
f"{i}if (bestFitLine === 0) {{\n"
f"{i}    targetCol.removeChild(pElem);\n"
f"{i}    if (targetCol.children.length > 0) {{\n"
f"{i}        let lastEl = targetCol.lastElementChild;\n"
f"{i}        while (lastEl && isHeadingEl(lastEl)) {{\n"
f"{hid}"
f"{i}            targetCol.removeChild(lastEl);\n"
f"{del_line}"
f"{i}            tokenIndex--;\n"
f"{i}            lastEl = targetCol.lastElementChild;\n"
f"{i}        }}\n"
f"{i}        break;\n"
f"{i}    }} else if (!pageHasContent && !pageLayout.bodyFlow.querySelector('p')) {{\n"
f"{i}        // עמוד ריק לגמרי ושורה אחת לא נכנסת: חייבים להתקדם — מציבים שורה אחת\n"
f"{i}        // (ומחזירים את האלמנט ל-DOM; בלי זה השורה נעלמת מהפלט)\n"
f"{i}        bestFitLine = 1;\n"
f"{i}        targetCol.appendChild(pElem);\n"
f"{i}    }} else {{\n"
f"{i}        break;   // יש כבר טקסט בעמוד: הפסקה עוברת לטור/עמוד הבא, בלי לצרוך אותה\n"
f"{i}    }}\n"
f"{i}}}\n")

def old_block(ind):
    i = ' ' * ind
    return (
f"{i}if (bestFitLine === 0) {{\n"
f"{i}    targetCol.removeChild(pElem);\n"
f"{i}    if (targetCol.children.length > 0) {{\n"
f"{i}        let lastEl = targetCol.lastElementChild;\n"
f"{i}        while (lastEl && lastEl.className.startsWith('title-level-')) {{\n"
f"{i}            targetCol.removeChild(lastEl);\n"
f"{i}            tokenIndex--;\n"
f"{i}            lastEl = targetCol.lastElementChild;\n"
f"{i}        }}\n"
f"{i}        break;\n"
f"{i}    }} else {{\n"
f"{i}        if (!pageHasContent) bestFitLine = 1;\n"
f"{i}        else break;\n"
f"{i}    }}\n"
f"{i}}}\n")

rep(old_block(28), block(28, True), label='two-col')
rep(old_block(24), block(24, False), label='h0')

# מסלול בלוק ריק: מחזירים את מצב הטוקנים לתחילת הבלוק (לא צורכים דבר)
rep("                if (rCol.children.length === 0 && lCol.children.length === 0) {\n                    if (blockNoteSnapshot) {",
    "                if (rCol.children.length === 0 && lCol.children.length === 0) {\n"
    "                    tokenIndex = blockStartState.tokenIndex;\n"
    "                    pendingWordTokens = blockStartState.pendingWordTokens ? Object.assign({}, blockStartState.pendingWordTokens) : null;\n"
    "                    if (blockNoteSnapshot) {", label='empty-block')
open(path, 'w', encoding='utf-8').write(s)
print('patch6 applied')
