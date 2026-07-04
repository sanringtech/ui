import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const paginationPage = {
  componentId: 'pagination',
  titleKey: 'component.pagination',
  descriptionKey: 'pagination.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'pagination.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'pagination.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'pagination.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-controlled', titleKey: 'pagination.demo.controlled', level: 3 },
        { id: 'example-page-size', titleKey: 'pagination.demo.pageSize', level: 3 },
        { id: 'example-primitives', titleKey: 'pagination.demo.primitives', level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'pagination.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'sanring-paginator',
      type: 'Component',
      defaultValue: '—',
      descriptionKey: 'pagination.api.paginator.description',
    },
    {
      property: 'pageIndex',
      type: 'number',
      defaultValue: '0',
      descriptionKey: 'pagination.api.pageIndex.description',
    },
    {
      property: 'pageSize',
      type: 'number',
      defaultValue: '10',
      descriptionKey: 'pagination.api.pageSize.description',
    },
    {
      property: 'length',
      type: 'number',
      defaultValue: '0',
      descriptionKey: 'pagination.api.length.description',
    },
    {
      property: 'siblingCount',
      type: 'number',
      defaultValue: '1',
      descriptionKey: 'pagination.api.siblingCount.description',
    },
    {
      property: 'boundaryCount',
      type: 'number',
      defaultValue: '1',
      descriptionKey: 'pagination.api.boundaryCount.description',
    },
    {
      property: 'showFirstLast',
      type: 'boolean',
      defaultValue: 'true',
      descriptionKey: 'pagination.api.showFirstLast.description',
    },
    {
      property: 'pageChange',
      type: 'output<PageEvent>',
      defaultValue: '—',
      descriptionKey: 'pagination.api.pageChange.description',
    },
    {
      property: 'sanring-pagination',
      type: 'Component',
      defaultValue: '—',
      descriptionKey: 'pagination.api.pagination.description',
    },
    {
      property: 'sanring-pagination-list',
      type: 'Component',
      defaultValue: '—',
      descriptionKey: 'pagination.api.list.description',
    },
    {
      property: 'sanringPaginationItem',
      type: 'Directive',
      defaultValue: '—',
      descriptionKey: 'pagination.api.item.description',
    },
    {
      property: 'sanringPaginationNav',
      type: 'Directive',
      defaultValue: '—',
      descriptionKey: 'pagination.api.nav.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const paginationPageExamples = {
  basic: `<sanring-paginator
  [pageIndex]="pageIndex()"
  [pageSize]="pageSize()"
  [length]="orders.length"
  [boundaryCount]="3"
  [siblingCount]="0"
  (pageChange)="pageIndex.set($event.pageIndex)"
/>`,

  usageImport: `import { PaginatorComponent } from '@sanring/ui';`,

  usageMain: `<sanring-paginator
  [pageIndex]="pageIndex()"
  [pageSize]="10"
  [length]="total"
  (pageChange)="onPageChange($event)"
/>`,

  controlled: `<sanring-paginator
  [pageIndex]="pageIndex()"
  [pageSize]="pageSize()"
  [length]="orders.length"
  [boundaryCount]="3"
  [siblingCount]="0"
  (pageChange)="pageIndex.set($event.pageIndex)"
/>`,

  pageSize: `<div class="flex items-center justify-between gap-3">
  <span>Rows per page</span>
  <sanring-page-size-select
    [pageSize]="pageSize()"
    (pageSizeChange)="setPageSize($event)"
    [pageSizeOptions]="[4, 8, 12]"
    ariaLabel="Rows per page"
  />
</div>

<sanring-paginator
  [pageIndex]="pageSizePageIndex()"
  [pageSize]="pageSize()"
  [length]="orders.length"
  [boundaryCount]="3"
  [siblingCount]="0"
  (pageChange)="pageSizePageIndex.set($event.pageIndex)"
/>`,

  primitives: `<sanring-pagination ariaLabel="Invoice pages">
  <sanring-pagination-list>
    <button sanringPaginationNav type="button" disabled class="h-9 w-auto px-3">
      Previous
    </button>
    <button sanringPaginationItem type="button">1</button>
    <button sanringPaginationItem type="button" active>2</button>
    <button sanringPaginationItem type="button">3</button>
    <span class="flex size-9 items-center justify-center">...</span>
    <button sanringPaginationItem type="button">8</button>
    <button sanringPaginationItem type="button">9</button>
    <button sanringPaginationItem type="button">10</button>
    <button sanringPaginationNav type="button" class="h-9 w-auto px-3">Next</button>
  </sanring-pagination-list>
</sanring-pagination>`,
} as const;
