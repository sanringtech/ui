import { Component, computed, ElementRef, inject, input } from '@angular/core';
import { ComboboxComponent } from './combobox.component';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-combobox-chip-input',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'wrapperClass()',
    // 🌟 當使用者點擊外框空隙時，自動聚焦到內部的 input
    '(click)': 'onWrapperClick()',
  },
})
export class ComboboxChipInputComponent {
  readonly class = input<string | undefined>();

  // 🪄 依賴注入
  protected combobox = inject(ComboboxComponent);
  private elementRef = inject(ElementRef);

  protected readonly wrapperClass = computed(() =>
    cn(
      // 🌟 排版核心：讓裡面的 Chips 和 Input 能夠在同一行水平排列、自動換行
      'flex min-h-10 w-full flex-wrap items-center gap-1 rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)] bg-[var(--sanring-surface)] px-3 py-1 text-sm text-[var(--sanring-foreground)]',
      // 當大腦被禁用時的樣式
      this.combobox.isDisabled() ? 'cursor-not-allowed opacity-50' : 'cursor-text',
      // 聚焦時的外框亮起效果（模擬真實 input 的 focus-within 狀態）
      'focus-within:ring-1 focus-within:ring-[var(--sanring-border-strong)]',
      this.class(),
    ),
  );

  onWrapperClick() {
    if (this.combobox.isDisabled()) return;

    // 🔍 尋找並聚焦內部的真實 input 元素
    const inputEl = this.elementRef.nativeElement.querySelector('input');
    if (inputEl) {
      inputEl.focus();
    }

    // 同時確保選單展開
    this.combobox.toggleOpen(true);
  }
}
