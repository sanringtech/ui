export const alertTranslations = {
  'alert.description':
    'A persistent inline message for important state, warnings, and guidance inside the document flow.',
  'alert.demo.banner': 'Global banner',
  'alert.demo.destructive': 'Destructive warning',
  'alert.demo.empty': 'Empty state',
  'alert.examples.description':
    'Use Alert for persistent information that should remain visible until the underlying state changes.',
  'alert.examples.basic.description':
    'Alert reserves space in the layout and combines an icon, title, and description.',
  'alert.usage.description': 'Import Alert primitives and compose them with native text and icons.',
  'alert.installation.description':
    'Add the component with the CLI, then import AlertComponent, AlertTitleDirective, and AlertDescriptionDirective.',
  'alert.composition.description':
    'Alert is a static layout primitive. Use it for state-driven messages, not transient toast notifications.',
  'alert.api.description': 'Inputs supported by the sanring-alert component.',
  'alert.api.class.description': 'Additional classes merged with the base alert styles.',
  'alert.api.variant.description':
    'Controls the visual tone. Available variants are default and destructive.',
  'alert.accessibility.description': "role='alert' on the host, which carries an implicit aria-live='assertive'. Screen readers announce the content immediately when the element is inserted into the DOM. For non-urgent messages, wrap or replace with role='status' (aria-live='polite').",
  'alert.keyboard.description': 'Not focusable unless interactive children (e.g., a dismiss button) are present.',
  'alert.stateModel.description': 'Stateless — insert or remove <sanring-alert> with @if to trigger or clear the live-region announcement. Content is driven by ng-content.',
} as const;
