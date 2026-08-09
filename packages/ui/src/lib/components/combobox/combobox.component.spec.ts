import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { ComboboxComponent } from './combobox.component';
import { ComboboxContentComponent } from './combobox-content.component';
import { ComboboxInputComponent } from './combobox-input.component';
import { ComboboxItemComponent } from './combobox-item.component';
import { ComboboxLabelComponent } from './combobox-label.component';
import { ComboboxListComponent } from './combobox-list.component';

// No pre-existing component-level spec for combobox — combobox.field.spec.ts
// only covers the CVA/Field integration regression. This adds a minimal
// baseline: the a11y check below is the first behavioral coverage combobox
// has had at all, not just the first a11y-specific one.
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
    <sanring-combobox>
      <sanring-combobox-label>Framework</sanring-combobox-label>
      <sanring-combobox-input placeholder="Search..." />
      <sanring-combobox-content>
        <sanring-combobox-list>
          <sanring-combobox-item value="angular" label="Angular">Angular</sanring-combobox-item>
          <sanring-combobox-item value="react" label="React">React</sanring-combobox-item>
        </sanring-combobox-list>
      </sanring-combobox-content>
    </sanring-combobox>
  `,
})
class ComboboxTestHost {}

describe('ComboboxComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboboxTestHost],
    }).compileComponents();
  });

  it('has no axe-detectable a11y violations, label/input and open listbox together', async () => {
    const fixture = TestBed.createComponent(ComboboxTestHost);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
