import { ActiveDescendantKeyManager, Highlightable } from '@angular/cdk/a11y';
import { Injector, Signal, computed } from '@angular/core';

export interface CollectionControllerItem extends Highlightable {
  readonly id: string;
  readonly disabled: boolean;

  isVisible(): boolean;
  select(): void;
}

export class CollectionController<TItem extends CollectionControllerItem> {
  private readonly keyManager: ActiveDescendantKeyManager<TItem>;

  readonly activeItemId = computed(() => this.keyManager.activeItem?.id ?? null);
  readonly visibleCount = computed(() => this.visibleItems().length);

  constructor(
    private readonly items: Signal<readonly TItem[]>,
    injector: Injector,
  ) {
    this.keyManager = new ActiveDescendantKeyManager(this.items, injector)
      .withWrap()
      .withVerticalOrientation()
      .skipPredicate((item) => !item.isVisible() || item.disabled);
  }

  visibleItems(): TItem[] {
    return this.items().filter((item) => item.isVisible());
  }

  focusableItems(): TItem[] {
    return this.visibleItems().filter((item) => !item.disabled);
  }

  ensureActiveItem(): void {
    const focusable = this.focusableItems();
    if (focusable.length === 0) return;
    if (focusable.includes(this.keyManager.activeItem as TItem)) return;

    this.keyManager.setActiveItem(focusable[0]);
  }

  setActiveItem(item: TItem): void {
    this.keyManager.setActiveItem(item);
  }

  selectActiveItem(): void {
    const active = this.keyManager.activeItem;
    if (!active || active.disabled) return;

    active.select();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.selectActiveItem();
      return;
    }

    this.keyManager.onKeydown(event);
  }
}
