import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector: 'p[sanringCardDescription], div[sanringCardDescription]',
  standalone: true,
  host: {
    '[class]': 'cardDescriptionClass',
  },
})
export class CardDescriptionDirective {
  @Input() class = '';

  protected get cardDescriptionClass() {
    return cn(this.class);
  }
}
