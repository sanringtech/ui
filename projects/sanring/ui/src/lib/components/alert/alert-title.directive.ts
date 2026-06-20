import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector: '[sanringAlertTitle]',
  standalone: true,
  host: {
    '[class]': 'alertTitleClass',
  },
})
export class AlertTitle {
  @Input() class = '';

  protected get alertTitleClass() {
    return cn('mb-1 font-medium leading-none tracking-tight', this.class);
  }
}
