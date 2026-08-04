import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AlertDescriptionDirective } from './alert-description.directive';
import { AlertTitleDirective } from './alert-title.directive';
import { AlertComponent } from './alert.component';

@Component({
  imports: [AlertComponent, AlertTitleDirective, AlertDescriptionDirective],
  template: `
    <sanring-alert variant="destructive" class="custom-alert">
      <h2 sanringAlertTitle class="custom-title">Unable to save</h2>
      <p sanringAlertDescription class="custom-description">Try again later.</p>
    </sanring-alert>
  `,
})
class AlertTestHost {}

describe('AlertComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertTestHost],
    }).compileComponents();
  });

  it('renders alert content with role="alert"', () => {
    const fixture = TestBed.createComponent(AlertTestHost);
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('sanring-alert') as HTMLElement;

    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.textContent).toContain('Unable to save');
    expect(alert.textContent).toContain('Try again later.');
  });

  it('merges host, title, and description classes', () => {
    const fixture = TestBed.createComponent(AlertTestHost);
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('sanring-alert') as HTMLElement;
    const title = fixture.nativeElement.querySelector('[sanringAlertTitle]') as HTMLElement;
    const description = fixture.nativeElement.querySelector('[sanringAlertDescription]') as HTMLElement;

    expect(alert.className).toContain('custom-alert');
    expect(alert.className).toContain('border');
    expect(title.className).toContain('custom-title');
    expect(description.className).toContain('custom-description');
  });
});
