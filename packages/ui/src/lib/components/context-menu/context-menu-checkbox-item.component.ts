import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
} from '@angular/core';
import { LucideCheck } from '@lucide/angular';
import { cn } from '../../utils';
import { MENU_ITEM_SIZE_CLASS } from '../component-styles';

@Component({
  selector: 'sanring-context-menu-checkbox-item',
  standalone: true,
  imports: [LucideCheck],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menuitemcheckbox',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    tabindex: '-1',
    '[class]': 'itemClass()',
    '(click)': 'toggle()',
    '(keydown.enter)': 'handleKeyActivation($event)',
    '(keydown.space)': 'handleKeyActivation($event)',
  },
  template: `
    <span class="flex size-4 shrink-0 items-center justify-center text-current">
      @if (checked()) {
        <svg lucideCheck class="size-4 animate-in zoom-in-50" strokeWidth="3"></svg>
      }
    </span>
    <ng-content></ng-content>
  `,
})
export class ContextMenuCheckboxItemComponent {
  readonly class = input<string | undefined>();
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly itemClass = computed(() =>
    cn(
      'relative flex w-full cursor-default select-none items-center justify-start gap-2 rounded-[var(--sanring-radius-xs)] outline-none',
      MENU_ITEM_SIZE_CLASS,
      'text-[var(--sanring-foreground)] transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus:bg-[var(--sanring-surface-strong)] data-[active=true]:bg-[var(--sanring-surface-strong)]',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      this.class(),
    ),
  );

  protected toggle(): void {
    if (this.disabled()) return;
    this.checked.update((value) => !value);
  }

  protected handleKeyActivation(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.toggle();
  }
}
