import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TransferActionDirective } from './transfer-action.directive';
import { TransferHeaderComponent } from './transfer-header.component';
import { TransferListComponent } from './transfer-list.component';
import { TransferPanelComponent } from './transfer-panel.component';
import { TransferComponent } from './transfer.component';
import { TransferItem, TransferMode } from './transfer.type';

@Component({
  imports: [
    TransferComponent,
    TransferPanelComponent,
    TransferHeaderComponent,
    TransferListComponent,
    TransferActionDirective,
  ],
  template: `
    <sanring-transfer
      [items]="items()"
      [selectedKeys]="selectedKeys()"
      (selectedKeysChange)="selectedKeys.set($event)"
      [mode]="mode()"
      #transfer
    >
      <sanring-transfer-panel direction="source">
        <sanring-transfer-header>Available</sanring-transfer-header>
        <sanring-transfer-list />
      </sanring-transfer-panel>

      <div sanringTransferAction>
        <button type="button" (click)="transfer.moveToTarget()">to-target</button>
        <button type="button" (click)="transfer.moveToSource()">to-source</button>
      </div>

      <sanring-transfer-panel direction="target">
        <sanring-transfer-header>Selected</sanring-transfer-header>
        <sanring-transfer-list />
      </sanring-transfer-panel>
    </sanring-transfer>
  `,
})
class TransferTestHost {
  readonly items = signal<TransferItem[]>([
    { key: '1', label: 'One' },
    { key: '2', label: 'Two' },
    { key: '3', label: 'Three', disabled: true },
  ]);
  readonly selectedKeys = signal<string[]>(['2']);
  readonly mode = signal<TransferMode>('two-way');
}

describe('TransferComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferTestHost],
    }).compileComponents();
  });

  async function createFixture() {
    const fixture = TestBed.createComponent(TransferTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  function panel(root: HTMLElement, direction: 'source' | 'target') {
    const el = root.querySelector<HTMLElement>(`[data-direction="${direction}"]`);
    if (!el) throw new Error(`Expected a panel with data-direction="${direction}"`);
    return el;
  }

  function checkboxFor(panelEl: HTMLElement, label: string) {
    const checkbox = panelEl.querySelector<HTMLElement>(`[role="checkbox"][aria-label="${label}"]`);
    if (!checkbox) throw new Error(`Expected a checkbox labelled "${label}" inside panel`);
    return checkbox;
  }

  function actionButton(root: HTMLElement, text: string) {
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('button'));
    const button = buttons.find((b) => b.textContent?.trim() === text);
    if (!button) throw new Error(`Expected an action button with text "${text}"`);
    return button;
  }

  it('splits items into source/target panels based on selectedKeys', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;

    const source = panel(root, 'source');
    const target = panel(root, 'target');

    expect(checkboxFor(source, 'One')).toBeTruthy();
    expect(checkboxFor(source, 'Three')).toBeTruthy();
    expect(source.querySelector('[aria-label="Two"]')).toBeNull();

    expect(checkboxFor(target, 'Two')).toBeTruthy();
    expect(target.querySelector('[aria-label="One"]')).toBeNull();
  });

  it('moves checked source items into the target panel and updates selectedKeys', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const host = fixture.componentInstance;

    checkboxFor(panel(root, 'source'), 'One').click();
    fixture.detectChanges();

    actionButton(root, 'to-target').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.selectedKeys()).toEqual(['2', '1']);
    expect(checkboxFor(panel(root, 'target'), 'One')).toBeTruthy();
    expect(panel(root, 'source').querySelector('[aria-label="One"]')).toBeNull();
  });

  it('moves checked target items back to the source panel', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const host = fixture.componentInstance;

    checkboxFor(panel(root, 'target'), 'Two').click();
    fixture.detectChanges();

    actionButton(root, 'to-source').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.selectedKeys()).toEqual([]);
    expect(checkboxFor(panel(root, 'source'), 'Two')).toBeTruthy();
    expect(panel(root, 'target').querySelector('[aria-label="Two"]')).toBeNull();
  });

  it('does not let a disabled item be checked or moved', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const host = fixture.componentInstance;

    const disabledCheckbox = checkboxFor(panel(root, 'source'), 'Three');
    expect(disabledCheckbox.getAttribute('aria-checked')).toBe('false');

    disabledCheckbox.click();
    fixture.detectChanges();

    actionButton(root, 'to-target').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(disabledCheckbox.getAttribute('aria-checked')).toBe('false');
    expect(host.selectedKeys()).toEqual(['2']);
    expect(panel(root, 'source').querySelector('[aria-label="Three"]')).toBeTruthy();
  });

  it('in one-way mode, makes the target panel read-only and moveToSource a no-op', async () => {
    const fixture = await createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const host = fixture.componentInstance;

    host.mode.set('one-way');
    fixture.detectChanges();

    const targetCheckbox = checkboxFor(panel(root, 'target'), 'Two') as HTMLButtonElement;
    expect(targetCheckbox.disabled).toBe(true);

    targetCheckbox.click();
    fixture.detectChanges();
    expect(targetCheckbox.getAttribute('aria-checked')).toBe('false');

    actionButton(root, 'to-source').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // 沒被搬回去：Two 應該還在 target 面板
    expect(host.selectedKeys()).toEqual(['2']);
    expect(checkboxFor(panel(root, 'target'), 'Two')).toBeTruthy();

    // source -> target 仍然正常運作
    checkboxFor(panel(root, 'source'), 'One').click();
    fixture.detectChanges();
    actionButton(root, 'to-target').click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.selectedKeys()).toEqual(['2', '1']);
  });
});
