import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const comboboxPage = {
  componentId: 'combobox',
  titleKey: 'component.combobox',
  descriptionKey: 'combobox.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'combobox.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'combobox.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'combobox.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'combobox.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-multiple', titleKey: 'toc.multiple', level: 3 },
        { id: 'example-groups', titleKey: 'combobox.demo.groups', level: 3 },
        { id: 'example-popup', titleKey: 'combobox.demo.popup', level: 3 },
        { id: 'example-clear', titleKey: 'combobox.demo.clearButtonTitle', level: 3 },
        { id: 'example-disabled', titleKey: 'toc.disabled', level: 3 },
        {
          id: 'example-field',
          titleKey: 'combobox.demo.field',
          descriptionKey: 'combobox.examples.field.description',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'combobox.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'ComboboxComponent.value',
      type: 'string | string[] | null',
      defaultValue: 'null',
      descriptionKey: 'combobox.api.value.description',
    },
    {
      property: 'ComboboxComponent.multiple',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'combobox.api.multiple.description',
    },
    {
      property: 'ComboboxComponent.disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'combobox.api.disabled.description',
    },
    {
      property: 'ComboboxInputComponent.placeholder',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'combobox.api.placeholder.description',
    },
    {
      property: 'ComboboxInputComponent.showClear',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'combobox.api.showClear.description',
    },
    {
      property: 'ComboboxItemComponent.value',
      type: 'string',
      defaultValue: 'required',
      descriptionKey: 'combobox.api.itemValue.description',
    },
    {
      property: 'ComboboxItemComponent.label',
      type: 'string',
      defaultValue: 'value',
      descriptionKey: 'combobox.api.itemLabel.description',
    },
    {
      property: 'ComboboxGroupComponent.heading',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'combobox.api.heading.description',
    },
    {
      property: 'sanringComboboxTrigger',
      type: 'directive',
      defaultValue: '—',
      descriptionKey: 'combobox.api.trigger.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'combobox.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const comboboxPageExamples = {
  basic: `<sanring-combobox [(value)]="framework">
  <sanring-combobox-label>Framework</sanring-combobox-label>
  <sanring-combobox-input placeholder="Select a framework" />
  <sanring-combobox-content>
    <sanring-combobox-empty>No frameworks found.</sanring-combobox-empty>
    <sanring-combobox-list>
      @for (item of frameworks; track item.value) {
        <sanring-combobox-item [value]="item.value" [label]="item.label">
          {{ item.label }}
        </sanring-combobox-item>
      }
    </sanring-combobox-list>
  </sanring-combobox-content>
</sanring-combobox>`,

  usageImport: `import { Component } from '@angular/core';
import { SANRING_COMBOBOX_IMPORTS } from './components/ui/combobox';

@Component({
  imports: [SANRING_COMBOBOX_IMPORTS],
})
export class ExampleComponent {}`,

  usageIndividualImports: `import { Component } from '@angular/core';
import { ComboboxComponent, ComboboxContentComponent, ComboboxEmptyComponent, ComboboxGroupComponent, ComboboxInputComponent, ComboboxItemComponent, ComboboxLabelComponent, ComboboxListComponent, ComboboxSeparatorComponent, ComboboxTriggerDirective } from './components/ui/combobox';

@Component({
  imports: [
    ComboboxComponent,
    ComboboxContentComponent,
    ComboboxEmptyComponent,
    ComboboxGroupComponent,
    ComboboxInputComponent,
    ComboboxItemComponent,
    ComboboxLabelComponent,
    ComboboxListComponent,
    ComboboxSeparatorComponent,
    ComboboxTriggerDirective,
  ],
})
export class ExampleComponent {}`,

  usageMain: `<sanring-combobox [(value)]="value">
  <sanring-combobox-input placeholder="Search..." />
  <sanring-combobox-content>
    <sanring-combobox-empty>No results found.</sanring-combobox-empty>
    <sanring-combobox-list>
      @for (item of items; track item.value) {
        <sanring-combobox-item [value]="item.value" [label]="item.label">
          {{ item.label }}
        </sanring-combobox-item>
      }
    </sanring-combobox-list>
  </sanring-combobox-content>
</sanring-combobox>`,

  composition: `sanring-combobox
├── sanring-combobox-label (optional)
├── sanring-combobox-input
└── sanring-combobox-content
    ├── sanring-combobox-empty
    └── sanring-combobox-list
        ├── sanring-combobox-group (optional)
        │   └── sanring-combobox-item
        ├── sanring-combobox-separator (optional)
        └── sanring-combobox-item

multiple mode — chips and the input share ONE bordered box
└── sanring-combobox-chip-input
    ├── sanring-combobox-chip (one per selected value)
    └── sanring-combobox-input (renders chrome-less when nested here)

popup mode — swap the trigger for the input once open
├── button[sanringComboboxTrigger]   // shown while closed
└── sanring-combobox-input            // shown while open, via #combo="sanringCombobox"`,

  multiple: `<sanring-combobox [multiple]="true" [(value)]="selectedFrameworks">
  <sanring-combobox-label>Frameworks</sanring-combobox-label>
  <sanring-combobox-chip-input>
    @for (value of selectedFrameworks; track value) {
      <sanring-combobox-chip [value]="value">{{ labelFor(value) }}</sanring-combobox-chip>
    }
    <sanring-combobox-input />
  </sanring-combobox-chip-input>
  <sanring-combobox-content>
    <sanring-combobox-empty>No frameworks found.</sanring-combobox-empty>
    <sanring-combobox-list>
      @for (item of frameworks; track item.value) {
        <sanring-combobox-item [value]="item.value" [label]="item.label">
          {{ item.label }}
        </sanring-combobox-item>
      }
    </sanring-combobox-list>
  </sanring-combobox-content>
</sanring-combobox>`,

  groups: `<sanring-combobox [(value)]="library">
  <sanring-combobox-input placeholder="Search libraries" />
  <sanring-combobox-content>
    <sanring-combobox-empty>No libraries found.</sanring-combobox-empty>
    <sanring-combobox-list>
      <sanring-combobox-group heading="Frontend">
        <sanring-combobox-item value="angular">Angular</sanring-combobox-item>
        <sanring-combobox-item value="react">React</sanring-combobox-item>
      </sanring-combobox-group>
      <sanring-combobox-separator />
      <sanring-combobox-group heading="Meta frameworks">
        <sanring-combobox-item value="next">Next.js</sanring-combobox-item>
        <sanring-combobox-item value="nuxt">Nuxt</sanring-combobox-item>
      </sanring-combobox-group>
    </sanring-combobox-list>
  </sanring-combobox-content>
</sanring-combobox>`,

  popup: `<sanring-combobox #combo="sanringCombobox" [(value)]="country">
  <button type="button" sanringComboboxTrigger sanringBtn variant="outline" class="justify-between">
    {{ labelFor(country) || 'Select country' }}
    <svg lucideChevronDown class="size-4 opacity-60" [class.rotate-180]="combo.isOpen()"></svg>
  </button>
  <sanring-combobox-content>
    <div class="border-b border-[var(--sanring-border)] p-2">
      <sanring-combobox-input placeholder="Search" />
    </div>
    <sanring-combobox-empty>No countries found.</sanring-combobox-empty>
    <sanring-combobox-list>
      @for (item of countries; track item.value) {
        <sanring-combobox-item [value]="item.value" [label]="item.label">
          {{ item.label }}
        </sanring-combobox-item>
      }
    </sanring-combobox-list>
  </sanring-combobox-content>
</sanring-combobox>`,

  clear: `<sanring-combobox [(value)]="clearDemoValue">
  <sanring-combobox-input placeholder="Search libraries" [showClear]="true" />
  <sanring-combobox-content>
    <sanring-combobox-empty>No libraries found.</sanring-combobox-empty>
    <sanring-combobox-list>
      @for (item of frameworks; track item.value) {
        <sanring-combobox-item [value]="item.value" [label]="item.label">
          {{ item.label }}
        </sanring-combobox-item>
      }
    </sanring-combobox-list>
  </sanring-combobox-content>
</sanring-combobox>`,

  disabled: `<sanring-combobox [disabled]="true">
  <sanring-combobox-input placeholder="Disabled combobox" />
</sanring-combobox>`,

  field: `<sanring-field>
  <sanring-combobox [formControl]="frameworkControl">
    <sanring-combobox-input placeholder="Select a framework" />
    <sanring-combobox-content>
      <sanring-combobox-empty>No frameworks found.</sanring-combobox-empty>
      <sanring-combobox-list>
        @for (item of frameworks; track item.value) {
          <sanring-combobox-item [value]="item.value" [label]="item.label">
            {{ item.label }}
          </sanring-combobox-item>
        }
      </sanring-combobox-list>
    </sanring-combobox-content>
  </sanring-combobox>
  <sanring-error-message>Please choose a framework.</sanring-error-message>
</sanring-field>`,
} as const;
