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
        { id: 'example-column-sizing', titleKey: 'table.demo.columnSizing', level: 3 },
        { id: 'example-sticky', titleKey: 'table.demo.sticky', level: 3 },
        { id: 'example-empty', titleKey: 'table.demo.empty', level: 3 },
        { id: 'example-selection', titleKey: 'table.demo.selection', level: 3 },
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

  columnSizing: `<sanring-table-container>
  <table cdk-table sanringTable [dataSource]="invoices">
    <ng-container sanringColumnDef="select" width="48px">
      <th sanringHeaderCell *sanringHeaderCellDef></th>
      <td sanringCell *sanringCellDef="let invoice">
        <sanring-checkbox [ariaLabel]="'Select invoice ' + invoice.id" />
      </td>
    </ng-container>

    <ng-container sanringColumnDef="invoice" [ratio]="1">
      <th sanringHeaderCell *sanringHeaderCellDef>Invoice</th>
      <td sanringCell *sanringCellDef="let invoice" class="truncate">{{ invoice.id }}</td>
    </ng-container>

    <ng-container sanringColumnDef="customer" [ratio]="2">
      <th sanringHeaderCell *sanringHeaderCellDef>Customer</th>
      <td sanringCell *sanringCellDef="let invoice" class="truncate">{{ invoice.customer }}</td>
    </ng-container>

    <ng-container sanringColumnDef="amount" [ratio]="1">
      <th sanringHeaderCell *sanringHeaderCellDef class="text-right">Amount</th>
      <td sanringCell *sanringCellDef="let invoice" class="text-right tabular-nums">
        {{ invoice.amount }}
      </td>
    </ng-container>

    <ng-container sanringColumnDef="actions" width="56px">
      <th sanringHeaderCell *sanringHeaderCellDef class="text-right">Actions</th>
      <td sanringCell *sanringCellDef="let invoice" class="text-right">
        <button sanringBtn variant="ghost" size="icon" aria-label="Open actions">
          <svg lucideEllipsis class="size-4"></svg>
        </button>
      </td>
    </ng-container>

    <tr cdk-header-row sanringRow *sanringHeaderRowDef="sizingColumns"></tr>
    <tr cdk-row sanringRow *sanringRowDef="let row; columns: sizingColumns"></tr>
  </table>
</sanring-table-container>`,

  sticky: `<!-- Sticky start -->
<sanring-table-container class="max-w-[520px]">
  <table cdk-table sanringTable [dataSource]="invoices" class="min-w-[760px]">
    <ng-container sanringColumnDef="invoice" sticky>
      <th
        sanringHeaderCell
        *sanringHeaderCellDef
        class="bg-[var(--sanring-background)] shadow-[1px_0_0_var(--sanring-border)]"
      >
        Invoice
      </th>
      <td
        sanringCell
        *sanringCellDef="let invoice"
        class="bg-[var(--sanring-background)] shadow-[1px_0_0_var(--sanring-border)]"
      >
        {{ invoice.id }}
      </td>
    </ng-container>

    <!-- customer/status/amount columns... -->
  </table>
</sanring-table-container>

<!-- Sticky end -->
<sanring-table-container class="max-w-[520px]">
  <table cdk-table sanringTable [dataSource]="invoices" class="min-w-[820px]">
    <!-- invoice/customer/status/amount columns... -->

    <ng-container sanringColumnDef="actions" stickyEnd>
      <th
        sanringHeaderCell
        *sanringHeaderCellDef
        class="bg-[var(--sanring-background)] text-right shadow-[-1px_0_0_var(--sanring-border)]"
      >
        Actions
      </th>
      <td
        sanringCell
        *sanringCellDef="let invoice"
        class="bg-[var(--sanring-background)] text-right shadow-[-1px_0_0_var(--sanring-border)]"
      >
        <button sanringBtn variant="ghost" size="icon" aria-label="Open actions">
          <svg lucideEllipsis class="size-4"></svg>
        </button>
      </td>
    </ng-container>
  </table>
</sanring-table-container>`,

  empty: `<table cdk-table sanringTable [dataSource]="[]">
  <!-- columns... -->
  <tr *sanringNoDataRow>
    <td [attr.colspan]="displayedColumns.length">No invoices found.</td>
  </tr>
</table>`,

  selection: `<table cdk-table sanringTable [dataSource]="invoices">
  <ng-container sanringColumnDef="select">
    <th sanringHeaderCell *sanringHeaderCellDef class="w-12">
      <sanring-checkbox
        ariaLabel="Select all invoices"
        [checked]="selectionState()"
        (checkedChange)="toggleAll($event)"
      />
    </th>
    <td sanringCell *sanringCellDef="let invoice" class="w-12">
      <sanring-checkbox
        [ariaLabel]="'Select invoice ' + invoice.id"
        [checked]="isSelected(invoice.id)"
        (checkedChange)="toggleRow(invoice.id, $event)"
      />
    </td>
  </ng-container>

  <!-- invoice/customer/status columns... -->

  <tr cdk-header-row sanringRow *sanringHeaderRowDef="selectionColumns"></tr>
  <tr
    cdk-row
    sanringRow
    *sanringRowDef="let row; columns: selectionColumns"
    [selected]="isSelected(row.id)"
  ></tr>
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
