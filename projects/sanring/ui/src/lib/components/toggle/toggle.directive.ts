import { Directive, booleanAttribute, computed, input, model } from '@angular/core';
import { cn } from '../../utils';
import type { ToggleSize, ToggleVariant } from './toggle.types';

@Directive({
  selector: 'button[sanringToggle]',
  standalone: true,
  host: {
    '[class]': 'toggleClass()',
    '[attr.aria-pressed]': 'pressed()',
    '[attr.data-state]': 'pressed() ? "on" : "off"',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '(click)': 'onClick()',
  },
})
export class ToggleDirective {
  readonly class = input<string | undefined>();
  readonly variant = input<ToggleVariant>('default');
  readonly size = input<ToggleSize>('md');
  readonly pressed = model<boolean>(false);
  readonly disabled = input(false, { transform: booleanAttribute });

  protected onClick(): void {
    if (this.disabled()) return;
    this.pressed.update(v => !v);
  }

  protected readonly toggleClass = computed(() => {
    const variants: Record<ToggleVariant, string> = {
      default: cn(
        'border-transparent bg-transparent text-[var(--sanring-foreground)]',
        'hover:bg-[var(--sanring-surface-strong)]',
        'data-[state=on]:bg-[var(--sanring-surface-strong)]',
      ),
      outline: cn(
        'border-[var(--sanring-border)] bg-transparent text-[var(--sanring-foreground)]',
        'hover:bg-[var(--sanring-surface-strong)]',
        'data-[state=on]:bg-[var(--sanring-surface-strong)]',
      ),
    };
    const sizes: Record<ToggleSize, string> = {
      sm: 'h-8 px-2 text-sm gap-1',
      md: 'h-9 px-3 text-sm gap-1.5',
      lg: 'h-10 px-4 text-base gap-2',
    };
    return cn(
      'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md border font-medium',
      'transition-colors focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-[var(--sanring-border-strong)]',
      'disabled:pointer-events-none disabled:opacity-50',
      variants[this.variant()],
      sizes[this.size()],
      this.class(),
    );
  });
}
