import { CdkTableModule } from '@angular/cdk/table';
import { Component, computed, inject, signal } from '@angular/core';
import { LucideEllipsis, LucideFile, LucideSettings, LucideTrash2 } from '@lucide/angular';
import {
  ButtonDirective,
  CheckboxComponent,
  CheckedState,
  SANRING_DROPDOWN_MENU_IMPORTS,
  SortDirective,
  SortHeaderComponent,
  SortState,
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
} from '@sanring/ui';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import {
  ComponentPageApiTableComponent,
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageHeaderComponent,
  ComponentPageInstallationComponent,
  ComponentPageSectionComponent,
  ComponentPageUsageImportsComponent,
} from '../../../layouts/component-page';
import { tablePage, tablePageExamples } from './table.docs';

interface InvoiceRow {
  id: string;
  customer: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  amount: number;
}

@Component({
  selector: 'app-table-page',
  imports: [
    CdkTableModule,
    ButtonDirective,
    CheckboxComponent,
    SANRING_DROPDOWN_MENU_IMPORTS,
    LucideEllipsis,
    LucideFile,
    LucideSettings,
    LucideTrash2,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    ComponentPageUsageImportsComponent,
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
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-component-page-header
        [componentId]="page.componentId"
        [title]="i18n.t(page.titleKey)"
        [description]="i18n.t(page.descriptionKey)"
      />

      <app-component-page-section [section]="section('basic')">
        <app-component-page-code-previewer [code]="examples.basic" language="angular-html">
          <div previewer class="w-full">
            <sanring-table-container class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
              <table cdk-table sanringTable [dataSource]="invoices">
                <ng-container sanringColumnDef="invoice">
                  <th sanringHeaderCell *sanringHeaderCellDef>Invoice</th>
                  <td sanringCell *sanringCellDef="let invoice">{{ invoice.id }}</td>
                </ng-container>

                <ng-container sanringColumnDef="customer">
                  <th sanringHeaderCell *sanringHeaderCellDef>Customer</th>
                  <td sanringCell *sanringCellDef="let invoice">{{ invoice.customer }}</td>
                </ng-container>

                <ng-container sanringColumnDef="status">
                  <th sanringHeaderCell *sanringHeaderCellDef>Status</th>
                  <td sanringCell *sanringCellDef="let invoice">
                    <span [class]="statusClass(invoice.status)">{{ invoice.status }}</span>
                  </td>
                </ng-container>

                <ng-container sanringColumnDef="amount">
                  <th sanringHeaderCell *sanringHeaderCellDef class="text-right">Amount</th>
                  <td sanringCell *sanringCellDef="let invoice" class="text-right tabular-nums">
                    {{ formatAmount(invoice.amount) }}
                  </td>
                </ng-container>

                <tr cdk-header-row sanringRow *sanringHeaderRowDef="displayedColumns"></tr>
                <tr cdk-row sanringRow *sanringRowDef="let row; columns: displayedColumns"></tr>
              </table>
            </sanring-table-container>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-usage-imports [code]="examples.usageImport" />
          <div class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
            <app-component-page-code-block [code]="examples.usageMain" language="angular-html" />
          </div>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          componentName="table"
          manualSnippet="import { TableDirective, TableContainerComponent } from '@sanring/ui';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-sortable')">
            <app-component-page-code-previewer [code]="examples.sortable" language="angular-html">
              <div previewer class="w-full">
                <sanring-table-container class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
                  <table
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

                    <ng-container sanringColumnDef="customer">
                      <th sanringSortHeader="customer" *sanringHeaderCellDef>Customer</th>
                      <td sanringCell *sanringCellDef="let invoice">{{ invoice.customer }}</td>
                    </ng-container>

                    <ng-container sanringColumnDef="status">
                      <th sanringSortHeader="status" *sanringHeaderCellDef>Status</th>
                      <td sanringCell *sanringCellDef="let invoice">
                        <span [class]="statusClass(invoice.status)">{{ invoice.status }}</span>
                      </td>
                    </ng-container>

                    <ng-container sanringColumnDef="amount">
                      <th sanringSortHeader="amount" *sanringHeaderCellDef class="justify-end text-right">
                        Amount
                      </th>
                      <td sanringCell *sanringCellDef="let invoice" class="text-right tabular-nums">
                        {{ formatAmount(invoice.amount) }}
                      </td>
                    </ng-container>

                    <tr cdk-header-row sanringRow *sanringHeaderRowDef="displayedColumns"></tr>
                    <tr cdk-row sanringRow *sanringRowDef="let row; columns: displayedColumns"></tr>
                  </table>
                </sanring-table-container>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-column-sizing')">
            <app-component-page-code-previewer
              [code]="examples.columnSizing"
              language="angular-html"
            >
              <div previewer class="w-full">
                <sanring-table-container class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
                  <table cdk-table sanringTable [dataSource]="invoices">
                    <ng-container sanringColumnDef="select" width="48px">
                      <th sanringHeaderCell *sanringHeaderCellDef></th>
                      <td sanringCell *sanringCellDef="let invoice">
                        <sanring-checkbox [ariaLabel]="'Select invoice ' + invoice.id" />
                      </td>
                    </ng-container>

                    <ng-container sanringColumnDef="invoice" [ratio]="1">
                      <th sanringHeaderCell *sanringHeaderCellDef>Invoice</th>
                      <td sanringCell *sanringCellDef="let invoice" class="truncate">
                        {{ invoice.id }}
                      </td>
                    </ng-container>

                    <ng-container sanringColumnDef="customer" [ratio]="2">
                      <th sanringHeaderCell *sanringHeaderCellDef>Customer</th>
                      <td sanringCell *sanringCellDef="let invoice" class="truncate">
                        {{ invoice.customer }}
                      </td>
                    </ng-container>

                    <ng-container sanringColumnDef="amount" [ratio]="1">
                      <th sanringHeaderCell *sanringHeaderCellDef class="text-right">Amount</th>
                      <td sanringCell *sanringCellDef="let invoice" class="text-right tabular-nums">
                        {{ formatAmount(invoice.amount) }}
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
                </sanring-table-container>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-sticky')">
            <app-component-page-code-previewer [code]="examples.sticky" language="angular-html">
              <div previewer class="grid w-full gap-4">
                <sanring-table-container class="max-w-full rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
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

                    <ng-container sanringColumnDef="customer">
                      <th sanringHeaderCell *sanringHeaderCellDef>Customer</th>
                      <td sanringCell *sanringCellDef="let invoice">{{ invoice.customer }}</td>
                    </ng-container>

                    <ng-container sanringColumnDef="status">
                      <th sanringHeaderCell *sanringHeaderCellDef>Status</th>
                      <td sanringCell *sanringCellDef="let invoice">
                        <span [class]="statusClass(invoice.status)">{{ invoice.status }}</span>
                      </td>
                    </ng-container>

                    <ng-container sanringColumnDef="amount">
                      <th sanringHeaderCell *sanringHeaderCellDef class="text-right">Amount</th>
                      <td sanringCell *sanringCellDef="let invoice" class="text-right tabular-nums">
                        {{ formatAmount(invoice.amount) }}
                      </td>
                    </ng-container>

                    <tr cdk-header-row sanringRow *sanringHeaderRowDef="stickyStartColumns"></tr>
                    <tr cdk-row sanringRow *sanringRowDef="let row; columns: stickyStartColumns"></tr>
                  </table>
                </sanring-table-container>

                <sanring-table-container class="max-w-full rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
                  <table cdk-table sanringTable [dataSource]="invoices" class="min-w-[820px]">
                    <ng-container sanringColumnDef="invoice">
                      <th sanringHeaderCell *sanringHeaderCellDef>Invoice</th>
                      <td sanringCell *sanringCellDef="let invoice">{{ invoice.id }}</td>
                    </ng-container>

                    <ng-container sanringColumnDef="customer">
                      <th sanringHeaderCell *sanringHeaderCellDef>Customer</th>
                      <td sanringCell *sanringCellDef="let invoice">{{ invoice.customer }}</td>
                    </ng-container>

                    <ng-container sanringColumnDef="status">
                      <th sanringHeaderCell *sanringHeaderCellDef>Status</th>
                      <td sanringCell *sanringCellDef="let invoice">
                        <span [class]="statusClass(invoice.status)">{{ invoice.status }}</span>
                      </td>
                    </ng-container>

                    <ng-container sanringColumnDef="amount">
                      <th sanringHeaderCell *sanringHeaderCellDef class="text-right">Amount</th>
                      <td sanringCell *sanringCellDef="let invoice" class="text-right tabular-nums">
                        {{ formatAmount(invoice.amount) }}
                      </td>
                    </ng-container>

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

                    <tr cdk-header-row sanringRow *sanringHeaderRowDef="stickyEndColumns"></tr>
                    <tr cdk-row sanringRow *sanringRowDef="let row; columns: stickyEndColumns"></tr>
                  </table>
                </sanring-table-container>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-empty')">
            <app-component-page-code-previewer [code]="examples.empty" language="angular-html">
              <div previewer class="w-full">
                <sanring-table-container class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
                  <table cdk-table sanringTable [dataSource]="emptyRows">
                    <ng-container sanringColumnDef="invoice">
                      <th sanringHeaderCell *sanringHeaderCellDef>Invoice</th>
                      <td sanringCell *sanringCellDef="let invoice">{{ invoice.id }}</td>
                    </ng-container>

                    <ng-container sanringColumnDef="customer">
                      <th sanringHeaderCell *sanringHeaderCellDef>Customer</th>
                      <td sanringCell *sanringCellDef="let invoice">{{ invoice.customer }}</td>
                    </ng-container>

                    <ng-container sanringColumnDef="status">
                      <th sanringHeaderCell *sanringHeaderCellDef>Status</th>
                      <td sanringCell *sanringCellDef="let invoice">{{ invoice.status }}</td>
                    </ng-container>

                    <ng-container sanringColumnDef="amount">
                      <th sanringHeaderCell *sanringHeaderCellDef class="text-right">Amount</th>
                      <td sanringCell *sanringCellDef="let invoice" class="text-right">
                        {{ formatAmount(invoice.amount) }}
                      </td>
                    </ng-container>

                    <tr cdk-header-row sanringRow *sanringHeaderRowDef="displayedColumns"></tr>
                    <tr cdk-row sanringRow *sanringRowDef="let row; columns: displayedColumns"></tr>
                    <tr *sanringNoDataRow>
                      <td
                        [attr.colspan]="displayedColumns.length"
                        class="p-8 text-center text-sm text-[var(--docs-muted)]"
                      >
                        No invoices found.
                      </td>
                    </tr>
                  </table>
                </sanring-table-container>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-selection')">
            <app-component-page-code-previewer [code]="examples.selection" language="angular-html">
              <div previewer class="w-full">
                <sanring-table-container class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
                  <table cdk-table sanringTable [dataSource]="invoices">
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

                    <ng-container sanringColumnDef="invoice">
                      <th sanringHeaderCell *sanringHeaderCellDef>Invoice</th>
                      <td sanringCell *sanringCellDef="let invoice">{{ invoice.id }}</td>
                    </ng-container>

                    <ng-container sanringColumnDef="customer">
                      <th sanringHeaderCell *sanringHeaderCellDef>Customer</th>
                      <td sanringCell *sanringCellDef="let invoice">{{ invoice.customer }}</td>
                    </ng-container>

                    <ng-container sanringColumnDef="status">
                      <th sanringHeaderCell *sanringHeaderCellDef>Status</th>
                      <td sanringCell *sanringCellDef="let invoice">
                        <span [class]="statusClass(invoice.status)">{{ invoice.status }}</span>
                      </td>
                    </ng-container>

                    <tr cdk-header-row sanringRow *sanringHeaderRowDef="selectionColumns"></tr>
                    <tr
                      cdk-row
                      sanringRow
                      *sanringRowDef="let row; columns: selectionColumns"
                      [selected]="isSelected(row.id)"
                    ></tr>
                  </table>
                </sanring-table-container>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-actions')">
            <app-component-page-code-previewer
              [code]="examples.actions"
              language="angular-html"
            >
              <div previewer class="w-full">
                <sanring-table-container class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
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
                      <th sanringHeaderCell *sanringHeaderCellDef class="text-right">Amount</th>
                      <td sanringCell *sanringCellDef="let invoice" class="text-right tabular-nums">
                        {{ formatAmount(invoice.amount) }}
                      </td>
                    </ng-container>

                    <ng-container sanringColumnDef="actions">
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

                          <sanring-dropdown-menu-content
                            #invoiceActions="sanringDropdownMenuContent"
                            class="w-44"
                          >
                            <button sanringDropdownMenuItem type="button" value="open">
                              <svg lucideFile class="size-4"></svg>
                              <span>Open invoice</span>
                            </button>
                            <button sanringDropdownMenuItem type="button" value="edit">
                              <svg lucideSettings class="size-4"></svg>
                              <span>Edit details</span>
                            </button>
                            <sanring-dropdown-menu-separator />
                            <button
                              sanringDropdownMenuItem
                              type="button"
                              value="delete"
                              variant="destructive"
                            >
                              <svg lucideTrash2 class="size-4"></svg>
                              <span>Delete</span>
                            </button>
                          </sanring-dropdown-menu-content>
                        </sanring-dropdown-menu>
                      </td>
                    </ng-container>

                    <tr cdk-header-row sanringRow *sanringHeaderRowDef="actionColumns"></tr>
                    <tr cdk-row sanringRow *sanringRowDef="let row; columns: actionColumns"></tr>
                  </table>
                </sanring-table-container>
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('api')">
        <app-component-page-api-table [rows]="page.apiRows!" />
      </app-component-page-section>
    </app-component-page>
  `,
})
export class TablePageComponent {
  protected readonly page = tablePage;
  protected readonly examples = tablePageExamples;
  protected readonly i18n = inject(I18nService);
  protected readonly displayedColumns = ['invoice', 'customer', 'status', 'amount'];
  protected readonly sizingColumns = ['select', 'invoice', 'customer', 'amount', 'actions'];
  protected readonly stickyStartColumns = ['invoice', 'customer', 'status', 'amount'];
  protected readonly stickyEndColumns = ['invoice', 'customer', 'status', 'amount', 'actions'];
  protected readonly selectionColumns = ['select', 'invoice', 'customer', 'status'];
  protected readonly actionColumns = ['invoice', 'customer', 'amount', 'actions'];
  protected readonly emptyRows: InvoiceRow[] = [];
  protected readonly sortState = signal<SortState | null>(null);
  protected readonly selectedInvoiceIds = signal<ReadonlySet<string>>(new Set(['INV-1001']));

  protected readonly invoices: InvoiceRow[] = [
    { id: 'INV-1001', customer: 'Acme Co.', status: 'Paid', amount: 2400 },
    { id: 'INV-1002', customer: 'Northstar Labs', status: 'Pending', amount: 1250 },
    { id: 'INV-1003', customer: 'Orbit Studio', status: 'Overdue', amount: 860 },
    { id: 'INV-1004', customer: 'Blue Pine', status: 'Paid', amount: 3420 },
  ];

  protected readonly sortedInvoices = computed(() => {
    const sort = this.sortState();
    const rows = [...this.invoices];

    if (!sort) return rows;

    return rows.sort((a, b) => {
      const direction = sort.direction === 'asc' ? 1 : -1;
      const left = this.sortValue(a, sort.active);
      const right = this.sortValue(b, sort.active);

      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * direction;
      }

      return String(left).localeCompare(String(right)) * direction;
    });
  });

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }

  protected formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  protected statusClass(status: InvoiceRow['status']): string {
    const base =
      'inline-flex rounded-[var(--sanring-radius)] px-2 py-0.5 text-xs font-medium';

    if (status === 'Paid') {
      return `${base} bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300`;
    }

    if (status === 'Overdue') {
      return `${base} bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300`;
    }

    return `${base} bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300`;
  }

  protected isSelected(id: string): boolean {
    return this.selectedInvoiceIds().has(id);
  }

  protected selectionState(): CheckedState {
    const selectedCount = this.selectedInvoiceIds().size;
    if (selectedCount === 0) return false;
    if (selectedCount === this.invoices.length) return true;
    return 'indeterminate';
  }

  protected toggleAll(state: CheckedState): void {
    this.selectedInvoiceIds.set(
      state === true ? new Set(this.invoices.map((invoice) => invoice.id)) : new Set(),
    );
  }

  protected toggleRow(id: string, state: CheckedState): void {
    this.selectedInvoiceIds.update((current) => {
      const next = new Set(current);

      if (state === true) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  }

  private sortValue(row: InvoiceRow, active: string): string | number {
    if (active === 'invoice') return row.id;
    if (active === 'customer') return row.customer;
    if (active === 'status') return row.status;
    if (active === 'amount') return row.amount;
    return '';
  }
}
