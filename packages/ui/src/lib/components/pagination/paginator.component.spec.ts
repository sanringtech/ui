import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PageEvent } from './pagination.type';
import { PaginatorComponent } from './paginator.component';

@Component({
  imports: [PaginatorComponent],
  template: `
    <sanring-paginator
      [pageIndex]="pageIndex()"
      [pageSize]="10"
      [length]="83"
      (pageChange)="onPageChange($event)"
    />
    <sanring-paginator [pageIndex]="0" [pageSize]="10" [length]="0" [showFirstLast]="false" />
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

describe('PaginatorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorTestHost],
    }).compileComponents();
  });

  function paginators(fixture: ReturnType<typeof TestBed.createComponent<PaginatorTestHost>>) {
    const nativeElement = fixture.nativeElement as HTMLElement;
    return nativeElement.querySelectorAll<HTMLElement>('sanring-paginator');
  }

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
});
