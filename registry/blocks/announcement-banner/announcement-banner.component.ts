import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucideExternalLink, LucideMegaphone, LucideX } from '@lucide/angular';

/** One active banner, text already picked for the current language by the host app. */
export interface AnnouncementBannerItem {
  id: string;
  text: string;
  link?: string | null;
}

/** Labels. Defaults are Traditional Chinese; pass translated labels for other languages. */
export interface AnnouncementBannerLabels {
  region: string;
  details: string;
  dismiss: string;
}

export const ANNOUNCEMENT_BANNER_LABELS_ZH_HANT: AnnouncementBannerLabels = {
  region: '系統公告',
  details: '查看詳情',
  dismiss: '關閉公告',
};

export const ANNOUNCEMENT_BANNER_LABELS_EN: AnnouncementBannerLabels = {
  region: 'Announcements',
  details: 'Details',
  dismiss: 'Dismiss announcement',
};

/** Which corner the cards float in. Default bottom-left, so they do not sit on top of toasts (usually bottom-right). */
export type AnnouncementBannerPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

/** Emitted when the "Details" link is clicked. Call `event.preventDefault()` to navigate with the app's router instead. */
export interface AnnouncementBannerLinkClick {
  item: AnnouncementBannerItem;
  event: MouseEvent;
}

const POSITION_CLASSES: Record<AnnouncementBannerPosition, string> = {
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
};

/**
 * Sanring family announcement (sanring-notify ADR-0002 §5): small cards floating in a corner of the screen, one per
 * active banner from sanring-notify `GET /api/v1/banners/active` (e.g. "maintenance tonight 22:00–23:00").
 * The cards are `position: fixed`, so they never change the app's own layout; put the component anywhere (for example
 * once in the app shell). Renders nothing when there are no items.
 *
 * Presentational only: the host app polls its own backend, picks the text for the current language, and decides
 * what `dismissed` means (e.g. hide that id for this browser session). Because the cards cover a little of the page,
 * they can be dismissed by default; banners also end by themselves at their end time.
 *
 * The "Details" link is a normal `<a href>` (open in new tab still works). For a link inside the same app, handle
 * `linkClicked`, call `event.preventDefault()` and navigate with the router to avoid a full page reload.
 */
@Component({
  selector: 'sanring-announcement-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideExternalLink, LucideMegaphone, LucideX],
  template: `
    @if (items().length > 0) {
      <section [attr.aria-label]="labels().region" [class]="containerClass()">
        @for (b of items(); track b.id) {
          <div role="status" data-testid="announcement-banner"
               class="pointer-events-auto flex items-start gap-3 rounded-[var(--sanring-radius)] border border-l-4 border-[var(--sanring-border)] border-l-[var(--sanring-info-50)] bg-[var(--sanring-surface)] p-3 text-sm text-[var(--sanring-foreground)] shadow-lg">
            <svg lucideMegaphone class="mt-0.5 size-4 shrink-0 text-[var(--sanring-info-50)]" aria-hidden="true"></svg>
            <p class="min-w-0 flex-1">
              {{ b.text }}
              @if (b.link) {
                <a [href]="b.link" class="mt-1 flex w-fit items-center gap-1 font-medium underline underline-offset-2 hover:no-underline"
                   data-testid="announcement-link" (click)="linkClicked.emit({ item: b, event: $event })">{{ labels().details }}<svg lucideExternalLink class="size-3.5" aria-hidden="true"></svg></a>
              }
            </p>
            @if (dismissible()) {
              <button type="button" class="-m-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[var(--sanring-radius)] text-[var(--sanring-muted)] hover:bg-[var(--sanring-surface-strong)] hover:text-[var(--sanring-foreground)]"
                      [attr.aria-label]="labels().dismiss" data-testid="announcement-dismiss" (click)="dismissed.emit(b.id)">
                <svg lucideX class="size-4"></svg>
              </button>
            }
          </div>
        }
      </section>
    }
  `,
})
export class AnnouncementBannerComponent {
  readonly items = input<readonly AnnouncementBannerItem[]>([]);
  readonly dismissible = input(true);
  readonly position = input<AnnouncementBannerPosition>('bottom-left');
  readonly labels = input<AnnouncementBannerLabels>(ANNOUNCEMENT_BANNER_LABELS_ZH_HANT);

  readonly dismissed = output<string>();
  readonly linkClicked = output<AnnouncementBannerLinkClick>();

  protected readonly containerClass = computed(
    () => `pointer-events-none fixed z-40 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 ${POSITION_CLASSES[this.position()]}`,
  );
}
