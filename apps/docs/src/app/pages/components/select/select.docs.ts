import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

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
      level: 2,
      children: [
        {
          id: 'example-groups',
          titleKey: 'select.demo.groups',
          level: 3,
        },
        {
          id: 'example-custom-icon',
          titleKey: 'select.demo.customIcon',
          level: 3,
        },
        {
          id: 'example-item-aligned',
          titleKey: 'select.demo.itemAligned',
          level: 3,
        },
        {
          id: 'example-disabled-item',
          titleKey: 'select.demo.disabledItem',
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
    {
      property: 'SelectComponent.value',
      type: 'SelectValue | null',
      defaultValue: 'null',
      descriptionKey: 'select.api.value.description',
    },
    {
      property: 'SelectComponent.isOpen',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'select.api.isOpen.description',
    },
    {
      property: 'SelectContentComponent.position',
      type: "'popper' | 'item-aligned'",
      defaultValue: "'popper'",
      descriptionKey: 'select.api.contentPosition.description',
    },
    {
      property: 'SelectContentComponent.matchTriggerWidth',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'select.api.matchTriggerWidth.description',
    },
    {
      property: 'SelectItemComponent.value',
      type: 'SelectValue',
      defaultValue: 'required',
      descriptionKey: 'select.api.itemValue.description',
    },
    {
      property: 'SelectItemComponent.disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'select.api.itemDisabled.description',
    },
    {
      property: 'SelectItemComponent.indicatorPosition',
      type: "'start' | 'end'",
      defaultValue: "'start'",
      descriptionKey: 'select.api.indicatorPosition.description',
    },
    {
      property: 'SelectItemComponent.showIndicator',
      type: 'boolean',
      defaultValue: 'true',
      descriptionKey: 'select.api.showIndicator.description',
    },
    {
      property: '[sanringSelectItemIndicator]',
      type: 'projected content',
      defaultValue: 'LucideCheck',
      descriptionKey: 'select.api.customIndicator.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'select.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const selectPageExamples = {
  basic: `<sanring-select [(ngModel)]="value">
  <button sanringSelectTrigger class="w-[240px]">
    <sanring-select-value placeholder="Choose a workspace" />
  </button>
  <sanring-select-content matchTriggerWidth>
    <sanring-select-item value="design">Design</sanring-select-item>
    <sanring-select-item value="engineering">Engineering</sanring-select-item>
    <sanring-select-item value="support">Customer support operations</sanring-select-item>
  </sanring-select-content>
</sanring-select>`,
  usageImport: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SANRING_SELECT_IMPORTS } from '@sanring/ui';

@Component({
  imports: [FormsModule, SANRING_SELECT_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-select [(ngModel)]="value">
  <button sanringSelectTrigger>
    <sanring-select-value placeholder="Choose a workspace" />
  </button>
  <sanring-select-content>
    <sanring-select-item value="design">Design</sanring-select-item>
    <sanring-select-item value="engineering">Engineering</sanring-select-item>
  </sanring-select-content>
</sanring-select>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SelectComponent,
  SelectContentComponent,
  SelectGroupComponent,
  SelectItemComponent,
  SelectLabelComponent,
  SelectSeparatorComponent,
  SelectTriggerDirective,
  SelectValueComponent,
} from '@sanring/ui';

@Component({
  imports: [
    FormsModule,
    SelectComponent,
    SelectTriggerDirective,
    SelectValueComponent,
    SelectContentComponent,
    SelectGroupComponent,
    SelectLabelComponent,
    SelectItemComponent,
    SelectSeparatorComponent,
  ],
})
export class ExampleComponent {}`,
  groups: `<sanring-select [(ngModel)]="region">
  <button sanringSelectTrigger class="w-[240px]">
    <sanring-select-value placeholder="Choose a region" />
  </button>
  <sanring-select-content matchTriggerWidth>
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
  customIcon: `<sanring-select [(ngModel)]="reviewState">
  <button sanringSelectTrigger class="w-[240px]">
    <sanring-select-value placeholder="Review state" />
  </button>
  <sanring-select-content matchTriggerWidth>
    <sanring-select-item value="approved" indicatorPosition="end">
      Approved
      <svg sanringSelectItemIndicator lucideCircleCheck class="size-4 text-primary" strokeWidth="2.5"></svg>
    </sanring-select-item>
    <sanring-select-item value="pending" indicatorPosition="end">
      Pending
      <svg sanringSelectItemIndicator lucideCircleCheck class="size-4 text-[var(--sanring-muted)]" strokeWidth="2.5"></svg>
    </sanring-select-item>
    <sanring-select-item value="blocked" indicatorPosition="end">
      Blocked
      <svg sanringSelectItemIndicator lucideCircleCheck class="size-4 text-[var(--sanring-border-strong)]" strokeWidth="2.5"></svg>
    </sanring-select-item>
  </sanring-select-content>
</sanring-select>`,
  itemAligned: `<!-- position="item-aligned"：展開時選中的項目會對齊 trigger -->
<sanring-select [(ngModel)]="theme">
  <button sanringSelectTrigger class="w-[200px]">
    <sanring-select-value placeholder="Theme" />
  </button>
  <sanring-select-content position="item-aligned" matchTriggerWidth>
    <sanring-select-item value="light">Light</sanring-select-item>
    <sanring-select-item value="dark">Dark</sanring-select-item>
    <sanring-select-item value="system">System</sanring-select-item>
  </sanring-select-content>
</sanring-select>

<!-- position="popper"（預設）：固定貼齊 trigger 下緣展開 -->
<sanring-select [(ngModel)]="themePopper">
  <button sanringSelectTrigger class="w-[200px]">
    <sanring-select-value placeholder="Theme" />
  </button>
  <sanring-select-content matchTriggerWidth>
    <sanring-select-item value="light">Light</sanring-select-item>
    <sanring-select-item value="dark">Dark</sanring-select-item>
    <sanring-select-item value="system">System</sanring-select-item>
  </sanring-select-content>
</sanring-select>`,
  disabledItem: `<sanring-select [(ngModel)]="plan">
  <button sanringSelectTrigger class="w-[240px]">
    <sanring-select-value placeholder="Choose a plan" />
  </button>
  <sanring-select-content matchTriggerWidth>
    <sanring-select-item value="starter">Starter</sanring-select-item>
    <sanring-select-item value="pro">Pro</sanring-select-item>
    <sanring-select-item value="enterprise" disabled>Enterprise</sanring-select-item>
  </sanring-select-content>
</sanring-select>`,
} as const;
