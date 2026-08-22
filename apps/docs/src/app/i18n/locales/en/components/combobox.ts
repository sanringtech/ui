export const comboboxTranslations = {
  'combobox.description': 'Autocomplete input with a list of suggestions.',
  'combobox.examples.basic.description':
    'Use the input, content, list, empty, and item primitives to build a searchable picker.',
  'combobox.usage.description':
    'Import the combobox primitives and bind value with the root model input.',
  'combobox.installation.description':
    'Add the component with the CLI, then import the combobox primitives into the standalone component that renders suggestions.',
  'combobox.composition.description':
    'Combobox keeps the input, popup content, list items, groups, and multi-select chips as separate primitives.',
  'combobox.demo.framework': 'Framework',
  'combobox.demo.frameworks': 'Frameworks',
  'combobox.demo.placeholder': 'Select a framework',
  'combobox.demo.empty': 'No frameworks found.',
  'combobox.demo.selected': 'Selected:',
  'combobox.demo.groups': 'Groups',
  'combobox.demo.searchLibraries': 'Search libraries',
  'combobox.demo.noLibraries': 'No libraries found.',
  'combobox.demo.frontend': 'Frontend',
  'combobox.demo.meta': 'Meta frameworks',
  'combobox.demo.disabled': 'Disabled combobox',
  'combobox.demo.popup': 'Popup',
  'combobox.demo.popupDescription':
    'Trigger the combobox from a button instead of an always-visible input — pair sanringComboboxTrigger with #combo="sanringCombobox" and swap it for the input once open.',
  'combobox.demo.selectCountry': 'Select country',
  'combobox.demo.search': 'Search',
  'combobox.demo.clearButtonTitle': 'Clear Button',
  'combobox.demo.clearButtonDescription':
    'Pass showClear to render a button that resets the value and query.',
  'combobox.demo.field': 'With Field',
  'combobox.demo.fieldError': 'Please choose a framework.',
  'combobox.examples.field.description':
    'Wrap sanring-combobox in sanring-field and bind a reactive form control — the error message shows automatically once the control is invalid and touched.',
  'combobox.api.description': 'Inputs and models supported by the combobox primitives.',
  'combobox.api.value.description':
    'Selected value controlled by the root. Use a string for single select or string array for multiple select.',
  'combobox.api.multiple.description':
    'Allows selecting more than one item and pairing the field with chips.',
  'combobox.api.disabled.description':
    'Disables the combobox input and prevents selection changes.',
  'combobox.api.inputId.description':
    'ID shared by the input or custom trigger and its label. Generated when omitted and overridable for app-level associations.',
  'combobox.api.listId.description':
    'ID of the listbox referenced by aria-controls. Generated when omitted and overridable when integrating external ARIA relationships.',
  'combobox.api.placeholder.description':
    'Placeholder text for the combobox input. Pass this from i18n in app code.',
  'combobox.api.showClear.description':
    'Shows a clear button once a value or query is present. Ignored when the input is nested in a chip-input (multiple mode already offers per-chip removal).',
  'combobox.api.itemValue.description': 'Unique value for a combobox item.',
  'combobox.api.itemLabel.description':
    'Optional text used for filtering when the rendered item content differs from the searchable label.',
  'combobox.api.heading.description': 'Optional label rendered above a combobox group.',
  'combobox.api.trigger.description':
    'Directive for opening the combobox from a custom trigger element, e.g. a button styled like a Select.',
  'combobox.api.class.description':
    'Additional classes merged with the corresponding combobox primitive.',
  'combobox.accessibility.description':
    "The input element has role='combobox', aria-expanded, aria-controls pointing to the list id, and aria-autocomplete='list'. The list container has role='listbox' and each visible item has role='option'. When inside <sanring-field>, aria-required, aria-invalid, and aria-describedby are forwarded automatically.",
  'combobox.keyboard.description':
    'Type in the input to filter; navigate the matching options with arrow keys.',
  'combobox.keyboard.type': 'Filter the option list to matching entries.',
  'combobox.keyboard.navigateList': 'Move focus between matching options, skipping disabled items.',
  'combobox.keyboard.selectItem': 'Select the focused option and close the list.',
  'combobox.keyboard.escape': 'Close the option list without changing the selection.',
  'combobox.stateModel.description':
    'CVA (ControlValueAccessor). Use [(ngModel)] or [formControl] for Angular Forms. The text typed in <sanring-combobox-input> drives filtering — the parent component controls which items are rendered. For multi-select, use <sanring-combobox-chips> to display selected values as removable chips.',
} as const;
