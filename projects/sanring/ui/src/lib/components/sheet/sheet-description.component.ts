import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-sheet-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
  template: `<ng-content></ng-content>`,
})
export class SheetDescriptionComponent {
  readonly class = input<string | undefined>();
  protected readonly hostClass = computed(() =>
    cn('text-sm text-[var(--sanring-muted)]', this.class()),
  );
}
