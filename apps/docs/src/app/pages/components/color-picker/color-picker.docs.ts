import {
  ComponentPageApiRow,
  ComponentPageKeyboardRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const colorPickerPage = {
  componentId: 'color-picker',
  titleKey: 'component.colorPicker',
  descriptionKey: 'colorPicker.description',
  registryDeps: ['component-styles', 'cva-base', 'utils'],
  ssrSafe: true,
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'colorPicker.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'colorPicker.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'colorPicker.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-swatches',
          titleKey: 'colorPicker.demo.swatches',
          descriptionKey: 'colorPicker.examples.swatches.description',
          level: 3,
        },
        { id: 'example-disabled', titleKey: 'colorPicker.demo.disabled', level: 3 },
        {
          id: 'example-field',
          titleKey: 'colorPicker.demo.field',
          descriptionKey: 'colorPicker.examples.field.description',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'colorPicker.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'colorPicker.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'colorPicker.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'colorPicker.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'colorPicker.api.class.description',
    },
    {
      property: 'id',
      type: 'string',
      defaultValue: 'generated',
      descriptionKey: 'colorPicker.api.id.description',
    },
    {
      property: 'value',
      type: 'string',
      defaultValue: '—',
      descriptionKey: 'colorPicker.api.value.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'colorPicker.api.disabled.description',
    },
    {
      property: 'invalid',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'colorPicker.api.invalid.description',
    },
    {
      property: 'required',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'colorPicker.api.required.description',
    },
    {
      property: 'swatches',
      type: 'string[]',
      defaultValue: '[]',
      descriptionKey: 'colorPicker.api.swatches.description',
    },
    {
      property: 'valueChange',
      type: 'EventEmitter<string>',
      defaultValue: '—',
      descriptionKey: 'colorPicker.api.valueChange.description',
    },
    {
      property: 'ariaLabel',
      type: 'string',
      defaultValue: '—',
      descriptionKey: 'colorPicker.api.ariaLabel.description',
    },
    {
      property: 'ariaLabelledBy',
      type: 'string',
      defaultValue: '—',
      descriptionKey: 'colorPicker.api.ariaLabelledBy.description',
    },
    {
      property: 'ariaDescribedBy',
      type: 'string',
      defaultValue: '—',
      descriptionKey: 'colorPicker.api.ariaDescribedBy.description',
    },
    {
      property: 'colorInputLabel',
      type: 'string',
      defaultValue: "'Color'",
      descriptionKey: 'colorPicker.api.colorInputLabel.description',
    },
    {
      property: 'hexInputLabel',
      type: 'string',
      defaultValue: "'Hex'",
      descriptionKey: 'colorPicker.api.hexInputLabel.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: 'Enter / Space', descriptionKey: 'colorPicker.keyboard.enterSpace' },
    { keys: 'Escape', descriptionKey: 'colorPicker.keyboard.escape' },
    { keys: 'Tab / Shift + Tab', descriptionKey: 'colorPicker.keyboard.tab' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const colorPickerPageExamples = {
  basic: `<sanring-color-picker [value]="color" ariaLabel="Brand color" (valueChange)="color = $event" />`,
  usageImport: `import { ColorPickerComponent } from './components/ui/color-picker';`,
  usageMain: `<sanring-color-picker
  [value]="color"
  ariaLabel="Brand color"
  (valueChange)="color = $event"
/>`,
  composition: `sanring-color-picker
└── trigger swatch + hex
    └── popover
        ├── native color input
        ├── hex input
        └── optional swatches`,
  swatches: `<sanring-color-picker
  [value]="color"
  [swatches]="['#0f172a', '#2563eb', '#16a34a', '#e11d48', '#f59e0b', '#fff']"
  ariaLabel="Brand color"
  (valueChange)="color = $event"
/>`,
  disabled: `<sanring-color-picker [value]="'#2563eb'" disabled ariaLabel="Locked color" />`,
  field: `<sanring-field>
  <label sanringLabel for="brand-color">Brand color</label>
  <sanring-color-picker id="brand-color" [formControl]="brandControl" />
</sanring-field>`,
} as const;
