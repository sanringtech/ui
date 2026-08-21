import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { LucideCircle } from '@lucide/angular';
import { cn } from '../shared/utils';
import { MENU_ITEM_SIZE_CLASS, RADIO_INDICATOR_ICON_CLASS } from '../shared/component-styles';
import { ContextMenuRadioGroupComponent } from './context-menu-radio-group.component';

const RADIO_ITEM_INDICATOR_ICON_CLASS = cn(RADIO_INDICATOR_ICON_CLASS, 'animate-in zoom-in-50');

@Component({
  selector: 'sanring-context-menu-radio-item',
  standalone: true,
  imports: [LucideCircle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menuitemradio',
    '[attr.aria-checked]': 'isChecked()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-state]': 'isChecked() ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    tabindex: '-1',
    '[class]': 'itemClass()',
    '(click)': 'select()',
    '(keydown.enter)': 'handleKeyActivation($event)',
    '(keydown.space)': 'handleKeyActivation($event)',
  },
  template: `
    <span class="flex size-4 shrink-0 items-center justify-center text-current">
      @if (isChecked()) {
        <svg lucideCircle [class]="indicatorIconClass"></svg>
      }
    </span>
    <ng-content></ng-content>
  `,
})
export class ContextMenuRadioItemComponent {
  protected readonly indicatorIconClass = RADIO_ITEM_INDICATOR_ICON_CLASS;

  private readonly group = inject(ContextMenuRadioGroupComponent);

  readonly class = input<string | undefined>();
  readonly value = input.required<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isChecked = computed(() => this.group.value() === this.value());

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

  protected select(): void {
    if (this.disabled()) return;
    this.group.value.set(this.value());
  }

  protected handleKeyActivation(event: Event): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.select();
  }
}
