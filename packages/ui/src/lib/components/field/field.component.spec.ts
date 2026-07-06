import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { InputDirective } from '../input/input.directive';
import { SanringFieldComponent } from './field.component';
import { LabelDirective } from './label.directive';

@Component({
  standalone: true,
  imports: [SanringFieldComponent, LabelDirective, InputDirective],
  template: `
    <sanring-field [floating]="floating">
      <label sanringLabel>Email</label>
      <input sanringInput placeholder="name@sanring.dev" type="email" />
    </sanring-field>
  `,
})
class HostComponent {
  floating = false;
}

describe('SanringFieldComponent projection', () => {
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
    expect(fieldEl.style.getPropertyValue('--sanring-field-label-background')).toBe('rgb(24, 32, 33)');

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
