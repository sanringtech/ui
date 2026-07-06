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
