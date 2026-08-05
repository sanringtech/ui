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
import { NavigationMenuSubComponent } from './navigation-menu-sub.component';

@Component({
  selector: 'sanring-navigation-menu-sub-trigger',
  standalone: true,
  imports: [LucideChevronRight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menuitem',
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'sub.open() ? "true" : "false"',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-state]': 'sub.open() ? "open" : "closed"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.tabindex]': 'disabled() ? "-1" : "0"',
    '[class]': 'triggerClass()',
    '(mouseenter)': 'openFromPointer()',
    '(mouseleave)': 'sub.scheduleClose()',
    '(click)': 'toggle()',
    '(keydown.arrowright)': 'openFromKeyboard($event)',
    '(keydown.enter)': 'openFromKeyboard($event)',
    '(keydown.space)': 'openFromKeyboard($event)',
  },
  template: `
    <ng-content></ng-content>
    <svg lucideChevronRight class="ml-auto size-4 shrink-0 opacity-70"></svg>
  `,
})
export class NavigationMenuSubTriggerComponent {
  protected readonly sub = inject(NavigationMenuSubComponent);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly class = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly triggerClass = computed(() =>
    cn(
      'relative flex w-full cursor-default select-none items-center justify-start gap-2 rounded-[var(--sanring-radius)] px-3 py-2 text-sm outline-none',
      'text-[var(--sanring-foreground)] transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus:bg-[var(--sanring-surface-strong)] data-[state=open]:bg-[var(--sanring-surface-strong)]',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      this.class(),
    ),
  );

  constructor() {
    this.sub.registerTrigger(this.elementRef);
  }

  protected openFromPointer(): void {
    if (this.disabled()) return;
    this.sub.show();
  }

  protected toggle(): void {
    if (this.disabled()) return;
    this.sub.toggle();
  }

  protected openFromKeyboard(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.sub.show();
  }
}
