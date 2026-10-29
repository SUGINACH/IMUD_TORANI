---
title: "קובץ מעבר — V23 — 27.10.2026"
date: 2026-10-27
version: V23
type: session
source: ChatGPT
---
# קובץ מעבר — V23 — 27.10.2026

## הוראות פתיחה לשיחה הבאה

יש להמשיך מהמצב המתועד כאן, לא להתחיל סקירה כללית מחדש. יש לקרוא את הקובץ הזה, את `V23/ISSUE_RESOLUTION_PROTOCOL.md`, את סוף `worklog.md` ואת סוף `V23/MASTER_WORK_REGISTER.md`. יש לפעול בענף `V23` בלבד; אסור למזג או להעתיק שינויים אל `V21`. ממצא האיזון בעמוד 376 נשאר מושהה עד להשלמת יתר סוגי הממצאים.

**המשתמש עבר על ה-PDF האחרון ואישר את יתר הממצאים, עם שתי הערות מהותיות:** עמודי sparse-page 588/628 הם סיומי פרק והדיווח תלוי ב-`balance-chapter-end`; ממצאי structural-fallback בעמודים 46/218/315/41/109/133 הם פתרון חלקי אפשרי כשאין חלוקה חוקית, ויש להשאירו בשליטת המשתמש. אין להניח שהצלחת CI מוכיחה נכונות חזותית.

## מצב Git ו-CI

- Repository: `SUGINACH/Tora_Book_Typesetter_Green`
- Branch: `V23`
- HEAD נוכחי לאחר ארכוב הדוח: `643adc8fadda2eefd794adaa866c8c03a29fb2ba` — `V23: archive rendered layout issue screenshots`.
- commit שעליו בוצעו הבדיקות: `e190b1191377e897a0cf63ac6acc7a32a1db547d` — `V23: classify terminal section gaps across intentional blank pages`.
- [ריצת Long Document המוצלחת](https://github.com/SUGINACH/Tora_Book_Typesetter_Green/actions/runs/40506660569)
- [ריצת CLI המוצלחת](https://github.com/SUGINACH/Tora_Book_Typesetter_Green/actions/runs/40506660520)
- [ריצת Pages המוצלחת על אותו commit בדיקה](https://github.com/SUGINACH/Tora_Book_Typesetter_Green/actions/runs/40506659238)
- Artifact של הביקורת המלאה: [geometry-audit-long-report](https://github.com/SUGINACH/Tora_Book_Typesetter_Green/actions/runs/40506660569/artifacts/12735706761).

## ה-PDF האחרון — נבדק חזותית על ידי המשתמש

תיקיית הדוח שנשמרה ב-branch:
`V23/reports/container-gap_imbalance_sparse-page_square-bracket-scope_structural-fallback_2026-10-27_run-40506660569/`

- [פתח PDF — צילומי העמודים](https://github.com/SUGINACH/Tora_Book_Typesetter_Green/blob/V23/V23/reports/container-gap_imbalance_sparse-page_square-bracket-scope_structural-fallback_2026-10-27_run-40506660569/layout-issue-screenshot-report.pdf)
- [פתח manifest — מיפוי עמוד PDF לממצא ולצילום המקורי](https://github.com/SUGINACH/Tora_Book_Typesetter_Green/blob/V23/V23/reports/container-gap_imbalance_sparse-page_square-bracket-scope_structural-fallback_2026-10-27_run-40506660569/layout-issue-screenshot-manifest.json)
- [README של הדוח](https://github.com/SUGINACH/Tora_Book_Typesetter_Green/blob/V23/V23/reports/container-gap_imbalance_sparse-page_square-bracket-scope_structural-fallback_2026-10-27_run-40506660569/README.md)

ה-PDF כולל 26 צילומי מסך אמיתיים שנלכדו מעמודי Chromium המרונדרים, עד שלושה עמודים שונים לכל סוג ממצא. ה-manifest מייחס אותם לשתי תצורות: default (639 עמודים) ו-ornaments (659 עמודים), מאותו commit. אינדקסי DOM ‏375 ו־376 הושמטו במכוון.

### תוצאות audit מתוך JSON של הריצה המוצלחת

**תצורת default — 639 עמודים**
- 27 ממצאים: 6 בינוניים, 21 נמוכים.
- סוגים: imbalance=9, container-gap=8, structural-fallback=6, square-bracket-scope=3, sparse-page=1.
- containment-rounding: אפס ממצאים פעילים; 6 מדידות note-marker נשמרו כחריגות נסבלות.
- container-gap: הכיסוי מלא, 531 נבדקו, 108 הוחרגו לפי סיבה מפורשת, 0 לא נבדקו.
- sparse-page: הכיסוי **אינו מלא** — 535 נבדקו, 87 הוחרגו, 17 לא נבדקו בגלל `missing-body-flow`.

**תצורת ornaments — 659 עמודים**
- 36 ממצאים: 13 בינוניים, 23 נמוכים.
- סוגים: container-gap=12, structural-fallback=8, imbalance=7, sparse-page=6, square-bracket-scope=3.
- containment-rounding: אפס ממצאים פעילים; 10 מדידות note-marker נשמרו כחריגות נסבלות.
- container-gap: הכיסוי מלא, 551 נבדקו, 108 הוחרגו לפי סיבה מפורשת, 0 לא נבדקו.
- sparse-page: הכיסוי **אינו מלא** — 556 נבדקו, 85 הוחרגו, 18 לא נבדקו בגלל `missing-body-flow`.

שערי CI של סבילות note-marker, גבול section-divider, שלמות כיסוי container-gap, trace ממוקד, CLI ויצירת PDF עברו. אלה תוצאות של בדיקות אוטומטיות; הן אינן מחליפות סקירה חזותית.

## החלטות שכבר יושמו ואסור לבטל ללא ראיה

### 1. containment-rounding
חריגות קטנות של note-marker, מעל 1px ועד 3px כלפי מעלה בלבד, כאשר שאר הכיוונים עד 0.25px והגאומטריה מאומתת מול ה-DOM החי, נשמרות ב-`audit.checks.containmentRounding.toleratedRecords` ולא נספרות כליקויים. כל חריגה שאינה עומדת בתנאים נשארת issue. שער ה-CI מאמת את הרשומות ואת העמודים שהוגדרו.
- default: 6 רשומות סבילות; 0 ממצאי containment-rounding.
- ornaments: 10 רשומות סבילות; 0 ממצאי containment-rounding.
- אין להציג את זה כהוכחה שלא קיימת בעיה חזותית אחרת; זו הכרעה צרה בסוג המדידה המסוים.

### 2. container-gap בסוף חלק
הקוד דורש מפריד סיום `.sec-divider-wrap` כילד האחרון של `.page-body-flow`, ואחריו עמוד `.sub-shaar-page` ישירות או דרך עמוד `.blank-page` מפורש אחד. נתוני boundary נשמרים, ושער CI מאמת את הראיות.
- השער דיווח PASS עבור target indices: default `[590]`, ornaments `[588,608,628]`.
- **הערת המשתמש אושרה כממצא gate לא מדויק:** ב-JSON default יש `container-gap` פעיל ב-`pageIdx=589`, תווית `תקפח`, פער 177px; `pageIdx=590` הוא גבול/החרגה נפרדים. יש לוודא שה-gate בודק גם את ממצא 589 עצמו ולא מחשיב את ההחרגה בעמוד הסמוך כהוכחת פתרון.
- לפי JSON הנוכחי, העמודים 588, 608, 628 הם ממצאי `sparse-page`, ועמוד 649 הוא `square-bracket-scope`, לא `container-gap`. המשתמש העיר קודם על סוגי הממצאים האלה, ולכן יש להתייחס לכל אחד לפי סוגו בפועל ולא לערבב ביניהם. אם המשתמש מאשר/מתקן את הזיהוי לאחר צפייה ב-PDF, לתעד את ההכרעה.

### 3. sparse-page — עדיין פתוח
הכיסוי אינו מלא בגלל 17/18 עמודים עם `missing-body-flow`. אין לסמן PASS, ואין להסתיר את המקרים הלא-מוערכים. היה שינוי אבחוני מוכן בעבר לשיפור הכיסוי והוספת שער קשיח, אך אין להניח שהוא נמצא ב-HEAD הנוכחי: התוצאות העדכניות מוכיחות שנותרו 17/18 מקרים לא מוערכים. יש לעיין בקוד וב-commit history, להגדיר את מבנה העמודים/החרגות במדויק, ולתקן רק לאחר סקירת ה-PDF/הערות המשתמש.

## סדר העבודה המחייב מכאן

1. **קודם לקבל את הערות המשתמש על ה-PDF האחרון.** המשתמש הודיע שטרם עבר עליו.
2. למפות כל הערה לפי manifest: תצורה, PDF page number, DOM index, page label, סוג ממצא, מדדים וצילום המקור. לא לערבב בין מספר עמוד מוצג, PDF page number ו-`pageIdx`.
3. לסגור את שאלת container-gap של סוף החלק רק לאחר אימות העמוד המדויק, כולל בדיקת target `pageIdx=589` לעומת החרגת `pageIdx=590`.
4. להשלים את חוזה הכיסוי של sparse-page, כולל 17/18 `missing-body-flow`, בלי החרגות כלליות או החלשת שערים.
5. אחרי כל שינוי אבחוני/מנוע: שתי ריצות מלאות (default + ornaments), CLI, בדיקות הרגרסיה, השוואת inventory, ודוח PDF חדש עם צילומי עמודים אמיתיים בתיקייה חדשה תחת `V23/reports/`.
6. לבדוק שלא נעלם ממצא בגלל שינוי כיסוי/החרגה, ולוודא ששימור הטקסט, הכותרות, ההערות, העיטורים והדטרמיניזם לא נפגעו.
7. רק אחרי סיום סוגי הממצאים האחרים חוזרים לעמוד 376. אין לשנות אותו כעת.

## פרט טכני קטן
ב-log של ארכוב ה-PDF הופיעה הודעת shell `line 13: .a4-page: command not found`: backticks סביב `.a4-page` ב-heredoc של README פורשו כ-command substitution. ה-PDF וה-manifest נוצרו והועלו בהצלחה, אך README שנשמר עלול להחסיר את הטקסט `.a4-page`. לתקן בהמשך על ידי escaping של backticks או heredoc quoted; לא לערבב תיקון תיעוד זה עם שינוי מנוע העימוד.

## פרומפט לפתיחת השיחה הבאה

המשך את העבודה בפרויקט `Tora_Book_Typesetter_Green` בענף `V23` בלבד. קרא תחילה את `V23/CONTINUATION_2026-10-27.md`, את `V23/ISSUE_RESOLUTION_PROTOCOL.md`, ואת הסעיפים האחרונים ב-`worklog.md` וב-`V23/MASTER_WORK_REGISTER.md`. אל תתחיל מחדש ואל תנחש מצב: אמת את HEAD והקבצים בפועל.

הבדיקות הסתיימו בהצלחה על commit `e190b1191377e897a0cf63ac6acc7a32a1db547d`, והדוח נשמר ב-`V23/reports/container-gap_imbalance_sparse-page_square-bracket-scope_structural-fallback_2026-10-27_run-40506660569/`. עדיין לא עברתי על ה-PDF. הצג לי תחילה את ה-PDF וה-manifest והמתן להערותיי לפני הכרזה שהממצאים חזותית נכונים או לפני שינוי נוסף שמבוסס עליהם.

המשך לאחר מכן לפי הסדר: (1) אימות הערותיי מול manifest ו-JSON; (2) בדיקת target סוף-החלק — בדוח default יש container-gap ב-`pageIdx=589` (177px) בעוד שער ההחרגה מאמת `pageIdx=590`, ולכן חייבים ליישב את המיפוי לפי צילום ותווית ולא להניח שהבעיה נסגרה; (3) תיקון כיסוי sparse-page, שבו נותרו 17 עמודים לא מוערכים ב-default ו-18 ב-ornaments בגלל `missing-body-flow`; (4) ריצות מלאות, בדיקות רגרסיה ו-PDF חדש; (5) יתר סוגי הממצאים. אין למזג V23 ל-V21. עמוד 376 נשאר מושהה עד לסיום יתר הבעיות. שמור על פרוטוקול 9 השלבים, אל תחליש שערי CI, ועדכן `worklog.md` ו-`V23/MASTER_WORK_REGISTER.md` בכל שינוי מהותי.


## עדכון לאחר סקירת המשתמש — 2026-10-27

- המשתמש אישר את שאר ממצאי ה-PDF. עמודי DOM 588 ו-628 בתצורת ornaments הם סיומי פרק: `sparse-page` הוא ממצא תקף כאשר `balance-chapter-end=balance`; כאשר נבחר `fill`, סיום קצר הוא התנהגות מכוונת שיש לסווג כהחרגה מפורשת.
- המשתמש אישר לבחון את `structural-fallback` בעמודים 46, 218, 315, 41, 109, 133 כפתרון חלקי בלבד במקרים ללא חלוקה דו־טורית חוקית. יש להשאיר אפשרות זו בלוח ההגדרות; אין לסווג fallback כהוכחה לאיזון מלא.
- תיקון נדרש בשער סוף-החלק: default `pageIdx=589` / `תקפח` / 177px הוא ממצא `container-gap` פעיל; ההחרגה שנבדקת ב-`pageIdx=590` אינה יכולה לבדה להוכיח שהוא נפתר.
- כיסוי `sparse-page` נותר לא שלם ב-HEAD הקודם: 17/18 עמודים עם `missing-body-flow`. אלה עמודי שער/ריקים/שערי משנה בעלי תפקיד מפורש; יש לרשום אותם כהחרגות מבניות מפורשות בלבד, ולהשאיר כל תפקיד לא מוכר כ-`NOT EVALUATED`.
- HEAD שאומת לפני התיקון: `8d0b7db8e6020e0682c2cbe2c166c65b7f077437`. נדרשות ריצות CLI ומסמך מלא בשתי התצורות, השוואת inventory ו-PDF חדש. עמוד 376 נשאר מושהה; V23 בלבד.
---
title: "קובץ מעבר — V23 — 28.10.2026"
date: 2026-10-28
version: V23
type: session
source: ChatGPT
---
# קובץ מעבר — V23 — 28.10.2026

## מטרת הקובץ והנחיה עליונה

הקובץ הזה ממשיך ומעדכן את `V23/CONTINUATION_2026-10-27.md`. יש לקרוא את שניהם, אבל במקרה של סתירה — **ההנחיות החדשות כאן גוברות**. המשתמש ביקש להמשיך לעבוד ברציפות עד שכל הבעיות נפתרו, ואז לעבור שוב על כל המערכת ולנסות לאתר בעיות שהבדיקות הנוכחיות עלולות להחמיץ, תוך שימוש בכלים ושיטות בדיקה שונים. המשתמש יבדוק את התוצאה רק לאחר שהעוזר סבור שהבעיות נפתרו; לכן אין לעצור כעת כדי לבקש ממנו לבדוק PDF או לבחור את המשך העבודה. יש לבצע את הבדיקות והסקירה העצמאית בעצמנו, ולבקש את בדיקתו רק כשיש בסיס ראייתי מלא להצגת גרסה מוכנה.

**אין להכריז שהכול נפתר על סמך CI ירוק בלבד, ירידה במספר הממצאים, או fixtures מוזרקים.** יש להמשיך לפתור ולבדוק את כל השורות הפתוחות במטריצת הכיסוי, ובסוף לבצע ביקורת אדברסרית: מה לא נבדק, איזה trigger לא הופעל, אילו רכיבים אינם במודל, האם יש false negatives, והאם HTML/DOM ו-PDF עלולים להיות שונים.

## מצב מאגר וענף

- Repository: `SUGINACH/Tora_Book_Typesetter_Green`
- Branch עבודה: `V23` בלבד.
- **אסור למזג, cherry-pick או להעתיק שינויים ל-`V21`**; אלה ענפים מקבילים ונפרדים.
- HEAD שנבדק בעת הכנת הקובץ: `10151168371736e3b4d3f17500f33d4e280e86fe` — `V23: register widow tokenId schema correction` (28.10.2026 10:20:15Z). יש לאמת HEAD מחדש בתחילת השיחה הבאה; ייתכן ש-CI או commits נוספים הסתיימו מאז.
- קובץ הפרוטוקול המחייב: `V23/ISSUE_RESOLUTION_PROTOCOL.md`.
- מטריצת הכיסוי: `V23/ISSUE_COVERAGE_MATRIX_2026-10-28.md`.
- קטלוג הבעיות ותוכנית הטקסט: `V23/COMPREHENSIVE_LAYOUT_ISSUE_CATALOG_AND_TEST_TEXT_PLAN_2026-10-27.md`.
- יש לקרוא גם את סוף `worklog.md`, סוף `V23/MASTER_WORK_REGISTER.md), ואת תיעודי השיחות ב-repo (בפרט `V23/שיחה מספר 2.md), אם קיימים ב-HEAD. אל תסתמך על שמות קבצים בלבד: אמת דרך Git tree אילו תיעודי שיחה קיימים וקרא את הקטעים הרלוונטיים. תיעוד השיחות הוא מקור חשוב להגדרת הכוונה, ההחלטות וההבחנות שהמשתמש כבר קבע.

## מצב CI בנקודת המעבר

בבדיקה האחרונה:
- `Geometry audit CLI` run `40671310326` על HEAD `1015116837...` היה `in_progress`. הוא כולל בין היתר בדיקות smoke, no-legal-split, capacity/H3, empty column, missing column, injected body overflow, orphan diagnostic, widow diagnostic, sparse-page/square-bracket, section-end, ornaments, recto/verso headers ו-H2 ornament geometry.
- `Geometry audit long document` run `40671248203` על commit קודם `f101b76da55f2c166eca120b4e15962e82692b39` היה `in_progress`. שלביו כוללים הרצת המסמך המלא בברירת מחדל ובעיטורים, בדיקות accounting/coverage, PDF screenshots וארכוב הדוח.
- `pages build and deployment` run `40671309614` על HEAD `1015116837...` הסתיים `success`.
- commits וריצות רבות קודמות בוטלו עקב commits חדשים ו-concurrency. יש להתייחס רק לריצות שהסתיימו על ה-HEAD הסופי, או לוודא התאמה מדויקת של commit. בדוק את ה-logs וה-artifacts בפועל, לא רק סטטוס כללי.
- ב-HEAD יש תיקון לחוזה `tokenId` בממצא widow: אם אין מזהה ב-node, נלקח `data-token-id` מה-DOM ואם גם הוא חסר נרשם `null` במפורש. הריצה האחרונה אמורה לאמת את ה-assertion החדש. אין לסגור widow עד שה-CLI וה-artifact מראים את המפתח ואת הערכים הצפויים.

## מה כבר הוכח — ומה לא

### הוכחות ממוקדות קיימות
- הזרקת overflow מבוקרת עברה בעבר ב-run `40669548960`: ממצא אחד `container-overlap/high`, `textOverflowPx=3906.38`, עמוד DOM index 4 (תווית `ג`), עם preview; ה-artifact כלל JSON ו-summary. זה מוכיח את מסלול האבחון במקרה המוזרק, לא את כל מקרי הגלישה הטבעיים או clipping ב-PDF.
- הזרקת orphan עברה ואומתה ב-artifact run `40670450381`: ממצא אחד, שורה אחת, rect ו-metadata, ללא runtime errors. זה מוכיח את מסלול האבחון המוזרק בלבד.
- רגרסיית widow הוספה לאחר מכן; ב-run `40670974338` היא נכשלה בגלל היעדר `tokenId` ב-JSON. התיקון ב-`f101b76...` וב-HEAD הנוכחי מטפל בשדה; יש לבדוק את הריצה החדשה לפני קביעה שהשער עבר.
- ה-CLI כלל קודם הרבה שערים ממוקדים, אך **אין בכך הוכחה טבעית** שכל האלמנות/יתומות, runt, כותרות בתחתית, חפיפות הערות, clipping, TOC, font fallback או DOM/PDF parity נפתרו.

### חובות פתוחות לפי מטריצת הכיסוי
המטריצה היא רשימת עבודה פעילה, לא מסמך סיכום סגור. לכל הפחות יש לטפל בשורות הבאות, לפי הפרוטוקול:
1. Widow/orphan: להשלים widow CI, להוסיף טריגרים טבעיים ולא רק הזרקה; לבדוק ראש/סוף טור ועמוד, line fragments מדודים, controls חיוביים ושליליים.
2. Runt בשורה אחרונה של p-cut: למדוד שברי שורות בפועל ב-RTL, רוחב השורה האחרונה, ספים וחריגים.
3. איזון טורים ו-rollback: להצליב כל ממצא עם ledger, שלב, ניסיון תיקון/rollback, גאומטריה לפני/אחרי ו-counterfactual; עמוד DOM 376 נשאר מושהה עד שכל יתר המשפחות הושלמו.
4. כותרות בתחתית טור/עמוד: בדיקת Range/rects ותנאי מינימום של שתי שורות טקסט אחרי כותרת, כולל כותרות רצופות וחריגים לגיטימיים.
5. H3 ברוחב מלא: אינטראקציות עם טורים עליונים/תחתונים, notes ו-ornaments, לא רק fixture ledger.
6. Sparse-page: baseline קודם הציג 17 עמודים לא מוערכים ב-default ו-18 ב-ornaments עקב `missing-body-flow`. כל עמוד חייב להיות evaluated, excluded עם role/reason מפורש, או not evaluated שחוסם סגירה. אין להפוך עמוד לא מזוהה ל-PASS.
7. Container-gap / סוף פרק וחלק: לאמת את כל החרגות boundary והראיות לעמוד/תווית. הממצא ההיסטורי ב-default `pageIdx=589`, תווית `תקפח`, פער 177px חייב להיבדק בנפרד מהחרגת `pageIdx=590`; אין להסיק שהראשון נפתר מפני שהשני הוחרג.
8. גלישה מחוץ לגבולות העמוד: predicate לכל רכיב גלוי ביחס ל-rect של `.a4-page`, כולל header/footer/ornament/notes, ובדיקות PDF clipping.
9. חפיפת טקסט והערות שוליים: fixture ייעודי שמזריק חפיפה מדידה ומאמת `footnoteOverlapPx`; לא רק overflow כללי.
10. עתודת הערות ו-reflow מאוחר: checkpoints לפני/אחרי reservation, reflow, balance ו-final layout; בדיקת הערה בודדת ו-counterfactual.
11. הערות שוליים ארוכות/מרובות, הערות צד ו-reposition: בדיקות pairwise rects, anchor correctness, שיוך/סדר ושימור תוכן.
12. containment-rounding: לוודא שהסבילות הצרה של note-marker באמת חלה רק בתנאים שנקבעו ושאינה מסתירה clipping.
13. סוגריים עגולים, קינון, סוגר חסר ו-square-bracket scope: להפריד parser/source mismatch מבעיה גאומטרית; לבדוק offsets, token identity ו-fixtures חיוביים ושליליים.
14. מעבר שורה אחרי אות הערה: Range fragments ו-inline DOM test שמוכיח שה-marker והטקסט לא נפרדים שלא במכוון.
15. U+E000/tofu/font fallback: מטריצת גופנים ו-font loading, glyph presence, fallback chain, screenshots ו-PDF.
16. כותרות עליונות recto/verso: כותרות ארוכות, מספרי עמוד חיצוניים, scale/fonts, clipping ו-overlap.
17. עיטורים וקווים מפרידים: כל רכיב active/off, גאומטריה מול body/notes/header, clipping ו-PDF parity.
18. TOC כללי/מפורט: fixture ארוך, עמוד אחרון קצר, repagination/repeat-render, page count ו-DOM→PDF parity.
19. שימור טקסט וסדר: להרחיב מעבר לספירות כלליות ל-markers, U+E000, notes, duplicated/lost tokens ו-source offsets.
20. DOM→HTML/PDF parity: מספר עמודים, טקסט וסדר, font metrics, clipping ו-screenshots.
21. דטרמיניזם: להפריד hash repeatability מאיכות; לבדוק repeat renders וגם Chromium/fonts/surface variations.
22. trace סיבתי: לכל ממצא, לפני/אחרי, stage, רכיבים שהשתנו, counterfactual, confidence; אין להסיק סיבתיות כשחסרים checkpoints.
23. ביצועים/זיכרון/timeouts: למדוד משך וזיכרון לפי stage ולהבדיל בין timeout, renderer crash ו-CI timeout.
24. מטריצת רוחב/גופן/scale: לפחות 3 וריאנטים רלוונטיים, trigger-hit אמיתי ורישום קלטים/סביבה.

אפשר להוסיף/לשנות סדר לפי ממצאים חדשים, אך אין למחוק שורה מהותית בלי ראיה והחלטה מתועדת. יש לעדכן את מטריצת הכיסוי תוך כדי עבודה, לא רק בסוף.

## ממצאים/החלטות היסטוריים שחייבים לשמר

- המשתמש בדק את PDF מה-27.10 ואישר את שאר הממצאים, עם ההבחנות: עמודי ornaments DOM 588/628 הם סיומי פרק; sparse-page תלוי ב-`balance-chapter-end`. Structural-fallback בעמודים 46/218/315/41/109/133 עשוי להיות פתרון חלקי מותר כאשר אין split חוקי, וצריך להשאיר אותו בשליטת המשתמש. אין להציג fallback כהוכחת איזון מלא.
- PDF ו-manifest היסטוריים נמצאים ב:
  `V23/reports/container-gap_imbalance_sparse-page_square-bracket-scope_structural-fallback_2026-10-27_run-40506660569/`
  ה-PDF מכיל 26 צילומים אמיתיים מ-Chromium. זהו baseline היסטורי; אחרי תיקונים מהותיים יש להפיק דוח חדש.
- המסמך המלא `very_long_test_text.txt` הוא קלט קנוני, וצריך להריץ אותו גם ב-default וגם ב-active ornaments. fixtures קצרים משלימים בלבד.
- עמוד DOM index 376 מושעה מפורשות עד סיום יתר משפחות הבעיות. בדוק את ה-workflow בפועל כדי לוודא שאין שלב targeted trace שמריץ אותו. אל תשתמש בנתוניו ואל תיצור עבורו צילומים לפני הסרת ההשהיה.
- הייתה הודעת shell בעת ארכוב ה-PDF: `line 13: .a4-page: command not found`, כנראה בגלל backticks בתוך heredoc README. יש לבדוק אם README חסר טקסט ולתקן תיעוד בנפרד.
- כל שינוי מהותי בקוד/אודיט/tests מחייב עדכון `worklog.md` וגם `V23/MASTER_WORK_REGISTER.md`. לשמור על תיעוד מדויק: מה שונה, למה, ראיות, תוצאת בדיקה, ומה עדיין פתוח. אל לרשום PASS לפני שיש תוצאה אמיתית.

## פרוטוקול עבודה מחייב

פעל לפי כל תשעת השלבים ב-`V23/ISSUE_RESOLUTION_PROTOCOL.md`:
1. הגדרה מדידה של הפגם והחריגים;
2. predicate אמין ו-fixtures חיוביים/שליליים;
3. בדיקה/trace דטרמיניסטיים;
4. זיהוי סיבתי של השלב;
5. תכנון תיקון ותחום השפעה;
6. שינוי מבודד;
7. אימות הגאומטריה בפועל;
8. שתי ריצות מלאות, inventory, conservation, determinism, trace, screenshot PDF;
9. הערכה מחודשת עד סגירה או חריג מתועד.

אין להחליש CI, להרחיב exclusions, או לשנות thresholds רק כדי להשיג ירוק. בכל דוח להפריד `evaluated`, `excluded`, `not evaluated`, `not applicable`; totals חייבים להתאים למספר העמודים. יש להבחין בין `implemented`, `exercised`, `asserted` ו-`resolved`.

## ביקורת עצמאית בסוף — חובה

לאחר שכל המשפחות במטריצה נסגרו:
- עבור שוב על כל מטריצה, כל issue kind וכל exclusion.
- חפש false negatives: selectors חסרים, רכיבים לא במודל, DOM nodes שנעלמים ב-extract, early returns, ספים שאינם מופעלים, fixtures שבוחרים רק מקרה נוח, ו-assertions שמסתפקים בקוד יציאה.
- הוסף mutation/negative-control tests כדי לוודא שהשערים נכשלים כשמזריקים פגם, וגם נשארים שקטים במקרה מותר.
- השווה DOM חי, מודל audit, HTML/PDF output וצילומי מסך אמיתיים; בדוק text conservation ו-page count.
- בדוק repeatability, תצורות default/ornaments, וריאנטים רלוונטיים של fonts/width/scale.
- בצע סקירת קוד סטטית נפרדת מהרצת Chromium; חפש scope/runtime errors, stale state, non-finite geometry, missing IDs, mismatched units, early-return paths ו-coverage arithmetic.
- תעד גם מה עדיין לא ניתן להוכיח, אל תטען לשלמות מוחלטת אם יש מגבלה ידועה. רק לאחר מכן הצג למשתמש את ה-PDF/manifest והסבר מה הוכח ומה מוגבל.

## פרומפט לפתיחת השיחה הבאה

המשך ברציפות את עבודת מנוע העימוד בפרויקט `SUGINACH/Tora_Book_Typesetter_Green`, בענף `V23` בלבד. קרא תחילה את `V23/CONTINUATION_2026-10-28.md`, את `V23/CONTINUATION_2026-10-27.md`, את `V23/ISSUE_RESOLUTION_PROTOCOL.md`, את `V23/ISSUE_COVERAGE_MATRIX_2026-10-28.md`, את `V23/COMPREHENSIVE_LAYOUT_ISSUE_CATALOG_AND_TEST_TEXT_PLAN_2026-10-27.md`, את תיעודי השיחות ב-repo (במיוחד `V23/שיחה מספר 2.md), ואת סוף `worklog.md` ו-`V23/MASTER_WORK_REGISTER.md`. אמת את HEAD, היסטוריית commits, קובצי workflow ותוצאות CI בפועל לפני כל מסקנה.

המשתמש ביקש שלא לעצור לבדיקתו באמצע: הוא יבדוק רק אחרי שלדעתך כל הבעיות נפתרו. המשך לבצע תיקונים, בדיקות וסקירה עצמאית עד אז. השתמש בפרוטוקול תשעת השלבים לכל בעיה, הגדר במדויק את predicate והחריגים לפני שינוי קוד, השתמש בכלים שונים (בדיקת קוד סטטית, fixtures חיוביים ושליליים, הזרקת פגמים, Chromium DOM geometry, דוחות JSON/artifacts, PDF screenshots, text conservation, determinism ו-long document בשתי תצורות). אל תחליש שערים ואל תסיק PASS מהיעדר ממצא אם ה-trigger לא הופעל או coverage חסר.

בדוק תחילה את התוצאות העדכניות של CLI run `40671310326` וה-long-document run `40671248203` (ייתכן שיש ריצות חדשות על HEAD). במיוחד השלם את widow regression: ב-run קודם ה-assertion נכשל כי `tokenId` נשמט; התיקון האחרון אמור לרשום tokenId או `null` במפורש. בדוק JSON/artifact בפועל. המשך לאחר מכן לסגור את כל הפערים במטריצת הכיסוי, לרבות natural widow/orphan, runt, heading-bottom, sparse-page `missing-body-flow`, container-gap סוף חלק (`pageIdx=589` / `תקפח` / 177px מול החרגת `pageIdx=590`), page-bound clipping, footnote/side-note overlap ו-reflow, fonts/U+E000, TOC, DOM/PDF parity, trace, determinism וסביבת widths/fonts/scale.

הפק שתי ריצות מלאות של `very_long_test_text.txt` — default ו-active ornaments — אחרי תיקונים, השווה inventory/coverage מול baseline, בדוק artifacts ו-PDF screenshots אמיתיים. שמור את page 376 מושהה עד שכל יתר המשפחות סגורות; ודא שה-workflow לא מריץ אותו. עדכן את מטריצת הכיסוי, `worklog.md` ו-`V23/MASTER_WORK_REGISTER.md` בכל שינוי. אחרי שנראה שכל הבעיות נפתרו, בצע סיבוב ביקורת אדברסרית נוסף כדי לבדוק אם מנגנון הבדיקה עצמו מפספס בעיות. רק אז הצג למשתמש את התוצאה הסופית והראיות, בלי להפריז בטענות. אין למזג V23 לתוך V21.
