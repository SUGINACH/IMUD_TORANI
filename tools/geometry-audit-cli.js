#!/usr/bin/env node
'use strict';

/* Headless geometry audit runner. Requires: npm install; npx playwright install chromium.
   Run from the project root:
   node tools/geometry-audit-cli.js --input ./very_long_test_text.txt
*/
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');

function parseArgs(argv) {
    const o = { input: null, settings: null, report: './artifacts/geometry-audit.json',
        summary: './artifacts/geometry-audit-summary.md', fullModel: false, failOn: 'high',
        timeoutMs: 180000, viewportWidth: 1440, viewportHeight: 1000, repeatCheck: false, help: false };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        const take = () => { if (i + 1 >= argv.length) throw new Error('Missing value for ' + arg); return argv[++i]; };
        switch (arg) {
            case '--input': case '-i': o.input = take(); break;
            case '--settings': o.settings = take(); break;
            case '--report': o.report = take(); break;
            case '--summary': o.summary = take(); break;
            case '--full-model': o.fullModel = true; break;
            case '--repeat-check': o.repeatCheck = true; break;
            case '--fail-on': o.failOn = take(); break;
            case '--timeout-ms': o.timeoutMs = Number(take()); break;
            case '--viewport-width': o.viewportWidth = Number(take()); break;
            case '--viewport-height': o.viewportHeight = Number(take()); break;
            case '--help': case '-h': o.help = true; break;
            default: throw new Error('Unknown argument: ' + arg);
        }
    }
    if (!['high', 'medium', 'low', 'none'].includes(o.failOn)) throw new Error('--fail-on must be high, medium, low, or none');
    return o;
}
function help() {
    process.stdout.write('Geometry audit CLI\nRequired: --input <text-file>\n' +
      'Options: --settings <json-file>, --report <json-file>, --summary <md-file>, --full-model, --repeat-check,\n' +
      '--fail-on <high|medium|low|none>, --timeout-ms <number>, --viewport-width <number>, --viewport-height <number>\n');
}
function abs(p) { return path.resolve(process.cwd(), p); }
function ensureParent(p) { fs.mkdirSync(path.dirname(p), { recursive: true }); }
function mime(p) {
    const ext = path.extname(p).toLowerCase();
    return ({ '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
      '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8',
      '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
      '.webp':'image/webp', '.woff':'font/woff', '.woff2':'font/woff2', '.ttf':'font/ttf', '.otf':'font/otf' })[ext] || 'application/octet-stream';
}
function staticServer(rootDir) {
    const root = path.resolve(rootDir);
    return http.createServer((req, res) => {
        let pathname;
        try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
        catch { res.writeHead(400).end('Bad request'); return; }
        if (pathname === '/') pathname = '/renderer.html';
        const target = path.resolve(root, '.' + pathname);
        if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
        fs.stat(target, (err, st) => {
            if (err || !st.isFile()) { res.writeHead(404).end('Not found'); return; }
            res.writeHead(200, { 'Content-Type': mime(target), 'Content-Length': st.size, 'Cache-Control':'no-store' });
            fs.createReadStream(target).pipe(res);
        });
    });
}
function rank(s) { return ({ high:3, medium:2, low:1 })[s] || 0; }
function instrumentationIntegrityFailures(report) {
    const a = report.geometry?.layoutDecisionRecordAudit || {};
    const failures = [];
    if (a.recordCountMatchesDom !== true) failures.push('decision-ledger/DOM block-count mismatch');
    if ((a.missingOrMalformedCount ?? 0) !== 0) failures.push('missing or malformed decision records');
    if ((a.missingCrossParenDiagnosticCount ?? 0) !== 0) failures.push('missing/incomplete parenthesis diagnostics');
    if ((a.crossParenDiagnosticErrorCount ?? 0) !== 0) failures.push('parenthesis diagnostic capture errors');
    if ((a.crossParenFinalSnapshotMismatchCount ?? 0) !== 0) failures.push('final parenthesis snapshot differs from exported geometry');
    if ((a.missingParenthesisScopeDiagnosticCount ?? 0) !== 0) failures.push('missing parenthesis-scope diagnostics');
    if ((a.parenthesisScopeDiagnosticErrorCount ?? 0) !== 0) failures.push('parenthesis-scope diagnostic capture error');
    if (report.geometry?.parenthesisScopeSummary == null) failures.push('missing document-level parenthesis-scope summary');
    if ((a.missingParenFontCounterfactualDiagnosticCount ?? 0) !== 0) failures.push('missing local paren-font counterfactual diagnostics');
    if ((a.parenFontCounterfactualRestoreMismatchCount ?? 0) !== 0) failures.push('counterfactual changed geometry after restoring original styles');
    if ((a.parenFontCounterfactualErrorCount ?? 0) !== 0) failures.push('local paren-font counterfactual diagnostic error');
    const counterfactualSummary = report.geometry?.parenFontCounterfactualSummary;
    if (counterfactualSummary == null) {
        failures.push('missing document-level paren-font counterfactual summary');
    } else {
        const records = Array.isArray(report.geometry?.layoutDecisionRecords)
            ? report.geometry.layoutDecisionRecords : [];
        // Independently derive which blocks must be tested. This prevents a broken call
        // order from reporting 0 eligible/0 tested while eligible local-parenthesis
        // imbalance cases exist in the final layout.
        const expectedEligibleCount = records.filter(record => {
            const diff = record.decision?.final?.diff;
            const scope = record.parenScopeDiagnostic;
            const counterfactual = record.parenFontCounterfactual;
            const localParenChars = ['right', 'left'].some(side =>
                ((scope?.[side]?.openCount || 0) + (scope?.[side]?.closeCount || 0)) > 0);
            const crossesBoundary = (scope?.crossColumnScopeCountIntersectingBlock || 0) > 0 ||
                (scope?.crossPageScopeCountIntersectingBlock || 0) > 0;
            // Exclude one-sided blocks: they are not a meaningful two-column
            // balance case even if their wrapper happens to be .block-2col.
            const rightHeight = record.rightHeight;
            const leftHeight = record.leftHeight;
            const bothColumnsHaveContent = Number.isFinite(rightHeight) && rightHeight > 0 &&
                Number.isFinite(leftHeight) && leftHeight > 0;
            return bothColumnsHaveContent && Number.isFinite(diff) && Math.abs(diff) > 4 &&
                (counterfactual?.spanCount || 0) > 0 && localParenChars && !crossesBoundary;
        }).length;
        if (counterfactualSummary.eligibleCount !== expectedEligibleCount) {
            failures.push('local paren-font counterfactual eligibility mismatch: expected ' +
                expectedEligibleCount + ', reported ' + counterfactualSummary.eligibleCount);
        }
        if (counterfactualSummary.testedCount !== expectedEligibleCount) {
            failures.push('local paren-font counterfactual coverage mismatch: expected ' +
                expectedEligibleCount + ' tested cases, reported ' + counterfactualSummary.testedCount);
        }
        if ((counterfactualSummary.restoreMismatchCount ?? 0) !== 0) {
            failures.push('counterfactual summary reports geometry restoration mismatches');
        }
        if ((counterfactualSummary.errorCount ?? 0) !== 0) {
            failures.push('counterfactual summary reports execution errors');
        }
    }
    return failures.concat(decisionDiagnosticFailures(report));
}
function decisionDiagnosticFailures(report) {
    const records = report.geometry?.layoutDecisionRecords;
    const audit = report.geometry?.layoutDecisionRecordAudit || {};
    const failures = [];
    if (!Array.isArray(records)) return ['decision ledger is missing or not an array'];
    if (Number.isFinite(audit.recordCount) && records.length !== audit.recordCount) {
        failures.push('serialized decision ledger length differs from audited record count');
    }
    const compareScore = (a, b) => {
        if (!Array.isArray(a) || !Array.isArray(b)) return null;
        const n = Math.max(a.length, b.length);
        for (let i = 0; i < n; i++) {
            const av = a[i] ?? 0, bv = b[i] ?? 0;
            if (av < bv) return -1;
            if (av > bv) return 1;
        }
        return 0;
    };
    let evaluatedCount = 0;
    let candidateTableCount = 0;
    let capacitySnapshotCount = 0;
    for (let i = 0; i < records.length; i++) {
        const record = records[i] || {};
        const decision = record.decision || {};
        const selection = decision.selection || {};
        const where = 'record #' + (i + 1) + ' (pageIdx=' + record.pageIdx + ')';
        if (!['evaluated', 'not-requested'].includes(selection.status)) {
            failures.push(where + ': unknown/missing selection status');
            continue;
        }
        if (!['balanceColumns', 'light-justify', 'chapter-end-fill-policy'].includes(selection.routing)) {
            failures.push(where + ': unknown/missing balance routing');
        }
        if (selection.status !== 'evaluated') continue;
        evaluatedCount++;
        const table = selection.candidateTable;
        if (!Array.isArray(table) || table.length !== selection.candidateCount) {
            failures.push(where + ': candidate table length does not equal candidateCount');
            continue;
        }
        candidateTableCount++;
        const selected = table.find(candidate => candidate.k === selection.selectedCandidateIndex);
        if (!selected) {
            failures.push(where + ': selectedCandidateIndex is absent from candidate table');
            continue;
        }
        if (JSON.stringify(selected.score) !== JSON.stringify(selection.score)) {
            failures.push(where + ': selected candidate score differs from selection score');
        }
        const scores = table.map(candidate => candidate.score);
        if (scores.some(score => !Array.isArray(score))) {
            failures.push(where + ': candidate table contains a missing/non-array score');
        } else {
            let best = scores[0];
            for (let j = 1; j < scores.length; j++) {
                if (compareScore(scores[j], best) < 0) best = scores[j];
            }
            if (compareScore(selected.score, best) !== 0) {
                failures.push(where + ': selected candidate is not the lexicographic minimum score');
            }
        }
        const before = decision.finalJustify?.capacityBefore;
        const after = decision.finalJustify?.capacityAfter;
        if (!before || !after || !before.right || !before.left || !after.right || !after.left) {
            failures.push(where + ': evaluated candidate is missing before/after stretch-capacity snapshots');
        } else {
            capacitySnapshotCount++;
        }
    }
    const stageAudit = report.geometry?.layoutDecisionRecordAudit || {};
    if ((stageAudit.missingStageGeometryDiagnosticCount ?? 0) !== 0) {
        failures.push('one or more blocks are missing the canonical final geometry snapshot');
    }
    if ((stageAudit.stageGeometryDiagnosticErrorCount ?? 0) !== 0) {
        failures.push('one or more stage geometry snapshots failed to capture');
    }
    let canonicalFinalOverflowCount = 0;
    let orphanReclaimOverflowCount = 0;
    for (const record of records) {
        const stages = record.stageGeometryDiagnostic?.stages || {};
        const finalOverflow = stages['canonical-final']?.block?.bottomOverflow;
        if (Number.isFinite(finalOverflow) && finalOverflow > 0.5) canonicalFinalOverflowCount++;
        const reclaimOverflow = stages['after-orphan-reclaim']?.block?.bottomOverflow;
        if (Number.isFinite(reclaimOverflow) && reclaimOverflow > 0.5) orphanReclaimOverflowCount++;
    }
    const containmentIssueCount = (report.audit?.issues || []).filter(issue => issue.kind === 'containment').length;
    const textAudit = report.geometry?.textConservationAudit;
    if (!textAudit || textAudit.available !== true) {
        failures.push('source-to-rendered content conservation audit is unavailable');
    } else {
        if ((textAudit.missingSourceParagraphCount ?? 0) !== 0) failures.push(textAudit.missingSourceParagraphCount + ' source paragraph token(s) are missing from rendered DOM');
        if ((textAudit.textMismatchCount ?? 0) !== 0) failures.push(textAudit.textMismatchCount + ' source paragraph token(s) differ from rendered raw-text segments');
        if ((textAudit.renderedIdsWithoutSourceCount ?? 0) !== 0) failures.push(textAudit.renderedIdsWithoutSourceCount + ' rendered paragraph token ID(s) have no source token');
        const headings = textAudit.headingAudit;
        if (!headings || headings.missingCount !== 0 || headings.mismatchCount !== 0) failures.push('source heading coverage failed: ' + (headings?.missingCount ?? 'unknown') + ' missing, ' + (headings?.mismatchCount ?? 'unknown') + ' text mismatches');
        const sideNotes = textAudit.sideNoteAudit;
        if (!sideNotes || sideNotes.missingCount !== 0 || sideNotes.mismatchCount !== 0 ||
            (sideNotes.renderedTextMissingCount ?? 0) !== 0 || (sideNotes.renderedTextMismatchCount ?? 0) !== 0) {
            failures.push('source side-note metadata/rendered-text coverage failed');
        }
        const endNotes = textAudit.endNoteAudit;
        if (endNotes && endNotes.sourceCount > 0 &&
            (endNotes.missingCount !== 0 || endNotes.mismatchCount !== 0 || (endNotes.renderedTextMissingCount ?? 0) !== 0)) {
            failures.push('source end-note metadata/rendered-text coverage failed');
        }
    }
    if (canonicalFinalOverflowCount > 0) {
        failures.push(canonicalFinalOverflowCount + ' canonical final block(s) overflow body-flow by more than 0.5px');
    }
    if (orphanReclaimOverflowCount > 0) {
        failures.push(orphanReclaimOverflowCount + ' post-orphan-reclaim block(s) overflow body-flow by more than 0.5px');
    }
    if (containmentIssueCount > 0) {
        failures.push(containmentIssueCount + ' final containment audit finding(s) remain');
    }
    report.geometry.layoutDecisionDiagnosticAudit = {
        recordCount: records.length,
        evaluatedCount,
        candidateTableCount,
        capacitySnapshotCount,
        canonicalFinalOverflowCount,
        orphanReclaimOverflowCount,
        containmentIssueCount,
        stageGeometryDiagnosticCount: stageAudit.stageGeometryDiagnosticCount ?? 0,
        missingStageGeometryDiagnosticCount: stageAudit.missingStageGeometryDiagnosticCount ?? null,
        passed: failures.length === 0,
        failures
    };
    return failures;
}

function markdown(r) {
    const s = r.audit.summary || {};
    const integrityFailures = instrumentationIntegrityFailures(r);
    const lines = ['# Geometry audit report', '', '- Input: ' + r.run.input,
      '- Audit instrumentation integrity: ' + (integrityFailures.length ? 'FAIL' : 'PASS'),
      '- Instrumentation integrity failures: ' + (integrityFailures.length ? integrityFailures.join('; ') : 'none'),
      '- Settings: ' + (r.run.settingsSource || 'unknown'),
      '- Generated: ' + r.run.generatedAt, '- Render duration: ' + r.run.renderMs + ' ms',
      '- Repeat-render determinism: ' + (r.run.determinismCheck ? (r.run.determinismCheck.identical ? 'PASS' : 'FAIL') : 'not run'),
      '- Geometry extraction: ' + (r.geometry.stats.extractMs ?? 'n/a') + ' ms',
      '- Pages: ' + r.pageCount,
      '- Decision ledger: ' + (r.geometry.layoutDecisionRecordAudit?.recordCount ?? 'n/a') + ' records; valid schema-v1 records: ' + (r.geometry.layoutDecisionRecordAudit?.validRecordCount ?? 'n/a'),
      '- DOM two-column blocks: ' + (r.geometry.layoutDecisionRecordAudit?.domBlockCount ?? 'n/a'),
      '- Parenthesis scope map: ' + (r.geometry.parenthesisScopeSummary ? JSON.stringify(r.geometry.parenthesisScopeSummary) : 'missing'),
      '- Blocks with cross-column parenthesis scopes: ' + (r.geometry.layoutDecisionRecordAudit?.crossColumnScopeIntersectingBlockCount ?? 'n/a'),
      '- Blocks with cross-page parenthesis scopes: ' + (r.geometry.layoutDecisionRecordAudit?.crossPageScopeIntersectingBlockCount ?? 'n/a'),
      '- Parenthesis-scope diagnostic coverage: ' + (r.geometry.layoutDecisionRecordAudit?.parenthesisScopeDiagnosticCount ?? 'n/a') + '/' + (r.geometry.layoutDecisionRecordAudit?.recordCount ?? 'n/a'),
      '- Local paren-font counterfactuals: ' + (r.geometry.parenFontCounterfactualSummary ? JSON.stringify(r.geometry.parenFontCounterfactualSummary) : 'missing'),
      '- Counterfactual restoration mismatches/errors: ' + (r.geometry.layoutDecisionRecordAudit?.parenFontCounterfactualRestoreMismatchCount ?? 'n/a') + '/' + (r.geometry.layoutDecisionRecordAudit?.parenFontCounterfactualErrorCount ?? 'n/a'),
      '- Decision diagnostic gate: ' + (r.geometry.layoutDecisionDiagnosticAudit?.passed === true ? 'PASS' : 'FAIL'),
      '- Decision diagnostic records: ' + (r.geometry.layoutDecisionDiagnosticAudit?.recordCount ?? 'n/a'),
      '- Evaluated candidates/tables/capacity snapshots: ' +
        (r.geometry.layoutDecisionDiagnosticAudit?.evaluatedCount ?? 'n/a') + '/' +
        (r.geometry.layoutDecisionDiagnosticAudit?.candidateTableCount ?? 'n/a') + '/' +
        (r.geometry.layoutDecisionDiagnosticAudit?.capacitySnapshotCount ?? 'n/a'),
      '- Decision diagnostic failures: ' +
        ((r.geometry.layoutDecisionDiagnosticAudit?.failures || []).length
          ? r.geometry.layoutDecisionDiagnosticAudit.failures.join('; ') : 'none'),
      '- Ledger/DOM count parity: ' + (r.geometry.layoutDecisionRecordAudit?.recordCountMatchesDom === true ? 'PASS' : r.geometry.layoutDecisionRecordAudit?.recordCountMatchesDom === false ? 'FAIL' : 'unknown'),
      '- Decision records missing/malformed: ' + (r.geometry.layoutDecisionRecordAudit?.missingOrMalformedCount ?? 'n/a'),
      '- Blocks with selected candidate: ' + (r.geometry.layoutDecisionRecordAudit?.selectedCandidateCount ?? 'n/a'),
      '- Blocks with paragraph geometry changes during parenthesis wrapping: ' + (r.geometry.layoutDecisionRecordAudit?.crossParenGeometryChangedBlockCount ?? 'n/a'),
      '- Blocks with style-only changes during parenthesis wrapping: ' + (r.geometry.layoutDecisionRecordAudit?.crossParenStyleChangedBlockCount ?? 'n/a'),
      '- Blocks with paragraph geometry changes in later passes: ' + (r.geometry.layoutDecisionRecordAudit?.crossParenPostGlobalGeometryChangedBlockCount ?? 'n/a'),
      '- Blocks with style-only changes in later passes: ' + (r.geometry.layoutDecisionRecordAudit?.crossParenPostGlobalStyleChangedBlockCount ?? 'n/a'),
      '- Blocks with a post-global height delta > 0.5px: ' + (r.geometry.layoutDecisionRecordAudit?.crossParenPostGlobalHeightDeltaBlockCount ?? 'n/a'),
      '- Local final-justify attempts: ' + (r.geometry.layoutDecisionRecordAudit?.localFinalJustifyAttemptCount ?? 'n/a'),
      '- Local final-justify overshoots corrected: ' + (r.geometry.layoutDecisionRecordAudit?.localFinalJustifyOvershootCorrectedCount ?? 'n/a'),
      '- Local final-justify overshoots remaining: ' + (r.geometry.layoutDecisionRecordAudit?.localFinalJustifyOvershootRemainingCount ?? 'n/a'),
      '- Local final-justify rollbacks: ' + (r.geometry.layoutDecisionRecordAudit?.localFinalJustifyRollbackCount ?? 'n/a'),
      '- Local final-justify balance-improved attempts: ' + (r.geometry.layoutDecisionRecordAudit?.localFinalJustifyBalanceImprovedCount ?? 'n/a'),
      '- Parenthesis final-snapshot mismatches: ' + (r.geometry.layoutDecisionRecordAudit?.crossParenFinalSnapshotMismatchCount ?? 'n/a'),
      '- Blocks with missing/incomplete cross-parenthesis diagnostics: ' + (r.geometry.layoutDecisionRecordAudit?.missingCrossParenDiagnosticCount ?? 'n/a'),
      '- Blocks with cross-parenthesis diagnostic errors: ' + (r.geometry.layoutDecisionRecordAudit?.crossParenDiagnosticErrorCount ?? 'n/a'),
      '- Canonical final stage snapshots: ' + (r.geometry.layoutDecisionRecordAudit?.stageGeometryDiagnosticCount ?? 'n/a') + '/' + (r.geometry.layoutDecisionRecordAudit?.recordCount ?? 'n/a'),
      '- Blocks missing canonical final stage: ' + (r.geometry.layoutDecisionRecordAudit?.missingStageGeometryDiagnosticCount ?? 'n/a'),
      '- Stage diagnostic capture errors: ' + (r.geometry.layoutDecisionRecordAudit?.stageGeometryDiagnosticErrorCount ?? 'n/a'),
      '- Stage snapshot coverage: ' + JSON.stringify(r.geometry.layoutDecisionRecordAudit?.stageGeometryStageCounts ?? {}),
      '- Source-to-rendered paragraph conservation: ' + (r.geometry.textConservationAudit ? (r.geometry.textConservationAudit.available ? (r.geometry.textConservationAudit.sourceParagraphTokenCount + ' source paragraphs; missing ' + r.geometry.textConservationAudit.missingSourceParagraphCount + '; text mismatches ' + r.geometry.textConservationAudit.textMismatchCount + '; extra rendered IDs ' + r.geometry.textConservationAudit.renderedIdsWithoutSourceCount) : 'unavailable: ' + r.geometry.textConservationAudit.reason) : 'not available'),
      '- Source heading coverage: ' + (r.geometry.textConservationAudit?.headingAudit ? (r.geometry.textConservationAudit.headingAudit.sourceCount + ' source headings; missing ' + r.geometry.textConservationAudit.headingAudit.missingCount + '; text mismatches ' + r.geometry.textConservationAudit.headingAudit.mismatchCount) : 'not available'),
      '- Side-note coverage: ' + (r.geometry.textConservationAudit?.sideNoteAudit ? (r.geometry.textConservationAudit.sideNoteAudit.sourceCount + ' source side notes; metadata missing/mismatches ' + r.geometry.textConservationAudit.sideNoteAudit.missingCount + '/' + r.geometry.textConservationAudit.sideNoteAudit.mismatchCount + '; rendered text missing/mismatches ' + r.geometry.textConservationAudit.sideNoteAudit.renderedTextMissingCount + '/' + r.geometry.textConservationAudit.sideNoteAudit.renderedTextMismatchCount) : 'not available'),
      '- End-note coverage: ' + (r.geometry.textConservationAudit?.endNoteAudit ? (r.geometry.textConservationAudit.endNoteAudit.sourceCount + ' source end notes; metadata missing/mismatches ' + r.geometry.textConservationAudit.endNoteAudit.missingCount + '/' + r.geometry.textConservationAudit.endNoteAudit.mismatchCount + '; rendered text missing ' + r.geometry.textConservationAudit.endNoteAudit.renderedTextMissingCount) : 'not available'),
      '- Issues: ' + (s.total ?? r.audit.issues.length),
      '- High: ' + (s.high || 0) + ' | Medium: ' + (s.medium || 0) + ' | Low: ' + (s.low || 0),
      '', '## Issue counts by kind', '', '| Kind | Count |', '|---|---:|'];
    const kinds = Object.entries(s.byKind || {}).sort((a,b) => b[1]-a[1]);
    if (!kinds.length) lines.push('| None | 0 |');
    for (const [k,v] of kinds) lines.push('| ' + String(k).replaceAll('|', '¦') + ' | ' + v + ' |');

    // Report configuration coverage explicitly: a clean run with every ornament
    // disabled must not be mistaken for validation of ornament geometry.
    const effectiveSettings = r.run.settings && typeof r.run.settings === 'object' ? r.run.settings : {};
    const ornamentSettings = Object.entries(effectiveSettings).filter(([key]) => /ornament|(?:^|-)orn(?:-|$)/i.test(key));
    const isSettingActive = value => value !== null && value !== undefined && value !== false &&
      String(value).trim() !== '' && !['none', 'false', '0', 'null'].includes(String(value).trim().toLowerCase());
    const activeOrnamentSettings = ornamentSettings.filter(([, value]) => isSettingActive(value));
    lines.push('', '## Geometry feature coverage', '',
      '- Ornament-related settings active: ' + activeOrnamentSettings.length + '/' + ornamentSettings.length);
    if (activeOrnamentSettings.length) {
      lines.push('- Active ornament settings: ' + activeOrnamentSettings.map(([key, value]) => key + '=' + String(value)).join(', '));
    } else if (ornamentSettings.length) {
      lines.push('- Ornament geometry coverage: NOT EXERCISED — all ornament-related settings are disabled/none; this run does not validate ornament containment, clipping, or collisions.');
    } else {
      lines.push('- Ornament geometry coverage: UNKNOWN — no ornament-related settings were found in the run metadata.');
    }

    const counterfactualRows = (Array.isArray(r.geometry.layoutDecisionRecords) ? r.geometry.layoutDecisionRecords : [])
      .filter(record => record.parenFontCounterfactual?.tested === true)
      .sort((a, b) => (a.pageIdx ?? 0) - (b.pageIdx ?? 0));
    lines.push('', '## Local parenthesis-font counterfactuals', '',
      'These are diagnostic-only measurements. The engine restores the original styles after each test; same-font values are not the production layout.',
      '', '| Page | Baseline R/L (px) | Same-font R/L (px) | Residual before → after (px) | Restored exactly |',
      '|---:|---:|---:|---:|:---:|');
    if (!counterfactualRows.length) {
      lines.push('| No eligible cases | — | — | — | — |');
    } else {
      for (const record of counterfactualRows) {
        const c = record.parenFontCounterfactual;
        const baseline = c.baseline || {};
        const same = c.sameFont || {};
        const beforeDiff = Math.abs((baseline.rightHeight || 0) - (baseline.leftHeight || 0));
        const afterDiff = Number.isFinite(c.sameFontDiff) ? c.sameFontDiff :
          Math.abs((same.rightHeight || 0) - (same.leftHeight || 0));
        const page = record.pageLabel || record.pageIdx;
        lines.push('| ' + String(page).replaceAll('|', '¦') +
          ' | ' + (baseline.rightHeight ?? 'n/a') + '/' + (baseline.leftHeight ?? 'n/a') +
          ' | ' + (same.rightHeight ?? 'n/a') + '/' + (same.leftHeight ?? 'n/a') +
          ' | ' + beforeDiff + ' → ' + afterDiff +
          ' | ' + (c.restoreMatches === true ? 'yes' : 'NO') + ' |');
      }
    }
    const balanceOutcomes = Object.entries(s.byBalanceOutcome || {}).sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0]));
    if (balanceOutcomes.length) {
      lines.push('', '## Balance residual classification', '',
        'Every residual remains in the issue inventory. This table classifies the measured cause/policy; it does not suppress or waive the finding.',
        '', '| Classification | Count |', '|---|---:|');
      for (const [outcome, count] of balanceOutcomes) {
        lines.push('| ' + String(outcome).replaceAll('|', '¦') + ' | ' + count + ' |');
      }
    }
    const fnRows = Array.isArray(r.footnoteMeasurementAudit) ? r.footnoteMeasurementAudit : [];
    const fnMatched = fnRows.filter(x => x.matchFound && Number.isFinite(x.diff));
    const fnUnmatched = fnRows.filter(x => !x.matchFound);
    const fnLargeDiffs = fnMatched.filter(x => Math.abs(x.diff) > 5);
    const fnMaxAbsDiff = fnMatched.length ? Math.max(...fnMatched.map(x => Math.abs(x.diff))) : null;
    lines.push('', '## Footnote measurement consistency', '',
      '- Pages with footnote areas: ' + fnRows.length,
      '- Exact queue matches: ' + fnRows.filter(x => x.matchFound).length + '/' + fnRows.length,
      '- Matched samples with |actual − measured| > 5px: ' + fnLargeDiffs.length,
      '- Maximum absolute difference: ' + (fnMaxAbsDiff === null ? 'n/a' : fnMaxAbsDiff + 'px'));
    if (fnUnmatched.length) lines.push('- **Unmatched measurements: ' + fnUnmatched.length + '**');
    if (fnLargeDiffs.length) {
      lines.push('', '| Page | Measured (px) | Actual (px) | Δ (px) | Probe width (px) | Measured area width (px) |',
        '|---:|---:|---:|---:|---:|---:|');
      for (const x of [...fnLargeDiffs].sort((a,b) => Math.abs(b.diff) - Math.abs(a.diff)).slice(0,10)) {
        lines.push('| ' + (x.pageLabel || x.pageIdx) + ' | ' + x.measured + ' | ' + x.realH + ' | ' + x.diff +
          ' | ' + (x.measuredProbeWidth ?? 'n/a') + ' | ' + (x.measuredAreaWidth ?? 'n/a') + ' |');
      }
    }
    const noteCorrections = Array.isArray(r.geometry.sideNoteFitCorrections) ? r.geometry.sideNoteFitCorrections : [];
    lines.push('', '## Side-note fit adjustments', '');
    if (!noteCorrections.length) lines.push('No side-note fit adjustments were needed.');
    else for (const x of noteCorrections) {
      const action = String(x.correction || '');
      const description = action.startsWith('blocked-')
        ? 'not moved (' + action + ')'
        : action + ' by ' + x.shiftPx + 'px';
      lines.push('- Page ' + (x.pageLabel || x.pageIdx) + ' — token ' + (x.tokenId || 'unknown') +
        ': ' + description + '; note height ' + (x.rect?.h ?? 'n/a') + 'px.');
    }
    lines.push('', '## Issues', '');
    if (!r.audit.issues.length) lines.push('No issues reported by the current geometry audit.');
    else for (const i of r.audit.issues) lines.push('- **' + String(i.severity || 'unknown').toUpperCase() +
      '** — ' + (i.kind || 'unknown kind') + ' — page ' + (i.pageIdx ?? 'unknown') + ' — ' + (i.message || i.description || JSON.stringify(i)));
    lines.push('');
    return lines.join('\n');
}

async function triggerTypeset(page, text, settings, timeoutMs) {
    return page.evaluate(({ text, settings, timeoutMs }) => new Promise((resolve, reject) => {
        let settled = false;
        const cleanup = () => { window.removeEventListener('message', onMessage); clearTimeout(timer); };
        const finish = (fn, val) => { if (settled) return; settled = true; cleanup(); fn(val); };
        const onMessage = event => {
            const msg = event.data;
            if (!msg || typeof msg !== 'object') return;
            if (msg.type === 'render-error') finish(reject, new Error(msg.error || 'Renderer error'));
            if (msg.type === 'render-done') finish(resolve, { pageCountAtDone: msg.pageCount });
        };
        const timer = setTimeout(() => finish(reject, new Error('Renderer timeout after ' + timeoutMs + ' ms')), timeoutMs);
        window.addEventListener('message', onMessage);
        window.postMessage({ type: 'typeset', text, settings }, '*');
    }), { text, settings, timeoutMs });
}

async function captureLayoutSignature(page) {
    return page.evaluate(() => {
        const round = n => Math.round(n * 1000) / 1000;
        const rect = el => {
            const r = el.getBoundingClientRect();
            return [round(r.x), round(r.y), round(r.width), round(r.height)];
        };
        const paragraph = p => {
            const r = p.getBoundingClientRect();
            const cs = getComputedStyle(p);
            const range = document.createRange();
            range.selectNodeContents(p);
            // Inline spans can produce several client rects on the same visual line.
            // Merge fragments by their half-pixel top coordinate into actual line bands.
            const lineMap = new Map();
            for (const q of Array.from(range.getClientRects())) {
                if (q.width < 0.1 || q.height < 0.1) continue;
                const key = Math.round(q.top * 2) / 2;
                const line = lineMap.get(key) || {
                    x: q.left, right: q.right, top: q.top, bottom: q.bottom
                };
                line.x = Math.min(line.x, q.left);
                line.right = Math.max(line.right, q.right);
                line.top = Math.min(line.top, q.top);
                line.bottom = Math.max(line.bottom, q.bottom);
                lineMap.set(key, line);
            }
            const lineRects = Array.from(lineMap.values())
                .sort((a, b) => a.top - b.top || a.x - b.x)
                .map(q => [
                    round(q.x), round(q.top),
                    round(q.right - q.x), round(q.bottom - q.top)
                ]);
            return {
                cls: String(p.className || ''),
                tokenId: p.getAttribute('data-token-id') || '',
                continuation: p.getAttribute('data-is-cont') || '',
                rawText: p.getAttribute('data-raw-text') || p.textContent || '',
                rect: [round(r.x), round(r.y), round(r.width), round(r.height)],
                lineRects,
                typography: {
                    fontFamily: cs.fontFamily, fontSize: cs.fontSize,
                    fontWeight: cs.fontWeight, fontStyle: cs.fontStyle,
                    lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing,
                    wordSpacing: cs.wordSpacing, textAlign: cs.textAlign,
                    textAlignLast: cs.textAlignLast, direction: cs.direction,
                    whiteSpace: cs.whiteSpace, textIndent: cs.textIndent,
                    marginTop: cs.marginTop, marginBottom: cs.marginBottom,
                    paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom
                }
            };
        };
        const column = el => ({
            cls: String(el.className || ''),
            rect: rect(el),
            paragraphs: Array.from(el.children).filter(x => x.tagName === 'P').map(paragraph)
        });
        // Include geometric elements that can change page appearance or available space,
        // even when they are not children of page-body-flow. This is a geometry signature,
        // not a visual pixel diff; it deliberately records computed box metrics.
        const geometrySelector = [
            '.page-content-wrapper', '.top-header-grid', '.header-col-r', '.header-col-c', '.header-col-l',
            '.hdr-pagenum', '.hdr-txt', '.page-number-footer', '.page-body-flow',
            '[class*="ornament"]', '[class*="divider"]', '[class*="rule"]',
            '.col-gutter-divider', '.footnote-area', '.footnote-header-wrap',
            '.footnote-header-title', '.note-line', '.note-line-num', '.side-note-anchor'
        ].join(',');
        const geometryNode = el => {
            const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
            const text = el.children.length === 0 ? (el.textContent || '').trim().slice(0, 120) : '';
            return {
                tag: el.tagName,
                cls: String(el.className || ''),
                id: el.id || '',
                text,
                rect: rect(el),
                box: {
                    display: cs.display, position: cs.position,
                    marginTop: cs.marginTop, marginRight: cs.marginRight,
                    marginBottom: cs.marginBottom, marginLeft: cs.marginLeft,
                    paddingTop: cs.paddingTop, paddingRight: cs.paddingRight,
                    paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft,
                    borderTopWidth: cs.borderTopWidth, borderRightWidth: cs.borderRightWidth,
                    borderBottomWidth: cs.borderBottomWidth, borderLeftWidth: cs.borderLeftWidth,
                    fontSize: cs.fontSize, lineHeight: cs.lineHeight
                }
            };
        };
        return Array.from(document.querySelectorAll('#book-container .a4-page')).map((pg, idx) => {
            const flow = pg.querySelector('.page-body-flow');
            const blocks = flow ? Array.from(flow.children).map(el => ({
                cls: String(el.className || ''),
                rect: rect(el),
                text: /title-level|sec-divider|h2-|h3-/.test(String(el.className || '')) ? (el.textContent || '') : '',
                columns: Array.from(el.querySelectorAll('.right-col, .left-col, .single-wide-col')).map(column),
                sideNotes: Array.from(el.querySelectorAll('.side-note-anchor')).map(n => ({
                    tokenId: n.getAttribute('data-for-token') || '',
                    text: n.textContent || '',
                    rect: rect(n)
                }))
            })) : [];
            const fn = pg.querySelector('.footnote-area');
            return {
                index: idx,
                label: pg.querySelector('.page-number-footer')?.textContent?.trim() || String(idx + 1),
                rect: rect(pg),
                flowRect: flow ? rect(flow) : null,
                blocks,
                geometryNodes: Array.from(pg.querySelectorAll(geometrySelector)).map(geometryNode),
                footnotes: fn ? {
                    rect: rect(fn),
                    notes: Array.from(fn.querySelectorAll('.note-line')).map(n => ({
                        id: n.id || '', text: n.textContent || '', rect: rect(n)
                    }))
                } : null
            };
        });
    });
}

function sha256(value) {
    return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) return help();
    if (!args.input) throw new Error('Missing required --input. Use --help for usage.');
    if (!Number.isFinite(args.timeoutMs) || args.timeoutMs < 1000) throw new Error('--timeout-ms must be at least 1000');
    const root = process.cwd(), inputPath = abs(args.input);
    if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isFile()) throw new Error('Input file not found: ' + inputPath);
    const inputText = fs.readFileSync(inputPath, 'utf8');
    if (!inputText.trim()) throw new Error('Input file is empty: ' + inputPath);
    let settings = {};
    let settingsSource = 'empty';
    if (args.settings) {
        settings = JSON.parse(fs.readFileSync(abs(args.settings), 'utf8'));
        if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new Error('Settings JSON must be an object.');
        settingsSource = path.relative(root, abs(args.settings)).split(path.sep).join('/');
    } else {
        // The real app applies default_settings.json before typesetting. Use the same defaults
        // in headless audits; otherwise renderer-bridge's hidden inputs leave checkbox .checked
        // false (even when the stored default value is true), silently disabling quality rules.
        const defaultSettingsPath = abs('./default_settings.json');
        if (fs.existsSync(defaultSettingsPath) && fs.statSync(defaultSettingsPath).isFile()) {
            settings = JSON.parse(fs.readFileSync(defaultSettingsPath, 'utf8'));
            if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new Error('Default settings JSON must be an object.');
            settingsSource = 'default_settings.json (automatic default)';
        } else {
            settingsSource = 'empty (default_settings.json not found)';
        }
    }
    let chromium;
    try { chromium = require('playwright').chromium; }
    catch { throw new Error('Playwright is not installed. Run npm install, then npx playwright install chromium.'); }

    const server = staticServer(root);
    await new Promise((resolve,reject) => { server.once('error',reject); server.listen(0,'127.0.0.1',resolve); });
    const baseUrl = 'http://127.0.0.1:' + server.address().port;
    let browser;
    const pageErrors = [], consoleErrors = [], started = Date.now();
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage({ viewport: { width: args.viewportWidth, height: args.viewportHeight }, deviceScaleFactor: 1 });
        page.on('pageerror', e => pageErrors.push(String(e && (e.stack || e))));
        page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
        page.on('requestfailed', req => consoleErrors.push('Request failed: ' + req.url() + ' (' + (req.failure()?.errorText || 'unknown') + ')'));
        await page.goto(baseUrl + '/renderer.html', { waitUntil: 'load', timeout: args.timeoutMs });
        await page.waitForFunction(() => typeof window.typesetDocument === 'function' && window.__geomAudit && typeof window.__geomAudit.audit === 'function', null, { timeout: 30000 });

        // renderer.html sets __isRenderer=true, so app.js intentionally skips its normal
        // window.onload initialization. That also skips loadDefaultSettings(); call it
        // explicitly here instead of waiting for a promise that can never be fulfilled.
        await page.evaluate(async () => {
            if (typeof window.loadDefaultSettings !== 'function' || typeof window.getDefaultSettings !== 'function') {
                throw new Error('Settings manager API unavailable in renderer');
            }
            await window.loadDefaultSettings();
            if (window.getDefaultSettings() === null) {
                throw new Error('default_settings.json did not load; refusing to typeset with implicit fallback settings');
            }
        });

        // Wait for initial CSS/web fonts before pagination decisions are made.
        // Waiting only after typesetting can leave page breaks measured with fallback fonts.
        await page.evaluate(async () => {
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
        });

        const renderResult = await triggerTypeset(page, inputText, settings, args.timeoutMs);
        let determinismCheck = null;
        if (args.repeatCheck) {
            const firstSignature = await captureLayoutSignature(page);
            const firstPageHashes = firstSignature.map(sha256);
            const secondRenderResult = await triggerTypeset(page, inputText, settings, args.timeoutMs);
            const secondSignature = await captureLayoutSignature(page);
            const secondPageHashes = secondSignature.map(sha256);
            const common = Math.min(firstPageHashes.length, secondPageHashes.length);
            let firstDifferingPage = null;
            for (let i = 0; i < common; i++) {
                if (firstPageHashes[i] !== secondPageHashes[i]) { firstDifferingPage = i; break; }
            }
            if (firstDifferingPage === null && firstPageHashes.length !== secondPageHashes.length) firstDifferingPage = common;
            determinismCheck = {
                identical: firstPageHashes.length === secondPageHashes.length && firstPageHashes.every((h, i) => h === secondPageHashes[i]),
                firstPageCount: firstPageHashes.length,
                secondPageCount: secondPageHashes.length,
                firstHash: sha256(firstPageHashes),
                secondHash: sha256(secondPageHashes),
                firstDifferingPage,
                secondRenderResult
            };
        }

        await page.evaluate(async () => {
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });
        const data = await page.evaluate(({ includeFullModel }) => {
            if (!window.__geomAudit) throw new Error('Geometry audit API unavailable');
            const model = window.__geomAudit.extract();
            const audit = window.__geomAudit.audit(model);
            // The full per-page export can be large. Build it only when explicitly requested;
            // the default report needs summary/issues/stats, not a duplicate serialized DOM model.
            const clean = includeFullModel
                ? { pages:model.pages.map(p => window.__geomAudit.cleanForExport(p)), stats:model.stats }
                : null;
            const fnAudit = typeof window.auditFnMeasurement === 'function' ? window.auditFnMeasurement() : null;
            // Diagnostic-only source-to-rendered paragraph conservation audit. Paragraph tokens may
            // legitimately be split across pages/columns; concatenate their recorded raw segments in DOM order.
            const textConservationAudit = (() => {
                const source = typeof globalTokens !== 'undefined' && Array.isArray(globalTokens) ? globalTokens : null;
                if (!source) return { available: false, reason: 'globalTokens lexical binding unavailable' };
                const normalize = value => {
                    const box = document.createElement('div');
                    box.innerHTML = String(value ?? '');
                    return (box.textContent || '').replace(/\u00a0/g, ' ').replace(/[\s\u200f\u200e]+/g, ' ').trim();
                };
                const sourceParagraphs = source.filter(token => token && token.type === 'p');
                const sourceHeadings = source.filter(token => token && /^h\d+$/.test(token.type));
                const sourceSideNotes = sourceParagraphs.filter(token => token.sideNote);
                const sourceEndNotes = sourceParagraphs.filter(token => token.endNote);
                const segments = new Map();
                for (const p of Array.from(document.querySelectorAll('#book-container p[data-token-id]'))) {
                    const id = p.getAttribute('data-token-id');
                    if (id == null) continue;
                    if (!segments.has(id)) segments.set(id, []);
                    segments.get(id).push(p.getAttribute('data-raw-text') ?? p.textContent ?? '');
                }
                const missing = [], mismatches = [], extraRenderedIds = [];
                const sourceIds = new Set(sourceParagraphs.map(token => String(token.id)));
                for (const token of sourceParagraphs) {
                    const id = String(token.id);
                    const parts = segments.get(id) || [];
                    if (!parts.length) { missing.push({ id: token.id, lineIdx: token.lineIdx, text: normalize(token.text).slice(0, 120) }); continue; }
                    const expected = normalize(token.text);
                    const actual = normalize(parts.join(' '));
                    if (expected !== actual) mismatches.push({
                        id: token.id, lineIdx: token.lineIdx, segmentCount: parts.length,
                        expectedLength: expected.length, actualLength: actual.length,
                        expected: expected.slice(0, 180), actual: actual.slice(0, 180)
                    });
                }
                for (const id of segments.keys()) if (!sourceIds.has(String(id))) extraRenderedIds.push(id);
                const normalizeHeading = value => normalize(value).replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
                const headingMissing = [], headingMismatches = [];
                for (const token of sourceHeadings) {
                    const id = String(token.id), expected = normalizeHeading(token.text);
                    const elems = Array.from(document.querySelectorAll('#book-container [data-token-id]'))
                        .filter(el => el.getAttribute('data-token-id') === id);
                    if (!elems.length) { headingMissing.push({ id: token.id, type: token.type, text: expected.slice(0, 120) }); continue; }
                    const actuals = elems.map(el => {
                        const clone = el.cloneNode(true);
                        clone.querySelectorAll('.shaar-drag-bar, .shaar-resize-handle').forEach(control => control.remove());
                        return normalizeHeading(clone.textContent);
                    });
                    if (expected && !actuals.some(actual => actual.includes(expected))) {
                        headingMismatches.push({ id: token.id, type: token.type, expected: expected.slice(0, 160), actuals: actuals.slice(0, 3).map(x => x.slice(0, 160)) });
                    }
                }
                const noteMetadata = (tokens, tokenKey, attr) => {
                    const missing = [], mismatches = [], renderedTextMissing = [], renderedTextMismatches = [];
                    const renderedBodies = tokenKey === 'sideNote'
                        ? Array.from(document.querySelectorAll('#book-container .side-note-anchor'))
                        : Array.from(document.querySelectorAll('#book-container .note-line span'));
                    for (const token of tokens) {
                        const expected = normalize(token[tokenKey]);
                        const elems = Array.from(document.querySelectorAll('#book-container p[data-token-id]'))
                            .filter(el => el.getAttribute('data-token-id') === String(token.id) && el.hasAttribute(attr));
                        if (!elems.length) { missing.push({ id: token.id, attr, expected: expected.slice(0, 120) }); }
                        else if (!elems.some(el => normalize(el.getAttribute(attr)) === expected)) {
                            mismatches.push({ id: token.id, attr, expected: expected.slice(0, 120), actual: elems.map(el => normalize(el.getAttribute(attr)).slice(0, 120)) });
                        }
                        const bodyMatches = tokenKey === 'sideNote'
                            ? renderedBodies.filter(el => el.getAttribute('data-for-token') === String(token.id) && normalize(el.textContent) === expected)
                            : renderedBodies.filter(el => normalize(el.textContent).includes(expected));
                        if (!bodyMatches.length) renderedTextMissing.push({ id: token.id, expected: expected.slice(0, 120) });
                        else if (tokenKey === 'sideNote' && !bodyMatches.some(el => normalize(el.textContent) === expected)) {
                            renderedTextMismatches.push({ id: token.id, expected: expected.slice(0, 120), actual: bodyMatches.map(el => normalize(el.textContent).slice(0, 120)) });
                        }
                    }
                    return {
                        sourceCount: tokens.length,
                        missingCount: missing.length,
                        mismatchCount: mismatches.length,
                        renderedTextMissingCount: renderedTextMissing.length,
                        renderedTextMismatchCount: renderedTextMismatches.length,
                        missing: missing.slice(0, 30),
                        mismatches: mismatches.slice(0, 30),
                        renderedTextMissing: renderedTextMissing.slice(0, 30),
                        renderedTextMismatches: renderedTextMismatches.slice(0, 30)
                    };
                };
                return {
                    available: true,
                    sourceTokenCount: source.length,
                    sourceParagraphTokenCount: sourceParagraphs.length,
                    renderedParagraphTokenIdCount: segments.size,
                    missingSourceParagraphCount: missing.length,
                    textMismatchCount: mismatches.length,
                    renderedIdsWithoutSourceCount: extraRenderedIds.length,
                    missing: missing.slice(0, 50),
                    mismatches: mismatches.slice(0, 50),
                    renderedIdsWithoutSource: extraRenderedIds.slice(0, 50),
                    headingAudit: { sourceCount: sourceHeadings.length, missingCount: headingMissing.length, mismatchCount: headingMismatches.length, missing: headingMissing.slice(0, 50), mismatches: headingMismatches.slice(0, 50) },
                    sideNoteAudit: noteMetadata(sourceSideNotes, 'sideNote', 'data-side-note'),
                    endNoteAudit: noteMetadata(sourceEndNotes, 'endNote', 'data-end-note')
                };
            })();
            return {
                pageCount: document.querySelectorAll('#book-container .a4-page').length,
                summary:audit.summary, issues:audit.issues, stats:model.stats, model:clean,
                footnoteMeasurementAudit:fnAudit, textConservationAudit,
                fontsStatus:document.fonts ? document.fonts.status : 'unknown',
                fontPreflight:window.__fontPreflight || null,
                // Preserve fit-correction evidence from extractGeometry() in the report; otherwise
                // the Markdown summary incorrectly defaults to 'no adjustments were needed'.
                sideNoteFitCorrections: model.sideNoteFitCorrections || [],
                // Read these directly from the live DOM. The default report intentionally
                // omits the full extracted page tree, so synthetic-node fields alone would
                // otherwise be lost from geometry-audit.json.
                footnoteReflowDiagnostics: Array.from(document.querySelectorAll('#book-container .a4-page')).map((pg, pageIdx) => {
                    const flow = pg.querySelector('.page-body-flow');
                    const flowRect = flow?.getBoundingClientRect();
                    const last = flow?.lastElementChild;
                    const lastRect = last?.getBoundingClientRect();
                    const note = pg.querySelector('.footnote-area');
                    const noteRect = note?.getBoundingClientRect();
                    const attr = name => pg.getAttribute(name);
                    const num = name => {
                        const v = attr(name);
                        return v == null || v === '' ? null : Number(v);
                    };
                    return {
                        pageIdx,
                        pageLabel: pg.querySelector('.page-number-footer')?.textContent?.trim() || String(pageIdx + 1),
                        queueCount: num('data-fn-reflow-queue-count'),
                        redoCheckReason: pg.getAttribute('data-layout-redo-reason'),
                        redoCheckAttempts: num('data-layout-redo-attempts'),
                        redoCheckReserve: num('data-layout-redo-reserve'),
                        redoCheckRemainingHeight: num('data-layout-redo-rem-height'),
                        redoCheckFreeAfterReserve: num('data-layout-redo-free-after-reserve'),
                        redoCheckFlowHeight: num('data-layout-redo-flow-height'),
                        redoCheckLastChildHeight: num('data-layout-redo-last-child-height'),
                        redoCheckLastChildOverflow: num('data-layout-redo-last-child-overflow'),
                        predictedHeight: num('data-fn-reflow-predicted-height'),
                        beforeFlowHeight: num('data-fn-reflow-before-flow-height'),
                        afterFlowHeight: num('data-fn-reflow-after-flow-height'),
                        flowHeightDelta: num('data-fn-reflow-flow-height-delta'),
                        beforeLastBlockHeight: num('data-fn-reflow-before-last-block-height'),
                        afterLastBlockHeight: num('data-fn-reflow-after-last-block-height'),
                        afterLastBlockOverflow: num('data-fn-reflow-after-last-block-overflow'),
                        lastBlockTopOffset: num('data-fn-reflow-last-block-top-offset'),
                        finalFlowHeight: flowRect ? Math.round(flowRect.height * 100) / 100 : null,
                        finalLastBlockHeight: lastRect ? Math.round(lastRect.height * 100) / 100 : null,
                        finalLastBlockOverflow: lastRect && flowRect ? Math.round((lastRect.bottom - flowRect.bottom) * 100) / 100 : null,
                        finalLastBlockTopOffset: lastRect && flowRect ? Math.round((lastRect.top - flowRect.top) * 100) / 100 : null,
                        finalFootnoteAreaHeight: noteRect ? Math.round(noteRect.height * 100) / 100 : null
                    };
                }),
                layoutDiagnostics: Array.from(document.querySelectorAll('#book-container .a4-page')).flatMap((pg, pageIdx) => {
                    const flow = pg.querySelector('.page-body-flow');
                    if (!flow) return [];
                    const fr = flow.getBoundingClientRect();
                    return Array.from(flow.children).filter(el => el.classList.contains('block-2col')).flatMap(el => {
                        const r = el.getBoundingClientRect();
                        const overflow = r.bottom - fr.bottom;
                        const rightCol = el.querySelector('.right-col');
                        const leftCol = el.querySelector('.left-col');
                        const rightRect = rightCol?.getBoundingClientRect();
                        const leftRect = leftCol?.getBoundingClientRect();
                        const rightHeight = rightRect?.height ?? null;
                        const leftHeight = leftRect?.height ?? null;
                        const columnDiff = (rightHeight !== null && leftHeight !== null)
                            ? Math.abs(rightHeight - leftHeight) : null;
                        // Capture measurable column imbalance even when the block fits inside body-flow.
                        // A >5px residual gap can reveal a global-justify rollback that the issue
                        // summary alone cannot explain; keep overflow-only diagnostics as before.
                        if (overflow <= 15 && !(columnDiff > 5)) return [];
                        const cs = getComputedStyle(el);
                        return [{
                            pageIdx,
                            pageLabel: pg.querySelector('.page-number-footer')?.textContent?.trim() || String(pageIdx + 1),
                            flow: { top: fr.top, bottom: fr.bottom, rectHeight: fr.height, clientHeight: flow.clientHeight },
                            block: { top: r.top, bottom: r.bottom, height: r.height, topOffset: r.top - fr.top, overflow },
                            columnBalance: { rightHeight, leftHeight, absoluteDiff: columnDiff },
                            attrs: Object.fromEntries([
                                'data-layout-fill-remaining','data-layout-fill-flow-height','data-layout-fill-top-offset',
                                'data-layout-balance-called','data-layout-balance-status','data-layout-balance-skip-reason',
                                'data-layout-balance-input-height','data-layout-balance-available','data-layout-balance-candidates','data-layout-balance-items',
                                'data-layout-balance-fits','data-layout-balance-valid','data-layout-balance-over',
                                'data-layout-balance-right','data-layout-balance-left','data-layout-balance-diff',
                                'data-layout-balance-right-part-lines','data-layout-balance-left-part-lines',
                                'data-layout-balance-selection-policy','data-layout-balance-selected-candidate',
                                'data-layout-balance-split-item-index','data-layout-balance-split-line-count',
                                'data-layout-balance-selection-score','data-layout-decision-record',
                                'data-layout-final-phase','data-layout-final-right-height','data-layout-final-left-height',
                                'data-layout-final-diff','data-layout-final-inner-height',
                                'data-layout-final-outer-height','data-layout-final-fits',
                                'data-layout-final-justify-rollback-reason',
                                'data-layout-postfit-triggered','data-layout-postfit-outer-overflow','data-layout-postfit-inner-overflow',
                                'data-layout-balance-final-justify-rolled-back','data-layout-global-justify-rolled-back',
                                'data-layout-global-justify-rollback-reason',
                                'data-layout-global-justify-before-right','data-layout-global-justify-before-left',
                                'data-layout-global-justify-before-outer','data-layout-global-justify-after-right',
                                'data-layout-global-justify-after-left','data-layout-global-justify-after-outer',
                                'data-layout-global-justify-after-inner','data-layout-page-final-justify-rolled-back'
                            ].map(k => [k, el.getAttribute(k)])),
                            style: { display: cs.display, height: cs.height, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, marginTop: cs.marginTop, marginBottom: cs.marginBottom },
                            columns: ['.right-col','.left-col'].map(sel => {
                                const col = el.querySelector(sel);
                                if (!col) return null;
                                const cc = getComputedStyle(col), cr = col.getBoundingClientRect();
                                return {
                                    side: sel, scrollHeight: col.scrollHeight, offsetHeight: col.offsetHeight,
                                    rectHeight: cr.height, top: cr.top, bottom: cr.bottom,
                                    lineHeight: cc.lineHeight, fontSize: cc.fontSize,
                                    paragraphs: Array.from(col.children).filter(p => p.tagName === 'P').map(p => {
                                        const pc = getComputedStyle(p), pr = p.getBoundingClientRect();
                                        return { cls: p.className, tokenId: p.getAttribute('data-token-id'), continuation: p.getAttribute('data-is-cont'),
                                            text: (p.getAttribute('data-raw-text') || p.textContent || '').slice(0,100),
                                            rectHeight: pr.height, offsetHeight: p.offsetHeight, scrollHeight: p.scrollHeight,
                                            lineHeight: pc.lineHeight, fontSize: pc.fontSize, marginTop: pc.marginTop, marginBottom: pc.marginBottom,
                                            paddingBottom: pc.paddingBottom, baseLineHeight: p.getAttribute('data-base-lh') };
                                    })
                                };
                            })
                        }];
                    });
                }),
                // Full, compact decision ledger: one entry per two-column block, including
                // blocks without audit findings. This is the primary path for explaining a
                // layout decision without reverse-engineering the rendered DOM.
                layoutDecisionRecords: Array.from(document.querySelectorAll('#book-container .a4-page')).flatMap((pg, pageIdx) => {
                    const flow = pg.querySelector('.page-body-flow');
                    if (!flow) return [];
                    return Array.from(flow.children).filter(el => el.classList.contains('block-2col')).map(el => {
                        const rect = el.getBoundingClientRect();
                        const right = el.querySelector('.right-col');
                        const left = el.querySelector('.left-col');
                        let decision = null;
                        let crossParenDiagnostic = null;
                        let parenScopeDiagnostic = null;
                        let parenFontCounterfactual = null;
                        let stageGeometryDiagnostic = null;
                        try {
                            const raw = el.getAttribute('data-layout-decision-record');
                            if (raw) decision = JSON.parse(raw);
                        } catch (_) { /* malformed records remain explicitly absent in the report */ }
                        try {
                            const raw = el.getAttribute('data-layout-cross-paren-diagnostic');
                            if (raw) crossParenDiagnostic = JSON.parse(raw);
                        } catch (_) { /* malformed diagnostics remain explicitly absent in the report */ }
                        try {
                            const raw = el.getAttribute('data-layout-paren-scope-diagnostic');
                            if (raw) parenScopeDiagnostic = JSON.parse(raw);
                        } catch (_) { /* malformed parenthesis-scope diagnostics remain explicitly absent */ }
                        try {
                            const raw = el.getAttribute('data-layout-paren-font-counterfactual');
                            if (raw) parenFontCounterfactual = JSON.parse(raw);
                        } catch (_) { /* malformed counterfactual diagnostics remain explicitly absent */ }
                        try {
                            const raw = el.getAttribute('data-layout-stage-geometry-diagnostic');
                            if (raw) stageGeometryDiagnostic = JSON.parse(raw);
                        } catch (_) { /* malformed stage snapshots remain explicitly absent in the report */ }
                        const crossParenDiagnosticError = el.getAttribute('data-layout-cross-paren-diagnostic-error');
                        const stageGeometryDiagnosticError = el.getAttribute('data-layout-stage-geometry-diagnostic-error');
                        return {
                            pageIdx,
                            pageLabel: pg.querySelector('.page-number-footer')?.textContent?.trim() || String(pageIdx + 1),
                            blockId: el.id || null,
                            blockTop: rect.top,
                            blockHeight: rect.height,
                            rightHeight: right ? right.scrollHeight : null,
                            leftHeight: left ? left.scrollHeight : null,
                            decision,
                            crossParenDiagnostic,
                            crossParenDiagnosticError,
                            parenScopeDiagnostic,
                            parenFontCounterfactual,
                            stageGeometryDiagnostic,
                            stageGeometryDiagnosticError
                        };
                    });
                }),
                layoutDecisionBlockCount: document.querySelectorAll('#book-container .page-body-flow > .block-2col').length,
                parenthesisScopeSummary: (() => { try { return JSON.parse(document.querySelector('#book-container')?.getAttribute('data-layout-paren-scope-summary') || 'null'); } catch (_) { return null; } })(),
                parenthesisScopeDiagnosticError: document.querySelector('#book-container')?.getAttribute('data-layout-paren-scope-diagnostic-error') || null,
                parenFontCounterfactualSummary: (() => { try { return JSON.parse(document.querySelector('#book-container')?.getAttribute('data-layout-paren-font-counterfactual-summary') || 'null'); } catch (_) { return null; } })(),
                parenFontCounterfactualError: document.querySelector('#book-container')?.getAttribute('data-layout-paren-font-counterfactual-error') || null,
                bodyScrollHeight:document.body.scrollHeight,
                bookContainerScrollHeight:document.getElementById('book-container')?.scrollHeight ?? null
            };
        }, { includeFullModel: args.fullModel });

        const ledger = Array.isArray(data.layoutDecisionRecords) ? data.layoutDecisionRecords : [];
        const domBlockCount = Number.isInteger(data.layoutDecisionBlockCount) ? data.layoutDecisionBlockCount : null;
        const layoutDecisionRecordAudit = {
            recordCount: ledger.length,
            domBlockCount,
            recordCountMatchesDom: domBlockCount === null ? null : ledger.length === domBlockCount,
            missingLedgerRecordCount: domBlockCount === null ? null : Math.max(0, domBlockCount - ledger.length),
            excessLedgerRecordCount: domBlockCount === null ? null : Math.max(0, ledger.length - domBlockCount),
            validRecordCount: ledger.filter(x => x.decision && x.decision.schemaVersion === 1 &&
                x.decision.selection && x.decision.final && x.decision.mutations).length,
            missingOrMalformedCount: ledger.filter(x => !x.decision || x.decision.schemaVersion !== 1 ||
                !x.decision.selection || !x.decision.final || !x.decision.mutations).length,
            selectedCandidateCount: ledger.filter(x => Number.isInteger(x.decision?.selection?.selectedCandidateIndex)).length,
            noSelectedCandidateCount: ledger.filter(x => !Number.isInteger(x.decision?.selection?.selectedCandidateIndex)).length,
            crossParenDiagnosticCount: ledger.filter(x => x.crossParenDiagnostic && x.crossParenDiagnostic.version === 2 &&
                x.crossParenDiagnostic.postGlobal).length,
            missingCrossParenDiagnosticCount: ledger.filter(x => !x.crossParenDiagnostic ||
                x.crossParenDiagnostic.version !== 2 || !x.crossParenDiagnostic.postGlobal).length,
            crossParenDiagnosticErrorCount: ledger.filter(x => !!x.crossParenDiagnosticError).length,
            parenthesisScopeDiagnosticCount: ledger.filter(x => x.parenScopeDiagnostic?.version === 1).length,
            missingParenthesisScopeDiagnosticCount: ledger.filter(x => x.parenScopeDiagnostic?.version !== 1).length,
            parenthesisScopeDiagnosticErrorCount: data.parenthesisScopeDiagnosticError ? 1 : 0,
            crossColumnScopeIntersectingBlockCount: ledger.filter(x => (x.parenScopeDiagnostic?.crossColumnScopeCountIntersectingBlock || 0) > 0).length,
            crossPageScopeIntersectingBlockCount: ledger.filter(x => (x.parenScopeDiagnostic?.crossPageScopeCountIntersectingBlock || 0) > 0).length,
            crossBoundaryScopeEndpointBlockCount: ledger.filter(x => (x.parenScopeDiagnostic?.crossBoundaryScopeEndpointCount || 0) > 0).length,
            parenFontCounterfactualDiagnosticCount: ledger.filter(x => x.parenFontCounterfactual?.version === 1).length,
            missingParenFontCounterfactualDiagnosticCount: ledger.filter(x => x.parenFontCounterfactual?.version !== 1).length,
            parenFontCounterfactualTestedCount: ledger.filter(x => x.parenFontCounterfactual?.tested === true).length,
            parenFontCounterfactualRestoreMismatchCount: ledger.filter(x => x.parenFontCounterfactual?.tested === true && x.parenFontCounterfactual?.restoreMatches !== true).length,
            parenFontCounterfactualErrorCount: ledger.filter(x => !!x.parenFontCounterfactual?.error).length + (data.parenFontCounterfactualError ? 1 : 0),
            stageGeometryDiagnosticCount: ledger.filter(x => x.stageGeometryDiagnostic?.schemaVersion === 1 &&
                x.stageGeometryDiagnostic?.stages?.['canonical-final']).length,
            missingStageGeometryDiagnosticCount: ledger.filter(x => !x.stageGeometryDiagnostic ||
                x.stageGeometryDiagnostic.schemaVersion !== 1 || !x.stageGeometryDiagnostic.stages?.['canonical-final']).length,
            stageGeometryDiagnosticErrorCount: ledger.filter(x => !!x.stageGeometryDiagnosticError).length,
            stageGeometryStageCounts: Object.fromEntries(['postfit','before-page-stretch','after-page-stretch','after-orphan-reclaim','after-page-final-justify','canonical-final'].map(stage => [
                stage, ledger.filter(x => !!x.stageGeometryDiagnostic?.stages?.[stage]).length
            ])),
            crossParenGeometryChangedBlockCount: ledger.filter(x =>
                (x.crossParenDiagnostic?.geometryChangedParagraphCount || 0) > 0 ||
                Math.abs(x.crossParenDiagnostic?.delta?.rightHeight || 0) > 0.5 ||
                Math.abs(x.crossParenDiagnostic?.delta?.leftHeight || 0) > 0.5 ||
                Math.abs(x.crossParenDiagnostic?.delta?.outerHeight || 0) > 0.5).length,
            crossParenStyleChangedBlockCount: ledger.filter(x =>
                (x.crossParenDiagnostic?.styleChangedParagraphCount || 0) > 0).length,
            crossParenPostGlobalGeometryChangedBlockCount: ledger.filter(x =>
                (x.crossParenDiagnostic?.postGlobal?.geometryChangedParagraphCount || 0) > 0).length,
            crossParenPostGlobalStyleChangedBlockCount: ledger.filter(x =>
                (x.crossParenDiagnostic?.postGlobal?.styleChangedParagraphCount || 0) > 0).length,
            crossParenPostGlobalHeightDeltaBlockCount: ledger.filter(x =>
                Math.abs(x.crossParenDiagnostic?.postGlobal?.deltaFromPostParen?.rightHeight || 0) > 0.5 ||
                Math.abs(x.crossParenDiagnostic?.postGlobal?.deltaFromPostParen?.leftHeight || 0) > 0.5 ||
                Math.abs(x.crossParenDiagnostic?.postGlobal?.deltaFromPostParen?.outerHeight || 0) > 0.5).length,
            crossParenFinalSnapshotMismatchCount: ledger.filter(x => {
                const p = x.crossParenDiagnostic?.postGlobal;
                if (!p || !Number.isFinite(p.rightHeight) || !Number.isFinite(p.leftHeight) ||
                    !Number.isFinite(p.outerHeight) || !Number.isFinite(x.rightHeight) ||
                    !Number.isFinite(x.leftHeight) || !Number.isFinite(x.decision?.final?.outerHeight)) return true;
                return Math.abs(p.rightHeight - x.rightHeight) > 0.5 ||
                    Math.abs(p.leftHeight - x.leftHeight) > 0.5 ||
                    Math.abs(p.outerHeight - x.decision.final.outerHeight) > 0.5;
            }).length,
            localFinalJustifyAttemptCount: ledger.filter(x =>
                ['left', 'right'].includes(x.decision?.finalJustify?.targetSide)).length,
            localFinalJustifyOvershootCount: ledger.filter(x =>
                Number.isFinite(x.decision?.finalJustify?.overshootBeforeShrink) &&
                x.decision.finalJustify.overshootBeforeShrink > 0.5).length,
            localFinalJustifyOvershootCorrectedCount: ledger.filter(x =>
                Number.isFinite(x.decision?.finalJustify?.overshootBeforeShrink) &&
                x.decision.finalJustify.overshootBeforeShrink > 0.5 &&
                Number.isFinite(x.decision.finalJustify.overshootAfterShrink) &&
                x.decision.finalJustify.overshootAfterShrink <= 0.5).length,
            localFinalJustifyOvershootRemainingCount: ledger.filter(x =>
                Number.isFinite(x.decision?.finalJustify?.overshootAfterShrink) &&
                x.decision.finalJustify.overshootAfterShrink > 0.5).length,
            localFinalJustifyRollbackCount: ledger.filter(x =>
                x.decision?.finalJustify?.rollbackReason &&
                x.decision.finalJustify.rollbackReason !== 'none').length,
            localFinalJustifyBalanceImprovedCount: ledger.filter(x =>
                Number.isFinite(x.decision?.finalJustify?.balanceBeforeDiff) &&
                Number.isFinite(x.decision?.finalJustify?.balanceAttemptDiff) &&
                Math.abs(x.decision.finalJustify.balanceAttemptDiff) <
                    Math.abs(x.decision.finalJustify.balanceBeforeDiff) - 0.5).length
        };
        const reportPath = abs(args.report), summaryPath = abs(args.summary);
        const report = {
            schemaVersion:1,
            run:{ input:path.relative(root,inputPath).split(path.sep).join('/'), inputBytes:Buffer.byteLength(inputText,'utf8'),
              generatedAt:new Date().toISOString(), branch:process.env.GITHUB_REF_NAME || null,
              gitCommit:process.env.GITHUB_SHA || null, viewport:{width:args.viewportWidth,height:args.viewportHeight,deviceScaleFactor:1},
              renderMs:Date.now()-started, renderResult, determinismCheck, settings, settingsSource, failOn:args.failOn, browser:'Chromium headless' },
            pageCount:data.pageCount,
            geometry:{stats:data.stats,fontsStatus:data.fontsStatus,fontPreflight:data.fontPreflight,footnoteReflowDiagnostics:data.footnoteReflowDiagnostics,layoutDiagnostics:data.layoutDiagnostics,layoutDecisionRecords:data.layoutDecisionRecords,layoutDecisionRecordAudit,parenthesisScopeSummary:data.parenthesisScopeSummary,parenthesisScopeDiagnosticError:data.parenthesisScopeDiagnosticError,parenFontCounterfactualSummary:data.parenFontCounterfactualSummary,parenFontCounterfactualError:data.parenFontCounterfactualError,textConservationAudit:data.textConservationAudit,sideNoteFitCorrections:data.sideNoteFitCorrections,bodyScrollHeight:data.bodyScrollHeight,bookContainerScrollHeight:data.bookContainerScrollHeight},
            audit:{summary:data.summary,issues:data.issues},
            footnoteMeasurementAudit:data.footnoteMeasurementAudit,
            runtime:{pageErrors,consoleErrors}
        };
        if (args.fullModel) report.geometry.model = data.model;
        // Persist the diagnostic gate in the JSON artifact as well as enforcing it in the exit code.
        decisionDiagnosticFailures(report);
        ensureParent(reportPath); fs.writeFileSync(reportPath,JSON.stringify(report,null,2),'utf8');
        ensureParent(summaryPath); fs.writeFileSync(summaryPath,markdown(report),'utf8');
        process.stdout.write('Geometry audit complete\nPages: ' + report.pageCount + '\nIssues: ' +
          (report.audit.summary?.total ?? report.audit.issues.length) + ' (high ' + (report.audit.summary?.high || 0) +
          ', medium ' + (report.audit.summary?.medium || 0) + ', low ' + (report.audit.summary?.low || 0) + ')\nJSON: ' +
          path.relative(root,reportPath) + '\nSummary: ' + path.relative(root,summaryPath) + '\n');
        const byKind = report.audit.summary?.byKind || {};
        process.stdout.write('Issue kinds: ' + Object.entries(byKind)
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .map(([kind, count]) => kind + '=' + count).join(', ') + '\n');
        const la = report.geometry.layoutDecisionRecordAudit || {};
        const dda = report.geometry.layoutDecisionDiagnosticAudit || {};
        process.stdout.write('Decision diagnostics: evaluated ' + (dda.evaluatedCount ?? 'n/a') +
          '; candidate tables ' + (dda.candidateTableCount ?? 'n/a') +
          '; capacity snapshots ' + (dda.capacitySnapshotCount ?? 'n/a') +
          '; ' + (dda.passed === true ? 'PASS' : 'FAIL') + '\n');
        process.stdout.write('Decision ledger: ' + (la.recordCount ?? 'n/a') + ' records / ' +
          (la.domBlockCount ?? 'n/a') + ' DOM blocks; parity ' +
          (la.recordCountMatchesDom === true ? 'PASS' : la.recordCountMatchesDom === false ? 'FAIL' : 'unknown') +
          '; valid ' + (la.validRecordCount ?? 'n/a') + '; malformed ' + (la.missingOrMalformedCount ?? 'n/a') + '\n');
        process.stdout.write('Parenthesis diagnostics: complete ' + (la.crossParenDiagnosticCount ?? 'n/a') + '/' +
          (la.recordCount ?? 'n/a') + '; geometry-changed blocks ' + (la.crossParenGeometryChangedBlockCount ?? 'n/a') +
          '; style-only blocks ' + (la.crossParenStyleChangedBlockCount ?? 'n/a') +
          '; post-global geometry-changed blocks ' + (la.crossParenPostGlobalGeometryChangedBlockCount ?? 'n/a') +
          '; post-global height-delta blocks ' + (la.crossParenPostGlobalHeightDeltaBlockCount ?? 'n/a') +
          '; final-snapshot mismatches ' + (la.crossParenFinalSnapshotMismatchCount ?? 'n/a') +
          '; capture errors ' + (la.crossParenDiagnosticErrorCount ?? 'n/a') + '\n');
        process.stdout.write('Local final-justify: attempts ' + (la.localFinalJustifyAttemptCount ?? 'n/a') +
          '; overshoots corrected ' + (la.localFinalJustifyOvershootCorrectedCount ?? 'n/a') +
          '; overshoots remaining ' + (la.localFinalJustifyOvershootRemainingCount ?? 'n/a') +
          '; rollbacks ' + (la.localFinalJustifyRollbackCount ?? 'n/a') +
          '; balance-improved attempts ' + (la.localFinalJustifyBalanceImprovedCount ?? 'n/a') + '\n');
        const highIssues = report.audit.issues.filter(i => i.severity === 'high');
        if (highIssues.length) {
            process.stdout.write('High-severity issue samples (up to 20):\n');
            for (const issue of highIssues.slice(0, 20)) {
                const page = issue.pageIdx == null ? 'unknown' : String(issue.pageIdx + 1);
                const detail = issue.message || issue.description || '';
                process.stdout.write('- page ' + page + ' | ' + (issue.kind || 'unknown') +
                    ' | ' + (issue.location || 'unknown location') +
                    (detail ? ' | ' + String(detail).replace(/[\r\n]+/g, ' ').slice(0, 240) : '') + '\n');
            }
        }
        if (determinismCheck) {
            process.stdout.write('Determinism: ' + (determinismCheck.identical ? 'PASS' : 'FAIL') +
                ' | first differing page: ' + (determinismCheck.firstDifferingPage == null ? 'none' : determinismCheck.firstDifferingPage + 1) + '\n');
        }
        const threshold = rank(args.failOn);
        const fail = threshold > 0 && report.audit.issues.some(i => rank(i.severity) >= threshold);
        const nondeterministic = report.run.determinismCheck && !report.run.determinismCheck.identical;
        const integrityFailures = instrumentationIntegrityFailures(report);
        process.stdout.write('Audit instrumentation integrity: ' +
            (integrityFailures.length ? 'FAIL (' + integrityFailures.join('; ') + ')' : 'PASS') + '\n');
        if (pageErrors.length) { process.stderr.write('Browser JavaScript errors: ' + pageErrors.length + '\n'); process.exitCode = 2; }
        else if (nondeterministic) { process.stderr.write('Determinism check failed at page ' + report.run.determinismCheck.firstDifferingPage + '\n'); process.exitCode = 3; }
        else if (fail) process.exitCode = 1;
        else if (integrityFailures.length) process.exitCode = 4;
    } finally {
        if (browser) await browser.close().catch(() => {});
        await new Promise(resolve => server.close(resolve));
    }
}
main().catch(err => { process.stderr.write('geometry-audit-cli: ' + (err.stack || err) + '\n'); process.exitCode = 2; });
