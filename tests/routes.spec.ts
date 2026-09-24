import { readFileSync } from 'node:fs';
import { test, expect, type Page } from '@playwright/test';

/**
 * Route integrity: every route renders, planned deep links resolve, and no
 * in-app link leads to the not-found page. Runs on the desktop project only;
 * layout at phone width is covered by screenshot.spec.ts.
 */

const NOT_FOUND = 'We could not find that page';

const staticRoutes = [...readFileSync('src/App.tsx', 'utf8').matchAll(/<Route path="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((p) => p !== '*' && !p.includes(':'));

async function open(page: Page, path: string) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(path);
  await page.waitForSelector('main#main', { timeout: 15_000 });
  await page.waitForLoadState('networkidle');
  return errors;
}

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'route checks run once, on desktop');
});

test('the router has static routes to check', () => {
  expect(staticRoutes.length).toBeGreaterThan(40);
});

for (const path of staticRoutes) {
  test(`renders ${path}`, async ({ page }) => {
    const errors = await open(page, path);
    await expect(page.locator('main#main')).not.toContainText(NOT_FOUND);
    await expect(page.locator('main#main h1').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

// Deep links named in the docs, and legacy URLs that must keep working.
const redirects: [string, RegExp][] = [
  ['/pin/110001/hospital', /\/module\/hospital\?pin=110001$/],
  ['/pin/110001/schools', /\/schools\?pin=110001$/],
  ['/module/school?id=mock-school-110001-0', /\/schools\/mock-school-110001-0$/],
  ['/module/school?pin=110001', /\/schools\?pin=110001$/],
  ['/schools/profile/mock-school-110001-0', /\/schools\/mock-school-110001-0$/],
  ['/school/mock-school-110001-0', /\/schools\/mock-school-110001-0$/],
  ['/school/99999999999', /\/schools\/search\?q=99999999999$/],
  ['/courts', /\/module\/courts$/],
  ['/data-sources', /\/sources$/],
  ['/transparency', /\/transparency\/methodology$/],
];

for (const [from, to] of redirects) {
  test(`redirects ${from}`, async ({ page }) => {
    await open(page, from);
    await expect(page).toHaveURL(to);
    await expect(page.locator('main#main')).not.toContainText(NOT_FOUND);
  });
}

test('school profile tabs are addressable', async ({ page }) => {
  await open(page, '/schools/mock-school-110001-0/infrastructure');
  await expect(page.getByRole('navigation', { name: 'School sections' }).locator('[aria-current="page"]')).toHaveText('Infrastructure');
});

test('the PIN chooser opens without an error message', async ({ page }) => {
  await open(page, '/pin/new');
  await expect(page.locator('main#main h1')).toHaveText('Open a PIN code');
  await expect(page.locator('main#main')).not.toContainText('is not a valid');
});

test('in-app links from the hub pages all resolve', async ({ page }) => {
  test.setTimeout(180_000);
  const hubs = ['/', '/explore', '/pin/110001', '/schools?pin=110001', '/about'];
  const hrefs = new Set<string>();
  for (const hub of hubs) {
    await open(page, hub);
    const found = await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href') || ''));
    found.filter((h) => !h.startsWith('//')).forEach((h) => hrefs.add(h));
  }
  const broken: string[] = [];
  for (const href of hrefs) {
    await page.goto(href);
    await page.waitForSelector('main#main');
    if ((await page.locator('main#main').innerText()).includes(NOT_FOUND)) broken.push(href);
  }
  expect(hrefs.size).toBeGreaterThan(30);
  expect(broken).toEqual([]);
});
