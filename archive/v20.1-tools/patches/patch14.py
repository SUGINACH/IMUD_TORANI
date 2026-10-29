import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
old = "pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow, lines.length);"
assert s.count(old) == 2, s.count(old)
new = old + "\n"
# שתי ההזחות שונות; נשתמש בהחלפה לפי מופע עם שמירת הזחה
import re
def sub(m):
    ind = m.group(1)
    return (f"{ind}pElem.innerHTML = createDropWord(testText, isContinuation, !hasWindow, lines.length);\n"
            f"{ind}// כמו ברינדור הסופי: הערות מוצגות כסימון קטן (ולא כטקסט ההערה המלא) — אחרת הגובה המדוד מנופח\n"
            f"{ind}// וההערה נספרת פעמיים (גם בגוף וגם בתקציב ההערות), והעמוד נחתך מוקדם מדי\n"
            f"{ind}applyDelimiterStyles(pElem, 'body', getBodySizePt(), true);")
s, n = re.subn(r"^([ \t]*)pElem\.innerHTML = createDropWord\(testText, isContinuation, !hasWindow, lines\.length\);", sub, s, flags=re.M)
assert n == 2, n
open(path, 'w', encoding='utf-8').write(s)
print('patch14 applied', n)
