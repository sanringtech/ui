import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { PageEvent } from './pagination.type';
import { PaginatorComponent } from './paginator.component';
import { PaginationComponent } from './pagination.component';
import { PaginationItemDirective } from './pagination-item.directive';
import { PaginationNavDirective } from './pagination-nav.directive';

@Component({
  imports: [PaginatorComponent],
  template: `
    <sanring-paginator
      class="custom-class"
      [pageIndex]="pageIndex()"
      [pageSize]="10"
      [length]="83"
      (pageChange)="onPageChange($event)"
    />
    <sanring-paginator
      [pageIndex]="0"
      [pageSize]="10"
      [length]="0"
      [showFirstLast]="false"
      ariaLabel="Empty pagination"
    />
  `,
})
class PaginatorTestHost {
  pageIndex = signal(4);
  lastEvent: PageEvent | null = null;

  onPageChange(event: PageEvent): void {
    this.lastEvent = event;
    this.pageIndex.set(event.pageIndex);
  }
}

// sanringPaginationItem/sanringPaginationNav 也支援用在 <a> 上(URL-based 分頁),
// 但 PaginatorComponent 自己的 template 只用 <button>,這條路徑完全沒被上面的
// host 覆蓋到——DisableableNavDirective 對 anchor 的 disabled 處理(tabindex=-1
// + 攔截 click)是獨立於 native disabled 屬性之外的另一套邏輯,值得單獨驗證。
@Component({
  imports: [PaginationComponent, PaginationItemDirective, PaginationNavDirective],
  template: `
    <sanring-pagination>
      <a sanringPaginationNav href="?page=1" [disabled]="true">Previous</a>
      <a sanringPaginationItem href="?page=2" [active]="true">2</a>
    </sanring-pagination>
  `,
})
class AnchorPaginationTestHost {}

describe('PaginatorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorTestHost, AnchorPaginationTestHost],
    }).compileComponents();
  });

  function paginators(fixture: ReturnType<typeof TestBed.createComponent<PaginatorTestHost>>) {
    const nativeElement = fixture.nativeElement as HTMLElement;
    return nativeElement.querySelectorAll<HTMLElement>('sanring-paginator');
  }

  it('renders without error', () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    fixture.detectChanges();

    expect(fixture.nativeElement).toBeTruthy();
  });

  it('merges host class with consumer class', () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    fixture.detectChanges();

    expect(paginators(fixture)[0].classList.contains('custom-class')).toBe(true);
  });

  it('exposes a navigation landmark with an accessible name', () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    fixture.detectChanges();

    const nav = paginators(fixture)[0].querySelector('sanring-pagination');
    expect(nav?.getAttribute('role')).toBe('navigation');
    expect(nav?.getAttribute('aria-label')).toBe('Pagination');
  });

  it('shows the current range out of the total length', () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    fixture.detectChanges();

    const range = paginators(fixture)[0].querySelector('span');
    expect(range?.textContent?.trim()).toBe('41-50 of 83');
  });

  it('shows "0 of 0" and disables every nav button when there is nothing to page through', () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    fixture.detectChanges();

    const empty = paginators(fixture)[1];
    expect(empty.querySelector('span')?.textContent?.trim()).toBe('0 of 0');

    const navButtons = empty.querySelectorAll<HTMLButtonElement>('button[sanringPaginationNav]');
    navButtons.forEach((button: HTMLButtonElement) => expect(button.disabled).toBe(true));
  });

  it('collapses distant pages into ellipses around boundary and sibling pages', () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    fixture.detectChanges();

    const pageButtons = paginators(fixture)[0].querySelectorAll<HTMLButtonElement>('button[sanringPaginationItem]');
    const labels = Array.from(pageButtons).map((button: HTMLButtonElement) => button.textContent?.trim());
    expect(labels).toEqual(['1', '4', '5', '6', '9']);

    const ellipses = paginators(fixture)[0].querySelectorAll('span[aria-hidden="true"]');
    expect(ellipses.length).toBe(2);

    const activeButton = Array.from(pageButtons).find(
      (button: HTMLButtonElement) => button.getAttribute('aria-current') === 'page',
    ) as HTMLButtonElement;
    expect(activeButton.textContent?.trim()).toBe('5');
  });

  it('hides the first/last jump buttons when showFirstLast is false', () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    fixture.detectChanges();

    const navButtons = paginators(fixture)[1].querySelectorAll<HTMLButtonElement>('button[sanringPaginationNav]');
    expect(navButtons.length).toBe(2);
  });

  it('emits pageChange with the clicked page index', () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    fixture.detectChanges();

    const pageButtons = paginators(fixture)[0].querySelectorAll<HTMLButtonElement>('button[sanringPaginationItem]');
    (pageButtons[0] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.lastEvent).toEqual({
      pageIndex: 0,
      pageSize: 10,
      length: 83,
      previousPageIndex: 4,
    });
  });

  it('does nothing when the currently active page is clicked again', () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    fixture.detectChanges();

    const pageButtons = paginators(fixture)[0].querySelectorAll<HTMLButtonElement>('button[sanringPaginationItem]');
    const activeButton = Array.from(pageButtons).find(
      (button: HTMLButtonElement) => button.getAttribute('aria-current') === 'page',
    ) as HTMLButtonElement;

    activeButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.lastEvent).toBeNull();
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(PaginatorTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });

  it('marks a disabled <a> unfocusable and blocks navigation on click, since native disabled has no effect on anchors', () => {
    const fixture = TestBed.createComponent(AnchorPaginationTestHost);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const disabledNav = nativeElement.querySelector('a[sanringPaginationNav]') as HTMLAnchorElement;
    const activeItem = nativeElement.querySelector('a[sanringPaginationItem]') as HTMLAnchorElement;

    expect(disabledNav.getAttribute('aria-disabled')).toBe('true');
    expect(disabledNav.getAttribute('tabindex')).toBe('-1');
    expect(activeItem.getAttribute('aria-current')).toBe('page');

    const event = new MouseEvent('click', { cancelable: true, bubbles: true });
    disabledNav.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
