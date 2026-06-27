import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideCheck, LucideMinus } from '@lucide/angular';
import { cn } from '../../utils';
import { CheckedState, CheckboxSize } from './checkbox.types';

let nextUniqueId = 0;

const SIZE_CLASSES: Record<CheckboxSize, string> = {
  [CheckboxSize.Sm]: 'h-3 w-3',
  [CheckboxSize.Md]: 'h-4 w-4',
  [CheckboxSize.Lg]: 'h-5 w-5',
};

const ICON_SIZE_CLASSES: Record<CheckboxSize, string> = {
  [CheckboxSize.Sm]: 'size-2.5',
  [CheckboxSize.Md]: 'size-4',
  [CheckboxSize.Lg]: 'size-5',
};

@Component({
  selector: 'sanring-checkbox',
  standalone: true,
  imports: [LucideCheck, LucideMinus],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      [id]="id()"
      [attr.name]="name()"
      [attr.value]="value()"
      [attr.aria-checked]="checkedSignal() === 'indeterminate' ? 'mixed' : checkedSignal()"
      [attr.aria-required]="required()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledBy()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.data-state]="getState()"
      [attr.tabindex]="isDisabled() ? -1 : tabIndex()"
      [disabled]="isDisabled()"
      [class]="checkboxClass()"
      (click)="toggle()"
      (blur)="onBlur()"
      (keydown.enter)="$event.preventDefault()"
    >
      @if (checkedSignal() === true) {
        <span class="flex items-center justify-center text-current animate-in zoom-in-50">
          <svg lucideCheck [class]="iconSizeClass()"></svg>
        </span>
      }

      @if (checkedSignal() === 'indeterminate') {
        <span class="flex items-center justify-center text-current animate-in zoom-in-50">
          <svg lucideMinus [class]="iconSizeClass()"></svg>
        </span>
      }
    </button>
  `,
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly class = input<string | undefined>();
  readonly id = input(`sanring-checkbox-${nextUniqueId++}`);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string | undefined>();
  readonly value = input<string | undefined>();
  readonly required = input(false, { transform: booleanAttribute });
  readonly tabIndex = input(0);
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();
  readonly size = input<CheckboxSize>(CheckboxSize.Md);
  readonly checked = input<CheckedState>(false);

  readonly checkedChange = output<CheckedState>();

  protected checkedSignal = signal<CheckedState>(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledState());
  protected readonly iconSizeClass = computed(
    () => ICON_SIZE_CLASSES[this.size()] ?? ICON_SIZE_CLASSES[CheckboxSize.Md],
  );
  protected readonly checkboxClass = computed(() =>
    cn(
      'peer flex items-center justify-center shrink-0 rounded-sm border border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      SIZE_CLASSES[this.size()] ?? SIZE_CLASSES[CheckboxSize.Md],
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
      this.class(),
    ),
  );

  private readonly disabledState = signal(false);
  private onChange: (value: CheckedState) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this.checkedSignal.set(this.checked());
    });
  }

  getState(): string {
    if (this.checkedSignal() === 'indeterminate') return 'indeterminate';
    return this.checkedSignal() ? 'checked' : 'unchecked';
  }

  toggle() {
    if (this.isDisabled()) return;
    this.checkedSignal.set(this.checkedSignal() === true ? false : true);
    this.onChange(this.checkedSignal());
    this.onTouched();
    this.checkedChange.emit(this.checkedSignal());
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: CheckedState): void {
    this.checkedSignal.set(value);
  }

  registerOnChange(fn: (value: CheckedState) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }
}
