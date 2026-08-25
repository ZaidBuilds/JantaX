import { test, expect } from '@playwright/test';

const routes = [
  { name: 'home', path: '/' },
  { name: 'search', path: '/search?q=abc%20developers' },
  { name: 'pin', path: '/pin/110001' },
  { name: 'maps', path: '/maps' },
  { name: 'compare', path: '/compare' },
  { name: 'schools', path: '/schools' },
  { name: 'module-infra', path: '/module/infra?pin=110001' },
  { name: 'module-contractor', path: '/module/contractor' },
];

for (const route of routes) {
  for (const project of ['desktop', 'mobile']) {
    test(`${route.name} (${project})`, async ({ page }, testInfo) => {
      await page.goto(route.path);
      // Wait for the app shell / nav to render.
      await page.waitForSelector('nav, header', { timeout: 15_000 });
      await expect(page.locator('body')).not.toBeEmpty();

      const dir = testInfo.outputDir;
      await page.screenshot({ path: `${dir}/${route.name}-${project}.png`, fullPage: true });
    });
  }
}
