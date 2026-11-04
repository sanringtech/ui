import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';
import { ButtonDirective } from '../button/button.directive';
import {
  DropdownMenuComponent,
  DropdownMenuContentComponent,
  DropdownMenuItemDirective,
  DropdownMenuTriggerDirective,
} from '../dropdown-menu';
import {
  RichTextEditorHeadingLevel,
  activeTextStyle,
  setTextStyle,
} from './rich-text-editor.commands';
import { SANRING_RICH_TEXT_EDITOR } from './rich-text-editor.context';

interface TextStyleOption {
  value: RichTextEditorHeadingLevel | 0;
  label: string;
}

@Component({
  selector: 'sanring-rich-text-editor-heading-menu',
  standalone: true,
  imports: [
    ButtonDirective,
    DropdownMenuComponent,
    DropdownMenuContentComponent,
    DropdownMenuItemDirective,
    DropdownMenuTriggerDirective,
    LucideChevronDown,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <sanring-dropdown-menu>
      <button
        type="button"
        sanringBtn
        variant="ghost"
        size="sm"
        sanringDropdownMenuTrigger
        data-sanring-rte-toolbar-item
        [menu]="menu.menu"
        [disabled]="isDisabled()"
        [attr.aria-label]="ariaLabel() + ': ' + currentLabel()"
        (mousedown)="$event.preventDefault()"
      >
        {{ currentLabel() }}
        <svg lucideChevronDown aria-hidden="true" class="size-4 opacity-60"></svg>
      </button>

      <sanring-dropdown-menu-content
        #menu="sanringDropdownMenuContent"
        class="w-44"
        (itemSelected)="select($event)"
      >
        @for (option of options(); track option.value) {
          <button sanringDropdownMenuItem type="button" [value]="option.value">
            {{ option.label }}
          </button>
        }
      </sanring-dropdown-menu-content>
    </sanring-dropdown-menu>
  `,
})
export class RichTextEditorHeadingMenuComponent {
  readonly levels = input<readonly RichTextEditorHeadingLevel[]>([1, 2, 3]);
  readonly ariaLabel = input('Text style');
  readonly paragraphLabel = input('Paragraph');
  readonly headingLabel = input('Heading');

  private readonly context = inject(SANRING_RICH_TEXT_EDITOR);

  protected readonly options = computed<TextStyleOption[]>(() => [
    { value: 0, label: this.paragraphLabel() },
    ...this.levels().map((level) => ({ value: level, label: `${this.headingLabel()} ${level}` })),
  ]);

  protected readonly currentLabel = computed(() => {
    this.context.state();
    const editor = this.context.editor();
    const style = editor ? activeTextStyle(editor) : 0;
    return this.options().find((option) => option.value === style)?.label ?? this.paragraphLabel();
  });

  protected readonly isDisabled = computed(() => {
    this.context.state();
    const editor = this.context.editor();
    return !editor || this.context.isDisabled() || this.context.isReadonly();
  });

  protected select(value: RichTextEditorHeadingLevel | 0): void {
    const editor = this.context.editor();
    if (!editor) return;
    setTextStyle(editor, value);
    // The menu hands focus back to its trigger as it closes; return it to the text instead.
    setTimeout(() => {
      if (!editor.isDestroyed) editor.commands.focus();
    });
  }
}
