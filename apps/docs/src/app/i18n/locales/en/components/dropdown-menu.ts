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

} as const;
