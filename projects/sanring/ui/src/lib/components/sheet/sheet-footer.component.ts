import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-sheet-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
  template: `<ng-content></ng-content>`,
})
export class SheetFooterComponent {
  readonly class = input<string | undefined>();
  protected readonly hostClass = computed(() =>
    cn('flex flex-col-reverse gap-2 p-6 pt-0 sm:flex-row sm:justify-end', this.class()),
  );
}
