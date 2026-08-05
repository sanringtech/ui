export const inputTranslations = {
  'input.description': 'A form control styling directive for native input and file fields.',
  'input.demo.floating': 'Floating label',
  'input.demo.disabled': 'Disabled',
  'input.demo.file': 'File',
  'input.demo.validation': 'Validation state',
  'input.examples.description':
    'Common input patterns for editable text, disabled fields, and file uploads.',
  'input.examples.basic.description':
    'Apply sanringInput to a native input to keep browser behavior while receiving system styling.',
  'input.usage.description': 'Import InputDirective and apply sanringInput to an input.',
  'input.installation.description':
    'Use sanringInput on native input elements and keep type, value, disabled, and form bindings native.',
  'input.composition.description':
    'Pair Input with Label for accessible forms, or combine it with Card and Alert in larger workflows.',
  'input.api.description': 'Inputs supported by the sanringInput directive.',
  'input.api.class.description': 'Additional classes merged with the base input styles.',
  'input.accessibility.description': 'A transparent styling directive that preserves native <input> semantics. Works with standard HTML attributes — aria-label, aria-labelledby, aria-describedby — applied directly to the input. Pair with sanring-field for automatic for/id label association.',
  'input.keyboard.description': 'Focus and all interactions follow native browser behavior.',
  'input.keyboard.tab': 'Focus the input.',
  'input.keyboard.type': 'Type to enter or edit text.',
  'input.stateModel.description': 'Not a ControlValueAccessor. Bind value with [(ngModel)] or [formControl] directly on the native <input> element. The directive only applies visual styling — no internal value state.',
} as const;
