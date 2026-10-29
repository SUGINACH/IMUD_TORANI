import re, sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1, label=''):
    global s
    c = s.count(old)
    assert c == count, f"[{label}] expected {count}, found {c}: {old[:80]!r}"
    s = s.replace(old, new)

# (a) רצפת תקציב הערות לבלוק + החזרת הפונקציה
rep("    function getFootnotesReservedHeight() {\n        if (!footnoteQueueForPage.length) return 0;",
    "    let blockReserveFloor = 0, blockRedoCount = 0, blockNoBalance = false;\n"
    "    function getFootnotesReservedHeight() {\n        if (!footnoteQueueForPage.length) return blockReserveFloor;", label='fnreserve-head')
rep("        return measureNoteBlockHeight(footnoteQueueForPage, colCount) + 24 + headerH;\n    }",
    "        return Math.max(measureNoteBlockHeight(footnoteQueueForPage, colCount) + 24 + headerH, blockReserveFloor);\n    }", label='fnreserve-tail')

# (b) איפוס בתחילת כל עמוד
rep("            if (prevPageEl) flushFootnotesInto(prevPageEl);",
    "            if (prevPageEl) flushFootnotesInto(prevPageEl);\n            blockReserveFloor = 0; blockRedoCount = 0; blockNoBalance = false;", label='page-reset')

# (c) מצב תחילת בלוק (לצורך החזרה לאחור)
rep("                const block2Col = document.createElement('div');",
    "                const blockStartState = {\n"
    "                    tokenIndex,\n"
    "                    pendingWordTokens: pendingWordTokens ? Object.assign({}, pendingWordTokens) : null,\n"
    "                    pendingNotesLen: pagePendingNotes.length,\n"
    "                    h3: currentH3Title, h4: currentH4Title,\n"
    "                    headingKeys: new Set(Object.keys(headingPageMap))\n"
    "                };\n"
    "                const block2Col = document.createElement('div');", label='block-start')

# (d) החלטת חיתוך פסקה (יתומה/אלמנה/הערות) — בענף שני הטורים (המופע האחרון)
i = s.rfind("const remainingAfterSplit")
a = s.rfind("const avoidOrphans", 0, i)
endmark = "if (bestFitLine > 0) pageHasContent = true;"
b = s.find(endmark, i) + len(endmark)
ind = ' ' * 28
new_split = (
 ind + "const avoidOrphans = document.getElementById('avoid-orphans')?.checked ?? true;\n" +
 ind + "const avoidWidows = document.getElementById('avoid-widows')?.checked ?? true;\n" +
 ind + "if (bestFitLine > 0 && bestFitLine < lines.length) {\n" +
 ind + "    const canPush = pageHasContent || (colName === 'left' && rCol.children.length > 0);\n" +
 ind + "    const kSplit = chooseSplitLines(lines, bestFitLine, avoidWidows, avoidOrphans, canPush);\n" +
 ind + "    if (kSplit === 0) {\n" +
 ind + "        targetCol.removeChild(pElem);\n" +
 ind + "        break;\n" +
 ind + "    }\n" +
 ind + "    bestFitLine = kSplit;\n" +
 ind + "}\n" +
 ind + "if (bestFitLine > 0) pageHasContent = true;")
s = s[:a] + new_split.lstrip(' ') + s[b:]
# (שמרנו על ההזחה של השורה הראשונה כי a מצביע על תחילת 'const avoidOrphans' אחרי ההזחה המקורית)

# (e) הסרת כותרות שנשארו בסוף טור
rep("                    }\n                });\n\n                if (rCol.children.length === 0 && lCol.children.length === 0) {",
    "                    }\n\n"
    "                    // שמירת כותרת עם הטקסט שאחריה: טור לא מסתיים בכותרת. כותרות שנשארו בסוף\n"
    "                    // הטור חוזרות לזרם ויוצבו בראש הטור הבא / בעמוד הבא יחד עם הפסקה שלהן.\n"
    "                    while (targetCol.lastElementChild && isHeadingEl(targetCol.lastElementChild)\n"
    "                           && (targetCol.children.length > 1 || colName === 'left')) {\n"
    "                        const hLast = targetCol.lastElementChild;\n"
    "                        const hLastId = hLast.getAttribute('data-token-id');\n"
    "                        targetCol.removeChild(hLast);\n"
    "                        if (hLastId !== null && !blockStartState.headingKeys.has(hLastId)) delete headingPageMap[hLastId];\n"
    "                        tokenIndex--;\n"
    "                    }\n"
    "                });\n\n"
    "                if (rCol.children.length === 0 && lCol.children.length === 0) {", label='trailing-headings')

# (f) שרשרת סוף-בלוק
a = s.index("                const actualAvailH = remPageHeight - getFootnotesReservedHeight();")
b = s.index("                remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);")
old_chain = s[a:b]
print("old chain length:", len(old_chain))
# שמירת קוד המפריד-סוף-פרק המקורי
m = re.search(r"const divHTML = getSectionDividerHTML\(secDivStyle\);.*?\n(\s*)break;", old_chain, re.S)
assert m, "divider code not found in chain"
div_code = m.group(0)
print("divider code:\n", div_code)
new_chain = '''                // ===== בדיקת התאמה סופית — אחרי שכל ההערות של הבלוק (גם מהטור השמאלי) כבר ידועות =====
                const sectionEnded = tokenIndex >= secTokens.length && !pendingWordTokens;
                const nextPeekTok0 = pendingWordTokens ? pendingWordTokens.token : secTokens[tokenIndex];
                const nextPeekMode0 = nextPeekTok0 && nextPeekTok0.type.startsWith('h') ? headingModes[nextPeekTok0.level] : 'inline_2col';
                const nextIsSpan = !sectionEnded && nextPeekMode0 === 'span_1col' && !pendingWordTokens;
                const lineH0 = parseFloat(getComputedStyle(rCol).lineHeight) || 20;
                const willBalance = (sectionEnded || nextIsSpan) && !blockNoBalance;
                const bottomNow = () => Math.max(colContentBottom(rCol), colContentBottom(lCol));

                const rollbackBlock = () => {
                    if (blockNoteSnapshot) {
                        footnoteQueueForPage.length = blockNoteSnapshot.footnoteQueueLen;
                        endnoteQueueForPart.length = blockNoteSnapshot.endnoteQueueLen;
                        noteCounters.footnote = blockNoteSnapshot.footnoteCounter;
                        noteCounters.endnote = blockNoteSnapshot.endnoteCounter;
                        noteUidCounter = blockNoteSnapshot.noteUid;
                    }
                    if (block2Col.parentNode) block2Col.parentNode.removeChild(block2Col);
                    tokenIndex = blockStartState.tokenIndex;
                    pendingWordTokens = blockStartState.pendingWordTokens ? Object.assign({}, blockStartState.pendingWordTokens) : null;
                    pagePendingNotes.length = blockStartState.pendingNotesLen;
                    currentH3Title = blockStartState.h3;
                    currentH4Title = blockStartState.h4;
                    Object.keys(headingPageMap).forEach(k => { if (!blockStartState.headingKeys.has(k)) delete headingPageMap[k]; });
                };

                let actualAvailH = remPageHeight - getFootnotesReservedHeight();

                // גלישה: הערות שנוספו בטור השמאלי הגדילו את התקציב השמור אחרי שהטור הימני כבר מולא.
                // מחזירים את הבלוק לתחילתו ומנסים שוב עם רצפת תקציב-הערות מעודכנת.
                const ovFill = bottomNow() - actualAvailH;
                if (ovFill > 0.5 && blockRedoCount < 6) {
                    blockReserveFloor = Math.max(blockReserveFloor, getFootnotesReservedHeight()) + (blockRedoCount > 0 ? ovFill + 1 : 0);
                    blockRedoCount++;
                    rollbackBlock();
                    continue;
                }

                if (willBalance) {
                    balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, false);
                    actualAvailH = remPageHeight - getFootnotesReservedHeight();
                    const ovBal = bottomNow() - actualAvailH;
                    if (ovBal > 0.5 && blockRedoCount < 6) {
                        blockNoBalance = true;
                        blockReserveFloor = Math.max(blockReserveFloor, getFootnotesReservedHeight());
                        blockRedoCount++;
                        rollbackBlock();
                        continue;
                    }
                    alignBlockColumns(rCol, lCol, lineH0);
                } else {
                    const al = alignBlockColumns(rCol, lCol, lineH0);
                    if (!al.ok) {
                        balanceColumns(block2Col, colWidth, styleObj, blockNoteSnapshot, actualAvailH, !!pendingWordTokens);
                        alignBlockColumns(rCol, lCol, lineH0);
                    }
                }

                blockReserveFloor = 0; blockRedoCount = 0; blockNoBalance = false;

                if (sectionEnded) {
                    ''' + div_code + '''
                }

'''
s = s[:a] + new_chain + s[b:]

# (g) כותרת span בסוף עמוד בלי טקסט אחריה
rep("                remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);\n"
    "                finalizeNotePositions(pagePendingNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));\n            }\n",
    "                remPageHeight -= Math.max(rCol.scrollHeight, lCol.scrollHeight);\n"
    "                finalizeNotePositions(pagePendingNotes, Math.max(rCol.scrollHeight, lCol.scrollHeight));\n            }\n\n"
    "            // כותרת span שנשארה בסוף העמוד בלי טקסט אחריה — חוזרת לזרם ותוצב בעמוד הבא\n"
    "            {\n"
    "                let tailEl = pageLayout.bodyFlow.lastElementChild;\n"
    "                while (tailEl && tailEl.classList.contains('block-h3-span') && tailEl.previousElementSibling) {\n"
    "                    const tailTok = tailEl.querySelector('[data-token-id]');\n"
    "                    const tailId = tailTok ? tailTok.getAttribute('data-token-id') : null;\n"
    "                    pageLayout.bodyFlow.removeChild(tailEl);\n"
    "                    if (tailId !== null) delete headingPageMap[tailId];\n"
    "                    tokenIndex--;\n"
    "                    tailEl = pageLayout.bodyFlow.lastElementChild;\n"
    "                }\n"
    "            }\n", label='span-tail')

# (h) קו מפריד
rep("const minH = Math.min(rCol.scrollHeight, lCol.scrollHeight);", "const minH = Math.min(colContentBottom(rCol), colContentBottom(lCol));", label='divider')

open(path, 'w', encoding='utf-8').write(s)
print("patch2 applied")
