export const contextMenuTranslations = {
  'contextMenu.description':
    'A menu triggered by right-clicking a target area, positioned at the pointer.',
  'contextMenu.examples.basic.description':
    'A basic action menu with shortcuts, a separator, and a destructive item.',
  'contextMenu.usage.description':
    'Import the context menu primitives, mark the trigger area with sanringContextMenuTrigger, and place sanring-context-menu-content as a sibling — it opens at the cursor position on right-click. SANRING_CONTEXT_MENU_IMPORTS is a convenience import for the full set; import individual primitives when you want the component dependencies to stay explicit.',
  'contextMenu.installation.description':
    'Add the component with the CLI, then import SANRING_CONTEXT_MENU_IMPORTS for the full primitive set, or import individual primitives when you need finer control.',
  'contextMenu.composition.description':
    'sanring-context-menu-content opens at the pointer; nest sanring-context-menu-sub with its own sub-trigger/sub-content for a submenu, and use the label, separator, checkbox item, and radio group/item to build out the menu body.',
  'contextMenu.examples.description':
    'Common context menu patterns: checkable options, radio-style selection, and nested submenus.',
  'contextMenu.demo.checkbox': 'Checkbox',
  'contextMenu.demo.radio': 'Radio',
  'contextMenu.demo.submenu': 'Submenu',
  'contextMenu.api.description':
    'Inputs, outputs, and classes supported by the context menu primitives.',
  'contextMenu.api.itemSelected.description':
    "Emits the value of whichever item was activated (click, Enter, or Space), right before the whole menu — including any open submenu — closes. Declared on sanring-context-menu (the root), so it fires no matter how deep the selected item is nested.",
  'contextMenu.api.value.description':
    'The value reported to itemSelected when this item is activated. Required.',
  'contextMenu.api.disabled.description':
    'Disables the item and removes it from keyboard and click activation.',
  'contextMenu.api.variant.description':
    'Controls item tone. Use destructive for actions that remove data or have serious consequences.',
  'contextMenu.api.checked.description':
    "The checkbox item's checked state. Supports two-way binding with [(checked)].",
  'contextMenu.api.radioValue.description':
    "The radio group's currently selected value. Supports two-way binding with [(value)].",
  'contextMenu.api.class.description':
    'Additional classes merged with the corresponding context menu primitive.',

} as const;
