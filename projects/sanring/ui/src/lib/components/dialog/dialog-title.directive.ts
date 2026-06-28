// dialog-title.directive.ts
import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';
import { TITLE_TEXT_CLASS } from '../component-styles';

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
      TITLE_TEXT_CLASS,
      this.class(),
    ),
  );
}
