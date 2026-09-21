import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideEllipsis, LucidePlus, LucideTrash2 } from '@lucide/angular';
import { BadgeDirective } from '../badge';
import { ButtonDirective } from '../button';
import { CheckboxComponent, type CheckedState } from '../checkbox';
import { SANRING_DROPDOWN_MENU_IMPORTS } from '../dropdown-menu';
import { FieldLabelDirective, SanringFieldComponent } from '../field';
import { InputDirective } from '../input';
import { PaginatorComponent, type PageEvent } from '../pagination';
import { SANRING_SELECT_IMPORTS } from '../select';
import { SANRING_SHEET_IMPORTS } from '../sheet';
import { SkeletonDirective } from '../skeleton';
import { SANRING_TABLE_IMPORTS } from '../table';
import { SANRING_TOAST_IMPORTS, ToastService } from '../toast';

export interface TablePageRow {
  id: string;
  customer: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  amount: number;
}

const SEED: TablePageRow[] = [
  { id: 'INV-001', customer: 'Northwind', status: 'Paid', amount: 2400 },
  { id: 'INV-002', customer: 'Contoso', status: 'Pending', amount: 1800 },
  { id: 'INV-003', customer: 'Adventure Works', status: 'Overdue', amount: 920 },
  { id: 'INV-004', customer: 'Fabrikam', status: 'Paid', amount: 3100 },
  { id: 'INV-005', customer: 'Wide World', status: 'Pending', amount: 640 },
];

@Component({
  selector: 'sanring-table-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ToastService],
  imports: [
    CdkTableModule,
    FormsModule,
    LucideEllipsis,
    LucidePlus,
    LucideTrash2,
    BadgeDirective,
    ButtonDirective,
    CheckboxComponent,
    SANRING_DROPDOWN_MENU_IMPORTS,
    FieldLabelDirective,
    SanringFieldComponent,
    InputDirective,
    PaginatorComponent,
    SANRING_SELECT_IMPORTS,
    SANRING_SHEET_IMPORTS,
    SkeletonDirective,
    SANRING_TABLE_IMPORTS,
    SANRING_TOAST_IMPORTS,
  ],
  template: `
    <div class="mx-auto grid w-full max-w-5xl gap-4 p-6">
      <sanring-toaster position="bottom-right" />
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-xl font-semibold text-[var(--sanring-foreground)]">Invoices</h1>
          <p class="text-sm text-[var(--sanring-muted)]">Search, filter, and edit sample rows.</p>
        </div>
        <sanring-sheet [(isOpen)]="sheetOpen">
          <button sanringBtn sanringSheetTrigger type="button">
            <svg lucidePlus class="size-4"></svg>
            New invoice
          </button>
          <sanring-sheet-content>
            <sanring-sheet-header>
              <sanring-sheet-title>New invoice</sanring-sheet-title>
              <sanring-sheet-description>Creates a local demo row.</sanring-sheet-description>
            </sanring-sheet-header>
            <form class="grid gap-4 p-4" (ngSubmit)="addRow()">
              <sanring-field>
                <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
                <label sanringLabel>Customer</label>
                <input sanringInput name="customer" [(ngModel)]="draftCustomer" required />
              </sanring-field>
              <sanring-sheet-footer>
                <button sanringBtn type="submit">Save</button>
              </sanring-sheet-footer>
            </form>
          </sanring-sheet-content>
        </sanring-sheet>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <sanring-field class="min-w-56 flex-1">
          <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
          <label sanringLabel>Search</label>
          <input
            sanringInput
            type="search"
            name="search"
            placeholder="Customer or invoice"
            [ngModel]="query()"
            (ngModelChange)="query.set($event); pageIndex.set(0)"
          />
        </sanring-field>
        <sanring-select
          class="w-40"
          [ngModel]="statusFilter()"
          (ngModelChange)="statusFilter.set($event); pageIndex.set(0)"
        >
          <button sanringSelectTrigger type="button">
            <sanring-select-value placeholder="Status" />
          </button>
          <sanring-select-content>
            <sanring-select-item value="all">All</sanring-select-item>
            <sanring-select-item value="Paid">Paid</sanring-select-item>
            <sanring-select-item value="Pending">Pending</sanring-select-item>
            <sanring-select-item value="Overdue">Overdue</sanring-select-item>
          </sanring-select-content>
        </sanring-select>
      </div>

      @if (loading()) {
        <div class="grid gap-2">
          <div sanringSkeleton class="h-10 w-full"></div>
          <div sanringSkeleton class="h-10 w-full"></div>
          <div sanringSkeleton class="h-10 w-full"></div>
        </div>
      } @else {
        <sanring-table-container
          class="rounded-[var(--sanring-radius)] border border-[var(--sanring-border)]"
        >
          <table cdk-table sanringTable [dataSource]="pageRows()">
            <ng-container sanringColumnDef="select" width="48px">
              <th sanringHeaderCell *sanringHeaderCellDef>
                <sanring-checkbox
                  ariaLabel="Select all visible invoices"
                  [checked]="headerSelection()"
                  (checkedChange)="togglePage($event)"
                />
              </th>
              <td sanringCell *sanringCellDef="let row">
                <sanring-checkbox
                  [ariaLabel]="'Select ' + row.id"
                  [checked]="selected().has(row.id)"
                  (checkedChange)="toggleRow(row.id, $event)"
                />
              </td>
            </ng-container>
            <ng-container sanringColumnDef="invoice">
              <th sanringHeaderCell *sanringHeaderCellDef>Invoice</th>
              <td sanringCell *sanringCellDef="let row">{{ row.id }}</td>
            </ng-container>
            <ng-container sanringColumnDef="customer">
              <th sanringHeaderCell *sanringHeaderCellDef>Customer</th>
              <td sanringCell *sanringCellDef="let row">{{ row.customer }}</td>
            </ng-container>
            <ng-container sanringColumnDef="status">
              <th sanringHeaderCell *sanringHeaderCellDef>Status</th>
              <td sanringCell *sanringCellDef="let row">
                <span sanringBadge [variant]="statusVariant(row.status)">{{ row.status }}</span>
              </td>
            </ng-container>
            <ng-container sanringColumnDef="amount">
              <th sanringHeaderCell *sanringHeaderCellDef class="text-right">Amount</th>
              <td sanringCell *sanringCellDef="let row" class="text-right tabular-nums">
                {{ formatAmount(row.amount) }}
              </td>
            </ng-container>
            <ng-container sanringColumnDef="actions" width="56px">
              <th sanringHeaderCell *sanringHeaderCellDef></th>
              <td sanringCell *sanringCellDef="let row">
                <sanring-dropdown-menu>
                  <button
                    type="button"
                    sanringBtn
                    variant="ghost"
                    size="icon"
                    sanringDropdownMenuTrigger
                    [menu]="rowMenu.menu"
                    [attr.aria-label]="'Actions for ' + row.id"
                  >
                    <svg lucideEllipsis class="size-4"></svg>
                  </button>
                  <sanring-dropdown-menu-content #rowMenu="sanringDropdownMenuContent">
                    <button type="button" sanringDropdownMenuItem (click)="removeRow(row.id)">
                      <svg lucideTrash2 class="size-4"></svg>
                      <span>Delete</span>
                    </button>
                  </sanring-dropdown-menu-content>
                </sanring-dropdown-menu>
              </td>
            </ng-container>
            <tr cdk-header-row sanringRow *sanringHeaderRowDef="columns"></tr>
            <tr
              cdk-row
              sanringRow
              *sanringRowDef="let row; columns: columns"
              [selected]="selected().has(row.id)"
            ></tr>
          </table>
        </sanring-table-container>
        <sanring-paginator
          [pageIndex]="pageIndex()"
          [pageSize]="pageSize"
          [length]="filteredRows().length"
          (pageChange)="onPage($event)"
        />
      }
    </div>
  `,
})
export class TablePageComponent {
  private readonly toast = inject(ToastService);

  protected readonly columns = ['select', 'invoice', 'customer', 'status', 'amount', 'actions'];
  protected readonly pageSize = 4;
  protected readonly loading = signal(false);
  protected readonly query = signal('');
  protected readonly statusFilter = signal('all');
  protected readonly pageIndex = signal(0);
  protected readonly selected = signal(new Set<string>());
  protected readonly rows = signal<TablePageRow[]>(SEED);
  protected sheetOpen = false;
  protected draftCustomer = '';

  protected readonly filteredRows = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    return this.rows().filter((row) => {
      const matchesQuery = !q || row.id.toLowerCase().includes(q) || row.customer.toLowerCase().includes(q);
      const matchesStatus = status === 'all' || row.status === status;
      return matchesQuery && matchesStatus;
    });
  });

  protected readonly pageRows = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.filteredRows().slice(start, start + this.pageSize);
  });

  protected readonly headerSelection = computed<CheckedState>(() => {
    const visible = this.pageRows();
    if (visible.length === 0) return false;
    const selectedCount = visible.filter((row) => this.selected().has(row.id)).length;
    if (selectedCount === 0) return false;
    if (selectedCount === visible.length) return true;
    return 'indeterminate';
  });

  protected formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  protected statusVariant(status: TablePageRow['status']): 'default' | 'secondary' | 'destructive' {
    if (status === 'Paid') return 'default';
    if (status === 'Pending') return 'secondary';
    return 'destructive';
  }

  protected toggleRow(id: string, checked: CheckedState): void {
    this.selected.update((current) => {
      const next = new Set(current);
      if (checked === true) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  protected togglePage(checked: CheckedState): void {
    this.selected.update((current) => {
      const next = new Set(current);
      for (const row of this.pageRows()) {
        if (checked === true) next.add(row.id);
        else next.delete(row.id);
      }
      return next;
    });
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
  }

  protected addRow(): void {
    const customer = this.draftCustomer.trim();
    if (!customer) return;
    const id = `INV-${String(this.rows().length + 1).padStart(3, '0')}`;
    this.rows.update((rows) => [...rows, { id, customer, status: 'Pending', amount: 0 }]);
    this.draftCustomer = '';
    this.sheetOpen = false;
    this.toast.show({ type: 'success', title: 'Invoice created', description: id });
  }

  protected removeRow(id: string): void {
    this.rows.update((rows) => rows.filter((row) => row.id !== id));
    this.selected.update((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    this.toast.show({ type: 'default', title: 'Invoice removed', description: id });
  }
}
