import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const checkboxPage = {
  componentId: 'checkbox',
  titleKey: 'component.checkbox',
  descriptionKey: 'checkbox.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'checkbox.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'checkbox.usage.description',
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
          id: 'example-indeterminate',
          titleKey: 'checkbox.demo.indeterminate',
          level: 3,
        },
        {
          id: 'example-with-label',
          titleKey: 'checkbox.demo.withLabel',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'checkbox.demo.disabled',
          level: 3,
        },
        {
          id: 'example-state-surface',
          titleKey: 'checkbox.demo.stateSurface',
          level: 3,
        },
        {
          id: 'example-size',
          titleKey: 'checkbox.demo.size',
          level: 3,
        },
        {
          id: 'example-event-binding',
          titleKey: 'checkbox.demo.eventBinding',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'checkbox.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'checkbox.api.class.description',
    },
    {
      property: 'id',
      type: 'string',
      defaultValue: 'generated',
      descriptionKey: 'checkbox.api.id.description',
    },
    {
      property: 'name',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'checkbox.api.name.description',
    },
    {
      property: 'value',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'checkbox.api.value.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'checkbox.api.disabled.description',
    },
    {
      property: 'required',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'checkbox.api.required.description',
    },
    {
      property: 'checked',
      type: 'CheckedState',
      defaultValue: 'false',
      descriptionKey: 'checkbox.api.checked.description',
    },
    {
      property: 'checkedChange',
      type: 'EventEmitter<CheckedState>',
      defaultValue: '—',
      descriptionKey: 'checkbox.api.checkedChange.description',
    },
    {
      property: 'tabIndex',
      type: 'number',
      defaultValue: '0',
      descriptionKey: 'checkbox.api.tabIndex.description',
    },
    {
      property: 'ariaLabel',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'checkbox.api.ariaLabel.description',
    },
    {
      property: 'ariaLabelledBy',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'checkbox.api.ariaLabelledBy.description',
    },
    {
      property: 'ariaDescribedBy',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'checkbox.api.ariaDescribedBy.description',
    },
    {
      property: 'size',
      type: 'CheckboxSize',
      defaultValue: 'CheckboxSize.Md',
      descriptionKey: 'checkbox.api.size.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const checkboxPageExamples = {
  basic: `<sanring-checkbox [(ngModel)]="isChecked" />`,
  usageImport: `import { CheckboxComponent } from '@sanring/ui';`,
  usageMain: `<sanring-checkbox [(ngModel)]="isChecked" />`,
  indeterminate: `<sanring-checkbox [(ngModel)]="state" />`,
  withLabel: `<div class="flex items-center gap-2">
  <sanring-checkbox id="terms" [(ngModel)]="accepted" />
  <label sanringLabel for="terms">Accept terms and conditions</label>
</div>`,
  disabled: `<div class="flex items-center gap-4">
  <sanring-checkbox disabled />
  <sanring-checkbox disabled [(ngModel)]="checked" />
</div>`,
  stateSurface: `<div class="rounded-[var(--sanring-radius)] bg-slate-100 p-5 dark:bg-slate-800/70">
  <div class="grid gap-4 sm:grid-cols-3">
    <div class="flex items-center gap-2">
      <sanring-checkbox [ngModel]="false" />
      <span>Unchecked</span>
    </div>
    <div class="flex items-center gap-2">
      <sanring-checkbox [ngModel]="true" />
      <span>Checked</span>
    </div>
    <div class="flex items-center gap-2">
      <sanring-checkbox [ngModel]="'indeterminate'" />
      <span>Indeterminate</span>
    </div>
    <div class="flex items-center gap-2">
      <sanring-checkbox disabled [ngModel]="false" />
      <span>Disabled unchecked</span>
    </div>
    <div class="flex items-center gap-2">
      <sanring-checkbox disabled [ngModel]="true" />
      <span>Disabled checked</span>
    </div>
    <div class="flex items-center gap-2">
      <sanring-checkbox disabled [ngModel]="'indeterminate'" />
      <span>Disabled indeterminate</span>
    </div>
  </div>
</div>`,
  size: `<div class="flex items-center gap-6">
  <div class="flex flex-col items-center gap-2">
    <sanring-checkbox [size]="CheckboxSize.Sm" [(ngModel)]="checked" />
    <span class="text-xs text-muted-foreground">Sm</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <sanring-checkbox [size]="CheckboxSize.Md" [(ngModel)]="checked" />
    <span class="text-xs text-muted-foreground">Md</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <sanring-checkbox [size]="CheckboxSize.Lg" [(ngModel)]="checked" />
    <span class="text-xs text-muted-foreground">Lg</span>
  </div>
</div>`,
  eventBinding: `<!-- [(checked)] works without Angular forms -->
<sanring-checkbox [(checked)]="isChecked" />
<span>{{ isChecked ? 'Checked' : 'Unchecked' }}</span>

<!-- or listen to the output directly -->
<sanring-checkbox (checkedChange)="onCheckedChange($event)" />`,
} as const;
