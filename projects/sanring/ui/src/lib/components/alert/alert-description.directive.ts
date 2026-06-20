import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector: '[sanringAlertDescription]',
  standalone: true,
  host: {
    '[class]': 'alertDescriptionClass',
  },
})
export class AlertDescription {
  @Input() class = '';

  protected get alertDescriptionClass() {
    return cn('text-sm [&_p]:leading-relaxed opacity-90', this.class);
  }
}
