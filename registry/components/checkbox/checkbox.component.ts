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
import { cn } from '../shared/utils';
import {
  CHECKBOX_ICON_SIZE_CLASSES,
  CHECKBOX_SIZE_CLASSES,
  CHECKBOX_STATE_CLASS,
  SELECTION_CONTROL_BASE_CLASS,
  SELECTION_CONTROL_FOCUS_CLASS,
} from '../shared/component-styles';
import { CheckedState, CheckboxSize } from './checkbox.types';

let nextUniqueId = 0;

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
    () => CHECKBOX_ICON_SIZE_CLASSES[this.size()] ?? CHECKBOX_ICON_SIZE_CLASSES[CheckboxSize.Md],
  );
  protected readonly checkboxClass = computed(() =>
    cn(
      SELECTION_CONTROL_BASE_CLASS,
      SELECTION_CONTROL_FOCUS_CLASS,
      'rounded-sm border border-primary',
      CHECKBOX_SIZE_CLASSES[this.size()] ?? CHECKBOX_SIZE_CLASSES[CheckboxSize.Md],
      CHECKBOX_STATE_CLASS,
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
