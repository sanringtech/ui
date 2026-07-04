import { Directive } from '@angular/core';
import {
  CdkHeaderCellDef,
  CdkCellDef,
  CdkFooterCellDef, // 模具三護法
  CdkHeaderCell,
  CdkCell,
  CdkFooterCell, // 實體三護法（負責 cdk 內部格子插槽的連動）
} from '@angular/cdk/table';

// ==========================================
// 📦 模具陣營（專門貼在 ng-template 模具上）
// ==========================================
@Directive({
  selector: 'ng-template[sanringHeaderCellDef]',
  standalone: true,
  hostDirectives: [CdkHeaderCellDef],
})
export class TableHeaderCellDefDirective {}

@Directive({
  selector: 'ng-template[sanringCellDef]',
  standalone: true,
  hostDirectives: [CdkCellDef],
})
export class TableCellDefDirective {}

@Directive({
  selector: 'ng-template[sanringFooterCellDef]',
  standalone: true,
  hostDirectives: [CdkFooterCellDef],
})
export class TableFooterCellDefDirective {}

// ==========================================
// 🧁 蛋糕陣營（當蛋糕被蓋出來時，精準捕捉並灌入樣式與 CDK 實體邏輯）
// ==========================================
@Directive({
  // 💡 Selector 大改版！我們只認真實標籤和你的 sanring 貼紙，不再依賴 cdk 屬性字眼
  selector: 'th[sanringHeaderCell]',
  standalone: true,
  // 🧠 當 <th> 蛋糕出生時，我們強行把 CDK 原生的 CdkHeaderCell 邏輯塞進去！
  hostDirectives: [CdkHeaderCell],
  host: {
    class:
      'h-12 px-4 text-left align-middle font-medium text-[var(--sanring-muted)] [&:has([role=checkbox])]:pr-0',
  },
})
export class TableHeaderCellDirective {}

@Directive({
  selector: 'td[sanringCell]',
  standalone: true,
  // 🧠 當 <td> 蛋糕出生時，我們強行把 CDK 原生的 CdkCell 邏輯塞進去！
  hostDirectives: [CdkCell],
  host: { class: 'p-4 align-middle [&:has([role=checkbox])]:pr-0' },
})
export class TableCellDirective {}

@Directive({
  selector: 'td[sanringFooterCell], th[sanringFooterCell]',
  standalone: true,
  // 🧠 當 footer 蛋糕出生時，我們強行把 CDK 原生的 CdkFooterCell 邏輯塞進去！
  hostDirectives: [CdkFooterCell],
  host: { class: 'border-t p-4 align-middle font-medium [&:has([role=checkbox])]:pr-0' },
})
export class TableFooterCellDirective {}
