import { expect, test } from '@playwright/test';

test.describe('theme toggle', () => {
  test('switching theme updates data-theme and persists across reload', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const darkButton = page.getByRole('button', { name: 'Dark theme' });
    const lightButton = page.getByRole('button', { name: 'Light theme' });

    await darkButton.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(darkButton).toHaveAttribute('aria-pressed', 'true');

    await lightButton.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(lightButton).toHaveAttribute('aria-pressed', 'true');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });
});
