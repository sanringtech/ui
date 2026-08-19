import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { LabelDirective } from '../field/label.directive';
import { SanringFieldComponent } from '../field/field.component';
import { InputDirective } from './input.directive';

// No pre-existing component-level spec for the input directive itself —
// input.field.spec.ts only covers the CVA/Field integration regression.
// InputDirective has no ariaLabel of its own (a native <input> is always
// labeled externally, never from its own content), so the only realistic
// "correctly used" host is the documented pattern: wrapped in <sanring-field>
// with an associated <label sanringLabel>, which auto-binds `for` via DI.
@Component({
  imports: [SanringFieldComponent, LabelDirective, InputDirective],
  template: `
    <sanring-field>
      <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
      <label sanringLabel>Email</label>
      <input sanringInput placeholder="name@sanring.dev" type="email" />
    </sanring-field>
  `,
})
class InputA11yHost {}

@Component({
  imports: [InputDirective],
  template: `<input sanringInput class="custom-class" />`,
})
class InputClassHost {}

@Component({
  imports: [ReactiveFormsModule, InputDirective],
  template: `<input sanringInput [formControl]="control" />`,
})
class InputValidationHost {
  readonly control = new FormControl<string | null>(null, { validators: [Validators.required] });
}

@Component({
  imports: [InputDirective],
  template: `<input sanringInput id="custom-input-id" />`,
})
class InputCustomIdHost {}

@Component({
  imports: [InputDirective],
  template: `<input sanringInput />`,
})
class InputGeneratedIdHost {}

describe('InputDirective', () => {
  it('has no axe-detectable a11y violations when wrapped in sanring-field with a label', async () => {
    await TestBed.configureTestingModule({ imports: [InputA11yHost] }).compileComponents();
    const fixture = TestBed.createComponent(InputA11yHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });

  it('merges host class with consumer class', async () => {
    await TestBed.configureTestingModule({ imports: [InputClassHost] }).compileComponents();
    const fixture = TestBed.createComponent(InputClassHost);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.classList.contains('custom-class')).toBe(true);
    expect(input.classList.contains('peer')).toBe(true);
  });

  it('sets aria-invalid once the bound control is invalid and touched', async () => {
    await TestBed.configureTestingModule({ imports: [InputValidationHost] }).compileComponents();
    const fixture = TestBed.createComponent(InputValidationHost);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBeNull();

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('respects a consumer-provided id instead of overwriting it with a generated one', async () => {
    await TestBed.configureTestingModule({ imports: [InputCustomIdHost] }).compileComponents();
    const fixture = TestBed.createComponent(InputCustomIdHost);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.id).toBe('custom-input-id');
  });

  it('falls back to a generated id when none is provided', async () => {
    await TestBed.configureTestingModule({ imports: [InputGeneratedIdHost] }).compileComponents();
    const fixture = TestBed.createComponent(InputGeneratedIdHost);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.id).toMatch(/^sanring-input/);
  });
});
