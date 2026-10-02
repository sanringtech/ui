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
    await page.goto('/blocks#org-chart');

    const preview = page.getByRole('group', { name: 'Preview' }).last();
    await expect(preview.getByRole('button', { name: /Ada Lin/i }).first()).toBeVisible({
      timeout: 30_000,
    });

    const fit = preview.getByRole('button', { name: 'Fit' });
    await expect(fit).toBeVisible();
    await fit.click();

    const before = await preview.locator('[data-org-card="quin"]').boundingBox();
    await preview.getByRole('button', { name: '+' }).click();
    const afterZoom = await preview.locator('[data-org-card="quin"]').boundingBox();
    expect(before && afterZoom).toBeTruthy();
    if (before && afterZoom) {
      expect(afterZoom.width).toBeGreaterThan(before.width);
    }

    const directory = preview.getByRole('tree', { name: 'People' });
    await expect(directory).toBeVisible();
    await directory.getByRole('treeitem', { name: /Quin Fang/i }).click();
    await expect(preview.locator('[data-org-card="quin"][data-selected="true"]')).toBeVisible();
    await expect(preview.locator('[data-org-card="quin"]')).toBeFocused();

    await expectNoAxeViolations(page, 'sanring-org-chart');
  });
});
