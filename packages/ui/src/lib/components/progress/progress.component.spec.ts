import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { ProgressComponent } from './progress.component';

@Component({
  imports: [ProgressComponent],
  template: `
    <sanring-progress
      [value]="30"
      [max]="100"
      ariaLabel="Upload progress"
      ariaValueText="3 of 10 files uploaded"
    />
    <sanring-progress [value]="150" [max]="100" />
    <sanring-progress [value]="5" [max]="0" />
  `,
})
class ProgressTestHost {}

@Component({
  imports: [ProgressComponent],
  template: `<sanring-progress [value]="50" class="my-track" barClass="my-bar" ariaLabel="test" />`,
})
class ProgressClassHost {}

describe('ProgressComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressTestHost, ProgressClassHost],
    }).compileComponents();
  });

  function bars(fixture: ReturnType<typeof TestBed.createComponent<ProgressTestHost>>) {
    const nativeElement = fixture.nativeElement as HTMLElement;
    return nativeElement.querySelectorAll<HTMLElement>('[role="progressbar"]');
  }

  it('exposes aria-value attributes and sizes the bar to the percentage', () => {
    const fixture = TestBed.createComponent(ProgressTestHost);
    fixture.detectChanges();

    const bar = bars(fixture)[0];
    expect(bar.getAttribute('aria-valuenow')).toBe('30');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(bar.getAttribute('aria-label')).toBe('Upload progress');
    expect(bar.getAttribute('aria-valuetext')).toBe('3 of 10 files uploaded');

    const fill = bar.querySelector('div') as HTMLElement;
    expect(fill.style.width).toBe('30%');
  });

  it('clamps the percentage to 100 when value exceeds max', () => {
    const fixture = TestBed.createComponent(ProgressTestHost);
    fixture.detectChanges();

    const bar = bars(fixture)[1];
    const fill = bar.querySelector('div') as HTMLElement;
    expect(fill.style.width).toBe('100%');
    // aria-valuenow must stay within [aria-valuemin, aria-valuemax] — an unclamped
    // 150 here would violate the ARIA spec against aria-valuemax="100".
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
  });

  it('treats a non-positive max as 0% instead of dividing by zero', () => {
    const fixture = TestBed.createComponent(ProgressTestHost);
    fixture.detectChanges();

    const bar = bars(fixture)[2];
    const fill = bar.querySelector('div') as HTMLElement;
    expect(fill.style.width).toBe('0%');
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('0');
  });

  it('merges consumer class onto the container and barClass onto the bar', () => {
    const fixture = TestBed.createComponent(ProgressClassHost);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    const fill = container.querySelector('div') as HTMLElement;

    expect(container.className).toContain('my-track');
    expect(fill.className).toContain('my-bar');
  });

  it('has no axe-detectable a11y violations when given an accessible name', async () => {
    const fixture = TestBed.createComponent(ProgressTestHost);
    fixture.detectChanges();

    // Scoped to the first (labeled) progress bar — the other two in this
    // host are intentionally unlabeled, they only exercise clamping math.
    const bar = bars(fixture)[0];
    await expectNoA11yViolations(bar);
  });
});
