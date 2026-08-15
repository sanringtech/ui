import { expect, test } from '@playwright/test';

test.describe('home page', () => {
  test('renders the hero and primary navigation without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));

    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
    // sanringBtn renders with role="button" even on an <a routerLink> host.
    await expect(page.getByRole('button', { name: 'Browse components' })).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test('has no horizontal page overflow', async ({ page }) => {
    await page.goto('/');

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
