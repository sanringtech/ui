import { Highlightable } from '@angular/cdk/a11y';
import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { LucideCheck } from '@lucide/angular';
import { cn } from '../../utils';
import {
  COLLECTION_ITEM_ACTIVE_CLASS,
  COLLECTION_ITEM_CLASS,
  COLLECTION_ITEM_DISABLED_CLASS,
} from '../component-styles';
import { isCollectionItemVisible } from '../shared/collection-state';
import { ComboboxComponent } from './combobox.component';

let nextItemId = 0;

@Component({
  selector: 'sanring-combobox-item',
  standalone: true,
  imports: [LucideCheck],
  template: `
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      @if (isSelected()) {
        <svg lucideCheck class="h-4 w-4"></svg>
      }
    </span>

    <ng-content></ng-content>
  `,
  host: {
    role: 'option',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-disabled]': 'disabled || null',
    '[attr.data-disabled]': 'disabled ? "true" : null',
    '[attr.data-state]': 'isSelected() ? "checked" : "unchecked"',
    '[id]': 'id',
    '[class]': 'itemClass()',
    '[style.display]': 'isMatch() ? "" : "none"',
    '(click)': 'onSelect()',
    '(mouseenter)': 'onMouseEnter()',
  },
})
export class ComboboxItemComponent implements Highlightable {
  readonly value = input.required<string>();
  readonly label = input<string>();
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly class = input<string | undefined>();

  readonly id = `sanring-combobox-item-${nextItemId++}`;

  protected combobox = inject(ComboboxComponent);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly active = signal(false);

  protected readonly isSelected = computed(() => this.combobox.isSelected(this.value()));

  protected readonly isMatch = computed(() => {
    return isCollectionItemVisible(this.getLabel(), this.combobox.searchQuery());
  });

  get disabled(): boolean {
    return this.disabledInput();
  }

  protected readonly itemClass = computed(() =>
    cn(
      COLLECTION_ITEM_CLASS,
      'w-full py-1.5 pl-8 pr-2',
      this.active() && COLLECTION_ITEM_ACTIVE_CLASS,
      !this.disabled && 'hover:bg-[var(--sanring-surface)] hover:text-[var(--sanring-foreground)]',
      this.disabled && COLLECTION_ITEM_DISABLED_CLASS,
      this.class(),
    ),
  );

  setActiveStyles(): void {
    this.active.set(true);
  }

  setInactiveStyles(): void {
    this.active.set(false);
  }

  getLabel(): string {
    return this.label() ?? this.el.nativeElement.textContent?.trim() ?? this.value();
  }

  select(): void {
    if (this.disabled) return;
    this.combobox.selectValue(this.value());
  }

  onSelect(): void {
    this.select();
  }

  onMouseEnter(): void {
    if (this.disabled) return;
    this.combobox.setActiveItem(this);
  }
}
