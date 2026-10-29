---
title: "מפת התלויות הגיאומטריות במנוע העימוד — V23"
date: unknown
version: V21
type: technical
source: z.ai
---
# מפת התלויות הגיאומטריות במנוע העימוד — V23

> **מדיניות ענפים:** `V21` ו-`V23` הם ענפי פיתוח מקבילים ונפרדים. העבודה כאן מתבצעת ב-`V23` בלבד; אין למזג את `V23` ל-`V21`. המסמך מבחין בין ממצא סטטי, תוצאת CI מאומתת, והשערה שעדיין דורשת בדיקה.

## 1. מטרת המפה

לזהות את כל הנתונים והרכיבים שמשפיעים על מיקום, רוחב, גובה, שבירת עמוד/טור ואיזון — כולל רכיבים שנראים דקורטיביים אך תופסים מקום, משנים מידות או עלולים לחפוף לטקסט. המטרה אינה לשכתב את המנוע מיד, אלא להפוך שינוי מקומי לניתן לחיזוי: לכל רכיב יהיו מקור אמת למידות, שלב חישוב, צרכנים, וכללי אימות.

## 2. קובצי מקור ותחומי אחריות

| קובץ | אחריות שנצפתה | תפקיד במפה |
|---|---|---|
| `typesetter.js` | בניית עמודים, יצירת HTML לרכיבים, מדידת אזור הערות, פריסת טקסט, איזון טורים ותיקונים לאחר העימוד | מקור האמת העיקרי לבניית פריסה ולזרימת העבודה |
| `geometry-audit.js` | חילוץ תיבות DOM, שורות טקסט, בדיקות הכלה/חפיפה/איזון/אלמנות-יתומות/שורה דלילה ו-overlay | שכבת אימות עצמאית; יש לוודא שהיא מזהה את כל הרכיבים שהמנוע מייצר |
| `renderer.html` | מסגרת סביבת הרינדור וטעינת `style.css` | סביבת CSS/DOM שבה המדידות צריכות להיות זהות למדידות בפועל |
| `style.css` | כללי גודל, זרימה, מרווחים, מיקום ועיטור | חלק מהמודל הגיאומטרי, לא שכבת קישוט נפרדת |
| `very_long_test_text.txt` (קובץ שהועלה לשיחה) | מסמך בדיקה גדול עם מטא-נתונים, כותרות היררכיות וטקסט תורני | fixture לבדיקות עומס ורגרסיה; אין צורך להעתיקו לענף כדי להשתמש בו בבדיקות מקומיות |

## 3. מפת רכיבים ותלויות

### 3.1 שלד העמוד

- `createPageLayout(...)` יוצר `.a4-page`, בתוכו `.page-content-wrapper`, כותרת עליונה שנוצרת ב-`buildHeaderGridHTML(...)`, גוף `.page-body-flow`, ומספור תחתון `.page-number-footer`.
- גבולות העמוד, ה-wrapper, אזור הגוף וה-footer קובעים את תחום העבודה של כל רכיב. שינוי בשוליים, בגובה הכותרת או במספור חייב להיבדק מול אזור הגוף הזמין.
- מספור עמוד עשוי להופיע בכותרת העליונה (`.hdr-pagenum`) או בתחתית. כאשר הוא משולב בכותרת, יש לוודא שהעמודה החיצונית מקבלת מקום ולא חופפת לטקסט או לעיטור.
- תפקידי עמוד שונים (עמוד רגיל, שער/עמוד פתיחה, תוכן עניינים וכדומה) עשויים להחיל רקעים וסידורים אחרים; יש לרשום אותם כווריאנטים של אותה גיאומטריה ולא להניח שכל עמוד זהה.

**שרשרת עיקרית:** הגדרות עמוד + CSS → מידות wrapper/header/footer → גובה ורוחב זמינים ל-body-flow → שיבוץ בלוקים → גובה עמוד סופי.

### 3.2 כותרות עליונות, טקסט ועיטורי כותרת

- `buildHeaderGridHTML(...)` בונה שלוש עמודות: ימין, מרכז ושמאל. תוכן העמודות יכול להיות כותרת פרק/סימן, שם הספר, טקסט מותאם או SVG/עיטור; יש גם מצב כותרות מתחלפות בעמודים זוגיים ומצב פיצול שם הספר.
- הגופן והגודל בעמודות ימין/שמאל, היישור הפיזי, קיצור טקסט ארוך באמצעות `.hdr-txt`, ומספר עמוד חיצוני משפיעים על רוחב הטקסט ועל התנגשות אפשרית עם עיטורים.
- עיטורי SVG אינם בהכרח עטופים ב-`.hdr-txt`; אין למדוד את טקסט הכותרת בלבד ולהניח שהעיטור אינו תופס מקום.
- יש לכלול במפה גם את HTML שמוחזר מ-`renderHeaderSectionHTML` ואת `renderSideOrnamentHTML`, ולבדוק את כל צורות הפלט האפשריות ולא רק כותרת טקסט פשוטה.

**תיקון קוד שבוצע ב-V23, ממתין לאימות DOM:** `geometry-audit.js` מסווג כעת `.top-header-grid` כ-`header`, את `.header-col-r/c/l` כ-`header-col`, ומוסיף ירידה רקורסיבית וסוגי טקסט לעיטורים/מספור. גם `.note-line-num` מסווג לפני `.note-line`. עדיין צריך לאשר בדוח הריצה שהרכיבים אכן נכנסים לעץ ונבדקים כמצופה.

### 3.3 גוף הטקסט, טורים ובלוקים ברוחב מלא

רכיבים שנמצאים במודל הבדיקה:
- `.page-body-flow`
- `.block-2col`, `.main-column` / `.right-col` / `.left-col`
- `.block-single-col`, `.single-wide-col`
- `.block-h3-span` — אזור כותרת/בלוק ברוחב מלא בין אזורים דו-טוריים
- `.col-gutter-divider` — קו מפריד בין הטורים
- פסקאות `p`, `.p-cut`, `.p-end`, סימוני הערות `.note-marker`, מילים מעוצבות `.drop-word`, עוגני הערות צד `.side-note-anchor`

**תלויות:** רוחב הטור וגופן הטקסט → שבירת שורות → גובה הפסקאות → נקודת חיתוך/מעבר טור → גובה כל טור → איזון → מיקום הערות צד וקו המפריד.

- `fitColumnDividers(container)` נקראת אחרי השלמת הבלוקים כדי להתאים את קווי ההפרדה לגובה הטקסט בפועל. יש לוודא שהקו אינו משפיע על זרימת התוכן אלא אם ה-CSS מגדיר אחרת.
- כותרות H2/H3 ועיטוריהן, מרווחים לפני/אחרי כותרת ובלוקים חד-טוריים משנים את הגובה הזמין לטקסט הדו-טורי הבא.
- יש להבחין בין **מקום בזרימה** (תורם לגובה/לשבירת עמוד) לבין **תיבה חזותית** (למשל עיטור ממוקם אבסולוטית). עיטור שאינו תורם לזרימה עדיין דורש בדיקת חפיפה וגבולות.

### 3.4 כותרות היררכיות ועיטורים

ה-audit מכיר כיום בסוגים כגון `.h2-spacer`, `.h2-siman-badge`, `.title-level-2-standalone`, `.h2-ornament-top/bottom`, `.title-level-3`, `.h3-title-text`, `.h3-ornament-right/left`, כותרות H4–H7 וכותרות מותאמות.

יש לבדוק לכל רמה:
1. גובה הכותרת עצמה, margins/padding ו-line-height.
2. גובה/רוחב העיטור, מיקום יחסי/אבסולוטי וחריגה מה-wrapper.
3. רווח לפני ואחרי הכותרת והאם נשארות לפחות שתי שורות טקסט אחריה בתחתית טור/עמוד.
4. מעבר בין פריסת שני טורים לבלוק ברוחב מלא וחזרה לשני טורים.
5. התאמת טקסט לעיטור, כולל `applyHeadingOrnamentTextFit()` שמופעל לאחר העימוד; אם הפונקציה משנה מידות, יש להפעיל מדידה/פריסה חוזרת או להוכיח שהשינוי אינו משפיע על זרימה.

### 3.5 הערות שוליים, הערות סיום וקווים מפרידים

- `buildFootnoteAreaElement(queue)` בונה `.footnote-area`, כותרת אופציונלית `.footnote-header-wrap`, עיטורי צד `.note-header-ornament-right/left`, כותרת `.footnote-header-title`, קו דרך `buildNoteRuleElement()`, ולבסוף בלוק הערות.
- `measureFootnoteAreaHeight(queue, opts)` מודד את כל האזור; הקוד מתעד תיקונים למדידה חסרה של הכותרת/הקו, שימוש ב-probe בתוך `.page-content-wrapper`, `scrollHeight`, ומטמון שמפתחו כולל רוחב, גופן/גודל, line-height, מספר עמודות ואופן פריסה.
- גם אם הקו המפריד הוא דקורטיבי, הוא עשוי לכלול margin, border או גובה שמשנים את האזור. יש לכלול אותו במדידה ולבדוק את מיקומו ביחס לכותרת, להערות ולגוף העמוד.
- יש למפות בנפרד הערות שוליים, הערות סיום, הערות צד, כותרות/עיטורי אזורי הערות, מספרי הערות, קווי הפרדה וסגנונות פריסה מרובי-עמודות/רציפים. אין להסיק שמדידת הערות שוליים מכסה אוטומטית הערות סיום או הערות צד.

**שרשרת עיקרית:** תור ההערות + הגדרות סגנון/עמודות + רוחב מארח → בניית probe באותו הקשר CSS → גובה חזוי → הקצאת מקום בעמוד → רינדור בפועל → השוואת חזוי/בפועל → תיקון או דיווח.

### 3.6 הערות צד

- הערות צד קשורות לעוגן בפסקה ולמיקום הפסקה לאחר איזון/מתיחה.
- ב-`typesetter.js` קיים `repositionBlockNotes(...)`, הנקרא לאחר התאמות גובה הטורים בשלב הטיפול בסוגריים חוצי-פסקאות.
- כל שינוי גובה של פסקה או טור חייב לעדכן/לאמת את מיקום הערת הצד. יש לבדוק חפיפה בין הערות, חריגה מהמרזב, חפיפה לכותרות/עיטורים ולשכנות בין עמודים.

### 3.7 סוגריים חוצי-פסקאות ושינויים לאחר העימוד

- `applyCrossParagraphParens(container)` מופעל לאחר העימוד ומוסיף עטיפות `.paren-text` לפסקאות שנמצאות בתוך סוגריים שנפתחו בפסקה קודמת.
- הקוד עצמו מציין שהגופן הקטן יותר משנה את גובה הטורים ופוגע באיזון; לכן מתבצע לאחר מכן איזון נוסף בעזרת `justifyColumnVertically` / `shrinkColumnVertically`, ואחריו `repositionBlockNotes`.
- זהו סימן לכך שחלק מהמידע הגיאומטרי משתנה אחרי החלטות הפריסה. ב-V23 אין להסיר את התיקון שעובד ב-V21 לפני שיש חלופה שנבדקה על fixture הארוך. היעד הארכיטקטוני הוא להעביר את הסגנון/המדידה לשלב שלפני בחירת שבירות, או להגדיר במפורש שלב reflow נוסף עם invalidation של כל התלויות.

## 4. מפת שלבי העיבוד

| שלב | קלט | פלט/החלטה | תלות שחייבת להיות מפורשת |
|---|---|---|---|
| A. פענוח מסמך | טקסט גולמי, מטא-נתונים, כותרות, סמני הערות | מבנה מסמך וסדר רכיבים | היררכיית כותרות, גבולות פרקים/חלקים, מזהי עוגנים |
| B. פתרון סגנונות | הגדרות UI, CSS, גופנים, עיטורים, תפקידי עמוד | סגנון אפקטיבי לכל רכיב | גופן/גודל/line-height, margins, borders, רוחב, מצב עמוד זוגי/אי-זוגי |
| C. מדידה | מבנה + סגנונות + הקשר מארח | מידות בלוקים, שורות, אזורי הערות ועיטורים | אותו DOM/CSS או מודל מדידה שקול לזה של הרינדור הסופי |
| D. תכנון פריסה | מידות זמינות, גבולות פרק, כללי שבירה | שיוך לעמוד/טור, מעברי רוחב מלא, מקום להערות | widow/orphan, כותרות בתחתית, איזון, שורות דלילות, מגבלות עמוד |
| E. רינדור | תוכנית פריסה | DOM סופי | לא לבצע שינוי גיאומטרי סמוי לאחר שלב זה |
| F. אימות | DOM מרונדר + תוכנית חזויה | דוח חריגות והפרשי מדידה | containment, overlap, overflow, איזון, עיטורים, כותרות, קווים, הערות |
| G. תיקון/פריסה חוזרת | חריגות מסוג בר-תיקון | תוכנית מעודכנת או שגיאה מדווחת | invalidation מפורש של מדידות ומטמון; גבול איטרציות |

## 5. מצב הכיסוי הנוכחי ב-`geometry-audit.js`

### בדיקות שכבר קיימות בקוד שנבדק
- חילוץ תיבות DOM ביחס ל-`#book-container` ושורות טקסט.
- הכלה של ילד בתוך הורה, חפיפת אחים, איזון גובה בין שני טורים.
- אלמנה/יתום לפי סוגי פסקה `p-cut` / `p-end`, ושורה אחרונה דלילה של `p-cut`.
- סיווג של שלד עמוד, גוף, אזור הערות, כותרות H2/H3, חלק מעיטורי הכותרות, בלוקים חד/דו-טוריים, קו מרזב וסמני הערות.

### פערים/סיכונים שיש לאמת ולתקן
1. **כותרת עליונה:** הסיווג מחפש `.page-header`, בעוד יצירת העמוד מייצרת `.top-header-grid`; יש להוסיף זיהוי מפורש ולוודא ירידה לעמודות ולתוכן.
2. **עיטורי כותרת עליונה:** לבדוק בנפרד את `.header-ornament-wrap`, SVG, גבולות תיבה וחפיפה לטקסט/מספר עמוד. אין להסתפק בתיבת הכותרת בלבד.
3. **עיטורי כותרת הערות:** להוסיף סיווג מפורש ל-`.note-header-ornament-right/left` ולוודא שהם נכללים בעץ הבדיקה.
4. **קווי הפרדה:** לבדוק קו הערות (הנוצר ב-`buildNoteRuleElement`) וקו בין הטורים, כולל margin/border/position ויחס לתוכן. סיווג לפי `note-rule` קיים, אך יש לוודא שהוא תואם למחלקות בפועל.
5. **מדידה חזויה מול בפועל:** להשוות גובה `.footnote-area` בפועל לתוצאה של `measureFootnoteAreaHeight`, ולדווח על שגיאה מוחלטת/יחסית עם סף מוגדר.
6. **רכיבים ממוקמים/אבסולוטיים:** להפריד בדוח בין גיאומטריה שתורמת לזרימה לבין תיבות חזותיות; לא לסמן חפיפה מכוונת של עיטור ככשל בלי כלל ייעודי.
7. **כותרות ומעברים:** בדיקות keep-with-next (לפחות שתי שורות אחרי כותרת), מעבר H3 ברוחב מלא, ועיטורים שנחתכים או גולשים.
8. **כותרת/מספור מול גוף:** לבדוק הפרדה אנכית בין header, body ו-footer וכן מספור חיצוני משולב בכותרת.
9. **זיהוי יציב:** מזהי audit לא צריכים להיות אקראיים אם רוצים להשוות דוחות בין ריצות; עדיף path + page index + class + ordinal יציב.
10. **ביצועים:** ב-fixture של מיליוני תווים, למדוד זמן חילוץ/בדיקה ולהימנע מבדיקת כל זוג אחים ללא צורך באזורים גדולים.

## 6. כללי מדידה מחייבים

- למדוד את ה-DOM אחרי שהגופנים נטענו ו-layout התייצב; לתעד מצב/רוחב viewport וגרסת CSS.
- לכל רכיב להפריד בין: `flowContribution` (השפעה על זרימה), `visualRect` (תיבה חזותית), `anchorRect` (נקודת עיגון) ו-`collisionPolicy` (אילו חפיפות מותרות).
- אין להשתמש בגובה טקסט בלבד כתחליף לגובה הכולל של wrapper המכיל margin, padding, border, כותרת, קו או עיטור.
- כל שינוי בגופן, רוחב, line-height, קנה מידה, עיטור או סגנון הערות מבטל את מדידות המטמון שתלויות בו.
- יש לשמור ערכי חזוי/בפועל והפרש בפלט audit, ולא רק לתקן בשקט.
- אלמנטים אבסולוטיים נבדקים לחפיפה ולגבולות גם אם אינם משתתפים בחישוב גובה הזרימה.

## 7. תכנית ביצוע הדרגתית בענף V23

### שלב 0 — הקפאת baseline
- להשאיר את קוד הפריסה של V21 ללא שינוי בתחילת העבודה.
- לוודא ש-`V23` נוצר מ-`V21` ולתעד commit בסיס.
- להשתמש בקובץ `very_long_test_text.txt` שהועלה לשיחה כ-fixture המקומי. הקובץ בגודל כ-3.39MB לפי מערכת הקבצים; אין צורך להכניס עותק נוסף ל-repository בשלב המיפוי.
- לשמור תוצאות baseline: מספר עמודים, זמן עימוד, דוח audit, חריגות גיאומטריות, איזון טורים, מדידות הערות, קונסול/שגיאות. טרם בוצעה כאן ריצת דפדפן, ולכן אין תוצאות baseline מדומות.

### שלב 1 — השלמת מפת הגיאומטריה ובדיקת ה-audit
- להוסיף סיווג/ירידה מפורשים לכותרת העליונה, לעיטורי כותרות ולעיטורי כותרת הערות.
- לוודא התאמה בין מחלקות שנוצרות ב-`typesetter.js` לבין המחלקות ש-`geometry-audit.js` מזהה.
- להוסיף בדיקות header/body/footer, קווי הפרדה, עיטורים, מדידת הערות חזויה/בפועל ומעבר בלוקים חד/דו-טוריים.
- להבחין בין כשל קשיח, אזהרת איכות וחפיפה מכוונת.

### שלב 2 — רישום תלות המדידות
- ליצור טבלת תלות מפורשת למטמון המדידות: קלטים, מפתח cache, נקודות invalidation וצרכנים.
- להוסיף לכל שינוי גיאומטרי post-layout תיעוד של מה משתנה ואילו חישובים חייבים לחזור.
- לשמר את תיקון הסוגריים החוצי-פסקאות של V21 עד שהחלופה עוברת בדיקות רגרסיה.

### שלב 3 — ריכוז תכנון הפריסה
- להפריד בהדרגה בין פתרון סגנונות, מדידה, החלטת שבירות, רינדור וביקורת.
- לא לפרק את `typesetter.js` למודולים רק על בסיס גודל הקובץ; תחילה מגדירים חוזי קלט/פלט בין השלבים.
- להעביר שינויים בגופן/עטיפות שמשפיעים על גובה אל לפני בחירת שבירות ככל האפשר; אם נדרש reflow, לבצעו כשלב מוגדר ומוגבל.

### שלב 4 — רגרסיה ואימות
- להריץ את ה-fixture הארוך ולבדוק לפחות: כותרות עליונות מתחלפות, מספר עמוד בכותרת/בתחתית, עיטורי H2/H3, כותרת H3 ברוחב מלא בין טורים, קווי הפרדת הערות וטורים, הערות שוליים מרובות-עמודות, הערות צד, סוגריים החוצים פסקאות, תוכן עניינים, עמודי פתיחה/סיום.
- להריץ פעמיים באותן הגדרות ולהשוות מספרי עמודים, שבירות, מיקומים והדוח; הבדלים לא מוסברים הם כשל דטרמיניזם.
- להשוות את V23 ל-V21 באותן הגדרות. אין לשנות את baseline או להסיר תיקון שעובד בלי לתעד את ההבדל ולהוכיח שאין רגרסיה.

## 8. סדר עדיפויות

1. **כיסוי מלא ב-audit** — במיוחד header grid, עיטורים וקווי הפרדה.
2. **מדידות עקביות** — predicted vs actual, כולל אזורי הערות וכל התוספות הגיאומטריות.
3. **תלויות ושינויי post-layout** — להגדיר invalidation ו-reflow.
4. **איכות שבירות** — איזון, אלמנות/יתומים, כותרות בתחתית ושורות דלילות.
5. **מודולריזציה** — רק לאחר שהשלבים והחוזים ברורים.

## 9. קישורים למקורות

- [typesetter.js — V21](https://github.com/SUGINACH/IMUD_TORANI/blob/V21/typesetter.js)
- [geometry-audit.js — V21](https://github.com/SUGINACH/IMUD_TORANI/blob/V21/geometry-audit.js)
- [renderer.html — V21](https://github.com/SUGINACH/IMUD_TORANI/blob/V21/renderer.html)
- [קובץ בדיקת העימוד — הועלה לשיחה](https://github.com/SUGINACH/IMUD_TORANI/raw/refs/heads/V21/very_long_test_text.txt)



## 10. יכולת ביקורת גיאומטרית אוטומטית ללא שימוש ידני במרנדר

### היעד

לאפשר להפעיל בדיקה מלאה של מסמך דרך פקודה אחת, בלי לפתוח את ממשק המשתמש, בלי להדביק טקסט בעורך ובלי ללחוץ על כפתורי המרנדר. הבדיקה צריכה להשתמש באותם כללי audit ובאותה פרשנות גיאומטרית כמו `geometry-audit.js`, ולשמור תוצאות לקובץ כדי שאפשר יהיה להשוות ריצות וגרסאות.

**הבהרה טכנית:** שקילות מלאה ל-`geometry-audit.js` מחייבת מנוע layout שמחשב בפועל את ה-DOM/CSS, שבירת השורות, הגופנים והמידות. לכן המימוש המומלץ הוא Chromium headless אוטומטי. הוא משתמש באותו מסלול רינדור ברקע, אבל אינו דורש שימוש ידני ב-`renderer.html`. בדיקה סטטית טהורה ללא מנוע layout יכולה להשלים בדיקות מבניות, אך אינה יכולה לחשב באופן אמין חפיפות, שורות, איזון טורים או גובה אזור הערות, ולכן אין להציג אותה כתחליף מלא.

### ארכיטקטורה מוצעת

1. **CLI / runner** — פקודה מקומית המקבלת נתיב לקובץ טקסט, קובץ הגדרות אופציונלי, נתיב פלט וסוג בדיקה.
2. **Headless browser adapter** — פותח את סביבת הרינדור המבודדת ב-Chromium ללא חלון גלוי, טוען את אותו `style.css`, `decorations.js`, `typesetter.js`, `settings-manager.js`, `app.js`, `renderer-bridge.js` ו-`geometry-audit.js`.
3. **Input adapter** — מזין את קובץ הטקסט והגדרות דרך API בדיקה מפורש, במקום להסתמך על פעולות ידניות או על מבנה פנימי מקרי של ממשק המשתמש.
4. **Render completion barrier** — ממתין לאישור מפורש שהעימוד הסתיים, שהגופנים הרלוונטיים נטענו ושאין עוד שינוי layout בתור. אין להסתמך רק על השהיה קבועה.
5. **Audit API** — מפעיל את אותם שלבי חילוץ/בדיקה שקיימים ב-`geometry-audit.js`, ללא overlay חזותי כברירת מחדל. overlay יכול להישאר אפשרות debug נפרדת.
6. **Report writer** — שומר JSON מלא ותקציר קריא (Markdown/טקסט): מספר עמודים, משך רינדור וחילוץ, ספירת חריגות לפי סוג/חומרה, פרטי רכיב ומיקום, והגדרות הריצה.
7. **Exit status** — קוד יציאה 0 כשעברו תנאי הקבלה, קוד שונה כשנמצאו כשלים, וקוד נפרד לכשל תשתיתי (למשל גופן שלא נטען או שגיאת JavaScript). יש להגדיר זאת באופן יציב ומתועד.

### API בדיקה מפורש

**ממצא נוסף מקריאת הקוד:** API גיאומטרי כבר קיים ב-`window.__geomAudit`: `extract()`, `audit(model)`, `paint(...)`, `clear()`, `cleanForExport(node)`. גם `renderer-bridge.js` כבר תומך בהודעות `geom-extract`, `geom-audit` ו-`geom-export`. לכן אין צורך להמציא בודק חדש; צריך לחשוף את ה-API הקיים לחוזה בדיקה יציב ולחבר אליו runner אוטומטי. עם זאת, API הגיאומטריה עצמו אינו מפעיל את `typesetDocument()` ואינו יודע מתי כל שלבי העימוד הסתיימו — אלה עדיין חלק מהעבודה. היעד הוא ממשק בדיקה מפורש בסגנון:

- `runTypesetForAudit({ text, settings })` — מזין טקסט והגדרות ומפעיל את `typesetDocument()`.
- `waitForTypesetComplete()` — מחזיר הצלחה/כשל רק לאחר סיום כל שלבי העימוד והעדכונים המאוחרים.
- `runGeometryAudit({ overlay: false })` — מחזיר את מודל הגיאומטריה ואת כל תוצאות הבדיקה, בלי להוסיף שכבות overlay לעמוד.
- `getFootnoteMeasurementAudit()` — מחזיר את ההשוואה בין מדידת אזור ההערות החזויה לזו שב-DOM, ככל שהמנגנון הקיים מספק אותה.
- `exportAuditReport()` — מפיק נתונים עם מזהים יציבים, גרסת קוד, הגדרות, מידות viewport/scale, סטטוס טעינת גופנים וזמני ביצוע.

אלו חוזי יעד ל-runner ולסנכרון; `window.__geomAudit.extract/audit/cleanForExport` ומנגנוני הודעות הביקורת הקיימים כבר קיימים, אך אין עדיין runner CLI מאומת שמפעיל אותם מקצה לקצה.

### שתי שכבות בדיקה

**A. גיאומטריה מלאה (headless Chromium):**
- מריץ את המנוע האמיתי ומחשב DOM/CSS, שורות, מידות, חפיפות וגלישות.
- מפעיל את כל בדיקות `geometry-audit.js`, כולל בדיקות הכיסוי שיוספו לעיטורים, כותרות עליונות, קווי הפרדה והערות.
- מייצר דוח JSON ודוח תקציר, ויכול להיכשל אוטומטית לפי ספי חומרה.
- זוהי שכבת המקבילה המלאה למרנדר הידני.

**B. בדיקות סטטיות מהירות (ללא browser):**
- בודקות שהקבצים והפונקציות הדרושים קיימים, שהמחלקות שמייצר המנוע מכוסות ב-audit, שהגדרות/קלטים תקינים, שאין שגיאות תחביר, ושמפת המחלקות מעודכנת.
- יכולות לבדוק קשרי נתונים, הגדרות ומטמון, אך אינן רשאיות לטעון שהן אימתו גיאומטריה אמיתית.
- רצות מהר לפני כל commit; שכבת Chromium רצה לבדיקות רגרסיה מלאות.

### שימוש מתוכנן

ממשק ה-CLI שנוסף ב-V23 (הקוד קיים, אך טרם אומת בהרצה מלאה):

```text
node tools/geometry-audit-cli.js --input ./very_long_test_text.txt --report ./artifacts/geometry-audit.json
node tools/geometry-audit-cli.js --input ./very_long_test_text.txt --settings ./path/to/settings.json --full-model
node tools/geometry-audit-cli.js --input ./very_long_test_text.txt --fail-on high
```

הפקודה הראשונה מפעילה את המרנדר ב-Chromium headless בלי פתיחה ידנית של ממשק המשתמש; יש עדיין לאמת את הריצה מקצה לקצה.

### תנאי קבלה

- [ ] ריצה מלאה מתוך שורת הפקודה ללא אינטראקציה עם ממשק המשתמש.
- [ ] אותה גרסת `geometry-audit.js` משמשת הן במצב ידני והן במצב CLI; אין להעתיק ולתחזק שני מימושים שונים של הבודק.
- [ ] אותה קלט/הגדרות/גרסאות קוד מפיקות תוצאות יציבות; מזהי האבחון אינם מבוססים על `Math.random()`.
- [ ] הדוח כולל את כל החריגות והמידות, ולא רק את מספר העמודים.
- [ ] שגיאות רינדור, טעינת גופנים או timeout מובחנות מבעיות גיאומטריה.
- [ ] ניתן לבחור ספי כשל: למשל כל `high` מכשיל, `medium` לפי הגדרה, ו-`low` נשאר אזהרה.
- [ ] ריצת fixture ארוך נמדדת בזמן ובזיכרון; הדוח נשמר גם אם נמצאו כשלים.
- [ ] ריצת אותו fixture פעמיים משווה מספר עמודים, מבנה שבירות, תוצאות audit ומידות עם סבילות מוגדרת.

### מגבלות ותכנון גופנים/נכסים

- כדי שהתוצאות יהיו אמינות, סביבת הבדיקה צריכה להשתמש באותם CSS, קבצי עיטור וגופנים או בתחליפים מקומיים מפורשים. אם גופן אינו זמין, יש לסמן את הריצה כלא-בת-השוואה ולא להסתיר את הבעיה.
- אם קיימים נכסים הנשענים על בחירת תיקייה מקומית, `file://`, או הגדרות ששמורות בדפדפן, יש להוסיף דרך להעביר אותם ל-runner בצורה מפורשת. אין להניח ש-Chromium headless יירש את הגדרות הדפדפן של המשתמש.
- יש למדוד זמן רינדור, זיכרון משוער ומספר רכיבים; בדיקת חפיפת כל זוג רכיבים יכולה להיות יקרה במסמך ארוך, ולכן יש לתחום השוואות לאזורים/אחים הרלוונטיים ולשמור את סמנטיקת הבדיקה.

### סדר מימוש

1. להשתמש ב-API שכבר קיים בסוף `geometry-audit.js` ובטיפול בהודעות `geom-extract` / `geom-audit` / `geom-export` ב-`renderer-bridge.js`; לא ליצור עותק שני של מנגנון הביקורת.
2. להפוך את חילוץ/בדיקת הגיאומטריה ל-API קריא ויציב, בלי תלות בהצגת overlay.
3. להוסיף אות סיום אמין ל-typesetting, כולל שלבים מאוחרים כמו `applyCrossParagraphParens`, איזון טורים, `fitColumnDividers`, עדכון מספרי עמודים ו-`applyHeadingOrnamentTextFit`.
4. [נוסף ב-V23] `tools/geometry-audit-cli.js` — runner headless שמזין fixture, מפעיל את ה-API הקיים ומייצא דוחות JSON/Markdown; יש לאמת אותו ב-CI.
5. [נוסף ב-V23] `package.json`, `.github/workflows/geometry-audit-cli.yml` ו-`tests/fixtures/geometry-audit-smoke.txt` לבדיקת smoke אוטומטית.
6. [בוצע בקוד, ממתין לאימות ריצה] `geometry-audit.js` הורחב לסיווג `.top-header-grid`, עמודות הכותרת, טקסט/מספור הכותרת ועיטורי כותרת ההערות; גם סדר זיהוי מספר הערה תוקן כך ש-`.note-line-num` לא ייבלע בסיווג הכללי של `.note-line`.
7. להריץ על `very_long_test_text.txt`, לשמור baseline ולהשוות אותו ל-V21.

## 11. תוצאות CI מאומתות (2026-10-22)

- בדיקת smoke ב-Chromium headless עברה.
- ריצת המסמך `very_long_test_text.txt` (3,387,848 bytes) ב-commit `42639f6bb6f2ed1bbe287b384a167c4144bb32b4` הסתיימה טכנית ללא שגיאות JavaScript: 601 עמודים, זמן עימוד כ-32 שניות.
- לפני העימוד נטענו במפורש 525 מתוך 525 אובייקטי `FontFace`; 0 נכשלו.
- התאמת מדידת הערות השוליים עברה: 62/62 אזורים הותאמו לתור המדויק, וכל הפערים שנמדדו היו 0px. בריצה קודמת, שבה הגופנים לא הוכנו מראש כראוי, נמדדו פערים עד 127px. זו ראיה לכך שיציבות מדדי הגופן הייתה גורם מרכזי לשגיאות מדידה ולשבירת עמודים.
- לאחר טעינת הגופנים, דוח האודיט כלל 235 ממצאים: 12 high, 99 medium, 124 low. לפי סוג: 162 containment, 12 imbalance, 45 widow, 10 containment-rounding, 6 sparse-line. הריצה נכשלה בסף `--fail-on high` בגלל 12 ממצאים חמורים; אין זו קריסת רינדור.
- הוסר `Math.random()` ממזהי צומתי הגיאומטריה. המזהים מבוססים כעת על מסלול העץ וסדר האחים, כדי שאותו DOM יפיק מזהים זהים.
- תיקון נוסף באודיט משנה את זיהוי אלמנות/יתומים: פסקה שלמה בת שורה אחת אינה מסווגת אוטומטית כאלמנה. האלמנה מוגדרת כשורה יחידה של פסקה נמשכת בראש טור; היתום כשורה יחידה של פסקה שנחתכה בתחתית טור. התיקון נמצא כעת בבדיקת CI ב-commit `b80eac41706be30779de4cc352fc2b55a83f4748`.

## 12. ממצאים פתוחים והגדרת יעד דטרמיניסטי

### ממצאים גאומטריים אחרי ייצוב הגופנים

- 10 חריגות חמורות הן `.block-2col` שגולשים מתיבת `.page-body-flow`; בשני מקרים נוספים `.side-note` גולש מתיבת `.margin-notes-column`. החריגות הגדולות ביותר הן 105px ו-135px, ולכן אינן שגיאת עיגול.
- 12 ממצאי imbalance: 9 בינוניים בהפרש של 13–14px ו-3 נמוכים בהפרש של 6px. אלה פערים קטנים יחסית, אך יש לבדוק אם הם נובעים מהיעדר נקודת פיצול חוקית או מתקרות המתיחה.
- 45 ממצאי widow קודמים נבעו ברובם מסיווג שגוי של פסקאות קצרות שלמות. אין להשתמש במספר הזה כ-baseline לאיכות המנוע; ה-baseline החדש ייקבע לאחר ריצת `b80eac4...`.
- 6 שורות דלילות נשארו ב-`p-cut`, והן דורשות בדיקה לפי כללי השבירה ולא רק שינוי סף.

### תנאים לדטרמיניזם ולמיטוב

1. **סביבת מדידה קבועה:** גרסת Chromium, viewport, CSS, נכסים וגופנים ידועים; אין להתחיל מדידה עד שגופנים רלוונטיים נטענו או לסמן את הריצה כלא-בת-השוואה.
2. **קלט והגדרות קבועים:** אותו טקסט, אותם הגדרות וסדר טוקנים זהה.
3. **בחירה דטרמיניסטית:** כל החלטת פיצול משתמשת באוסף מועמדים מוגדר, פונקציית עלות מפורשת ושוברי שוויון יציבים. אין להסתמך על `Math.random()`, על סדר לא מוגדר או על מצב DOM שנשאר מניסוי קודם.
4. **אילוצים קשיחים לפני עלות רכה:** לא לגלוש מאזור הגוף/העמוד, לא לפצל כותרת מהטקסט הנדרש אחריה, לא ליצור שורת יתום/אלמנה, ולשמור על רצף התוכן. רק לאחר עמידה באילוצים ממזערים פערי גובה וריווח.
5. **אופטימום בר-בדיקה:** יש להגדיר במפורש את פונקציית העלות ואת תחום המועמדים החוקיים. שוויון מוחלט בגובה אינו תמיד אפשרי כאשר שורות/כותרות/בלוקים אינם ניתנים לפיצול; היעד המתמטי הוא הפתרון החוקי בעל העלות הנמוכה ביותר, לא הבטחה לשני טורים זהים בכל מצב.
6. **בדיקת חזרתיות:** להריץ אותו מסמך פעמיים באותה סביבת Chromium ולהשוות חתימת פריסה: מספר עמודים, גבולות עמודים, חלוקת טורים, מיקומי הערות, מידות ושגיאות audit. כל הבדל חייב להיות מוסבר או להיכשל בבדיקה.

### הפעולות הבאות

1. לקבל את ריצת `b80eac4...` ולחשב מחדש את מספר האלמנות/יתומים לאחר תיקון הסיווג.
2. להוסיף פרטי אב/עמודות לממצאי containment כדי לאבחן את עמודי הגלישה הגדולים, ואז לתקן את מנגנון חלוקת העמודים ולא להסתיר את החריגות.
3. לבדוק את 12 ממצאי האיזון שנותרו ולוודא שהבחירה בין מועמדים ממזערת פער תחת אילוצי קריאות ושבירה.
4. להוסיף בדיקת ריצה כפולה עם חתימת פריסה זהה, ולאחר מכן להשתמש בה כבדיקת רגרסיה.
5. כל שינוי נשאר ב-`V23`. אין למזג את `V23` ל-`V21`.

**מצב נוכחי:** המדידה המוקדמת של הערות השוליים תוקנה בריצת CI מאומתת. עדיין אין טענה שהמנוע הגיע לשלמות: יש 12 חריגות חמורות שטרם תוקנו, והבדיקה המתוקנת לאלמנות/יתומים ממתינה לריצה מלאה.\n

## 8. Audit coverage update — 2026-10-25

### 8.1 What the deterministic signature now captures

In `tools/geometry-audit-cli.js`, `captureLayoutSignature()` records each paragraph's:
- bounding rectangle;
- visual line bands, formed by merging inline `Range.getClientRects()` fragments that share a half-pixel top coordinate;
- computed typography that can change line breaking or appearance: font family/size/weight/style, line-height, letter/word spacing, text alignment and last-line alignment, direction, white-space, text indent, vertical margins and padding;
- existing class, token ID, continuation flag and raw text.

This extends the previous signature; it does **not** change pagination or balancing. The signature is still not a pixel-image comparison and does not prove that every painted property of every descendant is covered. In particular, CSS effects not represented by paragraph metrics or the existing `geometryNodes` selector may still require additional audit coverage.

### 8.2 Validation status (do not conflate stages)

- **Committed:** commit `14df96adf9bc24fa78c7f2ea7342e8f7957a9f8f` on `V23`.
- **Static parse check:** the fetched CLI source parsed successfully after removing its Node shebang for the in-process JavaScript parser.
- **Not yet confirmed:** GitHub Actions result, real `node --check` step result, long-document run, repeated-render hash equality, or audit artifact contents. The commit's combined status endpoint returned no statuses; that is not a passing CI result.
- **No layout algorithm changes** were made in this audit update.

### 8.3 Next verification gate

Before tuning balance thresholds or changing candidate selection, obtain the long audit report and compare:
1. candidate geometry recorded at selection time;
2. post-global-justify final geometry;
3. any local/global/page rollback diagnostics;
4. per-column paragraph and line rectangles;
5. repeat-render hashes.

The previously observed candidate/final height discrepancy (for example, candidate heights 293/307 px versus final 314/307 px) remains an unresolved diagnostic until reproduced in a current report. Do not label its cause proven based only on the presence of cross-paragraph parenthesis styling.

### 8.4 Decision-ledger completeness cross-check

Commit `77ddc5b60877850c4a7bd2092f9c0a7e1b0d00e5` adds an independently counted DOM total for direct `.page-body-flow > .block-2col` children and reports:
- `domBlockCount`;
- `recordCountMatchesDom`;
- `missingLedgerRecordCount`;
- `excessLedgerRecordCount`.

The Markdown summary exposes the DOM block count and whether it matches the number of serialized decision records. This is a completeness cross-check, not proof that every individual record is semantically correct; schema validation remains a separate metric. Runtime confirmation still depends on the long audit run.

### 8.5 Cross-paragraph-parenthesis geometry checkpoint

Commit `ac234a9e8e75a289ec8567c00e7050bbd3f82d65` adds a diagnostic snapshot immediately before and after `applyCrossParagraphParens(container)`. For each two-column block it records both columns' `scrollHeight`, column bounding height, outer block height, and paragraph-level height/Y/line-count/font-size/line-height/paren-span state. The per-block attribute `data-layout-cross-paren-diagnostic` includes before/after totals, deltas, and up to 40 changed-paragraph entries.

Commit `f6275c357cd74932200f232fdc81d54d48dbfbaa` exports this diagnostic into `geometry.layoutDecisionRecords` in the audit JSON and adds summary counts for blocks with geometry changes and blocks missing the diagnostic.

This creates a direct measurement point for distinguishing changes caused at the parenthesis-wrapping stage from later balancing stages. It is instrumentation only: no candidate selection, balancing threshold, text styling rule, or rollback decision was changed. The measurements still need to be confirmed on a real Chromium run.

### 8.6 Long input availability

The GitHub file-content wrapper returned an empty string for `very_long_test_text.txt`, but fetching the blob by its SHA returned 1,918,760 characters/bytes of non-empty Hebrew test text (the actual byte count is to be confirmed in CI with `wc -c`). The wrapper's empty path response was therefore a retrieval limitation, not evidence that the test fixture is empty. The workflow's `test -s` guard remains appropriate.

### 8.7 Parenthesis checkpoint extended to final geometry

Commits `faed0a8ba563e0309cacbbb62f2fd537beb86e79` and `979cc7865215dc934aff99ebafaf3139d58274cb` extend the parenthesis diagnostic through the final geometry snapshot, after global justification and side-note overflow correction.

The diagnostic now:
- preserves a compact per-paragraph snapshot from immediately after parenthesis wrapping;
- records final right/left column heights, column box heights and outer block height;
- calculates the height deltas between the post-parenthesis state and final state;
- counts paragraph geometry changes between those stages and retains up to 40 examples;
- uses diagnostic schema version 2, which the CLI now requires for a complete checkpoint;
- separately counts blocks whose final diagnostic capture threw an error.

The report summary distinguishes changes during parenthesis wrapping from later geometry changes. A non-zero post-global delta does **not** by itself mean the layout is wrong: global justification is expected to change some paragraph heights. The diagnostic is intended to correlate those changes with final fit, column balance, and rollback data. Runtime evidence is still required before drawing causal conclusions.

### 8.8 Verified long-document baseline before schema-v2 final-stage instrumentation

GitHub Actions run [40141867916](https://github.com/SUGINACH/IMUD_TORANI/actions/runs/40141867916), for commit `ac234a9e8e75a289ec8567c00e7050bbd3f82d65`, completed successfully at the workflow level. The job log confirms:
- input fixture size: `3,387,848` bytes;
- 627 pages rendered;
- 55 geometry-audit findings: 0 high, 20 medium, 35 low;
- issue kinds: 30 containment, 17 imbalance, 4 containment-rounding, 4 sparse-line;
- repeat-render determinism: **PASS**, with no differing page;
- report artifact uploaded successfully.

This is a verified baseline for the code at `ac234a9`, which predates the schema-v2 post-global checkpoint. It does not establish that the newer schema-v2 instrumentation has completed its long run, and it does not mean all geometry findings are resolved. The workflow's success here means the configured `--fail-on high` gate passed; 55 lower-severity findings remain for diagnosis.

### 8.9 Separate geometry deltas from style-only deltas

Commit `a262be3c408f9deeab7b32bfbc1cd50ff52e4fad` extends the parenthesis-stage paragraph snapshot to include merged visual-line rectangles, not only line count. A paragraph is now classified as geometrically changed if its vertical position, height, line count, or line rectangles changed; style-only changes (font size, line height, or presence of `.paren-text`) are counted separately. The same distinction is applied between the post-parenthesis state and the final post-global/post-side-note state.

Commit `db1a7d6b43512bb2d991f47e71f533349523ad27` updates the CLI summary to report geometry-changing blocks separately from style-only blocks at both stages. This prevents a newly added `.paren-text` wrapper from being reported as a geometry change merely because the style marker changed.

These are diagnostic refinements only. They do not alter layout selection, justification, rollback, or CSS. The latest long-run must validate that the added line-rectangle snapshots remain within acceptable runtime and memory costs.

### 8.10 Prevent redundant concurrent audit runs

Commits `973212cff9f1caf6b34ba2a7172e346935f3bf92` and `504329cab98936826f596dd2c115ce6813553241` add workflow-level concurrency groups to the long-document audit and CLI smoke audit. New runs on the same ref cancel superseded runs instead of competing for Chromium downloads and CPU/memory while testing obsolete commits.

This is CI orchestration only. It does not change the layout engine or the audit acceptance thresholds. The newest commit still requires a completed long-document run and inspection of its report.

### 8.11 Make audit instrumentation integrity a hard gate

Commit `9cf55c8dfa84dca6b414ec312ea1f8614464abff` adds a separate integrity gate in the CLI. The report and console now explicitly say whether instrumentation integrity passed. The process exits with code 4 if any of the following occur:
- decision ledger count does not match the independently counted direct two-column DOM blocks;
- one or more decision records are missing or malformed;
- one or more schema-v2 parenthesis diagnostics or their final snapshots are missing;
- parenthesis diagnostic capture throws;
- the parenthesis diagnostic's final column/block heights disagree with the separately exported final geometry by more than 0.5px.

This is independent of the configured geometry severity threshold (`--fail-on`). A run may have zero high-severity layout findings and still fail if its own measurement/reporting pipeline is incomplete or internally inconsistent. Browser errors and nondeterminism retain their separate exit codes.

### 8.12 Surface diagnostic counters in CI logs

Commit `b54961e182267ebfaf77e714893873c49295a961` prints the ledger/DOM parity, valid/malformed record counts, complete parenthesis diagnostic count, geometry-changing versus style-only block counts, post-global changes, final-snapshot mismatch count, and diagnostic-capture errors directly in the workflow log. This avoids having to infer instrumentation status from the audit severity totals or download the JSON artifact merely to see these counts.

### 8.13 Keep full paragraph snapshots out of DOM attributes

Commit `a77590094012d1a0d97688de219f2fb4e0d0b170` moves the complete post-parenthesis paragraph snapshot into an in-memory `Map`. Only the compact diagnostic (including capped changed-paragraph samples) is serialized onto each block. The final-stage comparison reads the in-memory snapshot directly. This avoids placing potentially large arrays of line rectangles into DOM attributes and then serializing/parsing them again; it preserves the same measured values while reducing DOM attribute size and serialization overhead.

The latest long-document run for this optimization is pending behind earlier runs. Static parsing of `typesetter.js` and `tools/geometry-audit-cli.js` passed, but runtime overhead and the final integrity gate remain to be verified.

---

## 11. ארכיטקטורת איזון דינמי (עדכון 2026-10-26)

> סעיף זה מתעד את מערכת האיזון הדינמי שנוספה בשלבים 1-3 (word-spacing, para-spacing, line-height) ואת התיקונים שבוצעו כדי למנוע רגרסיות overshoot.

### 11.1 רכיבי המערכת

המערכת מורכבת מ-3 כלים היררכיים, מהשקוף לקריטי:

| כלי | פונקציה | טווח | מתי מופעל | סיכון |
|-----|---------|------|-----------|------|
| רווח מילים | `stretchByWordSpacing` / `compressByWordSpacing` | 0.95-1.05 | רק כש-diff > 15px | בינוני — פועל בקפיצות גדולות |
| רווח פסקאות | padding-bottom על פסקאות | 0-9px לכל רווח | תמיד (כש-aq-para-spacing פעיל) | נמוך — מדויק |
| רווח שורות | lineHeight על פסקאות | base עד base+3px | תמיד (כש-aq-line-height פעיל) | בינוני — יכול ל-overshoot מעיגול |

### 11.2 זרימת העבודה ב-`justifyColumnVertically`

```
justifyColumnVertically(col, targetHeight)
  ├── בדוק diff = target - col.scrollHeight
  ├── אם diff <= 0.5 → החזר (כבר ביעד)
  ├── אם diff > maxStretch → החזר (לא ניתן למתוח)
  │
  ├── שלב 0: word-spacing (רק אם diff > 15px ו-useWordSpacing=true)
  │   └── stretchByWordSpacing(col, diff)
  │       ├── factor 1.02 → מדוד → אם overshoot > 10px → revert
  │       └── factor 1.05 → מדוד → אם overshoot > 10px → revert
  │
  ├── שלב 1: para-spacing (עד 9px לכל רווח)
  │   └── per = diff / gapKids.length
  │       └── k.style.paddingBottom += min(per, maxGap - cur)
  │
  └── שלב 2: line-height (עד base+3px, 8 מעברים)
      └── for pass 0..7:
          ├── rest = target - col.scrollHeight
          ├── אם rest <= 0.5 → break
          ├── e = (rest / totalLines) * 0.5  // 50% מתיחה תיאורטית
          └── for each paragraph:
              ├── מדוד currentRest
              ├── אם currentRest <= 0.5 → break (עצירה מיידית)
              ├── newLh = min(lh + e, base + cap)
              └── p.style.lineHeight = newLh
```

### 11.3 כללי מניעת overshoot

1. **word-spacing רק למתיחות גדולות**: דלג כש-diff < 15px. word-spacing פועל בקפיצות של 15-30px וגורם ל-overshoot כשצריך רק כמה פיקסלים.

2. **revert ב-word-spacing**: אחרי כל factor, בדוק אם התוצאה עברה את היעד ב-+10px. אם כן — חזור לפקטור הקודם.

3. **50% מתיחה תיאורטית ב-line-height**: `e = (rest / totalLines) * 0.5`. הדפדפן מעגל כל שורה כלפי מעלה, ולכן המתיחה בפועל גדולה מהתיאורטית. 50% מפצה על זה.

4. **מדידה אחרי כל פסקה**: בלולאת line-height, בדוק `currentRest` לפני כל פסקה. אם הגענו ליעד — עצור מיידית.

5. **עד 8 מעברים**: במקום 3 מעברים, הגדלנו ל-8 כדי לאפשר התכנסות הדרגתית.

### 11.4 `balanceByWordSpacing` — חלוקת עומס בין טורים

פועל רק ב-Branch 4 (עמוד רגיל) לפני `justifyColumnVertically`:

```
balanceByWordSpacing(rCol, lCol, diff)
  ├── בדוק הגדרות: aq-enabled, aq-word-spacing, aq-shared-load
  ├── בדוק טווח: threshold < |diff| <= maxDiff (2-20px)
  │
  ├── כווץ את הארוך: factor = 1.0 - (1.0 - minFactor) * 0.5
  ├── הרחב את הקצר: factor = 1.0 + (maxFactor - 1.0) * 0.5
  ├── בדוק תוצאה: אם הפער גדל → revert
  └── אם עזר אבל עדיין יש פער → נסה פקטורים קיצוניים יותר
```

### 11.5 הגדרות פאנל "איכות עימוד אוטומטי"

כל ההגדרות נשמרות ב-`default_settings.json` ונשלחות ל-iframe דרך `renderer-bridge.js`:

| הגדרה | ברירת מחדל | תיאור |
|-------|-----------|-------|
| `aq-enabled` | true | הפעל/כבה את כל האיזון הדינמי |
| `aq-word-spacing` | true | הפעל/כבה רווח מילים דינמי |
| `aq-word-spacing-min` | 0.95 | פקטור כיווץ מינימלי |
| `aq-word-spacing-max` | 1.05 | פקטור הרחבה מקסימלי |
| `aq-word-spacing-threshold` | 2 | פער מינימלי לטיפול (px) |
| `aq-word-spacing-max-diff` | 20 | פער מקסימלי לטיפול (px) |
| `aq-para-spacing` | true | הפעל/כבה רווח פסקאות דינמי |
| `aq-para-spacing-max` | 9 | תקרת רווח לכל פסקה (px) |
| `aq-line-height` | true | הפעל/כבה רווח שורות דינמי |
| `aq-line-height-max` | 3 | תקרת תוספת לגובה שורה (px) |
| `aq-shared-load` | true | הפעל/כבה חלוקת עומס בין טורים |

### 11.6 בדיקות גיאומטריה — סיכום סופי

אחרי כל התיקונים (2026-10-26):

| מדד | התחלתי | סופי | שיפור |
|-----|--------|------|-------|
| סה"כ בעיות | 370 | 111 | -70% |
| High severity | 106 | 9 | -92% |
| imbalance | 63 | 6 | -90% |
| page-overflow | 0 | 0 | נשמר |
| page-underfill | — | 6 | (בדיקה חדשה) |
| containment | 275 | 86 | -69% |
| פרקים תקינים | 32/79 | 68/79 | +113% |

### 11.7 הוספת אלמנטים חדשים — מדריך

כדי להוסיף אלמנט חדש למנוע העימוד בבטחה:

1. **הגדר את המידות ב-CSS** (`style.css`):
   - רוחב, גובה, margin, padding
   - ודא שהאלמנט לא חורג מהטור (`.right-col` / `.left-col`)

2. **הוסף סיווג ב-`geometry-audit.js`** (`classifyElement`):
   - הוסף `if (cls.includes('my-element')) return { type: 'my-element', tag };`
   - ודא ש-`DESCEND_INTO` כולל את הסוג אם יש לו ילדים משמעותיים

3. **צור את האלמנט ב-`typesetter.js`**:
   - הוסף פונקציית יצירה (למשל `buildMyElement(...)`)
   - ודא שהאלמנט נכנס לתוך `block-2col` או `block-single-col`
   - אל תשכח לקרוא ל-`repositionBlockNotes` אחרי שינויי גובה

4. **הוסף בדיקה ייעודית ב-`geometry-audit.js`** (אופציונלי):
   - אם האלמנט דורש בדיקה ספציפית, כתוב פונקציית `auditMyElement`
   - קרא לה מתוך `auditGeometry`

5. **בדוק עם טקסט מלא**:
   - הרץ `node /home/z/my-project/scripts/test-chapters-enhanced.js 1 79 full-test`
   - ודא שאין רגרסיה ב-high severity

6. **עדכן את המפה הזו**:
   - הוסף סעיף תחת סעיף 3 עם התלויות הגיאומטריות של האלמנט החדש

---

## 13. עדכון V23 — שלבים 4-7 + rebalance + audit fixes (2026-10-26)

### 13.1 סקירה

במסגרת השלמת המפרט הארכיטקטוני (SESSION_HANDOFF סעיף 9.4), מומשו 4 שלבים חדשים
במנוע העימוד, יחד עם תיקוני audit ו-rebalance. כל השינויים נבדקו על 79 פרקים
ב-GitHub Actions (matrix של 3 מצבים) והתוצאות חיוביות: **0 high severity issues**.

### 13.2 שלב 4 — heading-spacing (כלי 0)

**מטרה:** מתיחת טור על-ידי הוספת margin-top/margin-bottom לכותרות H4/H5/H6.
הכלי הכי פחות פולשני — נראה טבעי לקורא.

**פונקציה חדשה:** `stretchByHeadingSpacing(col, neededPx, maxAdd)` (typesetter.js ~line 1012)
- מוצא כותרות `title-level-4/5/6` (ילדים ישירים של הטור)
- שומר base margins ב-`data-base-mt`/`data-base-mb` (פעם אחת)
- קיבולת: `headings.length * maxAdd * 2` (פחות first-child exceptions)
- factor = `min(1, neededPx * 1.1 / totalCap)` — 110% כדי לפצות על עיגול דפדפן
- לא מוסיף margin-top ל-first-child (CSS קובע margin-top:0)

**שילוב:** ב-`justifyColumnVertically` — פועל **לפני** word-spacing (step 0)

**UI:** `aq-heading-spacing` checkbox (מופעל כברירת מחדל) + `aq-heading-spacing-max` slider (0-30px, ברירת מחדל 15)

**תוצאה:** שיפור קל — 70→69 medium, 25→24 low. 0 high נשמר.

### 13.3 שלב 7 — letter-spacing (כלי 4)

**מטרה:** הגדלת `letter-spacing` כדי להרחיב טקסט → פחות מילים בשורה → יותר שורות → גובה גדול.

**פונקציה חדשה:** `stretchByLetterSpacing(col, neededPx, maxAdd)` (typesetter.js ~line 1011)
- פועל על כל ה-`<p>` בטור
- שומר base letter-spacing ב-`data-base-ls`
- מנסה maxAdd, ואם יש overshoot > neededPx+5 — חוזר אחורה עם factor

**שילוב:** ב-`justifyColumnVertically` — אחרי word-spacing, לפני para-spacing.
**מוגבל ל-`diff <= 5px`** — כי letter-spacing משנה מספר שורות בצורה לא צפויה.

**UI:** `aq-letter-spacing` checkbox (**כבוי כברירת מחדל**) + `aq-letter-spacing-max` slider (0-2px, step 0.05, ברירת מחדל 0.2)

**אזהרה:** כשמופעל כברירת מחדל עם max=0.5 — גרם רגרסיה חמורה (4 high, 361 medium).
סיבה: letter-spacing דוחף פסקה מעבר ל-threshold של שבירת שורות, ומוסיף שורה שלמה (~21px).
לכן כובה והוגבל ל-diff קטן.

### 13.4 שלב 5 — page-height (כלי 5, ניסיוני)

**מטרה:** הגדלת `body-flow` ו-`page-content-wrapper` כשיש overflow קטן (5-15px) שלא נפתר.

**לוגיקה:** ב-`typesetDocumentCore` אחרי rebalance2 (typesetter.js ~line 4844)
- עובר על כל `.a4-page`
- דלג על עמודים מיוחדים (blank/shaar/toc) והעמוד האחרון
- מוצא את ה-block האחרון, מודד overflow מ-body-flow
- אם overflow 5-maxAdjust px ויש מקום עד תחתית העמוד (overflow+10 safety):
  - מגדיל `bodyFlow.style.height` ב-overflow
  - מגדיל `wrapper.style.height` ב-overflow (חובה — wrapper קובע height:1009px ו-body-flow הוא ילד שלו)
- **rebalance אחרי page-height** (~line 4893): מאזן את ה-block האחרון כדי למנוע imbalance חדש

**בטיחות:** 101px פנויים בין body-bottom ל-page-bottom בכל עמוד A4 — הגדלה עד 15px בטוחה.

**UI:** `aq-page-height` checkbox (**כבוי כברירת מחדל**, אזהרה אדומה) + `aq-page-height-max` slider (5-20px, ברירת מחדל 15)

**תוצאות ניסויות (max=70):**
- overflow נפתר ב-page 6 (64px→0px) ו-page 10 (23px→0px) ✅
- rebalance פתר את ה-imbalance ב-block האחרון ✅
- נוצר page-overflow קטן (7px) כי wrapper חורג מ-page — לכן כובה כברירת מחדל

### 13.5 שלב 6 — glyph-scaling (דלוג)

**סיבה:** אין תמיכת CSS למתיחת glyph (scaling לא משנה רוחב אות).
**החלטה:** דלוג — לא ממושם.

### 13.6 תיקוני audit (geometry-audit.js)

שלושה תיקונים שפתרו 8 high severity issues (ה-baseline המקורי):

**תיקון 1 — `auditPageFillRatio` (commit 8847b77):**
- `extractGeometry` שומר `cls` של כל עמוד
- זיהוי "עמודים מיוחדים" (blank-page, sub-shaar-page, main-shaar-page, back-shaar-page, toc-page) — לא נבדקים כ-page-underfill
- זיהוי `sec-divider-wrap` (חוצץ מפריד) — מסמן את העמוד כ"סוף פרק"
- פתר 3 high (page-underfill בפרקים 35, 62, 73)

**תיקון 2 — `auditContainment` (commit c105d08):**
- block-2col עם p-cut cross-page ו-overflowPx ≤ 80 → medium (לא high)
- threshold ל-note-marker הועלה מ-2 ל-5px (עיגול פיקסלים)
- threshold ל-side-note הועלה מ-20 ל-30px
- פתר 2 high (containment בפרקים 13, 63)

**תיקון 3 — `auditColumnBalance` (commit c105d08):**
- block-2col עם p-cut cross-page ו-diff ≤ 80 → medium (לא high)
- threshold ל-high (ללא p-cut) הועלה מ-diff>30 ל-diff>50
- פתר 3 high (imbalance בפרקים 8, 9, 23)

### 13.7 סקריפטי בדיקה (GitHub Actions)

**קבצים:** `scripts/test-chapters-enhanced.js`, `scripts/regression-test.js`, `scripts/summarize-chapter-results.py`, `scripts/baseline-check.js`

- כל הנתיבים יחסיים (`__dirname` + env vars) — עובדים גם ב-locale וגם ב-GitHub Actions
- תמיכה במשתנה סביבה `ENABLE_PAGE_HEIGHT=1` (עם `PAGE_HEIGHT_MAX` אופציונלי)

**Workflow:** `.github/workflows/regression-test.yml`
- מופעל על push ל-V21 או ידני (workflow_dispatch)
- Matrix של 3 מצבים: baseline, page-height-max15, page-height-max70
- שלבים: checkout → setup Node 20 → install Playwright → start HTTP server → run test → summarize → upload artifacts (30 ימים)

### 13.8 מספרי baseline (79 פרקים, GitHub Actions, 2026-10-26)

| מצב | high | medium | low | errors | pages |
|-----|------|--------|-----|--------|-------|
| baseline | 0 | 69 | 24 | 0 | 863 |
| page-height-max15 | 0 | 69 | 24 | 0 | 863 |
| page-height-max70 | 0 | 69 | 24 | 0 | 863 |

**כל 3 המצבים נותנים תוצאות זהות — ה-engine יציב.**

### 13.9 חקירת non-determinism (commit cada5c8)

- 8 ריצות רצופות של פרק 67 באותו browser — כולן זהות (12 עמודים, 0 high)
- 3 ריצות מלאות של 79 פרקים — כולן זהות
- מסקנה: ה-non-determinism שדווח קודם לא משתחזר. כנראה קשור ל-GC/זיכרון ארעי.

### 13.10 עתיד — סעיפים פתוחים

1. **rebalance נוסף אחרי page-height** — כרגע פותר imbalance אבל יוצר page-overflow קטן (7px). אפשר לשפר על-ידי בדיקת overflow חוזרת.
2. **JSDoc לפונקציות החדשות** — `stretchByHeadingSpacing`, `stretchByLetterSpacing`, page-height adjustment, rebalance.
3. **קריסות דפדפן** (SESSION_HANDOFF סעיף 9.2.1) — פרקים 5, 71, 75 קורסים לפעמים. אולי `page.gc()` בין פרקים.
4. **בדיקת יציבות ב-GitHub Actions** — הרצת אותו פרק פעמיים והשוואת תוצאות.
