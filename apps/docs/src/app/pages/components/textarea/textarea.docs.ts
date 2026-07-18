import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const textareaPage = {
  componentId: 'textarea',
  titleKey: 'component.textarea',
  descriptionKey: 'textarea.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'textarea.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'textarea.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'textarea.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-disabled',
          titleKey: 'textarea.demo.disabled',
          level: 3,
        },
        {
          id: 'example-resize',
          titleKey: 'textarea.demo.resize',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'textarea.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'textarea.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const textareaPageExamples = {
  basic: `<textarea sanringTextarea placeholder="Write a note"></textarea>`,
  usageImport: `import { TextareaDirective } from './components/ui/textarea';`,
  usageMain: `<textarea sanringTextarea placeholder="Write a note"></textarea>`,
  disabled: `<textarea sanringTextarea disabled>Readonly message</textarea>`,
  resize: `<textarea sanringTextarea class="min-h-[140px] resize-y" placeholder="Longer message"></textarea>`,
} as const;
