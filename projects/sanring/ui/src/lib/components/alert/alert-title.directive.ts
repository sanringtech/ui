import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector: '[sanringAlertTitle]',
  standalone: true,
  host: {
    '[class]': 'alertTitleClass()',
  },
})
export class AlertTitleDirective {
  readonly class = input<string | undefined>();

  protected readonly alertTitleClass = computed(() =>
    cn('mb-1 font-medium leading-none tracking-tight', this.class()),
  );
}
