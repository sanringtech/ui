import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ProgressComponent } from './progress.component';

@Component({
  imports: [ProgressComponent],
  template: `
    <sanring-progress [value]="30" [max]="100" ariaLabel="Upload progress" />
    <sanring-progress [value]="150" [max]="100" />
    <sanring-progress [value]="5" [max]="0" />
  `,
})
class ProgressTestHost {}

describe('ProgressComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressTestHost],
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

    const fill = bar.querySelector('div') as HTMLElement;
    expect(fill.style.width).toBe('30%');
  });

  it('clamps the percentage to 100 when value exceeds max', () => {
    const fixture = TestBed.createComponent(ProgressTestHost);
    fixture.detectChanges();

    const fill = bars(fixture)[1].querySelector('div') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('treats a non-positive max as 0% instead of dividing by zero', () => {
    const fixture = TestBed.createComponent(ProgressTestHost);
    fixture.detectChanges();

    const fill = bars(fixture)[2].querySelector('div') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });
});
