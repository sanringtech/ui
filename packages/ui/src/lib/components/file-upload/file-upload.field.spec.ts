import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { ErrorMessageComponent, SanringFieldComponent } from '../field';
import { FileUploadComponent } from './file-upload.component';

// Validators.required 對陣列沒意義（[] 不是 null，一樣算合法）；Validators.minLength 也一樣
// 對「空」直接跳過驗證（Angular 的 isEmptyInputValue 對長度 0 的值不判定 invalid）。
// 要真的做出「沒有檔案 = invalid」的情境，只能自己寫一個驗證函式。
function requireAtLeastOneFile(control: AbstractControl<File[]>): ValidationErrors | null {
  return control.value.length > 0 ? null : { required: true };
}

@Component({
  imports: [SanringFieldComponent, ErrorMessageComponent, FileUploadComponent, ReactiveFormsModule],
  template: `
    <sanring-field>
      <sanring-file-upload [formControl]="control" />
      <sanring-error-message>A file is required</sanring-error-message>
    </sanring-field>
  `,
})
class FileUploadFieldTestHost {
  readonly control = new FormControl<File[]>([], {
    nonNullable: true,
    validators: [requireAtLeastOneFile],
  });
}

describe('FileUploadComponent + SanringFieldComponent integration', () => {
  it('does not throw when self-injecting NgControl alongside NG_VALUE_ACCESSOR (regression: NG0200)', () => {
    const fixture = TestBed.createComponent(FileUploadFieldTestHost);
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('shows the error message once the control is invalid and touched, and hides it once valid', () => {
    const fixture = TestBed.createComponent(FileUploadFieldTestHost);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('sanring-error-message') as HTMLElement;
    expect(errorEl.classList.contains('hidden')).toBe(true);

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(false);
    const upload = fixture.nativeElement.querySelector('sanring-file-upload') as HTMLElement;
    expect(upload.getAttribute('aria-invalid')).toBe('true');

    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    fixture.componentInstance.control.setValue([file]);
    fixture.detectChanges();

    expect(errorEl.classList.contains('hidden')).toBe(true);
    expect(upload.getAttribute('aria-invalid')).toBeNull();
  });
});
