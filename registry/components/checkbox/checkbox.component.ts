import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideCheck, LucideMinus } from '@lucide/angular';
import { cn } from '../shared/utils';
import { SELECTION_CONTROL_BASE_CLASS, SELECTION_CONTROL_FOCUS_CLASS } from '../shared/component-styles';
import { SanringCvaBase, SanringFieldControlAdapter } from '../shared/cva-base';
import { FieldType, SANRING_FIELD_CONTROL } from '../field/field.type';
import { CHECKBOX_ICON_SIZE_CLASSES, CHECKBOX_SIZE_CLASSES, CHECKBOX_STATE_CLASS } from './checkbox.styles';
import { CheckedState, CheckboxSize } from './checkbox.types';

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
    // 不能用 useExisting 直接把 CheckboxComponent 當 SanringFieldControl：介面要求的
    // id/disabled/value/required 跟元件既有的同名 @Input 衝突（且此 repo 的 eslint 規則
    // 禁止用 alias 改名 @Input），所以改用 useFactory 產生一個轉接的 adapter 物件。
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: CheckboxComponent) => new SanringFieldControlAdapter(FieldType.checkbox, host),
      deps: [forwardRef(() => CheckboxComponent)],
    },
  ],
  template: `
    <button
      #btn
      type="button"
      role="checkbox"
      [id]="id()"
      [attr.name]="name()"
      [attr.value]="value()"
      [attr.aria-checked]="checkedSignal() === 'indeterminate' ? 'mixed' : checkedSignal()"
      [attr.aria-required]="fieldRequired ? 'true' : null"
      [attr.aria-invalid]="errorState ? 'true' : null"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledBy()"
      [attr.aria-describedby]="computedAriaDescribedBy()"
      [attr.data-state]="getState()"
      [attr.tabindex]="isDisabled() ? -1 : tabIndex()"
      [disabled]="isDisabled()"
      [class]="checkboxClass()"
      (click)="toggle()"
      (focus)="onFocus()"
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
export class CheckboxComponent extends SanringCvaBase<CheckedState> {
  readonly class = input<string | undefined>();
  readonly id = input(inject(_IdGenerator).getId('sanring-checkbox-', true));
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string | undefined>();
  readonly value = input<string | undefined>();
  readonly required = input(false, { transform: booleanAttribute });
  readonly tabIndex = input(0);
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();
  readonly size = input<CheckboxSize>('md');
  readonly checked = input<CheckedState>(false);

  readonly checkedChange = output<CheckedState>();

  protected checkedSignal = signal<CheckedState>(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledState());
  protected readonly iconSizeClass = computed(() => CHECKBOX_ICON_SIZE_CLASSES[this.size()]);
  // 讀 this.errorState（getter）而不是直接寫條件，是為了讓 stateVersion 的橋接生效，
  // 否則 ngControl.invalid/touched 不是 signal，這個 computed 不會在驗證狀態改變時重算
  protected readonly checkboxClass = computed(() =>
    cn(
      SELECTION_CONTROL_BASE_CLASS,
      SELECTION_CONTROL_FOCUS_CLASS,
      'rounded-[var(--sanring-radius-xs)] border border-primary',
      CHECKBOX_SIZE_CLASSES[this.size()],
      CHECKBOX_STATE_CLASS,
      this.errorState && 'border-red-500 focus-visible:ring-red-500',
      this.class(),
    ),
  );

  protected readonly computedAriaDescribedBy = this.makeComputedAriaDescribedBy(this.ariaDescribedBy);

  @ViewChild('btn') private btnRef!: ElementRef<HTMLButtonElement>;

  get fieldValue(): CheckedState | null {
    return this.checkedSignal();
  }

  get fieldEmpty(): boolean {
    return !this.checkedSignal();
  }

  get fieldDisabled(): boolean {
    return this.isDisabled();
  }

  protected override hasInputRequired(): boolean {
    return this.required();
  }

  constructor() {
    super();
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
    this.emitStateChanges();
  }

  focus(options?: FocusOptions): void {
    this.btnRef?.nativeElement.focus(options);
  }

  override writeValue(value: CheckedState): void {
    this.checkedSignal.set(value);
  }
}
