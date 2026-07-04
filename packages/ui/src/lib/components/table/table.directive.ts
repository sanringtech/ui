import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  // 💡 優化 1：放寬 Selector，讓不習慣寫原生 <table> 標籤的人也能用
  selector: 'table[cdk-table][sanringTable], [cdk-table][sanringTable]',
  standalone: true,
  host: {
    '[class]': 'tableClass()',
  },
})
export class TableDirective {
  // 💡 支援傳入自訂 class
  readonly class = input<string>('');

  protected readonly tableClass = computed(() =>
    cn(
      // 💡 優化 3：防禦性排版樣式（邊框塌陷、文字對齊基底）
      'w-full border-collapse border-spacing-0 text-left align-middle caption-bottom text-sm text-[var(--sanring-foreground)] outline-none',
      this.class(),
    ),
  );
}
