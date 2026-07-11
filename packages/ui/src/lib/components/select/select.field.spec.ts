import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { ErrorMessageComponent, SanringFieldComponent } from '../field';
import { SelectComponent } from './select.component';
import { SelectContentComponent } from './select-content.component';
import { SelectItemComponent } from './select-item.component';
import { SelectTriggerDirective } from './select-trigger.directive';
import { SelectValueComponent } from './select-value.component';

@Component({
  imports: [
    SanringFieldComponent,
    ErrorMessageComponent,
    SelectComponent,
    SelectContentComponent,
    SelectItemComponent,
    SelectTriggerDirective,
    SelectValueComponent,
    ReactiveFormsModule,
  ],
  template: `
    <sanring-field>
      <sanring-select [formControl]="control">
        <button type="button" sanringSelectTrigger>
          <sanring-select-value placeholder="Pick one" />
        </button>
        <sanring-select-content>
          <sanring-select-item value="apple">Apple</sanring-select-item>
        </sanring-select-content>
      </sanring-select>
      <sanring-error-message>Required</sanring-error-message>
    </sanring-field>
  `,
})
class SelectFieldTestHost {
  readonly control = new FormControl<string | null>(null, { validators: [Validators.required] });
}

describe('SelectComponent + SanringFieldComponent integration', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SelectFieldTestHost] }).compileComponents();
    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('does not throw when self-injecting NgControl alongside NG_VALUE_ACCESSOR (regression: NG0200)', () => {
    const fixture = TestBed.createComponent(SelectFieldTestHost);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('shows the error message once the control is invalid and touched, and hides it once valid', () => {
    const fixture = TestBed.createComponent(SelectFieldTestHost);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('sanring-error-message') as HTMLElement;
    expect(errorEl.classList.contains('hidden')).toBe(true);

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(false);
    const trigger = fixture.nativeElement.querySelector('button[sanringSelectTrigger]') as HTMLElement;
    expect(trigger.getAttribute('aria-invalid')).toBe('true');

    trigger.click();
    fixture.detectChanges();
    const option = overlayContainer.getContainerElement().querySelector('[role="option"]') as HTMLElement;
    option.click();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(true);
    expect(trigger.getAttribute('aria-invalid')).toBeNull();
  });
});
