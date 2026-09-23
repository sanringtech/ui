export const avatarTranslations = {
  'avatar.description':
    'A composable avatar primitive for profile images, fallbacks, status badges, and stacked groups.',
  'avatar.demo.sizes': 'Sizes',
  'avatar.demo.statusBadge': 'Status badge',
  'avatar.demo.badgeWithIcon': 'Badge with icon',
  'avatar.demo.badgeCount': 'Notification count',
  'avatar.examples.badgeCount.description':
    'Pass count to render a numeric pill. It defaults to the top-end corner so it can sit with a status dot at the bottom. 0 hides the pill; values above 99 render as 99+.',
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
    'Places the badge at start, end, top, or bottom. Status badges default to end (bottom-end); count badges default to top (top-end). start/end follow RTL.',
  'avatar.api.badgeCount.description':
    'Unread count on [sanringAvatarBadge]. Hidden at 0 or below; values above 99 render as 99+.',
  'avatar.api.overlap.description': 'Stack overlap amount in rem for avatar groups.',
  'avatar.api.count.description': 'Number displayed by the avatar group count item.',
  'avatar.api.clickable.description':
    'Gives the group count button semantics and enables pointer and keyboard activation.',
  'avatar.api.disabled.description':
    'Makes a clickable group count unavailable and removes it from the tab sequence.',
  'avatar.api.clicked.description': 'Emitted when an enabled clickable group count is activated.',
  'avatar.accessibility.description':
    "role='img' on the host. Provide ariaLabel or ariaLabelledBy to name a non-decorative avatar. For purely decorative use — such as next to a user name already present in text — add aria-hidden='true' on <sanring-avatar> to suppress redundant announcements. A count badge is role='status'; give it an ariaLabel such as '3 unread'. A clickable group count exposes button semantics and reflects disabled state.",
  'avatar.keyboard.description':
    'Avatars are not focusable by default. A clickable group count responds to Enter and Space.',
  'avatar.stateModel.description':
    'Stateless. src loads the image; on failure the fallback slot renders; initials are a last resort. No internal selection or value state.',
} as const;
