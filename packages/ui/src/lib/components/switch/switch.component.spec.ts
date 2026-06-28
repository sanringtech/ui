import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SwitchComponent } from './switch.component';

@Component({
  imports: [SwitchComponent],
  template: `
    <sanring-switch />
    <sanring-switch invalid />
  `,
})
class SwitchTestHost {}

describe('SwitchComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchTestHost],
    }).compileComponents();
  });

  it('only exposes aria-invalid when invalid', () => {
    const fixture = TestBed.createComponent(SwitchTestHost);
    fixture.detectChanges();

    const switches = fixture.nativeElement.querySelectorAll('button[role="switch"]');

    expect(switches[0].getAttribute('aria-invalid')).toBeNull();
    expect(switches[1].getAttribute('aria-invalid')).toBe('true');
  });
});
