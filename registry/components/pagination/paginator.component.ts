import { Component, computed, input, output } from '@angular/core';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronsLeft,
  LucideChevronsRight,
} from '@lucide/angular';
import { cn } from '../shared/utils';
import { PageEvent } from './pagination.type';
import { PaginationComponent } from './pagination.component';
import { PaginationItemDirective } from './pagination-item.directive';
import { PaginationListComponent } from './pagination-list.component';
import { PaginationNavDirective } from './pagination-nav.directive';

type PageToken = number | 'ellipsis-start' | 'ellipsis-end';

@Component({
  selector: 'sanring-paginator',
  standalone: true,
  imports: [
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronsLeft,
    LucideChevronsRight,
    PaginationComponent,
    PaginationItemDirective,
    PaginationListComponent,
    PaginationNavDirective,
  ],
  host: {
    '[class]': 'paginatorClass()',
  },
  template: `
    <div class="flex min-w-0 items-center gap-3 text-sm text-[var(--sanring-muted)]">
      <span>{{ rangeLabel() }}</span>
      <ng-content select="[sanringPaginatorPageSize]"></ng-content>
    </div>

    <sanring-pagination [ariaLabel]="ariaLabel()" class="w-auto justify-end">
      <sanring-pagination-list>
        @if (showFirstLast()) {
          <button
            sanringPaginationNav
            type="button"
            [disabled]="!canPrevious()"
            [attr.aria-label]="firstPageLabel()"
            (click)="goToPage(0)"
          >
            <svg lucideChevronsLeft class="size-4"></svg>
          </button>
        }

        <button
          sanringPaginationNav
          type="button"
          [disabled]="!canPrevious()"
          [attr.aria-label]="previousPageLabel()"
          (click)="goToPage(pageIndex() - 1)"
        >
          <svg lucideChevronLeft class="size-4"></svg>
        </button>

        @for (token of pageTokens(); track token) {
          @if (isPageNumber(token)) {
            <button
              sanringPaginationItem
              type="button"
              [active]="token === pageIndex()"
              [attr.aria-label]="pageLabel(token)"
              (click)="goToPage(token)"
            >
              {{ token + 1 }}
            </button>
          } @else {
            <span
              class="flex size-9 items-center justify-center text-[var(--sanring-muted)]"
              aria-hidden="true"
            >
              ...
            </span>
          }
        }

        <button
          sanringPaginationNav
          type="button"
          [disabled]="!canNext()"
          [attr.aria-label]="nextPageLabel()"
          (click)="goToPage(pageIndex() + 1)"
        >
          <svg lucideChevronRight class="size-4"></svg>
        </button>

        @if (showFirstLast()) {
          <button
            sanringPaginationNav
            type="button"
            [disabled]="!canNext()"
            [attr.aria-label]="lastPageLabel()"
            (click)="goToPage(pageCount() - 1)"
          >
            <svg lucideChevronsRight class="size-4"></svg>
          </button>
        }
      </sanring-pagination-list>
    </sanring-pagination>
  `,
})
export class PaginatorComponent {
  readonly class = input<string | undefined>();
  readonly pageIndex = input(0);
  readonly pageSize = input(10);
  readonly length = input(0);
  readonly boundaryCount = input(1);
  readonly siblingCount = input(1);
  readonly showFirstLast = input(true);
  readonly ariaLabel = input('Pagination');
  readonly firstPageLabel = input('First page');
  readonly previousPageLabel = input('Previous page');
  readonly nextPageLabel = input('Next page');
  readonly lastPageLabel = input('Last page');

  readonly pageChange = output<PageEvent>();

  protected readonly paginatorClass = computed(() =>
    cn('flex w-full items-center justify-between gap-4', this.class()),
  );

  protected readonly pageCount = computed(() => {
    const pageSize = Math.max(1, this.pageSize());
    return Math.max(1, Math.ceil(Math.max(0, this.length()) / pageSize));
  });

  protected readonly canPrevious = computed(() => this.pageIndex() > 0);
  protected readonly canNext = computed(() => this.pageIndex() < this.pageCount() - 1);

  protected readonly rangeLabel = computed(() => {
    const length = Math.max(0, this.length());
    if (length === 0) return '0 of 0';

    const pageSize = Math.max(1, this.pageSize());
    const pageIndex = this.clampPageIndex(this.pageIndex());
    const start = pageIndex * pageSize + 1;
    const end = Math.min(start + pageSize - 1, length);

    return `${start}-${end} of ${length}`;
  });

  protected readonly pageTokens = computed<PageToken[]>(() => {
    const pageCount = this.pageCount();
    const current = this.clampPageIndex(this.pageIndex());
    const boundaryCount = Math.max(1, this.boundaryCount());
    const siblingCount = Math.max(0, this.siblingCount());
    const visiblePages = new Set<number>();

    if (pageCount <= boundaryCount * 2 + siblingCount * 2 + 1) {
      return Array.from({ length: pageCount }, (_, index) => index);
    }

    for (let page = 0; page < Math.min(boundaryCount, pageCount); page++) {
      visiblePages.add(page);
    }

    for (let page = Math.max(pageCount - boundaryCount, 0); page < pageCount; page++) {
      visiblePages.add(page);
    }

    for (
      let page = Math.max(current - siblingCount, 0);
      page <= Math.min(current + siblingCount, pageCount - 1);
      page++
    ) {
      visiblePages.add(page);
    }

    return Array.from(visiblePages)
      .sort((a, b) => a - b)
      .reduce<PageToken[]>((tokens, page, index, pages) => {
        if (index > 0 && page - pages[index - 1] > 1) {
          tokens.push(tokens.includes('ellipsis-start') ? 'ellipsis-end' : 'ellipsis-start');
        }

        tokens.push(page);
        return tokens;
      }, []);
  });

  protected isPageNumber(token: PageToken): token is number {
    return typeof token === 'number';
  }

  protected pageLabel(pageIndex: number): string {
    return pageIndex === this.pageIndex() ? `Page ${pageIndex + 1}, current page` : `Page ${pageIndex + 1}`;
  }

  protected goToPage(nextPageIndex: number): void {
    const pageIndex = this.clampPageIndex(nextPageIndex);
    const previousPageIndex = this.clampPageIndex(this.pageIndex());

    if (pageIndex === previousPageIndex) return;

    this.pageChange.emit({
      pageIndex,
      pageSize: Math.max(1, this.pageSize()),
      length: Math.max(0, this.length()),
      previousPageIndex,
    });
  }

  private clampPageIndex(pageIndex: number): number {
    return Math.min(Math.max(0, pageIndex), this.pageCount() - 1);
  }
}
