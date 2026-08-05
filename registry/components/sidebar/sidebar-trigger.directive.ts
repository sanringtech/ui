import { computed, Directive, ElementRef, inject } from '@angular/core';
import { SidebarComponent } from './sidebar.component';

@Directive({
  selector: '[sanringSidebarTrigger]',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'sidebar.isOpen() ? "true" : "false"',
    '[attr.aria-controls]': 'controlsId()',
    '[attr.data-state]': 'sidebar.state()',
    '[attr.data-collapsible]': 'sidebar.collapsible()',
    '(click)': 'onClick($event)',
  },
})
export class SidebarTriggerDirective {
  protected readonly sidebar = inject(SidebarComponent);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly isSelfTrigger = computed(
    () => this.hostElement.nativeElement === this.sidebar.elementRef.nativeElement,
  );

  protected readonly controlsId = computed(() => (this.isSelfTrigger() ? null : this.sidebar.id()));

  protected onClick(event: MouseEvent): void {
    if (this.isSelfTrigger() && event.target !== event.currentTarget) return;

    this.sidebar.toggle();
  }
}
