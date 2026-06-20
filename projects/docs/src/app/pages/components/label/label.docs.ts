import { ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const labelPage = {
  componentId: 'label',
  titleKey: 'component.label',
  descriptionKey: 'label.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'label.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'label.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'label.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'label.examples.description',
      level: 2,
      children: [
        {
          id: 'example-with-input',
          titleKey: 'label.demo.withInput',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'label.demo.disabled',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'label.api.description',
      level: 2,
    },
  ],
} as const satisfies ComponentPageDefinition;

export const labelPageExamples = {
  basic: `<label sanringLabel for="email">Email</label>`,
  usageImport: `import { Label } from '@sanring/ui';`,
  usageMain: `<label sanringLabel for="email">Email</label>`,
  withInput: `<div class="grid gap-2">
  <label sanringLabel for="email">Email</label>
  <input id="email" sanringInput placeholder="name@sanring.dev" type="email" />
</div>`,
  disabled: `<div class="grid gap-2">
  <input id="disabled-email" sanringInput class="peer" disabled value="readonly@sanring.dev" />
  <label sanringLabel for="disabled-email">Disabled email</label>
</div>`,
} as const;
