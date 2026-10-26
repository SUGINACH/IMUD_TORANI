# סקריפט-טלאים חוזר: מייצר את הקבצים הסופיים מתוך orig_* (גרסת-העל) + כל התיקונים.
import re, sys

def load(name):
    with open('orig_' + name, encoding='utf-8') as f:
        return f.read()

def save(name, text):
    with open(name, 'w', encoding='utf-8') as f:
        f.write(text)

def rep(text, old, new, label):
    n = text.count(old)
    if n != 1:
        print(f'!! PATCH FAILED [{label}]: expected 1 occurrence, found {n}')
        sys.exit(1)
    return text.replace(old, new)

ts = load('typesetter.js')
css = load('style.css')
app = load('app.js')

# ---------- P1: הגנת הערות מפני חיתוך באמצע טווח (balanceColumns) ----------
ts = rep(ts, """                hasWindow: linesInfo.hasWindow,
                numLines: linesInfo.lines.length
            };
        }
        return item;
    });
""", """                hasWindow: linesInfo.hasWindow,
                numLines: linesInfo.lines.length,
                noteSpans: findDelimiterMatches(item.rawText, 'body')
            };
        }
        return item;
    });
""", 'P1a noteSpans compute')

ts = rep(ts, """    const validSplitPoints = splitPoints.filter(sp => {
        if (sp.lineIndex > 0) return true;
        if (sp.itemIndex > 0 && items[sp.itemIndex - 1].type === 'h') return false;
        return true;
    });""", """    // מניעת חיתוך בתוך טווח מסומן-delimiter (למשל "[...]") של הערת-שוליים/סיום
    // — אחרת הפתיח והסיום נופלים לשני צדי החלוקה, אף חצי לא נסגר כראוי, וכל
    // ההערה נעלמת בשקט (ר' findDelimiterMatches).
    const validSplitPoints = splitPoints.filter(sp => {
        if (sp.lineIndex > 0) {
            const item = items[sp.itemIndex];
            if (item && item.noteSpans && item.noteSpans.length) {
                const offset = sp.lines.slice(0, sp.lineIndex).join(' ').length;
                const cutsSpan = item.noteSpans.some(m => offset > m.start && offset < m.end);
                if (cutsSpan) return false;
            }
            return true;
        }
        if (sp.itemIndex > 0 && items[sp.itemIndex - 1].type === 'h') return false;
        return true;
    });""", 'P1b validSplitPoints')

# ---------- P2: איזון סוף-פרק ----------
ts = rep(ts, """        let secTokens = sec.tokens.slice();
        let tokenIndex = 0;
        let pendingWordTokens = null;

        while (tokenIndex < secTokens.length || pendingWordTokens) {""", """        let secTokens = sec.tokens.slice();
        let tokenIndex = 0;
        let pendingWordTokens = null;
        // איזון סוף-פרק: מחשבים פעם אחת לכל חלק, כדי שכל עמודי החלק ימולאו
        // מעט פחות מהמקסימום הפיזי (ולא רק העמוד האחרון), כך שהעמוד האחרון
        // של החלק לא ייראה דליל בהשוואה לשאר עמודי החלק.
        const sectionFillRatio = (document.getElementById('balance-chapter-end')?.value === 'yes')
            ? estimateSectionFillRatio(secTokens) : 1;

        while (tokenIndex < secTokens.length || pendingWordTokens) {""", 'P2a secTokens')
ts = rep(ts, "            let totalFlowH = pageLayout.bodyFlow.clientHeight || 870;",
         "            let totalFlowH = (pageLayout.bodyFlow.clientHeight || 870) * sectionFillRatio;", 'P2b totalFlowH')

# ---------- P3: מדידת used עם התחשבות בקיפול-מרווחים ----------
ts = rep(ts, """                if (spacer) used += spacer.offsetHeight;
                const headerEls = pageLayout.bodyFlow.querySelectorAll('.h2-ornament-top, .h2-siman-badge, .title-level-2-standalone, .h2-ornament-bottom, .block-h2-title-side');
                headerEls.forEach(el => {
                    if (el.closest('.block-h2-title-side') && el.classList.contains('title-level-2-standalone')) return;
                    used += el.offsetHeight;
                    const st = window.getComputedStyle(el);
                    used += (parseFloat(st.marginTop) || 0) + (parseFloat(st.marginBottom) || 0);
                });
            }""", """                if (spacer) used += spacer.offsetHeight;
                // מדידת הגובה בפועל: המרחק מראש האלמנט הראשון עד תחתית האלמנט האחרון
                // (offsetTop/offsetHeight — ערכים לא-מוקטנים, בניגוד ל-getBoundingClientRect
                // שמושפע מקנה-המידה של התצוגה המקדימה), ולא סכום נפרד של כל אלמנט +
                // המרווחים שלו: בזרימת-בלוקים רגילה מרווחים אנכיים בין אחים סמוכים
                // "מתמזגים" (margin collapse) ואינם מצטברים.
                const headerElsRaw = Array.from(pageLayout.bodyFlow.querySelectorAll('.h2-ornament-top, .h2-siman-badge, .title-level-2-standalone, .h2-ornament-bottom, .block-h2-title-side'));
                const headerEls = headerElsRaw.filter(el => !(el.closest('.block-h2-title-side') && el.classList.contains('title-level-2-standalone')));
                if (headerEls.length) {
                    const firstTop = headerEls[0].offsetTop;
                    const lastEl = headerEls[headerEls.length - 1];
                    const lastBottom = lastEl.offsetTop + lastEl.offsetHeight;
                    const lastMarginBottom = parseFloat(window.getComputedStyle(lastEl).marginBottom) || 0;
                    used += (lastBottom - firstTop) + lastMarginBottom;
                }
            }""", 'P3 used-height')

# ---------- P4: CSS עיטור כותרת עליונה ----------
css = rep(css, """.header-col-r img, .header-col-r svg,
.header-col-c img, .header-col-c svg,
.header-col-l img, .header-col-l svg {
    max-height: 20px;
    max-width: 100%;
    width: auto;
    vertical-align: middle;
}""", """.header-col-r img, .header-col-r svg,
.header-col-c img, .header-col-c svg,
.header-col-l img, .header-col-l svg {
    max-height: 20px !important;
    max-width: 90% !important;
    height: auto !important;
    width: auto !important;
    vertical-align: middle;
}""", 'P4 header ornament css')

# ---------- P7: עימוד חוזר אחרי שגופנים מסיימים להיטען ----------
app = rep(app, """    typesetDocument();
    initVisualPickers();
};""", """    typesetDocument();
    initVisualPickers();

    // גיבוי: אם גופן מסיים להיטען רק אחרי העימוד הראשוני (גופן-רשת/מקומי), כל המדידות
    // שהתבססו על גופן חלופי שגויות — וכך עמוד יכול להסתיים "גבוה/נמוך מדי" עד לעימוד
    // הבא. מריצים עימוד נוסף אחרי שהגופנים התייצבו (רק בחלון-זמן קצר מהטעינה).
    if (document.fonts && document.fonts.addEventListener) {
        const __fontT0 = performance.now();
        let __fontReflows = 0;
        document.fonts.addEventListener('loadingdone', () => {
            if (performance.now() - __fontT0 < 25000 && __fontReflows++ < 4 && typeof typesetDocumentLive === 'function') {
                typesetDocumentLive(250);
            }
        });
    }
};""", 'P7 fonts loadingdone')

# ---------- (מקום להוספת P5+ בהמשך) ----------
exec(open('patches_widow.py', encoding='utf-8').read()) if __import__('os').path.exists('patches_widow.py') else None

save('typesetter.js', ts)
save('style.css', css)
save('app.js', app)
print('patches applied OK')
