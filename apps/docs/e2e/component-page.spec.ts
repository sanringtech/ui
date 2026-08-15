import { expect, test } from '@playwright/test';

test.describe('component page', () => {
  test('renders header, basic example, and API reference for button', async ({ page }) => {
    await page.goto('/components/button');

    await expect(page.locator('h1')).toContainText('Button');
    await expect(page.locator('#basic')).toBeVisible();
    await expect(page.locator('#api')).toBeVisible();
  });

  test('code block copy action is keyboard accessible', async ({ page }) => {
    await page.goto('/components/button');

    const copyButton = page.getByRole('button', { name: /copy/i }).first();
    await expect(copyButton).toBeVisible();
    await copyButton.focus();
    await expect(copyButton).toBeFocused();
  });
});
