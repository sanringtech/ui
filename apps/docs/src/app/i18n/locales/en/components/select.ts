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
    'The selected value. Supports Angular forms through ControlValueAccessor.',
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
  'select.api.customIndicator.description':
    'Projects a custom selected indicator in place of the default check icon.',
  'select.api.class.description':
    'Additional classes merged with the corresponding select primitive.',

} as const;
