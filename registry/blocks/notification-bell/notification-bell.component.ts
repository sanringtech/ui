import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, viewChild } from '@angular/core';
import { LucideBell, LucideCheckCheck, LucideRotateCw } from '@lucide/angular';
import { PopoverComponent, SANRING_POPOVER_IMPORTS } from '../popover';
import { SpinnerComponent } from '../spinner';

/**
 * One notification, already turned into display text by the host app
 * (sanring-notify `text`, or the app's own wording for its own `kind`).
 */
export interface NotificationBellItem {
  id: string;
  text: string;
  createdAt: string | Date;
  read: boolean;
  /** Which system sent it, e.g. "客製方案". Shown in the account center, where notifications come from every system. */
  sourceLabel?: string | null;
}

/** loading → spinner; error → message and retry; ready → the list (or the empty message). */
export type NotificationBellState = 'loading' | 'error' | 'ready';

/** Labels. Defaults are Traditional Chinese; pass translated labels for other languages. */
export interface NotificationBellLabels {
  title: string;
  markAllRead: string;
  empty: string;
  loadFailed: string;
  retry: string;
}

export const NOTIFICATION_BELL_LABELS_ZH_HANT: NotificationBellLabels = {
  title: '通知',
  markAllRead: '全部已讀',
  empty: '目前沒有通知',
  loadFailed: '通知暫時載入不了',
  retry: '重試',
};

export const NOTIFICATION_BELL_LABELS_EN: NotificationBellLabels = {
  title: 'Notifications',
  markAllRead: 'Mark all as read',
  empty: 'No notifications',
  loadFailed: 'Notifications could not be loaded',
  retry: 'Retry',
};

/**
 * Sanring family notification bell (sanring-notify PRD §8, OQ-7): the bell with an unread count, and a panel with
 * the list, mark all as read, and the loading / empty / error states.
 *
 * Presentational only: the host app fetches from its own backend (which proxies sanring-notify), polls the unread
 * count, turns each notification into text, and handles `itemSelected` (mark as read, then go to the link),
 * `markAllRead` and `retry`. `openChange` tells the host when to fetch the list (only while the panel is open).
 * Picking an item closes the panel.
 */
@Component({
  selector: 'sanring-notification-bell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, SANRING_POPOVER_IMPORTS, SpinnerComponent, LucideBell, LucideCheckCheck, LucideRotateCw],
  template: `
    <sanring-popover align="end" (isOpenChange)="openChange.emit($event)">
      <button type="button" sanringPopoverTrigger data-testid="notification-bell"
              class="relative flex size-9 cursor-pointer items-center justify-center rounded-[var(--sanring-radius)] text-[var(--sanring-muted)] hover:bg-[var(--sanring-surface-strong)] hover:text-[var(--sanring-foreground)]"
              [attr.aria-label]="unreadCount() > 0 ? labels().title + ' (' + countLabel() + ')' : labels().title">
        <svg lucideBell class="size-5"></svg>
        @if (unreadCount() > 0) {
          <span class="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-[var(--sanring-coral-50)] px-1 text-center text-[10px] font-semibold leading-4 text-white"
                aria-hidden="true" data-testid="notification-unread">{{ countLabel() }}</span>
        }
      </button>

      <sanring-popover-content side="bottom" class="w-[min(24rem,calc(100vw-2rem))] p-0" [ariaLabel]="labels().title">
        <div class="flex items-center justify-between gap-2 border-b border-[var(--sanring-border)] px-4 py-3">
          <span class="text-sm font-semibold">{{ labels().title }}</span>
          @if (unreadCount() > 0 && state() === 'ready') {
            <button type="button" class="inline-flex cursor-pointer items-center gap-1 text-xs text-[var(--sanring-primary-40)] hover:underline"
                    data-testid="notification-mark-all" (click)="markAllRead.emit()">
              <svg lucideCheckCheck class="size-3.5"></svg>{{ labels().markAllRead }}
            </button>
          }
        </div>

        <div class="max-h-[min(28rem,70vh)] overflow-y-auto">
          @switch (state()) {
            @case ('loading') {
              <div class="flex justify-center py-8"><sanring-spinner size="sm" /></div>
            }
            @case ('error') {
              <div class="flex flex-col items-center gap-3 px-4 py-8 text-center" data-testid="notification-error">
                <p class="text-sm text-[var(--sanring-muted)]">{{ labels().loadFailed }}</p>
                <button type="button" class="inline-flex cursor-pointer items-center gap-1 text-xs text-[var(--sanring-primary-40)] hover:underline"
                        data-testid="notification-retry" (click)="retry.emit()">
                  <svg lucideRotateCw class="size-3.5"></svg>{{ labels().retry }}
                </button>
              </div>
            }
            @default {
              @for (n of items(); track n.id) {
                <button type="button" data-testid="notification-item"
                        class="flex w-full cursor-pointer gap-3 border-b border-[var(--sanring-border)] px-4 py-3 text-left last:border-b-0 hover:bg-[var(--sanring-surface-strong)] data-[unread]:bg-[var(--sanring-active)]"
                        [attr.data-unread]="n.read ? null : ''"
                        (click)="select(n)">
                  <span class="mt-1.5 size-2 shrink-0 rounded-full" [class]="n.read ? 'bg-transparent' : 'bg-[var(--sanring-primary-40)]'" aria-hidden="true"></span>
                  <span class="min-w-0 flex-1">
                    <span class="block text-sm" [class.font-medium]="!n.read">{{ n.text }}</span>
                    <span class="mt-0.5 block text-xs text-[var(--sanring-muted)]">
                      @if (n.sourceLabel) {
                        {{ n.sourceLabel }} ·
                      }
                      {{ n.createdAt | date: dateFormat() }}
                    </span>
                  </span>
                </button>
              } @empty {
                <p class="px-4 py-8 text-center text-sm text-[var(--sanring-muted)]">{{ labels().empty }}</p>
              }
            }
          }
        </div>
      </sanring-popover-content>
    </sanring-popover>
  `,
})
export class NotificationBellComponent {
  readonly items = input<readonly NotificationBellItem[]>([]);
  readonly unreadCount = input(0);
  readonly state = input<NotificationBellState>('ready');
  readonly labels = input<NotificationBellLabels>(NOTIFICATION_BELL_LABELS_ZH_HANT);
  /** Angular DatePipe format for each item's time. */
  readonly dateFormat = input('yyyy-MM-dd HH:mm');

  readonly openChange = output<boolean>();
  readonly itemSelected = output<NotificationBellItem>();
  readonly markAllRead = output<void>();
  readonly retry = output<void>();

  private readonly popover = viewChild.required(PopoverComponent);

  protected countLabel(): string {
    return this.unreadCount() > 99 ? '99+' : String(this.unreadCount());
  }

  protected select(item: NotificationBellItem): void {
    this.popover().setOpen(false);
    this.itemSelected.emit(item);
  }
}
