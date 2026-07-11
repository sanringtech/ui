import { Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-resizable-group',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'groupClass()',
    '[style.width]': '"100%"',
    '[style.height]': '"100%"',
  },
})
export class ResizableGroupComponent {
  // ==========================================
  // 外部設定 (Inputs)
  // ==========================================
  readonly direction = input<'horizontal' | 'vertical'>('horizontal');
  readonly class = input<string | undefined>();

  // ==========================================
  // 視覺排版運算
  // ==========================================
  protected readonly groupClass = computed(() =>
    cn(
      'flex overflow-hidden',
      // 根據方向切換 flex-row 或 flex-col
      this.direction() === 'horizontal' ? 'flex-row' : 'flex-col',
      this.class(),
    ),
  );

  // TODO: 未來這裡需要實作收集 Panel、處理拖曳尺寸計算的邏輯
}
