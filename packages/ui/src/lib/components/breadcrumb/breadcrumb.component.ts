import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'breadcrumbClass()',
  },
  template: `<ng-content></ng-content>`,
})
export class BreadcrumbComponent {
  readonly class = input<string | undefined>();
  readonly ariaLabel = input('breadcrumb');

  protected readonly breadcrumbClass = computed(() => cn('block', this.class()));
}
