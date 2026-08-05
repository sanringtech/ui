import { Directive, ElementRef, computed, inject } from '@angular/core';
import { SIDEBAR_CONTEXT } from './sidebar-context';

@Directive({
  selector: '[sanringSidebarTrigger]',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'ctx.isOpen() ? "true" : "false"',
    '[attr.aria-controls]': 'controlsId()',
    '[attr.data-state]': 'ctx.state()',
    '[attr.data-collapsible]': 'ctx.collapsible()',
    '(click)': 'onClick($event)',
  },
})
export class SidebarTriggerDirective {
  protected readonly ctx = inject(SIDEBAR_CONTEXT);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly isSelfTrigger = computed(
    () =>
      this.ctx.sidebarElement() !== null &&
      this.hostElement.nativeElement === this.ctx.sidebarElement(),
  );

  protected readonly controlsId = computed(() =>
    this.isSelfTrigger() ? null : this.ctx.sidebarId(),
  );

  protected onClick(event: MouseEvent): void {
    if (this.isSelfTrigger() && event.target !== event.currentTarget) return;

    this.ctx.toggle();
  }
}
