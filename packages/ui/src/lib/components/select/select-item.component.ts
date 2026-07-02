import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LucideCheck } from '@lucide/angular';
import { SelectComponent } from './select.component';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-select-item',
  standalone: true,
  imports: [LucideCheck],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option', // 💡 W3C 標準：宣告這是清單內的一個可選項
    '[attr.aria-selected]': 'isSelected()',
    '[attr.data-state]': 'isSelected() ? "selected" : "not-selected"',
    '[attr.aria-disabled]': 'disabled() ? "true" : "false"',
    '[class]': 'itemClass()',
    '(click)': 'onClick()', // 監聽點擊
  },
  template: `
    <!-- 預設左側留出一個空間放 Check 圖示 -->
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      @if (isSelected()) {
        <svg lucideCheck class="size-4" strokeWidth="3"></svg>
      }
    </span>

    <!-- 顯示選項內部的文字或自訂投影 -->
    <span class="block truncate">
      <ng-content></ng-content>
    </span>
  `,
})
export class SelectItemComponent {
  // 🧠 注入大腦（因為大腦可能有泛型，這裡預設對接）
  protected readonly select = inject(SelectComponent);

  // 接收這個選項代表的真正數值（例如 'apple', 123, 或是一整隻物件）
  readonly value = input.required<any>();

  // 允許單個選項禁用
  readonly disabled = input<boolean>(false);

  // 允許外部擴充樣式
  readonly class = input<string | undefined>();

  // 💡 動態計算：當大腦目前的 value() 等於自己傳入的 value() 時，就是被選中狀態
  protected readonly isSelected = computed(() => {
    const registryValue = this.select.value();
    const myValue = this.value();

    // 如果是物件型別，實務上可能需要深比較（Deep Equal），這裡先做基礎相等性檢查
    return registryValue === myValue;
  });

  protected readonly itemClass = computed(() =>
    cn(
      // 基底排版：相對定位、留出左邊給對勾圖示的 padding (pl-8)
      'relative flex w-full cursor-default select-none items-center rounded-[var(--sanring-radius-sm)] py-1.5 pl-8 pr-2 text-sm text-[var(--sanring-foreground)] outline-none',
      // 互動狀態：滑鼠移入、或是未來鍵盤聚焦時的背景色 (bg-accent)
      'hover:bg-[var(--sanring-accent)] hover:text-[var(--sanring-accent-foreground)]',
      // 禁用狀態
      'pointer-events-none opacity-50',
      this.class(),
    ),
  );

  protected onClick(): void {
    if (this.disabled() || this.select.disabled()) return;

    // 💡 核心動作：告訴大腦我被選中了，把我的值傳回去！
    this.select.selectValue(this.value());
  }
}
