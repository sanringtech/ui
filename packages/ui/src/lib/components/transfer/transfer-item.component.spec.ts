import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TransferItemComponent } from './transfer-item.component';
import { TransferPanelComponent } from './transfer-panel.component';
import { TransferComponent } from './transfer.component';
import { TransferItem, TransferMode } from './transfer.type';

@Component({
  imports: [TransferComponent, TransferPanelComponent, TransferItemComponent],
  template: `
    <sanring-transfer [items]="items()" [selectedKeys]="selectedKeys()" [mode]="mode()">
      <sanring-transfer-panel direction="source">
        <sanring-transfer-item [item]="items()[0]" />
        <sanring-transfer-item [item]="items()[1]" />
      </sanring-transfer-panel>
      <sanring-transfer-panel direction="target">
        <sanring-transfer-item [item]="items()[2]" />
      </sanring-transfer-panel>
    </sanring-transfer>
  `,
})
class TransferItemTestHost {
  readonly items = signal<TransferItem[]>([
    { key: '1', label: 'One' },
    { key: '2', label: 'Two', disabled: true },
    { key: '3', label: 'Three' },
  ]);
  readonly selectedKeys = signal<string[]>(['3']);
  readonly mode = signal<TransferMode>('two-way');
}

describe('TransferItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferItemTestHost],
    }).compileComponents();
  });

  function createFixture() {
    const fixture = TestBed.createComponent(TransferItemTestHost);
    fixture.detectChanges();
    return fixture;
  }

  function checkboxFor(root: HTMLElement, label: string) {
    const checkbox = root.querySelector<HTMLElement>(`[role="checkbox"][aria-label="${label}"]`);
    if (!checkbox) throw new Error(`Expected a checkbox labelled "${label}"`);
    return checkbox;
  }

  it('renders the item label next to its checkbox', () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const item = root.querySelector('sanring-transfer-item') as HTMLElement;

    expect(item.textContent?.trim()).toBe('One');
    expect(checkboxFor(root, 'One')).toBeTruthy();
  });

  it('toggles the panel selection through the checkbox and reflects it back as checked', () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const checkbox = checkboxFor(root, 'One');

    expect(checkbox.getAttribute('aria-checked')).toBe('false');

    checkbox.click();
    fixture.detectChanges();
    expect(checkbox.getAttribute('aria-checked')).toBe('true');

    checkbox.click();
    fixture.detectChanges();
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
  });

  it('disables the checkbox for a disabled item and blocks toggling', () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const checkbox = checkboxFor(root, 'Two');

    expect(checkbox.getAttribute('aria-disabled')).toBe('true');
    expect(checkbox.getAttribute('tabindex')).toBe('-1');
    expect(checkbox.getAttribute('aria-checked')).toBe('false');

    checkbox.click();
    fixture.detectChanges();
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
  });

  it('applies the disabled styling only to the disabled item', () => {
    const fixture = createFixture();
    const items = Array.from(
      fixture.nativeElement.querySelectorAll('sanring-transfer-item'),
    ) as HTMLElement[];

    expect(items[0].classList.contains('cursor-not-allowed')).toBe(false);
    expect(items[1].classList.contains('cursor-not-allowed')).toBe(true);
    expect(items[1].classList.contains('opacity-50')).toBe(true);
  });

  it('disables an otherwise-enabled item when its panel becomes non-interactive (one-way target)', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;

    // Three 本身沒有標 disabled，一開始（two-way）checkbox 是可用的
    expect(checkboxFor(root, 'Three').getAttribute('aria-disabled')).toBeNull();

    host.mode.set('one-way');
    fixture.detectChanges();

    const threeCheckbox = checkboxFor(root, 'Three');
    expect(threeCheckbox.getAttribute('aria-disabled')).toBe('true');

    const threeItem = root.querySelectorAll('sanring-transfer-item')[2] as HTMLElement;
    expect(threeItem.classList.contains('cursor-not-allowed')).toBe(true);

    // source 面板不受 one-way 影響，維持可互動
    expect(checkboxFor(root, 'One').getAttribute('aria-disabled')).toBeNull();
  });
});
