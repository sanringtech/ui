import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { COLLECTION_ITEM_DISABLED_CLASS } from '../component-styles';
import { TransferPanelComponent } from './transfer-panel.component';
import { TransferItem } from './transfer.type';

@Component({
  selector: 'sanring-transfer-item',
  standalone: true,
  imports: [CheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sanring-checkbox
      size="sm"
      [checked]="checked()"
      [disabled]="isDisabled()"
      [ariaLabel]="item().label"
    />
    {{ item().label }}
  `,
  host: {
    '[class]': 'itemClass()',
    '(click)': 'panel.toggleSelected(item().key)',
  },
})
export class TransferItemComponent {
  readonly item = input.required<TransferItem>();

  protected readonly panel = inject(TransferPanelComponent);

  protected readonly checked = computed(() => this.panel.isSelected(this.item().key));

  // 兩種來源都會讓一個項目「不能互動」：項目本身標了 disabled，或是它所在的
  // panel 因為 one-way 模式整個變成唯讀（target 面板不接受勾選）。
  protected readonly isDisabled = computed(() => !!this.item().disabled || !this.panel.interactive());

  protected readonly itemClass = computed(() =>
    cn(
      'flex items-center gap-2 px-3 py-2 text-sm text-[var(--sanring-foreground)] transition-colors',
      this.isDisabled()
        ? cn(COLLECTION_ITEM_DISABLED_CLASS, 'cursor-not-allowed')
        : 'cursor-pointer hover:bg-[var(--sanring-surface-strong)]',
    ),
  );
}
