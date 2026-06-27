import { Directive, inject } from '@angular/core';
import { SheetComponent } from './sheet.component';

@Directive({
  selector: '[sanringSheetTrigger]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
    'aria-haspopup': 'dialog',
    '[attr.aria-expanded]': 'sheet.isOpen()',
  },
})
export class SheetTriggerDirective {
  protected readonly sheet = inject(SheetComponent);

  protected onClick(): void {
    this.sheet.setOpen(true);
  }
}
