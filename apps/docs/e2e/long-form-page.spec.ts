import { expect, test } from '@playwright/test';

test.describe('long-form docs page', () => {
  test('introduction page renders header and TOC', async ({ page, viewport }) => {
    await page.goto('/introduction');

    await expect(page.locator('h1')).toBeVisible();

    // Right-hand TOC is hidden below the 980px breakpoint per DOCS_VISUAL_SYSTEM.md.
    if (viewport && viewport.width >= 980) {
      await expect(page.getByRole('navigation', { name: /on this page/i })).toBeVisible();
    }
  });

  test('code block in the CLI page does not widen the page', async ({ page }) => {
    await page.goto('/cli');

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
