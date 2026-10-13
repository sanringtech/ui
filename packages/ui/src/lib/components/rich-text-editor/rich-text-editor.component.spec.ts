import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import type { AnyExtension, Editor } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { ErrorMessageComponent, SanringFieldComponent } from '../field';
import { RichTextEditorComponent } from './rich-text-editor.component';

@Component({
  imports: [ErrorMessageComponent, ReactiveFormsModule, RichTextEditorComponent, SanringFieldComponent],
  template: `
    <sanring-field>
      <sanring-rich-text-editor [formControl]="control" ariaLabel="Message" />
      <sanring-error-message>Message is required.</sanring-error-message>
    </sanring-field>
  `,
})
class FormHost {
  readonly control = new FormControl('<p>Hello</p>', {
    nonNullable: true,
    validators: [Validators.required],
  });
  readonly editor = viewChild.required(RichTextEditorComponent);
}

@Component({
  imports: [RichTextEditorComponent],
  template: `
    <sanring-rich-text-editor
      ariaLabel="Notes"
      [extensions]="extensions"
      (editorReady)="readyEditor = $event"
    />
  `,
})
class EscapeHatchHost {
  readonly extensions: AnyExtension[] = [Extension.create({ name: 'specMarker' })];
  readyEditor: Editor | null = null;
  readonly editor = viewChild.required(RichTextEditorComponent);
}

async function whenEditorReady<T extends { editor: () => RichTextEditorComponent }>(
  fixture: ComponentFixture<T>,
): Promise<Editor> {
  fixture.detectChanges();
  await vi.waitFor(() => expect(fixture.componentInstance.editor().editor()).not.toBeNull());
  fixture.detectChanges();
  return fixture.componentInstance.editor().editor()!;
}

function contentOf(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement.querySelector('.ProseMirror') as HTMLElement;
}

describe('RichTextEditorComponent', () => {
  it('shows a busy skeleton until the editor has loaded', async () => {
    const fixture = TestBed.createComponent(FormHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('sanring-rich-text-editor') as HTMLElement;

    expect(host.getAttribute('aria-busy')).toBe('true');
    expect(host.querySelector('[sanringSkeleton]')).not.toBeNull();
    expect(contentOf(fixture)).toBeNull();

    await whenEditorReady(fixture);
    expect(host.hasAttribute('aria-busy')).toBe(false);
    expect(host.querySelector('[sanringSkeleton]')).toBeNull();
  });

  it('renders the initial control value without writing it back', async () => {
    const fixture = TestBed.createComponent(FormHost);
    const changes = vi.fn();
    fixture.componentInstance.control.valueChanges.subscribe(changes);

    await whenEditorReady(fixture);

    expect(contentOf(fixture).textContent).toBe('Hello');
    expect(changes).not.toHaveBeenCalled();
    expect(fixture.componentInstance.control.pristine).toBe(true);
  });

  it('pushes edits to the control as HTML and marks it dirty', async () => {
    const fixture = TestBed.createComponent(FormHost);
    const editor = await whenEditorReady(fixture);

    editor.commands.insertContentAt(editor.state.doc.content.size - 1, ' world');

    expect(fixture.componentInstance.control.value).toBe('<p>Hello world</p>');
    expect(fixture.componentInstance.control.dirty).toBe(true);
  });

  it('normalises an empty document to an empty string', async () => {
    const fixture = TestBed.createComponent(FormHost);
    const editor = await whenEditorReady(fixture);

    editor.commands.clearContent(true);

    expect(fixture.componentInstance.control.value).toBe('');
  });

  it('applies external setValue without echoing it back', async () => {
    const fixture = TestBed.createComponent(FormHost);
    await whenEditorReady(fixture);
    const changes = vi.fn();
    fixture.componentInstance.control.valueChanges.subscribe(changes);

    fixture.componentInstance.control.setValue('<p>From outside</p>');
    fixture.detectChanges();

    expect(contentOf(fixture).textContent).toBe('From outside');
    expect(changes).toHaveBeenCalledTimes(1);
  });

  it('marks the control touched on blur', async () => {
    const fixture = TestBed.createComponent(FormHost);
    await whenEditorReady(fixture);

    contentOf(fixture).dispatchEvent(new FocusEvent('focus'));
    contentOf(fixture).dispatchEvent(new FocusEvent('blur'));

    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('wires field validation state onto the contenteditable element', async () => {
    const fixture = TestBed.createComponent(FormHost);
    await whenEditorReady(fixture);
    const { control } = fixture.componentInstance;

    control.setValue('');
    control.markAsTouched();
    fixture.detectChanges();

    const content = contentOf(fixture);
    const error = fixture.nativeElement.querySelector('sanring-error-message') as HTMLElement;
    expect(content.getAttribute('role')).toBe('textbox');
    expect(content.getAttribute('aria-multiline')).toBe('true');
    expect(content.getAttribute('aria-invalid')).toBe('true');
    expect(content.getAttribute('aria-required')).toBe('true');
    expect(content.getAttribute('aria-describedby')).toContain(error.id);
  });

  it('turns the editor read-only when the control is disabled', async () => {
    const fixture = TestBed.createComponent(FormHost);
    await whenEditorReady(fixture);

    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('sanring-rich-text-editor') as HTMLElement;
    expect(contentOf(fixture).getAttribute('contenteditable')).toBe('false');
    expect(contentOf(fixture).getAttribute('aria-disabled')).toBe('true');
    expect(host.getAttribute('aria-disabled')).toBe('true');
  });

  it('accepts extra extensions and emits the editor once ready', async () => {
    const fixture = TestBed.createComponent(EscapeHatchHost);
    const editor = await whenEditorReady(fixture);

    expect(fixture.componentInstance.readyEditor).toBe(editor);
    expect(editor.extensionManager.extensions.some((e) => e.name === 'specMarker')).toBe(true);
    expect(editor.extensionManager.extensions.some((e) => e.name === 'link')).toBe(false);
  });

  it('destroys the editor with the component', async () => {
    const fixture = TestBed.createComponent(FormHost);
    const editor = await whenEditorReady(fixture);

    fixture.destroy();

    expect(editor.isDestroyed).toBe(true);
  });

  it('does not create an editor when destroyed before Tiptap finished loading', async () => {
    const fixture = TestBed.createComponent(EscapeHatchHost);
    fixture.detectChanges();
    const component = fixture.componentInstance.editor();

    fixture.destroy();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(component.editor()).toBeNull();
    expect(fixture.componentInstance.readyEditor).toBeNull();
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(FormHost);
    await whenEditorReady(fixture);

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
