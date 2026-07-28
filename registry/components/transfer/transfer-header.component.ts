import { ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { TransferPanelComponent } from './transfer-panel.component';

@Component({
  selector: 'sanring-transfer-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
    @if (isShow()) {
      <span class="ml-auto shrink-0 text-xs font-normal text-[var(--sanring-muted)]">
        {{ panel.selectedCount() }}/{{ panel.selectableItems().length }}
      </span>
    }
  `,
  host: {
    '[class]': 'headerClass()',
  },
})
export class TransferHeaderComponent {
  readonly class = input<string | undefined>();
  readonly isShow = input(false, { transform: booleanAttribute });

  protected readonly panel = inject(TransferPanelComponent);

  protected readonly headerClass = computed(() =>
    cn(
      'flex items-center gap-2 border-b border-[var(--sanring-border)] bg-[var(--sanring-surface-strong)] px-3 py-2 text-sm font-medium text-[var(--sanring-foreground)]',
      this.class(),
    ),
  );
}
