import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

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

describe('InputDirective', () => {
  it('has no axe-detectable a11y violations when wrapped in sanring-field with a label', async () => {
    await TestBed.configureTestingModule({ imports: [InputA11yHost] }).compileComponents();
    const fixture = TestBed.createComponent(InputA11yHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
