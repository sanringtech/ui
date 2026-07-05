import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils';
import { SELECTION_CONTROL_FOCUS_CLASS } from '../component-styles';

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
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.aria-orientation]': '"horizontal"',
    '[attr.tabindex]': 'isDisabled() ? -1 : tabIndex()',
    '[attr.data-disabled]': 'isDisabled() || null',
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
      class="pointer-events-none absolute block size-5 -translate-x-1/2 rounded-full border-2 border-[var(--sanring-foreground)] bg-[var(--sanring-background)] shadow-sm transition-[left]"
      [style.left.%]="percentage()"
    ></span>
  `,
})
export class SliderComponent implements ControlValueAccessor {
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

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly disabledState = signal(false);
  private isDragging = false;
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const value = this.value();
      this.min();
      this.max();
      this.step();
      untracked(() => this.setValue(value, false));
    });
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
    this.isDragging = true;
    this.setValueFromPointer(event);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging || this.isDisabled()) return;
    this.setValueFromPointer(event);
  }

  onPointerEnd(event: PointerEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.host.nativeElement.hasPointerCapture(event.pointerId)) {
      this.host.nativeElement.releasePointerCapture(event.pointerId);
    }
    this.markTouched();
  }

  markTouched(): void {
    this.onTouched();
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
}
