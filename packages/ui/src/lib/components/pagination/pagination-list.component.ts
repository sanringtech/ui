import { Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-pagination-list',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'listClass()',
  },
})
export class PaginationListComponent {
  readonly class = input<string | undefined>();

  protected readonly listClass = computed(() => cn('flex items-center gap-1', this.class()));
}
