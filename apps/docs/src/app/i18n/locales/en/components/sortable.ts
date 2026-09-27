export const sortableTranslations = {
  'sortable.description':
    'A single-list reorder primitive. Pointer drag uses Angular CDK; keyboard arrows move the focused item. Cards and other content compose through the item directive.',
  'sortable.demo.handle': 'Drag handle',
  'sortable.demo.horizontal': 'Horizontal',
  'sortable.demo.alpha': 'Inbox digest',
  'sortable.demo.alphaDescription': 'Summarize unread threads each morning.',
  'sortable.demo.beta': 'Release checklist',
  'sortable.demo.betaDescription': 'Gate publish on review and smoke tests.',
  'sortable.demo.gamma': 'Weekly report',
  'sortable.demo.gammaDescription': 'Ship a compact status note on Fridays.',
  'sortable.demo.reorder': 'Reorder',
  'sortable.installation.description':
    'Add the component with the CLI, then import the list, item, and optional handle directives.',
  'sortable.usage.description':
    'Bind the same array to data and @for. On sorted, replace the array so Angular can reconcile the new order.',
  'sortable.composition.description':
    'The list owns order. Items are any host element. An optional handle limits pointer dragging to that control.',
  'sortable.api.description': 'Inputs, outputs, and directives for a single sortable list.',
  'sortable.api.class.description': 'Additional classes merged with the list host.',
  'sortable.api.data.description':
    'Required array to reorder in place. sorted emits a shallow copy after each move.',
  'sortable.api.orientation.description':
    'Layout and lock axis for pointer dragging. vertical uses Arrow Up/Down; horizontal uses Arrow Left/Right.',
  'sortable.api.disabled.description': 'Disables pointer and keyboard reordering for the whole list.',
  'sortable.api.sorted.description': 'Emits a new array after a successful reorder.',
  'sortable.api.itemDisabled.description': 'Disables one item without locking the rest of the list.',
  'sortable.api.handle.description':
    'Optional drag handle. When present, pointer dragging starts from the handle instead of the whole item.',
  'sortable.accessibility.description':
    'The list uses role=list and items use role=listitem. Disabled items leave the tab order. Prefer a named handle button when the item is a dense card.',
  'sortable.keyboard.description': 'Focus an item, then move it with arrows. Tab walks the list.',
  'sortable.keyboard.arrowsVertical':
    'Moves the focused item up or down in a vertical list.',
  'sortable.keyboard.arrowsHorizontal':
    'Moves the focused item left or right in a horizontal list.',
  'sortable.keyboard.tabShiftTab': 'Moves focus between sortable items in document order.',
  'sortable.stateModel.description':
    'data is the source of order. Reorder mutates that array and emits sorted with a copy. disabled on the list or an item blocks moves without clearing data.',
} as const;
