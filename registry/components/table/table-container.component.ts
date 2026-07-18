import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Component({
  selector: 'sanring-table-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'containerClass()',
  },
})
export class TableContainerComponent {
  readonly class = input<string | undefined>();

  protected readonly containerClass = computed(() =>
    cn('relative block w-full overflow-auto', this.class()),
  );
}
