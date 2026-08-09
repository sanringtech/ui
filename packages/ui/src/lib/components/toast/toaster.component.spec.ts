import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { ToastService } from './toast.service';
import { ToasterComponent } from './toaster.component';

@Component({
  imports: [ToasterComponent],
  template: `<sanring-toaster />`,
})
class ToasterTestHost {}

describe('ToasterComponent', () => {
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToasterTestHost],
      providers: [ToastService],
    }).compileComponents();

    toastService = TestBed.inject(ToastService);
  });

  afterEach(() => {
    toastService.dismissAll();
    TestBed.inject(LiveAnnouncer).ngOnDestroy();
  });

  function createFixture() {
    const fixture = TestBed.createComponent(ToasterTestHost);
    fixture.detectChanges();
    return fixture;
  }

  it('renders a toast pushed through the service with title, description, and dismiss button', () => {
    toastService.show({
      type: 'success',
      title: 'Saved',
      description: 'Your changes were saved.',
      duration: 0,
    });

    const fixture = createFixture();
    const toast = fixture.nativeElement.querySelector('sanring-toast') as HTMLElement;

    expect(toast.textContent).toContain('Saved');
    expect(toast.textContent).toContain('Your changes were saved.');
    expect(toast.querySelector('button[aria-label="Dismiss notification"]')).toBeTruthy();
  });

  it('has no axe-detectable a11y violations', async () => {
    toastService.show({
      type: 'success',
      title: 'Saved',
      description: 'Your changes were saved.',
      duration: 0,
      action: { label: 'Undo', onClick: () => {} },
    });

    const fixture = createFixture();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
