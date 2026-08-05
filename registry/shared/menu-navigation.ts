// Context menu items use real per-item DOM focus/tabindex (role="menuitem*" + tabindex="0"/"-1",
// same pattern select uses) rather than the aria-activedescendant model combobox/command use via
// CollectionController — so plain DOM traversal is enough here, no key-manager class needed.
// Shared between ContextMenuContentComponent and ContextMenuSubContentComponent, whose menu
// items are otherwise different component classes (item/checkbox-item/radio-item/sub-trigger)
// with no common base to query via Angular's typed contentChildren().
const FOCUSABLE_MENU_ITEM_SELECTOR = '[tabindex="0"][role^="menuitem"]';

/**
 * Moves focus to the next/previous focusable menu item within `container`, wrapping around at
 * either end. If nothing inside `container` is currently focused, lands on the first item
 * (delta > 0) or last item (delta < 0).
 */
export function focusAdjacentMenuItem(container: HTMLElement, delta: 1 | -1): void {
  // A closed submenu's <sanring-context-menu-sub-content> stays in the DOM (just hidden via
  // CSS) until it's actually opened and portaled out, so a plain descendant query would also
  // pick up its (currently invisible) items. Scope to items whose nearest role="menu" ancestor
  // is this container itself — items belonging to a nested (open or closed) submenu have the
  // submenu's own role="menu" host as their nearest ancestor instead.
  const items = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_MENU_ITEM_SELECTOR),
  ).filter((item) => item.closest('[role="menu"]') === container);
  if (items.length === 0) return;

  const currentIndex = items.indexOf(document.activeElement as HTMLElement);
  const nextIndex =
    currentIndex === -1 ? (delta === 1 ? 0 : items.length - 1) : (currentIndex + delta + items.length) % items.length;

  items[nextIndex].focus();
}
