export const navigationMenuTranslations = {
  'navigationMenu.description':
    'A horizontal or vertical collection of links, with triggers that open a content panel for grouped navigation.',
  'navigationMenu.examples.basic.description':
    'A horizontal top-nav bar with three trigger-opened panels: a rich Product mega-menu, a plain Resources list, and a Docs list with descriptions.',
  'navigationMenu.usage.description':
    'Wrap sanring-navigation-menu-list in sanring-navigation-menu, then give each item either a trigger + content pair or a bare sanringNavigationMenuLink for a direct link.',
  'navigationMenu.installation.description':
    'Add the component with the CLI, then import SANRING_NAVIGATION_MENU_IMPORTS for the full primitive set, or import individual primitives when you need finer control.',
  'navigationMenu.demo.viewport': 'Shared viewport',
  'navigationMenu.demo.submenu': 'Submenu',
  'navigationMenu.demo.vertical': 'Vertical',
  'navigationMenu.examples.viewport.description':
    'One shared panel — same size, centered under the trigger group — instead of a differently sized panel per trigger (see Basic).',
  'navigationMenu.examples.submenu.description':
    'A second-level flyout inside a content panel. Submenu content uses CDK overlay positioning with viewport collision fallback.',
  'navigationMenu.examples.vertical.description':
    'A vertical navigation group for app-shell side rails and secondary navigation.',
  'navigationMenu.api.description':
    'Inputs, outputs, and classes supported by the navigation menu primitives.',
  'navigationMenu.api.orientation.description':
    'Layout direction. Vertical stretches items to full width instead of centering a horizontal row.',
  'navigationMenu.api.value.description':
    "The open item's value, or null when closed. Two-way bindable with [(value)] — useful for driving a shared sanring-navigation-menu-viewport from the parent template.",
  'navigationMenu.api.delayDuration.description':
    'Reserved for a future hover-intent delay. Triggers currently open on click or Enter/Space/ArrowDown/ArrowUp, not on hover.',
  'navigationMenu.api.skipDelayDuration.description':
    'Reserved for a future hover-intent delay when moving directly between triggers. Not currently consumed.',
  'navigationMenu.api.ariaLabel.description':
    'Accessible name for the root navigation landmark (aria-label / aria-labelledby).',
  'navigationMenu.api.itemValue.description':
    'Identifies the item so the root value can reference it. Defaults to an auto-generated id, so it only needs to be set when you bind [(value)] yourself.',
  'navigationMenu.api.itemDisabled.description':
    'Disables the item: its trigger stops responding to click, keyboard, and toggle().',
  'navigationMenu.api.contentId.description':
    "Id applied to the content panel and referenced by the trigger's aria-controls. Defaults to an auto-generated id.",
  'navigationMenu.api.subOpen.description':
    'Controls whether the submenu flyout is open. The trigger opens it on hover, click, Enter, Space, or ArrowRight.',
  'navigationMenu.api.subTriggerDisabled.description':
    'Disables the submenu trigger and removes it from keyboard navigation.',
  'navigationMenu.api.linkActive.description':
    'Marks the link as the current page — sets aria-current="page" and the data-active style hook.',
  'navigationMenu.api.linkDisabled.description':
    'Disables the link: it stops responding to clicks and is removed from tab order.',
  'navigationMenu.api.linkTarget.description':
    'Standard anchor target. target="_blank" automatically adds rel="noopener noreferrer".',
  'navigationMenu.api.separatorVertical.description':
    'Renders the separator as a vertical rule instead of a horizontal one.',
  'navigationMenu.api.class.description':
    'Additional classes merged with the corresponding navigation menu primitive.',
  'navigationMenu.accessibility.description':
    'The root has role="navigation". The list has role="list" and each item role="listitem". Triggers carry aria-haspopup, aria-expanded, and aria-controls pointing at their content panel, which has role="region". Submenus use role="menu"/"menuitem" and CDK overlay positioning with collision fallback. Active links get aria-current="page". Clicking anywhere outside the root closes the open panel; a click inside a submenu flyout does not, since it still belongs to the menu system. Navigation menus do not trap focus.',
  'navigationMenu.keyboard.description':
    'Trigger keyboard support follows the WAI-ARIA disclosure pattern.',
  'navigationMenu.keyboard.toggle': 'Toggle the focused trigger’s content panel.',
  'navigationMenu.keyboard.open': 'Open the focused trigger’s content panel.',
  'navigationMenu.keyboard.subOpen': 'Open the focused submenu trigger.',
  'navigationMenu.keyboard.subClose':
    'Close the focused submenu and return focus to its submenu trigger.',
  'navigationMenu.keyboard.close': 'Close the open content panel and keep focus on the trigger.',
  'navigationMenu.stateModel.description':
    'Single source of truth: NavigationMenuComponent.value holds the open item’s value, or null. Each NavigationMenuItemComponent computes isOpen by comparing its own value against the root’s value, so only one item is open at a time. A document-level click listener on the root sets value back to null whenever the click lands outside the whole component (submenu flyouts excluded, since they render into the CDK overlay layer). Submenu open state is local to NavigationMenuSubComponent because nested flyouts are scoped to their parent panel. Hover-intent delayDuration/skipDelayDuration is still reserved for top-level triggers; submenu hover uses a small close grace period. Typeahead is not implemented yet.',
} as const;
