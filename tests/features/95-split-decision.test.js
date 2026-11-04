'use strict';
/* Exhaustive check of the paragraph-cut decision (chooseSplitLines) against an independent brute-force specification.
   Idea taken from V20.2's verify_cut.js (952 combinations for its decideParagraphCut), applied to the base's function. */
module.exports = (test) => {
  test('chooseSplitLines: matches a brute-force specification for every paragraph length, fit, flag and note placement', async ({ page, assert }) => {
    const res = await page.evaluate(() => {
      const mismatches = [];
      let cases = 0;
      // notes: none, or a note that opens in line a and closes in line b (a<b) - cutting between them is forbidden
      const noteShapes = [null, [0, 1], [1, 3], [2, 5], [0, 4]];
      for (let n = 2; n <= 14; n++) {
        for (const shape of noteShapes) {
          if (shape && shape[1] >= n) continue;
          const lines = Array.from({ length: n }, (_, i) => 'מילה' + i + ' טקסט');
          if (shape) { lines[shape[0]] += ' [הערה שמתחילה'; lines[shape[1]] = 'ומסתיימת] ' + lines[shape[1]]; }
          for (let fit = 0; fit <= n + 1; fit++) {
            for (const aw of [false, true]) for (const ao of [false, true]) for (const canPush of [false, true]) {
              cases++;
              const got = chooseSplitLines(lines, fit, aw, ao, canPush, null);
              let want;
              if (fit <= 0 || fit >= n) want = fit;
              else {
                const valid = (k) => {
                  const prefix = lines.slice(0, k).join(' ');
                  const insideNote = (prefix.match(/\[/g) || []).length > (prefix.match(/\]/g) || []).length;
                  return !insideNote && !(aw && k < 2) && !(ao && n - k < 2);
                };
                want = null;
                for (let k = fit; k >= 1; k--) if (valid(k)) { want = k; break; }
                if (want === null) want = canPush ? 0 : fit;
              }
              if (got !== want && mismatches.length < 8) mismatches.push({ n, shape, fit, aw, ao, canPush, got, want });
            }
          }
        }
      }
      return { cases, mismatches };
    });
    assert.ok(res.cases > 2000, 'too few cases: ' + res.cases);
    assert.deepStrictEqual(res.mismatches, [], `${res.mismatches.length}+ mismatches of ${res.cases} cases: ` + JSON.stringify(res.mismatches.slice(0, 3)));
  });
};
