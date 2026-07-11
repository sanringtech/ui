import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { ErrorMessageComponent, SanringFieldComponent } from '../field';
import { SwitchComponent } from './switch.component';

@Component({
  imports: [SanringFieldComponent, ErrorMessageComponent, SwitchComponent, ReactiveFormsModule],
  template: `
    <sanring-field>
      <sanring-switch [formControl]="control" />
      <sanring-error-message>Must be enabled</sanring-error-message>
    </sanring-field>
  `,
})
class SwitchFieldTestHost {
  readonly control = new FormControl<boolean>(false, { validators: [Validators.requiredTrue] });
}

describe('SwitchComponent + SanringFieldComponent integration', () => {
  it('does not throw when self-injecting NgControl alongside NG_VALUE_ACCESSOR (regression: NG0200)', () => {
    const fixture = TestBed.createComponent(SwitchFieldTestHost);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('shows the error message once the control is invalid and touched, and hides it once valid', () => {
    const fixture = TestBed.createComponent(SwitchFieldTestHost);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('sanring-error-message') as HTMLElement;
    expect(errorEl.classList.contains('hidden')).toBe(true);

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(false);
    const button = fixture.nativeElement.querySelector('button[role="switch"]') as HTMLElement;
    expect(button.getAttribute('aria-invalid')).toBe('true');

    button.click();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(true);
    expect(button.getAttribute('aria-invalid')).toBeNull();
  });
});
