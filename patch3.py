import re, sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
a = s.index("// מיישר את תחתיות שני הטורים לאותו גובה")
b = s.index("// כמה שורות להשאיר בטור הנוכחי (k)")
new = r'''// מיישר את תחתיות שני הטורים לאותו גובה. עדיפות ראשונה: הגדלת הרווח בין פסקאות
// בטור הקצר. אם זה לא מספיק (למשל טור עם 2-3 פסקאות בלבד) — מגדילים בעדינות גם
// את ריווח השורות בטור הקצר (עד ~10%). ok=false רק אם ההפרש עדיין גדול מדי.
function alignBlockColumns(rCol, lCol, lineH) {
    if (!rCol.children.length || !lCol.children.length) return { ok: true, diff: 0 };
    const rB = colContentBottom(rCol), lB = colContentBottom(lCol);
    const diff = rB - lB;
    if (Math.abs(diff) <= 0.2) return { ok: true, diff };
    const shorter = diff > 0 ? lCol : rCol;
    const target = Math.max(rB, lB);
    const kids = Array.from(shorter.children);
    const gaps = kids.slice(0, -1).filter(k => !isHeadingEl(k)).length;
    const spacingMax = gaps * lineH * 1.3;
    const need = Math.abs(diff);
    if (gaps && need <= spacingMax) {
        stretchColumnTo(shorter, target);
        return { ok: Math.abs(colContentBottom(rCol) - colContentBottom(lCol)) <= 0.6, diff };
    }
    if (gaps) stretchColumnTo(shorter, colContentBottom(shorter) + spacingMax);
    // שלב ב': ריווח שורות בפסקאות הטור הקצר
    for (let pass = 0; pass < 3; pass++) {
        const remain = target - colContentBottom(shorter);
        if (remain <= 0.2) break;
        const paras = Array.from(shorter.children).filter(k => k.tagName === 'P');
        const totalH = paras.reduce((acc, p) => acc + p.offsetHeight, 0);
        if (!paras.length || remain > totalH * 0.10) return { ok: false, diff };
        const factor = 1 + remain / totalH;
        paras.forEach(p => {
            const lh = parseFloat(getComputedStyle(p).lineHeight) || lineH;
            p.style.lineHeight = (lh * factor) + 'px';
        });
    }
    return { ok: Math.abs(colContentBottom(rCol) - colContentBottom(lCol)) <= 0.6, diff };
}

'''
s = s[:a] + new + s[b:]
open(path, 'w', encoding='utf-8').write(s)
print('patch3 applied')
