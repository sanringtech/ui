import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { ComboboxChipComponent } from './combobox-chip.component';
import { ComboboxChipInputComponent } from './combobox-chip-input.component';
import { ComboboxContentComponent } from './combobox-content.component';
import { ComboboxInputComponent } from './combobox-input.component';
import { ComboboxItemComponent } from './combobox-item.component';
import { ComboboxLabelComponent } from './combobox-label.component';
import { ComboboxListComponent } from './combobox-list.component';
import { ComboboxTriggerDirective } from './combobox-trigger.directive';
import { ComboboxComponent } from './combobox.component';

@Component({
  imports: [
    ComboboxComponent,
    ComboboxContentComponent,
    ComboboxInputComponent,
    ComboboxItemComponent,
    ComboboxLabelComponent,
    ComboboxListComponent,
  ],
  template: `
    <sanring-combobox class="custom-combobox-class" [(value)]="value">
      <sanring-combobox-label>Framework</sanring-combobox-label>
      <sanring-combobox-input placeholder="Search..." />
      <sanring-combobox-content>
        <sanring-combobox-list>
          <sanring-combobox-item value="angular" label="Angular">Angular</sanring-combobox-item>
          <sanring-combobox-item value="react" label="React">React</sanring-combobox-item>
          <sanring-combobox-item value="vue" label="Vue" [disabled]="true">Vue</sanring-combobox-item>
        </sanring-combobox-list>
      </sanring-combobox-content>
    </sanring-combobox>
  `,
})
class ComboboxTestHost {
  value: string | string[] | null = null;
}

@Component({
  imports: [
    ComboboxComponent,
    ComboboxChipComponent,
    ComboboxChipInputComponent,
    ComboboxContentComponent,
    ComboboxInputComponent,
    ComboboxItemComponent,
    ComboboxListComponent,
  ],
  template: `
    <sanring-combobox multiple [(value)]="value">
      <sanring-combobox-chip-input>
        @for (v of asArray(value); track v) {
          <sanring-combobox-chip [value]="v">{{ v }}</sanring-combobox-chip>
        }
        <sanring-combobox-input placeholder="Add..." />
      </sanring-combobox-chip-input>
      <sanring-combobox-content>
        <sanring-combobox-list>
          <sanring-combobox-item value="angular" label="Angular">Angular</sanring-combobox-item>
          <sanring-combobox-item value="react" label="React">React</sanring-combobox-item>
        </sanring-combobox-list>
      </sanring-combobox-content>
    </sanring-combobox>
  `,
})
class MultiComboboxTestHost {
  value: string[] | null = [];

  asArray(value: string | string[] | null): string[] {
    return Array.isArray(value) ? value : [];
  }
}

@Component({
  imports: [ComboboxComponent, ComboboxContentComponent, ComboboxInputComponent, ComboboxItemComponent, ComboboxTriggerDirective],
  template: `
    <sanring-combobox [(value)]="value">
      <button type="button" sanringComboboxTrigger>Open</button>
      <sanring-combobox-content>
        <sanring-combobox-input placeholder="Search..." />
        <sanring-combobox-item value="angular" label="Angular">Angular</sanring-combobox-item>
      </sanring-combobox-content>
    </sanring-combobox>
  `,
})
class TriggerComboboxTestHost {
  value: string | null = null;
}

// CDK's ActiveDescendantKeyManager (used internally by CollectionController for arrow-key
// navigation) reads event.keyCode, which the KeyboardEvent constructor's init dict can't set
// (it's a read-only getter) — same workaround already used in command.component.spec.ts.
const DOWN_ARROW = 40;

function arrowDown(): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
  Object.defineProperty(event, 'keyCode', { get: () => DOWN_ARROW });
  return event;
}

function enter(): KeyboardEvent {
  return new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
}

describe('ComboboxComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboboxTestHost, MultiComboboxTestHost, TriggerComboboxTestHost],
    }).compileComponents();
  });

  function createFixture(): ComponentFixture<ComboboxTestHost> {
    const fixture = TestBed.createComponent(ComboboxTestHost);
    fixture.detectChanges();
    return fixture;
  }

  function inputEl(fixture: ComponentFixture<ComboboxTestHost>): HTMLInputElement {
    return fixture.nativeElement.querySelector('input') as HTMLInputElement;
  }

  function items(fixture: ComponentFixture<ComboboxTestHost>): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="option"]'));
  }

  it('merges host class with consumer class', () => {
    const fixture = createFixture();
    const host = fixture.nativeElement.querySelector('sanring-combobox');
    expect(host?.classList.contains('custom-combobox-class')).toBe(true);
  });

  it('opens on input click and filters items by the typed search query', () => {
    const fixture = createFixture();
    const input = inputEl(fixture);

    input.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeTruthy();

    input.value = 'rea';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const visible = items(fixture).filter((el) => el.style.display !== 'none');
    expect(visible.map((el) => el.textContent?.trim())).toEqual(['React']);
  });

  it('navigates with ArrowDown, skipping disabled items, and selects with Enter', () => {
    const fixture = createFixture();
    const input = inputEl(fixture);
    input.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    // aria-selected tracks the actual chosen value, not keyboard highlight — the currently
    // highlighted item is instead communicated via aria-activedescendant on the input,
    // matching the ARIA combobox pattern's aria-activedescendant model. The first item
    // auto-activates as soon as the panel opens (no ArrowDown needed to start).
    let opts = items(fixture);
    expect(input.getAttribute('aria-activedescendant')).toBe(opts[0].id);

    input.dispatchEvent(arrowDown());
    fixture.detectChanges();
    opts = items(fixture);
    expect(input.getAttribute('aria-activedescendant')).toBe(opts[1].id);

    // Vue (index 2) is disabled — ArrowDown from React should skip it and wrap to Angular.
    input.dispatchEvent(arrowDown());
    fixture.detectChanges();
    opts = items(fixture);
    expect(input.getAttribute('aria-activedescendant')).toBe(opts[0].id);

    input.dispatchEvent(enter());
    fixture.detectChanges();

    expect(fixture.componentInstance.value).toBe('angular');
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeNull();
  });

  it('selects an item on click and ignores clicks on a disabled item', () => {
    const fixture = createFixture();
    inputEl(fixture).dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const opts = items(fixture);
    opts[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBeNull();

    opts[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe('react');
  });

  it('closes on Escape and on an outside click', () => {
    const fixture = createFixture();
    const input = inputEl(fixture);
    input.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeTruthy();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeNull();

    input.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeTruthy();

    document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeNull();
  });

  it('has no axe-detectable a11y violations, label/input and open listbox together', async () => {
    const fixture = createFixture();
    inputEl(fixture).dispatchEvent(new Event('click'));
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });

  describe('multiple mode', () => {
    function createMultiFixture(): ComponentFixture<MultiComboboxTestHost> {
      const fixture = TestBed.createComponent(MultiComboboxTestHost);
      fixture.detectChanges();
      return fixture;
    }

    it('sets aria-multiselectable on the listbox only when multiple', () => {
      const singleFixture = createFixture();
      inputEl(singleFixture).dispatchEvent(new Event('click'));
      singleFixture.detectChanges();
      expect(
        singleFixture.nativeElement.querySelector('[role="listbox"]').getAttribute('aria-multiselectable'),
      ).toBeNull();

      const multiFixture = createMultiFixture();
      multiFixture.nativeElement.querySelector('input').dispatchEvent(new Event('click'));
      multiFixture.detectChanges();
      expect(
        multiFixture.nativeElement.querySelector('[role="listbox"]').getAttribute('aria-multiselectable'),
      ).toBe('true');
    });

    it('adds values on select without closing, and removes them via a chip', () => {
      const fixture = createMultiFixture();
      const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      const opts = Array.from(fixture.nativeElement.querySelectorAll('[role="option"]')) as HTMLElement[];
      opts[0].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.value).toEqual(['angular']);
      // Multi-select stays open after picking an item.
      expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeTruthy();

      opts[1].click();
      fixture.detectChanges();
      expect(fixture.componentInstance.value).toEqual(['angular', 'react']);

      const removeButton = fixture.nativeElement.querySelector('sanring-combobox-chip button') as HTMLButtonElement;
      removeButton.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.value).toEqual(['react']);
    });
  });

  describe('trigger-opened content', () => {
    it('moves focus into the inner search input when opened via the trigger button', () => {
      const triggerFixture = TestBed.createComponent(TriggerComboboxTestHost);
      document.body.appendChild(triggerFixture.nativeElement);

      try {
        triggerFixture.detectChanges();
        const trigger = triggerFixture.nativeElement.querySelector('button') as HTMLButtonElement;
        trigger.click();
        triggerFixture.detectChanges();

        const innerInput = triggerFixture.nativeElement.querySelector('input[role="combobox"]');
        expect(document.activeElement).toBe(innerInput);
      } finally {
        triggerFixture.nativeElement.remove();
      }
    });
  });
});
