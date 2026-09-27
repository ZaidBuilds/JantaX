import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';

/**
 * Accessibility: axe-core (WCAG 2.2 A and AA rules) on the screens people use most, in light and
 * dark themes, on desktop and phone. Any violation fails, with the rule, the element and axe's
 * explanation, so contrast or labelling regressions are caught before they ship.
 */

const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');

const routes = [
  '/',
  '/explore',
  '/search?q=school',
  '/report-issue',
  '/reports',
  '/compare',
  '/sources',
  '/module/schools?pin=110001',
  '/module/infra?pin=110001',
  '/module/pollution?pin=110001',
  '/module/contractor?pin=110001',
  '/module/mplads?pin=110001',
];

type Violation = { id: string; impact: string | null; help: string; nodes: { target: string[]; failureSummary?: string }[] };

async function audit(page: Page, path: string, theme: 'light' | 'dark') {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('jantax.theme', t);
    } catch {
      /* storage blocked: the page falls back to the system theme */
    }
  }, theme);
  await page.goto(path);
  await page.waitForSelector('main#main', { timeout: 15_000 });
  await page.waitForLoadState('networkidle');
  await page.addScriptTag({ content: axeSource });
  return page.evaluate(async () => {
    const axe = (window as unknown as { axe: { run: (ctx: Document, opts: object) => Promise<{ violations: Violation[] }> } }).axe;
    const result = await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      resultTypes: ['violations'],
    });
    return result.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => ({ target: n.target, failureSummary: n.failureSummary })) }));
  });
}

for (const theme of ['light', 'dark'] as const) {
  for (const path of routes) {
    test(`${path} has no WCAG violations (${theme})`, async ({ page }, testInfo) => {
      // Dark mode is a colour change only, so one viewport is enough for it.
      test.skip(theme === 'dark' && testInfo.project.name !== 'desktop', 'dark theme runs on desktop');
      const violations = await audit(page, path, theme);
      const report = violations
        .map((v) => `${v.id} (${v.impact}): ${v.help}\n${v.nodes.map((n) => `    ${n.target.join(' ')}\n      ${(n.failureSummary ?? '').split('\n').join('\n      ')}`).join('\n')}`)
        .join('\n');
      expect(violations, report).toEqual([]);
    });
  }
}
