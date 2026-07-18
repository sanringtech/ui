import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const togglePage = {
  componentId: 'toggle',
  titleKey: 'component.toggle',
  descriptionKey: 'toggle.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'toggle.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'toggle.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'toggle.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-outline', titleKey: 'toggle.demo.outline', level: 3 },
        { id: 'example-with-text', titleKey: 'toggle.demo.withText', level: 3 },
        { id: 'example-size', titleKey: 'toggle.demo.size', level: 3 },
        { id: 'example-disabled', titleKey: 'toggle.demo.disabled', level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'toggle.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'toggle.api.class.description',
    },
    {
      property: 'variant',
      type: "'default' | 'outline'",
      defaultValue: "'default'",
      descriptionKey: 'toggle.api.variant.description',
    },
    {
      property: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      descriptionKey: 'toggle.api.size.description',
    },
    {
      property: 'pressed',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'toggle.api.pressed.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'toggle.api.disabled.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const togglePageExamples = {
  basic: `<button sanringToggle>
  <svg lucideBold class="size-4"></svg>
</button>`,

  usageImport: `import { ToggleDirective } from './components/ui/toggle';`,

  usageMain: `<button sanringToggle [(pressed)]="isBold">
  <svg lucideBold class="size-4"></svg>
</button>`,

  outline: `<button sanringToggle variant="outline">
  <svg lucideBold class="size-4"></svg>
</button>`,

  withText: `<div class="flex gap-1">
  <button sanringToggle>
    <svg lucideBold class="size-4"></svg>
    Bold
  </button>
  <button sanringToggle>
    <svg lucideItalic class="size-4"></svg>
    Italic
  </button>
  <button sanringToggle>
    <svg lucideUnderline class="size-4"></svg>
    Underline
  </button>
</div>`,

  size: `<div class="flex items-center gap-2">
  <button sanringToggle size="sm">
    <svg lucideBold class="size-3.5"></svg>
  </button>
  <button sanringToggle>
    <svg lucideBold class="size-4"></svg>
  </button>
  <button sanringToggle size="lg">
    <svg lucideBold class="size-5"></svg>
  </button>
</div>`,

  disabled: `<div class="flex gap-2">
  <button sanringToggle disabled>
    <svg lucideBold class="size-4"></svg>
  </button>
  <button sanringToggle [pressed]="true" disabled>
    <svg lucideBold class="size-4"></svg>
  </button>
</div>`,
} as const;
