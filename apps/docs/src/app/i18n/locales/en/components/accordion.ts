export const accordionTranslations = {
  'accordion.description':
    'A vertically stacked set of interactive headings that each reveal a section of content.',
  'accordion.tabs.radix': 'Radix UI',
  'accordion.tabs.base': 'Base UI',
  'accordion.tabs.label': 'Accordion variants',
  'accordion.demo.shipping.question': 'What are your shipping options?',
  'accordion.demo.shipping.answer':
    'We ship domestically and internationally with tracked delivery.',
  'accordion.demo.returns.question': 'What is your return policy?',
  'accordion.demo.returns.answer':
    'Returns are accepted within 30 days for unused items in original packaging.',
  'accordion.demo.support.question': 'How can I contact customer support?',
  'accordion.demo.support.answer':
    'Contact support through the dashboard or email us during business hours.',
  'accordion.demo.single': 'Single item',
  'accordion.demo.multiple': 'Multiple items',
  'accordion.demo.defaultOpen': 'Default open',
  'accordion.demo.underline': 'Underline trigger',
  'accordion.demo.controlled': 'Controlled',
  'accordion.demo.openAll': 'Open all',
  'accordion.demo.closeAll': 'Close all',
  'accordion.examples.description':
    'Common accordion states for single selection, multi selection, default open content, and programmatic controls.',
  'accordion.examples.basic.description':
    'By default, only one accordion item remains open at a time.',
  'accordion.usage.description':
    'Import the accordion primitives and compose root, item, trigger, and content together.',
  'accordion.installation.description':
    'Add the component with the CLI, then compose the accordion primitives in your template.',
  'accordion.composition.description':
    'The component is split into root, item, trigger, and content primitives so each part remains reusable.',
  'accordion.api.description': 'Inputs and outputs supported by the accordion primitives.',
  'accordion.api.multi.description':
    'Allows multiple accordion items to stay open at the same time.',
  'accordion.api.expanded.description': 'Controls whether an accordion item is open.',
  'accordion.api.disabled.description': 'Disables interaction for an accordion item.',
  'accordion.api.variant.description':
    'Sets the trigger visual variant. The default uses a hover background; underline uses text underline.',
  'accordion.api.headerClass.description': 'Additional classes for the trigger header button.',
  'accordion.api.contentClass.description': 'Additional classes for the content body.',
  'accordion.api.openAll.description': 'Opens all enabled items when multi is enabled.',
  'accordion.api.closeAll.description': 'Closes all enabled items in the accordion.',
  'accordion.api.opened.description': 'Emits when an accordion item opens.',
  'accordion.api.closed.description': 'Emits when an accordion item closes.',
  'accordion.api.expandedChange.description': 'Emits when the expanded state changes.',
  'accordion.accessibility.description': "WAI-ARIA Accordion pattern via @angular/aria/accordion. Each trigger receives role='button', aria-expanded, and aria-controls linking to its content panel. The content panel has a matching id and aria-labelledby pointing back to its trigger.",
  'accordion.keyboard.description': 'Full keyboard navigation across all triggers.',
  'accordion.keyboard.enterSpace': 'Toggle the focused accordion item open or closed.',
  'accordion.keyboard.arrowDown': 'Move focus to the next accordion trigger.',
  'accordion.keyboard.arrowUp': 'Move focus to the previous accordion trigger.',
  'accordion.keyboard.homeEnd': 'Move focus to the first / last accordion trigger.',
  'accordion.stateModel.description': 'Not CVA. Each sanring-accordion-item tracks its own expanded state via expanded / expandedChange. Enable multi on the group to allow multiple open items simultaneously. The openAll() and closeAll() methods on the group provide programmatic control.',
} as const;
