import { expect, test } from '@playwright/test';

test.describe('component page', () => {
  test('renders header, basic example, and API reference for button', async ({ page }) => {
    await page.goto('/components/button');

    await expect(page.locator('h1')).toContainText('Button');
    await expect(page.locator('#basic')).toBeVisible();
    await expect(page.locator('#api')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy install command' })).toBeVisible();
    await expect(page.locator('a[href="#installation"]').first()).toBeVisible();
    await expect(page.locator('a[href="#api"]').first()).toBeVisible();
    await expect(page.getByRole('group', { name: 'Preview' }).first()).toBeVisible();
    await expect(page.getByRole('group', { name: 'Source' }).first()).toBeVisible();
    await expect(page.getByText('Reference surface')).toBeVisible();
    await expect(page.locator('#recent-changes')).toBeVisible();
  });

  test('code block copy action is keyboard accessible', async ({ page }) => {
    await page.goto('/components/button');

    const copyButton = page.getByRole('button', { name: /copy/i }).first();
    await expect(copyButton).toBeVisible();
    await copyButton.focus();
    await expect(copyButton).toBeFocused();
  });

  test('keeps component reference pages inside 360px and 390px viewports', async ({ page }) => {
    for (const width of [360, 390]) {
      await page.setViewportSize({ width, height: 800 });

      for (const route of ['/components/button', '/components/dialog', '/components/table']) {
        await page.goto(route);
        await expect(page.locator('h1')).toBeVisible();

        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));

        expect(
          scrollWidth,
          `${route} overflows at ${width}px: ${scrollWidth}px > ${clientWidth}px`,
        ).toBeLessThanOrEqual(clientWidth);
      }
    }
  });

  test('uses the radio group API anchor for its split reference tables', async ({ page }) => {
    await page.goto('/components/radio');

    await expect(page.locator('a[href="#api-group"]').first()).toBeVisible();
  });
});
