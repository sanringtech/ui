import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { cn } from '../shared/utils';

@Component({
  selector: 'sanring-table-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'containerClass()',
  },
  styles: `
    sanring-table-container .cdk-table-sticky,
    sanring-table-container .cdk-table-sticky-end {
      background-color: var(--sanring-background);
    }
  `,
})
export class TableContainerComponent {
  readonly class = input<string | undefined>();

  protected readonly containerClass = computed(() =>
    cn('relative block w-full overflow-auto', this.class()),
  );
}
