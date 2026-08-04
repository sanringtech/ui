import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SelectComponent } from './select.component';
import { SelectContentComponent } from './select-content.component';
import { SelectItemComponent } from './select-item.component';
import { SelectTriggerDirective } from './select-trigger.directive';
import { SelectValueComponent } from './select-value.component';

@Component({
  imports: [
    SelectComponent,
    SelectContentComponent,
    SelectItemComponent,
    SelectTriggerDirective,
    SelectValueComponent,
    ReactiveFormsModule,
  ],
  template: `
    <sanring-select>
      <button type="button" sanringSelectTrigger>
        <sanring-select-value placeholder="Pick one" />
      </button>
      <sanring-select-content>
        <sanring-select-item value="apple">Apple</sanring-select-item>
        <sanring-select-item value="banana" [disabled]="true">Banana</sanring-select-item>
        <sanring-select-item value="cherry">Cherry</sanring-select-item>
      </sanring-select-content>
    </sanring-select>

    <sanring-select [formControl]="disabledControl">
      <button type="button" sanringSelectTrigger>
        <sanring-select-value placeholder="Disabled" />
      </button>
      <sanring-select-content>
        <sanring-select-item value="x">X</sanring-select-item>
      </sanring-select-content>
    </sanring-select>
  `,
})
class SelectTestHost {
  disabledControl = new FormControl({ value: null, disabled: true });
}

// CDK's ListKeyManager (which FocusKeyManager/SelectContentComponent's arrow-key handling
// delegates to) reads event.keyCode, which the KeyboardEvent constructor's init dict can't
// set (it's a read-only getter) — same workaround already used in stepper.component.spec.ts
// and command.component.spec.ts.
const DOWN_ARROW = 40;
const UP_ARROW = 38;

function arrowKeydown(keyCode: number): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true });
  Object.defineProperty(event, 'keyCode', { get: () => keyCode });
  return event;
}

describe('SelectComponent', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTestHost],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function triggers(fixture: ReturnType<typeof TestBed.createComponent<SelectTestHost>>) {
    const nativeElement = fixture.nativeElement as HTMLElement;
    return nativeElement.querySelectorAll<HTMLButtonElement>('button[sanringSelectTrigger]');
  }

  it('shows the placeholder before a value is chosen', () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    fixture.detectChanges();

    expect(triggers(fixture)[0].textContent?.trim()).toBe('Pick one');
  });

  it('opens the listbox on trigger click', () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    fixture.detectChanges();

    const trigger = triggers(fixture)[0];
    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('data-state')).toBe('open');

    const listbox = overlayContainer.getContainerElement().querySelector('[role="listbox"]');
    expect(listbox).toBeTruthy();
    expect(listbox?.getAttribute('data-state')).toBe('open');
  });

  it('selects an item on click, closes the listbox, and updates the displayed value', () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    fixture.detectChanges();

    const trigger = triggers(fixture)[0];
    trigger.click();
    fixture.detectChanges();

    const option = overlayContainer.getContainerElement().querySelector('[role="option"]') as HTMLElement;
    option.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.textContent?.trim()).toBe('Apple');
  });

  it('ignores clicks on a disabled item', () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    fixture.detectChanges();

    const trigger = triggers(fixture)[0];
    trigger.click();
    fixture.detectChanges();

    const options = overlayContainer.getContainerElement().querySelectorAll('[role="option"]');
    const disabledOption = options[1] as HTMLElement;
    expect(disabledOption.getAttribute('aria-disabled')).toBe('true');

    disabledOption.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('moves real focus to the first enabled option as soon as the listbox opens', async () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    fixture.detectChanges();

    const trigger = triggers(fixture)[0];
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const options = overlayContainer.getContainerElement().querySelectorAll('[role="option"]');
    expect(document.activeElement).toBe(options[0]);
  });

  it('moves the active option with ArrowDown/ArrowUp, wrapping over the disabled item', async () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    fixture.detectChanges();

    const trigger = triggers(fixture)[0];
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const options = Array.from(
      overlayContainer.getContainerElement().querySelectorAll<HTMLElement>('[role="option"]'),
    );
    const [apple, banana, cherry] = options;

    // Banana is disabled — ArrowDown from Apple should skip it and land on Cherry.
    document.activeElement?.dispatchEvent(arrowKeydown(DOWN_ARROW));
    fixture.detectChanges();
    expect(document.activeElement).toBe(cherry);
    expect(banana.getAttribute('aria-disabled')).toBe('true');

    // Wraps back to Apple, still skipping Banana.
    document.activeElement?.dispatchEvent(arrowKeydown(DOWN_ARROW));
    fixture.detectChanges();
    expect(document.activeElement).toBe(apple);

    // ArrowUp from Apple wraps the other direction, skipping Banana again, landing on Cherry.
    document.activeElement?.dispatchEvent(arrowKeydown(UP_ARROW));
    fixture.detectChanges();
    expect(document.activeElement).toBe(cherry);
  });

  it('selects the focused option on Enter', async () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    fixture.detectChanges();

    const trigger = triggers(fixture)[0];
    trigger.click();
    fixture.detectChanges();
    await fixture.whenStable();

    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.textContent?.trim()).toBe('Apple');
  });

  it('opens on ArrowDown when closed', () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    fixture.detectChanges();

    const trigger = triggers(fixture)[0];
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('ignores clicks entirely while the select is disabled', () => {
    const fixture = TestBed.createComponent(SelectTestHost);
    fixture.detectChanges();

    const trigger = triggers(fixture)[1];
    expect(trigger.disabled).toBe(true);

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
