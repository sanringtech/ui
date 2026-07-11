import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { ErrorMessageComponent, SanringFieldComponent } from '../field';
import { SliderComponent } from './slider.component';

@Component({
  imports: [SanringFieldComponent, ErrorMessageComponent, SliderComponent, ReactiveFormsModule],
  template: `
    <sanring-field>
      <sanring-slider [formControl]="control" [min]="0" [max]="100" />
      <sanring-error-message>Must be at least 80</sanring-error-message>
    </sanring-field>
  `,
})
class SliderFieldTestHost {
  // 預設值 50 沒過 min(80) 驗證——Validators.required 對數字沒有意義（0 也算合法值），
  // 用 min 才能實際製造出一個「一開始就是 invalid」的情境
  readonly control = new FormControl<number>(50, { validators: [Validators.min(80)] });
}

describe('SliderComponent + SanringFieldComponent integration', () => {
  it('does not throw when self-injecting NgControl alongside NG_VALUE_ACCESSOR (regression: NG0200)', () => {
    const fixture = TestBed.createComponent(SliderFieldTestHost);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('shows the error message once the control is invalid and touched, and hides it once valid', () => {
    const fixture = TestBed.createComponent(SliderFieldTestHost);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('sanring-error-message') as HTMLElement;
    expect(errorEl.classList.contains('hidden')).toBe(true);

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(false);
    const slider = fixture.nativeElement.querySelector('[role="slider"]') as HTMLElement;
    expect(slider.getAttribute('aria-invalid')).toBe('true');

    fixture.componentInstance.control.setValue(90);
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(true);
    expect(slider.getAttribute('aria-invalid')).toBeNull();
  });
});
