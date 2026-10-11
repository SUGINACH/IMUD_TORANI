# חבילת מערכת עימוד תורנית — גרסה v9 (2026-10-11)

## מה חדש בגרסה זו

1. **שמות גופנים בעברית** — כל ה-`@font-face` ב-`_fonts.css` וכל משתני ה-CSS ב-`style.css` משתמשים בשמות העבריים מתוך `fonts.json` של SUGINACH/IMUD_TORANI. לדוגמה: `'אלפא שחור'` במקום `'AlphaBlack'`.

2. **`initFontPickers` מעודכן** — הפונקציה ב-`app.js` שהייתה דורסת את ה-CSS עם שמות אנגליים כעת משתמשת בשמות עבריים. כל המשקלים (רגיל/מודגש/שחור/קל/בינוני) זמינים ב-picker.

3. **101 קבצי גופנים** — כל הגופנים שהורדו מ-GitHub (100) + Guttman Rashi מהעלאה קודמת.

4. **תיקוני איזון טורים** — 3 באגים קריטיים תוקנו:
   - `justifyColumnsPair` — העברת `growthCeiling = targetH + 1` במקום budget
   - `applyPriority5_WordSpacing` — `applied += delta` (cumulative) במקום overwrite
   - Refuse-to-fill-with-runt — השוואת before/after
   - ביטול `layoutInvalidator` שדרס תיקונים עם V2
   - Rebalance אוטומטי אחרי tightenRunts + reset סגנונות ישנים

5. **תיקוני CSS נוספים**:
   - כותרת 4/5/6 בתחילת טור — ביטול margin-top
   - כותרת 7 (צד) — ממוקמת 4px מתחת לפסקה
   - `.first-word-window` — `line-height: 0.85` למרכוז אנכי

## רשימת הקבצים בחבילה

| קובץ | תיאור |
|---|---|
| `typesetter.js` | מנוע העימוד הראשי — כולל כל תיקוני האיזון |
| `style.css` | גליון סגנונות עם `@import "_fonts.css"` + משתנים בעברית |
| `_fonts.css` | 101 הגדרות `@font-face` עם שמות משפחה בעברית מ-`fonts.json` |
| `app.js` | אפליקציית UI — `initFontPickers` מעודכן עם שמות עבריים |
| `decorations.js` | פונקציות עיטור ועזר |
| `index.html` | מעטפת HTML |
| `fonts/` | 101 קבצי woff2 (100 מ-GitHub + Guttman Rashi) |
| `README.md` | קובץ זה |
| `worklog.md` | יומן עבודה מלא |

## אופן ההתקנה

1. חלץ את ה-ZIP לתיקיית שרת מקומי.
2. ודא שהמבנה:
   ```
   /path/to/typesetter/
   ├── index.html
   ├── style.css
   ├── _fonts.css
   ├── app.js
   ├── decorations.js
   ├── typesetter.js
   └── fonts/
       ├── Alpha-Black.woff2
       ├── Alpha-Bold.woff2
       ├── ...
       └── Guttman-Rashi-Normal.woff2
   ```
3. הפעל שרת HTTP:
   ```bash
   cd /path/to/typesetter/
   python3 -m http.server 9000
   ```
4. פתח את הדפדפן ב-`http://127.0.0.1:9000/index.html`.
5. הדבק טקסט ולחץ "עדכן ועמד מחדש".

## מפת השמות העבריים (העיקריים)

| שם עברי | קובץ woff2 | משתמש ב-CSS |
|---|---|---|
| `גוטמן רש"י רגיל` | Guttman-Rashi-Normal.woff2 | body |
| `פרנק ריל מודגש` | FrankReal-Bold.woff2 | first-word |
| `פרנק ריל רגיל` | FrankReal-Regular.woff2 | (חלופה רגילה) |
| `אלפא שחור` | Alpha-Black.woff2 | h0/h2/h3/h4/siman/dh |
| `אלפא מודגש` | Alpha-Bold.woff2 | h5 |
| `אלפא רגיל` | Alpha-Regular.woff2 | (חלופה) |
| `אלפא קל` | Alpha-Light.woff2 | (חלופה) |
| `ליבורנה מודגש` | Livorna-Bold.woff2 | h1/sh-title/sh-sub/header-r/l |
| `ליבורנה רגיל` | Livorna-Regular.woff2 | header-c/sh-desc |
| `הדסה פרידלנדר מודגש` | Hadassah-Friedlaender-Bold.woff2 | h7 |
| `הדסה פרידלנדר רגיל` | Hadassah-Friedlaender-Regular.woff2 | (חלופה) |
| `פרנק רוהל ליברה רגיל` | FrankRuhlLibre-Regular.woff2 | fallback רגיל |
| `פרנק רוהל ליברה מודגש` | Frank-Ruhl-Libre-Bold.woff2 | fallback מודגש |
| `פרנק רוהל ליברה שחור` | FrankRuhlLibre-Black.woff2 | fallback שחור |
| `פרנק רוהל ליברה קל` | FrankRuhlLibre-Light.woff2 | fallback קל |
| `פרנק רוהל ליברה בינוני` | FrankRuhlLibre-Medium.woff2 | fallback בינוני |
| `פרנק רוהל רגיל` | FrankRuehl-Regular.woff2 | (חלופה) |
| `פרנק רוהל דפ רגיל` | FrankRuehl-Dp-Regular.woff2 | (חלופה) |
| `פרנק רוהל דפ מודגש` | FrankRuehl-Dp-Bold.woff2 | (חלופה) |
| `נוטו סריף עברית רגיל` | Noto-Serif-Hebrew-Regular.woff2 | (fallback h3) |
| `נוטו סריף עברית מודגש` | Noto-Serif-Hebrew-Bold.woff2 | h6 |
| `נוטו סריף עברית שחור` | Noto-Serif-Hebrew-Black.woff2 | fallback h3 |

## סטטיסטיקת איזון אחרי כל התיקונים

- **97 עמודים** מ-274,272 תווים
- **0 עמודים עם חוסר איזון טורים (>30px)**
- **148 שורות אחרונות דלילות** (ירידה מ-362 המקורי)
- **11 מתוך 12 עמודים מאוזנים בהצלחה** (page 90 block #2 עם 24px — שתי פסקאות בודדות, מצב קשה)

## הערות

- המערכת פועלת בדפדפן בלבד (JavaScript client-side).
- נדרש חיבור אינטרנט לטעינת גופני Google ל-UI (`Assistant`, `Rubik`).
- כל גופני הטקסט נטענים מקומית מתיקיית `fonts/`.
- הגופנים הם עם שמות משפחה בעברית (מ-`fonts.json` של SUGINACH/IMUD_TORANI).

## ניטרול תצוגה לבדיקה

לצורך צילום מסך נקי, הסתר את ה-sidebar בעזרת הקוד הבא בקונסולה:
```js
document.getElementById('sidebar').style.display = 'none';
document.getElementById('preview-pane').style.padding = '0';
document.documentElement.style.setProperty('--preview-scale', '1');
```
