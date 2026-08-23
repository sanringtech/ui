import { expect, test, type Page } from '@playwright/test';

const LONG_FORM_ROUTES = ['/introduction', '/cli', '/registry', '/mcp', '/theming'];
const COMPONENT_ROUTES = ['/components/button', '/components/dialog', '/components/table'];
const REPRESENTATIVE_ROUTES = ['/', ...LONG_FORM_ROUTES, ...COMPONENT_ROUTES];

async function expectNoPageOverflow(page: Page) {
  const result = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    result.scrollWidth,
    `horizontal overflow: ${result.scrollWidth}px > ${result.clientWidth}px`,
  ).toBeLessThanOrEqual(result.clientWidth);
}

test.describe('Phase 4 visual verification', () => {
  test.describe.configure({ mode: 'serial' });

  test('captures representative light-theme pages and checks layout width', async ({ page }) => {
    for (const route of REPRESENTATIVE_ROUTES) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      await expectNoPageOverflow(page);
      await page.screenshot({
        path: `/tmp/sanring-phase4-light-${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}.png`,
      });
    }
  });

  test('captures the home dark theme without clipping', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(150);
    await expectNoPageOverflow(page);
    await page.screenshot({ path: '/tmp/sanring-phase4-dark-home.png' });
  });

  test('captures representative component pages in dark theme', async ({ page }) => {
    for (const route of COMPONENT_ROUTES) {
      await page.goto(route);
      await page.getByRole('button', { name: 'Dark theme' }).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await expect(page.locator('h1')).toBeVisible();
      await expectNoPageOverflow(page);
      await page.screenshot({
        path: `/tmp/sanring-phase4-dark-${route.slice(1).replaceAll('/', '-')}.png`,
      });
    }
  });

  for (const width of [360, 390]) {
    test(`captures representative pages at ${width}px without overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const route of ['/', '/cli', ...COMPONENT_ROUTES]) {
        await page.goto(route);
        await expect(page.locator('h1')).toBeVisible();
        await expectNoPageOverflow(page);
        await page.screenshot({
          path: `/tmp/sanring-phase4-${width}-${
            route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')
          }.png`,
        });
      }
    });
  }

  test('captures component header, API, and release surfaces', async ({ page }) => {
    await page.goto('/components/button');
    await expect(page.locator('h1')).toBeVisible();

    await page.locator('app-component-page-header').screenshot({
      path: '/tmp/sanring-phase4-component-header.png',
    });
    await page.locator('#basic app-component-page-code-previewer').screenshot({
      path: '/tmp/sanring-phase4-component-previewer.png',
    });
    await page.locator('#api').screenshot({ path: '/tmp/sanring-phase4-component-api.png' });
    await page
      .locator('#recent-changes')
      .screenshot({ path: '/tmp/sanring-phase4-component-recent-changes.png' });
  });

  test('keeps long code lines inside a scrollable code surface', async ({ page }) => {
    await page.goto('/cli');
    const uncontainedOverflow = await page.locator('pre, code').evaluateAll((elements) =>
      elements
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .filter((element) => {
          let current: HTMLElement | null = element as HTMLElement;
          while (current) {
            const overflowX = getComputedStyle(current).overflowX;
            if (overflowX === 'auto' || overflowX === 'scroll') return false;
            current = current.parentElement;
          }
          return true;
        })
        .map((element) => element.textContent?.slice(0, 80) ?? ''),
    );
    expect(uncontainedOverflow).toEqual([]);
  });
});
