export const cardTranslations = {
  'card.description':
    'A composable surface primitive for forms, metrics, media, lists, and any structured content.',
  'card.demo.form': 'Standard form',
  'card.demo.metric': 'Dashboard metric',
  'card.demo.image': 'With image',
  'card.demo.list': 'Complex list',
  'card.examples.description':
    'Use Card as a flexible container that adapts to the content and business workflow inside it.',
  'card.examples.basic.description':
    'Card is built from small primitives: root, header, title, description, content, and footer.',
  'card.usage.description':
    'Import the Card primitives you need and compose them with native HTML and utility classes.',
  'card.installation.description':
    'Add the component with the CLI, then import CardComponent, CardHeaderComponent, CardContentComponent, CardFooterComponent, CardTitleDirective, and CardDescriptionDirective.',
  'card.composition.description':
    'Card does not own business structure. Override classes, place any media or form controls inside, and combine it with other primitives.',
  'card.api.description': 'Inputs supported by the Card family primitives.',
  'card.api.class.description': 'Additional classes merged with each Card primitive.',
  'card.accessibility.description': 'Card is a layout container with no built-in ARIA role. Use semantic HTML inside — headings (h2–h4 via sanringCardTitle), paragraphs, lists. Add role="article" on the root manually for standalone content cards that need an independent landmark.',
  'card.keyboard.description': 'Not focusable unless interactive children (buttons, links) are present.',
  'card.stateModel.description': 'Stateless layout container. No value, selection, or event state of its own.',
} as const;
