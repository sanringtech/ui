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
      // self-start：field 是 flex flex-col，預設 align-items:stretch 會把 label 撐滿整列寬度，
      // 撐開的空白區域仍算在 <label for> 的點擊範圍內，導致點擊視覺空白處也會 focus 到 input
      'text-sm font-medium leading-none self-start',
      // 沒有 Field 包裝時的 CSS-only fallback：僅在 input 排在 label 之前才會生效 (peer 是後面的兄弟選擇器)
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      // 有 Field 包裝時，精確依賴 control 狀態，不受 DOM 順序影響
      this.field?.isDisabled() && 'cursor-not-allowed opacity-70',
      // 如果你希望輸入錯誤時 Label 也變紅，可以加上這行
      this.field?.hasError() && 'text-red-500',
      this.class(),
    ),
  );
}
