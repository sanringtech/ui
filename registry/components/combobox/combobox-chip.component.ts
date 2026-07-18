import { Component, computed, inject, input } from '@angular/core';
import { LucideX } from '@lucide/angular';
import { ComboboxComponent } from './combobox.component';
import { cn } from '../shared/utils';

@Component({
  selector: 'sanring-combobox-chip',
  standalone: true,
  imports: [LucideX],
  template: `
    <!-- 標籤的文字內容 (例如 "Apple") -->
    <span class="truncate">
      <ng-content></ng-content>
    </span>

    <!-- 刪除按鈕 -->
    <button
      type="button"
      class="ml-1 flex h-4 w-4 items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--sanring-border-strong)]"
      (click)="onRemove($event)"
      [disabled]="isDisabled()"
    >
      <svg lucideX class="h-3 w-3"></svg>
      <span class="sr-only">移除選項</span>
    </button>
  `,
  host: {
    '[class]': 'chipClass()',
  },
})
export class ComboboxChipComponent {
  // 🌟 必須傳入 value，大腦才知道要刪除陣列中的哪一筆資料
  readonly value = input.required<string>();
  readonly class = input<string | undefined>();

  // 允許單獨將這顆 Chip 設為禁用狀態
  readonly disabled = input<boolean>(false);

  // 🪄 依賴注入：連線到大腦
  protected combobox = inject(ComboboxComponent);

  // 🔍 禁用狀態判斷：如果大腦被禁用了，或者這顆 Chip 自己被禁用了，就鎖死按鈕
  protected readonly isDisabled = computed(() => this.disabled() || this.combobox.isDisabled());

  // 🎨 視覺排版：經典的 Badge/Chip 樣式
  protected readonly chipClass = computed(() =>
    cn(
      'inline-flex items-center justify-between rounded-[var(--sanring-radius-xs)] px-1.5 py-0.5 text-xs font-semibold transition-colors',
      // 預設樣式：次要背景色
      'border border-[var(--sanring-border)] bg-[var(--sanring-surface-strong)] text-[var(--sanring-foreground)]',
      // 禁用狀態的透明度
      this.isDisabled() ? 'opacity-50 pointer-events-none' : 'hover:bg-[var(--sanring-active)]',
      this.class(),
    ),
  );

  onRemove(event: MouseEvent) {
    // 🛑 這是極度關鍵的一行！
    // 阻止事件冒泡，避免點擊「X」時，外層的 ComboboxInput 誤以為你要打開選單
    event.stopPropagation();
    event.preventDefault();

    // 通知大腦：把我從多選名單中除名！
    this.combobox.removeValue(this.value());
  }
}
