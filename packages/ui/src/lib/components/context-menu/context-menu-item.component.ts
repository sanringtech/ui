import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { cn } from '../../utils';
import { MENU_ITEM_SIZE_CLASS } from '../component-styles';
import { ContextMenuComponent } from './context-menu.component';
import { ContextMenuItemVariant } from './context-menu.type';

@Component({
  selector: 'sanring-context-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'menuitem',
    '[attr.data-variant]': 'variant()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    tabindex: '-1',
    '[class]': 'itemClass()',
    '(click)': 'select()',
    '(keydown.enter)': 'handleKeyActivation($event)',
    '(keydown.space)': 'handleKeyActivation($event)',
  },
})
export class ContextMenuItemComponent {
  private readonly contextMenu = inject(ContextMenuComponent);

  readonly class = input<string | undefined>();
  readonly variant = input<ContextMenuItemVariant>('default');
  readonly value = input.required<unknown>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly itemClass = computed(() =>
    cn(
      'relative flex w-full cursor-default select-none items-center justify-start gap-2 rounded-[var(--sanring-radius-xs)] outline-none',
      MENU_ITEM_SIZE_CLASS,
      'text-[var(--sanring-foreground)] transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus:bg-[var(--sanring-surface-strong)] data-[active=true]:bg-[var(--sanring-surface-strong)]',
      this.variant() === 'destructive' &&
        'text-[var(--sanring-error-50)] hover:bg-[color-mix(in_srgb,var(--sanring-error-50)_10%,transparent)] focus:bg-[color-mix(in_srgb,var(--sanring-error-50)_10%,transparent)] data-[active=true]:bg-[color-mix(in_srgb,var(--sanring-error-50)_10%,transparent)]',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      this.class(),
    ),
  );

  protected select(): void {
    if (this.disabled()) return;
    this.contextMenu.itemSelected.emit(this.value());
    this.contextMenu.close();
  }

  protected handleKeyActivation(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.select();
  }
}
