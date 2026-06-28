import { Directive, booleanAttribute, computed, input, output } from '@angular/core';
import { cn } from '../../utils';
import { MENU_ITEM_SIZE_CLASS } from '../component-styles';

@Directive({
  selector: '[sanringMenuItem]',
  standalone: true,
  host: {
    role: 'menuitem',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.tabindex]': 'disabled() ? "-1" : "0"',
    '[class]': 'itemClass()',
    '(click)': 'handleClick()',
    '(keydown.enter)': 'handleKeyActivation($event)',
    '(keydown.space)': 'handleKeyActivation($event)',
  },
})
export class MenuItemDirective {
  readonly class = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly selected = output<void>();

  protected readonly itemClass = computed(() =>
    cn(
      'relative flex cursor-default select-none items-center rounded-sm outline-none',
      MENU_ITEM_SIZE_CLASS,
      'text-[var(--sanring-foreground)] transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus:bg-[var(--sanring-surface-strong)]',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      this.class(),
    ),
  );

  protected handleClick(): void {
    if (!this.disabled()) this.selected.emit();
  }

  protected handleKeyActivation(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.selected.emit();
  }
}
