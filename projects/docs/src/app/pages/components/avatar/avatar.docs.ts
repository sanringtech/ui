import { ComponentPageApiRow, ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const avatarPage = {
  componentId: 'avatar',
  titleKey: 'component.avatar',
  descriptionKey: 'avatar.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'avatar.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'avatar.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'avatar.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'avatar.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'avatar.examples.description',
      level: 2,
      children: [
        {
          id: 'example-sizes',
          titleKey: 'avatar.demo.sizes',
          level: 3,
        },
        {
          id: 'example-badge',
          titleKey: 'avatar.demo.statusBadge',
          level: 3,
        },
        {
          id: 'example-badge-with-icon',
          titleKey: 'avatar.demo.badgeWithIcon',
          level: 3,
        },
        {
          id: 'example-group',
          titleKey: 'avatar.demo.group',
          level: 3,
        },
        {
          id: 'example-group-with-icon',
          titleKey: 'avatar.demo.groupWithIcon',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'avatar.api.description',
      level: 2,
    },
  ],
  apiRows: [
    { property: 'class', type: 'string', defaultValue: "''", descriptionKey: 'avatar.api.class.description' },
    { property: 'size', type: 'AvatarSize', defaultValue: "'md'", descriptionKey: 'avatar.api.size.description' },
    { property: 'ariaLabel', type: 'string', defaultValue: 'undefined', descriptionKey: 'avatar.api.ariaLabel.description' },
    { property: 'delayMs', type: 'number', defaultValue: '0', descriptionKey: 'avatar.api.delayMs.description' },
    { property: 'status', type: 'AvatarBadgeStatus', defaultValue: "'default'", descriptionKey: 'avatar.api.status.description' },
    { property: 'placement', type: 'AvatarBadgePlacement', defaultValue: "'end'", descriptionKey: 'avatar.api.placement.description' },
    { property: 'overlap', type: 'number', defaultValue: '0.75', descriptionKey: 'avatar.api.overlap.description' },
    { property: 'count', type: 'number', defaultValue: 'undefined', descriptionKey: 'avatar.api.count.description' },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const avatarPageExamples = {
  basic: `<sanring-avatar ariaLabel="Ada Lovelace">
  <img
    sanringAvatarImage
    src="https://i.pravatar.cc/96?img=5"
    alt="Ada Lovelace"
  />
  <sanring-avatar-fallback>AL</sanring-avatar-fallback>
</sanring-avatar>`,
  usageImport: `import {
  AvatarComponent,
  AvatarImageDirective,
  AvatarFallbackComponent,
} from '@sanring/ui';`,
  usageMain: `<sanring-avatar ariaLabel="Ada Lovelace">
  <img sanringAvatarImage src="https://i.pravatar.cc/96?img=5" alt="Ada Lovelace" />
  <sanring-avatar-fallback>AL</sanring-avatar-fallback>
</sanring-avatar>`,
  composition: `AvatarComponent
├── AvatarImageDirective
├── AvatarFallbackComponent
└── AvatarBadgeDirective

AvatarGroupComponent
├── AvatarComponent
└── AvatarGroupCountComponent`,
  sizes: `<sanring-avatar size="sm" ariaLabel="Small avatar">
  <sanring-avatar-fallback>SM</sanring-avatar-fallback>
</sanring-avatar>

<sanring-avatar ariaLabel="Medium avatar">
  <sanring-avatar-fallback>MD</sanring-avatar-fallback>
</sanring-avatar>

<sanring-avatar size="lg" ariaLabel="Large avatar">
  <sanring-avatar-fallback>LG</sanring-avatar-fallback>
</sanring-avatar>`,
  badge: `<sanring-avatar ariaLabel="Online user">
  <img sanringAvatarImage src="https://i.pravatar.cc/96?img=12" alt="Online user" />
  <sanring-avatar-fallback>OU</sanring-avatar-fallback>
  <span sanringAvatarBadge status="online" ariaLabel="Online"></span>
</sanring-avatar>`,
  badgeWithIcon: `<sanring-avatar ariaLabel="Verified user">
  <img sanringAvatarImage src="https://i.pravatar.cc/96?img=21" alt="Verified user" />
  <sanring-avatar-fallback>VU</sanring-avatar-fallback>
  <span sanringAvatarBadge status="online" ariaLabel="Verified">
    <svg lucideCheck class="size-2"></svg>
  </span>
</sanring-avatar>`,
  group: `<sanring-avatar-group ariaLabel="Project members">
  <sanring-avatar ariaLabel="Ada Lovelace">
    <sanring-avatar-fallback>AL</sanring-avatar-fallback>
  </sanring-avatar>
  <sanring-avatar ariaLabel="Grace Hopper">
    <sanring-avatar-fallback>GH</sanring-avatar-fallback>
  </sanring-avatar>
  <sanring-avatar ariaLabel="Katherine Johnson">
    <sanring-avatar-fallback>KJ</sanring-avatar-fallback>
  </sanring-avatar>
  <sanring-avatar-group-count [count]="3" ariaLabel="3 more members" />
</sanring-avatar-group>`,
  groupWithIcon: `<sanring-avatar-group ariaLabel="Project members">
  <sanring-avatar ariaLabel="Ada Lovelace">
    <sanring-avatar-fallback>AL</sanring-avatar-fallback>
  </sanring-avatar>
  <sanring-avatar ariaLabel="Grace Hopper">
    <sanring-avatar-fallback>GH</sanring-avatar-fallback>
  </sanring-avatar>
  <sanring-avatar-group-count ariaLabel="Add member">
    <svg lucidePlus class="size-4"></svg>
  </sanring-avatar-group-count>
</sanring-avatar-group>`,
} as const;
