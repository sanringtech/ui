import { Directive, booleanAttribute, computed, input, output } from '@angular/core';
import { cn } from '../../utils';
import { MENU_ITEM_SIZE_CLASS } from '../component-styles';
import { DropdownMenuItemVariant } from './dropdown-menu.type';

@Directive({
  selector: '[sanringDropdownMenuItem]',
  standalone: true,
  host: {
    role: 'menuitem',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-variant]': 'variant()',
    '[attr.tabindex]': 'disabled() ? "-1" : "0"',
    '[class]': 'itemClass()',
    '(click)': 'handleClick()',
    '(keydown.enter)': 'handleKeyActivation($event)',
    '(keydown.space)': 'handleKeyActivation($event)',
  },
})
export class DropdownMenuItemDirective {
  readonly class = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly variant = input<DropdownMenuItemVariant>('default');

  readonly selected = output<void>();

  protected readonly itemClass = computed(() =>
    cn(
      'relative flex w-full cursor-default select-none items-center justify-start gap-2 rounded-[var(--sanring-radius-xs)] outline-none',
      MENU_ITEM_SIZE_CLASS,
      'text-[var(--sanring-foreground)] transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus:bg-[var(--sanring-surface-strong)]',
      this.variant() === 'destructive' &&
        'text-destructive hover:bg-destructive/10 focus:bg-destructive/10',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      this.class(),
    ),
  );

  protected handleClick(): void {
    if (this.disabled()) return;
    this.emitSelection();
  }

  protected handleKeyActivation(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.emitSelection();
  }

  private emitSelection(): void {
    this.selected.emit();
  }
}
