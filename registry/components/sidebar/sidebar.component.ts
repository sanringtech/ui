import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Signal,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { cn } from '../shared/utils';
import { SIDEBAR_CONTEXT, SidebarContext, generateSidebarId } from './sidebar-context';
import type { SidebarCollapsible, SidebarState } from './sidebar.type';

@Component({
  selector: 'sanring-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  providers: [{ provide: SIDEBAR_CONTEXT, useExisting: SidebarComponent }],
  host: {
    '[id]': 'sidebarId()',
    '[class]': 'hostClass()',
    '[attr.data-open]': 'isOpen() ? "" : null',
    '[attr.data-state]': 'state()',
    '[attr.data-collapsible]': 'collapsible()',
  },
})
export class SidebarComponent implements SidebarContext {
  readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly parentCtx = inject(SIDEBAR_CONTEXT, { optional: true, skipSelf: true });

  readonly id = input(generateSidebarId());
  readonly class = input<string | undefined>();
  readonly open = model(true);

  readonly _collapsible = input<SidebarCollapsible>('offcanvas', { alias: 'collapsible' });

  // SidebarContext implementation — effective values accounting for parent provider
  readonly sidebarId = computed(() => this.parentCtx?.sidebarId() ?? this.id());
  readonly sidebarElement = computed<HTMLElement | null>(() => this.elementRef.nativeElement);
  readonly collapsible = computed<SidebarCollapsible>(
    () => this.parentCtx?.collapsible() ?? this._collapsible(),
  );
  readonly isOpen = computed(() =>
    this.collapsible() === 'none' || (this.parentCtx ? this.parentCtx.isOpen() : this.open()),
  );
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
    if (this.parentCtx) {
      this.parentCtx.setOpen(open);
      return;
    }
    if (!open && this.collapsible() === 'none') return;
    this.open.set(open);
  }

  toggle(): void {
    if (this.parentCtx) {
      this.parentCtx.toggle();
      return;
    }
    if (this.collapsible() === 'none') return;
    this.open.update((open) => !open);
  }
}
