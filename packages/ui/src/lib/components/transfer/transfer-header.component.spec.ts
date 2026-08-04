import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TransferHeaderComponent } from './transfer-header.component';
import { TransferPanelComponent } from './transfer-panel.component';
import { TransferComponent } from './transfer.component';

@Component({
  imports: [TransferComponent, TransferPanelComponent, TransferHeaderComponent],
  template: `
    <sanring-transfer>
      <sanring-transfer-panel direction="source">
        <sanring-transfer-header>Available</sanring-transfer-header>
      </sanring-transfer-panel>
      <sanring-transfer-panel direction="target">
        <sanring-transfer-header class="custom-marker">Selected</sanring-transfer-header>
      </sanring-transfer-panel>
    </sanring-transfer>
  `,
})
class TransferHeaderTestHost {}

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
    expect(headers[0].textContent?.trim()).toBe('Available');
  });

  it('applies the base layout classes and merges a custom class input', () => {
    const fixture = TestBed.createComponent(TransferHeaderTestHost);
    fixture.detectChanges();

    const headers = fixture.nativeElement.querySelectorAll('sanring-transfer-header') as NodeListOf<HTMLElement>;
    expect(headers[0].classList.contains('border-b')).toBe(true);
    expect(headers[1].classList.contains('border-b')).toBe(true);
    expect(headers[1].classList.contains('custom-marker')).toBe(true);
  });
});
