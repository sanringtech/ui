import { Component, computed, input, signal } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-resizable-panel',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'panelClass()',
    // 🌟 核心魔法：利用 flex 屬性來控制在 Group 中的佔比
    '[style.flex]': 'flexStyle()',
  },
})
export class ResizablePanelComponent {
  // ==========================================
  // 1. 外部邊界設定 (Inputs) - 通常以百分比 (0-100) 為單位
  // ==========================================
  readonly defaultSize = input<number>();
  readonly minSize = input<number>(0);
  readonly maxSize = input<number>(100);

  readonly class = input<string | undefined>();

  // ==========================================
  // 2. 內部狀態 (State)
  // ==========================================
  // 儲存當下被大腦計算出來的實際尺寸，未來拖曳時大腦會頻繁更新這個值
  readonly currentSize = signal<number | undefined>(undefined);

  // ==========================================
  // 3. 視覺排版運算
  // ==========================================
  protected readonly panelClass = computed(() =>
    cn(
      // overflow-hidden 是必須的，防止面板縮小的時候內容爆出畫面
      'relative flex flex-col overflow-hidden',
      this.class(),
    ),
  );

  protected readonly flexStyle = computed(() => {
    const size = this.currentSize();
    // 如果沒有指定大小，就預設 flex-grow: 1 讓大家均分空間
    if (size === undefined) return '1 1 0%';

    // 透過 flex-grow 與 flex-shrink 套用計算後的比例，例如 "30 30 0%"
    return `${size} ${size} 0%`;
  });
}
