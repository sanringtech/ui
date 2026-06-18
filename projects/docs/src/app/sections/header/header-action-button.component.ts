import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button, ButtonSize } from '@sanring/ui';

@Component({
  selector: 'app-header-action-button',
  imports: [Button],
  template: `
    <sanring-button
      class="flex-none"
      type="button"
      variant="outline"
      [size]="size"
      [ariaLabel]="ariaLabel"
      (click)="clicked.emit()"
    >
      <ng-content />
    </sanring-button>
  `,
})
export class HeaderActionButtonComponent {
  @Input({ required: true }) ariaLabel = '';
  @Input() size: ButtonSize = 'toolbarIcon';

  @Output() clicked = new EventEmitter<void>();
}
