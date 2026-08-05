export const avatarTranslations = {
  'avatar.description':
    'A composable avatar primitive for profile images, fallbacks, status badges, and stacked groups.',
  'avatar.demo.sizes': 'Sizes',
  'avatar.demo.statusBadge': 'Status badge',
  'avatar.demo.badgeWithIcon': 'Badge with icon',
  'avatar.demo.group': 'Avatar group',
  'avatar.demo.groupWithIcon': 'Avatar group with icon',
  'avatar.examples.description':
    'Common avatar patterns for fallbacks, presence indicators, and compact member groups.',
  'avatar.examples.basic.description':
    'Avatar shows the image after it loads and keeps the fallback visible when the image is missing or unavailable.',
  'avatar.usage.description':
    'Import the avatar primitives and compose image, fallback, badge, or group pieces as needed.',
  'avatar.installation.description':
    'Use AvatarComponent as the root and combine it with image, fallback, badge, and group primitives.',
  'avatar.composition.description':
    'Avatar is composed from a root, optional image, fallback, status badge, and group primitives so each part can be used independently.',
  'avatar.api.description': 'Inputs supported by the avatar primitives.',
  'avatar.api.class.description': 'Additional classes merged with the selected avatar primitive.',
  'avatar.api.size.description': 'Controls avatar density: sm, md, or lg.',
  'avatar.api.ariaLabel.description':
    'Accessible label for standalone avatars or avatar groups without visible text.',
  'avatar.api.delayMs.description': 'Delay in milliseconds before the fallback is shown.',
  'avatar.api.status.description': 'Controls badge color: online, offline, away, busy, or default.',
  'avatar.api.placement.description':
    'Places the badge at the visual start or end edge, respecting RTL direction.',
  'avatar.api.overlap.description': 'Stack overlap amount in rem for avatar groups.',
  'avatar.api.count.description': 'Number displayed by the avatar group count item.',
  'avatar.accessibility.description': "role='img' on the host. Provide ariaLabel or ariaLabelledBy to name a non-decorative avatar. For purely decorative use — such as next to a user name already present in text — add aria-hidden='true' on <sanring-avatar> to suppress redundant announcements.",
  'avatar.keyboard.description': 'Not focusable by default. No keyboard interaction.',
  'avatar.stateModel.description': 'Stateless. src loads the image; on failure the fallback slot renders; initials are a last resort. No internal selection or value state.',
} as const;
