import { test, expect } from '@playwright/test';

const routes = [
  { name: 'home', path: '/' },
  { name: 'explore', path: '/explore' },
  { name: 'search', path: '/search?q=delhi' },
  { name: 'pin', path: '/pin/110001' },
  { name: 'maps', path: '/maps' },
  { name: 'compare', path: '/compare' },
  { name: 'schools', path: '/schools' },
  { name: 'reports', path: '/reports' },
  { name: 'report-issue', path: '/report-issue' },
  { name: 'module-infra', path: '/module/infra?pin=110001' },
  { name: 'module-contractor', path: '/module/contractor' },
  { name: 'module-hospital', path: '/module/hospital?pin=250001' },
  { name: 'court-detail', path: '/courts/COURT-DL-PHC01' },
  { name: 'sources', path: '/sources' },
  { name: 'not-found', path: '/this-page-does-not-exist' },
];

for (const route of routes) {
  for (const project of ['desktop', 'mobile']) {
    test(`${route.name} (${project})`, async ({ page }, testInfo) => {
      await page.goto(route.path);
      // Wait for the app shell / nav to render.
      await page.waitForSelector('header.site-header', { timeout: 15_000 });
      await expect(page.locator('main#main')).toBeVisible();
      await expect(page.locator('body')).not.toBeEmpty();

      const dir = testInfo.outputDir;
      await page.screenshot({ path: `${dir}/${route.name}-${project}.png`, fullPage: true });
    });
  }
}
