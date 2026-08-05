export const textareaTranslations = {
  'textarea.description':
    'A multiline form control styling directive for native textarea elements.',
  'textarea.examples.basic.description':
    'Apply sanringTextarea to a native textarea to keep browser editing behavior with Sanring UI field styling.',
  'textarea.usage.description': 'Import TextareaDirective and apply sanringTextarea to a textarea.',
  'textarea.installation.description':
    'Use sanringTextarea on native textarea elements and keep value, disabled, rows, and form bindings native.',
  'textarea.demo.disabled': 'Disabled',
  'textarea.demo.resize': 'Resizable',
  'textarea.api.description': 'Inputs supported by the sanringTextarea directive.',
  'textarea.api.class.description': 'Additional classes merged with the base textarea styles.',
  'textarea.accessibility.description': 'A transparent styling directive that preserves native <textarea> semantics. Works with standard HTML attributes — aria-label, aria-labelledby, aria-describedby — applied directly to the textarea element. Pair with sanring-field for automatic label association and validation wiring.',
  'textarea.keyboard.description': 'Focus and all interactions follow native browser behavior.',
  'textarea.keyboard.tab': 'Focus the textarea (unless Tab key is configured to insert a tab character).',
  'textarea.stateModel.description': 'Not a ControlValueAccessor. Bind value with [(ngModel)] or [formControl] directly on the native <textarea> element. The directive only applies visual styling — no internal value state.',
} as const;
