import { ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const accordionPage = {
  componentId: 'accordion',
  titleKey: 'component.accordion',
  descriptionKey: 'accordion.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'accordion.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'accordion.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'accordion.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'accordion.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'accordion.examples.description',
      level: 2,
      children: [
        {
          id: 'example-single',
          titleKey: 'accordion.demo.single',
          level: 3,
        },
        {
          id: 'example-multiple',
          titleKey: 'accordion.demo.multiple',
          level: 3,
        },
        {
          id: 'example-default-open',
          titleKey: 'accordion.demo.defaultOpen',
          level: 3,
        },
        {
          id: 'example-controlled',
          titleKey: 'accordion.demo.controlled',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'accordion.api.description',
      level: 2,
    },
  ],
} as const satisfies ComponentPageDefinition;

export const accordionPageExamples = {
  basic: `<sanring-accordion>
  <sanring-accordion-item>
    <sanring-accordion-trigger>
      Shipping options
    </sanring-accordion-trigger>
    <sanring-accordion-content>
      We ship domestically and internationally.
    </sanring-accordion-content>
  </sanring-accordion-item>
</sanring-accordion>`,
  usageImport: `import {
  AccordionComponent,
  AccordionContentComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
} from '@sanring/ui';`,
  usageMain: `<sanring-accordion>
  <sanring-accordion-item>
    <sanring-accordion-trigger>
      Shipping options
    </sanring-accordion-trigger>
    <sanring-accordion-content>
      We ship domestically and internationally.
    </sanring-accordion-content>
  </sanring-accordion-item>
</sanring-accordion>`,
  single: `<sanring-accordion>
  <sanring-accordion-item>
    <sanring-accordion-trigger>Shipping options</sanring-accordion-trigger>
    <sanring-accordion-content>Shipping details...</sanring-accordion-content>
  </sanring-accordion-item>

  <sanring-accordion-item>
    <sanring-accordion-trigger>Return policy</sanring-accordion-trigger>
    <sanring-accordion-content>Return details...</sanring-accordion-content>
  </sanring-accordion-item>
</sanring-accordion>`,
  multiple: `<sanring-accordion multi>
  <sanring-accordion-item>
    <sanring-accordion-trigger>Shipping options</sanring-accordion-trigger>
    <sanring-accordion-content>Shipping details...</sanring-accordion-content>
  </sanring-accordion-item>

  <sanring-accordion-item>
    <sanring-accordion-trigger>Return policy</sanring-accordion-trigger>
    <sanring-accordion-content>Return details...</sanring-accordion-content>
  </sanring-accordion-item>
</sanring-accordion>`,
  defaultOpen: `<sanring-accordion>
  <sanring-accordion-item expanded>
    <sanring-accordion-trigger>Shipping options</sanring-accordion-trigger>
    <sanring-accordion-content>Shipping details...</sanring-accordion-content>
  </sanring-accordion-item>

  <sanring-accordion-item>
    <sanring-accordion-trigger>Return policy</sanring-accordion-trigger>
    <sanring-accordion-content>Return details...</sanring-accordion-content>
  </sanring-accordion-item>
</sanring-accordion>`,
  controlled: `<button type="button" (click)="accordion.openAll()">Open all</button>
<button type="button" (click)="accordion.closeAll()">Close all</button>

<sanring-accordion #accordion multi>
  <sanring-accordion-item>
    <sanring-accordion-trigger>Shipping options</sanring-accordion-trigger>
    <sanring-accordion-content>Shipping details...</sanring-accordion-content>
  </sanring-accordion-item>

  <sanring-accordion-item>
    <sanring-accordion-trigger>Return policy</sanring-accordion-trigger>
    <sanring-accordion-content>Return details...</sanring-accordion-content>
  </sanring-accordion-item>
</sanring-accordion>`,
  composition: `AccordionComponent
└── AccordionItemComponent
    ├── AccordionTriggerComponent
    └── AccordionContentComponent`,
} as const;
