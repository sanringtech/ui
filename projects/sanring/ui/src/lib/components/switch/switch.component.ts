import { booleanAttribute, Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils';

export type SwitchSize = 'sm' | 'md' | 'lg';

let nextUniqueId = 0;

@Component({
  selector: 'sanring-switch',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  template: `
    <button
      type="button"
      role="switch"
      [id]="id"
      [attr.aria-checked]="checked"
      [attr.data-state]="checked ? 'checked' : 'unchecked'"
      [disabled]="disabled"
      [class]="trackClass"
      (click)="toggle()"
      (blur)="onBlur()"
    >
      <span [attr.data-state]="checked ? 'checked' : 'unchecked'" [class]="thumbClass"></span>
    </button>
  `,
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() class = '';
  @Input() id = `sanring-switch-${nextUniqueId++}`;
  @Input({ transform: booleanAttribute }) checked = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) invalid = false;
  @Input() size: SwitchSize = 'md';

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.onChange(this.checked);
    this.onTouched();
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: boolean | null | undefined): void {
    this.checked = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // --- 樣式設定 ---

  protected get trackClass() {
    return cn(
      'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sanring-background)] disabled:cursor-not-allowed disabled:opacity-50',
      this.size === 'sm' && 'h-5 w-9',
      this.size === 'md' && 'h-6 w-11',
      this.size === 'lg' && 'h-7 w-12',
      this.invalid ? 'border-red-500' : 'border-transparent',
      this.checked ? 'bg-[var(--sanring-foreground)]' : 'bg-[var(--sanring-border-strong)]',
      this.class,
    );
  }

  protected get thumbClass() {
    return cn(
      'pointer-events-none block rounded-full bg-[var(--sanring-background)] shadow-lg ring-0 transition-transform duration-200 ease-in-out',
      this.size === 'sm' && 'size-4',
      this.size === 'md' && 'size-5',
      this.size === 'lg' && 'size-6',
      this.checked && this.size === 'sm' && 'translate-x-4',
      this.checked && this.size === 'md' && 'translate-x-5',
      this.checked && this.size === 'lg' && 'translate-x-5',
      !this.checked && 'translate-x-0',
    );
  }
}
