import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
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

// Separate from CheckboxTestHost above: that host renders bare checkboxes with
// no accessible name on purpose (it only exercises click/state behavior), which
// axe would correctly flag as a real "button-name" violation — that's a fixture
// gap, not a component bug. This host shows the component used the way its own
// `ariaLabel` input is meant to be used.
@Component({
  imports: [CheckboxComponent],
  template: `<sanring-checkbox [checked]="false" ariaLabel="Accept terms" />`,
})
class CheckboxA11yHost {}

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

  it('has no axe-detectable a11y violations when given an accessible name', async () => {
    await TestBed.configureTestingModule({ imports: [CheckboxA11yHost] }).compileComponents();
    const fixture = TestBed.createComponent(CheckboxA11yHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
