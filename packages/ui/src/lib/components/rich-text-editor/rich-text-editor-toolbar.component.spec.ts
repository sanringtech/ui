import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Editor } from '@tiptap/core';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { SANRING_RICH_TEXT_EDITOR_IMPORTS } from './index';
import { RichTextEditorComponent } from './rich-text-editor.component';

@Component({
  imports: [ReactiveFormsModule, SANRING_RICH_TEXT_EDITOR_IMPORTS],
  template: `
    <sanring-rich-text-editor ariaLabel="Message" [formControl]="control">
      <sanring-rich-text-editor-toolbar>
        <button sanringRichTextEditorAction="undo" ariaLabel="Undo">U</button>
        <button sanringRichTextEditorAction="redo" ariaLabel="Redo">R</button>
        <sanring-rich-text-editor-heading-menu />
        <button sanringRichTextEditorToggle="bold" ariaLabel="Bold">B</button>
        <button sanringRichTextEditorToggle="italic" ariaLabel="Italic">I</button>
      </sanring-rich-text-editor-toolbar>
    </sanring-rich-text-editor>
  `,
})
class ToolbarHost {
  readonly control = new FormControl('<p><strong>Bold</strong> plain</p>', { nonNullable: true });
  readonly editor = viewChild.required(RichTextEditorComponent);
}

async function setup(): Promise<{ fixture: ComponentFixture<ToolbarHost>; editor: Editor }> {
  const fixture = TestBed.createComponent(ToolbarHost);
  document.body.appendChild(fixture.nativeElement);
  fixture.detectChanges();
  await vi.waitFor(() => expect(fixture.componentInstance.editor().editor()).not.toBeNull());
  fixture.detectChanges();
  await fixture.whenStable();
  return { fixture, editor: fixture.componentInstance.editor().editor()! };
}

function button(fixture: ComponentFixture<ToolbarHost>, label: string): HTMLButtonElement {
  return fixture.nativeElement.querySelector(`button[aria-label^="${label}"]`) as HTMLButtonElement;
}

function toolbar(fixture: ComponentFixture<ToolbarHost>): HTMLElement {
  return fixture.nativeElement.querySelector('sanring-rich-text-editor-toolbar') as HTMLElement;
}

function press(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

describe('RichTextEditorToolbarComponent', () => {
  it('is a labelled toolbar that controls the editable area', async () => {
    const { fixture } = await setup();
    const bar = toolbar(fixture);
    const content = fixture.nativeElement.querySelector('.ProseMirror') as HTMLElement;

    expect(bar.getAttribute('role')).toBe('toolbar');
    expect(bar.getAttribute('aria-label')).toBe('Formatting');
    expect(bar.getAttribute('aria-orientation')).toBe('horizontal');
    expect(bar.getAttribute('aria-controls')).toBe(content.id);
  });

  it('reflects the mark at the selection in aria-pressed', async () => {
    const { fixture, editor } = await setup();

    editor.commands.setTextSelection(2);
    fixture.detectChanges();
    expect(button(fixture, 'Bold').getAttribute('aria-pressed')).toBe('true');
    expect(button(fixture, 'Bold').getAttribute('data-state')).toBe('on');
    expect(button(fixture, 'Italic').getAttribute('aria-pressed')).toBe('false');

    editor.commands.setTextSelection(8);
    fixture.detectChanges();
    expect(button(fixture, 'Bold').getAttribute('aria-pressed')).toBe('false');
  });

  it('runs the command on click and keeps aria-pressed in sync with the editor', async () => {
    const { fixture, editor } = await setup();
    editor.commands.setTextSelection({ from: 6, to: 11 });

    button(fixture, 'Italic').click();
    fixture.detectChanges();

    expect(editor.isActive('italic')).toBe(true);
    expect(button(fixture, 'Italic').getAttribute('aria-pressed')).toBe('true');
    expect(fixture.componentInstance.control.value).toContain('<em>plain</em>');
  });

  it('follows shortcut-driven changes made outside the toolbar', async () => {
    const { fixture, editor } = await setup();
    editor.commands.setTextSelection({ from: 6, to: 11 });

    editor.commands.toggleItalic();
    fixture.detectChanges();

    expect(button(fixture, 'Italic').getAttribute('aria-pressed')).toBe('true');
  });

  it('disables buttons whose command cannot run', async () => {
    const { fixture } = await setup();

    expect(button(fixture, 'Undo').disabled).toBe(true);
    expect(button(fixture, 'Redo').disabled).toBe(true);
    expect(button(fixture, 'Bold').disabled).toBe(false);
  });

  it('keeps a single tab stop on the first enabled button', async () => {
    const { fixture } = await setup();
    fixture.detectChanges();

    const stops = Array.from(
      toolbar(fixture).querySelectorAll<HTMLElement>('[data-sanring-rte-toolbar-item]'),
    ).filter((item) => item.tabIndex === 0);

    expect(stops).toHaveLength(1);
    expect(stops[0].getAttribute('aria-label')).toMatch(/^Text style/);
  });

  it('moves focus with arrow keys, Home, and End, skipping disabled buttons', async () => {
    const { fixture } = await setup();
    const heading = button(fixture, 'Text style');
    heading.focus();

    press(heading, 'ArrowRight');
    expect(document.activeElement).toBe(button(fixture, 'Bold'));

    press(button(fixture, 'Bold'), 'End');
    expect(document.activeElement).toBe(button(fixture, 'Italic'));

    press(button(fixture, 'Italic'), 'ArrowRight');
    expect(document.activeElement).toBe(heading);

    press(heading, 'ArrowLeft');
    expect(document.activeElement).toBe(button(fixture, 'Italic'));

    press(button(fixture, 'Italic'), 'Home');
    expect(document.activeElement).toBe(heading);
    fixture.detectChanges();
    expect(button(fixture, 'Bold').tabIndex).toBe(-1);
    expect(heading.tabIndex).toBe(0);
  });

  it('brings undo into the navigation once there is history', async () => {
    const { fixture, editor } = await setup();

    editor.commands.insertContent('x');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button(fixture, 'Undo').disabled).toBe(false);
    const heading = button(fixture, 'Text style');
    heading.focus();
    press(heading, 'ArrowLeft');
    expect(document.activeElement).toBe(button(fixture, 'Undo'));
  });

  it('shows the current text style and switches it from the menu', async () => {
    const { fixture, editor } = await setup();
    expect(button(fixture, 'Text style').getAttribute('aria-label')).toBe('Text style: Paragraph');

    button(fixture, 'Text style').click();
    fixture.detectChanges();
    const item = Array.from(document.querySelectorAll<HTMLElement>('[sanringDropdownMenuItem]')).find(
      (el) => el.textContent?.trim() === 'Heading 2',
    )!;
    item.click();
    fixture.detectChanges();

    expect(editor.isActive('heading', { level: 2 })).toBe(true);
    expect(button(fixture, 'Text style').getAttribute('aria-label')).toBe('Text style: Heading 2');
  });

  it('disables every button when the control is disabled', async () => {
    const { fixture } = await setup();

    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    for (const label of ['Undo', 'Redo', 'Text style', 'Bold', 'Italic']) {
      expect(button(fixture, label).disabled).toBe(true);
    }
  });

  it('has no axe-detectable a11y violations', async () => {
    const { fixture } = await setup();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
