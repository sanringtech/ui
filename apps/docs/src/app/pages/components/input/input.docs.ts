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
          id: 'example-floating',
          titleKey: 'input.demo.floating',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'input.demo.disabled',
          level: 3,
        },
        {
          id: 'example-validation',
          titleKey: 'input.demo.validation',
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
  basic: `<sanring-field>
  <label sanringLabel>Email</label>
  <input sanringInput placeholder="name@sanring.dev" type="email" />
  <p sanringDescription>We'll only use this for account notifications.</p>
</sanring-field>`,
  usageImport: `import {
  DescriptionDirective,
  FieldLabelDirective,
  InputDirective,
  SanringFieldComponent,
} from '@sanring/ui';`,
  usageMain: `<sanring-field>
  <label sanringLabel>Email</label>
  <input sanringInput placeholder="name@sanring.dev" type="email" />
  <p sanringDescription>We'll only use this for account notifications.</p>
</sanring-field>`,
  floating: `<sanring-field floating>
  <label sanringLabel>Email</label>
  <input sanringInput placeholder="" type="email" />
</sanring-field>`,
  disabled: `<sanring-field>
  <label sanringLabel>Disabled email</label>
  <input sanringInput disabled value="readonly@sanring.dev" />
</sanring-field>`,
  validation: `<sanring-field>
  <label sanringLabel>Email</label>
  <input sanringInput [formControl]="emailControl" placeholder="name@sanring.dev" />
  <sanring-error-message>Email is required.</sanring-error-message>
</sanring-field>`,
  file: `<input sanringInput type="file" />`,
} as const;
