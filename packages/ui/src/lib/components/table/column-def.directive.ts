import { Directive } from '@angular/core';
import { CdkColumnDef } from '@angular/cdk/table';

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
export class TableColumnDefDirective {}
