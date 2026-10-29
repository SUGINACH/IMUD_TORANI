# ארכיון — גרסאות אחרות, לעיון והעברה

**אף אחד מהקבצים כאן אינו נטען באפליקציה.** זהו חומר גלם להעברת פיצ'רים לגרסה המאוחדת (ראו `docs/FEATURE_MAP.md`) ושימור גישות שונות לאותה בעיה.
אין להעתיק קובץ שלם מכאן מעל קובץ בשורש — ממזגים לפי פיצ'ר, מול הסוויטה (`docs/AI_WORKFLOW.md`).

| תיקייה | מקור | מה בפנים / למה שימושי |
|---|---|---|
| `v21-glm-11b2b55/` | קו V21 (סוכן GLM), קומיט `11b2b55` | המצב הכי עשיר בפיצ'רים: iframe (`renderer-bridge.js`, `renderer.html`), `geometry-audit.js`, `debug-panel.js`, `trace-manager.js`, עיצוב סוגריים, הערות רציפות, איכות אוטומטית, זנב יתום. **קיים רק בהיסטוריה של V20.1/V20.2** |
| `v20.4-tip/` | קצה V20.4 | מנוע V20 + תיקוני הדיוק; run-in, רשת כותרת, מתיחת תחתית עמוד, כיול תיבות שער, SVG normalize/scope |
| `v20.5-tip/` | קצה V20.5 | `resolveParagraphCut`/`scanPoints`, `fitOneHeadingOrnament`, `fitSideOrnamentsToText`, `footnoteReserveFor`, מניעת מילה בודדת (הועבר) |
| `v20.2-tip/` | קצה V20.2 | `decideParagraphCut`, `stripTrailingHeadings`, `test_balance.js`, `verify_cut.js` (בדיקות לוגיקה), `script.js`/`styles.css` (פיצול קובץ יחיד) |
| `v20.3-tip/` | קצה V20.3 | מפתח שמירת מיקום תיבה לפי שער; `work_v4/` = כלי טלאים (`apply_patches.py`, בודק Python, טלאים P1–P4). **ללא קבצי הנתונים (ריקים בענף)** |
| `v19-baseline-6c5a7e1/` | v19 (16.10) | מקור מערכת הטאבים, ייצוא HTML, גופנים נוספים, חיבור ההגדרות (חלקם הועברו) |
| `v20.1-tools/` | שיחת V20.1 | `fuzz.js`, `run.js`, `shot.js`, `dbg*.js`, `repro_edit.js`, `setseq_verbose.js`, `wide_one.js`, `patches/patch1–15.py` (תיעוד של התיקונים) |
| `v18-knuth-plass/` | V18 | מנוע Knuth-Plass מלא (3,889 שורות, `typesetter.js.bak-measure-fix`) + דוח — שבירת שורות אופטימלית; נזנח ב-v19 לטובת שבירה של הדפדפן |
