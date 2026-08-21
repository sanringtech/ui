import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { InputDirective } from '../input/input.directive';
import { DescriptionDirective } from './description.directive';
import { ErrorMessageComponent } from './error-message.component';
import { SanringFieldComponent } from './field.component';
import { LabelDirective } from './label.directive';

@Component({
  standalone: true,
  imports: [SanringFieldComponent, LabelDirective, InputDirective],
  template: `
    <sanring-field id="account-field" [floating]="floating">
      <!-- sanringLabel 會在執行期把 for 動態綁到 sanring-field 對應 input 的 id，
           eslint 的靜態分析看不到這層 host binding，屬於已知的 false positive -->
      <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
      <label sanringLabel>Email</label>
      <input sanringInput placeholder="name@sanring.dev" type="email" />
    </sanring-field>
  `,
})
class HostComponent {
  floating = false;
}

describe('SanringFieldComponent projection', () => {
  it('renders without error', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement).toBeTruthy();
  });

  it('allows consumers to provide a stable field id', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const fieldEl = fixture.nativeElement.querySelector('sanring-field') as HTMLElement;
    expect(fieldEl.id).toBe('account-field');
  });

  it('merges host class with consumer class', () => {
    TestBed.overrideComponent(HostComponent, {
      set: {
        template: `<sanring-field class="custom-class"><input sanringInput /></sanring-field>`,
      },
    });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const fieldEl = fixture.nativeElement.querySelector('sanring-field') as HTMLElement;
    expect(fieldEl.classList.contains('custom-class')).toBe(true);
    expect(fieldEl.classList.contains('flex')).toBe(true);
  });

  it('projects label and input when not floating', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const html: string = fixture.nativeElement.innerHTML;
    expect(html).toContain('Email');
    expect(html).toContain('sanringinput');
  });

  it('projects label and input when floating', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.floating = true;
    fixture.detectChanges();
    const html: string = fixture.nativeElement.innerHTML;
    expect(html).toContain('Email');
    expect(html).toContain('sanringinput');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});

@Component({
  standalone: true,
  imports: [
    SanringFieldComponent,
    InputDirective,
    DescriptionDirective,
    ErrorMessageComponent,
    ReactiveFormsModule,
  ],
  template: `
    <sanring-field>
      <input sanringInput [formControl]="control" />
      <div sanringDescription>Use your work email</div>
      <sanring-error-message>Email is required</sanring-error-message>
    </sanring-field>
  `,
})
class DescribedByTestHost {
  readonly control = new FormControl<string | null>(null, { validators: [Validators.required] });
}

describe('SanringFieldComponent aria-describedby wiring', () => {
  it('forwards registered Description/ErrorMessage ids onto the projected control', () => {
    const fixture = TestBed.createComponent(DescribedByTestHost);
    fixture.detectChanges();

    const inputEl = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const descriptionEl = fixture.nativeElement.querySelector(
      '[sanringDescription]',
    ) as HTMLElement;

    // 尚未觸發驗證錯誤：只有 description 的 id 出現在 aria-describedby
    expect(inputEl.getAttribute('aria-describedby')).toBe(descriptionEl.id);

    fixture.componentInstance.control.markAsTouched();
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('sanring-error-message') as HTMLElement;
    const describedBy = inputEl.getAttribute('aria-describedby');
    expect(describedBy).toContain(descriptionEl.id);
    expect(describedBy).toContain(errorEl.id);
  });
});

describe('SanringFieldComponent ambient background auto-detection', () => {
  it('picks up the nearest ancestor background-color when nothing is overridden', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.floating = true;
    // 模擬外層容器 (例如 code-previewer 面板) 有自己的實際背景色
    fixture.nativeElement.style.backgroundColor = 'rgb(24, 32, 33)';
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();

    const fieldEl = fixture.nativeElement.querySelector('sanring-field') as HTMLElement;
    expect(fieldEl.style.getPropertyValue('--sanring-field-label-background')).toBe(
      'rgb(24, 32, 33)',
    );

    fixture.nativeElement.remove();
  });

  it('does not override an explicitly set --sanring-field-label-background', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.floating = true;
    fixture.nativeElement.style.backgroundColor = 'rgb(24, 32, 33)';
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();

    // 搶在 afterNextRender 的偵測邏輯跑之前，同步設定一個「開發者手動指定」的值
    const fieldEl = fixture.nativeElement.querySelector('sanring-field') as HTMLElement;
    fieldEl.style.setProperty('--sanring-field-label-background', 'rgb(1, 2, 3)');

    await fixture.whenStable();

    expect(fieldEl.style.getPropertyValue('--sanring-field-label-background')).toBe('rgb(1, 2, 3)');

    fixture.nativeElement.remove();
  });
});
