import { Directive, OnDestroy, effect, inject, input } from '@angular/core';
import { CdkColumnDef } from '@angular/cdk/table';
import { TableDirective } from './table.directive';

@Directive({
  selector: '[sanringColumnDef]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkColumnDef,
      inputs: ['cdkColumnDef: sanringColumnDef', 'sticky', 'stickyEnd'],
    },
  ],
})
export class TableColumnDefDirective implements OnDestroy {
  // 跟 SortHeaderComponent 一樣：宣告時的巢狀關係讓 inject() 能抓到祖先 <table sanringTable>。
  private readonly table = inject(TableDirective, { optional: true });
  private readonly columnDef = inject(CdkColumnDef);

  /** 這個欄位在寬度分配裡佔的比例（像 flex-grow）。設了 width 就不會用到這個。 */
  readonly ratio = input<number>();

  /** 固定寬度（例如 '48px'）。設了就直接用這個值，不參與 ratio 的比例分配。 */
  readonly width = input<string>();

  get name(): string {
    return this.columnDef.name;
  }

  constructor() {
    effect(() => {
      const ratio = this.ratio();
      const width = this.width();
      // 有固定 width 的欄位不進比例池，剩下的欄位才按 ratio 分配空間。ratio/width
      // 是 input，執行期可能動態改變（例如使用者切換欄位為固定寬度）——沒有比例
      // 資格時要主動 unregister，不然舊值會一直留在分母裡，拉低其他 ratio 欄位的百分比。
      if (ratio != null && width == null) {
        this.table?.registerColumnRatio(this.columnDef.name, ratio);
      } else {
        this.table?.unregisterColumnRatio(this.columnDef.name);
      }
    });
  }

  ngOnDestroy(): void {
    this.table?.unregisterColumnRatio(this.columnDef.name);
  }
}
