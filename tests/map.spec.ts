import { test, expect } from '@playwright/test';

/**
 * Maps draw a point only where a record publishes its own location. Everything else is shown as the
 * area of its PIN, and every map says which is which and credits OpenStreetMap.
 */

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'map checks run once, on desktop');
});

test('the map draws a point only for records with their own location', async ({ page }) => {
  await page.goto('/maps?pin=110001');
  await page.waitForSelector('.leaflet-container path.map-area');
  await expect(page.locator('path.map-area')).toHaveCount(1);
  const exactRows = await page.locator('[data-placement="exact"]').count();
  const areaRows = await page.locator('[data-placement="area"]').count();
  expect(areaRows, 'records without their own location').toBeGreaterThan(0);
  await expect(page.locator('path.map-point')).toHaveCount(exactRows);
  await expect(page.locator('.map-legend')).toContainText(/about [\d.]+ km around its post offices/);
  await expect(page.locator('.leaflet-control-attribution')).toContainText('OpenStreetMap');
});

test('selecting a record without a location explains it is shown as the PIN area', async ({ page }) => {
  await page.goto('/maps?pin=110001');
  await page.locator('[data-placement="area"]').first().click();
  await expect(page.getByRole('dialog')).toContainText('no published exact location');
});

test('search results show where they are, and the map can be hidden', async ({ page }) => {
  await page.goto('/search?q=delhi');
  const map = page.locator('#search-map');
  await expect(map.locator('.leaflet-container')).toBeVisible();
  await expect(map.locator('path.map-area, path.map-point').first()).toBeAttached();
  await expect(map.locator('.leaflet-control-attribution')).toContainText('OpenStreetMap');
  await expect(map.locator('.map-legend')).toBeVisible();

  await page.getByRole('button', { name: 'Hide map' }).click();
  await expect(page.locator('#search-map')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Show map' })).toBeVisible();
  await expect(page.locator('#search-map')).toHaveCount(0);
});

test('the PIN dashboard shows the PIN as an area, with attribution', async ({ page }) => {
  await page.goto('/pin/110001');
  await expect(page.locator('path.map-area')).toHaveCount(1);
  await expect(page.locator('path.map-point')).toHaveCount(0);
  await expect(page.locator('.leaflet-control-attribution')).toContainText('OpenStreetMap');
  await expect(page.getByText(/about [\d.]+ km around its post offices/)).toBeVisible();
});
