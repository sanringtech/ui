import { Component, Input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-dialog-header',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'dialogHeaderClass',
  },
})
export class DialogHeader {
  @Input() class = '';

  protected get dialogHeaderClass() {
    return cn(
      // 垂直排列、預設置中 (手機版常見)、桌機版靠左對齊
      'flex flex-col space-y-1.5 text-center sm:text-left',
      this.class,
    );
  }
}
