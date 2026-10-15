/* ==========================================================================
   report-data.js — כלי בדיקה היררכי למערכת העימוד
   ==========================================================================
   מטרה: לספק דרך קלה לבדיקת הממצאים ביחס לכל עמוד/בלוק/טור/פסקה/שורה/מילה
   בלי צורך בצילומי מסך ופיענוחם.

   פונקציות ציבוריות (נחשפות על window):
   - window.getLayoutReportData()    → אובייקט JS עם כל הנתונים
   - window.getLayoutReportJSON()    → מחרוזת JSON מיניפלת
   - window.getLayoutReportSummary() → אובייקט קצר עם סיכום בלבד
   - window.getPageData(pageNum)     → נתוני עמוד בודד
   - window.getBlockData(pageNum, blockIdx) → נתוני בלוק בודד
   - window.getIssueList(filterOpts) → רשימת כל הבעיות עם פילטר אופציונלי

   היררכיית הנתונים:
   document → pages[] → blocks[] → columns[] → paragraphs[] → lines[] → words[]
                  ↓
              issues[] (רשימת בעיות בכל רמה)

   עיקרון: הנתונים נאספים מתוך ה-DOM החי בלבד (אין מצב מטמון).
   כל קריאה לפונקציה מחזירה תמונת מצב עדכנית.
   ========================================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------------------------ */
    /* 1. פונקציות עזר פנימיות                                            */
    /* ------------------------------------------------------------------ */

    function _id(x) { return x; }
    function _num(v) { return (typeof v === 'number' && isFinite(v)) ? v : null; }
    function _round(v, d) {
        if (typeof v !== 'number' || !isFinite(v)) return null;
        const f = Math.pow(10, d || 0);
        return Math.round(v * f) / f;
    }
    function _rect(r) {
        if (!r) return null;
        return {
            x: _round(r.left, 1), y: _round(r.top, 1),
            w: _round(r.width, 1), h: _round(r.height, 1),
            right: _round(r.right, 1), bottom: _round(r.bottom, 1)
        };
    }
    function _text(el) {
        if (!el) return '';
        return (el.textContent || '').replace(/\s+/g, ' ').trim();
    }
    function _isHeading(el) {
        if (!el || !el.className) return false;
        const c = typeof el.className === 'string' ? el.className : '';
        return /title-level-[3456]/.test(c);
    }
    function _headingLevel(el) {
        if (!el || !el.className) return null;
        const c = typeof el.className === 'string' ? el.className : '';
        const m = c.match(/title-level-(\d)/);
        return m ? parseInt(m[1], 10) : null;
    }

    /* ספירת שורות ורוחב כל שורה בפסקה על-ידי Range.getClientRects.
       מחזיר מערך של { top, height, width, right, left, ratio_to_col_width }.
       קואורדינטות מה-viewport (getBoundingClientRect). */
    function _linesFromParagraph(p, colRect) {
        if (!p || !colRect) return [];
        try {
            const range = document.createRange();
            range.selectNodeContents(p);
            const rects = Array.from(range.getClientRects());
            if (!rects.length) return [];
            const cw = colRect.width || 1;
            // איחוד rects לפי top (יכולים להיות מספר rects לאותה שורה ב-RTL)
            const lineMap = new Map();
            for (const r of rects) {
                if (r.height <= 0) continue;
                const top = Math.round(r.top);
                const cur = lineMap.get(top);
                if (!cur) {
                    lineMap.set(top, {
                        top: r.top, height: r.height,
                        left: r.left, right: r.right,
                        minLeft: r.left, maxRight: r.right
                    });
                } else {
                    cur.minLeft = Math.min(cur.minLeft, r.left);
                    cur.maxRight = Math.max(cur.maxRight, r.right);
                    cur.left = cur.minLeft;
                    cur.right = cur.maxRight;
                    cur.top = Math.min(cur.top, r.top);
                    cur.height = Math.max(cur.height, r.height);
                }
            }
            const out = [];
            const sortedTops = Array.from(lineMap.keys()).sort((a, b) => a - b);
            for (let i = 0; i < sortedTops.length; i++) {
                const v = lineMap.get(sortedTops[i]);
                // ב-RTL: רוחב השורה = right - colRect.left (המרחק מתחילת הטור עד סוף הטקסט)
                const widthFromCol = v.right - colRect.left;
                const ratio = widthFromCol / cw;
                out.push({
                    idx: i,
                    top: _round(v.top, 1),
                    height: _round(v.height, 1),
                    width: _round(widthFromCol, 1),
                    widthRatio: _round(ratio, 3),
                    isLast: (i === sortedTops.length - 1)
                });
            }
            return out;
        } catch (e) {
            return [];
        }
    }

    /* חילוץ מילים מתוך פסקה — מחזיר מערך של { text, rect, line_top } */
    function _wordsFromParagraph(p) {
        if (!p) return [];
        const out = [];
        try {
            // עובר על Text nodes בלבד, מפצל לפי רווחים
            const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);
            const textNodes = [];
            let n;
            while ((n = walker.nextNode())) textNodes.push(n);
            let wordIdx = 0;
            for (const tn of textNodes) {
                const txt = tn.nodeValue || '';
                const parts = txt.split(/(\s+)/);
                let offsetInNode = 0;
                for (const part of parts) {
                    if (!part) continue;
                    const isSpace = /^\s+$/.test(part);
                    if (!isSpace && part.length > 0) {
                        try {
                            const range = document.createRange();
                            range.setStart(tn, offsetInNode);
                            range.setEnd(tn, offsetInNode + part.length);
                            const r = range.getBoundingClientRect();
                            if (r.width > 0 && r.height > 0) {
                                out.push({
                                    idx: wordIdx++,
                                    text: part,
                                    rect: _rect(r)
                                });
                            }
                        } catch (e) { /* skip */ }
                    }
                    offsetInNode += part.length;
                }
            }
        } catch (e) { /* skip */ }
        return out;
    }

    /* ------------------------------------------------------------------ */
    /* 2. זיהוי בעיות לפי רמות                                            */
    /* ------------------------------------------------------------------ */

    function _checkParagraphIssues(p, lines, colRect, opts) {
        const issues = [];
        const isPcut = p.classList && p.classList.contains('p-cut');
        const isPend = p.classList && p.classList.contains('p-end');
        const isContinuation = p.getAttribute && p.getAttribute('data-is-cont') === 'true';
        const lineCount = lines.length;
        const firstLine = lines[0] || null;
        const lastLine = lines[lineCount - 1] || null;

        // אלמנה (Widow) — פסקת המשך בתחילת טור עם שורה אחת בלבד
        if (isContinuation && lineCount === 1) {
            issues.push({ type: 'widow', severity: 'high',
                detail: 'פסקת המשך עם שורה אחת בלבד בתחילת טור',
                threshold: 'lines<2 && data-is-cont' });
        }

        // יתום (Orphan) — פסקה (לא p-end) בסוף טור עם שורה אחת בלבד
        // ניתן לזהות רק אם יש מידע שזה בסוף טור — נסמן ברמת הטור
        // (כאן רק מסמנים שזו פסקה חד-שורתית, הקונטקסט נקבע ברמת הטור)

        // שורה דלילה ב-p-cut — רק ב-p-cut (לא p-end)
        if (isPcut && lineCount > 1 && lastLine && lastLine.widthRatio < 0.5) {
            issues.push({ type: 'sparse_pcut', severity: 'high',
                detail: 'שורה אחרונה דלילה ב-p-cut: ' + Math.round(lastLine.widthRatio * 100) + '% מרוחב הטור',
                threshold: 'lastLineWidthRatio<0.5', widthRatio: lastLine.widthRatio });
        }

        // p-cut חד-שורתי
        if (isPcut && lineCount === 1) {
            issues.push({ type: 'single_line_pcut', severity: 'medium',
                detail: 'פסקת p-cut עם שורה אחת בלבד',
                threshold: 'lines==1 && p-cut' });
        }

        return issues;
    }

    function _checkColumnIssues(col, colRect, isLastInBlock, opts) {
        const issues = [];
        // גלישה: scrollHeight > clientHeight + 2
        const sh = col.scrollHeight, ch = col.clientHeight;
        if (sh > ch + 2) {
            issues.push({ type: 'overflow', severity: 'critical',
                detail: 'גלישת טור: scrollHeight=' + sh + ' > clientHeight=' + ch,
                overflowPx: sh - ch, threshold: 'scrollHeight>clientHeight+2' });
        }

        // טור ריק
        const ps = col.querySelectorAll('p');
        const titles = col.querySelectorAll('[class*="title-level-"]');
        if (ps.length === 0 && titles.length === 0) {
            issues.push({ type: 'empty_column', severity: 'low',
                detail: 'טור ריק לחלוטין', threshold: 'p.length==0 && titles.length==0' });
        }

        // כותרת בתחתית הטור
        const children = Array.from(col.children);
        if (children.length > 0) {
            const last = children[children.length - 1];
            if (_isHeading(last)) {
                issues.push({ type: 'heading_at_bottom', severity: 'high',
                    detail: 'כותרת H' + _headingLevel(last) + ' כאלמנט האחרון בטור',
                    headingLevel: _headingLevel(last) });
            } else if (children.length >= 2) {
                const prev = children[children.length - 2];
                if (_isHeading(prev) && !_isHeading(last)) {
                    // בדיקת שורות באלמנט האחרון
                    try {
                        const range = document.createRange();
                        range.selectNodeContents(last);
                        const rects = Array.from(range.getClientRects()).filter(r => r.height > 0);
                        const tops = new Set(rects.map(r => Math.round(r.top)));
                        if (tops.size < 2) {
                            issues.push({ type: 'heading_at_bottom', severity: 'high',
                                detail: 'כותרת H' + _headingLevel(prev) + ' עם <2 שורות טקסט אחריה',
                                headingLevel: _headingLevel(prev), linesAfter: tops.size });
                        }
                    } catch (e) { /* skip */ }
                }
            }
        }

        return issues;
    }

    function _checkBlockIssues(block, rCol, lCol, rRect, lRect, opts) {
        const issues = [];
        const rH = rCol.scrollHeight, lH = lCol.scrollHeight;
        const delta = Math.abs(rH - lH);
        if (delta > 5) {
            issues.push({ type: 'imbalanced', severity: 'medium',
                detail: 'פער גובה בין טורים: |' + rH + '−' + lH + '|=' + delta + 'px',
                delta: delta, rH: rH, lH: lH,
                threshold: 'delta>5px' });
        }
        return issues;
    }

    function _checkSideNoteOverlap(page) {
        const issues = [];
        const sideNotes = page.querySelectorAll('.side-notes .side-note');
        const arr = Array.from(sideNotes).map(sn => ({
            el: sn, top: sn.offsetTop, height: sn.offsetHeight,
            bottom: sn.offsetTop + sn.offsetHeight
        }));
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                const a = arr[i], b = arr[j];
                const overlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
                if (overlap > 1) {
                    issues.push({ type: 'side_note_overlap', severity: 'high',
                        detail: 'חפיפת הערות שוליים: ' + overlap + 'px',
                        overlapPx: overlap, i: i, j: j });
                }
            }
        }
        return issues;
    }

    /* ------------------------------------------------------------------ */
    /* 3. בונה ההיררכיה המלאה                                            */
    /* ------------------------------------------------------------------ */

    function buildReportData(opts) {
        opts = opts || {};
        const includeWords = opts.includeWords !== false; // ברירת מחדל: כן
        const includeLines = opts.includeLines !== false;
        const pages = document.querySelectorAll('#book-container .a4-page');
        const out = {
            meta: {
                generatedAt: new Date().toISOString(),
                engineMode: window.__engineMode || 'unknown',
                totalPages: pages.length,
                url: location.href,
                userAgent: navigator.userAgent
            },
            summary: null,
            pages: [],
            issues: []
        };

        const S = {
            totalBlocks: 0, totalColumns: 0, totalParagraphs: 0,
            totalLines: 0, totalWords: 0,
            imbalanced: 0, overflow: 0, widows: 0, orphans: 0,
            sparse_pcut: 0, single_line_pcut: 0, empty_columns: 0,
            heading_at_bottom: 0, side_note_overlap: 0
        };

        pages.forEach((pg, pIdx) => {
            const pageNum = pIdx + 1;
            const pNumDisplay = (pg.querySelector('.page-number-footer') &&
                pg.querySelector('.page-number-footer').textContent || '').trim();
            const role = (pg.className.match(/page-role-(\S+)/) || [null, 'regular'])[1];
            const bf = pg.querySelector('.page-body-flow');
            const availH = bf ? bf.clientHeight : null;
            const pageRect = pg.getBoundingClientRect();

            const pageData = {
                idx: pIdx,
                pageNum: pageNum,
                pageNumDisplay: pNumDisplay,
                role: role,
                rect: _rect(pageRect),
                availableHeight: availH,
                blocks: [],
                issues: []
            };

            // חפיפות הערות שוליים ברמת העמוד
            const snOverlaps = _checkSideNoteOverlap(pg);
            snOverlaps.forEach(o => {
                o.pageNum = pageNum;
                pageData.issues.push(o);
                out.issues.push(Object.assign({ page: pageNum }, o));
                S.side_note_overlap++;
            });

            const blocks = pg.querySelectorAll('.block-2col, .block-h3-span');
            blocks.forEach((b, bIdx) => {
                if (b.classList.contains('block-h3-span')) {
                    pageData.blocks.push({
                        idx: bIdx,
                        type: 'h3',
                        text: _text(b).slice(0, 80),
                        rect: _rect(b.getBoundingClientRect())
                    });
                    return;
                }
                const rCol = b.querySelector('.right-col');
                const lCol = b.querySelector('.left-col');
                if (!rCol || !lCol) return;
                S.totalBlocks++;

                const rRect = rCol.getBoundingClientRect();
                const lRect = lCol.getBoundingClientRect();
                const blockRect = b.getBoundingClientRect();

                const blockData = {
                    idx: bIdx,
                    type: '2col',
                    rect: _rect(blockRect),
                    columns: [],
                    issues: []
                };

                // בעיות בלוק (חוסר איזון)
                const blockIssues = _checkBlockIssues(b, rCol, lCol, rRect, lRect, opts);
                blockIssues.forEach(o => {
                    o.pageNum = pageNum; o.blockIdx = bIdx;
                    blockData.issues.push(o);
                    out.issues.push(Object.assign({ page: pageNum, block: bIdx }, o));
                    if (o.type === 'imbalanced') S.imbalanced++;
                });

                [rCol, lCol].forEach((col, ci) => {
                    S.totalColumns++;
                    const side = ci === 0 ? 'R' : 'L';
                    const colRect = col.getBoundingClientRect();
                    const colData = {
                        side: side,
                        rect: _rect(colRect),
                        scrollHeight: col.scrollHeight,
                        clientHeight: col.clientHeight,
                        paragraphs: [],
                        issues: []
                    };

                    // בעיות טור
                    const colIssues = _checkColumnIssues(col, colRect, false, opts);
                    colIssues.forEach(o => {
                        o.pageNum = pageNum; o.blockIdx = bIdx; o.colSide = side;
                        colData.issues.push(o);
                        out.issues.push(Object.assign({ page: pageNum, block: bIdx, col: side }, o));
                        if (o.type === 'overflow') S.overflow++;
                        if (o.type === 'empty_column') S.empty_columns++;
                        if (o.type === 'heading_at_bottom') S.heading_at_bottom++;
                    });

                    // פסקאות
                    const ps = col.querySelectorAll('p');
                    ps.forEach((p, pi) => {
                        S.totalParagraphs++;
                        const pRect = p.getBoundingClientRect();
                        const pData = {
                            idx: pi,
                            classes: (p.className || '').split(/\s+/).filter(Boolean),
                            isPcut: p.classList && p.classList.contains('p-cut'),
                            isPend: p.classList && p.classList.contains('p-end'),
                            isContinuation: p.getAttribute('data-is-cont') === 'true',
                            text: _text(p).slice(0, 200),
                            rect: _rect(pRect),
                            offsetHeight: p.offsetHeight,
                            lines: [],
                            issues: []
                        };

                        if (includeLines) {
                            const lines = _linesFromParagraph(p, colRect);
                            pData.lines = lines;
                            S.totalLines += lines.length;

                            // בעיות פסקה
                            const pIssues = _checkParagraphIssues(p, lines, colRect, opts);
                            pIssues.forEach(o => {
                                o.pageNum = pageNum; o.blockIdx = bIdx; o.colSide = side; o.paragraphIdx = pi;
                                pData.issues.push(o);
                                out.issues.push(Object.assign({ page: pageNum, block: bIdx, col: side, paragraph: pi }, o));
                                if (o.type === 'widow') S.widows++;
                                if (o.type === 'sparse_pcut') S.sparse_pcut++;
                                if (o.type === 'single_line_pcut') S.single_line_pcut++;
                            });

                            if (includeWords) {
                                // רק מילים של השורה האחרונה (כדי לשמור על נפח נמוך)
                                if (lines.length > 0) {
                                    pData.lastLineWords = _wordsFromParagraph(p).slice(-20);
                                    S.totalWords += pData.lastLineWords.length;
                                }
                            }
                        }

                        colData.paragraphs.push(pData);
                    });

                    blockData.columns.push(colData);
                });

                pageData.blocks.push(blockData);
            });

            out.pages.push(pageData);
        });

        out.summary = S;
        return out;
    }

    /* ------------------------------------------------------------------ */
    /* 4. פונקציות ציבוריות נחשפות על window                              */
    /* ------------------------------------------------------------------ */

    window.getLayoutReportData = function (opts) {
        return buildReportData(opts || {});
    };

    window.getLayoutReportJSON = function (opts) {
        try {
            return JSON.stringify(buildReportData(opts || {}), null, 2);
        } catch (e) {
            return '{"error":"' + (e.message || String(e)) + '"}';
        }
    };

    window.getLayoutReportSummary = function () {
        const d = buildReportData({ includeWords: false, includeLines: false });
        return {
            meta: d.meta,
            summary: d.summary,
            issuesByType: d.issues.reduce(function (acc, i) {
                acc[i.type] = (acc[i.type] || 0) + 1;
                return acc;
            }, {}),
            issuesBySeverity: d.issues.reduce(function (acc, i) {
                acc[i.severity] = (acc[i.severity] || 0) + 1;
                return acc;
            }, {}),
            issueCount: d.issues.length
        };
    };

    window.getPageData = function (pageNum) {
        const d = buildReportData({});
        return d.pages.find(function (p) { return p.pageNum === pageNum; }) || null;
    };

    window.getBlockData = function (pageNum, blockIdx) {
        const p = window.getPageData(pageNum);
        if (!p) return null;
        return p.blocks.find(function (b) { return b.idx === blockIdx; }) || null;
    };

    window.getIssueList = function (filterOpts) {
        const d = buildReportData({});
        if (!filterOpts) return d.issues;
        return d.issues.filter(function (i) {
            if (filterOpts.type && i.type !== filterOpts.type) return false;
            if (filterOpts.severity && i.severity !== filterOpts.severity) return false;
            if (filterOpts.page && i.page !== filterOpts.page) return false;
            return true;
        });
    };

    console.log('[report-data] loaded. Use window.getLayoutReportData() / getLayoutReportJSON() / getLayoutReportSummary()');
})();
