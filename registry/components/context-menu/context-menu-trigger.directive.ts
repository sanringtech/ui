import { Directive, inject } from '@angular/core';
import { ContextMenuComponent } from './context-menu.component';

@Directive({
  selector: '[sanringContextMenuTrigger]',
  standalone: true,
  host: {
    '(contextmenu)': 'onContextMenu($event)',
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
