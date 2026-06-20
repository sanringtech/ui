import { Component, Input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-card-footer',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'cardFooterClass',
  },
})
export class CardFooter {
  @Input() class = '';

  protected get cardFooterClass() {
    return cn('flex items-center p-6 pt-0', this.class);
  }
}
