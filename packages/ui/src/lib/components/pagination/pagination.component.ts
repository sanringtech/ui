import { Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-pagination',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'paginationClass()',
    '[attr.role]': "'navigation'",
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class PaginationComponent {
  readonly class = input<string | undefined>();
  readonly ariaLabel = input('Pagination');

  protected readonly paginationClass = computed(() =>
    cn('flex w-full items-center justify-center', this.class()),
  );
}
