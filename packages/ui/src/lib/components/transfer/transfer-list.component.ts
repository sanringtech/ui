import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  },
})
export class TransferListComponent {
  protected readonly panel = inject(TransferPanelComponent);
}
