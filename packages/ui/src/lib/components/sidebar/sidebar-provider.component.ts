import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  input,
  model,
  signal,
} from '@angular/core';
import { SIDEBAR_CONTEXT, SidebarContext, generateSidebarId } from './sidebar-context';
import type { SidebarCollapsible, SidebarState } from './sidebar.type';

@Component({
  selector: 'sanring-sidebar-provider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  providers: [{ provide: SIDEBAR_CONTEXT, useExisting: SidebarProviderComponent }],
})
export class SidebarProviderComponent implements SidebarContext {
  readonly sidebarId: Signal<string> = signal(generateSidebarId());
  readonly open = model(true);
  readonly collapsible = input<SidebarCollapsible>('offcanvas');
  readonly isOpen = computed(() => this.collapsible() === 'none' || this.open());
  readonly state = computed<SidebarState>(() => (this.isOpen() ? 'open' : 'closed'));
  readonly sidebarElement: Signal<HTMLElement | null> = signal(null);

  setOpen(open: boolean): void {
    if (!open && this.collapsible() === 'none') return;
    this.open.set(open);
  }

  toggle(): void {
    if (this.collapsible() === 'none') return;
    this.open.update((open) => !open);
  }
}
