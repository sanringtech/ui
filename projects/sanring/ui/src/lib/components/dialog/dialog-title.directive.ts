// dialog-title.directive.ts
import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';

let nextDialogTitleId = 0;

@Directive({
  selector: '[sanringDialogTitle]',
  standalone: true,
  host: {
    '[id]': 'id',
    '[class]': 'dialogTitleClass',
  },
})
export class DialogTitleDirective {
  @Input() id = `sanring-dialog-title-${nextDialogTitleId++}`;
  @Input() class = '';

  protected get dialogTitleClass() {
    return cn(
      // 放大字體(text-lg)、半粗體(font-semibold)、緊湊行高與字距
      'text-lg font-semibold leading-none tracking-tight',
      this.class,
    );
  }
}
