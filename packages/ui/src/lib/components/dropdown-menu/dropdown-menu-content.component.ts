import { Component, computed, input } from '@angular/core';
import { cn } from '../../utils';
import { OVERLAY_SURFACE_CLASS } from '../component-styles';

@Component({
  selector: 'sanring-dropdown-menu-content',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'menu',
    '[class]': 'contentClass()',
    '[attr.data-state]': 'state()',
  },
})
export class DropdownMenuContentComponent {
  readonly class = input<string | undefined>();
  readonly state = input<'open' | 'closed'>('open');

  protected readonly contentClass = computed(() =>
    cn(
      OVERLAY_SURFACE_CLASS,
      'z-50 block min-w-32 overflow-hidden rounded-[var(--sanring-radius-sm)] p-1 outline-none',
      this.state() === 'closed' ? 'animate-popover-out' : 'animate-popover-in',
      this.class(),
    ),
  );
}
