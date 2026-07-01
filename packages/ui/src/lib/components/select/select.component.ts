import { Component, forwardRef, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectValue } from './select.type';

@Component({
  selector: 'sanring-select',
  standalone: true,
  template: `<ng-content></ng-content>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent<T extends SelectValue = SelectValue> implements ControlValueAccessor {
  // 🧠 元件的核心狀態
  readonly isOpen = model<boolean>(false); // 選單開關狀態
  readonly value = signal<T | null>(null); // 當前選中的數值
  readonly disabled = signal<boolean>(false); // 禁用狀態

  // Angular 表單的控制回呼函式
  protected onChange: (value: T | null) => void = () => {};
  protected onTouched: () => void = () => {};

  // 提供給子元件（Trigger、Item）呼叫的方法
  setOpen(open: boolean): void {
    if (this.disabled()) return;
    this.isOpen.set(open);
  }

  selectValue(val: T | null): void {
    if (this.disabled()) return;
    this.value.set(val);
    this.onChange(val);
    this.onTouched();
    this.isOpen.set(false); // 選完自動關閉
  }

  // --- ControlValueAccessor 介面實作 ---
  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
