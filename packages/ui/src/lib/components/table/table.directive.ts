import { Directive, computed, input, signal } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  // 只支援原生 <table cdk-table> 模式：cell/row directive 目前都只匹配 th/td/tr，
  // 沒有對應 CDK flex-layout（<cdk-table> 自訂標籤）的平行版本，selector 加寬也不會生效。
  selector: 'table[cdk-table][sanringTable]',
  standalone: true,
  host: {
    '[class]': 'tableClass()',
    // ratio 欄位一定要搭配 table-layout: fixed 才有效，
    // 只有真的有欄位註冊 ratio 時才開，沒用到這個功能的表格行為不受影響。
    '[class.cdk-table-fixed-layout]': 'hasColumnRatios()',
  },
})
export class TableDirective {
  // 💡 支援傳入自訂 class
  readonly class = input<string>('');

  private readonly columnRatios = signal(new Map<string, number>());

  protected readonly hasColumnRatios = computed(() => this.columnRatios().size > 0);

  protected readonly tableClass = computed(() =>
    cn(
      // 💡 優化 3：防禦性排版樣式（邊框塌陷、文字對齊基底）
      'w-full border-collapse border-spacing-0 text-left align-middle caption-bottom text-sm text-[var(--sanring-foreground)] outline-none',
      this.class(),
    ),
  );

  /** @docs-private 由 TableColumnDefDirective 呼叫，註冊該欄位的寬度比例。 */
  registerColumnRatio(name: string, ratio: number): void {
    this.columnRatios.update((map) => {
      const next = new Map(map);
      next.set(name, ratio);
      return next;
    });
  }

  /** @docs-private 欄位（TableColumnDefDirective）銷毀時取消註冊。 */
  unregisterColumnRatio(name: string): void {
    this.columnRatios.update((map) => {
      if (!map.has(name)) return map;
      const next = new Map(map);
      next.delete(name);
      return next;
    });
  }

  /** @docs-private 由 TableHeaderCellDirective 呼叫，取得該欄位換算後的百分比寬度。 */
  widthPercentFor(name: string): number | null {
    const map = this.columnRatios();
    const ratio = map.get(name);
    if (ratio == null) return null;

    const total = [...map.values()].reduce((sum, value) => sum + value, 0);
    return total > 0 ? (ratio / total) * 100 : null;
  }
}
