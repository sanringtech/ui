import {
  Component,
  ElementRef,
  Injector,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { cn, uniqueId } from '../../utils';
import { CollectionController } from '../shared/collection-controller';
import { ComboboxItemComponent } from './combobox-item.component';

@Component({
  selector: 'sanring-combobox',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[class]': 'hostClass()',
  },
})
export class ComboboxComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly inputId = uniqueId('sanring-combobox-input');
  readonly listId = uniqueId('sanring-combobox-list');

  // ==========================================
  // 1. 外部屬性與 Models
  // ==========================================
  readonly class = input<string | undefined>();
  readonly disabled = input<boolean>(false);
  readonly multiple = input<boolean>(false);
  readonly value = model<string | string[] | null>(null);

  // ==========================================
  // 2. 內部 UI 狀態 (Signals)
  // ==========================================
  readonly isOpen = signal<boolean>(false);
  readonly searchQuery = signal<string>('');

  private readonly items = contentChildren(ComboboxItemComponent, { descendants: true });
  private readonly collection = new CollectionController(this.items, this.injector);

  readonly activeItemId = this.collection.activeItemId;
  readonly visibleCount = this.collection.visibleCount;

  protected readonly hostClass = computed(() =>
    cn(
      'relative inline-block w-full',
      this.disabled() && 'opacity-50 cursor-not-allowed',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      this.searchQuery();
      const visible = this.collection.focusableItems();
      untracked(() => {
        if (visible.length > 0) this.collection.ensureActiveItem();
      });
    });
  }

  toggleOpen(state?: boolean) {
    if (this.disabled()) return;
    const newState = state ?? !this.isOpen();
    this.isOpen.set(newState);

    if (!newState) {
      this.searchQuery.set('');
    }
  }

  containsElement(target: EventTarget | null): boolean {
    return target instanceof Node && this.elementRef.nativeElement.contains(target);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  setActiveItem(item: ComboboxItemComponent): void {
    this.collection.setActiveItem(item);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.toggleOpen(true);
      this.collection.onKeydown(event);
      return;
    }

    if (event.key === 'Enter') {
      this.collection.onKeydown(event);
    }
  }

  selectValue(newValue: string) {
    if (this.multiple()) {
      const currentValues = (this.value() as string[]) || [];
      if (currentValues.includes(newValue)) {
        this.value.set(currentValues.filter((v) => v !== newValue));
      } else {
        this.value.set([...currentValues, newValue]);
      }
    } else {
      this.value.set(newValue);
      this.toggleOpen(false);
    }
  }

  removeValue(valueToRemove: string) {
    if (!this.multiple()) return;
    const currentValues = (this.value() as string[]) || [];
    this.value.set(currentValues.filter((v) => v !== valueToRemove));
  }

  isSelected(val: string): boolean {
    const current = this.value();
    if (this.multiple()) {
      return Array.isArray(current) && current.includes(val);
    }
    return current === val;
  }
}
