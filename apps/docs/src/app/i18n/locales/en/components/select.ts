export const selectTranslations = {
  'select.description':
    'A composable select primitive for choosing one value from a floating listbox.',
  'select.examples.basic.description':
    'A select trigger that opens a positioned listbox and displays the selected item label.',
  'select.usage.description':
    'Import the select primitives and compose root, trigger, value, content, and item together.',
  'select.installation.description':
    'Add the component with the CLI, then import SANRING_SELECT_IMPORTS for the full select primitive set.',
  'select.examples.description':
    'Common select patterns with grouped options, separators, and disabled items.',
  'select.demo.groups': 'Groups',
  'select.demo.itemAligned': 'Item aligned with trigger',
  'select.demo.disabledItem': 'Disabled item',
  'select.demo.customIcon': 'Custom CircleCheck icon',
  'select.demo.field': 'With Field',
  'select.demo.chooseWorkspace': 'Choose a workspace',
  'select.demo.fieldError': 'Please choose a workspace.',
  'select.examples.field.description':
    'Wrap sanring-select in sanring-field and bind a reactive form control — the error message shows automatically once the control is invalid and touched.',
  'select.api.description': 'Inputs, models, and classes supported by the select primitives.',
  'select.api.value.description':
    'Read-only selected value getter. Bind with ngModel/formControl for value updates.',
  'select.api.id.description':
    'ID applied to the trigger and used by Field focus integration. Generated automatically unless provided.',
  'select.api.contentId.description':
    'Generated id applied to the listbox and referenced by aria-controls while open.',
  'select.api.isOpen.description': 'Controls whether the floating listbox is open.',
  'select.api.contentPosition.description':
    "Controls content positioning: 'popper' aligns to the trigger edge, while 'item-aligned' aligns the selected item with the trigger.",
  'select.api.matchTriggerWidth.description':
    'Matches the floating content width to the trigger width so option label length does not change the popup size.',
  'select.api.itemValue.description': 'The value emitted when this option is selected.',
  'select.api.itemDisabled.description': 'Disables a single option.',
  'select.api.indicatorPosition.description':
    'Places the selected indicator before or after the item text.',
  'select.api.showIndicator.description': 'Controls whether the selected indicator is rendered.',
  'select.api.placeholder.description':
    'Text shown by sanring-select-value when no value is selected.',
  'select.api.customIndicator.description':
    'Projects a custom selected indicator in place of the default check icon.',
  'select.api.class.description':
    'Additional classes merged with the corresponding select primitive.',
  'select.api.triggerAriaLabel.description':
    'Accessible name for the trigger. The trigger has role="combobox", so — unlike a plain button — its visible text/placeholder does not count as a name; set this or triggerAriaLabelledBy.',
  'select.api.triggerAriaLabelledBy.description':
    'References the id of an element (e.g. an external <label>) that labels the trigger, as an alternative to ariaLabel.',
  'select.accessibility.description':
    "The trigger button has role='combobox', aria-haspopup='listbox', aria-expanded, and aria-controls pointing to the listbox id. Each option has role='option', aria-selected, and aria-disabled. When inside <sanring-field>, aria-required, aria-invalid, and aria-describedby (hint/error ids) are forwarded automatically.",
  'select.keyboard.description': 'Keyboard shortcuts work on the trigger and within the open list.',
  'select.keyboard.openTrigger': 'Open the dropdown list (when the trigger button is focused).',
  'select.keyboard.navigateList': 'Move focus between options, skipping disabled items (wraps).',
  'select.keyboard.selectItem': 'Select the focused option and close the list.',
  'select.keyboard.escape': 'Close the list without changing the selection.',
  'select.stateModel.description':
    'CVA (ControlValueAccessor). Use [(ngModel)], [formControl], or [formControlName] for Angular Forms integration. The value getter reflects the current selection (read-only — write through forms). Place <sanring-select> inside <sanring-field> to wire label, hint, and error display automatically.',
} as const;
