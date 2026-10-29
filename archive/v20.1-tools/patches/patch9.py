import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1, label=''):
    global s
    c = s.count(old); assert c == count, f"[{label}] expected {count}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)

# 1. כותרת inline שאחריה כותרת span (בלוק נפרד מתחתיה) נשארת במקומה; מסירים רק כשהטקסט שלה עבר לטור/עמוד הבא
rep("                    while (targetCol.lastElementChild && isHeadingEl(targetCol.lastElementChild)\n",
    "                    const nxtTokAfterHeads = pendingWordTokens ? null : secTokens[tokenIndex];\n"
    "                    const nextIsSpanHeading = !!(nxtTokAfterHeads && nxtTokAfterHeads.type.startsWith('h') && headingModes[nxtTokAfterHeads.level] === 'span_1col');\n"
    "                    while (!nextIsSpanHeading && targetCol.lastElementChild && isHeadingEl(targetCol.lastElementChild)\n", label='trailing-span-aware')

# 2. הסרת כותרת span יתומה בסוף עמוד: מסירים גם כותרות inline שנשארו בסוף הבלוק שלפניה
rep("                    pageLayout.bodyFlow.removeChild(tailEl);\n                    if (tailId !== null) delete headingPageMap[tailId];\n                    tokenIndex--;\n                    tailEl = pageLayout.bodyFlow.lastElementChild;\n",
    "                    pageLayout.bodyFlow.removeChild(tailEl);\n                    if (tailId !== null) delete headingPageMap[tailId];\n                    tokenIndex--;\n"
    "                    // כותרות inline שנשארו בסוף הבלוק שלפניה (בטור האחרון שיש בו תוכן) — גם הן חוזרות לזרם\n"
    "                    const prevBlk = pageLayout.bodyFlow.lastElementChild;\n"
    "                    if (prevBlk && prevBlk.classList.contains('block-2col')) {\n"
    "                        const colsRev = [prevBlk.querySelector('.left-col'), prevBlk.querySelector('.right-col')];\n"
    "                        const lastCol = colsRev.find(c => c && c.children.length);\n"
    "                        while (lastCol && lastCol.lastElementChild && isHeadingEl(lastCol.lastElementChild) && (lastCol.children.length > 1 || prevBlk.previousElementSibling)) {\n"
    "                            const hh = lastCol.lastElementChild;\n"
    "                            const hhId = hh.getAttribute('data-token-id');\n"
    "                            lastCol.removeChild(hh);\n"
    "                            if (hhId !== null) delete headingPageMap[hhId];\n"
    "                            tokenIndex--;\n"
    "                        }\n"
    "                    }\n"
    "                    tailEl = pageLayout.bodyFlow.lastElementChild;\n", label='tail-chain')
open(path, 'w', encoding='utf-8').write(s)
print('patch9 applied')
