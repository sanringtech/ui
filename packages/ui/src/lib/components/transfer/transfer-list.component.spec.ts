import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TransferListComponent } from './transfer-list.component';
import { TransferPanelComponent } from './transfer-panel.component';
import { TransferComponent } from './transfer.component';
import { TransferItem } from './transfer.type';

@Component({
  imports: [TransferComponent, TransferPanelComponent, TransferListComponent],
  template: `
    <sanring-transfer [items]="items()" [selectedKeys]="selectedKeys()">
      <sanring-transfer-panel direction="source">
        <sanring-transfer-list />
      </sanring-transfer-panel>
      <sanring-transfer-panel direction="target">
        <sanring-transfer-list />
      </sanring-transfer-panel>
    </sanring-transfer>
  `,
})
class TransferListTestHost {
  readonly items = signal<TransferItem[]>([
    { key: '1', label: 'One' },
    { key: '2', label: 'Two' },
    { key: '3', label: 'Three' },
  ]);
  readonly selectedKeys = signal<string[]>(['2']);
}

describe('TransferListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferListTestHost],
    }).compileComponents();
  });

  function createFixture() {
    const fixture = TestBed.createComponent(TransferListTestHost);
    fixture.detectChanges();
    return fixture;
  }

  function lists(fixture: ReturnType<typeof createFixture>) {
    return Array.from(
      fixture.nativeElement.querySelectorAll('sanring-transfer-list'),
    ) as HTMLElement[];
  }

  function itemLabels(listEl: HTMLElement) {
    return Array.from(listEl.querySelectorAll('sanring-transfer-item')).map((el) =>
      el.textContent?.trim(),
    );
  }

  it('renders one sanring-transfer-item per item belonging to its own panel', () => {
    const fixture = createFixture();
    const [sourceList, targetList] = lists(fixture);

    expect(itemLabels(sourceList)).toEqual(['One', 'Three']);
    expect(itemLabels(targetList)).toEqual(['Two']);
  });

  it('renders nothing when its panel has no items', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;

    host.selectedKeys.set(['1', '2', '3']);
    fixture.detectChanges();

    const [sourceList] = lists(fixture);
    expect(sourceList.querySelectorAll('sanring-transfer-item').length).toBe(0);
  });

  it('re-renders when items() changes', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;

    host.items.set([...host.items(), { key: '4', label: 'Four' }]);
    fixture.detectChanges();

    const [sourceList] = lists(fixture);
    expect(itemLabels(sourceList)).toEqual(['One', 'Three', 'Four']);
  });
});
