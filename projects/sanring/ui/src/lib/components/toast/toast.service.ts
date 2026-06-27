import { Injectable, inject, signal } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TOAST_CONFIG } from './toast.config';
import type { Toast, ToastOptions } from './toast.types';

let _nextId = 0;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly announcer  = inject(LiveAnnouncer);
  private readonly config     = inject(TOAST_CONFIG);
  private readonly _toasts    = signal<Toast[]>([]);

  // Auto-dismiss timer tracking (three maps for pause/resume support):
  private readonly _timers    = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly _startedAt = new Map<string, number>();
  private readonly _remaining = new Map<string, number>();
  // Leaving-animation timers: keyed by id, fires after 200ms to actually remove the DOM
  private readonly _leavingTimers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly toasts = this._toasts.asReadonly();

  show(options: ToastOptions): string {
    const id = `sanring-toast-${++_nextId}`;
    const toast: Toast = {
      type: 'default',
      duration: this.config.defaultDuration,
      closable: true,
      ...options,
      id,
    };

    this._toasts.update(prev => {
      const next = [...prev, toast];
      if (next.length > this.config.maxVisible) {
        next.slice(0, next.length - this.config.maxVisible)
            .forEach(t => this._clearTimer(t.id));
        return next.slice(next.length - this.config.maxVisible);
      }
      return next;
    });

    // LiveAnnouncer 是唯一的 SR 播報層，DOM 不再設 aria-live
    const label = [toast.title, toast.description].filter(Boolean).join(' — ');
    if (label) {
      this.announcer.announce(label, toast.type === 'error' ? 'assertive' : 'polite');
    }

    if (toast.duration > 0) this._startTimer(id, toast.duration);

    return id;
  }

  success(title: string, options?: Omit<ToastOptions, 'type' | 'title'>): string {
    return this.show({ ...options, title, type: 'success' });
  }

  error(title: string, options?: Omit<ToastOptions, 'type' | 'title'>): string {
    return this.show({ ...options, title, type: 'error' });
  }

  warning(title: string, options?: Omit<ToastOptions, 'type' | 'title'>): string {
    return this.show({ ...options, title, type: 'warning' });
  }

  info(title: string, options?: Omit<ToastOptions, 'type' | 'title'>): string {
    return this.show({ ...options, title, type: 'info' });
  }

  dismiss(id: string): void {
    this._clearTimer(id);
    // 1. 標記 leaving → 觸發退場 CSS 動畫（animate-toast-leave）
    this._toasts.update(prev =>
      prev.map(t => t.id === id ? { ...t, leaving: true } : t),
    );
    // 2. 動畫播完（200ms）後才真正移除 DOM
    const handle = setTimeout(() => {
      this._toasts.update(prev => prev.filter(t => t.id !== id));
      this._leavingTimers.delete(id);
    }, 200);
    this._leavingTimers.set(id, handle);
  }

  dismissAll(): void {
    // 取消所有進行中的退場動畫計時器
    this._leavingTimers.forEach(handle => clearTimeout(handle));
    this._leavingTimers.clear();
    // 合併 _timers 與 _remaining 的 id，確保 paused 狀態下也能全部清除
    const allIds = new Set([...this._timers.keys(), ...this._remaining.keys()]);
    allIds.forEach(id => this._clearTimer(id));
    this._toasts.set([]);
  }

  /** Hover 開始時呼叫：暫停所有 timer，記錄剩餘時間 */
  pauseAll(): void {
    const now = Date.now();
    this._timers.forEach((handle, id) => {
      clearTimeout(handle);
      const startedAt = this._startedAt.get(id) ?? now;
      const remaining = this._remaining.get(id) ?? 0;
      this._remaining.set(id, Math.max(0, remaining - (now - startedAt)));
    });
    this._timers.clear();
    this._startedAt.clear();
  }

  /** Hover 結束時呼叫：用剩餘時間重啟 timer */
  resumeAll(): void {
    this._remaining.forEach((remaining, id) => {
      if (remaining > 0) this._startTimer(id, remaining);
    });
  }

  private _startTimer(id: string, duration: number): void {
    const handle = setTimeout(() => this.dismiss(id), duration);
    this._timers.set(id, handle);
    this._startedAt.set(id, Date.now());
    this._remaining.set(id, duration);
  }

  private _clearTimer(id: string): void {
    const handle = this._timers.get(id);
    if (handle !== undefined) clearTimeout(handle);
    this._timers.delete(id);
    this._startedAt.delete(id);
    this._remaining.delete(id);
  }
}
