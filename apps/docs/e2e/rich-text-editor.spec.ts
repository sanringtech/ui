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

async function openPage(page: Page) {
  await page.goto('/components/rich-text-editor');
  // Tiptap loads lazily; the editable area only exists once it has.
  await expect(page.getByTestId('rte-basic').locator('.ProseMirror')).toBeVisible({
    timeout: 30_000,
  });
}

test.describe('rich-text-editor', () => {
  test('writes typed and formatted content to the form value as HTML', async ({ page }) => {
    await openPage(page);
    const content = page.getByTestId('rte-basic').getByRole('textbox', { name: 'Message' });
    const value = page.getByTestId('rte-basic-value');

    await content.click();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.type('Plain ');
    await page.getByTestId('rte-btn-bold').click();
    await page.keyboard.type('bold');

    await expect(value).toHaveText('<p>Plain <strong>bold</strong></p>');
    await expect(page.getByTestId('rte-btn-bold')).toHaveAttribute('aria-pressed', 'true');
    await expect(content).toBeFocused();

    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.press('Backspace');
    await expect(value).toHaveText('');
  });

  test('keeps aria-pressed in sync with keyboard shortcuts', async ({ page }) => {
    await openPage(page);
    const content = page.getByTestId('rte-basic').getByRole('textbox', { name: 'Message' });
    const italic = page.getByTestId('rte-btn-italic');

    // Select all through ProseMirror's own keymap (a synchronous transaction)
    // and toggle a mark on real text. A collapsed cursor after a native key
    // such as End would only set a stored mark, which ProseMirror clears when
    // the late selectionchange from that key arrives; on slow CI runners that
    // happened after Ctrl+I and made this test flaky.
    await content.click();
    await page.keyboard.press('ControlOrMeta+a');
    await expect(italic).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('ControlOrMeta+i');
    await expect(italic).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('rte-basic-value')).toContainText('<em>');
    await page.keyboard.press('ControlOrMeta+i');
    await expect(italic).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByTestId('rte-basic-value')).not.toContainText('<em>');
  });

  test('is one tab stop with arrow-key navigation that skips disabled buttons', async ({
    page,
  }) => {
    await openPage(page);
    const toolbar = page.getByTestId('rte-toolbar');
    await expect(toolbar).toHaveAttribute('role', 'toolbar');

    // Undo and redo start disabled, so the tab stop is the text style menu.
    await expect(toolbar.getByRole('button', { name: 'Undo' })).toBeDisabled();
    const textStyle = toolbar.getByRole('button', { name: /^Text style/ });
    await textStyle.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('rte-btn-bold')).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(textStyle).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(toolbar.getByRole('button', { name: 'Quote' })).toBeFocused();

    const stops = await toolbar
      .locator('[data-sanring-rte-toolbar-item]')
      .evaluateAll((items) => items.filter((item) => (item as HTMLElement).tabIndex === 0).length);
    expect(stops).toBe(1);
  });

  test('changes the text style from the heading menu', async ({ page }) => {
    await openPage(page);
    const toolbar = page.getByTestId('rte-toolbar');

    await page.getByTestId('rte-basic').getByRole('textbox').click();
    await toolbar.getByRole('button', { name: /^Text style/ }).click();
    await page.getByRole('menuitem', { name: 'Heading 2' }).click();

    await expect(page.getByTestId('rte-basic-value')).toContainText('<h2>');
    await expect(toolbar.getByRole('button', { name: 'Text style: Heading 2' })).toBeVisible();
  });

  test('shows the placeholder and stops typing at the character limit', async ({ page }) => {
    await openPage(page);
    const editor = page.getByTestId('rte-limited');
    const content = editor.getByRole('textbox', { name: 'Comment' });
    const count = page.getByTestId('rte-character-count');

    await expect(content).toHaveAttribute('aria-placeholder', 'Write a comment…');
    await expect(content.locator('p')).toHaveAttribute('data-placeholder', 'Write a comment…');
    await expect(count).toHaveText('0/140');
    await expect(count).toHaveAttribute('aria-live', 'polite');

    await content.click();
    await page.keyboard.type('a'.repeat(145));
    await expect(count).toHaveText('140/140');
    await page.keyboard.press('Backspace');
    await expect(count).toHaveText('139/140');
  });

  test('shows a value over the limit in full and only allows deleting', async ({ page }) => {
    await openPage(page);
    const content = page.getByTestId('rte-limited').getByRole('textbox', { name: 'Comment' });
    const count = page.getByTestId('rte-character-count');

    await page.getByTestId('rte-load-long').click();
    await expect(content).toContainText('until it fits again.');
    await expect(count).toHaveAttribute('data-over-limit', 'true');
    const before = Number((await count.textContent())!.split('/')[0]);
    expect(before).toBeGreaterThan(140);

    await content.click();
    await page.keyboard.press('ControlOrMeta+End');
    await page.keyboard.type('x');
    await expect(count).toHaveText(`${before}/140`);
    await page.keyboard.press('Backspace');
    await expect(count).toHaveText(`${before - 1}/140`);
  });

  test('disables and re-enables with the form control', async ({ page }) => {
    await openPage(page);
    const editor = page.getByTestId('rte-disabled');
    const content = editor.getByRole('textbox', { name: 'Summary' });
    const toggle = page.getByTestId('rte-disabled-toggle');
    const bold = editor.getByRole('button', { name: 'Bold' });

    await expect(content).toHaveAttribute('contenteditable', 'false');
    await expect(content).toHaveAttribute('aria-disabled', 'true');
    await expect(bold).toBeDisabled();

    await toggle.click();
    await expect(toggle).toHaveText('Disable editing');
    await expect(content).toHaveAttribute('contenteditable', 'true');
    await expect(content).not.toHaveAttribute('aria-disabled');
    await expect(bold).toBeEnabled();

    await toggle.click();
    await expect(content).toHaveAttribute('contenteditable', 'false');
    await expect(bold).toBeDisabled();
  });

  test('shows the required error until there is content', async ({ page }) => {
    await openPage(page);
    const editor = page.getByTestId('rte-validation');
    const content = editor.getByRole('textbox', { name: 'Description' });
    await expect(content).toBeVisible();

    await expect(editor).toHaveAttribute('data-invalid', 'true');
    await expect(content).toHaveAttribute('aria-invalid', 'true');
    await expect(content).toHaveAttribute('aria-required', 'true');
    const describedBy = await content.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`[id="${describedBy!.split(' ')[0]}"]`)).toHaveText(
      /Description is required/,
    );

    await content.click();
    await page.keyboard.type('Ready');
    await expect(content).not.toHaveAttribute('aria-invalid');
    await expect(editor).not.toHaveAttribute('data-invalid');
  });

  test('runs the remaining commands from a vertical toolbar', async ({ page }) => {
    await openPage(page);
    const editor = page.getByTestId('rte-commands');
    const content = editor.getByRole('textbox', { name: 'Snippet' });
    const toolbar = page.getByTestId('rte-commands-toolbar');
    await expect(content.locator('pre')).toBeVisible();

    await expect(toolbar).toHaveAttribute('aria-orientation', 'vertical');
    const textStyle = toolbar.getByRole('button', { name: /^Text style/ });
    await textStyle.focus();
    await page.keyboard.press('ArrowDown');
    await expect(toolbar.getByRole('button', { name: 'Inline code' })).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(textStyle).toBeFocused();

    await textStyle.click();
    await expect(page.getByRole('menuitem', { name: 'Heading 4' })).toBeVisible();
    await page.keyboard.press('Escape');

    await content.click();
    await page.keyboard.press('ControlOrMeta+a');
    await toolbar.getByRole('button', { name: 'Clear formatting' }).click();
    await expect(content.locator('h3, pre, code')).toHaveCount(0);

    await toolbar.getByRole('button', { name: 'Divider' }).click();
    await expect(content.locator('hr')).toHaveCount(1);
  });

  test('keeps a read-only editor selectable with every toolbar button disabled', async ({
    page,
  }) => {
    await openPage(page);
    const editor = page.getByTestId('rte-readonly');
    const content = editor.getByRole('textbox', { name: 'Release notes' });

    await expect(content).toHaveAttribute('aria-readonly', 'true');
    await expect(content).toHaveAttribute('contenteditable', 'false');
    for (const button of await editor.locator('[data-sanring-rte-toolbar-item]').all()) {
      await expect(button).toBeDisabled();
    }
    await content.focus();
    await expect(content).toBeFocused();
  });

  test('stays inside a 360px viewport, even with a long unbroken word', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openPage(page);
    const content = page.getByTestId('rte-limited').getByRole('textbox', { name: 'Comment' });

    await content.click();
    await page.keyboard.type('a'.repeat(120));

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  for (const theme of ['light', 'dark'] as const) {
    test(`has no axe violations in the ${theme} theme`, async ({ page }) => {
      await openPage(page);
      const label = theme === 'light' ? 'Light theme' : 'Dark theme';
      await page.getByRole('button', { name: label }).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.getByTestId('rte-limited').locator('.ProseMirror')).toBeVisible();

      // Scoped to the editor previews: on mobile the docs shell itself has
      // scrollable-region-focusable findings (code blocks) that are not this
      // component's and exist on other component pages too.
      for (const id of [
        'rte-basic',
        'rte-disabled',
        'rte-validation',
        'rte-commands',
        'rte-limited',
        'rte-readonly',
      ]) {
        await expectNoAxeViolations(page, `[data-testid="${id}"]`);
      }
    });
  }
});
