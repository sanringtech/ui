import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { SpinnerComponent } from './spinner.component';

@Component({
  imports: [SpinnerComponent],
  template: `<sanring-spinner class="custom-spinner" variant="pinwheel" size="xl" speed="fast" ariaLabel="Saving" />`,
})
class SpinnerTestHost {}

describe('SpinnerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerTestHost],
    }).compileComponents();
  });

  it('renders as a status indicator with an accessible label', () => {
    const fixture = TestBed.createComponent(SpinnerTestHost);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('sanring-spinner') as HTMLElement;

    expect(spinner.getAttribute('role')).toBe('status');
    expect(spinner.getAttribute('aria-label')).toBe('Saving');
  });

  it('merges host classes and applies size/speed classes to the icon', () => {
    const fixture = TestBed.createComponent(SpinnerTestHost);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('sanring-spinner') as HTMLElement;
    const icon = spinner.querySelector('svg') as SVGElement;

    expect(spinner.className).toContain('custom-spinner');
    expect(icon.getAttribute('class')).toContain('size-8');
    expect(icon.getAttribute('class')).toContain('animate-[spin_0.5s_linear_infinite]');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(SpinnerTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
