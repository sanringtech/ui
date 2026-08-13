import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { PageSizeSelectComponent } from './page-size-select.component';

@Component({
  imports: [PageSizeSelectComponent],
  template: `<sanring-page-size-select class="custom-class" [(pageSize)]="pageSize" />`,
})
class PageSizeSelectTestHost {
  pageSize = 10;
}

describe('PageSizeSelectComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSizeSelectTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function trigger(fixture: ReturnType<typeof TestBed.createComponent<PageSizeSelectTestHost>>) {
    return fixture.nativeElement.querySelector('button[sanringSelectTrigger]') as HTMLButtonElement;
  }

  it('renders without error', () => {
    const fixture = TestBed.createComponent(PageSizeSelectTestHost);
    fixture.detectChanges();

    expect(fixture.nativeElement).toBeTruthy();
  });

  it('merges consumer class onto the select trigger', () => {
    const fixture = TestBed.createComponent(PageSizeSelectTestHost);
    fixture.detectChanges();

    expect(trigger(fixture).classList.contains('custom-class')).toBe(true);
  });

  it('shows the bound page size and offers the default option set', async () => {
    const fixture = TestBed.createComponent(PageSizeSelectTestHost);
    fixture.detectChanges();
    // NgModel defers its first writeValue() to a microtask, so the initial
    // selection doesn't land in the same tick as the first detectChanges().
    await fixture.whenStable();
    fixture.detectChanges();

    expect(trigger(fixture).textContent?.trim()).toBe('10');

    trigger(fixture).click();
    fixture.detectChanges();

    const options = overlayContainer.getContainerElement().querySelectorAll('[role="option"]');
    const labels = Array.from(options).map((option) => option.textContent?.trim());
    expect(labels).toEqual(['10', '20', '50', '100']);
  });

  it('updates the bound pageSize when a different option is picked', () => {
    const fixture = TestBed.createComponent(PageSizeSelectTestHost);
    fixture.detectChanges();

    trigger(fixture).click();
    fixture.detectChanges();

    const options = overlayContainer.getContainerElement().querySelectorAll<HTMLElement>('[role="option"]');
    options[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.pageSize).toBe(20);
    expect(trigger(fixture).textContent?.trim()).toBe('20');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(PageSizeSelectTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
