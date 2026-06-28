// dialog-description.directive.ts
import { Directive, computed, input } from '@angular/core';
import { cn } from '../shared/utils';
import { DESCRIPTION_TEXT_CLASS } from '../shared/component-styles';

let nextDialogDescriptionId = 0;

@Directive({
  selector: '[sanringDialogDescription]',
  standalone: true,
  host: {
    '[id]': 'id()',
    '[class]': 'dialogDescriptionClass()',
  },
})
export class DialogDescriptionDirective {
  readonly id = input(`sanring-dialog-description-${nextDialogDescriptionId++}`);
  readonly class = input<string | undefined>();

  protected readonly dialogDescriptionClass = computed(() =>
    cn(
      DESCRIPTION_TEXT_CLASS,
      this.class(),
    ),
  );
}
