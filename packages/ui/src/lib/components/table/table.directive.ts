import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  // 只支援原生 <table cdk-table> 模式：cell/row directive 目前都只匹配 th/td/tr，
  // 沒有對應 CDK flex-layout（<cdk-table> 自訂標籤）的平行版本，selector 加寬也不會生效。
  selector: 'table[cdk-table][sanringTable]',
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
