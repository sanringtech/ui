import {
  ComponentPageApiRow,
  ComponentPageKeyboardRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const sortablePage = {
  componentId: 'sortable',
  titleKey: 'component.sortable',
  descriptionKey: 'sortable.description',
  registryDeps: ['utils'],
  ssrSafe: false,
  sections: [
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'sortable.installation.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'sortable.usage.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'sortable.composition.description',
      level: 2,
    },
    {
      id: 'examples',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-basic',
          titleKey: 'toc.basic',
          level: 3,
        },
        {
          id: 'example-handle',
          titleKey: 'sortable.demo.handle',
          level: 3,
        },
        {
          id: 'example-horizontal',
          titleKey: 'sortable.demo.horizontal',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'sortable.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'sortable.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'sortable.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'sortable.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'sortable.api.class.description',
    },
    {
      property: 'data',
      type: 'unknown[]',
      defaultValue: '-',
      descriptionKey: 'sortable.api.data.description',
    },
    {
      property: 'orientation',
      type: "'vertical' | 'horizontal'",
      defaultValue: "'vertical'",
      descriptionKey: 'sortable.api.orientation.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'sortable.api.disabled.description',
    },
    {
      property: 'sorted',
      type: 'OutputEmitterRef<unknown[]>',
      defaultValue: '-',
      descriptionKey: 'sortable.api.sorted.description',
    },
    {
      property: '[sanringSortableItem].disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'sortable.api.itemDisabled.description',
    },
    {
      property: '[sanringSortableHandle]',
      type: 'directive',
      defaultValue: '-',
      descriptionKey: 'sortable.api.handle.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: 'Arrow Up / Arrow Down', descriptionKey: 'sortable.keyboard.arrowsVertical' },
    { keys: 'Arrow Left / Arrow Right', descriptionKey: 'sortable.keyboard.arrowsHorizontal' },
    { keys: 'Tab / Shift + Tab', descriptionKey: 'sortable.keyboard.tabShiftTab' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const sortablePageExamples = {
  usageImport: `import { Component } from '@angular/core';
import { SANRING_SORTABLE_IMPORTS } from './components/ui/sortable';

@Component({
  imports: [SANRING_SORTABLE_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-sortable [data]="items" (sorted)="items = $event">
  @for (item of items; track item.id) {
    <div sanringSortableItem>
      {{ item.label }}
    </div>
  }
</sanring-sortable>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import {
  SortableComponent,
  SortableHandleDirective,
  SortableItemDirective,
} from './components/ui/sortable';

@Component({
  imports: [SortableComponent, SortableItemDirective, SortableHandleDirective],
})
export class ExampleComponent {}`,
  composition: `sanring-sortable
├── [sanringSortableItem]
│   └── [sanringSortableHandle] (optional)
└── …more items`,
  basic: `<sanring-sortable [data]="items" (sorted)="items = $event">
  @for (item of items; track item.id) {
    <div sanringSortableItem>
      <sanring-card>
        <sanring-card-header>
          <h3 sanringCardTitle>{{ item.title }}</h3>
          <p sanringCardDescription>{{ item.description }}</p>
        </sanring-card-header>
      </sanring-card>
    </div>
  }
</sanring-sortable>`,
  handle: `<sanring-sortable [data]="items" (sorted)="items = $event">
  @for (item of items; track item.id) {
    <div sanringSortableItem class="flex items-center gap-3">
      <button sanringSortableHandle type="button" aria-label="Reorder">
        ⋮⋮
      </button>
      <sanring-card class="flex-1">
        <sanring-card-header>
          <h3 sanringCardTitle>{{ item.title }}</h3>
        </sanring-card-header>
      </sanring-card>
    </div>
  }
</sanring-sortable>`,
  horizontal: `<sanring-sortable orientation="horizontal" [data]="items" (sorted)="items = $event">
  @for (item of items; track item) {
    <div sanringSortableItem class="rounded-md border px-3 py-2">
      {{ item }}
    </div>
  }
</sanring-sortable>`,
} as const;
