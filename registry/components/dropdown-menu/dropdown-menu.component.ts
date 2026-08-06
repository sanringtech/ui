import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-dropdown-menu',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class DropdownMenuComponent {}
