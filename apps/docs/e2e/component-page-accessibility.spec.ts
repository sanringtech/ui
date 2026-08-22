import { expect, test, type Locator, type Page } from '@playwright/test';
import axe from 'axe-core';

type Theme = 'light' | 'dark';

interface AxeViolation {
  id: string;
  impact: string | null;
  help: string;
  targets: string[][];
}

async function expectNoAxeViolations(page: Page) {
  await page.addScriptTag({ content: axe.source });

  const violations = await page.evaluate(async () => {
    const axeApi = (
      window as Window & {
        axe: {
          run: (
            context: Element,
            options: object,
          ) => Promise<{
            violations: Array<{
              id: string;
              impact: string | null;
              help: string;
              nodes: Array<{ target: string[] }>;
            }>;
          }>;
        };
      }
    ).axe;

    const article = document.querySelector('main article');
    if (!article) throw new Error('Component article was not rendered');

    const results = await axeApi.run(article, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });

    return results.violations.map(
      (violation): AxeViolation => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        targets: violation.nodes.map((node) => node.target),
      }),
    );
  });

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}

async function expectKeyboardFocusIndicator(page: Page, target: Locator) {
  await target.scrollIntoViewIfNeeded();
  await target.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(target).toBeFocused();

  const indicator = await target.evaluate((element) => {
    const style = getComputedStyle(element);
    const outlineWidth = Number.parseFloat(style.outlineWidth);

    return {
      focusVisible: element.matches(':focus-visible'),
      hasOutline: style.outlineStyle !== 'none' && outlineWidth > 0,
      hasShadow: style.boxShadow !== 'none',
    };
  });

  expect(indicator.focusVisible).toBe(true);
  expect(indicator.hasOutline || indicator.hasShadow).toBe(true);
}

async function useTheme(page: Page, theme: Theme) {
  const label = theme === 'light' ? 'Light theme' : 'Dark theme';
  await page.getByRole('button', { name: label }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

test.describe('component docs accessibility smoke', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`${theme} theme keeps reference content readable and keyboard accessible`, async ({
      page,
    }) => {
      await page.goto('/components/button');
      await useTheme(page, theme);

      const title = page.locator('app-component-page-header h1');
      const description = page.locator('app-component-page-header h1 + p');
      const installSection = page.locator('#installation');
      const previewSource = page.locator('#basic app-component-page-code-block');
      const installCommandSource = installSection
        .getByRole('tabpanel', { name: 'Command' })
        .locator('pre code');
      const installManualSource = installSection
        .getByRole('tabpanel', { name: 'Manual' })
        .locator('pre code');
      const installCommandTab = installSection.getByRole('tab', { name: 'Command' });
      const installManualTab = installSection.getByRole('tab', { name: 'Manual' });
      const installCopyButton = installSection.getByRole('button', { name: 'Copy code' });
      const previewCopyButton = previewSource.getByRole('button', { name: 'Copy code' });

      await expect(title).toBeVisible();
      await expect(description).toBeVisible();
      await expect(installSection).toBeVisible();
      await expect(previewSource).toBeVisible();
      await expect(installCommandSource).toBeVisible();
      await expect(installCopyButton).toBeVisible();
      await expect(previewCopyButton).toBeVisible();

      await installCommandTab.focus();
      await page.keyboard.press('ArrowRight');
      await expect(installManualTab).toHaveAttribute('aria-selected', 'true');
      await expect(installManualSource).toContainText("import { ButtonDirective }");
      await page.keyboard.press('ArrowLeft');
      await expect(installCommandTab).toHaveAttribute('aria-selected', 'true');

      await expectKeyboardFocusIndicator(page, installCopyButton);
      await expectKeyboardFocusIndicator(page, previewCopyButton);
      await expectKeyboardFocusIndicator(
        page,
        page.getByRole('button', { name: 'Copy install command' }),
      );

      await expectNoAxeViolations(page);
    });
  }
});
