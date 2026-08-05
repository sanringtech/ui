export const dropdownMenuTranslations = {
  'dropdownMenu.description': 'A floating menu for contextual actions opened from a trigger.',
  'dropdownMenu.examples.basic.description':
    'A basic action menu with a label, separator, and destructive item.',
  'dropdownMenu.usage.description':
    'Import ButtonDirective and the dropdown menu primitives first, then expose the content with a template variable (#menu="sanringDropdownMenuContent") and pass it to the trigger\'s [menu]. SANRING_DROPDOWN_MENU_IMPORTS is a convenience import for the full set; import individual primitives when you want the component dependencies to stay explicit.',
  'dropdownMenu.installation.description':
    'Add the component with the CLI, then import SANRING_DROPDOWN_MENU_IMPORTS for the full primitive set, or import individual primitives when you need finer control.',
  'dropdownMenu.examples.description':
    'Common dropdown menu patterns inspired by menubar examples: checkable options, radio-style selection, nested choices, and icon items.',
  'dropdownMenu.demo.checkbox': 'Checkbox',
  'dropdownMenu.demo.radio': 'Radio',
  'dropdownMenu.demo.submenu': 'Submenu',
  'dropdownMenu.demo.withIcons': 'With Icons',
  'dropdownMenu.api.description':
    'Inputs, outputs, and classes supported by the dropdown menu primitives.',
  'dropdownMenu.api.menu.description':
    'The menu to open, bound to the content\'s exported reference (#ref="sanringDropdownMenuContent", then [menu]="ref.menu"). Selecting any item closes the menu automatically.',
  'dropdownMenu.api.itemSelected.description':
    'Emits the value of whichever item was activated (click, Enter, or Space), right before the menu closes.',
  'dropdownMenu.api.id.description':
    'ID forwarded to the underlying @angular/aria menu content.',
  'dropdownMenu.api.wrap.description':
    'Whether keyboard navigation wraps from the last enabled item back to the first.',
  'dropdownMenu.api.typeaheadDelay.description':
    'Delay, in milliseconds, used by @angular/aria menu typeahead before resetting the typed search buffer.',
  'dropdownMenu.api.value.description':
    'The value reported to itemSelected when this item is activated. Required by the underlying ARIA menu pattern.',
  'dropdownMenu.api.disabled.description':
    'Disables a menu item and removes it from keyboard activation.',
  'dropdownMenu.api.variant.description':
    'Controls item tone. Use destructive for actions that remove data or have serious consequences.',
  'dropdownMenu.api.class.description':
    'Additional classes merged with the corresponding dropdown menu primitive.',
  'dropdownMenu.accessibility.description':
    "Built on @angular/aria/menu. The panel has role='menu'; each item has role='menuitem', role='menuitemcheckbox', or role='menuitemradio' as appropriate. The trigger button has aria-haspopup='menu' and aria-expanded managed by the underlying MenuTrigger directive.",
  'dropdownMenu.keyboard.description': 'Keyboard navigation follows the WAI-ARIA menu pattern.',
  'dropdownMenu.keyboard.openTrigger': 'Open the menu (from trigger) or activate the focused item.',
  'dropdownMenu.keyboard.navigateItems': 'Navigate between menu items (wrap is configurable).',
  'dropdownMenu.keyboard.escape': 'Close the menu or active submenu and return focus to the trigger.',
  'dropdownMenu.keyboard.openSubmenu': 'Open the focused submenu.',
  'dropdownMenu.keyboard.closeSubmenu': 'Close the active submenu.',
  'dropdownMenu.stateModel.description':
    "Stateless. DropdownMenuItemDirective emits (itemSelected) on activation. DropdownMenuCheckboxItemComponent and DropdownMenuRadioGroupComponent manage their own checked/selected state via the checked input and checkedChange output. Open/closed state is managed internally by @angular/aria/menu.",
} as const;
