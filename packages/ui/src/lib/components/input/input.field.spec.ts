import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { ErrorMessageComponent, SanringFieldComponent } from '../field';
import { InputDirective } from './input.directive';

@Component({
  imports: [SanringFieldComponent, ErrorMessageComponent, InputDirective, ReactiveFormsModule],
  template: `
    <sanring-field>
      <input sanringInput [formControl]="control" />
      <sanring-error-message>Required</sanring-error-message>
    </sanring-field>
  `,
})
class InputFieldTestHost {
  readonly control = new FormControl<string | null>(null, { validators: [Validators.required] });
}

describe('InputDirective + SanringFieldComponent (sanity check, pre-existing impl)', () => {
  it('shows error after markAsTouched() with no other interaction', () => {
    const fixture = TestBed.createComponent(InputFieldTestHost);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('sanring-error-message') as HTMLElement;
    expect(errorEl.classList.contains('hidden')).toBe(true);

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(false);
  });
});
