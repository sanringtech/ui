import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { CalendarLocale } from '@sanring/date-picker-core';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { CalendarComponent } from './calendar.component';

const testLocale: CalendarLocale = {
  monthLabels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  weekdayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekStartsOn: 0,
};

@Component({
  imports: [CalendarComponent],
  template: `
    <sanring-calendar
      id="booking-calendar"
      class="custom-calendar"
      required
      ariaDescribedBy="booking-help"
      [locale]="locale"
      [monthsToDisplay]="2"
      orientation="vertical"
      prevMonthLabel="Previous month"
      nextMonthLabel="Next month"
      jumpMonthLabel="Jump month"
      jumpYearLabel="Jump year"
      (selectedDateChange)="selectedDate = $event"
    />
  `,
})
class CalendarTestHost {
  readonly locale = testLocale;
  selectedDate: Date | null = null;
}

@Component({
  imports: [CalendarComponent],
  template: `
    <sanring-calendar mode="range" [locale]="locale" (selectedRangeChange)="range = $event" />
  `,
})
class CalendarRangeTestHost {
  readonly locale = testLocale;
  range: { start: Date | null; end: Date | null } = { start: null, end: null };
}

@Component({
  imports: [CalendarComponent],
  template: `<sanring-calendar [locale]="locale" [disabled]="isDisabled" />`,
})
class CalendarDisabledDayTestHost {
  readonly locale = testLocale;
  readonly isDisabled = (date: Date) => date.getDate() === 15;
}

describe('CalendarComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarTestHost, CalendarRangeTestHost, CalendarDisabledDayTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('renders month grids with host field attributes and custom classes', () => {
    const fixture = TestBed.createComponent(CalendarTestHost);
    fixture.detectChanges();

    const calendar = fixture.nativeElement.querySelector('sanring-calendar') as HTMLElement;
    const grids = fixture.nativeElement.querySelectorAll('[role="grid"]');
    const dayButtons = fixture.nativeElement.querySelectorAll(
      'button[role="gridcell"]',
    ) as NodeListOf<HTMLButtonElement>;

    expect(calendar.id).toBe('booking-calendar');
    expect(calendar.getAttribute('tabindex')).toBe('0');
    expect(calendar.getAttribute('aria-describedby')).toBe('booking-help');
    expect(calendar.className).toContain('custom-calendar');
    expect(grids.length).toBe(2);
    expect(dayButtons.length).toBe(84);
    // aria-required lives on each gridcell, not the group host — "group" doesn't
    // support aria-required per axe-core's aria-allowed-attr rule, "gridcell" does.
    expect(Array.from(dayButtons).every((button) => button.getAttribute('aria-required') === 'true')).toBe(
      true,
    );
  });

  it('forwards navigation and jump-select accessibility labels', async () => {
    const fixture = TestBed.createComponent(CalendarTestHost);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    const jumpTrigger = Array.from(buttons).find((button) => !button.getAttribute('aria-label'));

    expect(Array.from(buttons).some((button) => button.getAttribute('aria-label') === 'Previous month')).toBe(
      true,
    );
    expect(Array.from(buttons).some((button) => button.getAttribute('aria-label') === 'Next month')).toBe(
      true,
    );

    jumpTrigger?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const selects = overlayContainer
      .getContainerElement()
      .querySelectorAll('select') as NodeListOf<HTMLSelectElement>;

    expect(selects[0].getAttribute('aria-label')).toBe('Jump month');
    expect(selects[1].getAttribute('aria-label')).toBe('Jump year');
  });

  it('emits selectedDateChange when a day is clicked', () => {
    const fixture = TestBed.createComponent(CalendarTestHost);
    fixture.detectChanges();

    const day = fixture.nativeElement.querySelector('button[role="gridcell"]') as HTMLButtonElement;
    day.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedDate).toBeInstanceOf(Date);
  });

  it('commits a range on the second pick and emits selectedRangeChange', () => {
    const fixture = TestBed.createComponent(CalendarRangeTestHost);
    fixture.detectChanges();

    const days = fixture.nativeElement.querySelectorAll(
      'button[role="gridcell"]:not([disabled])',
    ) as NodeListOf<HTMLButtonElement>;

    days[5].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.range.start).toBeNull(); // first pick is only a draft

    days[10].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.range.start).toBeInstanceOf(Date);
    expect(fixture.componentInstance.range.end).toBeInstanceOf(Date);
  });

  it('blocks selecting a day matched by the disabled input', () => {
    const fixture = TestBed.createComponent(CalendarDisabledDayTestHost);
    fixture.detectChanges();

    const dayButtons = Array.from(
      fixture.nativeElement.querySelectorAll('button[role="gridcell"]'),
    ) as HTMLButtonElement[];
    const day15 = dayButtons.find((b) => b.textContent?.trim() === '15');

    expect(day15?.disabled).toBe(true);
    expect(day15?.getAttribute('aria-disabled')).toBe('true');

    day15?.click();
    fixture.detectChanges();

    expect(day15?.getAttribute('aria-selected')).toBeNull();
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(CalendarTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
