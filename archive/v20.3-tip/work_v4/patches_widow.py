# ---------- P5: מנגנון אחיד ליתומות/אלמנות (שורות וכותרות), מיושם בכל שלב ----------

# P5a: אי-חיתוך הערה — אפשרות לדחות את כל הפסקה במקום להרחיב מעבר למקום הפנוי
ts = rep(ts, "function adjustFitLineForNoteSpans(lines, bestFitLine) {",
         "function adjustFitLineForNoteSpans(lines, bestFitLine, canDefer = false) {", 'P5a sig')
ts = rep(ts, "    for (let fit = bestFitLine + 1; fit <= lines.length; fit++) {",
         "    // אין נקודת-חיתוך שלא חותכת הערה בתוך המקום הפנוי: אם מותר — דוחים את כל\n"
         "    // הפסקה (0); אחרת (עמוד ריק, חייבים להתקדם) מרחיבים עד שההערה נשלמת.\n"
         "    if (canDefer) return 0;\n"
         "    for (let fit = bestFitLine + 1; fit <= lines.length; fit++) {", 'P5a defer')

# P5b: פונקציות עזר
ts = rep(ts, "    let hasOpenPart = false;", """    // כותרת שנשארה "תלויה" בסוף טור (בלי שורת טקסט שמלווה אותה) מוסרת מהטור
    // ומוחזרת לזרם הטוקנים; מנקה גם את מספר-העמוד הישן שלה לתוכן העניינים
    // (אחרת הכותרת תופיע בתוכן העניינים בעמוד שהיא כבר לא נמצאת בו).
    function releaseTrailingHeadings(col) {
        let released = 0;
        let last = col.lastElementChild;
        while (last && last.className && String(last.className).startsWith('title-level-')) {
            const tid = last.getAttribute('data-token-id');
            if (tid !== null) delete headingPageMap[tid];
            col.removeChild(last);
            released++;
            last = col.lastElementChild;
        }
        return released;
    }

    // מחשבת את מספר השורות הסופי ב"חלק הראשון" של פסקה שנחתכת בין טורים/עמודים.
    // שלושת הכללים — אלמנה (שורה בודדת בתחתית), יתומה (שורה בודדת בראש) ואי-חיתוך
    // הערת-שוליים — תלויים זה בזה (כל תיקון עלול ליצור הפרה של אחר), ולכן מיושמים
    // שוב ושוב עד התייצבות. מחזירה 0 כשצריך לדחות את כל הפסקה.
    function finalizeChunkLines(lines, fitIn, canDefer, avoidOrphans, avoidWidows, probeRemainder) {
        let fit = fitIn;
        for (let guard = 0; guard < 12; guard++) {
            const prev = fit;
            if (fit > 0 && fit < lines.length) {
                // שארית: הקטן מבין מספר-השורות הצפוי לבין מספר השורות שיתקבל ברינדור אמיתי
                // (הדפדפן לעיתים מכניס יותר מילים בשורה ממה שהמדידה חזתה, ושארית של
                // "שתי שורות צפויות" מתרנדרת בפועל כשורה אחת בודדת = אלמנה).
                let remaining = lines.length - fit;
                if (avoidOrphans && probeRemainder && remaining >= 1 && remaining <= 3) {
                    remaining = Math.min(remaining, probeRemainder(lines.slice(fit).join(' ')));
                }
                if (avoidWidows && fit === 1) {
                    if (canDefer) return 0;
                } else if (avoidOrphans && remaining === 1) {
                    if (fit > 1) fit -= 1;
                    else if (canDefer) return 0;
                }
            }
            if (fit > 0 && fit < lines.length) {
                const adj = adjustFitLineForNoteSpans(lines, fit, canDefer);
                if (adj === 0) return 0;
                fit = adj;
            }
            if (fit === prev) break;
        }
        return fit;
    }

    // סופרת כמה שורות אמיתיות תופס אלמנט טקסט (לפי מלבני-הטקסט שהדפדפן מצייר).
    function countRenderedLines(el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = Array.from(range.getClientRects()).filter(r => r.width > 1 && r.height > 1);
        const lh = parseFloat(getComputedStyle(el).lineHeight) || 16;
        const tops = [];
        rects.forEach(r => {
            const mid = r.top + r.height / 2;
            if (!tops.some(t => Math.abs(t - mid) < lh * 0.45)) tops.push(mid);
        });
        return tops.length;
    }

    function bodyLineHeightPx() {
        const f = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--line-height-body')) || 1.34;
        return getBodySizePt() * (96 / 72) * f;
    }

    let hasOpenPart = false;""", 'P5b helpers')

# P5c: דגל "יש טקסט בעמוד" ברמת עמוד (ולא ברמת בלוק)
ts = rep(ts, "            let pagePendingNotes = [];",
         "            let pagePendingNotes = [];\n            let pageHasText = false;", 'P5c pageHasText decl')
ts = rep(ts, "                let pageHasContent = false;\n\n                ['right', 'left'].forEach((colName) => {",
         "                let pageHasContent = pageHasText;\n\n                ['right', 'left'].forEach((colName) => {", 'P5d pageHasContent init')

# P5e: בלוק הפסקה — מחליפים בחיתוך תוכנתי בין סמנים
start_marker = "                            if (bestFitLine === 0) {\n                                targetCol.removeChild(pElem);"
end_marker = "                            if (bestFitLine > 0) pageHasContent = true;"
si = ts.index(start_marker)
assert ts.count(start_marker) == 1, 'P5e start marker not unique'
ei = ts.index(end_marker, si) + len(end_marker)
old_block = ts[si:ei]
assert 'adjustFitLineForNoteSpans(lines, bestFitLine)' in old_block and 'avoidWidows' in old_block, 'P5e wrong block'
new_block = """                            if (bestFitLine === 0) {
                                targetCol.removeChild(pElem);
                                if (targetCol.children.length > 0) {
                                    tokenIndex -= releaseTrailingHeadings(targetCol);
                                    break;
                                } else {
                                    if (!pageHasContent) bestFitLine = 1;
                                    else break;
                                }
                            }

                            // יתומות/אלמנות + אי-חיתוך הערות: מיושמים יחד ובלולאה עד התייצבות.
                            // אם נדרש לדחות את כל הפסקה — היא וכל הכותרות התלויות שלפניה עוברות הלאה.
                            const avoidOrphans = document.getElementById('avoid-orphans')?.checked ?? true;
                            const avoidWidows = document.getElementById('avoid-widows')?.checked ?? true;
                            if (bestFitLine > 0) {
                                const probeRemainder = (text) => {
                                    const probe = document.createElement('p');
                                    probe.className = 'p-end';
                                    probe.innerHTML = createDropWord(text, true, true);
                                    applyDelimiterStyles(probe, 'body', getBodySizePt(), true);
                                    targetCol.appendChild(probe);
                                    const n = countRenderedLines(probe);
                                    targetCol.removeChild(probe);
                                    return n;
                                };
                                bestFitLine = finalizeChunkLines(lines, bestFitLine, pageHasContent, avoidOrphans, avoidWidows, probeRemainder);
                                if (bestFitLine === 0) {
                                    targetCol.removeChild(pElem);
                                    tokenIndex -= releaseTrailingHeadings(targetCol);
                                    break;
                                }
                            }
                            if (bestFitLine > 0) { pageHasContent = true; pageHasText = true; }"""
ts = ts[:si] + new_block + ts[ei:]

# P5f: שחרור כותרות תלויות בסוף כל טור (בכל סיבת סיום של הלולאה)
ts = rep(ts, """                                break;
                            }
                        }
                    }
                });

                if (rCol.children.length === 0 && lCol.children.length === 0) {""", """                                break;
                            }
                        }
                    }

                    // כותרת שנשארה תלויה בסוף הטור (נתיבי יציאה שונים — "טור מלא", דחיית
                    // פסקה, כותרת שאין מקום אחריה) חוזרת לזרם ועוברת יחד עם הפסקה שאחריה.
                    // לא משחררים אם הטוקן הבא הוא כותרת-רוחבית (אין מה שיבוא אחריה בטור).
                    if (tokenIndex < secTokens.length && !pendingWordTokens) {
                        const nxt = secTokens[tokenIndex];
                        const nxtIsSpan = nxt && nxt.type.startsWith('h') && headingModes[nxt.level] === 'span_1col';
                        if (!nxtIsSpan) tokenIndex -= releaseTrailingHeadings(targetCol);
                    }
                });

                if (rCol.children.length === 0 && lCol.children.length === 0) {""", 'P5f post-loop release')

# P5g: כותרת רוחבית — חייבת מקום ללפחות שתי שורות טקסט אחריה
ts = rep(ts, """                    const spanHeight = spanBlock.offsetHeight + 4;
                    if (spanHeight > (remPageHeight - getFootnotesReservedHeight())) {
                        pageLayout.bodyFlow.removeChild(spanBlock);
                        break;
                    }""", """                    const spanHeight = spanBlock.offsetHeight + 4;
                    // כותרת רוחבית חייבת לשבת יחד עם לפחות 2 שורות טקסט (שורה אחת אם
                    // ההגנות כבויות) — אחרת היא נשארת "יתומה" בתחתית העמוד.
                    const protectOn = (document.getElementById('avoid-orphans')?.checked ?? true) || (document.getElementById('avoid-widows')?.checked ?? true);
                    const minTextBelow = (protectOn ? 2 : 1) * bodyLineHeightPx() + 8;
                    const availForSpan = remPageHeight - getFootnotesReservedHeight();
                    if (spanHeight > availForSpan || (pageHasText && spanHeight + minTextBelow > availForSpan)) {
                        pageLayout.bodyFlow.removeChild(spanBlock);
                        break;
                    }""", 'P5g span keep-with-next')

# P5h: שמירה על יישור קוסמטי — לפי הגובה הפנוי האמיתי (כולל שריון הערות)
ts = rep(ts, "if (usedBlockH <= remPageHeight) {", "if (usedBlockH <= actualAvailH) {", 'P5h justify guard')


# ---------- P6: מדידת-התאמה עם סימוני הערות במקום טקסט-ההערה הגולמי ----------
# ברינדור הסופי טקסט ההערה ("[...]") מוחלף בסימון קטן, אבל בלולאת המדידה הוא נספר
# כטקסט גלוי — ולכן נמדד גבוה מדי (עמודים נגמרים "מוקדם", ושארית של 2 שורות
# צפויות מתרנדרת בפועל כשורה אחת). מחילים החלפה "יבשה" (dry-run, בלי רישום) בזמן מדידה.
ts = rep(ts, "                            const pendingFnColumns = pendingFnMatches.length ? (getNoteConfig(pendingFnMatches[0].inst.instanceId).columns || 1) : 1;",
         "                            const pendingFnColumns = pendingFnMatches.length ? (getNoteConfig(pendingFnMatches[0].inst.instanceId).columns || 1) : 1;\n"
         "                            const hasNoteDelimsInPara = findDelimiterMatches(fullRemainingText, 'body').some(m => m.inst.def.target === 'footnote' || m.inst.def.target === 'endnote');", 'P6a flag')
import re as _re
_pat = _re.compile(r"(pElem\.innerHTML = createDropWord\(testText, isContinuation, !hasWindow[^;]*;\n)(\s*\n\s*if \(pendingFnMatches\.length\) \{)")
_found = _pat.findall(ts)
assert len(_found) == 1, ('P6b loop anchor count', len(_found))
ts = _pat.sub(lambda m: m.group(1) + "                                if (hasNoteDelimsInPara) applyDelimiterStyles(pElem, 'body', getBodySizePt(), true);\n" + m.group(2), ts, count=1)


# ---------- P8: כיול גיאומטרי של המקום הפנוי בכל בלוק ----------
# הנוסחאות ("used", הפחתות לפי גובה בלוק קודם) מניחות שמרווחים/עיטורים מצטברים
# בדיוק כפי שחושבו — וכל סטייה (עיטורים, קיפול-מרווחים, גופן שהוחלף) הופכת לעמוד
# שמסתיים גבוה מדי או חורג למספר העמוד. כאן מודדים ישירות את המיקום האמיתי של
# הבלוק החדש בתוך אזור-הגוף וקובעים את המקום הפנוי לפי המציאות.
ts = rep(ts, "                pageLayout.bodyFlow.appendChild(block2Col);\n\n                const blockNoteSnapshot = {",
         """                pageLayout.bodyFlow.appendChild(block2Col);

                {
                    const __fr = pageLayout.bodyFlow.getBoundingClientRect();
                    const __br = block2Col.getBoundingClientRect();
                    const __sc = (__fr.height && pageLayout.bodyFlow.offsetHeight) ? (__fr.height / pageLayout.bodyFlow.offsetHeight) : 1;
                    const __geo = totalFlowH - ((__br.top - __fr.top) / (__sc || 1));
                    if (window.__DBG) (window.__geoLog = window.__geoLog || []).push([Math.round(remPageHeight), Math.round(__geo)]);
                    if (isFinite(__geo) && __geo > 60) remPageHeight = __geo;
                }

                const blockNoteSnapshot = {""", 'P8 geometric calibration')
