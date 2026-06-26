// dialog-title.directive.ts
import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';

let nextDialogTitleId = 0;

@Directive({
  selector: '[sanringDialogTitle]',
  standalone: true,
  host: {
    '[id]': 'id()',
    '[class]': 'dialogTitleClass()',
  },
})
export class DialogTitleDirective {
  readonly id = input(`sanring-dialog-title-${nextDialogTitleId++}`);
  readonly class = input<string | undefined>();

  protected readonly dialogTitleClass = computed(() =>
    cn(
      // 放大字體(text-lg)、半粗體(font-semibold)、緊湊行高與字距
      'text-lg font-semibold leading-none tracking-tight',
      this.class(),
    ),
  );
}
