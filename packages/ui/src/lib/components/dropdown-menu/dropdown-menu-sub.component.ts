import { ChangeDetectionStrategy, Component, ElementRef, signal } from '@angular/core';

@Component({
  selector: 'sanring-dropdown-menu-sub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class DropdownMenuSubComponent {
  private readonly _triggerRef = signal<ElementRef<HTMLElement> | null>(null);
  readonly triggerRef = this._triggerRef.asReadonly();

  registerTrigger(ref: ElementRef<HTMLElement>): void {
    this._triggerRef.set(ref);
  }
}
