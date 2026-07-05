import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CheckboxComponent } from './checkbox.component';
import { CheckedState } from './checkbox.types';

@Component({
  imports: [CheckboxComponent, FormsModule],
  template: `
    <sanring-checkbox [checked]="checked()" (checkedChange)="checked.set($event)" />
    <sanring-checkbox checked="indeterminate" />
    <sanring-checkbox [checked]="false" [disabled]="true" />
    <sanring-checkbox [(ngModel)]="modelValue" />
  `,
})
class CheckboxTestHost {
  checked = signal<CheckedState>(false);
  modelValue: CheckedState = false;
}

describe('CheckboxComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxTestHost],
    }).compileComponents();
  });

  it('toggles checked state on click and emits checkedChange', () => {
    const fixture = TestBed.createComponent(CheckboxTestHost);
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelectorAll('button[role="checkbox"]')[0] as HTMLElement;
    expect(checkbox.getAttribute('aria-checked')).toBe('false');

    checkbox.click();
    fixture.detectChanges();

    expect(checkbox.getAttribute('aria-checked')).toBe('true');
    expect(checkbox.getAttribute('data-state')).toBe('checked');
    expect(fixture.componentInstance.checked()).toBe(true);
  });

  it('renders the indeterminate state as aria-checked="mixed"', () => {
    const fixture = TestBed.createComponent(CheckboxTestHost);
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelectorAll('button[role="checkbox"]')[1] as HTMLElement;

    expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
    expect(checkbox.getAttribute('data-state')).toBe('indeterminate');
    expect(checkbox.querySelector('svg[lucideMinus]')).toBeTruthy();
  });

  it('ignores clicks while disabled', () => {
    const fixture = TestBed.createComponent(CheckboxTestHost);
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelectorAll('button[role="checkbox"]')[2] as HTMLElement;
    expect(checkbox.getAttribute('tabindex')).toBe('-1');

    checkbox.click();
    fixture.detectChanges();

    expect(checkbox.getAttribute('aria-checked')).toBe('false');
  });

  it('works as a ControlValueAccessor with ngModel', async () => {
    const fixture = TestBed.createComponent(CheckboxTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelectorAll('button[role="checkbox"]')[3] as HTMLElement;

    checkbox.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.modelValue).toBe(true);
  });
});
