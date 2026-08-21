export const transferTranslations = {
  'transfer.description':
    'A dual-list control for moving items between two panels, with per-item selection and disabling.',
  'transfer.examples.basic.description':
    'A basic transfer between two panels: check items on either side, then move them across with the arrow buttons.',
  'transfer.usage.description':
    'Import SANRING_TRANSFER_IMPORTS, bind items to the full dataset, and bind selectedKeys to track which items currently sit in the target panel. Compose a source panel, an action area, and a target panel between the transfer tags — sanring-transfer-list renders the items for whichever panel it is nested in.',
  'transfer.installation.description':
    'Add the component with the CLI, then import SANRING_TRANSFER_IMPORTS for the full primitive set.',
  'transfer.composition.description':
    'sanring-transfer holds the shared items and selectedKeys state; each sanring-transfer-panel reads the slice of items for its direction (source or target) and sanring-transfer-list renders a sanring-transfer-item per entry. Place buttons marked with [sanringTransferAction] between the panels to move the checked items.',
  'transfer.examples.description':
    'Common transfer patterns: disabled items, a live item count in the header, custom action buttons, one-way transfers, per-panel search, and pagination.',
  'transfer.demo.available': 'Available',
  'transfer.demo.selected': 'Selected',
  'transfer.demo.moveToTarget': 'Move to selected',
  'transfer.demo.moveToSource': 'Move to available',
  'transfer.demo.disabled': 'Disabled items',
  'transfer.demo.headerCount': 'Header with live count',
  'transfer.demo.customActions': 'Custom action buttons',
  'transfer.demo.oneWay': 'One-way transfer',
  'transfer.demo.search': 'With a search box',
  'transfer.demo.pagination': 'Pagination',
  'transfer.demo.add': 'Add',
  'transfer.demo.remove': 'Remove',
  'transfer.demo.searchPlaceholder': 'Search...',
  'transfer.demo.clearSearch': 'Clear search',
  'transfer.demo.previousPage': 'Previous',
  'transfer.demo.nextPage': 'Next',
  'transfer.demo.selectAll': 'Header with select all',
  'transfer.api.description':
    'Inputs supported by the transfer primitives and the shape of a transfer item.',
  'transfer.api.items.description':
    'The full dataset shared by both panels. Items whose key is in selectedKeys render in the target panel; the rest render in the source panel.',
  'transfer.api.selectedKeys.description':
    'The keys currently in the target panel. Supports two-way binding with [(selectedKeys)] so the parent can read or seed the result.',
  'transfer.api.direction.description':
    "Which slice of items this panel renders: 'source' for items not yet selected, 'target' for items that have been moved over. Required.",
  'transfer.api.panelClass.description': 'Additional classes merged onto the panel container.',
  'transfer.api.headerClass.description': 'Additional classes merged onto the panel header.',
  'transfer.api.isShow.description':
    'When true, renders a built-in "checked/total" count badge at the trailing edge of the header.',
  'transfer.api.actionClass.description':
    'Additional classes merged onto the [sanringTransferAction] container, typically placed between the two panels.',
  'transfer.api.itemKey.description':
    'Unique identifier for the item, used to track selection and panel placement.',
  'transfer.api.itemLabel.description': 'Text rendered for the item.',
  'transfer.api.itemDisabled.description': 'Prevents the item from being checked or moved.',
  'transfer.api.mode.description':
    "Set to 'one-way' to make the target panel read-only: its items can no longer be checked or moved back to the source panel.",
  'transfer.api.pageSize.description':
    'Number of items to show per page. Leave unset to disable pagination and render every item at once.',
  'transfer.api.setQuery.description':
    "Filters this panel's items by label (case-insensitive substring match) and resets it back to the first page.",
  'transfer.api.pageState.description':
    "The panel's current page (0-indexed) and the total number of pages given its pageSize and current filter.",
  'transfer.api.pageNav.description':
    'Move to the next/previous page. No-ops past either end of the range.',
  'transfer.api.interactive.description':
    'False for a target panel in one-way mode; used internally to disable its checkboxes.',
  'transfer.api.selectableItems.description':
    'Non-disabled items across the full filtered list (not limited to the current page). Useful for displaying a count in the header.',
  'transfer.api.selectAllChecked.description':
    "The checkbox state for a select-all control: true when every selectable item is checked, 'indeterminate' when some are, false when none are.",
  'transfer.api.selectAllMethods.description':
    'Select all / deselect all / toggle all non-disabled items in the panel. selectAll and deselectAll are no-ops when interactive() is false.',
  'transfer.accessibility.description':
    'Each item exposes checkbox semantics with its label, checked state, and disabled state. A panel uses one roving tab stop so long lists do not flood the page tab order. Panel headings should describe the available and selected lists, and transfer buttons need aria-labels.',
  'transfer.keyboard.description':
    'Transfer items use roving focus alongside the action buttons, search inputs, and optional pagination controls.',
  'transfer.keyboard.tabShiftTab':
    'Moves between each panel, its actions, search fields, and pagination controls.',
  'transfer.keyboard.arrowKeys': 'Moves focus to the previous or next enabled item in a panel.',
  'transfer.keyboard.homeEnd': 'Moves focus to the first or last enabled item in a panel.',
  'transfer.keyboard.space': 'Toggles the focused item or select-all checkbox.',
  'transfer.keyboard.enterSpace': 'Activates the focused transfer action or pagination control.',
  'transfer.keyboard.type': 'Filters the active panel when focus is inside a search input.',
  'transfer.stateModel.description':
    'selectedKeys is the primary cross-panel state and supports [(selectedKeys)]. Each panel also keeps temporary checked keys, query, and page state; moveToTarget/moveToSource commits checked keys into selectedKeys.',
} as const;
