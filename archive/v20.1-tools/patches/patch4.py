import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1, label=''):
    global s
    c = s.count(old); assert c == count, f"[{label}] expected {count}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)

# 1. chooseSplitLines עם מדידה בפועל של הקטעים
a = s.index("// כמה שורות להשאיר בטור הנוכחי (k)")
b = s.index("function balanceColumns(")
new_choose = r'''// כמה שורות להשאיר בטור הנוכחי (k) כך שלא תיווצר שורה בודדת בתחתית הטור
// (אלמנה) או בראש הטור הבא (יתומה), ובלי לחתוך באמצע הערה. מחזירה 0 אם יש
// להעביר את כל הפסקה לטור הבא (אם canPush), אחרת את fit המקורי.
// אורכי הקטעים נמדדים בפועל (חיזוי השורות מהפסקה השלמה עלול לסטות מעטיפת
// השורות האמיתית של הקטע כשהוא עומד לבדו, למשל בלי מילה-ראשונה צפה).
function chooseSplitLines(lines, fit, avoidWidows, avoidOrphans, canPush, ctx) {
    const total = lines.length;
    if (fit <= 0 || fit >= total) return fit;
    const spans = findDelimiterMatches(lines.join(' '), 'body');
    const cutsNote = (k) => {
        if (!spans.length) return false;
        const off = lines.slice(0, k).join(' ').length;
        return spans.some(m => off > m.start && off < m.end);
    };
    const measure = (txt, win) => {
        if (!ctx) return null;
        try { return getLinesFromParagraph(txt, ctx.colWidth, ctx.styleObj, win).lines.length; } catch (e) { return null; }
    };
    const firstN = (k) => { const m = measure(lines.slice(0, k).join(' '), ctx ? ctx.hasWindow : true); return m === null ? k : m; };
    const restN = (k) => { const m = measure(lines.slice(k).join(' '), false); return m === null ? total - k : m; };
    let k = fit;
    for (let guard = 0; guard < total + 5 && k > 0; guard++) {
        if (cutsNote(k)) { k--; continue; }
        const widowBad = avoidWidows && firstN(k) < 2;
        const orphanBad = avoidOrphans && restN(k) < 2;
        if (!widowBad && !orphanBad) return k;
        if (orphanBad && !widowBad) { k--; continue; }
        k = 0; break;
    }
    if (k > 0) return k;
    return canPush ? 0 : fit;
}

'''
s = s[:a] + new_choose + s[b:]

# 2. הקריאה בלולאת המילוי
rep("const kSplit = chooseSplitLines(lines, bestFitLine, avoidWidows, avoidOrphans, canPush);",
    "const kSplit = chooseSplitLines(lines, bestFitLine, avoidWidows, avoidOrphans, canPush, { colWidth, styleObj, hasWindow: !isContinuation });", label='call')

# 3. balanceColumns: איסוף ציונים ואימות המועמד הנבחר
rep("    let bestSplit = pointsToEvaluate[0];\n    let minAbsDiff = Infinity;\n    let bestDiff = Infinity;\n",
    "    let bestSplit = pointsToEvaluate[0];\n    let minAbsDiff = Infinity;\n    let bestDiff = Infinity;\n    const candScores = [];\n", label='cands-init')
rep("        let score = absDiff + heightPenalty;\n\n        if (score < minAbsDiff) {",
    "        let score = absDiff + heightPenalty;\n        candScores.push({ sp, score, diff });\n\n        if (score < minAbsDiff) {", label='cands-push')
rep("            bestSplit = sp;\n            bestDiff = diff;\n        }\n    }\n\n    rCol.innerHTML = '';\n    lCol.innerHTML = '';",
    """            bestSplit = sp;
            bestDiff = diff;
        }
    }

    // אימות בפועל של אורכי הקטעים בחיתוך שבתוך פסקה (חיזוי השורות עלול לסטות
    // מעטיפת השורות האמיתית): בוחרים את המועמד הטוב הבא שאינו יוצר שורה בודדת.
    {
        const validFrag = (sp) => {
            if (!(sp.lineIndex > 0)) return true;
            const it = items[sp.itemIndex];
            const na = getLinesFromParagraph(sp.lines.slice(0, sp.lineIndex).join(' '), colWidth, styleObj, !it.isCont).lines.length;
            const nb = getLinesFromParagraph(sp.lines.slice(sp.lineIndex).join(' '), colWidth, styleObj, false).lines.length;
            return !(avoidWidows && na < 2) && !(avoidOrphans && nb < 2);
        };
        if (!validFrag(bestSplit)) {
            const ordered = candScores.slice().sort((x, y) => (x.score - y.score) || (((x.diff >= 0) ? 0 : 1) - ((y.diff >= 0) ? 0 : 1)));
            const okC = ordered.find(c => validFrag(c.sp));
            if (okC) { bestSplit = okC.sp; bestDiff = okC.diff; }
        }
    }

    rCol.innerHTML = '';
    lCol.innerHTML = '';""", label='validate')
open(path, 'w', encoding='utf-8').write(s)
print('patch4 applied')
