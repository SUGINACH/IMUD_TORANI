import sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1, label=''):
    global s
    c = s.count(old); assert c == count, f"[{label}] expected {count}, found {c}: {old[:70]!r}"
    s = s.replace(old, new)

# 1. probe helper (module level), before chooseSplitLines
anchor = "// כמה שורות להשאיר בטור הנוכחי (k)"
probe = r'''// מדידת מספר השורות בפועל של פסקה בתוך הטור האמיתי (אותו CSS, אותו רוחב, אותו מבנה
// DOM כמו ברינדור הסופי) — מדויקת יותר מתיבת המדידה, שבה עטיפה ב-span-ים נותנת
// לעיתים תוצאה שונה במקרי גבול (שבר-פיקסל).
function probeParagraphLines(col, html, cls) {
    const p = document.createElement('p');
    p.className = cls || 'p-end';
    p.style.cssText = 'position:absolute; visibility:hidden; left:0; right:0; top:0; margin:0;';
    p.innerHTML = html;
    try { applyDelimiterStyles(p, 'body', getBodySizePt(), true); } catch (e) { /* ignore */ }
    col.appendChild(p);
    const h = p.offsetHeight;
    const lh = parseFloat(getComputedStyle(p).lineHeight) || 20;
    col.removeChild(p);
    return Math.max(1, Math.round(h / lh));
}

'''
rep(anchor, probe + anchor, label='probe-helper')

# 2. chooseSplitLines: שימוש ב-ctx.first / ctx.rest
rep("""    const measure = (txt, win) => {
        if (!ctx) return null;
        try { return getLinesFromParagraph(txt, ctx.colWidth, ctx.styleObj, win).lines.length; } catch (e) { return null; }
    };
    const firstN = (k) => { const m = measure(lines.slice(0, k).join(' '), ctx ? ctx.hasWindow : true); return m === null ? k : m; };
    const restN = (k) => { const m = measure(lines.slice(k).join(' '), false); return m === null ? total - k : m; };""",
"""    const firstN = (k) => (ctx && ctx.first) ? ctx.first(lines.slice(0, k).join(' ')) : k;
    const restN = (k) => (ctx && ctx.rest) ? ctx.rest(lines.slice(k).join(' ')) : (total - k);""", label='choose-ctx')

# 3. נקודת הקריאה בלולאת המילוי
rep("const kSplit = chooseSplitLines(lines, bestFitLine, avoidWidows, avoidOrphans, canPush, { colWidth, styleObj, hasWindow: !isContinuation });",
    """const nextColEl = colName === 'right' ? lCol : rCol;
                                    const kSplit = chooseSplitLines(lines, bestFitLine, avoidWidows, avoidOrphans, canPush, {
                                        first: (txt) => probeParagraphLines(targetCol, createDropWord(txt, isContinuation, !hasWindow, lines.length), 'p-cut'),
                                        rest: (txt) => probeParagraphLines(nextColEl, createDropWord(txt, true, true, lines.length), 'p-end')
                                    });""", label='call')

# 4. balanceColumns: אימות עם probe
rep("""            const na = getLinesFromParagraph(sp.lines.slice(0, sp.lineIndex).join(' '), colWidth, styleObj, !it.isCont).lines.length;
            const nb = getLinesFromParagraph(sp.lines.slice(sp.lineIndex).join(' '), colWidth, styleObj, false).lines.length;""",
"""            const na = probeParagraphLines(rCol, createDropWord(sp.lines.slice(0, sp.lineIndex).join(' '), !!it.isCont, !it.hasWindow, sp.lines.length), 'p-cut');
            const nb = probeParagraphLines(lCol, createDropWord(sp.lines.slice(sp.lineIndex).join(' '), true, true, sp.lines.length), 'p-end');""", label='bal-probe')
open(path, 'w', encoding='utf-8').write(s)
print('patch5 applied')
