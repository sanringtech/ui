import { ComponentPageApiRow, ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const selectPage = {
  componentId: 'select',
  titleKey: 'component.select',
  descriptionKey: 'select.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'select.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'select.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'select.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'select.examples.description',
      level: 2,
      children: [
        {
          id: 'example-groups',
          titleKey: 'select.demo.groups',
          level: 3,
        },
        {
          id: 'example-disabled-item',
          titleKey: 'select.demo.disabledItem',
          level: 3,
        },
        {
          id: 'example-indicator',
          titleKey: 'select.demo.indicator',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'select.api.description',
      level: 2,
    },
  ],
  apiRows: [
    { property: 'SelectComponent.value', type: 'SelectValue | null', defaultValue: 'null', descriptionKey: 'select.api.value.description' },
    { property: 'SelectComponent.isOpen', type: 'boolean', defaultValue: 'false', descriptionKey: 'select.api.isOpen.description' },
    { property: 'SelectItemComponent.value', type: 'SelectValue', defaultValue: 'required', descriptionKey: 'select.api.itemValue.description' },
    { property: 'SelectItemComponent.disabled', type: 'boolean', defaultValue: 'false', descriptionKey: 'select.api.itemDisabled.description' },
    { property: 'SelectItemComponent.indicatorPosition', type: "'start' | 'end'", defaultValue: "'start'", descriptionKey: 'select.api.indicatorPosition.description' },
    { property: 'SelectItemComponent.showIndicator', type: 'boolean', defaultValue: 'true', descriptionKey: 'select.api.showIndicator.description' },
    { property: '[sanringSelectItemIndicator]', type: 'projected content', defaultValue: 'LucideCheck', descriptionKey: 'select.api.customIndicator.description' },
    { property: 'class', type: 'string', defaultValue: 'undefined', descriptionKey: 'select.api.class.description' },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const selectPageExamples = {
  basic: `<sanring-select [(ngModel)]="value">
  <button sanringSelectTrigger>
    <sanring-select-value placeholder="Choose a workspace" />
  </button>
  <sanring-select-content>
    <sanring-select-item value="design">Design</sanring-select-item>
    <sanring-select-item value="engineering">Engineering</sanring-select-item>
    <sanring-select-item value="support">Support</sanring-select-item>
  </sanring-select-content>
</sanring-select>`,
  usageImport: `import { FormsModule } from '@angular/forms';
import { SANRING_SELECT_IMPORTS } from '@sanring/ui';`,
  usageMain: `<sanring-select [(ngModel)]="value">
  <button sanringSelectTrigger>
    <sanring-select-value placeholder="Choose a workspace" />
  </button>
  <sanring-select-content>
    <sanring-select-item value="design">Design</sanring-select-item>
    <sanring-select-item value="engineering">Engineering</sanring-select-item>
  </sanring-select-content>
</sanring-select>`,
  groups: `<sanring-select [(ngModel)]="region">
  <button sanringSelectTrigger>
    <sanring-select-value placeholder="Choose a region" />
  </button>
  <sanring-select-content>
    <sanring-select-group>
      <sanring-select-label>Asia Pacific</sanring-select-label>
      <sanring-select-item value="taipei">Taipei</sanring-select-item>
      <sanring-select-item value="tokyo">Tokyo</sanring-select-item>
    </sanring-select-group>
    <sanring-select-separator />
    <sanring-select-group>
      <sanring-select-label>North America</sanring-select-label>
      <sanring-select-item value="sf">San Francisco</sanring-select-item>
      <sanring-select-item value="nyc">New York</sanring-select-item>
    </sanring-select-group>
  </sanring-select-content>
</sanring-select>`,
  disabledItem: `<sanring-select [(ngModel)]="plan">
  <button sanringSelectTrigger>
    <sanring-select-value placeholder="Choose a plan" />
  </button>
  <sanring-select-content>
    <sanring-select-item value="starter">Starter</sanring-select-item>
    <sanring-select-item value="pro">Pro</sanring-select-item>
    <sanring-select-item value="enterprise" disabled>Enterprise</sanring-select-item>
  </sanring-select-content>
</sanring-select>`,
  indicator: `<sanring-select [(ngModel)]="status">
  <button sanringSelectTrigger>
    <sanring-select-value placeholder="Choose a status" />
  </button>
  <sanring-select-content>
    <sanring-select-item value="draft" indicatorPosition="end">
      Draft
      <span sanringSelectItemIndicator class="size-2 rounded-full bg-[var(--sanring-muted)]"></span>
    </sanring-select-item>
    <sanring-select-item value="live" indicatorPosition="end">
      Live
      <span sanringSelectItemIndicator class="size-2 rounded-full bg-primary"></span>
    </sanring-select-item>
    <sanring-select-item value="archived" indicatorPosition="end">
      Archived
      <span sanringSelectItemIndicator class="size-2 rounded-full bg-[var(--sanring-border-strong)]"></span>
    </sanring-select-item>
  </sanring-select-content>
</sanring-select>`,
} as const;
