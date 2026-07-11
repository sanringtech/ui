import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { ErrorMessageComponent, SanringFieldComponent } from '../field';
import { RadioGroupComponent } from './radio-group.component';
import { RadioItemComponent } from './radio-item.component';

@Component({
  imports: [SanringFieldComponent, ErrorMessageComponent, RadioGroupComponent, RadioItemComponent, ReactiveFormsModule],
  template: `
    <sanring-field>
      <sanring-radio-group [formControl]="control">
        <sanring-radio-item value="a">A</sanring-radio-item>
        <sanring-radio-item value="b">B</sanring-radio-item>
      </sanring-radio-group>
      <sanring-error-message>Required</sanring-error-message>
    </sanring-field>
  `,
})
class RadioGroupFieldTestHost {
  readonly control = new FormControl<string | null>(null, { validators: [Validators.required] });
}

describe('RadioGroupComponent + SanringFieldComponent integration', () => {
  it('does not throw when self-injecting NgControl alongside NG_VALUE_ACCESSOR (regression: NG0200)', () => {
    const fixture = TestBed.createComponent(RadioGroupFieldTestHost);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('shows the error message once the control is invalid and touched, and hides it once valid', () => {
    const fixture = TestBed.createComponent(RadioGroupFieldTestHost);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('sanring-error-message') as HTMLElement;
    expect(errorEl.classList.contains('hidden')).toBe(true);

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(false);
    const group = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(group.getAttribute('aria-invalid')).toBe('true');

    (fixture.nativeElement.querySelector('[role="radio"]') as HTMLElement).click();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(true);
    expect(group.getAttribute('aria-invalid')).toBeNull();
  });
});
