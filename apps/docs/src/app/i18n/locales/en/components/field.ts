export const fieldTranslations = {
  'field.description':
    'Form composition primitives — sanring-field wraps a label, control, description, and error message with the layout, ARIA wiring, and Angular Forms validation state they share.',
  'field.demo.floating': 'Floating label',
  'field.demo.validation': 'Validation state',
  'field.demo.disabled': 'Disabled',
  'field.examples.description':
    'Common Field patterns for floating labels, validation state, and disabled controls.',
  'field.examples.basic.description':
    "Wrap a label, control, and description in sanring-field — the label's for attribute and the control's aria-describedby are wired up automatically.",
  'field.usage.description':
    'Import SanringFieldComponent and the pieces you need, then compose them inside <sanring-field>.',
  'field.installation.description':
    'sanring add field, or it installs automatically whenever a control that depends on it — like Input — is added.',
  'field.composition.description':
    'Field only lays out and wires up its children — it never renders a control itself. Project a label, one control that implements SanringFieldControl (InputDirective today), an optional description, and an optional error message.',
  'field.api.description': 'Inputs supported by sanring-field and the directives it composes with.',
  'field.api.floating.description':
    'Floats the label above the control instead of stacking it on top.',
  'field.api.labelClass.description': "Additional classes merged with the label's base styles.",
  'field.api.descriptionClass.description':
    "Additional classes merged with the description's base styles.",
  'field.api.errorMessageClass.description':
    "Additional classes merged with the error message's base styles.",
} as const;
