import { expect, test, type Page } from '@playwright/test';
import axe from 'axe-core';

async function expectNoAxeViolations(page: Page, selector: string) {
  await page.addScriptTag({ content: axe.source });
  const violations = await page.evaluate(async (sel) => {
    const root = document.querySelector(sel);
    if (!root) throw new Error(`Missing ${sel}`);
    const axeApi = (
      window as Window & {
        axe: {
          run: (
            context: Element,
            options: object,
          ) => Promise<{
            violations: Array<{ id: string; help: string; nodes: Array<{ target: string[] }> }>;
          }>;
        };
      }
    ).axe;
    const results = await axeApi.run(root, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
    });
    return results.violations.map((v) => ({
      id: v.id,
      help: v.help,
      targets: v.nodes.map((n) => n.target),
    }));
  }, selector);
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

test.describe('org-chart block', () => {
  test('renders chart cards, pans/zooms, and syncs tree selection', async ({ page }) => {
    await page.goto('/blocks/org-chart');

    // The first preview has the tree directory; the second is canvas-only (showTree=false).
    const previews = page.getByRole('group', { name: 'Preview' });
    const preview = previews.first();
    await expect(preview.getByRole('button', { name: /Ada Lin/i }).first()).toBeVisible({
      timeout: 30_000,
    });

    const fit = preview.getByRole('button', { name: 'Fit' });
    await expect(fit).toBeVisible();
    await fit.click();

    // Zoom is applied on the next change detection (and the initial fit runs in a rAF), so poll
    // instead of reading the box right after a click.
    const card = preview.locator('[data-org-card="quin"]');
    const cardWidth = async () => (await card.boundingBox())?.width ?? 0;
    let before = 0;
    await expect
      .poll(async () => {
        const previous = before;
        before = await cardWidth();
        return before > 0 && before === previous;
      })
      .toBe(true);
    await preview.getByRole('button', { name: '+' }).click();
    await expect.poll(cardWidth).toBeGreaterThan(before);

    // The directory is hidden below the `sm` breakpoint (640px) by design.
    if ((page.viewportSize()?.width ?? 0) >= 640) {
      const directory = preview.getByRole('tree', { name: 'People' });
      await expect(directory).toBeVisible();
      await directory.getByRole('treeitem', { name: /Quin Fang/i }).click();
      await expect(preview.locator('[data-org-card="quin"][data-selected="true"]')).toBeVisible();
      await expect(preview.locator('[data-org-card="quin"]')).toBeFocused();
    }

    await expect(previews.nth(1).locator('sanring-org-chart')).toBeVisible();
    await expect(previews.nth(1).getByRole('tree')).toHaveCount(0);

    await expectNoAxeViolations(page, 'sanring-org-chart');
  });
});
