import { Directive, computed, input } from '@angular/core';
import { cn } from '../shared/utils';
import { ALERT_TITLE_TEXT_CLASS } from '../shared/component-styles';

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
    cn(ALERT_TITLE_TEXT_CLASS, this.class()),
  );
}
