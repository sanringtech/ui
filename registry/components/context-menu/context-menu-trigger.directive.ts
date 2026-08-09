import { Directive, inject } from '@angular/core';
import { ContextMenuComponent } from './context-menu.component';

@Directive({
  selector: '[sanringContextMenuTrigger]',
  standalone: true,
  host: {
    '(contextmenu)': 'onContextMenu($event)',
    // role="button": aria-haspopup/aria-expanded are only valid ARIA on an
    // element whose role permits them — a bare div (role="generic") doesn't,
    // which axe-core's aria-allowed-attr rule correctly flags. This directive
    // is applied to arbitrary content (the whole point of a right-click
    // zone), so role="button" is the closest fit, not a perfect one.
    role: 'button',
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'contextMenu.isOpen() ? "true" : "false"',
  },
})
export class ContextMenuTriggerDirective {
  protected readonly contextMenu = inject(ContextMenuComponent);

  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenu.openAt(event.clientX, event.clientY);
  }
}
