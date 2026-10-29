import re, sys
path = sys.argv[1]
s = open(path, encoding='utf-8').read()

def rep(old, new, count=1, label=''):
    global s
    c = s.count(old)
    assert c == count, f"[{label}] expected {count} occurrence(s), found {c}: {old[:70]!r}"
    s = s.replace(old, new)

# ---------- 1. helpers (module level) before balanceColumns ----------
helpers = r'''
/* ============================================================
   מדידה ויישור תחתיות טורים — ביחידות layout (בלתי תלוי בזום התצוגה),
   וקביעת נקודת חיתוך פסקה לפי כללי יתומה/אלמנה/הערות
   ============================================================ */
function colContentBottom(col) {
    const last = col.lastElementChild;
    if (!last) return 0;
    const cr = col.getBoundingClientRect();
    const lr = last.getBoundingClientRect();
    const scale = (col.offsetWidth && cr.width) ? (cr.width / col.offsetWidth) : 1;
    return (lr.bottom - cr.top) / (scale || 1);
}

function isHeadingEl(el) {
    return !!el && el.tagName !== 'P' && /title-level|heading/.test(el.className || '');
}

// מותח טור כך שתחתית תוכנו תגיע ל-targetBottom: מוסיף ריווח בין פסקאות
// (לא בין כותרת לפסקה שאחריה); אם אין בין מי — מותח ריווח שורות בפסקה בודדת.
function stretchColumnTo(col, targetBottom) {
    for (let pass = 0; pass < 3; pass++) {
        const diff = targetBottom - colContentBottom(col);
        if (diff <= 0.2) return;
        const kids = Array.from(col.children);
        const gapIdx = [];
        for (let i = 0; i < kids.length - 1; i++) if (!isHeadingEl(kids[i])) gapIdx.push(i);
        if (gapIdx.length) {
            const extra = diff / gapIdx.length;
            gapIdx.forEach(i => {
                const mb = parseFloat(getComputedStyle(kids[i]).marginBottom) || 0;
                kids[i].style.marginBottom = (mb + extra) + 'px';
            });
        } else {
            const p = kids.find(k => k.tagName === 'P');
            if (!p) return;
            const lh = parseFloat(getComputedStyle(p).lineHeight) || 20;
            const n = Math.max(1, Math.round(p.offsetHeight / lh));
            p.style.lineHeight = (lh + diff / n) + 'px';
        }
    }
}

// מיישר את תחתיות שני הטורים לאותו גובה (הטור הקצר מקבל רווחים גדולים יותר).
// מחזיר ok=false אם ההפרש גדול מדי מכדי להסתיר ברווחי-פסקאות.
function alignBlockColumns(rCol, lCol, lineH) {
    if (!rCol.children.length || !lCol.children.length) return { ok: true, diff: 0 };
    const rB = colContentBottom(rCol), lB = colContentBottom(lCol);
    const diff = rB - lB;
    if (Math.abs(diff) <= 0.2) return { ok: true, diff };
    const shorter = diff > 0 ? lCol : rCol;
    const kids = Array.from(shorter.children);
    const gaps = kids.slice(0, -1).filter(k => !isHeadingEl(k)).length;
    const allowed = Math.max(lineH * 1.5, gaps * lineH * 1.1);
    if (Math.abs(diff) > allowed) return { ok: false, diff };
    stretchColumnTo(shorter, Math.max(rB, lB));
    return { ok: true, diff };
}

// כמה שורות להשאיר בטור הנוכחי (k) כך שלא תיווצר שורה בודדת בתחתית הטור
// (אלמנה) או בראש הטור הבא (יתומה), ובלי לחתוך באמצע הערה. מחזירה 0 אם יש
// להעביר את כל הפסקה לטור הבא (אם canPush), אחרת את fit המקורי.
function chooseSplitLines(lines, fit, avoidWidows, avoidOrphans, canPush) {
    const total = lines.length;
    if (fit <= 0 || fit >= total) return fit;
    const spans = findDelimiterMatches(lines.join(' '), 'body');
    const cutsNote = (k) => {
        if (!spans.length) return false;
        const off = lines.slice(0, k).join(' ').length;
        return spans.some(m => off > m.start && off < m.end);
    };
    let k = fit;
    for (let guard = 0; guard < total + 5 && k > 0; guard++) {
        if (cutsNote(k)) { k--; continue; }
        const widowBad = avoidWidows && k < 2;
        const orphanBad = avoidOrphans && (total - k) < 2;
        if (!widowBad && !orphanBad) return k;
        if (orphanBad && !widowBad) { k--; continue; }
        k = 0; break;
    }
    if (k > 0) return k;
    return canPush ? 0 : fit;
}

'''
anchor = "function balanceColumns(block, colWidth, styleObj, snapshot, availableHeight = Infinity) {"
rep(anchor, helpers + "function balanceColumns(block, colWidth, styleObj, snapshot, availableHeight = Infinity, lastItemContinues = false) {", label='sig')

# ---------- 2. balanceColumns: מדידות עקביות, p-cut לשבר שממשיך, יישור סופי ----------
# 2a: מדידת גבהים בשלב הניסוי
n_r = s.count("rHeight = rCol.scrollHeight")
print("rHeight occurrences:", n_r)
s = s.replace("rHeight = rCol.scrollHeight", "rHeight = colContentBottom(rCol)")
s = s.replace("lHeight = lCol.scrollHeight", "lHeight = colContentBottom(lCol)")

# 2b: סיום — החלפת בלוק היישור הישן
old_tail = re.search(r"\n(\s*)let finalDiff = rCol\.scrollHeight - lCol\.scrollHeight;.*?\n(\s*)finalizeNotePositions\(finalNotes", s, re.S)
assert old_tail, "tail of balanceColumns not found"
print("balanceColumns tail found, length", len(old_tail.group(0)))
indent = old_tail.group(1)
new_tail = ("\n" + indent + "if (lastItemContinues) {\n" +
            indent + "    const lastColEl = lCol.children.length ? lCol : rCol;\n" +
            indent + "    const lastEl = lastColEl.lastElementChild;\n" +
            indent + "    if (lastEl && lastEl.tagName === 'P') lastEl.className = 'p-cut';\n" +
            indent + "}\n" +
            indent + "alignBlockColumns(rCol, lCol, parseFloat(getComputedStyle(rCol).lineHeight) || 20);\n" +
            old_tail.group(2) + "finalizeNotePositions(finalNotes")
s = s[:old_tail.start()] + new_tail + s[old_tail.end():]

open(path, 'w', encoding='utf-8').write(s)
print("patch1 applied")
