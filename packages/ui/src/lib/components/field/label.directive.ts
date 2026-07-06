import { Directive, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { SanringFieldComponent } from './field.component';

@Directive({
  selector: 'label[sanringLabel]', // 建議綁定在原生 label 上
  standalone: true,
  host: {
    '[class]': 'labelClass()',
    // 魔法在這裡：自動將 for 綁定到 Field 提供的 Input ID 上
    '[attr.for]': 'forId()',
  },
})
export class LabelDirective {
  readonly class = input<string>('');

  // 注入外層的 Field 容器
  private readonly field = inject(SanringFieldComponent, { optional: true });

  // 動態取得 Input 的 ID
  protected readonly forId = computed(() => {
    return this.field?.inputId ?? null; // 如果沒有被 Field 包住，就不綁定
  });

  protected readonly labelClass = computed(() =>
    cn(
      // shadcn 預設的 label 樣式
      'text-sm font-medium leading-none',
      // 配合 input 的 peer class，當 input disabled 時，label 也要跟著變淡且不可點擊
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      // 如果你希望輸入錯誤時 Label 也變紅，可以加上這行
      this.field?.hasError() && 'text-red-500',
      this.class(),
    ),
  );
}
