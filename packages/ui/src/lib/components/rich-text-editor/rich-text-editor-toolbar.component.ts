import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
} from '@angular/core';
import { cn } from '../../utils';
import { SANRING_RICH_TEXT_EDITOR } from './rich-text-editor.context';

/** Marks an element as a stop in the toolbar's arrow-key navigation. */
export const RICH_TEXT_EDITOR_TOOLBAR_ITEM = 'data-sanring-rte-toolbar-item';

// WAI-ARIA toolbar pattern: the whole toolbar is one Tab stop and arrow keys
// move between its buttons. Disabled buttons are skipped (PRD §12). Items are
// found in the DOM rather than through content queries so buttons wrapped in
// sanring-tooltip or other markup still take part.
@Component({
  selector: 'sanring-rich-text-editor-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'toolbar',
    '[class]': 'toolbarClass()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.aria-controls]': 'context.contentId()',
    '(keydown)': 'onKeydown($event)',
    '(focusin)': 'onFocusIn($event)',
  },
  template: `<ng-content />`,
})
export class RichTextEditorToolbarComponent {
  readonly class = input<string | undefined>();
  readonly ariaLabel = input<string | undefined>('Formatting');
  readonly ariaLabelledBy = input<string | undefined>();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  protected readonly context = inject(SANRING_RICH_TEXT_EDITOR);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private current: HTMLElement | null = null;

  protected readonly toolbarClass = computed(() =>
    cn(
      'flex flex-wrap items-center gap-1 border-[var(--sanring-border)] p-1',
      this.orientation() === 'vertical' ? 'flex-col border-r' : 'border-b',
      this.class(),
    ),
  );

  constructor() {
    // Button disabled states follow the editor (its arrival, every transaction,
    // and the disabled state), so the tab stop is re-checked after each render.
    afterRenderEffect(() => {
      this.context.editor();
      this.context.state();
      this.context.isDisabled();
      this.syncTabStops();
    });
  }

  protected onFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    if (!target.hasAttribute(RICH_TEXT_EDITOR_TOOLBAR_ITEM)) return;
    this.current = target;
    this.syncTabStops();
  }

  protected onKeydown(event: KeyboardEvent): void {
    const horizontal = this.orientation() === 'horizontal';
    const step: Record<string, number | 'first' | 'last'> = {
      [horizontal ? 'ArrowRight' : 'ArrowDown']: 1,
      [horizontal ? 'ArrowLeft' : 'ArrowUp']: -1,
      Home: 'first',
      End: 'last',
    };
    const move = step[event.key];
    if (move === undefined) return;

    const items = this.enabledItems();
    const index = items.indexOf(event.target as HTMLElement);
    if (index === -1 || items.length === 0) return;

    event.preventDefault();
    const next =
      move === 'first'
        ? 0
        : move === 'last'
          ? items.length - 1
          : (index + move + items.length) % items.length;
    items[next].focus();
  }

  private allItems(): HTMLElement[] {
    return Array.from(this.host.querySelectorAll<HTMLElement>(`[${RICH_TEXT_EDITOR_TOOLBAR_ITEM}]`));
  }

  private enabledItems(): HTMLElement[] {
    return this.allItems().filter((item) => !item.matches(':disabled'));
  }

  private syncTabStops(): void {
    const enabled = this.enabledItems();
    const stop = this.current && enabled.includes(this.current) ? this.current : (enabled[0] ?? null);
    this.current = stop;
    for (const item of this.allItems()) {
      item.tabIndex = item === stop ? 0 : -1;
    }
  }
}
