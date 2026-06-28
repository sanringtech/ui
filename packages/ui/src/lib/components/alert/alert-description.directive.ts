import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';
import { ALERT_DESCRIPTION_TEXT_CLASS } from '../component-styles';

@Directive({
  selector: '[sanringAlertDescription]',
  standalone: true,
  host: {
    '[class]': 'alertDescriptionClass()',
  },
})
export class AlertDescriptionDirective {
  readonly class = input<string | undefined>();

  protected readonly alertDescriptionClass = computed(() =>
    cn(ALERT_DESCRIPTION_TEXT_CLASS, this.class()),
  );
}
