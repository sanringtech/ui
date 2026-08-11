import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { cn, uniqueId } from '../shared/utils';
import { FIELD_SIZE_CLASS } from '../shared/component-styles';
import { FieldType, SANRING_FIELD_CONTROL, SanringFieldControl } from '../field/field.type';
import { OTP_INPUT_ROOT, OtpInputRootContext } from './otp-input.context';
import { OtpInputSeparatorComponent } from './otp-input-separator.component';
import { OtpInputSlotComponent } from './otp-input-slot.component';
import {
  OtpInputAutocomplete,
  OtpInputCompleteEvent,
  OtpInputKeydownEvent,
  OtpInputOrientation,
  OtpInputPasteEvent,
  OtpInputSize,
  OtpInputSlot,
  OtpInputTextAlign,
  OtpInputType,
  OtpInputValue,
  OtpInputValueChangeEvent,
} from './otp-input.types';

const OTP_INPUT_SIZE_CLASSES: Record<OtpInputSize, string> = {
  sm: 'size-9 text-base',
  md: 'size-11 text-lg',
  lg: 'size-14 text-2xl',
};

const OTP_INPUT_TEXT_ALIGN_CLASSES: Record<OtpInputTextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

@Component({
  selector: 'sanring-otp-input',
  standalone: true,
  imports: [OtpInputSeparatorComponent, OtpInputSlotComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
    // 不能用 useExisting 直接把 OtpInputComponent 當 SanringFieldControl：介面要求的
    // id/disabled/value/required 跟元件既有的同名 @Input 衝突，所以改用 useFactory
    // 產生一個轉接的 adapter 物件。
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: OtpInputComponent) => new OtpInputFieldControlAdapter(host),
      deps: [forwardRef(() => OtpInputComponent)],
    },
    {
      provide: OTP_INPUT_ROOT,
      useExisting: forwardRef(() => OtpInputComponent),
    },
  ],
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': '"group"',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'computedAriaDescribedBy()',
    '[attr.aria-invalid]': 'errorState ? "true" : null',
    '[attr.aria-required]': 'fieldRequired ? "true" : null',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.data-invalid]': 'errorState || null',
    '(pointerdown)': 'onHostPointerDown($event)',
  },
  template: `
    <input
      #otpInput
      [class]="inputClass()"
      [id]="id()"
      [attr.name]="name()"
      type="search"
      [attr.inputmode]="inputMode()"
      [attr.autocomplete]="autocomplete()"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      data-1p-ignore="true"
      data-bwignore="true"
      data-form-type="other"
      data-lpignore="true"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledBy()"
      [attr.aria-describedby]="computedAriaDescribedBy()"
      [attr.aria-invalid]="errorState ? 'true' : null"
      [attr.aria-required]="fieldRequired ? 'true' : null"
      [value]="valueSignal()"
      [readOnly]="readOnly()"
      [disabled]="isDisabled()"
      [attr.maxlength]="slotCount()"
      (focus)="onInputFocus()"
      (blur)="onInputBlur()"
      (input)="onInput($event)"
      (keydown)="onInputKeydown($event)"
      (paste)="onInputPaste($event)"
    />

    <ng-content />

    @if (!hasProjectedSlots()) {
      @for (slot of slots(); track slot.index) {
        <sanring-otp-input-slot [index]="slot.index" />

        @if (hasSeparatorAfter(slot.index)) {
          <sanring-otp-input-separator />
        }
      }
    }
  `,
})
export class OtpInputComponent implements ControlValueAccessor, OnInit, OtpInputRootContext {
  readonly class = input<string | undefined>();
  readonly id = input(uniqueId('sanring-otp-input'));
  readonly name = input<string | undefined>();
  readonly length = input(6, { transform: numberAttribute });
  readonly value = input<OtpInputValue>('');
  readonly type = input<OtpInputType>('numeric');
  readonly pattern = input<RegExp | string | null>(null);
  readonly size = input<OtpInputSize>('md');
  readonly orientation = input<OtpInputOrientation>('horizontal');
  readonly textAlign = input<OtpInputTextAlign>('center');
  readonly separatorAt = input<number | readonly number[] | null>(null);
  readonly autocomplete = input<OtpInputAutocomplete>('one-time-code');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readOnly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();

  readonly valueChange = output<OtpInputValue>();
  readonly stateChange = output<OtpInputValueChangeEvent>();
  readonly complete = output<OtpInputCompleteEvent>();
  readonly pasted = output<OtpInputPasteEvent>();
  readonly slotKeydown = output<OtpInputKeydownEvent>();

  private readonly projectedSlots = contentChildren(OtpInputSlotComponent, { descendants: true });

  protected readonly slotValues = signal<string[]>([]);
  protected readonly valueSignal = computed<OtpInputValue>(() => this.slotValues().join(''));
  protected readonly focusedIndex = signal<number | null>(null);
  private readonly disabledState = signal(false);
  private readonly fieldDescribedByIds = signal<string[]>([]);
  // 橋接用：ngControl 的 invalid/touched 是 RxJS 驅動、不是 signal，靠這個計數器把它們
  // 接進 signal graph，讓 errorState/fieldRequired 在 OnPush 下也能正確重算
  private readonly stateVersion = signal(0);
  protected readonly hasProjectedSlots = computed(() => this.projectedSlots().length > 0);

  // ==========================================
  // Field 整合：底下這些成員都不會跟上面的 @Input 撞名，可以直接放在元件本身；
  // 真正會撞名的 (id/disabled/value/required) 走下面的 fieldXxx getter，由
  // OtpInputFieldControlAdapter 轉接成 SanringFieldControl 介面。
  // ==========================================
  readonly controlType = FieldType.otpInput;
  focused = false;
  ngControl: NgControl | null = null;

  protected readonly slotCount = computed(() => {
    const length = this.length();
    return Number.isFinite(length) && length > 0 ? Math.floor(length) : 6;
  });

  protected readonly isDisabled = computed(() => this.disabled() || this.disabledState());

  protected readonly inputMode = computed(() => (this.type() === 'numeric' ? 'numeric' : 'text'));

  protected readonly slots = computed<readonly OtpInputSlot[]>(() => {
    const values = this.slotValues();
    const focusedIndex = this.focusedIndex();
    const disabled = this.isDisabled();
    const invalid = this.errorState;

    return Array.from({ length: this.slotCount() }, (_, index) => {
      const slotValue = values[index] ?? '';
      return {
        index,
        value: slotValue,
        state: this.getSlotState(index, slotValue, focusedIndex, disabled, invalid),
      };
    });
  });

  protected readonly hostClass = computed(() =>
    cn(
      'relative inline-flex max-w-full overflow-x-auto',
      this.orientation() === 'vertical' ? 'flex-col' : 'flex-row items-center',
      this.isDisabled() && 'cursor-not-allowed opacity-50',
      this.class(),
    ),
  );

  protected readonly inputClass = computed(() =>
    cn(
      'pointer-events-none absolute left-1/2 top-1/2 size-px -translate-x-1/2 -translate-y-1/2 opacity-0',
      'border-0 bg-transparent p-0 text-transparent outline-none',
    ),
  );

  protected readonly computedAriaDescribedBy = computed(() => {
    const ids = [this.ariaDescribedBy(), ...this.fieldDescribedByIds()].filter(
      (v): v is string => !!v,
    );
    return ids.length ? ids.join(' ') : undefined;
  });

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly stateChangesSubject = new Subject<void>();
  readonly stateChanges: Observable<void> = this.stateChangesSubject.asObservable();
  private readonly otpInput = viewChild<ElementRef<HTMLInputElement>>('otpInput');

  private onChange: (value: OtpInputValue) => void = () => {};
  private onTouched: () => void = () => {};
  // 手機虛擬鍵盤常常不理會 keydown 的 preventDefault()，字元還是會被瀏覽器插入
  // 原生 input，導致 keydown 跟隨後補發的 input 事件各寫入一次、畫面顯示兩次。
  // 用這個旗標讓 onInput 偵測到「已經由 keydown 處理過」時直接略過、只把畫面同步回目前的值。
  private suppressNextInput = false;

  constructor() {
    effect(() => {
      const value = this.value();
      this.slotCount();
      untracked(() => this.setValue(value, false));
    });

    this.destroyRef.onDestroy(() => this.stateChangesSubject.complete());
  }

  ngOnInit(): void {
    // 不能在 constructor 做 self-inject NgControl：本元件同時透過 NG_VALUE_ACCESSOR
    // (forwardRef) 註冊自己，若在 constructor 階段就 self-inject，跟 NgModel 搭配時
    // 會觸發 NG0200 循環依賴。延後到 ngOnInit，Angular 保證同節點 directive 都建構完後
    // 才跑 lifecycle hook，循環依賴就消失了。
    this.ngControl = this.injector.get(NgControl, null, { optional: true, self: true });
    // 不能只聽 statusChanges——markAsTouched() 只改 touched flag，不觸發它，
    // 導致 markAllAsTouched() 後錯誤狀態不更新。改聽 control.events（Angular v18+），
    // touched / pristine / status / value 任何變化都會通過這裡。
    this.ngControl?.control?.events
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitStateChanges());
  }

  get errorState(): boolean {
    this.stateVersion();
    return !!(this.ngControl?.invalid && this.ngControl?.touched);
  }

  get fieldValue(): OtpInputValue {
    return this.valueSignal();
  }

  get fieldEmpty(): boolean {
    return this.valueSignal().length === 0;
  }

  get fieldDisabled(): boolean {
    return this.isDisabled();
  }

  get fieldRequired(): boolean {
    this.stateVersion();
    return this.required() || !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  focus(options?: FocusOptions): void {
    const nextIndex = this.findFirstEmptyIndex();
    this.focusSlot(nextIndex === -1 ? 0 : nextIndex, options);
  }

  setDescribedByIds(ids: string[]): void {
    this.fieldDescribedByIds.set(ids);
  }

  writeValue(value: OtpInputValue | null | undefined): void {
    this.setValue(value ?? '', false);
  }

  registerOnChange(fn: (value: OtpInputValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
    this.emitStateChanges();
  }

  getOrientation(): OtpInputOrientation {
    return this.orientation();
  }

  getSlot(index: number): OtpInputSlot {
    return (
      this.slots()[index] ?? {
        index,
        value: '',
        state: this.isDisabled() ? 'disabled' : 'empty',
      }
    );
  }

  getSlotClass(slot: OtpInputSlot, className?: string): string {
    const isHorizontal = this.orientation() === 'horizontal';
    const isFirst = slot.index === 0;
    const isLast = slot.index === this.slotCount() - 1;

    return cn(
      'relative inline-flex shrink-0 cursor-text select-none items-center justify-center border border-[var(--sanring-border-strong)]',
      'bg-[var(--sanring-surface)] text-[var(--sanring-foreground)]',
      FIELD_SIZE_CLASS,
      OTP_INPUT_SIZE_CLASSES[this.size()] ?? OTP_INPUT_SIZE_CLASSES.md,
      OTP_INPUT_TEXT_ALIGN_CLASSES[this.textAlign()] ?? OTP_INPUT_TEXT_ALIGN_CLASSES.center,
      'font-normal shadow-sm outline-none transition-[background-color,border-color,box-shadow,color,transform] duration-200 ease-out',
      this.isDisabled() && 'cursor-not-allowed opacity-50',
      isHorizontal && !isFirst && '-ms-px',
      isHorizontal && isFirst && 'rounded-l-2xl',
      isHorizontal && isLast && 'rounded-r-2xl',
      !isHorizontal && !isFirst && '-mt-px',
      !isHorizontal && isFirst && 'rounded-t-2xl',
      !isHorizontal && isLast && 'rounded-b-2xl',
      !isFirst && !isLast && 'rounded-none',
      this.readOnly() && 'cursor-default',
      slot.state === 'active' &&
        'z-10 border-[var(--sanring-ring)] shadow-md ring-2 ring-[var(--sanring-border-strong)] ring-offset-2 ring-offset-[var(--sanring-background)]',
      slot.state === 'filled' && 'text-[var(--sanring-foreground)]',
      slot.state === 'invalid' && 'z-10 border-red-500',
      className,
    );
  }

  getSlotId(index: number): string {
    return `${this.id()}-slot-${index}`;
  }

  getSlotAriaLabel(index: number): string {
    return `Digit ${index + 1} of ${this.slotCount()}`;
  }

  onHostPointerDown(event: PointerEvent): void {
    if (event.target !== event.currentTarget) return;
    this.focus();
  }

  onSlotPointerDown(event: PointerEvent, index: number): void {
    if (this.isDisabled() || this.readOnly()) return;
    event.preventDefault();
    event.stopPropagation();
    this.focusSlot(index);
  }

  onInputFocus(): void {
    this.focused = true;
    if (this.focusedIndex() === null) {
      const nextIndex = this.findFirstEmptyIndex();
      this.focusedIndex.set(nextIndex === -1 ? this.slotCount() - 1 : nextIndex);
    }
    this.emitStateChanges();
  }

  onInputBlur(): void {
    this.focused = false;
    this.focusedIndex.set(null);
    this.onTouched();
    this.emitStateChanges();
  }

  onInput(event: Event): void {
    if (this.isDisabled() || this.readOnly()) return;

    const inputEl = event.target as HTMLInputElement;

    if (this.suppressNextInput) {
      this.suppressNextInput = false;
      inputEl.value = this.valueSignal();
      return;
    }

    const chars = this.getAllowedCharacters(inputEl.value);

    if (!chars.length) {
      inputEl.value = '';
      this.setValue('', true);
      return;
    }

    if (chars.length === 1) {
      const index = this.getActiveInputIndex();
      this.updateSlot(index, chars[0], true);
      this.focusSlot(Math.min(index + 1, this.slotCount() - 1));
      return;
    }

    this.setValue(chars.join(''), true);
    this.focusSlot(Math.min(chars.length, this.slotCount() - 1));
  }

  onInputKeydown(event: KeyboardEvent): void {
    const index = this.getActiveInputIndex();
    const payload = this.getKeydownEvent(event, index);
    this.slotKeydown.emit(payload);

    if (this.isDisabled() || this.readOnly()) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.focusSlot(Math.max(index - 1, 0));
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.focusSlot(Math.min(index + 1, this.slotCount() - 1));
        break;
      case 'Home':
        event.preventDefault();
        this.focusSlot(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusSlot(this.slotCount() - 1);
        break;
      case 'Backspace':
        event.preventDefault();
        this.armSuppressNextInput();
        this.handleBackspace(index);
        break;
      case 'Delete':
        event.preventDefault();
        this.armSuppressNextInput();
        this.updateSlot(index, '', true);
        break;
      default:
        if (this.isCharacterKey(event)) {
          const [char] = this.getAllowedCharacters(event.key);
          event.preventDefault();

          if (!char) return;

          this.armSuppressNextInput();
          this.updateSlot(index, char, true);
          this.focusSlot(Math.min(index + 1, this.slotCount() - 1));
        }
        break;
    }
  }

  onInputPaste(event: ClipboardEvent): void {
    if (this.isDisabled() || this.readOnly()) return;

    const text = event.clipboardData?.getData('text') ?? '';
    const chars = this.getAllowedCharacters(text);
    if (!chars.length) return;

    event.preventDefault();
    const index = this.getActiveInputIndex();
    this.applyCharacters(index, chars, true);
    this.pasted.emit({
      value: this.valueSignal(),
      slots: this.slots(),
      originalEvent: event,
    });
  }

  // 旗標只需要蓋住「同一次按鍵補發的 input 事件」，不能一直卡著，否則會誤吃到
  // 之後真正合法的 input 事件（例如簡訊一鍵帶入驗證碼的 autofill）。
  // iOS Safari/Chrome 的虛擬鍵盤透過獨立的鍵盤程序非同步回補字元，這個回補
  // 事件常常比 setTimeout(0) 這種單一 macrotask 還晚才送達，導致旗標提早被
  // 清掉、補發的 input 事件沒被擋到而重複寫入。改用兩層 requestAnimationFrame
  // （至少等滿一個畫面更新週期）換取更寬裕的緩衝時間，讓 iOS 有機會把補發事件
  // 送到再清旗標。
  private armSuppressNextInput(): void {
    this.suppressNextInput = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.suppressNextInput = false;
      });
    });
  }

  protected hasSeparatorAfter(index: number): boolean {
    const separatorAt = this.separatorAt();
    if (separatorAt === null) return false;
    if (Array.isArray(separatorAt)) return separatorAt.includes(index + 1);
    return separatorAt === index + 1;
  }

  private setValue(value: OtpInputValue, emit: boolean): void {
    const nextValues = this.normalizeValue(value);
    if (this.areSlotValuesEqual(this.slotValues(), nextValues)) return;

    this.slotValues.set(nextValues);
    this.emitStateChanges();

    if (!emit) return;
    this.emitValueEvents();
  }

  private updateSlot(index: number, value: string, emit: boolean): void {
    const nextValues = this.getNormalizedSlotValues();
    nextValues[index] = value;
    this.setSlotValues(nextValues, emit);
  }

  private applyCharacters(startIndex: number, chars: readonly string[], emit: boolean): void {
    const nextValues = this.getNormalizedSlotValues();
    const maxLength = this.slotCount();

    chars.slice(0, maxLength - startIndex).forEach((char, offset) => {
      nextValues[startIndex + offset] = char;
    });

    this.setSlotValues(nextValues, emit);

    const nextIndex = Math.min(startIndex + chars.length, maxLength - 1);
    this.focusSlot(nextIndex);
  }

  private handleBackspace(index: number): void {
    if (this.slotValues()[index]) {
      this.updateSlot(index, '', true);
      return;
    }

    const previousIndex = Math.max(index - 1, 0);
    this.updateSlot(previousIndex, '', true);
    this.focusSlot(previousIndex);
  }

  private emitValueEvents(): void {
    const value = this.valueSignal();
    const slots = this.slots();
    const complete = value.length === this.slotCount() && slots.every((slot) => !!slot.value);
    const event: OtpInputValueChangeEvent = { value, slots, complete };

    this.onChange(value);
    this.valueChange.emit(value);
    this.stateChange.emit(event);

    if (complete) {
      this.complete.emit({ ...event, complete: true });
    }
  }

  private setSlotValues(values: string[], emit: boolean): void {
    const nextValues = values.slice(0, this.slotCount());
    while (nextValues.length < this.slotCount()) {
      nextValues.push('');
    }

    if (this.areSlotValuesEqual(this.slotValues(), nextValues)) return;

    this.slotValues.set(nextValues);
    this.emitStateChanges();

    if (!emit) return;
    this.emitValueEvents();
  }

  private normalizeValue(value: OtpInputValue): string[] {
    const chars = this.getAllowedCharacters(value).slice(0, this.slotCount());
    return Array.from({ length: this.slotCount() }, (_, index) => chars[index] ?? '');
  }

  private getNormalizedSlotValues(): string[] {
    return Array.from({ length: this.slotCount() }, (_, index) => this.slotValues()[index] ?? '');
  }

  private areSlotValuesEqual(left: readonly string[], right: readonly string[]): boolean {
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }

  private getAllowedCharacters(value: string): string[] {
    const chars = Array.from(value);
    const pattern = this.pattern();

    if (pattern) {
      return chars.filter((char) => this.matchesPattern(char, pattern));
    }

    switch (this.type()) {
      case 'numeric':
        return chars.filter((char) => /^\d$/.test(char));
      case 'alphanumeric':
        return chars.filter((char) => /^[a-z0-9]$/i.test(char));
      case 'text':
        return chars.filter((char) => char.trim().length > 0);
    }
  }

  private matchesPattern(char: string, pattern: RegExp | string): boolean {
    if (typeof pattern === 'string') {
      return new RegExp(pattern).test(char);
    }

    pattern.lastIndex = 0;
    return pattern.test(char);
  }

  private getSlotState(
    index: number,
    value: string,
    focusedIndex: number | null,
    disabled: boolean,
    invalid: boolean,
  ): OtpInputSlot['state'] {
    if (disabled) return 'disabled';
    if (invalid) return 'invalid';
    if (focusedIndex === index) return 'active';
    return value ? 'filled' : 'empty';
  }

  private findFirstEmptyIndex(): number {
    return this.slots().findIndex((slot) => !slot.value);
  }

  private getActiveInputIndex(): number {
    const focusedIndex = this.focusedIndex();
    if (focusedIndex !== null) return focusedIndex;

    const nextIndex = this.findFirstEmptyIndex();
    return nextIndex === -1 ? this.slotCount() - 1 : nextIndex;
  }

  private isCharacterKey(event: KeyboardEvent): boolean {
    return event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey;
  }

  private focusSlot(index: number, options?: FocusOptions): void {
    const nextIndex = Math.min(Math.max(index, 0), this.slotCount() - 1);
    this.focused = true;
    this.focusedIndex.set(nextIndex);
    this.emitStateChanges();

    queueMicrotask(() => {
      const input = this.otpInput()?.nativeElement;
      input?.focus(options);
      input?.setSelectionRange(input.value.length, input.value.length);
    });
  }

  private getKeydownEvent(event: KeyboardEvent, index: number): OtpInputKeydownEvent {
    return {
      value: this.valueSignal(),
      slots: this.slots(),
      index,
      originalEvent: event,
    };
  }

  private emitStateChanges(): void {
    this.stateVersion.update((v) => v + 1);
    this.stateChangesSubject.next();
  }
}

class OtpInputFieldControlAdapter implements SanringFieldControl<OtpInputValue> {
  readonly controlType = FieldType.otpInput;

  constructor(private readonly host: OtpInputComponent) {}

  get id(): string {
    return this.host.id();
  }

  get value(): OtpInputValue {
    return this.host.fieldValue;
  }

  get empty(): boolean {
    return this.host.fieldEmpty;
  }

  get focused(): boolean {
    return this.host.focused;
  }

  get errorState(): boolean {
    return this.host.errorState;
  }

  get disabled(): boolean {
    return this.host.fieldDisabled;
  }

  get required(): boolean {
    return this.host.fieldRequired;
  }

  get ngControl(): NgControl | null {
    return this.host.ngControl;
  }

  get stateChanges(): Observable<void> {
    return this.host.stateChanges;
  }

  focus(options?: FocusOptions): void {
    this.host.focus(options);
  }

  setDescribedByIds(ids: string[]): void {
    this.host.setDescribedByIds(ids);
  }
}
