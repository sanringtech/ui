import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const radioPage = {
  componentId: 'radio',
  titleKey: 'component.radio',
  descriptionKey: 'radio.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'radio.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'radio.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-with-label',
          titleKey: 'radio.demo.withLabel',
          level: 3,
        },
        {
          id: 'example-horizontal',
          titleKey: 'radio.demo.horizontal',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'radio.demo.disabled',
          level: 3,
        },
      ],
    },
    {
      id: 'api-group',
      titleKey: 'radio.api.group.title',
      descriptionKey: 'radio.api.group.description',
      level: 2,
    },
    {
      id: 'api-item',
      titleKey: 'radio.api.item.title',
      descriptionKey: 'radio.api.item.description',
      level: 2,
    },
  ],
} as const satisfies ComponentPageDefinition;

export const radioGroupApiRows = [
  {
    property: 'class',
    type: 'string',
    defaultValue: "''",
    descriptionKey: 'radio.api.group.class',
  },
  {
    property: 'name',
    type: 'string',
    defaultValue: 'undefined',
    descriptionKey: 'radio.api.group.name',
  },
  {
    property: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    descriptionKey: 'radio.api.group.disabled',
  },
  {
    property: 'required',
    type: 'boolean',
    defaultValue: 'false',
    descriptionKey: 'radio.api.group.required',
  },
  {
    property: 'orientation',
    type: 'RadioOrientation',
    defaultValue: 'RadioOrientation.Vertical',
    descriptionKey: 'radio.api.group.orientation',
  },
  {
    property: 'value',
    type: 'RadioValue | null',
    defaultValue: 'null',
    descriptionKey: 'radio.api.group.value',
  },
  {
    property: 'valueChange',
    type: 'EventEmitter<RadioValue | null>',
    defaultValue: '—',
    descriptionKey: 'radio.api.group.valueChange',
  },
  {
    property: 'ariaLabel',
    type: 'string',
    defaultValue: 'undefined',
    descriptionKey: 'radio.api.group.ariaLabel',
  },
  {
    property: 'ariaLabelledBy',
    type: 'string',
    defaultValue: 'undefined',
    descriptionKey: 'radio.api.group.ariaLabelledBy',
  },
  {
    property: 'ariaDescribedBy',
    type: 'string',
    defaultValue: 'undefined',
    descriptionKey: 'radio.api.group.ariaDescribedBy',
  },
] as const satisfies readonly ComponentPageApiRow[];

export const radioItemApiRows = [
  { property: 'class', type: 'string', defaultValue: "''", descriptionKey: 'radio.api.item.class' },
  {
    property: 'id',
    type: 'string',
    defaultValue: 'generated',
    descriptionKey: 'radio.api.item.id',
  },
  {
    property: 'value',
    type: 'RadioValue',
    defaultValue: '—',
    descriptionKey: 'radio.api.item.value',
  },
  {
    property: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    descriptionKey: 'radio.api.item.disabled',
  },
  {
    property: 'ariaLabel',
    type: 'string',
    defaultValue: 'undefined',
    descriptionKey: 'radio.api.item.ariaLabel',
  },
  {
    property: 'ariaLabelledBy',
    type: 'string',
    defaultValue: 'undefined',
    descriptionKey: 'radio.api.item.ariaLabelledBy',
  },
  {
    property: 'ariaDescribedBy',
    type: 'string',
    defaultValue: 'undefined',
    descriptionKey: 'radio.api.item.ariaDescribedBy',
  },
] as const satisfies readonly ComponentPageApiRow[];

export const radioPageExamples = {
  basic: `<sanring-radio-group [(ngModel)]="value">
  <sanring-radio-item value="option1" />
  <sanring-radio-item value="option2" />
  <sanring-radio-item value="option3" />
</sanring-radio-group>`,

  usageImport: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SANRING_RADIO_IMPORTS } from '@sanring/ui';

@Component({
  imports: [FormsModule, SANRING_RADIO_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-radio-group [(ngModel)]="value">
  <sanring-radio-item value="a" />
  <sanring-radio-item value="b" />
</sanring-radio-group>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioGroupComponent, RadioItemComponent } from '@sanring/ui';

@Component({
  imports: [FormsModule, RadioGroupComponent, RadioItemComponent],
})
export class ExampleComponent {}`,

  withLabel: `<sanring-radio-group [(ngModel)]="value">
  <div class="flex items-center gap-2">
    <sanring-radio-item id="r-default" value="default" />
    <label sanringLabel for="r-default">Default</label>
  </div>
  <div class="flex items-center gap-2">
    <sanring-radio-item id="r-comfortable" value="comfortable" />
    <label sanringLabel for="r-comfortable">Comfortable</label>
  </div>
  <div class="flex items-center gap-2">
    <sanring-radio-item id="r-compact" value="compact" />
    <label sanringLabel for="r-compact">Compact</label>
  </div>
</sanring-radio-group>`,

  horizontal: `<sanring-radio-group [(ngModel)]="value" [orientation]="RadioOrientation.Horizontal">
  <div class="flex items-center gap-2">
    <sanring-radio-item id="h-left" value="left" />
    <label sanringLabel for="h-left">Left</label>
  </div>
  <div class="flex items-center gap-2">
    <sanring-radio-item id="h-center" value="center" />
    <label sanringLabel for="h-center">Center</label>
  </div>
  <div class="flex items-center gap-2">
    <sanring-radio-item id="h-right" value="right" />
    <label sanringLabel for="h-right">Right</label>
  </div>
</sanring-radio-group>`,

  disabled: `<!-- 整個群組停用 -->
<sanring-radio-group [(ngModel)]="value" disabled>
  <div class="flex items-center gap-2">
    <sanring-radio-item id="d1" value="option1" />
    <label sanringLabel for="d1">Option 1</label>
  </div>
  <div class="flex items-center gap-2">
    <sanring-radio-item id="d2" value="option2" />
    <label sanringLabel for="d2">Option 2</label>
  </div>
</sanring-radio-group>

<!-- 單一選項停用 -->
<sanring-radio-group [(ngModel)]="value">
  <div class="flex items-center gap-2">
    <sanring-radio-item id="s1" value="option1" />
    <label sanringLabel for="s1">Option 1</label>
  </div>
  <div class="flex items-center gap-2">
    <sanring-radio-item id="s2" value="option2" disabled />
    <label sanringLabel for="s2">Option 2 (disabled)</label>
  </div>
</sanring-radio-group>`,
} as const;
