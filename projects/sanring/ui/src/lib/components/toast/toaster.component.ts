import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { TOAST_CONFIG } from './toast.config';
import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';
import type { ToastPosition } from './toast.types';

const POSITION_CLASSES: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

// top-* 從畫面上方滑入、bottom-* 從底部滑入
// ease-out 讓末段減速，視覺上最平滑自然
// slide-in-from-{direction}-4 = 16px 位移，存在感明顯但不過度
const ENTER_CLASS: Record<ToastPosition, string> = {
  'top-right': 'animate-in slide-in-from-top-4 fade-in-0 duration-300 ease-out',
  'top-left': 'animate-in slide-in-from-top-4 fade-in-0 duration-300 ease-out',
  'top-center': 'animate-in slide-in-from-top-4 fade-in-0 duration-300 ease-out',
  'bottom-right': 'animate-in slide-in-from-bottom-4 fade-in-0 duration-300 ease-out',
  'bottom-left': 'animate-in slide-in-from-bottom-4 fade-in-0 duration-300 ease-out',
  'bottom-center': 'animate-in slide-in-from-bottom-4 fade-in-0 duration-300 ease-out',
};

const DEFAULT_TOAST_HEIGHT = 72;
const PEEK_PX = 12;

@Component({
  selector: 'sanring-toaster',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastComponent],
  // SR 播報由 ToastService 的 LiveAnnouncer 統一處理，不在 DOM 設 aria-live，
  // 避免 LiveAnnouncer + DOM live region 雙重播報。
  template: `
    @if (stacked()) {
      <div
        [class]="stackWrapperClass()"
        [style.height.px]="stackHeight()"
        (mouseenter)="toastSvc.pauseAll()"
        (mouseleave)="toastSvc.resumeAll()"
      >
        @for (toast of stackedToasts(); track toast.id; let i = $index) {
          <div
            class="absolute inset-x-0 transition-all duration-300 ease-out"
            [style.z-index]="maxToasts() - i"
            [style.bottom.px]="isBottom() ? i * peekPx : undefined"
            [style.top.px]="isBottom() ? undefined : i * peekPx"
            [style.transform]="stackScale(i)"
            [style.opacity]="stackOpacity(i)"
          >
            <sanring-toast
              [toast]="toast"
              [enterClass]="getEnterAnimation()"
              [dismissLabel]="dismissLabel()"
              (dismissed)="toastSvc.dismiss(toast.id)"
            />
          </div>
        }
      </div>
    } @else {
      <div
        [class]="listWrapperClass()"
        (mouseenter)="toastSvc.pauseAll()"
        (mouseleave)="toastSvc.resumeAll()"
      >
        @for (toast of listToasts(); track toast.id) {
          <sanring-toast
            [toast]="toast"
            [enterClass]="getEnterAnimation()"
            (dismissed)="toastSvc.dismiss(toast.id)"
          />
        }
      </div>
    }
  `,
})
export class ToasterComponent {
  readonly position = input<ToastPosition>('bottom-right');
  readonly maxToasts = input<number>(3);
  readonly stacked = input<boolean>(true);
  readonly toastHeight = input<number>(DEFAULT_TOAST_HEIGHT);

  protected readonly peekPx = PEEK_PX;
  protected readonly toastSvc = inject(ToastService);
  private readonly toastConfig = inject(TOAST_CONFIG);
  /** 從 TOAST_CONFIG 取得關閉按鈕 aria-label，統一支援 i18n 覆蓋 */
  protected readonly dismissLabel = computed(() => this.toastConfig.dismissLabel);

  protected readonly isBottom = computed(() => this.position().startsWith('bottom'));
  protected readonly enterClass = computed(() => ENTER_CLASS[this.position()]);

  protected readonly stackedToasts = computed(() =>
    [...this.toastSvc.toasts()].slice(-this.maxToasts()).reverse(),
  );

  protected readonly listToasts = computed(() => {
    const all = this.toastSvc.toasts();
    return this.isBottom() ? all : [...all].reverse();
  });

  protected readonly stackHeight = computed(
    () => this.toastHeight() + (this.stackedToasts().length - 1) * PEEK_PX,
  );

  private readonly positionClass = computed(() => POSITION_CLASSES[this.position()]);

  protected readonly stackWrapperClass = computed(() =>
    cn('fixed z-50 w-full max-w-sm pointer-events-none', this.positionClass()),
  );

  protected readonly listWrapperClass = computed(() =>
    cn(
      'fixed z-50 flex w-full max-w-sm gap-2 p-4 pointer-events-none',
      this.isBottom() ? 'flex-col' : 'flex-col-reverse',
      this.positionClass(),
    ),
  );

  protected stackScale(i: number): string {
    return i === 0 ? 'none' : `scale(${(1 - i * 0.04).toFixed(3)})`;
  }

  protected stackOpacity(i: number): number {
    return i === 0 ? 1 : Math.max(0.4, 1 - i * 0.2);
  }

  // 在 ToasterComponent 中加入這個 computed
  protected readonly getEnterAnimation = computed(() => {
    const pos = this.position(); // 例如 'top-right' 或 'bottom-left'

    // 共用的平滑進場基底設定
    const baseAnimation = 'animate-in fade-in-0 duration-300 ease-out';

    if (pos.startsWith('top')) {
      // Top 系列：從上方自身高度 100% 的位置滑入 (需要 tailwindcss-animate 支援)
      // 或者使用自訂距離 slide-in-from-top-8 (32px)
      return `${baseAnimation} slide-in-from-top-full`;
    } else {
      // Bottom 系列：從下方自身高度 100% 的位置滑入
      return `${baseAnimation} slide-in-from-bottom-full`;
    }
  });
}
