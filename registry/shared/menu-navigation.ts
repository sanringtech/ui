// Context menu items use real DOM focus with a roving tabindex rather than the
// aria-activedescendant model combobox/command use via CollectionController. Exactly one enabled
// item in each menu is a tab stop; arrow navigation moves that tab stop with focus.
// Shared between ContextMenuContentComponent and ContextMenuSubContentComponent, whose menu
// items are otherwise different component classes (item/checkbox-item/radio-item/sub-trigger)
// with no common base to query via Angular's typed contentChildren().
const ENABLED_MENU_ITEM_SELECTOR = '[role^="menuitem"]:not([aria-disabled="true"])';
const DOCUMENT_TAB_STOP_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function menuItems(container: HTMLElement, selector: string): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (item) => item.closest('[role="menu"]') === container,
  );
}

function enabledMenuItems(container: HTMLElement): HTMLElement[] {
  return menuItems(container, ENABLED_MENU_ITEM_SELECTOR);
}

function setMenuItemTabStop(container: HTMLElement, activeItem: HTMLElement): void {
  // Include disabled items here so an item that became disabled after previously owning the
  // roving tab stop is reset to -1 as soon as the menu is initialized/navigated again.
  for (const item of menuItems(container, '[role^="menuitem"]')) {
    item.tabIndex = item === activeItem ? 0 : -1;
  }
}

/** Ensures a menu has exactly one enabled tab stop without moving focus. */
export function initializeMenuTabStop(container: HTMLElement): void {
  const items = enabledMenuItems(container);
  if (items.length === 0) return;
  const existing = items.find((item) => item.tabIndex === 0);
  setMenuItemTabStop(container, existing ?? items[0]);
}

/** Keeps pointer/programmatic focus in sync with the menu's roving tab stop. */
export function syncFocusedMenuItemTabStop(
  container: HTMLElement,
  target: EventTarget | null,
): void {
  if (!(target instanceof HTMLElement)) return;
  if (!target.matches(ENABLED_MENU_ITEM_SELECTOR)) return;
  if (target.closest('[role="menu"]') !== container) return;
  setMenuItemTabStop(container, target);
}

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
  const items = enabledMenuItems(container);
  if (items.length === 0) return;

  const currentIndex = items.indexOf(document.activeElement as HTMLElement);
  const nextIndex =
    currentIndex === -1
      ? delta === 1
        ? 0
        : items.length - 1
      : (currentIndex + delta + items.length) % items.length;

  const nextItem = items[nextIndex];
  setMenuItemTabStop(container, nextItem);
  nextItem.focus();
}

/** Moves focus to the document tab stop immediately before or after `reference`. */
export function focusAdjacentDocumentTabStop(reference: HTMLElement, delta: 1 | -1): boolean {
  const candidates = Array.from(
    reference.ownerDocument.querySelectorAll<HTMLElement>(DOCUMENT_TAB_STOP_SELECTOR),
  ).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.closest('[hidden], [inert], [aria-hidden="true"], [role="menu"]'),
  );
  const referenceIndex = candidates.indexOf(reference);
  const target = referenceIndex === -1 ? undefined : candidates[referenceIndex + delta];

  if (!target) {
    reference.blur();
    return false;
  }

  target.focus();
  return true;
}
