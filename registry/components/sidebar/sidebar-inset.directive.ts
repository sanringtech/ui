import { Directive, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Directive({
  selector: '[sanringSidebarInset]',
  standalone: true,
  host: {
    '[class]': 'insetClass()',
  },
})
export class SidebarInsetDirective {
  readonly class = input<string | undefined>();

  protected readonly insetClass = computed(() => cn('min-w-0 flex-1', this.class()));
}
