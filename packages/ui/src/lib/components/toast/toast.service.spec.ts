import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ToastService] });
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    service.dismissAll();
    TestBed.inject(LiveAnnouncer).ngOnDestroy();
  });

  it('shows a toast with sensible defaults', () => {
    const id = service.show({ title: 'Saved' });
    const toast = service.toasts()[0];

    expect(toast.id).toBe(id);
    expect(toast.type).toBe('default');
    expect(toast.closable).toBe(true);
    expect(toast.duration).toBe(5000);
  });

  it('type shorthands set the right toast type', () => {
    service.success('Saved');
    service.error('Failed');
    service.warning('Careful');
    service.info('FYI');

    expect(service.toasts().map((t) => t.type)).toEqual(['success', 'error', 'warning', 'info']);
  });

  it('trims the oldest toasts once past maxVisible', () => {
    for (let i = 0; i < 7; i++) service.show({ title: `Toast ${i}`, duration: 0 });

    expect(service.toasts().map((t) => t.title)).toEqual([
      'Toast 2',
      'Toast 3',
      'Toast 4',
      'Toast 5',
      'Toast 6',
    ]);
  });

  it('marks a toast as leaving immediately, then removes it after the leave animation', async () => {
    const id = service.show({ title: 'Bye', duration: 0 });
    service.dismiss(id);

    expect(service.toasts()[0].leaving).toBe(true);

    await wait(250);

    expect(service.toasts().length).toBe(0);
  });

  it('auto-dismisses after the configured duration', async () => {
    service.show({ title: 'Auto', duration: 50 });
    expect(service.toasts().length).toBe(1);

    await wait(80);
    expect(service.toasts()[0].leaving).toBe(true);

    await wait(250);
    expect(service.toasts().length).toBe(0);
  });

  it('never auto-dismisses a persistent (duration 0) toast', async () => {
    service.show({ title: 'Persistent', duration: 0 });
    await wait(100);

    expect(service.toasts().length).toBe(1);
  });

  it('pauseAll/resumeAll preserves remaining time instead of resetting it', async () => {
    service.show({ title: 'Hover', duration: 120 });

    await wait(50);
    service.pauseAll();
    await wait(150);

    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].leaving).toBeFalsy();

    service.resumeAll();
    await wait(110);

    expect(service.toasts()[0].leaving).toBe(true);
  });

  it('dismissAll clears every toast immediately, without a leave animation', () => {
    service.show({ title: 'A', duration: 0 });
    service.show({ title: 'B', duration: 0 });

    service.dismissAll();

    expect(service.toasts().length).toBe(0);
  });
});
