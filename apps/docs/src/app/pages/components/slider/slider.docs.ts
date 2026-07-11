import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const sliderPage = {
  componentId: 'slider',
  titleKey: 'component.slider',
  descriptionKey: 'slider.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'slider.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'slider.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'slider.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-step', titleKey: 'slider.demo.step', level: 3 },
        { id: 'example-form', titleKey: 'slider.demo.form', level: 3 },
        { id: 'example-disabled', titleKey: 'slider.demo.disabled', level: 3 },
        {
          id: 'example-field',
          titleKey: 'slider.demo.field',
          descriptionKey: 'slider.examples.field.description',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'slider.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'slider.api.class.description',
    },
    {
      property: 'id',
      type: 'string',
      defaultValue: 'generated',
      descriptionKey: 'slider.api.id.description',
    },
    {
      property: 'min',
      type: 'number',
      defaultValue: '0',
      descriptionKey: 'slider.api.min.description',
    },
    {
      property: 'max',
      type: 'number',
      defaultValue: '100',
      descriptionKey: 'slider.api.max.description',
    },
    {
      property: 'step',
      type: 'number',
      defaultValue: '1',
      descriptionKey: 'slider.api.step.description',
    },
    {
      property: 'value',
      type: 'number',
      defaultValue: '50',
      descriptionKey: 'slider.api.value.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'slider.api.disabled.description',
    },
    {
      property: 'valueChange',
      type: 'EventEmitter<number>',
      defaultValue: '—',
      descriptionKey: 'slider.api.valueChange.description',
    },
    {
      property: 'ariaLabel',
      type: 'string',
      defaultValue: '—',
      descriptionKey: 'slider.api.ariaLabel.description',
    },
    {
      property: 'ariaLabelledBy',
      type: 'string',
      defaultValue: '—',
      descriptionKey: 'slider.api.ariaLabelledBy.description',
    },
    {
      property: 'ariaDescribedBy',
      type: 'string',
      defaultValue: '—',
      descriptionKey: 'slider.api.ariaDescribedBy.description',
    },
    {
      property: 'ariaValueText',
      type: 'string',
      defaultValue: '—',
      descriptionKey: 'slider.api.ariaValueText.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const sliderPageExamples = {
  basic: `<sanring-slider [value]="50" ariaLabel="Volume" />`,
  usageImport: `import { SliderComponent } from '@sanring/ui';`,
  usageMain: `<sanring-slider
  [min]="0"
  [max]="100"
  [step]="5"
  [value]="volume"
  ariaLabel="Volume"
  (valueChange)="volume = $event"
/>`,
  step: `<sanring-slider [min]="0" [max]="10" [step]="2" [value]="4" ariaLabel="Rating" />`,
  form: `<label id="brightness-label" for="brightness">Brightness</label>
<sanring-slider
  id="brightness"
  [value]="brightness"
  ariaLabelledBy="brightness-label"
  (valueChange)="brightness = $event"
/>`,
  disabled: `<sanring-slider [value]="35" disabled ariaLabel="Locked value" />`,
  field: `<sanring-field>
  <sanring-slider [formControl]="volumeControl" ariaLabel="Minimum volume" />
  <sanring-error-message>Volume must be at least 80.</sanring-error-message>
</sanring-field>`,
} as const;
