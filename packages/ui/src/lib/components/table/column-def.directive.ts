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
      // 有固定 width 的欄位不進比例池，剩下的欄位才按 ratio 分配空間。
      if (ratio != null && this.width() == null) {
        this.table?.registerColumnRatio(this.columnDef.name, ratio);
      }
    });
  }

  ngOnDestroy(): void {
    this.table?.unregisterColumnRatio(this.columnDef.name);
  }
}
