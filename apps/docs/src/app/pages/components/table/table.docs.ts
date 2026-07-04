import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const tablePage = {
  componentId: 'table',
  titleKey: 'component.table',
  descriptionKey: 'table.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'table.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'table.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'table.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-sortable', titleKey: 'table.demo.sortable', level: 3 },
        { id: 'example-empty', titleKey: 'table.demo.empty', level: 3 },
        { id: 'example-actions', titleKey: 'table.demo.actions', level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'table.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'sanringTable',
      type: 'Directive',
      defaultValue: '—',
      descriptionKey: 'table.api.sanringTable.description',
    },
    {
      property: 'sanringColumnDef',
      type: 'Directive',
      defaultValue: '—',
      descriptionKey: 'table.api.sanringColumnDef.description',
    },
    {
      property: 'sanringHeaderCellDef / sanringCellDef / sanringFooterCellDef',
      type: 'Directive',
      defaultValue: '—',
      descriptionKey: 'table.api.cellDef.description',
    },
    {
      property: 'sanringHeaderCell / sanringCell / sanringFooterCell',
      type: 'Directive',
      defaultValue: '—',
      descriptionKey: 'table.api.cell.description',
    },
    {
      property: 'sanringHeaderRowDef / sanringRowDef / sanringFooterRowDef',
      type: 'Directive',
      defaultValue: '—',
      descriptionKey: 'table.api.rowDef.description',
    },
    {
      property: 'sanringRow',
      type: 'Directive',
      defaultValue: '—',
      descriptionKey: 'table.api.row.description',
    },
    {
      property: 'sanringSort',
      type: 'Directive',
      defaultValue: 'null',
      descriptionKey: 'table.api.sort.description',
    },
    {
      property: 'sanringSortHeader',
      type: 'Component',
      defaultValue: '—',
      descriptionKey: 'table.api.sortHeader.description',
    },
    {
      property: 'sanringNoDataRow',
      type: 'Directive',
      defaultValue: '—',
      descriptionKey: 'table.api.noDataRow.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const tablePageExamples = {
  basic: `<sanring-table-container>
  <table cdk-table sanringTable [dataSource]="invoices">
    <ng-container sanringColumnDef="invoice">
      <th sanringHeaderCell *sanringHeaderCellDef>Invoice</th>
      <td sanringCell *sanringCellDef="let invoice">{{ invoice.id }}</td>
    </ng-container>

    <ng-container sanringColumnDef="customer">
      <th sanringHeaderCell *sanringHeaderCellDef>Customer</th>
      <td sanringCell *sanringCellDef="let invoice">{{ invoice.customer }}</td>
    </ng-container>

    <ng-container sanringColumnDef="amount">
      <th sanringHeaderCell *sanringHeaderCellDef>Amount</th>
      <td sanringCell *sanringCellDef="let invoice">{{ invoice.amount }}</td>
    </ng-container>

    <tr cdk-header-row sanringRow *sanringHeaderRowDef="displayedColumns"></tr>
    <tr cdk-row sanringRow *sanringRowDef="let row; columns: displayedColumns"></tr>
  </table>
</sanring-table-container>`,

  usageImport: `import { CdkTableModule } from '@angular/cdk/table';
import {
  SortDirective,
  SortHeaderComponent,
  TableCellDefDirective,
  TableCellDirective,
  TableColumnDefDirective,
  TableContainerComponent,
  TableDirective,
  TableHeaderCellDefDirective,
  TableHeaderCellDirective,
  TableHeaderRowDefDirective,
  TableHeaderRowDirective,
  TableNoDataRowDirective,
  TableRowDefDirective,
  TableRowDirective,
} from '@sanring/ui';`,

  usageMain: `<table
  cdk-table
  sanringTable
  [sanringSort]="sortState()"
  [dataSource]="rows"
  (sanringSortChange)="sortState.set($event)"
>
  <!-- define columns with sanringColumnDef -->
</table>`,

  sortable: `<table
  cdk-table
  sanringTable
  [sanringSort]="sortState()"
  [dataSource]="sortedInvoices()"
  (sanringSortChange)="sortState.set($event)"
>
  <ng-container sanringColumnDef="invoice">
    <th sanringSortHeader="invoice" *sanringHeaderCellDef>Invoice</th>
    <td sanringCell *sanringCellDef="let invoice">{{ invoice.id }}</td>
  </ng-container>
</table>`,

  empty: `<table cdk-table sanringTable [dataSource]="[]">
  <!-- columns... -->
  <tr *sanringNoDataRow>
    <td [attr.colspan]="displayedColumns.length">No invoices found.</td>
  </tr>
</table>`,

  actions: `<ng-container sanringColumnDef="actions">
  <th sanringHeaderCell *sanringHeaderCellDef class="text-right">Actions</th>
  <td sanringCell *sanringCellDef="let invoice" class="text-right">
    <sanring-dropdown-menu>
      <button
        sanringBtn
        variant="ghost"
        size="icon"
        aria-label="Open invoice actions"
        sanringDropdownMenuTrigger
        [menu]="invoiceActions.menu"
      >
        <svg lucideEllipsis class="size-4"></svg>
      </button>

      <sanring-dropdown-menu-content #invoiceActions="sanringDropdownMenuContent" class="w-44">
        <button sanringDropdownMenuItem type="button" value="open">
          <svg lucideFile class="size-4"></svg>
          <span>Open invoice</span>
        </button>
        <button sanringDropdownMenuItem type="button" value="edit">
          <svg lucideSettings class="size-4"></svg>
          <span>Edit details</span>
        </button>
        <sanring-dropdown-menu-separator />
        <button sanringDropdownMenuItem type="button" value="delete" variant="destructive">
          <svg lucideTrash2 class="size-4"></svg>
          <span>Delete</span>
        </button>
      </sanring-dropdown-menu-content>
    </sanring-dropdown-menu>
  </td>
</ng-container>`,
} as const;
