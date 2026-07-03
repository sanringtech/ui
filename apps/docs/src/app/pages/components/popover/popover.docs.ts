import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const popoverPage = {
  componentId: 'popover',
  titleKey: 'component.popover',
  descriptionKey: 'popover.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'popover.examples.basic.description',
      level: 2,
    },
    { id: 'usage', titleKey: 'toc.usage', descriptionKey: 'popover.usage.description', level: 2 },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'popover.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'popover.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-align', titleKey: 'popover.demo.align', level: 3 },
        { id: 'example-with-header', titleKey: 'popover.demo.withHeader', level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'popover.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'isOpen',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'popover.api.isOpen.description',
    },
    {
      property: 'align',
      type: "'start' | 'center' | 'end'",
      defaultValue: "'center'",
      descriptionKey: 'popover.api.align.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'popover.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const popoverPageExamples = {
  basic: `<sanring-popover>
  <button sanringBtn sanringPopoverTrigger>Open popover</button>

  <sanring-popover-content>
    <sanring-popover-header>
      <sanring-popover-title>Dimensions</sanring-popover-title>
      <sanring-popover-description>Set the dimensions for the layer.</sanring-popover-description>
    </sanring-popover-header>
    <p class="text-sm">Popover body content goes here.</p>
  </sanring-popover-content>
</sanring-popover>`,

  usageImport: `import { Component } from '@angular/core';
import { ButtonDirective, SANRING_POPOVER_IMPORTS } from '@sanring/ui';

@Component({
  imports: [ButtonDirective, SANRING_POPOVER_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-popover align="center">
  <button sanringBtn sanringPopoverTrigger>Open</button>

  <sanring-popover-content>
    <sanring-popover-title>Title</sanring-popover-title>
    <p class="text-sm mt-2">Content goes here.</p>
  </sanring-popover-content>
</sanring-popover>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import {
  ButtonDirective,
  PopoverComponent,
  PopoverContentComponent,
  PopoverDescriptionComponent,
  PopoverHeaderComponent,
  PopoverTitleComponent,
  PopoverTriggerDirective,
} from '@sanring/ui';

@Component({
  imports: [
    ButtonDirective,
    PopoverComponent,
    PopoverTriggerDirective,
    PopoverContentComponent,
    PopoverHeaderComponent,
    PopoverTitleComponent,
    PopoverDescriptionComponent,
  ],
})
export class ExampleComponent {}`,

  composition: `sanring-popover
├── [sanringPopoverTrigger]
└── sanring-popover-content
    ├── sanring-popover-header  (optional)
    │   ├── sanring-popover-title
    │   └── sanring-popover-description
    └── (any content)`,

  align: `<!-- align controls how the panel lines up with the trigger -->
<sanring-popover align="start">…</sanring-popover>
<sanring-popover align="center">…</sanring-popover>
<sanring-popover align="end">…</sanring-popover>`,

  withHeader: `<sanring-popover>
  <button sanringBtn variant="outline" sanringPopoverTrigger>
    Jane Appleseed
  </button>

  <sanring-popover-content>
    <sanring-popover-header>
      <sanring-popover-title>Jane Appleseed</sanring-popover-title>
      <sanring-popover-description>jane@example.com</sanring-popover-description>
    </sanring-popover-header>
    <div class="mt-3 flex gap-2">
      <button sanringBtn size="sm" variant="outline" class="flex-1">Message</button>
      <button sanringBtn size="sm" class="flex-1">Follow</button>
    </div>
  </sanring-popover-content>
</sanring-popover>`,
} as const;
