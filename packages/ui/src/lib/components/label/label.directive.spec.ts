import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { LabelDirective } from './label.directive';

@Component({
  imports: [LabelDirective],
  template: `
    <label sanringLabel for="email" class="custom-label">Email</label>
    <input id="email" type="email" />
  `,
})
class LabelTestHost {}

describe('LabelDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelTestHost],
    }).compileComponents();
  });

  it('preserves native label association while merging classes', () => {
    const fixture = TestBed.createComponent(LabelTestHost);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;

    expect(label.htmlFor).toBe('email');
    expect(label.textContent?.trim()).toBe('Email');
    expect(label.className).toContain('custom-label');
    expect(label.className).toContain('font-medium');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(LabelTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
