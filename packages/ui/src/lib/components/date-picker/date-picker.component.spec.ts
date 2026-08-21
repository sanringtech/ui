import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CALENDAR_QUARTER_STARTS_ON } from '@sanring/date-picker-core';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { DatePickerComponent } from './date-picker.component';

@Component({
  imports: [DatePickerComponent],
  template: `
    <span id="billing-period-label">Billing period</span>
    <sanring-date-picker
      id="billing-period"
      class="custom-date-picker"
      required
      ariaLabel="Billing period"
      ariaLabelledBy="billing-period-label"
      ariaDescribedBy="billing-help"
      granularity="quarter"
      [gridColumns]="4"
      [quarterLabels]="quarterLabels"
      prevYearLabel="Previous year"
      nextYearLabel="Next year"
      (selectedDateChange)="selectedDate = $event"
    />
  `,
})
class DatePickerTestHost {
  readonly quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
  selectedDate: Date | null = null;
}

@Component({
  imports: [DatePickerComponent],
  template: `
    <sanring-date-picker mode="range" granularity="month" (selectedRangeChange)="range = $event" />
  `,
})
class RangeDatePickerTestHost {
  range: { start: Date | null; end: Date | null } | null = null;
}

@Component({
  imports: [DatePickerComponent],
  template: `
    <sanring-date-picker
      granularity="month"
      [disabled]="disabledMatcher"
      (selectedDateChange)="selectedDate = $event"
    />
  `,
})
class DisabledDatePickerTestHost {
  selectedDate: Date | null = null;
  // Blocks January — month grid cell 0 (see DEFAULT_GRID_COLUMNS.month layout).
  disabledMatcher = (date: Date) => date.getMonth() === 0;
}

@Component({
  imports: [DatePickerComponent],
  template: `<sanring-date-picker [disabled]="fullyDisabled()" granularity="month" />`,
})
class FullyDisabledDatePickerTestHost {
  readonly fullyDisabled = signal(false);
}

@Component({
  imports: [DatePickerComponent],
  template: `<sanring-date-picker disabled granularity="month" />`,
})
class BareDisabledDatePickerTestHost {}

describe('DatePickerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerTestHost],
      providers: [{ provide: CALENDAR_QUARTER_STARTS_ON, useValue: 0 }],
    }).compileComponents();
  });

  it('renders the picker grid with host field attributes and custom classes', () => {
    const fixture = TestBed.createComponent(DatePickerTestHost);
    fixture.detectChanges();

    const picker = fixture.nativeElement.querySelector('sanring-date-picker') as HTMLElement;
    const grid = fixture.nativeElement.querySelector('[role="grid"]') as HTMLElement;
    const cells = fixture.nativeElement.querySelectorAll(
      'button[role="gridcell"]',
    ) as NodeListOf<HTMLButtonElement>;

    expect(picker.id).toBe('billing-period');
    expect(picker.getAttribute('tabindex')).toBe('0');
    expect(picker.getAttribute('aria-describedby')).toBe('billing-help');
    expect(picker.getAttribute('aria-label')).toBe('Billing period');
    expect(picker.getAttribute('aria-labelledby')).toBe('billing-period-label');
    expect(picker.className).toContain('custom-date-picker');
    expect(grid.style.gridTemplateColumns).toBe('repeat(4, minmax(0, 1fr))');
    expect(cells.length).toBe(4);
    // aria-required lives on each gridcell, not the group host — "group" doesn't
    // support aria-required per axe-core's aria-allowed-attr rule, "gridcell" does.
    expect(Array.from(cells).every((cell) => cell.getAttribute('aria-required') === 'true')).toBe(
      true,
    );
    expect(Array.from(cells).map((cell: HTMLButtonElement) => cell.textContent?.trim())).toEqual([
      'Q1',
      'Q2',
      'Q3',
      'Q4',
    ]);
  });

  it('forwards navigation labels and emits selectedDateChange when a cell is clicked', () => {
    const fixture = TestBed.createComponent(DatePickerTestHost);
    fixture.detectChanges();

    const previous = fixture.nativeElement.querySelector(
      'button[aria-label="Previous year"]',
    ) as HTMLButtonElement;
    const next = fixture.nativeElement.querySelector(
      'button[aria-label="Next year"]',
    ) as HTMLButtonElement;
    const cell = fixture.nativeElement.querySelector(
      'button[role="gridcell"]',
    ) as HTMLButtonElement;

    expect(previous).toBeTruthy();
    expect(next).toBeTruthy();

    cell.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedDate).toBeInstanceOf(Date);
  });

  it('supports mode="range": two clicks commit a start/end range', () => {
    const fixture = TestBed.createComponent(RangeDatePickerTestHost);
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll(
      'button[role="gridcell"]',
    ) as NodeListOf<HTMLButtonElement>;

    cells[0].click();
    fixture.detectChanges();
    cells[2].click();
    fixture.detectChanges();

    const range = fixture.componentInstance.range;
    expect(range?.start).toBeInstanceOf(Date);
    expect(range?.end).toBeInstanceOf(Date);
  });

  it('blocks selection of dates matched by the disabled input', () => {
    const fixture = TestBed.createComponent(DisabledDatePickerTestHost);
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll(
      'button[role="gridcell"]',
    ) as NodeListOf<HTMLButtonElement>;
    const januaryCell = cells[0];

    expect(januaryCell.disabled).toBe(true);

    januaryCell.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedDate).toBeNull();
  });

  it('accepts disabled=true as a whole-control API while preserving matcher compatibility', () => {
    const fixture = TestBed.createComponent(FullyDisabledDatePickerTestHost);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof DatePickerComponent,
    ).componentInstance as DatePickerComponent;
    component.writeValue(new Date(new Date().getFullYear(), 0, 1));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-selected="true"]')).toBeTruthy();

    fixture.componentInstance.fullyDisabled.set(true);
    fixture.detectChanges();

    const picker = fixture.nativeElement.querySelector('sanring-date-picker') as HTMLElement;
    const cells = fixture.nativeElement.querySelectorAll(
      'button[role="gridcell"]',
    ) as NodeListOf<HTMLButtonElement>;

    expect(picker.getAttribute('aria-disabled')).toBe('true');
    expect(picker.getAttribute('tabindex')).toBe('-1');
    expect(picker.hasAttribute('inert')).toBe(true);
    expect(Array.from(cells).every((cell) => cell.disabled)).toBe(true);
    expect(fixture.nativeElement.querySelector('[aria-selected="true"]')).toBeTruthy();
  });

  it('coerces a bare disabled attribute to whole-control disabled state', () => {
    const fixture = TestBed.createComponent(BareDisabledDatePickerTestHost);
    fixture.detectChanges();

    const picker = fixture.nativeElement.querySelector('sanring-date-picker') as HTMLElement;
    expect(picker.getAttribute('aria-disabled')).toBe('true');
    expect(picker.getAttribute('tabindex')).toBe('-1');
    expect(picker.hasAttribute('inert')).toBe(true);
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(DatePickerTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
