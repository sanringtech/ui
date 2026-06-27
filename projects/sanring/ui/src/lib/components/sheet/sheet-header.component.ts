import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-sheet-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
  template: `<ng-content></ng-content>`,
})
export class SheetHeaderComponent {
  readonly class = input<string | undefined>();
  protected readonly hostClass = computed(() =>
    cn('flex flex-col gap-1.5 p-6', this.class()),
  );
}
