import { Directive } from '@angular/core';
import { CdkNoDataRow } from '@angular/cdk/table';

@Directive({
  // 💡 因為它是帶有星號（*）的結構型指令，編譯後本質是 ng-template
  selector: 'ng-template[sanringNoDataRow]',
  standalone: true,
  // 🧠 悄悄吞下 CDK 的查無資料核心邏輯！
  hostDirectives: [CdkNoDataRow],
})
export class TableNoDataRowDirective {}
