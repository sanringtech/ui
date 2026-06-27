import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-sheet-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
  template: `<ng-content></ng-content>`,
})
export class SheetTitleComponent {
  readonly class = input<string | undefined>();
  protected readonly hostClass = computed(() =>
    cn('text-lg font-semibold leading-none text-[var(--sanring-foreground)]', this.class()),
  );
}
