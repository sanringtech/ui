export const skeletonTranslations = {
  'skeleton.description':
    'A loading placeholder primitive for content that is still being fetched or prepared.',
  'skeleton.demo.avatar': 'Avatar',
  'skeleton.demo.card': 'Card',
  'skeleton.demo.text': 'Text',
  'skeleton.demo.form': 'Form',
  'skeleton.demo.table': 'Table',
  'skeleton.examples.description':
    'Common skeleton layouts for avatars, cards, text blocks, forms, and tables.',
  'skeleton.examples.basic.description':
    'Use skeletons to reserve space for content before the final UI is ready.',
  'skeleton.usage.description':
    'Import SkeletonDirective and apply sanringSkeleton to any element.',
  'skeleton.installation.description':
    'Use the directive on div, span, or semantic elements and provide width, height, and radius classes.',
  'skeleton.composition.description':
    'Compose multiple skeleton blocks to mirror the structure of the loading content.',
  'skeleton.api.description': 'Inputs supported by the sanringSkeleton directive.',
  'skeleton.api.class.description': 'Additional classes merged with the base skeleton styles.',
  'skeleton.accessibility.description':
    "Skeleton elements carry no semantic meaning and are invisible to screen readers. On the loading container, add aria-busy='true' and aria-live='polite' so screen readers announce when real content is ready.",
  'skeleton.keyboard.description': 'Not focusable. No keyboard interaction.',
  'skeleton.stateModel.description':
    'Stateless visual placeholder. Render with @if(!loaded) and swap to real content when data arrives. No internal loading or progress state.',
} as const;
