import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const aspectRatioPage = {
  componentId: 'aspect-ratio',
  titleKey: 'component.aspectRatio',
  descriptionKey: 'aspectRatio.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'aspectRatio.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'aspectRatio.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'aspectRatio.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-media',
          titleKey: 'aspectRatio.demo.media',
          level: 3,
        },
        {
          id: 'example-square',
          titleKey: 'aspectRatio.demo.square',
          level: 3,
        },
        {
          id: 'example-card',
          titleKey: 'aspectRatio.demo.card',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'aspectRatio.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'sanringAspectRatio',
      type: 'string | number',
      defaultValue: "'1 / 1'",
      descriptionKey: 'aspectRatio.api.ratio.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'aspectRatio.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const aspectRatioPageExamples = {
  basic: `<div sanringAspectRatio="16 / 9">
  <img
    alt="Workspace desk"
    class="h-full w-full rounded-[var(--sanring-radius)] object-cover"
    src="/example.jpg"
  />
</div>`,
  usageImport: `import { AspectRatioDirective } from '@sanring/ui';`,
  usageMain: `<div sanringAspectRatio="16 / 9">
  <img alt="Preview" class="h-full w-full object-cover" src="..." />
</div>`,
  media: `<figure sanringAspectRatio="16 / 9">
  <img
    alt="Analytics dashboard preview"
    class="h-full w-full rounded-[var(--sanring-radius)] object-cover"
    src="..."
  />
</figure>`,
  square: `<div sanringAspectRatio>
  <img
    alt="Product thumbnail"
    class="h-full w-full rounded-[var(--sanring-radius)] object-cover"
    src="..."
  />
</div>`,
  card: `<article class="grid gap-3">
  <div sanringAspectRatio="4 / 3">
    <img
      alt="Component preview"
      class="h-full w-full rounded-[var(--sanring-radius)] object-cover"
      src="..."
    />
  </div>
  <div>
    <h3 class="text-sm font-medium">Stable media frame</h3>
    <p class="text-sm text-[var(--docs-muted)]">
      Content below stays put while media loads.
    </p>
  </div>
</article>`,
} as const;
