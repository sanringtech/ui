import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-transfer-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'headerClass()',
  },
})
export class TransferHeaderComponent {
  readonly class = input<string | undefined>();

  protected readonly headerClass = computed(() =>
    cn(
      'flex items-center justify-between gap-2 border-b border-[var(--sanring-border)] bg-[var(--sanring-surface-strong)] px-3 py-2 text-sm font-medium text-[var(--sanring-foreground)]',
      this.class(),
    ),
  );
}
