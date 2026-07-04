import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';
import { DisableableNavDirective } from './disableable-nav.directive';

@Directive({
  selector: 'button[sanringPaginationNav], a[sanringPaginationNav]',
  standalone: true,
  hostDirectives: [{ directive: DisableableNavDirective, inputs: ['disabled'] }],
  host: {
    '[class]': 'navClass()',
  },
})
export class PaginationNavDirective {
  readonly class = input<string | undefined>();

  protected readonly navClass = computed(() =>
    cn(
      'inline-flex size-9 cursor-pointer items-center justify-center rounded-[var(--sanring-radius)] border border-[var(--sanring-border)] bg-transparent text-[var(--sanring-foreground)] transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.class(),
    ),
  );
}
