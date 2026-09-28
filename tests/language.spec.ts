import { test, expect, type Page } from '@playwright/test';

/**
 * Language: English pages show no Hindi, Hindi pages leave no interface text in English, and the
 * switch in the header changes the whole page and is remembered. Record values the page marks
 * translate="no" (names, codes, the language names themselves) are exempt.
 */

const routes = [
  '/',
  '/explore',
  '/search?q=school',
  '/governance?pin=110001',
  '/governance?pin=302001&type=village',
  '/module/infra?pin=110001',
  '/module/andhbhakt',
  '/module/schools?pin=110001',
  '/sources',
  '/transparency/freshness',
  '/maps?pin=110001',
  '/search?q=delhi',
  '/pin/250001',
  // Not-found states of detail pages.
  '/schools/nope',
  '/contractors/nope',
];

async function open(page: Page, path: string, lang: 'en' | 'hi') {
  // Set the language for the first load only, so a reload shows what the page remembered.
  await page.addInitScript((l) => {
    try {
      if (sessionStorage.getItem('lang-set')) return;
      localStorage.setItem('jantax_language', l);
      sessionStorage.setItem('lang-set', '1');
    } catch {
      /* storage blocked */
    }
  }, lang);
  await page.goto(path);
  await page.waitForSelector('main#main h1', { timeout: 15_000 });
  await page.waitForLoadState('networkidle');
}

/** Visible text in Devanagari, outside anything marked translate="no" and outside form fields. */
function hindiOnPage(page: Page) {
  return page.evaluate(() => {
    const found: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const el = node.parentElement;
      if (!el || !/[ऀ-ॿ]/.test(node.data)) continue;
      if (el.closest('[translate="no"], textarea, input, script, style')) continue;
      if (!el.getClientRects().length) continue;
      found.push(node.data.trim().slice(0, 80));
    }
    return found;
  });
}

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'language checks run once, on desktop');
});

for (const path of routes) {
  test(`${path} is all English in English`, async ({ page }) => {
    await open(page, path, 'en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    expect(await hindiOnPage(page)).toEqual([]);
  });

  test(`${path} is all Hindi in Hindi`, async ({ page }) => {
    await open(page, path, 'hi');
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
    // The heading can be a PIN and a place name, kept as published, so check the page as a whole.
    await expect(page.locator('main#main')).toContainText(/[\u0900-\u097F]/);
    const untranslated = await page.evaluate(() => window.__jantaxI18n?.missing() ?? ['translator not loaded']);
    expect(untranslated, 'interface text with no Hindi').toEqual([]);
  });
}

test('the header switch changes the whole page and is remembered', async ({ page }) => {
  await open(page, '/governance?pin=110001', 'en');
  const h1 = page.locator('main#main h1').first();
  await expect(h1).toHaveText('Who runs your area');

  await page.getByRole('button', { name: 'Language: English' }).click();
  await page.getByRole('menuitemradio', { name: /हिन्दी/ }).click();
  await expect(h1).toHaveText('आपका क्षेत्र कौन चलाता है');
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await expect(page.getByRole('heading', { name: 'कौन क्या ठीक करता है' })).toBeVisible();

  await page.reload();
  await expect(page.locator('main#main h1').first()).toHaveText('आपका क्षेत्र कौन चलाता है');

  await page.getByRole('button', { name: /Language|भाषा/ }).first().click();
  await page.getByRole('menuitemradio', { name: /English/ }).click();
  await expect(page.locator('main#main h1').first()).toHaveText('Who runs your area');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await hindiOnPage(page)).toEqual([]);
});
