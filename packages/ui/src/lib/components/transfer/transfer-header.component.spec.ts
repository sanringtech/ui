import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TransferHeaderComponent } from './transfer-header.component';
import { TransferPanelComponent } from './transfer-panel.component';
import { TransferComponent } from './transfer.component';
import { TransferItem } from './transfer.type';

@Component({
  imports: [TransferComponent, TransferPanelComponent, TransferHeaderComponent],
  template: `
    <sanring-transfer [items]="items()" [selectedKeys]="selectedKeys()">
      <sanring-transfer-panel direction="source">
        <sanring-transfer-header [isShow]="true">Available</sanring-transfer-header>
      </sanring-transfer-panel>
      <sanring-transfer-panel direction="target">
        <sanring-transfer-header class="custom-marker">Selected</sanring-transfer-header>
      </sanring-transfer-panel>
    </sanring-transfer>
  `,
})
class TransferHeaderTestHost {
  readonly items = signal<TransferItem[]>([
    { key: '1', label: 'One' },
    { key: '2', label: 'Two' },
    { key: '3', label: 'Three' },
  ]);
  readonly selectedKeys = signal<string[]>(['2']);
}

describe('TransferHeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferHeaderTestHost],
    }).compileComponents();
  });

  it('projects its content', () => {
    const fixture = TestBed.createComponent(TransferHeaderTestHost);
    fixture.detectChanges();

    const headers = fixture.nativeElement.querySelectorAll('sanring-transfer-header');
    expect(headers[1].textContent?.trim()).toBe('Selected');
  });

  it('applies the base layout classes and merges a custom class input', () => {
    const fixture = TestBed.createComponent(TransferHeaderTestHost);
    fixture.detectChanges();

    const headers = fixture.nativeElement.querySelectorAll('sanring-transfer-header') as NodeListOf<HTMLElement>;
    expect(headers[0].classList.contains('border-b')).toBe(true);
    expect(headers[1].classList.contains('border-b')).toBe(true);
    expect(headers[1].classList.contains('custom-marker')).toBe(true);
  });

  it('shows the selected/selectable count badge only when isShow is set', () => {
    const fixture = TestBed.createComponent(TransferHeaderTestHost);
    fixture.detectChanges();

    const headers = fixture.nativeElement.querySelectorAll('sanring-transfer-header') as NodeListOf<HTMLElement>;
    // source panel has 2 selectable items (Two moved to target), 0 currently checked
    expect(headers[0].textContent?.trim()).toBe('Available 0/2');
    // isShow defaults to false on the target header
    expect(headers[1].textContent?.trim()).toBe('Selected');
  });
});
