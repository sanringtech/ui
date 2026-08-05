export const aspectRatioTranslations = {
  'aspectRatio.description':
    'A layout directive that keeps media, embeds, and preview frames locked to a consistent aspect ratio.',
  'aspectRatio.examples.basic.description':
    'Use sanringAspectRatio on any container and pass the desired CSS aspect-ratio value.',
  'aspectRatio.usage.description':
    'Import AspectRatioDirective, then apply sanringAspectRatio to the element that should own the frame.',
  'aspectRatio.installation.description':
    'Add the component with the CLI, then import AspectRatioDirective into the standalone component that renders the media frame.',
  'aspectRatio.demo.media': 'Media frame',
  'aspectRatio.demo.square': 'Square thumbnail',
  'aspectRatio.demo.card': 'Card media',
  'aspectRatio.demo.cardTitle': 'Stable media frame',
  'aspectRatio.demo.cardBody': 'Content below stays put while media loads.',
  'aspectRatio.api.description': 'sanringAspectRatio directive inputs.',
  'aspectRatio.api.ratio.description':
    'Aspect ratio value applied to the host element. Accepts CSS ratio strings such as 16 / 9 or numbers such as 1.777.',
  'aspectRatio.api.class.description':
    'Additional classes merged with the base relative w-full container styles.',
  'aspectRatio.accessibility.description':
    'Adds no ARIA of its own and preserves the semantics of the projected content. Images, iframes, and video still need alt text, titles, or captions based on the content.',
  'aspectRatio.stateModel.description':
    'Stateless. sanringAspectRatio only applies ratio styles to the host element; it does not store loading, selection, or interaction state.',
} as const;
