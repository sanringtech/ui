import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { ErrorMessageComponent, SanringFieldComponent } from '../field';
import { CheckboxComponent } from './checkbox.component';
import { CheckedState } from './checkbox.types';

@Component({
  imports: [SanringFieldComponent, ErrorMessageComponent, CheckboxComponent, ReactiveFormsModule],
  template: `
    <sanring-field>
      <sanring-checkbox [formControl]="control" />
      <sanring-error-message>Must be checked</sanring-error-message>
    </sanring-field>
  `,
})
class CheckboxFieldTestHost {
  readonly control = new FormControl<CheckedState>(false, { validators: [Validators.requiredTrue] });
}

describe('CheckboxComponent + SanringFieldComponent integration', () => {
  it('does not throw when self-injecting NgControl alongside NG_VALUE_ACCESSOR (regression: NG0200)', () => {
    const fixture = TestBed.createComponent(CheckboxFieldTestHost);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('shows the error message once the control is invalid and touched, and hides it once valid', () => {
    const fixture = TestBed.createComponent(CheckboxFieldTestHost);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('sanring-error-message') as HTMLElement;
    expect(errorEl.classList.contains('hidden')).toBe(true);

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(false);
    const button = fixture.nativeElement.querySelector('button[role="checkbox"]') as HTMLElement;
    expect(button.getAttribute('aria-invalid')).toBe('true');

    button.click();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(true);
    expect(button.getAttribute('aria-invalid')).toBeNull();
  });
});
