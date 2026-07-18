import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const fieldPage = {
  componentId: 'field',
  titleKey: 'component.field',
  descriptionKey: 'field.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'field.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'field.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'field.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'field.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-floating',
          titleKey: 'field.demo.floating',
          level: 3,
        },
        {
          id: 'example-validation',
          titleKey: 'field.demo.validation',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'field.demo.disabled',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'field.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'floating',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'field.api.floating.description',
    },
    {
      property: 'label[sanringLabel].class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'field.api.labelClass.description',
    },
    {
      property: '[sanringDescription].class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'field.api.descriptionClass.description',
    },
    {
      property: 'sanring-error-message.class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'field.api.errorMessageClass.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const fieldPageExamples = {
  composition: `sanring-field
├── label[sanringLabel]
├── [sanringInput] (or any SanringFieldControl)
├── [sanringDescription]
└── sanring-error-message`,
  basic: `<sanring-field>
  <label sanringLabel>Email</label>
  <input sanringInput placeholder="name@sanring.dev" type="email" />
  <p sanringDescription>We'll only use this for account notifications.</p>
</sanring-field>`,
  usageImport: `import { DescriptionDirective, ErrorMessageComponent, FieldLabelDirective, SanringFieldComponent } from './components/ui/field';`,
  usageMain: `<sanring-field>
  <label sanringLabel>Email</label>
  <input sanringInput placeholder="name@sanring.dev" type="email" />
  <p sanringDescription>We'll only use this for account notifications.</p>
</sanring-field>`,
  floating: `<sanring-field floating>
  <label sanringLabel>Email</label>
  <input sanringInput placeholder="" type="email" />
</sanring-field>`,
  validation: `<sanring-field>
  <label sanringLabel>Email</label>
  <input sanringInput [formControl]="emailControl" placeholder="name@sanring.dev" />
  <sanring-error-message>Email is required.</sanring-error-message>
</sanring-field>`,
  disabled: `<sanring-field>
  <label sanringLabel>Disabled email</label>
  <input sanringInput disabled value="readonly@sanring.dev" />
</sanring-field>`,
} as const;
