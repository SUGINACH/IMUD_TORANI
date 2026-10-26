import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1, label=''):
    global s
    c = s.count(old); assert c == count, f"[{label}] expected {count}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)

# 1. החזרת ההתנהגות המקורית: הערה שנכתבה בשורה נפרדת ("[...]") מוצמדת לשורה שלפניה — תכונה מכוונת
rep("// רק רווחים אופקיים (לא מעברי שורה!): אחרת שורה שמתחילה בסימן הערה מודבקת לשורה הקודמת\n"
    "        rawText = rawText.replace(new RegExp('[ \\\\t\\\\u00A0]+(' + escO + ')', 'g'), '$1');",
    "// הערה שנכתבה (גם בשורה נפרדת) לפני סימן הפתיחה מוצמדת למילה שלפניה — תכונה מכוונת של המנוע:\n"
    "        // כך אפשר לכתוב הערה בשורה משלה מתחת לפסקה שאליה היא שייכת.\n"
    "        rawText = rawText.replace(new RegExp('\\\\s+(' + escO + ')', 'g'), '$1');", label='revert12')

# 2. מדידה: אין חלון מילה-ראשונה כשבמילים הראשונות יש סימן פתיחת הערה (כדי לא לפצל הערה בין אלמנטי DOM)
rep("    const shouldApplyWindow = useWindowIfMultipleLines && (numLinesEstimated >= minLines) && (mode === 'window');",
    "    const wcTmp = parseInt(document.getElementById('drop-word-count')?.value, 10) || 1;\n"
    "    const firstWordsHaveNote = !!(fnOpen && words.slice(0, Math.min(wcTmp, words.length)).some(w => w.includes(fnOpen)));\n"
    "    const shouldApplyWindow = useWindowIfMultipleLines && (numLinesEstimated >= minLines) && (mode === 'window') && !firstWordsHaveNote;", label='measure-guard')

# 3. רינדור: אותו כלל ב-createDropWord (בלי span סביב מילה שמכילה פתיחת הערה)
rep("    const words = text.split(/\\s+/);\n    if (words.length === 0) return '';\n    const dropWords = words.slice(0, Math.min(wordCount, words.length)).join(' ');",
    "    const words = text.split(/\\s+/);\n    if (words.length === 0) return '';\n"
    "    const fnOpenD = document.getElementById('fn-delim-open')?.value?.trim() || '[';\n"
    "    // מילה ראשונה שמכילה פתיחת הערה: לא עוטפים ב-span (אחרת ההערה מפוצלת בין אלמנטי DOM ולא תזוהה)\n"
    "    if (fnOpenD && words.slice(0, Math.min(wordCount, words.length)).some(w => w.includes(fnOpenD))) return applyDibburHamatchil(text);\n"
    "    const dropWords = words.slice(0, Math.min(wordCount, words.length)).join(' ');", label='createDropWord-guard')
open(path, 'w', encoding='utf-8').write(s)
print('patch13 applied')
