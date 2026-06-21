import { ComponentPageApiRow, ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const linkPage = {
  componentId: 'link',
  titleKey: 'component.link',
  descriptionKey: 'link.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'link.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'link.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'link.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'link.examples.description',
      level: 2,
      children: [
        {
          id: 'example-external',
          titleKey: 'link.demo.external',
          level: 3,
        },
        {
          id: 'example-router',
          titleKey: 'link.demo.router',
          level: 3,
        },
        {
          id: 'example-active',
          titleKey: 'link.demo.active',
          level: 3,
        },
        {
          id: 'example-custom',
          titleKey: 'link.demo.custom',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'link.api.description',
      level: 2,
    },
  ],
  apiRows: [
    { property: 'class', type: 'string', defaultValue: "''", descriptionKey: 'link.api.class.description' },
    { property: 'target', type: 'string', defaultValue: 'undefined', descriptionKey: 'link.api.target.description' },
    { property: 'rel', type: 'string', defaultValue: 'undefined', descriptionKey: 'link.api.rel.description' },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const linkPageExamples = {
  basic: `<a sanringLink href="#basic">
  Sanring UI
</a>`,
  usageImport: `import { LinkDirective } from '@sanring/ui';`,
  usageMain: `<a sanringLink href="#basic">
  Link
</a>`,
  external: `<a sanringLink href="https://sanring.dev" target="_blank">
  External link
</a>`,
  router: `<a sanringLink routerLink="/components/button">
  Button
</a>`,
  active: `<a
  sanringLink
  routerLink="/components/link"
  routerLinkActive="rounded-md bg-[var(--docs-active)] px-2 py-1 no-underline"
  [routerLinkActiveOptions]="{ exact: true }"
>
  Active route
</a>`,
  custom: `<a
  sanringLink
  class="text-[var(--docs-muted)] no-underline hover:text-[var(--docs-fg)]"
  href="https://sanring.dev"
  target="_blank"
>
  Custom link
</a>`,
} as const;
