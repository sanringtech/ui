import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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

/**
 * Sanring family announcement banner (sanring-notify ADR-0002 §5): full-width bars above the app shell, one per
 * active banner from sanring-notify `GET /api/v1/banners/active` (e.g. "maintenance tonight 22:00–23:00").
 * Renders nothing when there are no items.
 *
 * Presentational only: the host app polls its own backend, picks the text for the current language, and decides
 * what `dismissed` means (e.g. hide that id for this browser session). Without `dismissible` there is no close button;
 * banners end by themselves at their end time.
 */
@Component({
  selector: 'sanring-announcement-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideExternalLink, LucideMegaphone, LucideX],
  host: { class: 'block w-full' },
  template: `
    @if (items().length > 0) {
      <section [attr.aria-label]="labels().region" class="flex flex-col">
        @for (b of items(); track b.id) {
          <div role="status" data-testid="announcement-banner"
               class="flex w-full items-center gap-3 border-b border-[var(--sanring-info-80)] bg-[var(--sanring-info-90)] px-4 py-2 text-sm text-[var(--sanring-info-20)]">
            <svg lucideMegaphone class="size-4 shrink-0" aria-hidden="true"></svg>
            <p class="min-w-0 flex-1">
              {{ b.text }}
              @if (b.link) {
                <a [href]="b.link" class="ml-2 inline-flex items-center gap-1 font-medium underline underline-offset-2 hover:no-underline"
                   data-testid="announcement-link">{{ labels().details }}<svg lucideExternalLink class="size-3.5" aria-hidden="true"></svg></a>
              }
            </p>
            @if (dismissible()) {
              <button type="button" class="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[var(--sanring-radius)] hover:bg-[var(--sanring-info-80)]"
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
  readonly dismissible = input(false);
  readonly labels = input<AnnouncementBannerLabels>(ANNOUNCEMENT_BANNER_LABELS_ZH_HANT);

  readonly dismissed = output<string>();
}
