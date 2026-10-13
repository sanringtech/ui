import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Editor } from '@tiptap/core';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { SANRING_RICH_TEXT_EDITOR_IMPORTS } from './index';
import { RichTextEditorComponent } from './rich-text-editor.component';

// PRD Story 3: placeholder, read-only, and the character limit.
@Component({
  imports: [ReactiveFormsModule, SANRING_RICH_TEXT_EDITOR_IMPORTS],
  template: `
    <sanring-rich-text-editor
      ariaLabel="Comment"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [maxCharacters]="max()"
      [formControl]="control"
    >
      <sanring-rich-text-editor-toolbar>
        <sanring-rich-text-editor-heading-menu />
        <button sanringRichTextEditorToggle="bold" ariaLabel="Bold">B</button>
        <button sanringRichTextEditorAction="horizontalRule" ariaLabel="Divider">-</button>
      </sanring-rich-text-editor-toolbar>
      <sanring-rich-text-editor-character-count />
    </sanring-rich-text-editor>
  `,
})
class Story3Host {
  readonly control = new FormControl('', { nonNullable: true });
  readonly placeholder = signal<string | undefined>('Write something…');
  readonly readonly = signal(false);
  readonly max = signal<number | undefined>(10);
  readonly editor = viewChild.required(RichTextEditorComponent);
}

async function setup(
  configure?: (host: Story3Host) => void,
): Promise<{ fixture: ComponentFixture<Story3Host>; editor: Editor }> {
  const fixture = TestBed.createComponent(Story3Host);
  configure?.(fixture.componentInstance);
  document.body.appendChild(fixture.nativeElement);
  fixture.detectChanges();
  await vi.waitFor(() => expect(fixture.componentInstance.editor().editor()).not.toBeNull());
  fixture.detectChanges();
  await fixture.whenStable();
  return { fixture, editor: fixture.componentInstance.editor().editor()! };
}

function content(fixture: ComponentFixture<Story3Host>): HTMLElement {
  return fixture.nativeElement.querySelector('.ProseMirror') as HTMLElement;
}

function count(fixture: ComponentFixture<Story3Host>): HTMLElement {
  return fixture.nativeElement.querySelector('sanring-rich-text-editor-character-count') as HTMLElement;
}

function buttons(fixture: ComponentFixture<Story3Host>): HTMLButtonElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('[data-sanring-rte-toolbar-item]'));
}

// Typing goes through ProseMirror's input handling, which jsdom cannot drive;
// insertText runs the same transaction a keystroke would.
function type(editor: Editor, text: string): void {
  editor.view.dispatch(editor.state.tr.insertText(text));
}

function paste(editor: Editor, text: string): void {
  editor.view.dispatch(editor.state.tr.insertText(text).setMeta('paste', true));
}

describe('RichTextEditor placeholder', () => {
  it('shows the placeholder on an empty document and exposes aria-placeholder', async () => {
    const { fixture } = await setup();
    const paragraph = content(fixture).querySelector('p')!;

    expect(paragraph.classList).toContain('is-editor-empty');
    expect(paragraph.getAttribute('data-placeholder')).toBe('Write something…');
    expect(content(fixture).getAttribute('aria-placeholder')).toBe('Write something…');
  });

  it('drops the placeholder once there is text', async () => {
    const { fixture, editor } = await setup();

    type(editor, 'Hi');
    fixture.detectChanges();

    expect(content(fixture).querySelector('p')!.classList).not.toContain('is-editor-empty');
  });

  it('follows placeholder changes after the editor is created', async () => {
    const { fixture } = await setup();

    fixture.componentInstance.placeholder.set('Reply…');
    fixture.detectChanges();

    expect(content(fixture).querySelector('p')!.getAttribute('data-placeholder')).toBe('Reply…');
    expect(content(fixture).getAttribute('aria-placeholder')).toBe('Reply…');
  });
});

describe('RichTextEditor readonly', () => {
  it('stops editing but keeps the content focusable and announced as read-only', async () => {
    const { fixture, editor } = await setup((host) => {
      host.control.setValue('<p>Read me</p>');
      host.readonly.set(true);
    });

    expect(editor.isEditable).toBe(false);
    expect(content(fixture).getAttribute('contenteditable')).toBe('false');
    expect(content(fixture).getAttribute('aria-readonly')).toBe('true');
    expect(content(fixture).tabIndex).toBe(0);
    expect(fixture.nativeElement.querySelector('sanring-rich-text-editor').hasAttribute('data-readonly')).toBe(true);
  });

  it('disables every toolbar button without hiding them', async () => {
    const { fixture } = await setup((host) => host.readonly.set(true));

    expect(buttons(fixture)).toHaveLength(3);
    for (const button of buttons(fixture)) {
      expect(button.disabled).toBe(true);
    }
  });

  it('becomes editable again when readonly is turned off', async () => {
    const { fixture, editor } = await setup((host) => host.readonly.set(true));

    fixture.componentInstance.readonly.set(false);
    fixture.detectChanges();

    expect(editor.isEditable).toBe(true);
    expect(content(fixture).hasAttribute('aria-readonly')).toBe(false);
    expect(buttons(fixture).some((button) => !button.disabled)).toBe(true);
  });
});

describe('RichTextEditorCharacterCountComponent', () => {
  it('shows n/limit and announces it politely', async () => {
    const { fixture, editor } = await setup();
    expect(count(fixture).textContent?.trim()).toBe('0/10');
    expect(count(fixture).getAttribute('aria-live')).toBe('polite');

    type(editor, 'Hello');
    fixture.detectChanges();

    expect(count(fixture).textContent?.trim()).toBe('5/10');
  });

  it('shows only the count when there is no limit', async () => {
    const { fixture, editor } = await setup((host) => host.max.set(undefined));

    type(editor, 'Hello world, no limit here');
    fixture.detectChanges();

    expect(count(fixture).textContent?.trim()).toBe('26');
    expect(editor.getText()).toBe('Hello world, no limit here');
  });

  it('blocks typing past the limit', async () => {
    const { fixture, editor } = await setup();

    type(editor, '0123456789');
    type(editor, 'x');
    fixture.detectChanges();

    expect(editor.getText()).toBe('0123456789');
    expect(fixture.componentInstance.control.value).toBe('<p>0123456789</p>');
    expect(count(fixture).textContent?.trim()).toBe('10/10');
  });

  it('cuts pasted text back to the limit', async () => {
    const { fixture, editor } = await setup();

    type(editor, 'abcdef');
    paste(editor, '123456789');
    fixture.detectChanges();

    expect(editor.getText()).toBe('abcdef1234');
  });

  it('shows an over-limit control value in full, in the error color', async () => {
    const { fixture, editor } = await setup();
    const value = '<p>This value is far past the limit</p>';

    fixture.componentInstance.control.setValue(value);
    fixture.detectChanges();

    expect(editor.getText()).toBe('This value is far past the limit');
    expect(fixture.componentInstance.control.value).toBe(value);
    expect(count(fixture).textContent?.trim()).toBe('32/10');
    expect(count(fixture).hasAttribute('data-over-limit')).toBe(true);
    expect(count(fixture).className).toContain('text-[var(--sanring-error-50)]');
  });

  it('keeps an over-limit initial value untrimmed', async () => {
    const { fixture, editor } = await setup((host) =>
      host.control.setValue('<p>Initial text over limit</p>'),
    );

    expect(editor.getText()).toBe('Initial text over limit');
    expect(fixture.componentInstance.control.value).toBe('<p>Initial text over limit</p>');
  });

  it('refuses additions but allows deletions while over the limit', async () => {
    const { fixture, editor } = await setup((host) => host.control.setValue('<p>0123456789AB</p>'));

    editor.commands.setTextSelection(13);
    type(editor, 'C');
    expect(editor.getText()).toBe('0123456789AB');

    editor.commands.deleteRange({ from: 12, to: 13 });
    fixture.detectChanges();
    expect(editor.getText()).toBe('0123456789A');
    expect(count(fixture).textContent?.trim()).toBe('11/10');
  });

  it('has no axe-detectable a11y violations', async () => {
    const { fixture } = await setup((host) => host.control.setValue('<p>Hello</p>'));

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
