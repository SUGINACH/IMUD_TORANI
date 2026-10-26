import sys, re
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1, label=''):
    global s
    c = s.count(old); assert c == count, f"[{label}] expected {count}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)

# 1. רצפת תקציב-ההערות חלה גם כשיש הערות חדשות בפסקה הנבדקת
rep("                                        cachedAvailH = remPageHeight - (newOnes.length\n"
    "                                            ? measureNoteBlockHeight(",
    "                                        cachedAvailH = remPageHeight - Math.max(blockReserveFloor, (newOnes.length\n"
    "                                            ? measureNoteBlockHeight(", label='floor-in-cache')
rep("                                            : getFootnotesReservedHeight());\n                                    }\n                                }\n\n                                if ((pElem.offsetTop + pElem.offsetHeight) <= cachedAvailH) bestFitLine = i;",
    "                                            : getFootnotesReservedHeight()));\n                                    }\n                                }\n\n                                if ((pElem.offsetTop + pElem.offsetHeight) <= cachedAvailH) bestFitLine = i;", label='floor-in-cache-2')

# 2. מצב "התקדמות מאולצת": משתנה + תקרה לתקציב ההערות
rep("    let blockReserveFloor = 0, blockRedoCount = 0, blockNoBalance = false;",
    "    let blockReserveFloor = 0, blockRedoCount = 0, blockNoBalance = false;\n"
    "    let forceProgress = false, forceReserveCap = Infinity;", label='force-vars')
rep("        if (!footnoteQueueForPage.length) return blockReserveFloor;",
    "        if (!footnoteQueueForPage.length) return Math.min(blockReserveFloor, forceReserveCap);", label='reserve-empty')
rep("        return Math.max(measureNoteBlockHeight(footnoteQueueForPage, colCount) + 24 + headerH, blockReserveFloor);",
    "        return Math.min(Math.max(measureNoteBlockHeight(footnoteQueueForPage, colCount) + 24 + headerH, blockReserveFloor), forceReserveCap);", label='reserve-full')

# 3. זיהוי עמודים שלא מתקדמים (אותה נקודת פתיחה בשני עמודים רצופים) והפעלת מצב מאולץ
rep("            if (prevPageEl) flushFootnotesInto(prevPageEl);\n            blockReserveFloor = 0; blockRedoCount = 0; blockNoBalance = false;\n",
    "            if (prevPageEl) flushFootnotesInto(prevPageEl);\n            blockReserveFloor = 0; blockRedoCount = 0; blockNoBalance = false;\n"
    "            {\n"
    "                const progKey = tokenIndex + ':' + (pendingWordTokens ? pendingWordTokens.token.id + ':' + pendingWordTokens.remainingLines.length : '-');\n"
    "                stuckPages = (progKey === lastPageProgKey) ? stuckPages + 1 : 0;\n"
    "                lastPageProgKey = progKey;\n"
    "                forceProgress = stuckPages >= 1;\n"
    "                forceReserveCap = forceProgress ? (pageLayout && pageLayout.bodyFlow ? (pageLayout.bodyFlow.clientHeight || 870) * 0.4 : 350) : Infinity;\n"
    "            }\n", label='progress-guard')
rep("        let secTokens = sec.tokens.slice();\n        let tokenIndex = 0;",
    "        let secTokens = sec.tokens.slice();\n        let tokenIndex = 0;\n        let lastPageProgKey = '', stuckPages = 0;", label='stuck-vars')

# 4. שורה אחת לפחות בעמוד שלא התקדם (2 הענפים)
old2 = ("                            if (bestFitLine === 0) {\n"
        "                                targetCol.removeChild(pElem);\n"
        "                                if (targetCol.children.length > 0) {")
rep(old2, "                            if (bestFitLine === 0 && forceProgress && !Array.from(pageLayout.bodyFlow.querySelectorAll('p')).some(x => x !== pElem)) {\n"
          "                                bestFitLine = 1;   // התקדמות מאולצת: שורה אחת לפחות, גם אם חורגת\n"
          "                            } else if (bestFitLine === 0) {\n"
          "                                targetCol.removeChild(pElem);\n"
          "                                if (targetCol.children.length > 0) {", label='force-2col')
old0 = ("                        if (bestFitLine === 0) {\n"
        "                            targetCol.removeChild(pElem);\n"
        "                            if (targetCol.children.length > 0) {")
rep(old0, "                        if (bestFitLine === 0 && forceProgress && !Array.from(pageLayout.bodyFlow.querySelectorAll('p')).some(x => x !== pElem)) {\n"
          "                            bestFitLine = 1;   // התקדמות מאולצת: שורה אחת לפחות, גם אם חורגת\n"
          "                        } else if (bestFitLine === 0) {\n"
          "                            targetCol.removeChild(pElem);\n"
          "                            if (targetCol.children.length > 0) {", label='force-h0')
open(path, 'w', encoding='utf-8').write(s)
print('patch15 applied')
