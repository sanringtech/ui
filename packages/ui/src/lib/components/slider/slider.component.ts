import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  booleanAttribute,
  computed,
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
import { cn } from '../../utils';
import { SELECTION_CONTROL_FOCUS_CLASS } from '../component-styles';
import { FieldType, SanringFieldControl, SANRING_FIELD_CONTROL } from '../field/field.type';

let nextUniqueId = 0;

@Component({
  selector: 'sanring-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
    // 跟 checkbox 一樣：id/disabled/value 已經被同名 @Input 佔用，改用 useFactory 轉接。
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: SliderComponent) => new SliderFieldControlAdapter(host),
      deps: [forwardRef(() => SliderComponent)],
    },
  ],
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': '"slider"',
    '[attr.id]': 'id()',
    '[attr.aria-valuemin]': 'minValue()',
    '[attr.aria-valuemax]': 'maxValue()',
    '[attr.aria-valuenow]': 'valueSignal()',
    '[attr.aria-valuetext]': 'ariaValueText()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'computedAriaDescribedBy()',
    '[attr.aria-invalid]': 'errorState ? "true" : null',
    '[attr.aria-required]': 'fieldRequired ? "true" : null',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.aria-orientation]': '"horizontal"',
    '[attr.tabindex]': 'isDisabled() ? -1 : tabIndex()',
    '[attr.data-disabled]': 'isDisabled() || null',
    '(focus)': 'onFocus()',
    '(blur)': 'markTouched()',
    '(keydown)': 'onKeydown($event)',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerEnd($event)',
    '(pointercancel)': 'onPointerEnd($event)',
  },
  template: `
    <div
      class="relative h-2 w-full grow overflow-hidden rounded-full bg-[var(--sanring-border-strong)]"
    >
      <div class="absolute h-full bg-[var(--sanring-foreground)]" [style.width.%]="percentage()"></div>
    </div>

    <span
      [class]="thumbClass()"
      [style.left.%]="percentage()"
    ></span>
  `,
})
export class SliderComponent implements ControlValueAccessor, OnInit {
  readonly class = input<string | undefined>();
  readonly id = input(`sanring-slider-${nextUniqueId++}`);
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly step = input(1, { transform: numberAttribute });
  readonly value = input(50, { transform: numberAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly tabIndex = input(0, { transform: numberAttribute });
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();
  readonly ariaValueText = input<string | undefined>();

  readonly valueChange = output<number>();

  protected readonly valueSignal = signal(50);
  protected readonly minValue = computed(() => Math.min(this.min(), this.max()));
  protected readonly maxValue = computed(() => Math.max(this.min(), this.max()));
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledState());

  protected readonly percentage = computed(() => {
    const range = this.maxValue() - this.minValue();
    if (range <= 0) return 0;
    return ((this.valueSignal() - this.minValue()) / range) * 100;
  });

  protected readonly hostClass = computed(() =>
    cn(
      'relative flex w-full touch-none select-none items-center rounded-[var(--sanring-radius-xs)] py-2',
      SELECTION_CONTROL_FOCUS_CLASS,
      this.isDisabled() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      this.class(),
    ),
  );

  // Dragging updates `left` on every pointermove — a CSS transition there fights the
  // pointer position and makes the thumb visibly lag behind the cursor (and the fill,
  // which has no transition). Only animate `left` for discrete changes (keyboard, click).
  protected readonly thumbClass = computed(() =>
    cn(
      'pointer-events-none absolute block size-5 -translate-x-1/2 rounded-full border-2 border-[var(--sanring-foreground)] bg-[var(--sanring-background)] shadow-sm',
      this.dragging() ? '' : 'transition-[left]',
    ),
  );

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly disabledState = signal(false);
  private readonly dragging = signal(false);
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  // ==========================================
  // Field 整合：id/disabled/value 已經被同名 @Input 佔用，走下面的 fieldXxx getter，
  // 由 SliderFieldControlAdapter 轉接成 SanringFieldControl 介面。
  // ==========================================
  readonly controlType = FieldType.slider;
  focused = false;
  ngControl: NgControl | null = null;

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly stateChangesSubject = new Subject<void>();
  readonly stateChanges: Observable<void> = this.stateChangesSubject.asObservable();
  private readonly stateVersion = signal(0);
  private readonly fieldDescribedByIds = signal<string[]>([]);

  protected readonly computedAriaDescribedBy = computed(() => {
    const ids = [this.ariaDescribedBy(), ...this.fieldDescribedByIds()].filter((v): v is string => !!v);
    return ids.length ? ids.join(' ') : undefined;
  });

  get errorState(): boolean {
    this.stateVersion();
    return !!(this.ngControl?.invalid && this.ngControl?.touched);
  }

  get fieldValue(): number {
    return this.valueSignal();
  }

  get fieldDisabled(): boolean {
    return this.isDisabled();
  }

  get fieldRequired(): boolean {
    this.stateVersion();
    return !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  constructor() {
    effect(() => {
      const value = this.value();
      this.min();
      this.max();
      this.step();
      untracked(() => this.setValue(value, false));
    });

    this.destroyRef.onDestroy(() => this.stateChangesSubject.complete());
  }

  ngOnInit(): void {
    // 跟 checkbox 一樣的原因：constructor 階段 self-inject NgControl 會跟 NgModel 搭配時
    // 觸發 NG0200 循環依賴（本元件同時透過 NG_VALUE_ACCESSOR 註冊自己），延後到 ngOnInit 才拿。
    this.ngControl = this.injector.get(NgControl, null, { optional: true, self: true });
    // 不能只聽 statusChanges——markAsTouched() 不會觸發它，改聽 control.events（Angular
    // v18+ 公開 API）才能在 markAllAsTouched() 這類外部呼叫時正確更新 errorState。
    this.ngControl?.control?.events
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitStateChanges());
  }

  onFocus(): void {
    this.focused = true;
    this.emitStateChanges();
  }

  focus(options?: FocusOptions): void {
    this.host.nativeElement.focus(options);
  }

  setDescribedByIds(ids: string[]): void {
    this.fieldDescribedByIds.set(ids);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    const step = this.normalizedStep();
    const pageStep = step * 10;
    let nextValue: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        nextValue = this.valueSignal() + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        nextValue = this.valueSignal() - step;
        break;
      case 'PageUp':
        nextValue = this.valueSignal() + pageStep;
        break;
      case 'PageDown':
        nextValue = this.valueSignal() - pageStep;
        break;
      case 'Home':
        nextValue = this.minValue();
        break;
      case 'End':
        nextValue = this.maxValue();
        break;
    }

    if (nextValue === null) return;
    event.preventDefault();
    this.setValue(nextValue, true);
  }

  onPointerDown(event: PointerEvent): void {
    if (this.isDisabled() || event.button !== 0) return;

    event.preventDefault();
    this.host.nativeElement.focus();
    this.host.nativeElement.setPointerCapture(event.pointerId);
    this.dragging.set(true);
    this.setValueFromPointer(event);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging() || this.isDisabled()) return;
    this.setValueFromPointer(event);
  }

  onPointerEnd(event: PointerEvent): void {
    if (!this.dragging()) return;
    this.dragging.set(false);
    if (this.host.nativeElement.hasPointerCapture(event.pointerId)) {
      this.host.nativeElement.releasePointerCapture(event.pointerId);
    }
    this.markTouched();
  }

  markTouched(): void {
    this.onTouched();
    this.focused = false;
    this.emitStateChanges();
  }

  writeValue(value: number | null | undefined): void {
    this.setValue(value ?? this.minValue(), false);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
    this.emitStateChanges();
  }

  private setValueFromPointer(event: PointerEvent): void {
    const rect = this.host.nativeElement.getBoundingClientRect();
    if (rect.width <= 0) return;

    const ratio = (event.clientX - rect.left) / rect.width;
    const value = this.minValue() + ratio * (this.maxValue() - this.minValue());
    this.setValue(value, true);
  }

  private setValue(value: number, emit: boolean): void {
    const nextValue = this.normalizeValue(value);
    if (this.valueSignal() === nextValue) return;

    this.valueSignal.set(nextValue);
    this.emitStateChanges();
    if (!emit) return;
    this.onChange(nextValue);
    this.valueChange.emit(nextValue);
  }

  private normalizeValue(value: number): number {
    const min = this.minValue();
    const max = this.maxValue();
    const step = this.normalizedStep();
    const clamped = Math.min(Math.max(value, min), max);
    const stepped = Math.round((clamped - min) / step) * step + min;
    return Number(Math.min(Math.max(stepped, min), max).toFixed(5));
  }

  private normalizedStep(): number {
    const step = this.step();
    return Number.isFinite(step) && step > 0 ? step : 1;
  }

  private emitStateChanges(): void {
    this.stateVersion.update((v) => v + 1);
    this.stateChangesSubject.next();
  }
}

class SliderFieldControlAdapter implements SanringFieldControl<number> {
  readonly controlType = FieldType.slider;

  constructor(private readonly host: SliderComponent) {}

  get id(): string {
    return this.host.id();
  }

  get value(): number {
    return this.host.fieldValue;
  }

  // 滑桿一定有一個數值，不存在「空值」的狀態
  get empty(): boolean {
    return false;
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
