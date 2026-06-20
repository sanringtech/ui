import { Component, Input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-card-content',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'cardContentClass',
  },
})
export class CardContent {
  @Input() class = '';

  protected get cardContentClass() {
    return cn('block p-6 pt-0', this.class);
  }
}
