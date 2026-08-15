import { expect, test } from '@playwright/test';

test.describe('mobile shell', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('sidebar collapses into a sheet menu below the mobile breakpoint', async ({ page }) => {
    await page.goto('/introduction');

    // Desktop sidebar (aside) is hidden below 860px per DOCS_VISUAL_SYSTEM.md.
    const desktopSidebar = page.locator('aside').first();
    await expect(desktopSidebar).toBeHidden();

    const menuTrigger = page.getByRole('button', { name: 'Menu' });
    await expect(menuTrigger).toBeVisible();

    await menuTrigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('no horizontal overflow at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
