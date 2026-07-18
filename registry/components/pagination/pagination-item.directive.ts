import { Directive, booleanAttribute, computed, input } from '@angular/core';
import { cn } from '../shared/utils';
import { DisableableNavDirective } from './disableable-nav.directive';

@Directive({
  selector: 'button[sanringPaginationItem], a[sanringPaginationItem]',
  standalone: true,
  hostDirectives: [{ directive: DisableableNavDirective, inputs: ['disabled'] }],
  host: {
    '[class]': 'itemClass()',
    '[attr.aria-current]': 'active() ? "page" : null',
  },
})
export class PaginationItemDirective {
  readonly class = input<string | undefined>();
  readonly active = input(false, { transform: booleanAttribute });

  protected readonly itemClass = computed(() =>
    cn(
      'inline-flex size-9 cursor-pointer items-center justify-center rounded-[var(--sanring-radius)] border text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      this.active()
        ? 'border-[var(--sanring-border-strong)] bg-[var(--sanring-active)] text-[var(--sanring-foreground)]'
        : 'border-[var(--sanring-border)] bg-transparent text-[var(--sanring-foreground)] hover:bg-[var(--sanring-surface-strong)]',
      'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.class(),
    ),
  );
}
