export const badgeTranslations = {
  'badge.description': 'A compact label for status, counts, metadata, and inline categories.',
  'badge.demo.default': 'Default',
  'badge.demo.secondary': 'Secondary',
  'badge.demo.outline': 'Outline',
  'badge.demo.ghost': 'Ghost',
  'badge.demo.destructive': 'Destructive',
  'badge.demo.variants': 'Variants',
  'badge.demo.link': 'Link badge',
  'badge.demo.withIcon': 'With icon',
  'badge.demo.running': 'Running',
  'badge.demo.verified': 'Verified',
  'badge.demo.synced': 'Synced',
  'badge.examples.description': 'Common badge variants for metadata and status labels.',
  'badge.examples.basic.description':
    'Use badges as compact inline labels on text, cards, lists, or links.',
  'badge.usage.description': 'Import BadgeDirective and apply sanringBadge to an element.',
  'badge.installation.description':
    'Import Badge and choose a variant that matches the metadata priority.',
  'badge.composition.description':
    'Badge is a directive, so it keeps native span, div, or anchor behavior while applying consistent styling.',
  'badge.api.description': 'Inputs supported by the sanringBadge directive.',
  'badge.api.class.description': 'Additional classes merged with the base badge styles.',
  'badge.api.variant.description':
    'Controls visual emphasis: default, secondary, destructive, outline, or ghost.',
  'badge.accessibility.description': 'Rendered as an inline <span> with no added ARIA. If the badge conveys meaning not present in surrounding text — such as an isolated notification count or status — add aria-label directly on the element.',
  'badge.keyboard.description': 'Not focusable. No keyboard interaction.',
  'badge.stateModel.description': 'Stateless — variant and class inputs only. No value or event state.',
} as const;
