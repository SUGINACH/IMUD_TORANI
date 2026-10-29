---
title: "V23 — מטריצת כיסוי עצמאית לסוגי בעיות עימוד"
date: 2026-10-28
version: V23
type: issues
source: ChatGPT
---
# V23 — מטריצת כיסוי עצמאית לסוגי בעיות עימוד

עודכן: 2026-10-28. מקור הגדרות: `V23/COMPREHENSIVE_LAYOUT_ISSUE_CATALOG_AND_TEST_TEXT_PLAN_2026-10-27.md` והבדיקות ב-HEAD של V23.

## משמעות הסטטוסים

- **implemented** — יש קוד שמחשב predicate או telemetry; אינו מעיד שהבעיה נפתרה.
- **exercised** — הטריגר הופעל בפועל בקלט בדיקה; ניסיון להריץ fixture אינו מספיק.
- **asserted** — CI מאמת תוצאה מדידה מסוימת.
- **not exercised** — לא הוכח שהטריגר הופיע בהרצה הנוכחית.
- **not evaluated** — אין מדידה תקפה או אין כיסוי לרכיב.
- **open** — חסרה הוכחת קבלה מלאה או נשארו ממצאים/מצבי קצה.
- **PASS אינו נסגר** אם אחד מהשדות האחרים חסר. Hash דטרמיניסטי אינו הוכחת איכות.

## מטריצת כיסוי

| משפחת בעיה | implemented | exercised ב-CI | asserted ב-CI | מצב מסמך מלא ידוע | הפער שנותר / תנאי סגירה |
|---|---|---|---|---|---|
| Widow / orphan | חלקי: `auditWidowOrphan`; תוקן scope של fallback metadata ב-orphan | כן — injected orphan עבר ב-`40670450381`; widow-specific injection נוסף וממתין ל-CI; natural renderer trigger לא הוכח | כן — orphan assertion עבר עם metadata/rect/0 runtime errors; widow assertion דורש CI עדכני | long audit עדיין נדרש ל-natural trigger; הזרקה אינה הוכחת איכות טבעית | להשלים widow CI; להוסיף fixtures טבעיים לראש/סוף טור ועמוד, Range lines מדודות, positive + negative controls |
| Runt בשורת p-cut | חלקי: בדיקות שורה/רוחב | לא הוכח שכל הספים הופעלו | לא הוכח שער לכל סף | ממצאים היסטוריים; כיסוי לא מלא | למדוד RTL line fragments, רוחב שורה אחרונה, ולכסות סף/חריגים |
| איזון טורים | כן: imbalance + candidate/capacity ledger | כן: balance-capacity fixture | כן: ledger/capacity assertions | נותרו 9 ממצאים ב-baseline ההיסטורי | כל ממצא דורש predicate, סיבתיות ו-counterfactual; עמוד 376 מושהה |
| rollback / נסיגת איזון | כן: final-justify telemetry | כן: long audit | כן: rollback residual diagnostics | telemetry קיים, לא כל rollback בהכרח פגם | לקשור attempt → correction → rollback → final geometry לכל מקרה |
| כותרת בתחתית טור/עמוד | לא הוכח כ-audit מלא | לא הוכח | לא | לא הוכח ב-long audit ההיסטורי | Range/rect test עם לפחות שתי שורות תוכן, כותרות רצופות וחריגים |
| H3 ברוחב מלא ואיזון לפני/אחרי | חלקי | כן: balance-capacity-before-h3 | כן: candidate ledger | אינטראקציות מסמך מלא לא הוכחו | ALL-TRIGGERS + isolated fixture, לפני/אחרי H3, notes ו-ornaments |
| אין פיצול חוקי / structural fallback | כן | כן: no-legal-split fixture ו-long | כן: fallback/sparse-line assertions | קיימים fallbacks מכוונים | להוכיח fallback חוקי, טקסט נשמר ואין runt/overflow |
| טור ריק אמיתי | כן | כן: injected empty-column fixture | כן | fixture בלבד | מקרי מסמך טבעיים ועמודות שונות; לוודא שאין false positive בסוף פרק |
| טור חסר ב-DOM | כן | כן: injected missing-column fixture | כן, מובחן מטור ריק | fixture בלבד | למפות את כל מסלולי יצירת DOM ולוודא שהמודל מזהה חסר בכל מבנה דו-טורי |
| Sparse-page / missing body-flow | כן, כיסוי חלקי/החרגות תפקיד | כן: smoke + long | כן: חשבונאות evaluated/excluded/not-evaluated | baseline היסטורי: 17/18 not-evaluated; תיקון התפקידים נמצא בתהליך אימות מלא | כל עמוד חייב להיות evaluated או excluded עם role/sיבה, או לחסום CI; אין להמיר missing ל-PASS |
| Container-gap / סוף פרק וחלק | כן | כן: smoke + long | כן: per-page accounting ו-contract ל-section-end | baseline היסטורי כלל 9/16 פערים | לבדוק סמנטיקה של כל החרגה, pageClass/boundary evidence, ולהשוות את כל הממצאים מול baseline |
| גלישה מגוף העמוד | כן: `container-overlap` | כן: injected multi-page overflow fixture | כן: high severity + `textOverflowPx>0` + page/text evidence | הזרקה מבוקרת עברה; overflow טבעי לא הוכח | לאמת ממצאים טבעיים במסמך מלא; אין להסיק ש-fixture מכסה clipping/overflow בכל רכיב |
| גלישה מחוץ לגבולות העמוד | לא הוכח כ-predicate מלא | לא | לא | לא הוכח | למדוד כל רכיב גלוי מול `.a4-page` rect, כולל header/footer/ornament/notes; test CSS/PDF clipping |
| חפיפת טקסט עם הערות שוליים | כן: מדידת `footnoteOverlapPx` בתוך `container-overlap` | לא הוכח ב-fixture ייעודי | לא הוכח assertion ייעודי | לא הוכח | fixture עם footnote-area גלוי והזרקת חפיפה מבוקרת; לוודא שהדוח כולל שני המדדים |
| עתודת הערות / reflow מאוחר | חלקי: telemetry | לא הוכח לכל שלבי reserve/reflow | חלקי | היסטורית קיימות מדידות שינוי גובה מאוחר | checkpoints לפני/אחרי note reservation, reflow, balance, final layout; counterfactual של הערה יחידה |
| הערת שוליים ארוכה / ריבוי הערות | חלקי | לא הוכח ב-fixture ייעודי מלא | לא | לא הוכח | מקרי note אחת/רבות/ארוכה/חוצה עמוד, שימור marker/טקסט/שיוך |
| חפיפה ומיקום מחדש של הערות צד | חלקי: anchor/reposition telemetry | לא הוכח ב-fixture pairwise | לא | לא הוכח | בדיקת זוגות rects + anchor correctness לפני/אחרי reposition; עמוד/טור/פסקה |
| containment-rounding של סמני הערה | כן | כן: long audit בשתי תצורות | כן: tolerance צרה ורשומות נסבלות | baseline: 6 רגיל, 10 עיטורים | לוודא שכל החרגה עומדת בתנאי גליף עילי, אין clipping, והספירות תואמות |
| סוגריים עגולים חוצי פסקה/טור/עמוד | כן: scope map/snapshots/counterfactuals | כן: long audit | כן: parity/integrity gates | מיפוי רחב; סיבתיות משתנה ממקרה למקרה | לבדוק שלבי post-paren/post-global/final ולבצע counterfactual נפרד לכל משפחת root cause |
| קינון סוגריים / סוגר ללא פתיחה | חלקי: scope map | כן: long audit | חלקי: integrity; אין הכרעה סמנטית לכל token | מקרים חריגים דורשים אימות מול מקור | fixtures מקוננים, source offsets, מקרים חיוביים ושליליים; אין לתקן מקור אוטומטית |
| square-bracket scope / רצף הערות | כן: scope audit | כן: smoke + long | כן: diagnostics asserted | baseline: 3 ממצאים בכל תצורה | לאמת אם כל ממצא הוא פגם, טווח מותר או parser mismatch; להוסיף רצף [א][ב] |
| מעבר שורה אחרי אות הערה | לא הוכח | לא | לא | לא הוכח | Range fragments ו-inline DOM fixture; לוודא marker/text אינם נפרדים שלא במכוון |
| U+E000 / tofu / font fallback | חלקי: font preflight/FontFace status | לא הוכח בכל מטריצת גופנים | לא | לא הוכח ב-long audit | fixture עם glyph חסר/קיים, font fallback chain, actual loaded fonts, DOM/PDF screenshot comparison |
| כותרות עליונות/מספור recto-verso | כן: geometry/selection audit | כן: smoke recto/verso + long | חלקי: geometry coverage | תצורות מסוימות מכוסות | כותרת ארוכה, מספר חיצוני, fonts/scale, overlap/clipping מול page bounds |
| עיטורי H2/H3/הערות וקווים מפרידים | כן: DOM geometry coverage | כן: active ornaments smoke + long | כן: presence/coverage gates | ממצאים/אינטראקציות לא הוכחו כולם | בדיקת overlap/clipping עם גוף/notes/headers, כל רכיב active/off, ו-PDF parity |
| TOC כללי/מפורט | לא הוכח ככיסוי מלא ב-HEAD | לא הוכח ב-fixture current | לא | היסטורית overflow/freeze | fixtures עם TOC ארוך, עמוד אחרון קצר, repagination/repeat-render, DOM→PDF page count |
| שימור טקסט וסדר | כן: text conservation audit | כן: long audit | כן: counts/mismatch assertions | baseline: 3,105 פסקאות, 529 כותרות, 2,042 הערות צד | להרחיב ל-U+E000, notes/markers, duplicated/lost tokens בכל export |
| DOM → HTML/PDF parity | חלקי | לא הוכח לכל רכיב | לא הוכח שער מלא | היסטורית לא נכלל בספירת issues | השוואת page count, extracted text/order, font metrics, clipping ו-screenshots בין DOM חי ל-PDF |
| דטרמיניזם | כן: repeat-check/fingerprint | כן: long audit | כן | baseline עבר | להשאיר נפרד משערי איכות; לבדוק גם גרסאות Chromium/fonts וסביבה שונה |
| trace סיבתי / ledger | כן: decision ledger + stage trace חלקי | כן: long audit ו-targeted trace | כן: schema/parity/integrity gates | סיבתיות לא מלאה לכל ממצא | לכל ממצא: לפני/אחרי, שינוי רכיב, trigger stage, counterfactual, confidence מדורג |
| ביצועים / זיכרון / timeout | חלקי: CLI timeout/fingerprint | כן: long audit רץ | חלקי | תוצאות תלויות סביבה | למדוד משך/זיכרון לכל stage; timeout צריך להיות failure מובחן מ-renderer crash ומ-timeout CI |
| גופנים/רוחב/scale interactions | לא הוכח כמטריצה מלאה | לא | לא | לא הוכח | seeded matrix עם 3+ widths/fonts/seeds, ורישום trigger-hit אמיתי לכל וריאנט |

## כללי סגירה

1. כל שורה עם `not exercised` או `not evaluated` נשארת פתוחה עד שיש תוצאה מדודה או החרגה סמנטית תקפה.
2. כל issue kind שמופיע בדוח חייב להיות מקושר ל-predicate, fixture או long gate; היעדר issue אינו PASS אם הטריגר לא הופעל.
3. כל תיקון במנוע מחייב בדיקת fixture, מסמך קנוני בברירת מחדל ובעיטורים, text conservation, determinism, צילום עמוד אמיתי כשיש ממצא גאומטרי, ו-counterfactual לפי הצורך.
4. עמוד DOM index 376 נשאר מושהה עד סיום יתר משפחות הבעיות; אין לכלול אותו בפתרונות/צילומים לפני הסרת ההשהיה.
5. אין לסמן את כל העבודה כשלמה כל עוד שורות פתוחות אלו לא נפתרו או סווגו במפורש כלא רלוונטיות עם ראיה.
