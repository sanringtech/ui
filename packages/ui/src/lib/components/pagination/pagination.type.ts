export interface PageEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
  previousPageIndex: number;
}

export type PaginationNavAction = 'first' | 'previous' | 'next' | 'last';
