import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const inputPage = {
  componentId: 'input',
  titleKey: 'component.input',
  descriptionKey: 'input.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'input.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'input.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'input.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-disabled',
          titleKey: 'input.demo.disabled',
          level: 3,
        },
        {
          id: 'example-file',
          titleKey: 'input.demo.file',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'input.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'input.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const inputPageExamples = {
  basic: `<input sanringInput placeholder="Email" type="email" />`,
  usageImport: `import { InputDirective } from '@sanring/ui';`,
  usageMain: `<input sanringInput placeholder="Email" type="email" />`,
  disabled: `<input sanringInput disabled value="readonly@sanring.dev" />`,
  file: `<input sanringInput type="file" />`,
} as const;
