// dialog-title.directive.ts
import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector: '[sanringDialogTitle]',
  standalone: true,
  host: {
    '[class]': 'dialogTitleClass',
  },
})
export class DialogTitle {
  @Input() class = '';

  protected get dialogTitleClass() {
    return cn(
      // 放大字體(text-lg)、半粗體(font-semibold)、緊湊行高與字距
      'text-lg font-semibold leading-none tracking-tight',
      this.class,
    );
  }
}
