import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ComboboxComponent } from './combobox.component';
import { cn } from '../shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-combobox-chip-input',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'wrapperClass()',
    // 🌟 當使用者點擊外框空隙時，自動聚焦到內部的 input
    '(click)': 'onWrapperClick()',
  },
})
export class ComboboxChipInputComponent {
  readonly class = input<string | undefined>();
  /** When false, selected chips stay on one row instead of wrapping. */
  readonly wrap = input(true, { transform: booleanAttribute });

  // 🪄 依賴注入
  protected combobox = inject(ComboboxComponent);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  /** Single-line overflow: collapse the search field so chips + count stay flush. */
  readonly chipsOverflowing = signal(false);

  setChipsOverflowing(next: boolean): void {
    if (this.chipsOverflowing() !== next) this.chipsOverflowing.set(next);
  }

  /**
   * Width available for the chips row. Search field is ignored — it only
   * consumes leftover space when chips already fit next to the count.
   */
  chipLaneWidth(extraReservePx = 0): number {
    const el = this.elementRef.nativeElement;
    const style = getComputedStyle(el);
    const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const gap = parseFloat(style.gap) || 0;
    let reserved = extraReservePx;
    let extras = 0;
    for (const child of el.children) {
      if (child.tagName === 'SANRING-COMBOBOX-CHIPS') continue;
      if (child.tagName === 'SANRING-COMBOBOX-INPUT') continue;
      reserved += (child as HTMLElement).offsetWidth;
      extras += 1;
    }
    return el.clientWidth - paddingX - reserved - gap * extras;
  }

  protected readonly wrapperClass = computed(() =>
    cn(
      // 🌟 排版核心：讓裡面的 Chips 和 Input 能夠在同一行水平排列、自動換行
      'relative flex min-h-10 min-w-0 w-full items-center gap-1 rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)] bg-[var(--sanring-surface)] px-3 py-1 text-sm text-[var(--sanring-foreground)]',
      this.wrap() ? 'flex-wrap' : 'flex-nowrap overflow-hidden',
      // 當大腦被禁用時的樣式
      this.combobox.isDisabled() ? 'cursor-not-allowed opacity-50' : 'cursor-text',
      // 聚焦時的外框亮起效果（模擬真實 input 的 focus-within 狀態）
      'focus-within:ring-1 focus-within:ring-[var(--sanring-border-strong)]',
      this.class(),
    ),
  );

  onWrapperClick() {
    if (this.combobox.isDisabled()) return;

    // 🔍 尋找並聚焦內部的真實 input 元素
    const inputEl = this.elementRef.nativeElement.querySelector('input');
    if (inputEl) {
      inputEl.focus();
    }

    // 同時確保選單展開
    this.combobox.toggleOpen(true);
  }
}
