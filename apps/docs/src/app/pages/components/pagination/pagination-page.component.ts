import { Component, computed, inject, signal } from '@angular/core';
import {
  PageEvent,
  PageSizeSelectComponent,
  PaginatorComponent,
  SANRING_PAGINATION_IMPORTS,
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
import { paginationPage, paginationPageExamples } from './pagination.docs';

interface OrderRow {
  id: string;
  customer: string;
  status: string;
}

@Component({
  selector: 'app-pagination-page',
  imports: [
    SANRING_PAGINATION_IMPORTS,
    PaginatorComponent,
    PageSizeSelectComponent,
    ComponentPageApiTableComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageHeaderComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    ComponentPageUsageImportsComponent,
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
          <div previewer class="grid w-full gap-4">
            <div class="grid gap-2 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4">
              @for (order of pagedOrders(); track order.id) {
                <div class="flex items-center justify-between gap-4 text-sm">
                  <div class="min-w-0">
                    <div class="font-medium text-[var(--sanring-foreground)]">{{ order.id }}</div>
                    <div class="truncate text-[var(--docs-muted)]">{{ order.customer }}</div>
                  </div>
                  <span class="shrink-0 text-xs text-[var(--docs-muted)]">{{ order.status }}</span>
                </div>
              }
            </div>

            <sanring-paginator
              [pageIndex]="pageIndex()"
              [pageSize]="pageSize()"
              [length]="orders.length"
              [boundaryCount]="3"
              [siblingCount]="0"
              (pageChange)="onPageChange($event)"
            />
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
          componentName="pagination"
          manualSnippet="import { PaginatorComponent } from './components/ui/pagination';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('example')">
        <div class="grid gap-2">
          <app-component-page-section [section]="section('example-controlled')">
            <app-component-page-code-previewer [code]="examples.controlled" language="angular-html">
              <div previewer class="grid w-full gap-4">
                <div class="flex items-center justify-between gap-4 text-sm text-[var(--docs-muted)]">
                  <span>{{ i18n.t('pagination.demo.currentPage') }} {{ pageIndex() + 1 }}</span>
                  <span>{{ orders.length }} {{ i18n.t('pagination.demo.items') }}</span>
                </div>

                <sanring-paginator
                  [pageIndex]="pageIndex()"
                  [pageSize]="pageSize()"
                  [length]="orders.length"
                  [boundaryCount]="3"
                  [siblingCount]="0"
                  (pageChange)="onPageChange($event)"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-page-size')">
            <app-component-page-code-previewer [code]="examples.pageSize" language="angular-html">
              <div previewer class="grid w-full gap-4">
                <div class="flex items-center justify-between gap-3 text-sm">
                  <span class="text-[var(--docs-muted)]">{{ i18n.t('pagination.demo.rowsPerPage') }}</span>
                  <sanring-page-size-select
                    [pageSize]="pageSize()"
                    (pageSizeChange)="setPageSize($event)"
                    [pageSizeOptions]="[4, 8, 12]"
                    [ariaLabel]="i18n.t('pagination.demo.rowsPerPage')"
                  />
                </div>

                <div class="grid gap-2 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-4">
                  @for (order of pageSizeOrders(); track order.id) {
                    <div class="flex items-center justify-between gap-4 text-sm">
                      <div class="min-w-0">
                        <div class="font-medium text-[var(--sanring-foreground)]">{{ order.id }}</div>
                        <div class="truncate text-[var(--docs-muted)]">{{ order.customer }}</div>
                      </div>
                      <span class="shrink-0 text-xs text-[var(--docs-muted)]">{{ order.status }}</span>
                    </div>
                  }
                </div>

                <sanring-paginator
                  [pageIndex]="pageSizePageIndex()"
                  [pageSize]="pageSize()"
                  [length]="orders.length"
                  [boundaryCount]="3"
                  [siblingCount]="0"
                  (pageChange)="pageSizePageIndex.set($event.pageIndex)"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('example-primitives')">
            <app-component-page-code-previewer [code]="examples.primitives" language="angular-html">
              <div previewer class="w-full">
                <sanring-pagination ariaLabel="Invoice pages">
                  <sanring-pagination-list>
                    <button sanringPaginationNav type="button" disabled class="h-9 w-auto px-3">
                      Previous
                    </button>
                    <button sanringPaginationItem type="button">1</button>
                    <button sanringPaginationItem type="button" active>2</button>
                    <button sanringPaginationItem type="button">3</button>
                    <span class="flex size-9 items-center justify-center text-[var(--docs-muted)]">
                      ...
                    </span>
                    <button sanringPaginationItem type="button">8</button>
                    <button sanringPaginationItem type="button">9</button>
                    <button sanringPaginationItem type="button">10</button>
                    <button sanringPaginationNav type="button" class="h-9 w-auto px-3">Next</button>
                  </sanring-pagination-list>
                </sanring-pagination>
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
export class PaginationPageComponent {
  protected readonly page = paginationPage;
  protected readonly examples = paginationPageExamples;
  protected readonly i18n = inject(I18nService);

  protected readonly pageSize = signal(4);
  protected readonly pageIndex = signal(0);
  protected readonly pageSizePageIndex = signal(0);
  protected readonly orders: OrderRow[] = Array.from({ length: 40 }, (_, index) => {
    const customers = [
      'Acme Co.',
      'Northwind Studio',
      'Globex Retail',
      'Initech Labs',
      'Umbrella Supply',
      'Stark Industries',
      'Wayne Foundation',
      'Wonka Factory',
    ];
    const statuses = ['Paid', 'Pending', 'Paid', 'Overdue'];

    return {
      id: `ORD-${1001 + index}`,
      customer: customers[index % customers.length],
      status: statuses[index % statuses.length],
    };
  });

  protected readonly pagedOrders = computed(() => {
    const pageSize = this.pageSize();
    const start = this.pageIndex() * pageSize;
    return this.orders.slice(start, start + pageSize);
  });

  protected readonly pageSizeOrders = computed(() => {
    const pageSize = this.pageSize();
    const start = this.pageSizePageIndex() * pageSize;
    return this.orders.slice(start, start + pageSize);
  });

  protected onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
  }

  protected setPageSize(value: number): void {
    this.pageSize.set(value);
    this.pageSizePageIndex.set(0);
  }

  protected section(id: string) {
    return getComponentPageSection(this.page, id);
  }
}
