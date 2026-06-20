// dialog-description.directive.ts
import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector: '[sanringDialogDescription]',
  standalone: true,
  host: {
    '[class]': 'dialogDescriptionClass',
  },
})
export class DialogDescriptionDirective {
  @Input() class = '';

  protected get dialogDescriptionClass() {
    return cn(
      // 縮小字體(text-sm)、使用系統的次要文字顏色
      'text-sm text-[var(--docs-muted)]',
      this.class,
    );
  }
}
