import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { ErrorMessageComponent, SanringFieldComponent } from '../field';
import { ComboboxComponent } from './combobox.component';
import { ComboboxInputComponent } from './combobox-input.component';

@Component({
  imports: [SanringFieldComponent, ErrorMessageComponent, ComboboxComponent, ComboboxInputComponent, ReactiveFormsModule],
  template: `
    <sanring-field>
      <sanring-combobox [formControl]="control">
        <sanring-combobox-input placeholder="Search" />
      </sanring-combobox>
      <sanring-error-message>Required</sanring-error-message>
    </sanring-field>
  `,
})
class ComboboxFieldTestHost {
  readonly control = new FormControl<string | null>(null, { validators: [Validators.required] });
}

describe('ComboboxComponent + SanringFieldComponent integration', () => {
  it('does not throw when self-injecting NgControl alongside NG_VALUE_ACCESSOR (regression: NG0200)', () => {
    const fixture = TestBed.createComponent(ComboboxFieldTestHost);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('shows the error message once the control is invalid and touched, and hides it once valid', () => {
    const fixture = TestBed.createComponent(ComboboxFieldTestHost);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('sanring-error-message') as HTMLElement;
    expect(errorEl.classList.contains('hidden')).toBe(true);

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(false);
    const input = fixture.nativeElement.querySelector('input[role="combobox"]') as HTMLElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');

    fixture.componentInstance.control.setValue('apple');
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });
});
