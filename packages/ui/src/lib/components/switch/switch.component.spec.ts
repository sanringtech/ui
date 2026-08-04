import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SwitchComponent } from './switch.component';

@Component({
  imports: [SwitchComponent],
  template: `
    <sanring-switch (checkedChange)="onCheckedChange($event)" />
    <sanring-switch invalid />
    <sanring-switch ariaLabel="Toggle theme" />
    <sanring-switch disabled />
  `,
})
class SwitchTestHost {
  lastChecked: boolean | null = null;

  onCheckedChange(value: boolean) {
    this.lastChecked = value;
  }
}

describe('SwitchComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchTestHost],
    }).compileComponents();
  });

  function switches(fixture: ReturnType<typeof TestBed.createComponent<SwitchTestHost>>) {
    return (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      'button[role="switch"]',
    );
  }

  it('only exposes aria-invalid when invalid', () => {
    const fixture = TestBed.createComponent(SwitchTestHost);
    fixture.detectChanges();

    const els = switches(fixture);

    expect(els[0].getAttribute('aria-invalid')).toBeNull();
    expect(els[1].getAttribute('aria-invalid')).toBe('true');
  });

  it('toggles aria-checked/data-state on click and emits checkedChange', () => {
    const fixture = TestBed.createComponent(SwitchTestHost);
    const host = fixture.componentInstance;
    fixture.detectChanges();

    const el = switches(fixture)[0];
    expect(el.getAttribute('aria-checked')).toBe('false');

    el.click();
    fixture.detectChanges();

    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(el.getAttribute('data-state')).toBe('checked');
    expect(host.lastChecked).toBe(true);

    el.click();
    fixture.detectChanges();

    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(host.lastChecked).toBe(false);
  });

  it('forwards ariaLabel to the underlying button', () => {
    const fixture = TestBed.createComponent(SwitchTestHost);
    fixture.detectChanges();

    expect(switches(fixture)[2].getAttribute('aria-label')).toBe('Toggle theme');
  });

  it('ignores clicks and does not emit checkedChange while disabled', () => {
    const fixture = TestBed.createComponent(SwitchTestHost);
    const host = fixture.componentInstance;
    fixture.detectChanges();

    const el = switches(fixture)[3];
    expect(el.disabled).toBe(true);

    el.click();
    fixture.detectChanges();

    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(host.lastChecked).toBeNull();
  });
});
