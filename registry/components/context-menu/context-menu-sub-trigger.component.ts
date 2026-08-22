import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { LucideChevronRight } from '@lucide/angular';
import { cn } from '../shared/utils';
import { MENU_ITEM_SIZE_CLASS } from '../shared/component-styles';
import { ContextMenuSubComponent } from './context-menu-sub.component';

@Component({
  selector: 'sanring-context-menu-sub-trigger',
  standalone: true,
  imports: [LucideChevronRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menuitem',
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'sub.isOpen() ? "true" : "false"',
    '[attr.data-state]': 'sub.isOpen() ? "open" : "closed"',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    tabindex: '-1',
    '[class]': 'itemClass()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'sub.scheduleClose()',
    '(click)': 'onOpen()',
    '(keydown.arrowright)': 'onOpenKey($event)',
    '(keydown.enter)': 'onOpenKey($event)',
    '(keydown.space)': 'onOpenKey($event)',
  },
  template: `
    <ng-content></ng-content>
    <svg lucideChevronRight class="ml-auto size-4 shrink-0"></svg>
  `,
})
export class ContextMenuSubTriggerComponent {
  protected readonly sub = inject(ContextMenuSubComponent);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly class = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly itemClass = computed(() =>
    cn(
      'relative flex w-full cursor-default select-none items-center justify-start gap-2 rounded-[var(--sanring-radius-xs)] outline-none',
      MENU_ITEM_SIZE_CLASS,
      'text-[var(--sanring-foreground)] transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus:bg-[var(--sanring-surface-strong)] data-[state=open]:bg-[var(--sanring-surface-strong)]',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      this.class(),
    ),
  );

  constructor() {
    this.sub.registerTrigger(this.elementRef);
  }

  protected onMouseEnter(): void {
    if (this.disabled()) return;
    this.sub.open();
  }

  protected onOpen(): void {
    if (this.disabled()) return;
    this.sub.open();
  }

  protected onOpenKey(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.sub.open({ focusFirstItem: true });
  }
}
