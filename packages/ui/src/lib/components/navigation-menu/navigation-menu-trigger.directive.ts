import { Directive, booleanAttribute, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { NavigationMenuItemComponent } from './navigation-menu-item.component';

@Directive({
  selector: 'button[sanringNavigationMenuTrigger]',
  standalone: true,
  host: {
    type: 'button',
    'aria-haspopup': 'true',
    '[attr.aria-expanded]': 'item.isOpen() ? "true" : "false"',
    '[attr.aria-controls]': 'item.contentId()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.data-state]': 'item.isOpen() ? "open" : "closed"',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[disabled]': 'isDisabled()',
    '[class]': 'triggerClass()',
    '(click)': 'toggle()',
    '(keydown.arrowdown)': 'openFromKeyboard($event)',
    '(keydown.arrowup)': 'openFromKeyboard($event)',
    '(keydown.escape)': 'closeFromKeyboard($event)',
  },
})
export class NavigationMenuTriggerDirective {
  protected readonly item = inject(NavigationMenuItemComponent);

  readonly class = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isDisabled = computed(() => this.disabled() || this.item.disabled());

  protected readonly triggerClass = computed(() =>
    cn(
      'inline-flex h-10 max-w-full items-center justify-center gap-2 rounded-[var(--sanring-radius)] px-3 py-2',
      'text-sm font-medium text-[var(--sanring-foreground)] outline-none transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus-visible:bg-[var(--sanring-surface-strong)]',
      'focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      'data-[state=open]:bg-[var(--sanring-active)] data-[state=open]:text-[var(--sanring-foreground)]',
      'disabled:pointer-events-none disabled:opacity-50',
      this.class(),
    ),
  );

  protected toggle() {
    if (this.isDisabled()) return;
    this.item.toggle();
  }

  protected openFromKeyboard(event: Event) {
    if (this.isDisabled()) return;
    event.preventDefault();
    this.item.open();
  }

  protected closeFromKeyboard(event: Event) {
    if (this.isDisabled()) return;
    event.preventDefault();
    this.item.close();
  }
}
