// Lives in the docs app (not next to the blocks) because registry/ ships inside the CLI tarball.
// Imports the staged copy (pnpm pretest), laid out the way the CLI installs blocks next to their components.
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ToastService } from '../../../registry-stage/toast';
import { NotificationBellComponent } from '../../../registry-stage/notification-bell';
import {
  AnnouncementBannerComponent,
  type AnnouncementBannerItem,
  type AnnouncementBannerLinkClick,
} from '../../../registry-stage/announcement-banner';

@Component({
  imports: [NotificationBellComponent],
  template: `<sanring-notification-bell [unreadCount]="count()" [toastOnNew]="toastOn()" />`,
})
class BellHost {
  readonly count = signal<number | null>(null);
  readonly toastOn = signal(true);
}

describe('notification-bell new-notification toast', () => {
  let shown: string[];

  function setup(withToast = true) {
    shown = [];
    TestBed.configureTestingModule({
      providers: withToast ? [{ provide: ToastService, useValue: { info: (title: string) => shown.push(title) } }] : [],
    });
    const fixture = TestBed.createComponent(BellHost);
    fixture.detectChanges();
    const set = (n: number | null) => {
      fixture.componentInstance.count.set(n);
      fixture.detectChanges();
    };
    return { fixture, set };
  }

  it('does not toast for the first count, then toasts how many arrived', () => {
    const { set } = setup();
    set(3);
    expect(shown).toEqual([]);
    set(5);
    expect(shown).toEqual(['你有 2 則新通知']);
  });

  it('does not toast when the count goes down, and toasts again when it goes up', () => {
    const { set } = setup();
    set(3);
    set(0);
    set(1);
    expect(shown).toEqual(['你有 1 則新通知']);
  });

  it('can be turned off, and does nothing without a ToastService', () => {
    const { fixture, set } = setup();
    fixture.componentInstance.toastOn.set(false);
    set(1);
    set(2);
    expect(shown).toEqual([]);

    TestBed.resetTestingModule();
    const bare = setup(false);
    bare.set(1);
    expect(() => bare.set(2)).not.toThrow();
  });
});

@Component({
  imports: [AnnouncementBannerComponent],
  template: `<sanring-announcement-banner [items]="items" (linkClicked)="onLink($event)" (dismissed)="gone = $event" />`,
})
class BannerHost {
  items: AnnouncementBannerItem[] = [{ id: 'b1', text: '今晚 22:00 維護', link: 'https://blueprint.sanring.com/maintenance' }];
  gone = '';
  onLink(click: AnnouncementBannerLinkClick) {
    click.event.preventDefault();
    this.clicked = click.item.id;
  }
  clicked = '';
}

describe('announcement-banner', () => {
  it('floats (fixed) so it never changes the app layout, and is dismissible by default', () => {
    const fixture = TestBed.createComponent(BannerHost);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('section')!.className).toContain('fixed');
    (el.querySelector('[data-testid="announcement-dismiss"]') as HTMLButtonElement).click();
    expect(fixture.componentInstance.gone).toBe('b1');
  });

  it('lets the app handle the link (preventDefault stops the full page load)', () => {
    const fixture = TestBed.createComponent(BannerHost);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('[data-testid="announcement-link"]') as HTMLAnchorElement;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(fixture.componentInstance.clicked).toBe('b1');
    expect(event.defaultPrevented).toBe(true);
  });
});
