import { Component, computed, inject, input } from '@angular/core';
import { ComboboxComponent } from './combobox.component';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-combobox-input',
  standalone: true,
  template: `
    <input
      [id]="combobox.inputId"
      [class]="inputClass()"
      [placeholder]="placeholder()"
      [value]="combobox.searchQuery()"
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
  `,
  // 我們不需要 Host element，直接讓內部的 input 撐起畫面
  host: { style: 'display: contents;' },
})
export class ComboboxInputComponent {
  readonly class = input<string | undefined>();
  readonly placeholder = input<string>('');

  // 🪄 依賴注入：取得大腦實體
  protected combobox = inject(ComboboxComponent);

  protected readonly inputClass = computed(() =>
    cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
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
}
