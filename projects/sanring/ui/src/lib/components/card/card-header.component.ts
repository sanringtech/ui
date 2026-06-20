import { Component, Input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-card-header',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'cardHeaderClass',
  },
})
export class CardHeaderComponent {
  @Input() class = '';

  protected get cardHeaderClass() {
    return cn('flex flex-col space-y-1.5 p-6', this.class);
  }
}
