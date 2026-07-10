import { Component, booleanAttribute, computed, ElementRef, inject, input } from '@angular/core';
import { LucideX } from '@lucide/angular';
import { ComboboxComponent } from './combobox.component';
import { ComboboxChipInputComponent } from './combobox-chip-input.component';
import { cn } from '../../utils';
import { FIELD_SIZE_CLASS } from '../component-styles';

@Component({
  selector: 'sanring-combobox-input',
  standalone: true,
  imports: [LucideX],
  template: `
    <input
      #inputEl
      [id]="combobox.inputId"
      [class]="inputClass()"
      [placeholder]="placeholder()"
      [value]="combobox.inputValue()"
      [disabled]="combobox.disabled()"
      (input)="onInput($event)"
      (click)="onClick()"
      (keydown)="onKeyDown($event)"
      autocomplete="off"
      role="combobox"
      [attr.aria-expanded]="combobox.isOpen()"
      [attr.aria-controls]="combobox.listId"
      [attr.aria-activedescendant]="combobox.activeItemId()"
      aria-autocomplete="list"
    />
    @if (showClearButton()) {
      <button
        type="button"
        [class]="clearButtonClass()"
        tabindex="-1"
        (click)="onClear($event)"
      >
        <svg lucideX class="size-3.5"></svg>
        <span class="sr-only">Clear</span>
      </button>
    }
  `,
  // 我們不需要 Host element，直接讓內部的 input 撐起畫面
  host: { '[class]': 'hostClass()' },
})
export class ComboboxInputComponent {
  readonly class = input<string | undefined>();
  readonly placeholder = input<string>('');
  readonly showClear = input(false, { transform: booleanAttribute });

  // 🪄 依賴注入：取得大腦實體
  protected combobox = inject(ComboboxComponent);
  // 如果被包在 ChipInput 裡面（多選模式），代表外層已經有自己的邊框/背景了，
  // 這裡就不能再畫一次，否則會出現「框中框」的視覺 bug
  private readonly chipInputParent = inject(ComboboxChipInputComponent, { optional: true });
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly hostClass = computed(() =>
    this.chipInputParent ? 'contents' : 'relative block',
  );

  protected readonly inputClass = computed(() => {
    if (this.chipInputParent) {
      return cn(
        'min-w-[60px] flex-1 border-0 bg-transparent p-0 text-sm text-[var(--sanring-foreground)] outline-none',
        'placeholder:text-[var(--sanring-muted)] disabled:cursor-not-allowed disabled:opacity-50',
        this.class(),
      );
    }

    return cn(
      'flex w-full rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)]',
      'bg-[var(--sanring-surface)] text-[var(--sanring-foreground)]',
      FIELD_SIZE_CLASS,
      this.showClear() && 'pr-8',
      'placeholder:text-[var(--sanring-muted)]',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sanring-border-strong)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    );
  });

  // 只在「獨立使用」時才顯示清除按鈕——多選 chips 模式已經有每顆 chip 自己的移除按鈕了
  protected readonly showClearButton = computed(
    () => this.showClear() && !this.chipInputParent && this.combobox.hasValue(),
  );

  protected readonly clearButtonClass = computed(() =>
    cn(
      'absolute right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full',
      'text-[var(--sanring-muted)] opacity-70 transition-opacity hover:opacity-100',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sanring-border-strong)]',
    ),
  );

  onClick() {
    // 點擊輸入框時，展開下拉選單
    this.combobox.toggleOpen(true);
  }

  onInput(event: Event) {
    const el = event.target as HTMLInputElement;
    // 打字時，除了更新搜尋關鍵字，也要確保選單是展開的
    this.combobox.setSearchQuery(el.value);
    this.combobox.toggleOpen(true);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      this.combobox.onKeydown(event);
    } else if (event.key === 'Escape') {
      this.combobox.toggleOpen(false);
    } else if (event.key === 'Enter') {
      this.combobox.onKeydown(event);
    }
  }

  onClear(event: MouseEvent): void {
    // 阻止冒泡，避免點擊清除鈕時又被外層的 click 監聽器重新打開選單
    event.stopPropagation();
    event.preventDefault();
    this.combobox.clear();
    this.elementRef.nativeElement.querySelector('input')?.focus();
  }
}
