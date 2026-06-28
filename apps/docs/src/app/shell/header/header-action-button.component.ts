import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonDirective, ButtonSize } from '@sanring/ui';

@Component({
  selector: 'app-header-action-button',
  imports: [ButtonDirective],
  template: `
    <button
      sanringBtn
      class="flex-none"
      type="button"
      variant="outline"
      [size]="size"
      [attr.aria-label]="ariaLabel"
      (click)="clicked.emit()"
    >
      <ng-content />
    </button>
  `,
})
export class HeaderActionButtonComponent {
  @Input({ required: true }) ariaLabel = '';
  @Input() size: ButtonSize = 'toolbarIcon';

  @Output() clicked = new EventEmitter<void>();
}
