import { booleanAttribute, Component, computed, effect, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils';
import { SwitchSize } from './switch.type';

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
      [id]="id()"
      [attr.aria-checked]="checkedSignal()"
      [attr.aria-invalid]="invalid() ? 'true' : null"
      [attr.data-state]="checkedSignal() ? 'checked' : 'unchecked'"
      [disabled]="isDisabled()"
      [class]="trackClass()"
      (click)="toggle()"
      (blur)="onBlur()"
    >
      <span [attr.data-state]="checkedSignal() ? 'checked' : 'unchecked'" [class]="thumbClass()"></span>
    </button>
  `,
})
export class SwitchComponent implements ControlValueAccessor {
  readonly class = input<string | undefined>();
  readonly id = input(`sanring-switch-${nextUniqueId++}`);
  readonly checked = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly size = input<SwitchSize>('md');

  protected readonly checkedSignal = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledState());
  protected readonly trackClass = computed(() =>
    cn(
      'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sanring-background)] disabled:cursor-not-allowed disabled:opacity-50',
      this.size() === 'sm' && 'h-5 w-9',
      this.size() === 'md' && 'h-6 w-11',
      this.size() === 'lg' && 'h-7 w-12',
      this.invalid() ? 'border-red-500' : 'border-transparent',
      this.checkedSignal() ? 'bg-[var(--sanring-foreground)]' : 'bg-[var(--sanring-border-strong)]',
      this.class(),
    ),
  );
  protected readonly thumbClass = computed(() =>
    cn(
      'pointer-events-none block rounded-full bg-[var(--sanring-background)] shadow-lg ring-0 transition-transform duration-200 ease-in-out',
      this.size() === 'sm' && 'size-4',
      this.size() === 'md' && 'size-5',
      this.size() === 'lg' && 'size-6',
      this.checkedSignal() && this.size() === 'sm' && 'translate-x-4',
      this.checkedSignal() && this.size() === 'md' && 'translate-x-5',
      this.checkedSignal() && this.size() === 'lg' && 'translate-x-5',
      !this.checkedSignal() && 'translate-x-0',
    ),
  );

  private readonly disabledState = signal(false);
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this.checkedSignal.set(this.checked());
    });
  }

  toggle() {
    if (this.isDisabled()) return;
    this.checkedSignal.set(!this.checkedSignal());
    this.onChange(this.checkedSignal());
    this.onTouched();
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: boolean | null | undefined): void {
    this.checkedSignal.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }
}
