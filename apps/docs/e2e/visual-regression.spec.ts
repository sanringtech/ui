import { expect, test, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';

const surfaces = [
  {
    name: 'home',
    path: '/',
    ready: (page: Page) => page.getByRole('heading', { level: 1 }),
  },
  {
    name: 'button-component',
    path: '/components/button',
    ready: (page: Page) => page.locator('#basic app-component-page-code-previewer'),
    capture: (page: Page) => page.locator('#basic'),
  },
  {
    name: 'cli-overview',
    path: '/cli',
    ready: (page: Page) => page.getByRole('region', { name: 'CLI workflow overview' }),
  },
] as const;

async function prepareStableScreenshot(page: Page, theme: Theme, path: string): Promise<void> {
  await page.addInitScript((selectedTheme: Theme) => {
    localStorage.setItem('sanring-docs-theme', selectedTheme);
  }, theme);

  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        caret-color: transparent !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
      html { scroll-behavior: auto !important; }
      ::view-transition-group(*),
      ::view-transition-old(*),
      ::view-transition-new(*) { animation: none !important; }
    `,
  });
  await page.evaluate(() => window.scrollTo(0, 0));
}

for (const theme of ['light', 'dark'] as const) {
  for (const surface of surfaces) {
    test(`${surface.name} / ${theme}`, async ({ page }) => {
      await prepareStableScreenshot(page, theme, surface.path);
      const readySurface = surface.ready(page);
      await expect(readySurface).toBeVisible();
      if ('capture' in surface) {
        await expect(surface.capture(page)).toHaveScreenshot(`${theme}-${surface.name}.png`);
      } else {
        await expect(page).toHaveScreenshot(`${theme}-${surface.name}.png`);
      }
    });
  }
}
