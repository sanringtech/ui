import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { cn } from '../../utils';
import type { SidebarCollapsible, SidebarState } from './sidebar.type';

let nextSidebarId = 0;

@Component({
  selector: 'sanring-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[id]': 'id()',
    '[class]': 'hostClass()',
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.data-state]': 'state()',
    '[attr.data-collapsible]': 'collapsible()',
  },
})
export class SidebarComponent {
  readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly id = input(`sanring-sidebar-${nextSidebarId++}`);
  readonly class = input<string | undefined>();
  readonly collapsible = input<SidebarCollapsible>('offcanvas');
  readonly open = model(true);

  readonly isOpen = computed(() => this.collapsible() === 'none' || this.open());
  readonly state = computed<SidebarState>(() => (this.isOpen() ? 'open' : 'closed'));

  protected readonly hostClass = computed(() =>
    cn(
      'flex h-full min-w-0 flex-col overflow-hidden border-r border-[var(--sanring-border)] bg-[var(--sanring-background)]',
      'relative',
      'transition-[width,border-color] duration-200 ease-out',
      this.isOpen() && 'w-64',
      !this.isOpen() && this.collapsible() === 'icon' && 'w-14',
      !this.isOpen() && this.collapsible() === 'offcanvas' && 'w-0 border-r-0',
      this.class(),
    ),
  );

  setOpen(open: boolean): void {
    if (!open && this.collapsible() === 'none') return;

    this.open.set(open);
  }

  toggle(): void {
    if (this.collapsible() === 'none') return;

    this.open.update((open) => !open);
  }
}
