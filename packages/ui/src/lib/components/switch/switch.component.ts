import { booleanAttribute, Component, computed, effect, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils';
import {
  SELECTION_CONTROL_FOCUS_CLASS,
  SWITCH_THUMB_SIZE_CLASSES,
  SWITCH_THUMB_TRANSLATE_CLASSES,
  SWITCH_TRACK_SIZE_CLASSES,
} from '../component-styles';
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
      'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
      SELECTION_CONTROL_FOCUS_CLASS,
      SWITCH_TRACK_SIZE_CLASSES[this.size()],
      this.invalid() ? 'border-red-500' : 'border-transparent',
      this.checkedSignal() ? 'bg-[var(--sanring-foreground)]' : 'bg-[var(--sanring-border-strong)]',
      this.class(),
    ),
  );
  protected readonly thumbClass = computed(() =>
    cn(
      'pointer-events-none block rounded-full bg-[var(--sanring-background)] shadow-lg ring-0 transition-transform duration-200 ease-in-out',
      SWITCH_THUMB_SIZE_CLASSES[this.size()],
      this.checkedSignal() && SWITCH_THUMB_TRANSLATE_CLASSES[this.size()],
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
