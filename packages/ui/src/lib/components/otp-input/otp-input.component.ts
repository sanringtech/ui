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
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { cn, uniqueId } from '../../utils';
import { FIELD_SIZE_CLASS, SELECTION_CONTROL_FOCUS_CLASS } from '../component-styles';
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
  sm: 'size-8 text-sm',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
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
    '[attr.id]': 'id()',
    '[attr.role]': '"group"',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'computedAriaDescribedBy()',
    '[attr.aria-invalid]': 'errorState ? "true" : null',
    '[attr.aria-required]': 'fieldRequired ? "true" : null',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.data-invalid]': 'errorState || null',
  },
  template: `
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
      'inline-flex gap-2',
      this.orientation() === 'vertical' ? 'flex-col' : 'flex-row items-center',
      this.isDisabled() && 'cursor-not-allowed opacity-50',
      this.class(),
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
  private readonly slotInputRefs = new Map<number, ElementRef<HTMLInputElement>>();

  private onChange: (value: OtpInputValue) => void = () => {};
  private onTouched: () => void = () => {};

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
    return cn(
      'peer rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)]',
      'bg-[var(--sanring-surface)] text-[var(--sanring-foreground)]',
      FIELD_SIZE_CLASS,
      SELECTION_CONTROL_FOCUS_CLASS,
      OTP_INPUT_SIZE_CLASSES[this.size()] ?? OTP_INPUT_SIZE_CLASSES.md,
      OTP_INPUT_TEXT_ALIGN_CLASSES[this.textAlign()] ?? OTP_INPUT_TEXT_ALIGN_CLASSES.center,
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.readOnly() && 'cursor-default',
      slot.state === 'invalid' && 'border-red-500 focus-visible:ring-red-500',
      className,
    );
  }

  getSlotId(index: number): string {
    return `${this.id()}-slot-${index}`;
  }

  getSlotName(index: number): string | null {
    return index === 0 ? (this.name() ?? null) : null;
  }

  getSlotInputMode(): 'numeric' | 'text' {
    return this.inputMode();
  }

  getSlotAutocomplete(index: number): OtpInputAutocomplete | 'off' {
    return index === 0 ? this.autocomplete() : 'off';
  }

  getSlotAriaLabel(index: number): string {
    return `Digit ${index + 1} of ${this.slotCount()}`;
  }

  isSlotReadOnly(): boolean {
    return this.readOnly();
  }

  isSlotDisabled(): boolean {
    return this.isDisabled();
  }

  registerSlot(index: number, elementRef: ElementRef<HTMLInputElement>): void {
    this.slotInputRefs.set(index, elementRef);
  }

  unregisterSlot(index: number, elementRef: ElementRef<HTMLInputElement>): void {
    if (this.slotInputRefs.get(index) === elementRef) {
      this.slotInputRefs.delete(index);
    }
  }

  onSlotFocus(index: number): void {
    this.focused = true;
    this.focusedIndex.set(index);
    this.emitStateChanges();
  }

  onSlotBlur(): void {
    queueMicrotask(() => {
      const activeElement = document.activeElement;
      const stillInside = Array.from(this.slotInputRefs.values()).some(
        (ref) => ref.nativeElement === activeElement,
      );

      if (stillInside) return;
      this.focused = false;
      this.focusedIndex.set(null);
      this.onTouched();
      this.emitStateChanges();
    });
  }

  onSlotInput(event: Event, index: number): void {
    if (this.isDisabled() || this.readOnly()) return;

    const inputEl = event.target as HTMLInputElement;
    const chars = this.getAllowedCharacters(inputEl.value);

    if (!chars.length) {
      inputEl.value = '';
      this.updateSlot(index, '', true);
      return;
    }

    this.applyCharacters(index, chars, true);
  }

  onSlotKeydown(event: KeyboardEvent, index: number): void {
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
        this.handleBackspace(index);
        break;
      case 'Delete':
        event.preventDefault();
        this.updateSlot(index, '', true);
        break;
    }
  }

  onSlotPaste(event: ClipboardEvent, index: number): void {
    if (this.isDisabled() || this.readOnly()) return;

    const text = event.clipboardData?.getData('text') ?? '';
    const chars = this.getAllowedCharacters(text);
    if (!chars.length) return;

    event.preventDefault();
    this.applyCharacters(index, chars, true);
    this.pasted.emit({
      value: this.valueSignal(),
      slots: this.slots(),
      originalEvent: event,
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

  private focusSlot(index: number, options?: FocusOptions): void {
    queueMicrotask(() => {
      const input = this.slotInputRefs.get(index)?.nativeElement;
      input?.focus(options);
      input?.select();
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
