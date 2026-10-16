# חבילת מערכת עימוד תורנית — גרסה v10 (2026-10-12)

## מה חדש בגרסה זו

1. **שמות גופנים בעברית** — כל ה-@font-face ומשתני ה-CSS משתמשים בשמות עבריים מ-fonts.json.

2. **טעינת גופנים דו-שלבית (חדש)** — רשימת הגופנים מחולקת לשתי רשימות:
   - **רשימה 1** (fonts-def.css, 439 גופנים) — נטענת מיד. כוללת גופני ברירת מחדל + נפוצים בעברית + נפוצים בספר התורני.
   - **רשימה 2** (fonts-extended.css, 1315 גופנים) — נטענת רק אחרי לחיצה על "📚 טען גופנים נוספים".

3. **דוח עימוד מועשר (חדש)** — נוספו בדיקות ויזואליות מקיפות: DOM, גופן, RTL/עברית, עימוד מתקדם.

4. **תיקוני איזון** — P2.5 חדש (margin-bottom H5), 3 באגים קריטיים תוקנו.

5. **.nojekyll** — נוסף ל-root למניעת סינון Jekyll ב-GitHub Pages.

## רשימת קבצים

| קובץ | תיאור |
|---|---|
| typesetter.js | מנוע עימוד + P2.5 |
| style.css | גליון סגנונות |
| fonts-def.css | רשימה 1 — 439 @font-face |
| fonts-extended.css | רשימה 2 — 1315 @font-face |
| fonts-priority.json | רשימה 1 — 439 רשומות |
| fonts-extended.json | רשימה 2 — 1315 רשומות |
| app.js | UI + loadExtendedFonts() |
| test-suite.js | דוח מועשר |
| index.html | עם כפתור "📚 טען גופנים נוספים" |
| .nojekyll | מבטל Jekyll ב-Pages |

## אופן התקנה

1. העתק קבצים לריפו המקומי
2. git add -A && git commit -m "v10" && git push origin V15
3. פתח https://suginach.github.io/IMUD_TORANI/
