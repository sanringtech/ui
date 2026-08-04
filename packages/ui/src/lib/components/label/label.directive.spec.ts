import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LabelDirective } from './label.directive';

@Component({
  imports: [LabelDirective],
  template: `<label sanringLabel for="email" class="custom-label">Email</label>`,
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
});
