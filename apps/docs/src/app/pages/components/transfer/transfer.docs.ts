import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const transferPage = {
  componentId: 'transfer',
  titleKey: 'component.transfer',
  descriptionKey: 'transfer.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'transfer.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'transfer.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'transfer.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'transfer.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'transfer.examples.description',
      level: 2,
      children: [
        {
          id: 'example-disabled',
          titleKey: 'transfer.demo.disabled',
          level: 3,
        },
        {
          id: 'example-header-count',
          titleKey: 'transfer.demo.headerCount',
          level: 3,
        },
        {
          id: 'example-custom-actions',
          titleKey: 'transfer.demo.customActions',
          level: 3,
        },
        {
          id: 'example-one-way',
          titleKey: 'transfer.demo.oneWay',
          level: 3,
        },
        {
          id: 'example-search',
          titleKey: 'transfer.demo.search',
          level: 3,
        },
        {
          id: 'example-pagination',
          titleKey: 'transfer.demo.pagination',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'transfer.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'TransferComponent.items',
      type: 'TransferItem[]',
      defaultValue: '[]',
      descriptionKey: 'transfer.api.items.description',
    },
    {
      property: 'TransferComponent.selectedKeys',
      type: 'string[]',
      defaultValue: '[]',
      descriptionKey: 'transfer.api.selectedKeys.description',
    },
    {
      property: 'TransferPanelComponent.direction',
      type: "'source' | 'target'",
      defaultValue: 'required',
      descriptionKey: 'transfer.api.direction.description',
    },
    {
      property: 'TransferPanelComponent.class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'transfer.api.panelClass.description',
    },
    {
      property: 'TransferHeaderComponent.class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'transfer.api.headerClass.description',
    },
    {
      property: 'TransferActionDirective.class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'transfer.api.actionClass.description',
    },
    {
      property: 'TransferComponent.mode',
      type: "'two-way' | 'one-way'",
      defaultValue: "'two-way'",
      descriptionKey: 'transfer.api.mode.description',
    },
    {
      property: 'TransferPanelComponent.pageSize',
      type: 'number',
      defaultValue: 'undefined',
      descriptionKey: 'transfer.api.pageSize.description',
    },
    {
      property: 'TransferPanelComponent.setQuery(value)',
      type: 'void',
      defaultValue: '—',
      descriptionKey: 'transfer.api.setQuery.description',
    },
    {
      property: 'TransferPanelComponent.currentPage / totalPages',
      type: 'number',
      defaultValue: '—',
      descriptionKey: 'transfer.api.pageState.description',
    },
    {
      property: 'TransferPanelComponent.nextPage() / previousPage()',
      type: 'void',
      defaultValue: '—',
      descriptionKey: 'transfer.api.pageNav.description',
    },
    {
      property: 'TransferPanelComponent.interactive',
      type: 'boolean',
      defaultValue: '—',
      descriptionKey: 'transfer.api.interactive.description',
    },
    {
      property: 'TransferItem.key',
      type: 'string',
      defaultValue: 'required',
      descriptionKey: 'transfer.api.itemKey.description',
    },
    {
      property: 'TransferItem.label',
      type: 'string',
      defaultValue: 'required',
      descriptionKey: 'transfer.api.itemLabel.description',
    },
    {
      property: 'TransferItem.disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'transfer.api.itemDisabled.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const transferPageExamples = {
  composition: `sanring-transfer
├── sanring-transfer-panel (direction="source")
│   ├── sanring-transfer-header
│   └── sanring-transfer-list
│       └── sanring-transfer-item (generated from items)
├── [sanringTransferAction] (move buttons)
└── sanring-transfer-panel (direction="target")
    ├── sanring-transfer-header
    └── sanring-transfer-list
        └── sanring-transfer-item (generated from items)`,
  basic: `<sanring-transfer #transfer [items]="items" [(selectedKeys)]="selectedKeys">
  <sanring-transfer-panel direction="source" class="h-72 w-56">
    <sanring-transfer-header>Available</sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>

  <div sanringTransferAction>
    <button sanringBtn variant="outline" size="icon" (click)="transfer.moveToTarget()">
      <svg lucideChevronRight class="size-4"></svg>
    </button>
    <button sanringBtn variant="outline" size="icon" (click)="transfer.moveToSource()">
      <svg lucideChevronLeft class="size-4"></svg>
    </button>
  </div>

  <sanring-transfer-panel direction="target" class="h-72 w-56">
    <sanring-transfer-header>Selected</sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>
</sanring-transfer>`,
  usageImport: `import { Component } from '@angular/core';
import { SANRING_TRANSFER_IMPORTS } from './components/ui/transfer';

@Component({
  imports: [SANRING_TRANSFER_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<sanring-transfer [items]="items" [(selectedKeys)]="selectedKeys">
  <sanring-transfer-panel direction="source">
    <sanring-transfer-header>Available</sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>

  <div sanringTransferAction>
    <button sanringBtn size="icon" (click)="transfer.moveToTarget()">→</button>
    <button sanringBtn size="icon" (click)="transfer.moveToSource()">←</button>
  </div>

  <sanring-transfer-panel direction="target">
    <sanring-transfer-header>Selected</sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>
</sanring-transfer>`,
  disabled: `<sanring-transfer #transfer [items]="itemsWithDisabled" [(selectedKeys)]="selectedKeys">
  <sanring-transfer-panel direction="source" class="h-72 w-56">
    <sanring-transfer-header>Available</sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>

  <div sanringTransferAction>
    <button sanringBtn variant="outline" size="icon" (click)="transfer.moveToTarget()">
      <svg lucideChevronRight class="size-4"></svg>
    </button>
    <button sanringBtn variant="outline" size="icon" (click)="transfer.moveToSource()">
      <svg lucideChevronLeft class="size-4"></svg>
    </button>
  </div>

  <sanring-transfer-panel direction="target" class="h-72 w-56">
    <sanring-transfer-header>Selected</sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>
</sanring-transfer>`,
  headerCount: `<sanring-transfer #transfer [items]="items" [(selectedKeys)]="counted">
  <sanring-transfer-panel direction="source" class="h-72 w-56">
    <sanring-transfer-header>
      <span>Available</span>
      <span class="text-xs text-[var(--docs-muted)]">
        {{ items.length - counted.length }}
      </span>
    </sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>

  <div sanringTransferAction>
    <button sanringBtn variant="outline" size="icon" (click)="transfer.moveToTarget()">
      <svg lucideChevronRight class="size-4"></svg>
    </button>
    <button sanringBtn variant="outline" size="icon" (click)="transfer.moveToSource()">
      <svg lucideChevronLeft class="size-4"></svg>
    </button>
  </div>

  <sanring-transfer-panel direction="target" class="h-72 w-56">
    <sanring-transfer-header>
      <span>Selected</span>
      <span class="text-xs text-[var(--docs-muted)]">{{ counted.length }}</span>
    </sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>
</sanring-transfer>`,
  customActions: `<sanring-transfer #transfer [items]="items" [(selectedKeys)]="selectedKeys">
  <sanring-transfer-panel direction="source" class="h-72 w-56">
    <sanring-transfer-header>Available</sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>

  <div sanringTransferAction>
    <button sanringBtn variant="outline" size="sm" (click)="transfer.moveToTarget()">
      <svg lucideChevronRight class="size-4"></svg>
      Add
    </button>
    <button sanringBtn variant="ghost" size="sm" (click)="transfer.moveToSource()">
      <svg lucideChevronLeft class="size-4"></svg>
      Remove
    </button>
  </div>

  <sanring-transfer-panel direction="target" class="h-72 w-56">
    <sanring-transfer-header>Selected</sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>
</sanring-transfer>`,
  oneWay: `<sanring-transfer #transfer [items]="items" [(selectedKeys)]="selectedKeys" mode="one-way">
  <sanring-transfer-panel direction="source" class="h-72 w-56">
    <sanring-transfer-header>Available</sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>

  <div sanringTransferAction>
    <button sanringBtn variant="outline" size="icon" (click)="transfer.moveToTarget()">
      <svg lucideChevronRight class="size-4"></svg>
    </button>
  </div>

  <!-- one-way 模式下 target 面板是唯讀展示，checkbox 會自動變成 disabled -->
  <sanring-transfer-panel direction="target" class="h-72 w-56">
    <sanring-transfer-header>Selected</sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>
</sanring-transfer>`,
  search: `<sanring-transfer #transfer [items]="items" [(selectedKeys)]="selectedKeys">
  <sanring-transfer-panel direction="source" class="h-72 w-56" #sourcePanel="sanringTransferPanel">
    <sanring-transfer-header>Available</sanring-transfer-header>
    <input
      sanringInput
      type="search"
      placeholder="Search..."
      class="mx-2 my-1.5 h-8 text-xs"
      (input)="sourcePanel.setQuery($any($event.target).value)"
    />
    <sanring-transfer-list />
  </sanring-transfer-panel>

  <div sanringTransferAction>
    <button sanringBtn variant="outline" size="icon" (click)="transfer.moveToTarget()">
      <svg lucideChevronRight class="size-4"></svg>
    </button>
    <button sanringBtn variant="outline" size="icon" (click)="transfer.moveToSource()">
      <svg lucideChevronLeft class="size-4"></svg>
    </button>
  </div>

  <sanring-transfer-panel direction="target" class="h-72 w-56" #targetPanel="sanringTransferPanel">
    <sanring-transfer-header>Selected</sanring-transfer-header>
    <input
      sanringInput
      type="search"
      placeholder="Search..."
      class="mx-2 my-1.5 h-8 text-xs"
      (input)="targetPanel.setQuery($any($event.target).value)"
    />
    <sanring-transfer-list />
  </sanring-transfer-panel>
</sanring-transfer>`,
  pagination: `<sanring-transfer #transfer [items]="items" [(selectedKeys)]="selectedKeys">
  <sanring-transfer-panel
    direction="source"
    class="h-72 w-56"
    [pageSize]="4"
    #sourcePanel="sanringTransferPanel"
  >
    <sanring-transfer-header>Available</sanring-transfer-header>
    <sanring-transfer-list />
    <div class="flex items-center justify-between border-t px-2 py-1.5 text-xs">
      <button sanringBtn variant="ghost" size="sm" [disabled]="!sourcePanel.hasPreviousPage()" (click)="sourcePanel.previousPage()">
        Prev
      </button>
      <span>{{ sourcePanel.currentPage() + 1 }} / {{ sourcePanel.totalPages() }}</span>
      <button sanringBtn variant="ghost" size="sm" [disabled]="!sourcePanel.hasNextPage()" (click)="sourcePanel.nextPage()">
        Next
      </button>
    </div>
  </sanring-transfer-panel>

  <div sanringTransferAction>
    <button sanringBtn variant="outline" size="icon" (click)="transfer.moveToTarget()">
      <svg lucideChevronRight class="size-4"></svg>
    </button>
    <button sanringBtn variant="outline" size="icon" (click)="transfer.moveToSource()">
      <svg lucideChevronLeft class="size-4"></svg>
    </button>
  </div>

  <sanring-transfer-panel direction="target" class="h-72 w-56">
    <sanring-transfer-header>Selected</sanring-transfer-header>
    <sanring-transfer-list />
  </sanring-transfer-panel>
</sanring-transfer>`,
} as const;
