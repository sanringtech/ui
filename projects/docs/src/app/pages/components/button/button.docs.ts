import { ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const buttonPage = {
  componentId: 'button',
  titleKey: 'component.button',
  descriptionKey: 'button.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'button.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'button.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'button.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'button.examples.description',
      level: 2,
      children: [
        {
          id: 'example-size',
          titleKey: 'button.demo.size',
          level: 3,
        },
        {
          id: 'example-default',
          titleKey: 'button.demo.default',
          level: 3,
        },
        {
          id: 'example-outline',
          titleKey: 'button.demo.outline',
          level: 3,
        },
        {
          id: 'example-secondary',
          titleKey: 'button.demo.secondary',
          level: 3,
        },
        {
          id: 'example-ghost',
          titleKey: 'button.demo.ghost',
          level: 3,
        },
        {
          id: 'example-destructive',
          titleKey: 'button.demo.destructive',
          level: 3,
        },
        {
          id: 'example-link',
          titleKey: 'button.demo.link',
          level: 3,
        },
        {
          id: 'example-icon',
          titleKey: 'button.demo.icon',
          level: 3,
        },
        {
          id: 'example-with-icon',
          titleKey: 'button.demo.withIcon',
          level: 3,
        },
        {
          id: 'example-rounded',
          titleKey: 'button.demo.rounded',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'button.api.description',
      level: 2,
    },
  ],
} as const satisfies ComponentPageDefinition;

export const buttonPageExamples = {
  basic: `import { ButtonDirective } from '@sanring/ui';

<button sanringBtn type="button" variant="outline">
  Outline
</button>

<button sanringBtn type="button" variant="outline" size="icon" aria-label="Settings">
  <svg class="size-4" lucideSettings></svg>
</button>`,
  usageImport: `import { ButtonDirective } from '@sanring/ui';`,
  usageMain: `<button sanringBtn type="button" variant="outline">
  Button
</button>`,
  size: `<button sanringBtn type="button" variant="outline" size="sm">
  Small
</button>

<button sanringBtn type="button" variant="outline">
  Default
</button>

<button sanringBtn type="button" variant="outline" size="icon" aria-label="Settings">
  <svg class="size-4" lucideSettings></svg>
</button>`,
  defaultVariant: `<button sanringBtn type="button">
  Default
</button>`,
  outline: `<button sanringBtn type="button" variant="outline">
  Outline
</button>`,
  secondary: `<button sanringBtn type="button" variant="secondary">
  Secondary
</button>`,
  ghost: `<button sanringBtn type="button" variant="ghost">
  Ghost
</button>`,
  destructive: `<button sanringBtn type="button" variant="destructive">
  Destructive
</button>`,
  link: `<a sanringBtn href="#example-link" variant="link">
  Link
</a>`,
  icon: `<button sanringBtn type="button" variant="outline" size="icon" aria-label="Settings">
  <svg class="size-4" lucideSettings></svg>
</button>`,
  withIcon: `<button sanringBtn type="button" variant="outline">
  <svg class="size-4" lucideDownload></svg>
  <span>With Icon</span>
</button>`,
  rounded: `<button sanringBtn class="rounded-full" type="button" variant="outline">
  <span>Rounded</span>
  <svg class="size-4" lucideArrowRight></svg>
</button>`,
} as const;
