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

  // floating 模式下，是否應該浮到上方：有 focus 或 input 有值就要浮起來
  protected readonly isFloated = computed(() => {
    if (!this.field) return false;
    return this.field.isFocused() || !this.field.isEmpty();
  });

  protected readonly labelClass = computed(() => {
    const floating = this.field?.floating() ?? false;

    return cn(
      // shadcn 預設的 label 樣式
      // self-start：field 是 flex flex-col，預設 align-items:stretch 會把 label 撐滿整列寬度，
      // 撐開的空白區域仍算在 <label for> 的點擊範圍內，導致點擊視覺空白處也會 focus 到 input
      'text-sm font-medium leading-none self-start',
      // 沒有 Field 包裝時的 CSS-only fallback：僅在 input 排在 label 之前才會生效 (peer 是後面的兄弟選擇器)
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      // floating 模式：label 疊在 input 上方 (relative wrapper 由 field.component.ts 提供)，
      // 用 pointer-events-none 確保點擊一律落在 input 上，而不是被 label 攔截
      floating && [
        'pointer-events-none absolute left-3 origin-left transition-all duration-150',
        this.isFloated()
          ? // top-0 -translate-y-1/2：不管字級多大，label 自己的垂直中心永遠精準卡在 border 線上，
            // 不需要量測高度。label 背景與水平 padding 都走 CSS 變數，讓 Field 放在 card/panel/dialog
            // 這類不同 surface 時可以由外層覆寫，不需要 Angular 量測或讀取實際背景色。
            // 背景色應該跟「input 外部」一致，而不是跟 input 內部 bg-[--sanring-surface] 一致。
            // padding box 會自動依文字寬度加寬，剛好蓋掉 label 下方那段 border 缺口。
            'top-0 -translate-y-1/2 bg-[var(--sanring-field-label-background,var(--sanring-background))] px-[var(--sanring-field-label-padding-x,0.25rem)] text-xs'
          : 'top-1/2 -translate-y-1/2 text-sm text-[var(--sanring-muted)]',
      ],
      // 有 Field 包裝時，精確依賴 control 狀態，不受 DOM 順序影響
      this.field?.isDisabled() && 'cursor-not-allowed opacity-70',
      // 如果你希望輸入錯誤時 Label 也變紅，可以加上這行
      this.field?.hasError() && 'text-red-500',
      this.class(),
    );
  });
}
