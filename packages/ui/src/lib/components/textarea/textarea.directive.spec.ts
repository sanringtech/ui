import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { SanringFieldComponent } from '../field/field.component';
import { LabelDirective } from '../field/label.directive';
import { TextareaDirective } from './textarea.directive';

@Component({
  imports: [TextareaDirective],
  template: `<textarea sanringTextarea class="resize-y" placeholder="Message"></textarea>`,
})
class TextareaTestHost {}

// A bare <textarea> has no accessible-name mechanism of its own (same as
// <input>) — it's always labeled externally. TextareaDirective has no
// ariaLabel input, so the documented pairing (matching input.directive.spec.ts)
// is <sanring-field> + <label sanringLabel>.
@Component({
  imports: [SanringFieldComponent, LabelDirective, TextareaDirective],
  template: `
    <sanring-field>
      <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
      <label sanringLabel>Message</label>
      <textarea sanringTextarea placeholder="Write a note"></textarea>
    </sanring-field>
  `,
})
class TextareaA11yHost {}

@Component({
  imports: [ReactiveFormsModule, TextareaDirective],
  template: `<textarea sanringTextarea [formControl]="control"></textarea>`,
})
class TextareaValidationHost {
  readonly control = new FormControl<string | null>(null, { validators: [Validators.required] });
}

describe('TextareaDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaTestHost],
    }).compileComponents();
  });

  it('applies base textarea classes and preserves custom classes', () => {
    const fixture = TestBed.createComponent(TextareaTestHost);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('[sanringTextarea]') as HTMLTextAreaElement;

    expect(textarea.classList.contains('min-h-[80px]')).toBe(true);
    expect(textarea.classList.contains('w-full')).toBe(true);
    expect(textarea.classList.contains('resize-y')).toBe(true);
  });

  it('has no axe-detectable a11y violations when wrapped in sanring-field with a label', async () => {
    await TestBed.configureTestingModule({ imports: [TextareaA11yHost] }).compileComponents();
    const fixture = TestBed.createComponent(TextareaA11yHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });

  it('sets aria-invalid once the bound control is invalid and touched', async () => {
    await TestBed.configureTestingModule({ imports: [TextareaValidationHost] }).compileComponents();
    const fixture = TestBed.createComponent(TextareaValidationHost);
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.getAttribute('aria-invalid')).toBeNull();

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });
});
