import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const tagPage = {
  componentId: 'tag',
  titleKey: 'component.tag',
  descriptionKey: 'tag.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'tag.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'tag.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'tag.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-default',
          titleKey: 'tag.demo.default',
          level: 3,
        },
        {
          id: 'example-closable',
          titleKey: 'tag.demo.closable',
          level: 3,
        },
        {
          id: 'example-variants',
          titleKey: 'tag.demo.variants',
          level: 3,
        },
        {
          id: 'example-list',
          titleKey: 'tag.demo.list',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'tag.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'tag.api.class.description',
    },
    {
      property: 'variant',
      type: 'BadgeVariant',
      defaultValue: "'secondary'",
      descriptionKey: 'tag.api.variant.description',
    },
    {
      property: 'closable',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'tag.api.closable.description',
    },
    {
      property: 'removeAriaLabel',
      type: 'string',
      defaultValue: "'Remove tag'",
      descriptionKey: 'tag.api.removeAriaLabel.description',
    },
    {
      property: 'remove',
      type: 'EventEmitter<MouseEvent>',
      defaultValue: '-',
      descriptionKey: 'tag.api.remove.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const tagPageExamples = {
  basic: `<sanring-tag>
  Tag
</sanring-tag>`,
  usageImport: `import { TagComponent } from '@sanring/ui';`,
  usageMain: `<sanring-tag variant="secondary">
  Tag
</sanring-tag>`,
  defaultVariant: `<sanring-tag>
  Tag
</sanring-tag>`,
  closable: `<sanring-tag
  closable
  removeAriaLabel="Remove Filter tag"
  (remove)="removeTag()"
>
  Filter
</sanring-tag>`,
  variants: `<sanring-tag variant="secondary">
  Secondary
</sanring-tag>

<sanring-tag variant="outline">
  Outline
</sanring-tag>

<sanring-tag variant="destructive">
  Destructive
</sanring-tag>`,
  list: `<div class="flex flex-wrap items-center gap-2">
  <sanring-tag closable>Frontend</sanring-tag>
  <sanring-tag closable>Angular</sanring-tag>
  <sanring-tag closable>UI/UX</sanring-tag>
</div>`,
} as const;
