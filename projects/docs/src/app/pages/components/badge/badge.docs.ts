import { ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const badgePage = {
  componentId: 'badge',
  titleKey: 'component.badge',
  descriptionKey: 'badge.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'badge.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'badge.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'badge.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'badge.examples.description',
      level: 2,
      children: [
        {
          id: 'example-variants',
          titleKey: 'badge.demo.variants',
          level: 3,
        },
        {
          id: 'example-link',
          titleKey: 'badge.demo.link',
          level: 3,
        },
        {
          id: 'example-with-icon',
          titleKey: 'badge.demo.withIcon',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'badge.api.description',
      level: 2,
    },
  ],
} as const satisfies ComponentPageDefinition;

export const badgePageExamples = {
  basic: `<span sanringBadge>
  Default
</span>`,
  usageImport: `import { BadgeDirective } from '@sanring/ui';`,
  usageMain: `<span sanringBadge variant="secondary">
  Badge
</span>`,
  variants: `<span sanringBadge>
  Default
</span>

<span sanringBadge variant="secondary">
  Secondary
</span>

<span sanringBadge variant="outline">
  Outline
</span>

<span sanringBadge variant="ghost">
  Ghost
</span>

<span sanringBadge variant="destructive">
  Destructive
</span>`,
  link: `<a
  sanringBadge
  class="transition-transform hover:-translate-y-0.5 hover:border-[var(--docs-fg)] hover:bg-[var(--docs-elevated)]"
  href="/components/badge"
  variant="outline"
>
  Link badge
  <svg class="size-3" lucideMoveUpRight></svg>
</a>`,
  withIcon: `<span sanringBadge variant="outline">
  <span class="size-2 shrink-0 rounded-full bg-green-500"></span>
  Running
</span>

<span sanringBadge variant="secondary">
  <svg class="size-3" lucideBadgeCheck></svg>
  Verified
</span>

<span sanringBadge variant="outline">
  Synced
  <svg class="size-3" lucideBadgeCheck></svg>
</span>`,
} as const;
