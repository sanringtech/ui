import { Component, computed, inject, input } from '@angular/core';
import { ResizableGroupComponent } from './resizable-group.component';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-resizable-handle',
  standalone: true,
  template: `
    <!-- 🌟 可選的視覺小把手 (Grip Icon)，很多編輯器中間都有這個小藥丸 -->
    @if (withHandle()) {
      <div class="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-2.5 w-2.5"
        >
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>
    }
  `,
  host: {
    // 🌟 告訴 CSS 現在是水平還是垂直
    '[attr.data-orientation]': 'group.direction()',
    '[class]': 'handleClass()',

    // 🌟 攔截拖曳起點，並通報給大腦
    '(mousedown)': 'onDragStart($event)',
    '(touchstart)': 'onDragStart($event)',
  },
})
export class ResizableHandleComponent {
  // ==========================================
  // 1. 外部設定 (Inputs)
  // ==========================================
  readonly withHandle = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly class = input<string | undefined>();

  // 🪄 依賴注入：連線大腦
  protected group = inject(ResizableGroupComponent);

  // ==========================================
  // 2. 視覺排版運算 (包含隱形感應區的黑魔法)
  // ==========================================
  protected readonly handleClass = computed(() =>
    cn(
      // 基礎樣式：一條 1px 的線，並設定 relative 讓內部的 grip 絕對定位
      'relative flex w-px items-center justify-center bg-border transition-colors',

      // 隱形感應區：利用 after 偽元素把點擊範圍往外擴張，才不會太難點到
      'after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2',

      // 焦點樣式支援
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',

      // 根據方向動態切換：
      // 水平分割時 (左右拖) -> 鼠標變左右，高度撐滿
      'data-[orientation=horizontal]:cursor-col-resize',

      // 垂直分割時 (上下拖) -> 寬高反轉，鼠標變上下，且內部的 grip 小圖示要旋轉 90 度
      'data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full',
      'data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-2 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:-translate-y-1/2 data-[orientation=vertical]:after:translate-x-0',
      'data-[orientation=vertical]:cursor-row-resize [&[data-orientation=vertical]>div]:rotate-90',

      // 停用狀態
      this.disabled() && 'pointer-events-none opacity-50',

      this.class(),
    ),
  );

  // ==========================================
  // 3. 互動邏輯 (通報大腦)
  // ==========================================
  onDragStart(event: MouseEvent | TouchEvent) {
    if (this.disabled()) return;

    // 🛑 阻止預設行為 (例如反白選取文字)，讓拖曳過程更順暢
    event.preventDefault();

    // 🌟 把「我被按下了」這件事，連同事件本身丟給大腦去處理
    // this.group.startDrag(this, event);
  }
}
