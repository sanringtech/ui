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
      'flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background',
      // 當大腦被禁用時的樣式
      this.combobox.disabled() ? 'cursor-not-allowed opacity-50' : 'cursor-text',
      // 聚焦時的外框亮起效果（模擬真實 input 的 focus-within 狀態）
      'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      this.class(),
    ),
  );

  onWrapperClick() {
    if (this.combobox.disabled()) return;

    // 🔍 尋找並聚焦內部的真實 input 元素
    const inputEl = this.elementRef.nativeElement.querySelector('input');
    if (inputEl) {
      inputEl.focus();
    }

    // 同時確保選單展開
    this.combobox.toggleOpen(true);
  }
}
