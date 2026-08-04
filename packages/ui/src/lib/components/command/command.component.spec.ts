import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandComponent } from './command.component';
import { CommandEmptyComponent } from './command-empty.component';
import { CommandGroupComponent } from './command-group.component';
import { CommandInputComponent } from './command-input.component';
import { CommandItemComponent } from './command-item.component';
import { CommandListComponent } from './command-list.component';

@Component({
  imports: [
    CommandComponent,
    CommandEmptyComponent,
    CommandGroupComponent,
    CommandInputComponent,
    CommandItemComponent,
    CommandListComponent,
  ],
  template: `
    <sanring-command (valueChange)="onValueChange($event)">
      <sanring-command-input placeholder="Search..." />
      <sanring-command-list>
        <sanring-command-empty>No results found.</sanring-command-empty>
        <sanring-command-group heading="Fruits">
          <sanring-command-item value="apple">Apple</sanring-command-item>
          <sanring-command-item value="banana">Banana</sanring-command-item>
          <sanring-command-item value="cherry" [disabled]="true">Cherry</sanring-command-item>
        </sanring-command-group>
      </sanring-command-list>
    </sanring-command>
  `,
})
class CommandTestHost {
  lastValue: string | null = null;

  onValueChange(value: string) {
    this.lastValue = value;
  }
}

// CDK's ActiveDescendantKeyManager (used internally by CollectionController for arrow-key
// navigation) reads event.keyCode, which the KeyboardEvent constructor's init dict can't set
// (it's a read-only getter) — same workaround already used in stepper.component.spec.ts.
const DOWN_ARROW = 40;
const UP_ARROW = 38;

function arrowKeydown(keyCode: number): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true });
  Object.defineProperty(event, 'keyCode', { get: () => keyCode });
  return event;
}

describe('CommandComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandTestHost],
    }).compileComponents();
  });

  async function createFixture(): Promise<ComponentFixture<CommandTestHost>> {
    const fixture = TestBed.createComponent(CommandTestHost);
    fixture.detectChanges();
    // The initial "active item" assignment happens inside a constructor effect
    // (see CommandComponent), so it needs a stability tick before it's observable.
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  function nativeElement(fixture: ComponentFixture<CommandTestHost>): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function inputEl(fixture: ComponentFixture<CommandTestHost>): HTMLInputElement {
    return nativeElement(fixture).querySelector('input') as HTMLInputElement;
  }

  function items(fixture: ComponentFixture<CommandTestHost>): HTMLElement[] {
    return Array.from(nativeElement(fixture).querySelectorAll<HTMLElement>('[role="option"]'));
  }

  function typeQuery(fixture: ComponentFixture<CommandTestHost>, query: string): void {
    const field = inputEl(fixture);
    field.value = query;
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function pressKey(fixture: ComponentFixture<CommandTestHost>, key: string): void {
    inputEl(fixture).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    fixture.detectChanges();
  }

  function pressArrow(fixture: ComponentFixture<CommandTestHost>, keyCode: number): void {
    inputEl(fixture).dispatchEvent(arrowKeydown(keyCode));
    fixture.detectChanges();
  }

  it('renders every item and activates the first focusable one by default', async () => {
    const fixture = await createFixture();
    const opts = items(fixture);

    expect(opts.map((el) => el.textContent?.trim())).toEqual(['Apple', 'Banana', 'Cherry']);
    expect(opts[0].getAttribute('aria-selected')).toBe('true');
    expect(inputEl(fixture).getAttribute('aria-activedescendant')).toBe(opts[0].id);
  });

  it('moves the active item with ArrowDown/ArrowUp, wrapping over disabled items', async () => {
    const fixture = await createFixture();

    pressArrow(fixture, DOWN_ARROW);
    let opts = items(fixture);
    expect(opts[1].getAttribute('aria-selected')).toBe('true');
    expect(inputEl(fixture).getAttribute('aria-activedescendant')).toBe(opts[1].id);

    // Cherry (index 2) is disabled, so ArrowDown from Banana should skip it and wrap to Apple.
    pressArrow(fixture, DOWN_ARROW);
    opts = items(fixture);
    expect(opts[0].getAttribute('aria-selected')).toBe('true');

    pressArrow(fixture, UP_ARROW);
    opts = items(fixture);
    expect(opts[1].getAttribute('aria-selected')).toBe('true');
  });

  it('selects the active item on Enter and emits valueChange', async () => {
    const fixture = await createFixture();
    const host = fixture.componentInstance;

    pressKey(fixture, 'Enter');

    expect(host.lastValue).toBe('apple');
  });

  it('selects an item on click and emits valueChange', async () => {
    const fixture = await createFixture();
    const host = fixture.componentInstance;

    items(fixture)[1].click();
    fixture.detectChanges();

    expect(host.lastValue).toBe('banana');
  });

  it('ignores clicks on a disabled item', async () => {
    const fixture = await createFixture();
    const host = fixture.componentInstance;

    items(fixture)[2].click();
    fixture.detectChanges();

    expect(host.lastValue).toBeNull();
  });

  it('filters items by the typed search query and shows the empty state when nothing matches', async () => {
    const fixture = await createFixture();

    typeQuery(fixture, 'ban');
    let visible = items(fixture).filter((el) => el.style.display !== 'none');
    expect(visible.map((el) => el.textContent?.trim())).toEqual(['Banana']);

    typeQuery(fixture, 'zzz');
    visible = items(fixture).filter((el) => el.style.display !== 'none');
    expect(visible).toEqual([]);

    const emptyState = nativeElement(fixture).querySelector('[role="presentation"]') as HTMLElement;
    expect(emptyState.style.display).not.toBe('none');
  });
});
