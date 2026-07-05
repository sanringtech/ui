import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RadioGroupComponent } from './radio-group.component';
import { RadioItemComponent } from './radio-item.component';
import { RadioValue } from './radio.types';

@Component({
  imports: [RadioGroupComponent, RadioItemComponent],
  template: `
    <sanring-radio-group [value]="value()" (valueChange)="value.set($event)">
      <sanring-radio-item value="a">A</sanring-radio-item>
      <sanring-radio-item value="b">B</sanring-radio-item>
      <sanring-radio-item value="c">C</sanring-radio-item>
    </sanring-radio-group>

    <sanring-radio-group [disabled]="true">
      <sanring-radio-item value="x">X</sanring-radio-item>
    </sanring-radio-group>
  `,
})
class RadioGroupTestHost {
  value = signal<RadioValue | null>(null);
}

describe('RadioGroupComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupTestHost],
    }).compileComponents();
  });

  it('selects an item on click and unchecks the others', () => {
    const fixture = TestBed.createComponent(RadioGroupTestHost);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('sanring-radio-group')[0].querySelectorAll('[role="radio"]');
    (items[1] as HTMLElement).click();
    fixture.detectChanges();

    expect(items[0].getAttribute('aria-checked')).toBe('false');
    expect(items[1].getAttribute('aria-checked')).toBe('true');
    expect(items[1].getAttribute('data-state')).toBe('checked');
    expect(items[2].getAttribute('aria-checked')).toBe('false');
    expect(fixture.componentInstance.value()).toBe('b');
  });

  it('gives only the selected item a tabindex of 0 (roving tabindex)', () => {
    const fixture = TestBed.createComponent(RadioGroupTestHost);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('sanring-radio-group')[0].querySelectorAll('[role="radio"]');
    expect(items[0].getAttribute('tabindex')).toBe('0');

    (items[2] as HTMLElement).click();
    fixture.detectChanges();

    expect(items[0].getAttribute('tabindex')).toBe('-1');
    expect(items[2].getAttribute('tabindex')).toBe('0');
  });

  it('moves selection with ArrowDown from the focused item', () => {
    const fixture = TestBed.createComponent(RadioGroupTestHost);
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelectorAll('sanring-radio-group')[0];
    const items = group.querySelectorAll('[role="radio"]');

    (items[0] as HTMLElement).focus();
    (items[0] as HTMLElement).dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    group.querySelector('[role="radiogroup"]').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();

    expect(items[1].getAttribute('aria-checked')).toBe('true');
    expect(fixture.componentInstance.value()).toBe('b');
  });

  it('ignores clicks when the group is disabled', () => {
    const fixture = TestBed.createComponent(RadioGroupTestHost);
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelectorAll('sanring-radio-group')[1];
    const item = group.querySelector('[role="radio"]') as HTMLElement;

    expect(group.querySelector('[role="radiogroup"]').getAttribute('aria-disabled')).toBe('true');

    item.click();
    fixture.detectChanges();

    expect(item.getAttribute('aria-checked')).toBe('false');
  });
});
