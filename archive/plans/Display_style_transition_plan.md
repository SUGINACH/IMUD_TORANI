---
title: "הסבת גרסה משולבת 2 למראה הסטודיו (Studio Build)"
date: unknown
version: archive
type: plans
source: archive
---
תכנית מעבר מדויקת · אפס פגיעה במנוע העימוד

# הסבת גרסה משולבת 2 למראה הסטודיו (Studio Build)

תכנית הנדסית לשימור מלא ומוחלט של כל שמות המשתנים, מזהי ה-DOM, חיבורי ה-JSON, סורקי התיקיות ומנוע העימוד הקיים בגרסה 2 — תוך הלבשתו בממשק התלת-טורי הבהיר, הנקי והיוקרתי של סטודיו העימוד.

**עיקרון הברזל המנחה:** אין לגעת בשום לוגיקה פנימית של `typesetter.js`, `decorations.js`, או במזהי ה-ID וה-Name ב-DOM. כל השדות (Input, Select, Button, Textarea) שומרים על אותם IDs בדיוק נמרץ. השינוי הוא **ארכיטקטורת המעטפת ב-HTML** ו**מערכת הסגנונות ב-CSS**.

## 1 ארכיטקטורת הפריסה: מעבר למבנה תלת-טורי (Workspace)

בגרסה 2 הקיימת, הממשק בנוי מסרגל צד דו-טורי בימין (עורך טקסט + פאנל הגדרות מתקפל) ואזור תצוגה מקדימה משמאל.
בסטודיו, המבנה מבוסס על **סרגל עליון קבוע**, **רצועת מדדים**, ו**גריד תלת-טורי מאוזן**:

**טור ימין (360px):**
לוח הגדרות עימוד מלא
`#settings-pane`

**מרכז (1fr):**
סרגל תצוגה + סביבת דפי A4
`#preview-pane`

**טור שמאל (380px):**
עורך תוכן וחלוקת עמודים
`#text-pane`

### פירוט ארגון השלד החדש ב-HTML:

```
<!-- מבנה השלד החדש של index.html -->
<body>
<!-- 1. סרגל עליון בסגנון Studio -->
<header id="topbar">
<div class="brand">
<span class="brand-mark">ס</span>
<div class="brand-text">
<b>מערכת עימוד תורנית מקצועית</b>
<i>Master Edition — מנוע שלם משולב</i>
</div>
</div>
<div class="top-actions">
<button type="button" id="btn-retypeset" class="btn btn-primary" onclick="typesetDocument()">⚡ עדכן ועמד מחדש</button>
<button type="button" class="btn" onclick="document.getElementById('file-txt-import').click()">📄 ייבוא טקסט</button>
<button type="button" class="btn" onclick="window.print()">🖨️ הדפסה / PDF</button>
<button type="button" class="btn btn-ghost" onclick="saveAsDefaultTemplate()">💾 שמור תבנית</button>
<button type="button" class="btn btn-ghost" onclick="loadSystemFonts()">📂 גופני מחשב</button>
<input type="file" id="file-txt-import" accept=".txt,.text,.md" style="display:none" onchange="handleTxtFileImport(event)">
</div>
</header>
<!-- 2. רצועת מדדים עליונה -->
<section id="stats-ribbon">
<div class="stat-unit"><span class="stat-v" id="stat-pages-count">0</span><span class="stat-k">עמודים</span></div>
<div class="stat-unit"><span class="stat-v" id="stat-words-count">0</span><span class="stat-k">מילים</span></div>
<div class="stat-unit"><span class="stat-v" id="stat-notes-count">0</span><span class="stat-k">הערות שוליים</span></div>
<div class="stat-chips" id="status-chips-container">
<span class="chip chip-ok">✓ מנוע גרסה משולבת מוכן</span>
</div>
</section>
<!-- 3. סביבת העבודה התלת-טורית -->
<main id="workspace">
<!-- טור ימין: פאנל הגדרות מקורי מלא (כל 10 הפאנלים) -->
<aside id="settings-pane"> ... </aside>
<!-- מרכז: סביבת דפי A4 + סרגל כלים מרחף -->
<section id="preview-pane">
<div id="preview-toolbar">
<label>תצוגה (Zoom):
<input type="range" id="scale-slider" min="0.2" max="1.5" step="0.05" value="1" oninput="onUserScaleInput(this.value)">
<span id="scale-label">100%</span>
</label>
<label><input type="checkbox" id="toggle-grid-overlay" onchange="toggleGridOverlay(this.checked)"> גריד בסיס</label>
<label><input type="checkbox" id="toggle-diag-boxes" onchange="toggleDiagBoxes(this.checked)"> מסגרות אבחון</label>
</div>
<div id="book-container"></div>
</section>
<!-- טור שמאל: עורך הטקסט המקורי -->
<aside id="text-pane"> ... </aside>
</main>
</body>
```

## 2 פלטת צבעים, טיפוגרפיה ומשתני CSS

החלפת המראה הכהה (Slate `#334155`) במראה הנקי של הסטודיו. כל המשתנים מוגדרים ב-`:root` ללא התנגשות עם משתני הגופנים התורניים של מנוע העימוד:

| משתנה Studio | ערך hex/px | ייעוד במערכת |
| --- | --- | --- |
| `--canvas` | `#f6f7f9` | רקע חלל העבודה סביב דפי ה-A4 והפאנלים (במקום הכחול-אפור הכהה) |
| `--paper` | `#ffffff` | רקע פאנלים, סרגלי כלים, כרטיסיות ועורך הטקסט |
| `--ink` / `--ink-soft` | `#14161a` / `#5b6270` | טיפוגרפיית ממשק מאופקת, קריאה ומודרנית |
| `--accent` | `#2f6f6b` | צבע הטורקיז-פטרול היוקרתי (כפתור עמד מחדש, מסגרות בחירה פעילות) |
| `--accent-soft` | `#eaf2f1` | רקע תגיות ומשבצות פעילות |
| `--line` / `--line-soft` | `#e6e8ec` / `#f1f2f5` | קווי הפרדה דקיקים ומעודנים במקום הגבולות הגסים הקיימים |

## 3 עדכון לוח ההגדרות (Settings Pane)

לוח ההגדרות ישמור על **כל 10 הפאנלים** והרכיבים מגרסה משולבת 2, אך יעבור שינוי עיצובי פנימי:

- **כותרות הפאנלים (Accordion UI):** במקום הרקע האפור המגושם, כותרת הפאנל תעוצב ככותרת נקייה (`.sp-group-head`) עם טיפוגרפיה עדינה במשקל 500, וחץ פתיחה מעודן.
- **שורות הגדרה (`.inline-cfg-row`):** מעבר לגובה קבוע, מרווח תחתון של 8px עם קו מפריד מקווקו דקיק (`1px dashed var(--line-soft)`), ותוויות בצבע `var(--ink-soft)`.
- **בקרות טפסים (Inputs, Selects):** הסרת מסגרות כבדות; מעבר ל-Border מעודן (`1px solid var(--line)`), פינות ברדיוס 6px, ופוקוס עם הילת `var(--accent)`.
- **מתגים (Toggles):** עיצוב מחדש של כפתורי הבחירה (כגון שער ראשי, מניעת יתומות וכו') כ-Pills עדינים המחליפים צבע ל-`var(--accent-soft)` עם גופן `var(--accent)` במצב פעיל.
- **הבוררים הוויזואליים (Visual Card Selectors):** כרטיסיות העיטורים והשערים יעוצבו עם רקע לבן, צל עדין (`var(--shadow-s)`) ומסגרת שנצבעת ב-`var(--accent)` בעת בחירה.

## 4 התאמת עורך הטקסט (Text Pane)

העורך עובר מהטור הימני לטור השמאלי כדי לפנות את המרחב הטבעי לקריאת דפי הספר במרכז, ומקבל את המראה של Studio:

- **ראש העורך (`.pane-head`):** כותרת שקטה `טקסט המקור והזנה` עם סטטיסטיקת מילים ושורות מעודנת.
- **גוף העורך (`#raw-input`):** גלילה נקייה ללא מסגרות כפולות, גופן קריא ותורני (David Libre), ושמירה על כל מנגנון חוצצי העמודים הוויזואליים (`.page-break-divider`).
- **תחתית העורך (`.pane-foot`):** הצגת מקרא מקוצר של קידומות תורניות (`כותרת 1: שער` · `כותרת 2: פרק` · `[הערה]` · `ד"ה`) בדיוק כמו בסטודיו.

## 5 אלמנטים מומלצים מ"גרסה חדשה" להעברה בטוחה

האלמנטים המוצעים להלן הם **שכבות תצוגה בלבד (Add-ons)**. הם קוראים נתונים מה-DOM של גרסה משולבת 2 ואינם מתערבים בשום אופן באלגוריתמי החישוב של `performTypeset`.

1. תיבת חיפוש וסינון מהיר בלוח ההגדרות (Settings Search Filter)
בטוח ב-100% · תצוגה בלבד

בלוח ההגדרות יש מעל 120 פקדים שונים ב-10 פאנלים. הוספת תיבת חיפוש בראש הפאנל מאפשרת להקליד למשל "סימן" או "יתומות" ומסננת מיידית את שורות ההגדרה הרלוונטיות, ופותחת את הפאנל המתאים אוטומטית.

2. סליידר זום ידני מדויק בסרגל התצוגה (Zoom Scale Slider)
בטוח ב-100% · שליטה ב-CSS

בגרסה 2 הזום נגזר אוטומטית מרוחב החלון. הוספת סליידר זום (50% עד 150%) בסרגל התצוגה המרכזי ששולט ישירות במשתנה `--preview-scale` הקיים, ומאפשר לראות את הדפים בגודל הרצוי ללא קשר לרוחב המסך.

3. שכבת גריד בסיס ומסגרות אבחון (Diagnostic Overlays)
בטוח ב-100% · שכבת CSS שקופה

מתג בסרגל המרכזי שמפעיל קווי גריד בסיס עדינים על גבי דפי ה-A4 ומסגרות מזהות לטורים (`show-boxes`) עבור בחינה מדויקת של פילוס שורות ויישור תחתית, ללא השפעה על הדפסה.

4. רצועת מדדים חיים בראש המסך (Live Stats Ribbon)
בטוח ב-100% · קריאה בלבד

הצגת קוביות מדד מהירות בראש הדף: מספר עמודים סופי, סך מילים, סך הערות שוליים, וזמן עימוד במילי-שניות (נמדד ב-`performance.now()` בתוך `performTypeset`).

5. מערכת חיווי קופצת צפה (Toast Notification)
בטוח ב-100% · UI בלבד

החלפת פקודות ה-`alert()` החוסמות (בעת שמירת תבנית, ייצוא JSON, או טעינת תיקיית עיטורים) בהודעה קופצת ומעוצבת בתחתית המסך שנעלמת מעצמה לאחר 3 שניות.

## 6 שלבי היישום (Checklist)

1. **שלב א' — CSS:** החלפת קובץ `style.css` במערכת הסגנונות החדשה המבוססת על משתני הסטודיו (White/Canvas/Accent/Ink), תוך שימור מלא של סגנונות הדפסת A4 ועיצובי הגופנים התורניים.
2. **שלב ב' — HTML:** עדכון מעטפת `index.html` לגריד התלת-טורי (הגדרות בימין, דפים במרכז, עורך בשמאל), הטמעת ה-Header וה-Stats Ribbon בראש הדף, מבלי לשנות אף מזהה ID של פקד.
3. **שלב ג' — JS עזר:** הוספת פונקציות ה-Scale Slider, ה-Stats Ribbon, וה-Search Filter לקובץ `app.js` ללא נגיעה בליבת `typesetter.js` ו-`decorations.js`.
4. **שלב ד' — בדיקת אימות:** וידוא שכל בוררי ה-JSON, כפתורי ה-Drag & Resize של תיבות השער, סורק תיקיית העיטורים, וההדפסה ל-PDF מתפקדים ב-100% ללא שינוי תוצאה.
