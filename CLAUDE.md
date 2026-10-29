# הנחיות לסשן AI / לכל מי שעובד על הריפו

קרא קודם: `docs/AI_WORKFLOW.md` (חובה), `docs/UNIFICATION_PLAN.md` (מצב ומה הלאה), `docs/FEATURE_MAP.md` (מה הגיע מאיפה).

כללי ברזל:
1. **לעולם לא להחליף קובץ שלם בגרסה שהגיעה מבחוץ.** משווים אותה לקובץ הנוכחי (`git diff --no-index`) וממזגים hunk-ים בנפרד.
2. לפני כל קומיט: `npm run test:layout:quick` ו-`npm run test:features`. לפני סיום משימה: `npm run test:layout`.
3. אסור להוסיף פיצ'ר בלי בדיקה ב-`tests/features/`. אסור לעדכן `baseline.json` כדי "להעלים" חריגה.
4. אל תטען שתיקון עימוד "אומת" בלי הרצת הסוויטה בדפדפן אמיתי (Playwright). דווח על מה נבדק ועל מה לא.
5. לא למחוק `archive/` או `docs/knowledge/`. כל קוד שהועבר מגרסה אחרת — לרשום ב-`docs/FEATURE_MAP.md`.
6. נדרשת תיקיית `fonts/` (`tools/import-from-old-repo.sh`), אחרת תוצאות הבדיקות לא ניתנות להשוואה.
