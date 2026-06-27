import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  LucideCircleCheck,
  LucideCircleX,
  LucideInfo,
  LucideTriangleAlert,
  LucideX,
} from '@lucide/angular';
import { cn } from '../../utils';
import type { Toast, ToastAction, ToastType } from './toast.types';

const TYPE_ICON_CLASS: Partial<Record<ToastType, string>> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-400',
};

@Component({
  selector: 'sanring-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideCircleCheck, LucideCircleX, LucideTriangleAlert, LucideInfo, LucideX],
  host: {
    // SR 播報由 ToastService 的 LiveAnnouncer 統一處理；
    // 這裡不再重複設 aria-live 或 role，避免重複播報。
    // Escape 鍵聚焦時可關閉 toast。
    '(keydown.escape)': 'dismissed.emit()',
  },
  template: `
    <div [class]="cardClass()">
      <!-- Type icon -->
      @switch (toast().type) {
        @case ('success') {
          <svg lucideCircleCheck [class]="iconClass()"></svg>
        }
        @case ('error') {
          <svg lucideCircleX [class]="iconClass()"></svg>
        }
        @case ('warning') {
          <svg lucideTriangleAlert [class]="iconClass()"></svg>
        }
        @case ('info') {
          <svg lucideInfo [class]="iconClass()"></svg>
        }
      }

      <!-- Text content -->
      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
        @if (toast().title) {
          <p class="m-0 text-sm font-semibold leading-snug">{{ toast().title }}</p>
        }
        @if (toast().description) {
          <p class="m-0 text-sm leading-snug text-[var(--sanring-muted)]">
            {{ toast().description }}
          </p>
        }
      </div>

      <!-- Optional action button -->
      @if (toast().action; as action) {
        <button type="button" [class]="actionBtnClass(action.class)" (click)="handleAction(action)">
          {{ action.label }}
        </button>
      }

      <!-- Dismiss button -->
      @if (toast().closable) {
        <button
          type="button"
          class="shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]"
          [attr.aria-label]="dismissLabel()"
          (click)="dismissed.emit()"
        >
          <svg lucideX class="size-4"></svg>
        </button>
      }
    </div>
  `,
})
export class ToastComponent {
  readonly toast = input.required<Toast>();
  /**
   * 進場動畫 class，由 ToasterComponent 根據 position 動態注入。
   * 預設對應 bottom-right（底部滑入）；單獨使用時可自行覆蓋。
   */
  readonly enterClass = input<string>(
    // 從 4 改成 full 或 8，大幅提升滑入的視覺距離
    'animate-in slide-in-from-bottom-full fade-in-0 duration-300 ease-out',
  );
  /** 關閉按鈕 aria-label，由 ToasterComponent 從 TOAST_CONFIG 注入以支援 i18n */
  readonly dismissLabel = input<string>('Dismiss notification');

  readonly dismissed = output<void>();

  protected readonly cardClass = computed(() =>
    cn(
      'pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg',
      'bg-[var(--sanring-elevated)] border-[var(--sanring-border)] text-[var(--sanring-foreground)]',
      this.enterClass(),
      this.toast().class,
    ),
  );

  protected readonly iconClass = computed(() =>
    cn('mt-0.5 size-5 shrink-0', TYPE_ICON_CLASS[this.toast().type] ?? ''),
  );

  protected actionBtnClass(extra?: string) {
    return cn(
      'ml-auto shrink-0 rounded-md border border-[var(--sanring-border)] px-3 py-1.5',
      'text-xs font-medium transition-colors hover:bg-[var(--sanring-surface-strong)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      extra,
    );
  }

  protected handleAction(action: ToastAction): void {
    const result = action.onClick();
    if (action.dismissOnAction !== false) {
      // async action：等 promise settle 再 dismiss；sync action：立即 dismiss
      if (result instanceof Promise) {
        result.finally(() => this.dismissed.emit());
      } else {
        this.dismissed.emit();
      }
    }
  }
}
