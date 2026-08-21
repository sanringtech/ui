import { ChangeDetectionStrategy, Component, inject, viewChildren } from '@angular/core';
import { TransferItemComponent } from './transfer-item.component';
import { TransferPanelComponent } from './transfer-panel.component';

@Component({
  selector: 'sanring-transfer-list',
  standalone: true,
  imports: [TransferItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Data-driven：清單本身跟著父層 TransferPanelComponent 的 items() 產生，
  // 使用端不用手動一個一個列 <sanring-transfer-item>。
  template: `
    @for (item of panel.items(); track item.key) {
      <sanring-transfer-item [item]="item" />
    }
  `,
  host: {
    class: 'flex flex-col flex-1 overflow-y-auto',
    role: 'group',
    '(keydown)': 'onKeydown($event)',
  },
})
export class TransferListComponent {
  protected readonly panel = inject(TransferPanelComponent);
  private readonly renderedItems = viewChildren(TransferItemComponent);

  protected onKeydown(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

    const items = this.renderedItems().filter((item) => !item.isDisabled());
    if (items.length === 0) return;

    event.preventDefault();
    const activeKey = this.panel.activeItemKey();
    const currentIndex = items.findIndex((item) => item.item().key === activeKey);
    let nextIndex: number;

    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = items.length - 1;
    else if (event.key === 'ArrowDown') nextIndex = Math.min(currentIndex + 1, items.length - 1);
    else nextIndex = Math.max(currentIndex <= 0 ? 0 : currentIndex - 1, 0);

    const next = items[nextIndex];
    this.panel.setActiveItem(next.item().key);
    next.focus();
  }
}
