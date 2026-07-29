export const paginationTranslations = {
  'pagination.description':
    'Pagination primitives and a composed paginator for navigating large result sets.',
  'pagination.examples.basic.description':
    'A controlled paginator attached to a small list preview.',
  'pagination.usage.description':
    'Use PaginatorComponent for the common case, or compose the low-level pagination primitives when you need custom layout.',
  'pagination.installation.description':
    'Add the component with the CLI, then import PaginatorComponent or the pagination primitive set.',
  'pagination.demo.controlled': 'Controlled paginator',
  'pagination.demo.pageSize': 'Page size',
  'pagination.demo.primitives': 'Primitive composition',
  'pagination.demo.currentPage': 'Current page',
  'pagination.demo.items': 'items',
  'pagination.demo.rowsPerPage': 'Rows per page',
  'pagination.api.description':
    'Components, directives, and inputs provided by the pagination primitive set.',
  'pagination.api.paginator.description':
    'Composed paginator with range label, page numbers, ellipsis, and navigation controls.',
  'pagination.api.pageIndex.description': 'Zero-based active page index.',
  'pagination.api.pageSize.description': 'Number of items represented by each page.',
  'pagination.api.length.description': 'Total number of items across all pages.',
  'pagination.api.siblingCount.description':
    'Number of neighboring pages rendered around the active page before ellipsis is inserted.',
  'pagination.api.boundaryCount.description':
    'Number of pages always rendered at the beginning and end of the page range.',
  'pagination.api.showFirstLast.description':
    'Shows or hides first-page and last-page navigation controls.',
  'pagination.api.pageChange.description': 'Emits when navigation requests a different page.',
  'pagination.api.pagination.description':
    'Root navigation component that provides layout and aria-label wiring.',
  'pagination.api.list.description': 'Flex list wrapper for pagination items and nav controls.',
  'pagination.api.item.description':
    'Styles page number buttons or links, including active and disabled states.',
  'pagination.api.nav.description':
    'Styles previous, next, first, or last controls while preserving button/link semantics.',

} as const;
