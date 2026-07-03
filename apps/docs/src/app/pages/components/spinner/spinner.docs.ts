import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const spinnerPage = {
  componentId: 'spinner',
  titleKey: 'component.spinner',
  descriptionKey: 'spinner.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'spinner.examples.basic.description',
      level: 2,
    },
    { id: 'usage', titleKey: 'toc.usage', descriptionKey: 'spinner.usage.description', level: 2 },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'spinner.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-variant', titleKey: 'spinner.demo.variant', level: 3 },
        { id: 'example-size', titleKey: 'spinner.demo.size', level: 3 },
        { id: 'example-speed', titleKey: 'spinner.demo.speed', level: 3 },
        { id: 'example-color', titleKey: 'spinner.demo.color', level: 3 },
        { id: 'example-with-label', titleKey: 'spinner.demo.withLabel', level: 3 },
        { id: 'example-in-button', titleKey: 'spinner.demo.inButton', level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'spinner.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'variant',
      type: "'loader' | 'loader-circle' | 'pinwheel'",
      defaultValue: "'loader'",
      descriptionKey: 'spinner.api.variant.description',
    },
    {
      property: 'size',
      type: "'sm' | 'md' | 'lg' | 'xl'",
      defaultValue: "'md'",
      descriptionKey: 'spinner.api.size.description',
    },
    {
      property: 'speed',
      type: "'slow' | 'normal' | 'fast'",
      defaultValue: "'normal'",
      descriptionKey: 'spinner.api.speed.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'spinner.api.class.description',
    },
    {
      property: 'ariaLabel',
      type: 'string',
      defaultValue: "'Loading'",
      descriptionKey: 'spinner.api.ariaLabel.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const spinnerPageExamples = {
  basic: `<sanring-spinner />`,

  usageImport: `import { SpinnerComponent } from '@sanring/ui';`,
  usageMain: `<sanring-spinner ariaLabel="Fetching data" />`,

  variant: `<sanring-spinner variant="loader" />
<sanring-spinner variant="loader-circle" />
<sanring-spinner variant="pinwheel" />`,

  size: `<sanring-spinner size="sm" />
<sanring-spinner size="md" />
<sanring-spinner size="lg" />
<sanring-spinner size="xl" />`,

  speed: `<sanring-spinner speed="slow" />
<sanring-spinner speed="normal" />
<sanring-spinner speed="fast" />`,

  color: `<!-- Inherit parent text colour -->
<sanring-spinner class="text-blue-500" />
<sanring-spinner class="text-emerald-500" />
<sanring-spinner class="text-rose-500" />
<sanring-spinner class="text-[var(--sanring-muted)]" />`,

  withLabel: `<div class="flex items-center gap-2 text-sm text-[var(--sanring-muted)]">
  <sanring-spinner size="sm" />
  Loading…
</div>`,

  inButton: `<button sanringBtn variant="secondary" disabled>
  <sanring-spinner size="sm" />
  Saving…
</button>`,
} as const;
