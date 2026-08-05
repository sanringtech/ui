import { Directive, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { SIDEBAR_CONTEXT } from './sidebar-context';

@Directive({
  selector: 'button[sanringSidebarRail]',
  standalone: true,
  host: {
    type: 'button',
    '[class]': 'railClass()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-controls]': 'ctx.sidebarId()',
    '[attr.aria-expanded]': 'ctx.isOpen() ? "true" : "false"',
    '[attr.data-state]': 'ctx.state()',
    '[attr.data-collapsible]': 'ctx.collapsible()',
    '(click)': 'ctx.toggle()',
  },
})
export class SidebarRailDirective {
  protected readonly ctx = inject(SIDEBAR_CONTEXT);

  readonly class = input<string | undefined>();
  readonly ariaLabel = input('Toggle sidebar');

  protected readonly railClass = computed(() =>
    cn(
      'absolute inset-y-0 right-[-5px] z-10 hidden w-2 rounded-full opacity-0 transition-[background-color,opacity]',
      'hover:bg-[var(--sanring-border)] hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)] sm:block',
      this.ctx.isOpen() ? 'cursor-w-resize' : 'cursor-e-resize',
      this.class(),
    ),
  );
}
