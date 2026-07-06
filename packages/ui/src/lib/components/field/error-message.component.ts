import { Component, DestroyRef, computed, inject, input } from '@angular/core';
import { cn, uniqueId } from '../../utils';
import { SanringFieldComponent } from './field.component';

@Component({
  selector: 'sanring-error-message', // 正名為 error-message
  standalone: true,
  host: {
    '[class]': 'errorClass()',
    '[id]': 'id',
    // 讓螢幕閱讀器能自動朗讀錯誤訊息
    'aria-live': 'polite',
    // 根據 Field 狀態自動隱藏
    '[class.hidden]': '!shouldShow()',
  },
  template: `<ng-content></ng-content>`,
})
export class ErrorMessageComponent {
  readonly class = input<string>('');

  readonly id = uniqueId('sanring-error-message');

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

  constructor() {
    // 顯示中的錯誤訊息才需要出現在 aria-describedby，隱藏時（display:none）就算掛著也不會被朗讀，
    // 但仍主動 unregister 讓 Field 的 describedByIds 保持乾淨
    this.field?.registerDescribedBy(this.id);
    inject(DestroyRef).onDestroy(() => this.field?.unregisterDescribedBy(this.id));
  }

  protected readonly errorClass = computed(() =>
    cn(
      // shadcn 風格的錯誤文字樣式 (text-destructive)
      'text-[0.8rem] font-medium text-red-500',
      this.class(),
    ),
  );
}
