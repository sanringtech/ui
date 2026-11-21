import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal, untracked, viewChild } from '@angular/core';
import { LucideBell, LucideCheckCheck, LucideRotateCw } from '@lucide/angular';
import { PopoverComponent, SANRING_POPOVER_IMPORTS } from '../popover';
import { SpinnerComponent } from '../spinner';
import { ToastService } from '../toast';

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
  /** Toast when the unread count goes up. `{count}` is replaced with how many arrived. */
  newNotifications: string;
  /** Toast button that opens the panel. */
  view: string;
}

export const NOTIFICATION_BELL_LABELS_ZH_HANT: NotificationBellLabels = {
  title: '通知',
  markAllRead: '全部已讀',
  empty: '目前沒有通知',
  loadFailed: '通知暫時載入不了',
  retry: '重試',
  newNotifications: '你有 {count} 則新通知',
  view: '查看',
};

export const NOTIFICATION_BELL_LABELS_EN: NotificationBellLabels = {
  title: 'Notifications',
  markAllRead: 'Mark all as read',
  empty: 'No notifications',
  loadFailed: 'Notifications could not be loaded',
  retry: 'Retry',
  newNotifications: 'You have {count} new notification(s)',
  view: 'View',
};

/**
 * Sanring family notification bell (sanring-notify PRD §8, OQ-7): the bell with an unread count, and a panel with
 * the list, mark all as read, and the loading / empty / error states.
 *
 * Presentational only: the host app fetches from its own backend (which proxies sanring-notify), polls the unread
 * count, turns each notification into text, and handles `itemSelected` (mark as read, then go to the link),
 * `markAllRead` and `retry`. `openChange` tells the host when to fetch the list (only while the panel is open).
 * Picking an item closes the panel.
 *
 * New-notification toast: when `unreadCount` goes up between two polls (not on the first value; pass `null` until the
 * first poll returns, not 0, or the first count toasts), the bell shows a
 * toast with a "View" button that opens the panel. Nothing to wire up: it uses the app's `ToastService` if the app
 * provides one (and renders `<sanring-toaster>`), and does nothing otherwise. Turn it off with `[toastOnNew]="false"`.
 */
@Component({
  selector: 'sanring-notification-bell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, SANRING_POPOVER_IMPORTS, SpinnerComponent, LucideBell, LucideCheckCheck, LucideRotateCw],
  template: `
    <sanring-popover align="end" (isOpenChange)="onOpenChange($event)">
      <button type="button" sanringPopoverTrigger data-testid="notification-bell"
              class="relative flex size-9 cursor-pointer items-center justify-center rounded-[var(--sanring-radius)] text-[var(--sanring-muted)] hover:bg-[var(--sanring-surface-strong)] hover:text-[var(--sanring-foreground)]"
              [attr.aria-label]="count() > 0 ? labels().title + ' (' + countLabel() + ')' : labels().title">
        <svg lucideBell class="size-5"></svg>
        @if (count() > 0) {
          <span class="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-[var(--sanring-coral-50)] px-1 text-center text-[10px] font-semibold leading-4 text-white"
                aria-hidden="true" data-testid="notification-unread">{{ countLabel() }}</span>
        }
      </button>

      <sanring-popover-content side="bottom" class="w-[min(24rem,calc(100vw-2rem))] p-0" [ariaLabel]="labels().title">
        <div class="flex items-center justify-between gap-2 border-b border-[var(--sanring-border)] px-4 py-3">
          <span class="text-sm font-semibold">{{ labels().title }}</span>
          @if (count() > 0 && state() === 'ready') {
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
  /** Unread count from the last poll; `null` until the first poll comes back (so the first value never toasts). */
  readonly unreadCount = input<number | null>(null);
  readonly state = input<NotificationBellState>('ready');
  readonly labels = input<NotificationBellLabels>(NOTIFICATION_BELL_LABELS_ZH_HANT);
  /** Angular DatePipe format for each item's time. */
  readonly dateFormat = input('yyyy-MM-dd HH:mm');
  /** Show a toast when the unread count goes up (needs the app's ToastService). */
  readonly toastOnNew = input(true);

  readonly openChange = output<boolean>();
  readonly itemSelected = output<NotificationBellItem>();
  readonly markAllRead = output<void>();
  readonly retry = output<void>();

  private readonly popover = viewChild.required(PopoverComponent);
  private readonly toast = inject(ToastService, { optional: true });
  private readonly open = signal(false);
  private lastCount: number | undefined;

  constructor() {
    effect(() => {
      const count = this.unreadCount();
      if (count === null) return;
      const previous = this.lastCount;
      this.lastCount = count;
      if (previous === undefined || count <= previous) return;
      untracked(() => this.announceNew(count - previous));
    });
  }

  private announceNew(added: number): void {
    if (!this.toast || !this.toastOnNew() || this.open()) return;
    const labels = this.labels();
    this.toast.info(labels.newNotifications.replace('{count}', String(added)), {
      action: { label: labels.view, onClick: () => this.popover().setOpen(true) },
    });
  }

  protected onOpenChange(open: boolean): void {
    this.open.set(open);
    this.openChange.emit(open);
  }

  protected count(): number {
    return this.unreadCount() ?? 0;
  }

  protected countLabel(): string {
    return this.count() > 99 ? '99+' : String(this.count());
  }

  protected select(item: NotificationBellItem): void {
    this.popover().setOpen(false);
    this.itemSelected.emit(item);
  }
}
