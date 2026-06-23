import { Component, Input, booleanAttribute, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideCheck, LucideMinus } from '@lucide/angular';
import { cn } from '../../utils';
import { CheckedState } from '.';

let nextUniqueId = 0;

@Component({
  selector: 'sanring-checkbox',
  standalone: true,
  imports: [LucideCheck, LucideMinus],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  template: `
    <button
      type="button"
      role="checkbox"
      [id]="id"
      [attr.name]="name"
      [attr.value]="value"
      [attr.aria-checked]="checked === 'indeterminate' ? 'mixed' : checked"
      [attr.aria-required]="required"
      [attr.data-state]="getState()"
      [disabled]="disabled"
      [class]="checkboxClass"
      (click)="toggle()"
      (blur)="onBlur()"
    >
      @if (checked === true) {
        <span class="flex items-center justify-center text-current animate-in zoom-in-50">
          <svg lucideCheck class="size-4"></svg>
        </span>
      }

      @if (checked === 'indeterminate') {
        <span class="flex items-center justify-center text-current animate-in zoom-in-50">
          <svg lucideMinus class="size-4"></svg>
        </span>
      }
    </button>
  `,
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() class = '';
  @Input() id = `sanring-checkbox-${nextUniqueId++}`;
  @Input({ transform: booleanAttribute }) disabled = false;

  // 💡 新增：原生表單與無障礙常用屬性
  @Input() name?: string;
  @Input() value?: string;
  @Input({ transform: booleanAttribute }) required = false;

  // 核心狀態：支援 true, false, 或 'indeterminate'
  checked: CheckedState = false;

  private onChange: (value: CheckedState) => void = () => {};
  private onTouched: () => void = () => {};

  // 轉換給 Tailwind 用的 data-state
  getState(): string {
    if (this.checked === 'indeterminate') return 'indeterminate';
    return this.checked ? 'checked' : 'unchecked';
  }

  // 點擊邏輯
  toggle() {
    if (this.disabled) return;

    // 如果原本是半選(indeterminate) 或 未選(false)，點擊後通常都會變成已選(true)
    this.checked = this.checked === true ? false : true;

    this.onChange(this.checked);
    this.onTouched();
  }

  onBlur() {
    this.onTouched();
  }

  // --- ControlValueAccessor ---

  writeValue(value: CheckedState): void {
    // 允許外部傳入 true, false 或 'indeterminate'
    this.checked = value;
  }

  registerOnChange(fn: (value: CheckedState) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // --- 樣式設定 ---

  protected get checkboxClass() {
    return cn(
      // 1. 基礎樣式 (包含 unchecked 時的透明背景)
      'peer flex items-center justify-center h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',

      // 2. 利用 data 屬性控制「選取 / 半選」時的顏色 (完全取代 JS 判斷)
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',

      // 3. 外部傳入的客製化 class
      this.class,
    );
  }
}
