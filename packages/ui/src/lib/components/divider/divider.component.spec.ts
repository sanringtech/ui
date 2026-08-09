import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { DividerComponent } from './divider.component';

@Component({
  imports: [DividerComponent],
  template: `
    <sanring-divider />
    <sanring-divider vertical />
    <sanring-divider inset="both" />
  `,
})
class DividerTestHost {}

describe('DividerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividerTestHost],
    }).compileComponents();
  });

  it('renders as an accessible separator', () => {
    const fixture = TestBed.createComponent(DividerTestHost);
    fixture.detectChanges();

    const divider = fixture.nativeElement.querySelector('sanring-divider') as HTMLElement;

    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('reflects vertical orientation and inset classes', () => {
    const fixture = TestBed.createComponent(DividerTestHost);
    fixture.detectChanges();

    const dividers = fixture.nativeElement.querySelectorAll('sanring-divider') as NodeListOf<HTMLElement>;

    expect(dividers[1].getAttribute('aria-orientation')).toBe('vertical');
    expect(dividers[1].className).toContain('w-px');
    expect(dividers[2].className).toContain('mx-10');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(DividerTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
