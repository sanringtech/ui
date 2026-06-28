import { ComponentPageApiRow, ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const progressPage = {
  componentId: 'progress',
  titleKey: 'component.progress',
  descriptionKey: 'progress.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'progress.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'progress.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'progress.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'progress.examples.description',
      level: 2,
      children: [
        { id: 'example-shimmer', titleKey: 'progress.demo.shimmer', level: 3 },
        { id: 'example-shape',   titleKey: 'progress.demo.shape',   level: 3 },
        { id: 'example-color',   titleKey: 'progress.demo.color',   level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'progress.api.description',
      level: 2,
    },
  ],
  apiRows: [
    { property: 'value',      type: 'number',                               defaultValue: '0',          descriptionKey: 'progress.api.value.description'      },
    { property: 'max',        type: 'number',                               defaultValue: '100',        descriptionKey: 'progress.api.max.description'        },
    { property: 'shape',      type: "'rounded' | 'square' | 'trapezoid'",  defaultValue: "'rounded'",  descriptionKey: 'progress.api.shape.description'      },
    { property: 'shimmer',    type: 'boolean',                              defaultValue: 'false',      descriptionKey: 'progress.api.shimmer.description'    },
    { property: 'ariaLabel',  type: 'string',                               defaultValue: '—',          descriptionKey: 'progress.api.ariaLabel.description'  },
    { property: 'barClass',   type: 'string',                               defaultValue: "''",         descriptionKey: 'progress.api.barClass.description'   },
    { property: 'class',      type: 'string',                               defaultValue: "''",         descriptionKey: 'progress.api.class.description'      },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const progressPageExamples = {
  basic: `<sanring-progress [value]="60" ariaLabel="Loading" />`,

  usageImport: `import { ProgressComponent } from '@sanring/ui';`,

  usageMain: `<sanring-progress [value]="progress" [max]="100" ariaLabel="Upload progress" />`,

  shimmer: `<sanring-progress [value]="70" shimmer ariaLabel="Uploading…" />`,

  shape: `<!-- Rounded (default) -->
<sanring-progress [value]="60" ariaLabel="Rounded" />

<!-- Square -->
<sanring-progress [value]="60" shape="square" ariaLabel="Square" />

<!-- Trapezoid — cn() applies [transform:skewX(-12deg)] to the track -->
<sanring-progress [value]="60" shape="trapezoid" ariaLabel="Trapezoid" />`,

  color: `<!-- 1. Default: --sanring-progress-bar CSS variable -->
<sanring-progress [value]="60" ariaLabel="Default colour" />

<!-- 2. CSS variable override — change colour without touching source -->
<sanring-progress
  [value]="60"
  style="--sanring-progress-bar: #8b5cf6"
  ariaLabel="Purple via CSS var"
/>

<!-- 3. barClass headless override — one-off Tailwind class -->
<sanring-progress
  [value]="60"
  barClass="bg-emerald-500"
  ariaLabel="Green via barClass"
/>`,
} as const;
