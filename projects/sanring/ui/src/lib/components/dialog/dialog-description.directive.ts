// dialog-description.directive.ts
import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';

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
      // 縮小字體(text-sm)、使用系統的次要文字顏色
      'text-sm text-[var(--sanring-muted)]',
      this.class(),
    ),
  );
}
