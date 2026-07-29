export const checkboxTranslations = {
  'checkbox.description':
    'A control for toggling a boolean or indeterminate state, compatible with Angular forms via ControlValueAccessor.',
  'checkbox.demo.indeterminate': 'Indeterminate',
  'checkbox.demo.disabled': 'Disabled',
  'checkbox.demo.stateSurface': 'State Surface',
  'checkbox.demo.unchecked': 'Unchecked',
  'checkbox.demo.checked': 'Checked',
  'checkbox.demo.disabledUnchecked': 'Disabled unchecked',
  'checkbox.demo.disabledChecked': 'Disabled checked',
  'checkbox.demo.disabledIndeterminate': 'Disabled indeterminate',
  'checkbox.demo.withLabel': 'With Label',
  'checkbox.demo.acceptTerms': 'Accept terms and conditions',
  'checkbox.examples.description':
    'Common checkbox patterns including indeterminate, label-linked, and disabled states.',
  'checkbox.examples.basic.description':
    'A checkbox backed by ControlValueAccessor — use ngModel or reactive forms to bind the checked state.',
  'checkbox.usage.description':
    'Import CheckboxComponent and bind state via ngModel or a reactive form control.',
  'checkbox.api.description': 'Inputs supported by the sanring-checkbox component.',
  'checkbox.api.class.description': 'Additional classes merged with the checkbox button styles.',
  'checkbox.api.id.description':
    'Native id applied to the checkbox button, useful for label association.',
  'checkbox.api.name.description':
    'Native name attribute forwarded to the button for form submission.',
  'checkbox.api.value.description':
    'Native value attribute forwarded to the button for form submission.',
  'checkbox.api.disabled.description': 'Disables interaction and reduces visual prominence.',
  'checkbox.api.required.description':
    'Sets aria-required on the button to signal a mandatory field.',
  'checkbox.api.checked.description':
    'Controlled checked state. Supports true, false, or "indeterminate". Use with [(checked)] for two-way binding without Angular forms.',
  'checkbox.api.checkedChange.description':
    'Emits the new CheckedState whenever the checkbox is toggled.',
  'checkbox.api.tabIndex.description': 'Tab order index. Automatically set to -1 when disabled.',
  'checkbox.api.ariaLabel.description':
    'Accessible label for standalone checkboxes not associated with a visible <label> element.',
  'checkbox.api.ariaLabelledBy.description': 'ID of an external element that labels this checkbox.',
  'checkbox.api.ariaDescribedBy.description':
    'ID of an element that provides an extended description for this checkbox.',
  'checkbox.api.size.description':
    "Visual size of the checkbox. Accepts 'sm', 'md' (default), or 'lg'.",
  'checkbox.demo.size': 'Size Variants',
  'checkbox.demo.size.sm': 'Small',
  'checkbox.demo.size.md': 'Medium',
  'checkbox.demo.size.lg': 'Large',
  'checkbox.demo.eventBinding': 'Event Binding',
  'checkbox.demo.field': 'With Field',
  'checkbox.demo.fieldError': 'You must accept the terms to continue.',
  'checkbox.examples.field.description':
    'Wrap sanring-checkbox in sanring-field and bind a reactive form control — the error message shows automatically once the control is invalid and touched.',

} as const;
