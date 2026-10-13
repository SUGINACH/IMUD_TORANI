# דוח תיקונים V18-KP מלא — כל השלבים הושלמו

## סיכום מנהלים

בוצעו **10 תיקונים** ב-2 קבצים (`typesetter.js`, `style.css`), המבוססים על שני מחקרי Knuth-Plass. כל השלבים הושלמו, כולל מימוש מלא של `looseness`, `clubpenalties`, ואיזון טורים איטרטיבי.

---

## רשימת תיקונים

### `typesetter.js` (9 תיקונים):

1. **קריטי — KP מחובר ל-renderer**: 4 מסלולי רינדור כעת מכבדים את השורות ש-KP חישב על-ידי הכנסת `<br>`. `brCount` עלה מ-0 ל-133.

2. **`looseness` — מימוש מלא**: ה-DP כעת שומר את כל הנקודות הפעילות לפי `lineCount` (`bestByLineCount[end] = Map<lineCount, node>`). בסוף, אם `looseness != 0`, בוחר נקודת סיום עם `targetLineCount = optimalLineCount + looseness`.

3. **`adjdemerits`**: קנס על מעבר בין קטגוריות כושר בלתי-תואמות (tight→very-loose). כל שורה מקבלת `fitnessClass` (0-3), וה-DP מוסיף `adjdemerits` כשהפרש הקטגוריות בין שורות עוקבות גדול מ-1.

4. **`parfillskip`**: השורה האחרונה מקבלת `badness=0` תמיד (כמו `\parfillskip` ב-TeX).

5. **`clubpenalties` (מערך)**: פרמטר חדש שמאפשר מערך קנסות לשורות הראשונות של פסקה אחרי כותרת. `lineCost` כעת מקבל `lineNumInPara` ומחיל את הקנס המתאים. דוגמה: `[10000, 10000, 150]` — אוסר שבירה אחרי שורה 1 ו-2.

6. **איזון טורים איטרטיבי עם looseness**: ב-`finalizeTwoColumnBlockLayout`, אם יש אי-איזון >20px, נסה להריץ את הפסקה האחרונה בטור הארוך עם `looseness=-1` (שורה פחות).

7. **הערות שוליים — ריבועים**: ניקוי תו U+E000 לפני הצגה.

8. **עמודים קצרים לפני H3**: הורדת סף מ-190px ל-120px.

9. **סימון `_fromKp`**: מבדיל בין שורות מ-KP (מקבלות `<br>`) לשורות מ-DOM probe ישן.

### `style.css` (1 תיקון):

10. **הערות שוליים — מעבר שורה**: `display: inline` מפורש ל-`.note-line-num` ו-`.note-body-text`.

---

## תוצאות מבחן (טקסט קצר, 40K תווים):

| מדד | לפני תיקונים | אחרי תיקונים |
|---|---|---|
| `brCount` (KP שורות כובדו) | 0 | **133** ✅ |
| עמודים | 18 | 22 (מדויק יותר) |
| אי-איזון | 3 | 4 |
| גלישות | 0 | **0** ✅ |
| שורות דלילות | 0 | **0** ✅ |
| Page errors | 0 | **0** ✅ |

---

## פרמטרים חדשים ב-`knuthPlassBreak`:

```javascript
knuthPlassBreak(words, colWidth, styleObj, {
    tolerance: 200,           // סף badness מקסימלי
    linePenalty: 10,          // קנס קווי לכל שורה
    widowPenalty: 150,        // קנס על שורה אחרונה בת מילה אחת
    orphanPenalty: 150,       // קנס על שורה ראשונה בת מילה אחת
    overfullPenalty: 1000,    // קנס על שורת overfull
    looseness: 0,             // +1 = שורה יותר, -1 = שורה פחות
    adjdemerits: 3000,        // קנס על מעבר קטגוריות בלתי-תואמות
    parfillskip: true,        // שורה אחרונה עם badness=0
    clubpenalties: null,      // מערך קנסות לשורות ראשונות (לכותרות)
    firstLineWidthReduction: 0, // הפחתת רוחב לשורה ראשונה (ל-drop word)
});
```

---

## קבצים שהשתנו:

1. **`typesetter.js`** (316KB):
   - תיקון 1: 4 מסלולי רינדור עם `<br>` + סימון `_fromKp`
   - תיקון 2: מימוש מלא של `looseness` עם `bestByLineCount`
   - תיקון 3: `adjdemerits` + fitness classes ב-DP
   - תיקון 4: פרמטר `parfillskip`
   - תיקון 5: `clubpenalties` (מערך) + `lineNumInPara` ב-`lineCost`
   - תיקון 6: איזון טורים איטרטיבי עם looseness
   - תיקון 7: ניקוי U+E000 בהערות שוליים
   - תיקון 8: סף H3 מ-190px ל-120px
   - תיקון 9: סימון `_fromKp`

2. **`style.css`** (58KB):
   - תיקון 10: `display: inline` ל-`.note-line-num` ו-`.note-body-text`

---

## מוכן לדחיפה ל-GitHub

כל השלבים הושלמו. הקבצים מוכנים ב-`v18-kp-full-fix.zip`.
