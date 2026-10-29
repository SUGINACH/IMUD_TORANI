import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1, label=''):
    global s
    c = s.count(old); assert c == count, f"[{label}] expected {count}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)

# הערה צמודה למילה ("מילה[הערה]") מוצגת ברינדור האמיתי כסימון קטן — גם במדידה
rep("    const words = safeText.split(/\\s+/);\n    if (words.length === 0) {\n        return { lines: [], hasWindow: false, numLines: 0 };\n    }\n",
    "    const words = safeText.split(/\\s+/);\n    if (words.length === 0) {\n        return { lines: [], hasWindow: false, numLines: 0 };\n    }\n\n"
    "    // תצוגת מילה במדידה: כל הערה (גם צמודה למילה) מוחלפת בסימון בגודל סימון-ההערה האמיתי\n"
    "    const escOm = (fnOpen || '[').replace(/[-/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&');\n"
    "    const escCm = (fnClose || ']').replace(/[-/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&');\n"
    "    const noteInWordRe = new RegExp(escOm + '[\\\\s\\\\S]*?' + escCm, 'g');\n"
    "    const displayOf = (w) => {\n"
    "        if (fnOpen && fnClose && w.startsWith(fnOpen) && w.endsWith(fnClose)) return ' א ';\n"
    "        return w.replace(noteInWordRe, 'א').replace(/\\uE000/g, ' ');\n"
    "    };\n", label='displayOf')
rep("    pMeasure.textContent = text;\n    measureContainer.appendChild(pMeasure);",
    "    pMeasure.textContent = text.replace(new RegExp(escOm + '[\\\\s\\\\S]*?' + escCm, 'g'), 'א');\n    measureContainer.appendChild(pMeasure);", label='numLinesEstimated')
rep("    const dropWords = words.slice(0, Math.min(wordCount, words.length)).join(' ').replace(/\\uE000/g, ' ');",
    "    const dropWords = words.slice(0, Math.min(wordCount, words.length)).map(displayOf).join(' ');", label='dropWords')
rep("            const isNote = w.startsWith(fnOpen) && w.endsWith(fnClose);\n            const displayW = isNote ? ' א ' : w.replace(/\\uE000/g, ' ');",
    "            const displayW = displayOf(w);", count=2, label='displayW')
open(path, 'w', encoding='utf-8').write(s)
print('patch10 applied')
