import { Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { SanringFieldComponent } from './field.component';

@Component({
  selector: 'sanring-error-message', // 正名為 error-message
  standalone: true,
  host: {
    '[class]': 'errorClass()',
    // 讓螢幕閱讀器能自動朗讀錯誤訊息
    'aria-live': 'polite',
    // 根據 Field 狀態自動隱藏
    '[class.hidden]': '!shouldShow()',
  },
  template: `<ng-content></ng-content>`,
})
export class ErrorMessageComponent {
  readonly class = input<string>('');

  // 注入外層的 Field 容器（使用 optional: true 允許它在 Field 外獨立使用）
  private readonly field = inject(SanringFieldComponent, { optional: true });

  /**
   * 智慧顯示邏輯：
   * 1. 如果有被包裝在 <sanring-field> 內，就根據 Field 的 hasError 狀態決定是否顯示。
   * 2. 如果沒有被包裝，就預設顯示（讓開發者自己用 @if 控制）。
   */
  protected readonly shouldShow = computed(() => {
    return this.field ? this.field.hasError() : true;
  });

  protected readonly errorClass = computed(() =>
    cn(
      // shadcn 風格的錯誤文字樣式 (text-destructive)
      'text-[0.8rem] font-medium text-red-500',
      this.class(),
    ),
  );
}
