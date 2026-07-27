import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TransferActionDirective } from './transfer-action.directive';

@Component({
  imports: [TransferActionDirective],
  template: `
    <div sanringTransferAction>
      <button type="button">to-target</button>
    </div>
    <div sanringTransferAction class="custom-marker">
      <button type="button">to-source</button>
    </div>
  `,
})
class TransferActionTestHost {}

describe('TransferActionDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferActionTestHost],
    }).compileComponents();
  });

  it('applies the base layout classes to the host element', () => {
    const fixture = TestBed.createComponent(TransferActionTestHost);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('div') as HTMLElement;
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('flex-col')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
  });

  it('merges a custom class input alongside the base classes', () => {
    const fixture = TestBed.createComponent(TransferActionTestHost);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelectorAll('div')[1] as HTMLElement;
    expect(el.classList.contains('custom-marker')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
  });
});
