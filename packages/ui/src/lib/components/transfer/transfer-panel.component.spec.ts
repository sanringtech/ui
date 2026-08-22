import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TransferPanelComponent } from './transfer-panel.component';
import { TransferComponent } from './transfer.component';
import { TransferItem, TransferMode } from './transfer.type';

@Component({
  imports: [TransferComponent, TransferPanelComponent],
  template: `
    <sanring-transfer [items]="items()" [selectedKeys]="selectedKeys()" [mode]="mode()">
      <sanring-transfer-panel
        direction="source"
        class="custom-marker"
        [pageSize]="sourcePageSize()"
        #sourcePanel="sanringTransferPanel"
      />
      <sanring-transfer-panel direction="target" />
    </sanring-transfer>
  `,
})
class TransferPanelTestHost {
  readonly items = signal<TransferItem[]>([
    { key: '1', label: 'One' },
    { key: '2', label: 'Two' },
    { key: '3', label: 'Three' },
    { key: '4', label: 'Four' },
    { key: '5', label: 'Five' },
  ]);
  readonly selectedKeys = signal<string[]>(['2']);
  readonly sourcePageSize = signal<number | undefined>(undefined);
  readonly mode = signal<TransferMode>('two-way');
}

describe('TransferPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferPanelTestHost],
    }).compileComponents();
  });

  function createFixture() {
    const fixture = TestBed.createComponent(TransferPanelTestHost);
    fixture.detectChanges();
    return fixture;
  }

  function panelInstances(fixture: ReturnType<typeof createFixture>) {
    return fixture.debugElement
      .queryAll(By.directive(TransferPanelComponent))
      .map((debugEl) => debugEl.componentInstance as TransferPanelComponent);
  }

  it('reflects its direction input as a data-direction host attribute', () => {
    const fixture = createFixture();
    const root = fixture.nativeElement as HTMLElement;
    const [source, target] = Array.from(root.querySelectorAll('sanring-transfer-panel'));

    expect(source.getAttribute('data-direction')).toBe('source');
    expect(target.getAttribute('data-direction')).toBe('target');
  });

  it('merges a custom class input alongside the base panel classes', () => {
    const fixture = createFixture();
    const source = fixture.nativeElement.querySelector('sanring-transfer-panel') as HTMLElement;

    expect(source.classList.contains('custom-marker')).toBe(true);
    expect(source.classList.contains('flex')).toBe(true);
  });

  it('exposes only the items that belong to its own direction', () => {
    const fixture = createFixture();
    const [sourcePanel, targetPanel] = panelInstances(fixture);

    expect(sourcePanel.items().map((item) => item.key)).toEqual(['1', '3', '4', '5']);
    expect(targetPanel.items().map((item) => item.key)).toEqual(['2']);
  });

  it('routes isSelected/toggleSelected to the transfer instance based on direction', () => {
    const fixture = createFixture();
    const [sourcePanel, targetPanel] = panelInstances(fixture);

    expect(sourcePanel.isSelected('1')).toBe(false);

    sourcePanel.toggleSelected('1');
    fixture.detectChanges();

    expect(sourcePanel.isSelected('1')).toBe(true);
    // 切換 source 面板的 key 不該影響 target 面板的勾選狀態
    expect(targetPanel.isSelected('2')).toBe(false);

    targetPanel.toggleSelected('2');
    fixture.detectChanges();

    expect(targetPanel.isSelected('2')).toBe(true);
  });

  it('filters items() by the query passed to setQuery(), scoped to its own direction', () => {
    const fixture = createFixture();
    const [sourcePanel] = panelInstances(fixture);

    sourcePanel.setQuery('o');
    fixture.detectChanges();

    // source 面板是 One/Three/Four/Five，含 "o" 的只有 One 跟 Four
    expect(sourcePanel.items().map((item) => item.key)).toEqual(['1', '4']);

    sourcePanel.setQuery('');
    fixture.detectChanges();

    expect(sourcePanel.items().map((item) => item.key)).toEqual(['1', '3', '4', '5']);
  });

  it('paginates items() when pageSize is set, and clamps to the last page when the list shrinks', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const [sourcePanel] = panelInstances(fixture);

    host.sourcePageSize.set(2);
    fixture.detectChanges();

    // source 面板是 One/Three/Four/Five，pageSize=2 -> 2 頁
    expect(sourcePanel.totalPages()).toBe(2);
    expect(sourcePanel.currentPage()).toBe(0);
    expect(sourcePanel.items().map((item) => item.key)).toEqual(['1', '3']);
    expect(sourcePanel.hasPreviousPage()).toBe(false);
    expect(sourcePanel.hasNextPage()).toBe(true);

    sourcePanel.nextPage();
    fixture.detectChanges();

    expect(sourcePanel.currentPage()).toBe(1);
    expect(sourcePanel.items().map((item) => item.key)).toEqual(['4', '5']);
    expect(sourcePanel.hasNextPage()).toBe(false);

    // 在第 2 頁時套用搜尋，篩選後只剩 One/Four 共 1 頁 -> 頁碼要自動夾回第 1 頁，
    // 而不是卡在一個已經不存在的頁碼上顯示空白
    sourcePanel.setQuery('o');
    fixture.detectChanges();

    expect(sourcePanel.totalPages()).toBe(1);
    expect(sourcePanel.currentPage()).toBe(0);
    expect(sourcePanel.items().map((item) => item.key)).toEqual(['1', '4']);
  });

  it('makes only the target panel non-interactive when mode switches to one-way', () => {
    const fixture = createFixture();
    const host = fixture.componentInstance;
    const [sourcePanel, targetPanel] = panelInstances(fixture);

    expect(sourcePanel.interactive()).toBe(true);
    expect(targetPanel.interactive()).toBe(true);

    host.mode.set('one-way');
    fixture.detectChanges();

    expect(sourcePanel.interactive()).toBe(true);
    expect(targetPanel.interactive()).toBe(false);

    targetPanel.toggleSelected('2');
    fixture.detectChanges();

    expect(targetPanel.isSelected('2')).toBe(false);
  });
});
