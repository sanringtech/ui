import { Directive, computed, effect, inject, input } from '@angular/core';
import { ButtonDirective } from '../button/button.directive';
import { ToggleDirective } from '../toggle/toggle.directive';
import {
  RichTextEditorActionCommand,
  RichTextEditorToggleCommand,
  canRunCommand,
  isCommandActive,
  runCommand,
} from './rich-text-editor.commands';
import { SANRING_RICH_TEXT_EDITOR } from './rich-text-editor.context';

// Both directives keep focus (and the selection) in the editor on mouse
// clicks: mousedown is cancelled, and the command chain re-focuses the editor.
// The disabled state is set through the DOM property because the reused
// Toggle/Button directives only expose `disabled` as a consumer input.

@Directive({
  selector: 'button[sanringRichTextEditorToggle]',
  standalone: true,
  hostDirectives: [{ directive: ToggleDirective, inputs: ['class', 'variant', 'size'] }],
  host: {
    type: 'button',
    'data-sanring-rte-toolbar-item': '',
    '[attr.aria-label]': 'ariaLabel()',
    '[disabled]': 'isDisabled()',
    '(mousedown)': '$event.preventDefault()',
    '(click)': 'onClick()',
  },
})
export class RichTextEditorToggleDirective {
  readonly command = input.required<RichTextEditorToggleCommand>({
    alias: 'sanringRichTextEditorToggle',
  });
  readonly ariaLabel = input<string | undefined>();

  private readonly context = inject(SANRING_RICH_TEXT_EDITOR);
  private readonly toggle = inject(ToggleDirective, { self: true });

  protected readonly active = computed(() => {
    this.context.state();
    const editor = this.context.editor();
    return !!editor && isCommandActive(editor, this.command());
  });

  protected readonly isDisabled = computed(() => {
    this.context.state();
    const editor = this.context.editor();
    return (
      !editor ||
      this.context.isDisabled() ||
      this.context.isReadonly() ||
      !canRunCommand(editor, this.command())
    );
  });

  constructor() {
    effect(() => this.toggle.pressed.set(this.active()));
  }

  protected onClick(): void {
    const editor = this.context.editor();
    if (editor && !this.isDisabled()) runCommand(editor, this.command());
    // ToggleDirective flips `pressed` on its own click; the editor is the source of truth.
    this.toggle.pressed.set(this.active());
  }
}

@Directive({
  selector: 'button[sanringRichTextEditorAction]',
  standalone: true,
  hostDirectives: [{ directive: ButtonDirective, inputs: ['class', 'variant', 'size'] }],
  host: {
    type: 'button',
    'data-sanring-rte-toolbar-item': '',
    '[attr.aria-label]': 'ariaLabel()',
    '[disabled]': 'isDisabled()',
    '(mousedown)': '$event.preventDefault()',
    '(click)': 'onClick()',
  },
})
export class RichTextEditorActionDirective {
  readonly command = input.required<RichTextEditorActionCommand>({
    alias: 'sanringRichTextEditorAction',
  });
  readonly ariaLabel = input<string | undefined>();

  private readonly context = inject(SANRING_RICH_TEXT_EDITOR);

  protected readonly isDisabled = computed(() => {
    this.context.state();
    const editor = this.context.editor();
    return (
      !editor ||
      this.context.isDisabled() ||
      this.context.isReadonly() ||
      !canRunCommand(editor, this.command())
    );
  });

  protected onClick(): void {
    const editor = this.context.editor();
    if (editor && !this.isDisabled()) runCommand(editor, this.command());
  }
}
