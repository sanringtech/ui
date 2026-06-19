import { ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const dividerPage = {
  componentId: 'divider',
  titleKey: 'component.divider',
  descriptionKey: 'divider.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'divider.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'divider.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'divider.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'divider.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'divider.examples.description',
      level: 2,
      children: [
        {
          id: 'example-horizontal',
          titleKey: 'divider.demo.horizontal',
          level: 3,
        },
        {
          id: 'example-inset',
          titleKey: 'divider.demo.inset',
          level: 3,
        },
        {
          id: 'example-vertical',
          titleKey: 'divider.demo.vertical',
          level: 3,
        },
      ],
    },
  ],
} as const satisfies ComponentPageDefinition;

export const dividerPageExamples = {
  basic: `import { Divider } from '@sanring/ui';

<sanring-divider />`,
  usageImport: `import { Divider } from '@sanring/ui';`,
  usageMain: `<sanring-divider />`,
  horizontal: `<div>
  <p>Account</p>
  <sanring-divider />
  <p>Billing</p>
</div>`,
  inset: `<div>
  <div>Account</div>
  <sanring-divider inset="start" />
  <div>Billing</div>
</div>`,
  vertical: `<div class="flex items-center">
  <span>Profile</span>
  <sanring-divider [vertical]="true" />
  <span>Billing</span>
  <sanring-divider [vertical]="true" />
  <span>Settings</span>
</div>`,
} as const;
