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
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../shared/utils';
import { SELECTION_CONTROL_FOCUS_CLASS } from '../shared/component-styles';
import { FieldType, SANRING_FIELD_CONTROL } from '../field/field.type';
import { InputDirective } from '../input/input.directive';
import { PopoverComponent } from '../popover/popover.component';
import { PopoverContentComponent } from '../popover/popover-content.component';
import { PopoverTriggerDirective } from '../popover/popover-trigger.directive';
import { SanringCvaBase, SanringFieldControlAdapter } from '../shared/cva-base';
import {
  COLOR_FORMATS,
  type ColorFormat,
  DEFAULT_COLOR,
  type Rgba,
  formatColor,
  isCompleteColorInput,
  parseColor,
  rgbaEqual,
  toNativeHex,
  toPreviewCss,
} from './color-picker.util';

@Component({
  selector: 'sanring-color-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputDirective, PopoverComponent, PopoverContentComponent, PopoverTriggerDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: ColorPickerComponent) =>
        new SanringFieldControlAdapter(FieldType.colorPicker, host),
      deps: [forwardRef(() => ColorPickerComponent)],
    },
  ],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <sanring-popover class="contents">
      <button
        #trigger
        type="button"
        sanringPopoverTrigger
        [id]="id()"
        [disabled]="isDisabled()"
        [class]="triggerClass()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-labelledby]="ariaLabelledBy()"
        [attr.aria-describedby]="computedAriaDescribedBy()"
        [attr.aria-invalid]="invalid() || errorState ? 'true' : null"
        [attr.aria-required]="fieldRequired ? 'true' : null"
        (focus)="onFocus()"
        (blur)="onBlur()"
      >
        <span
          class="relative size-5 shrink-0 overflow-hidden rounded-[var(--sanring-radius-xs)] border border-[var(--sanring-border)] bg-white"
          aria-hidden="true"
        >
          <span
            class="absolute inset-0 bg-[length:8px_8px] bg-[repeating-conic-gradient(#d4d4d4_0_25%,#fff_0_50%)]"
          ></span>
          <span class="absolute inset-0" [style.background-color]="previewCss()"></span>
        </span>
        <span class="max-w-48 truncate font-mono text-sm">{{ formattedValue() }}</span>
      </button>

      <sanring-popover-content class="w-72 p-3" [ariaLabel]="panelAriaLabel()">
        <div class="grid gap-3">
          <div
            class="grid grid-cols-3 gap-1"
            role="group"
            [attr.aria-label]="formatGroupLabel()"
          >
            @for (item of formats; track item) {
              <button
                type="button"
                [class]="formatClass(item)"
                [disabled]="isDisabled()"
                [attr.aria-pressed]="format() === item"
                (click)="onFormatSelect(item)"
              >
                {{ item }}
              </button>
            }
          </div>

          <input
            type="color"
            class="h-24 w-full cursor-pointer rounded-[var(--sanring-radius)] border border-[var(--sanring-border)] bg-transparent p-1 disabled:cursor-not-allowed disabled:opacity-50"
            [value]="nativeHex()"
            [disabled]="isDisabled()"
            [attr.aria-label]="colorInputLabel()"
            (input)="onNativeInput($event)"
          />

          <label class="grid gap-1.5">
            <span class="text-xs text-[var(--sanring-muted)]">{{ alphaInputLabel() }}</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              class="w-full accent-[var(--sanring-foreground)] disabled:cursor-not-allowed disabled:opacity-50"
              [value]="alphaPercent()"
              [disabled]="isDisabled()"
              [attr.aria-valuetext]="alphaPercent() + '%'"
              (input)="onAlphaInput($event)"
            />
          </label>

          <input
            sanringInput
            class="font-mono"
            [value]="draft()"
            [disabled]="isDisabled()"
            [attr.aria-label]="resolvedValueLabel()"
            (input)="onValueInput($event)"
            (blur)="onValueBlur($event)"
          />

          @if (resolvedSwatches().length) {
            <div class="flex flex-wrap gap-1.5">
              @for (swatch of resolvedSwatches(); track trackSwatch($index, swatch)) {
                <button
                  type="button"
                  [class]="swatchClass(swatch.color)"
                  [style.background-color]="toPreviewCss(swatch.color)"
                  [disabled]="isDisabled()"
                  [attr.aria-label]="swatch.label"
                  [attr.aria-pressed]="rgbaEqual(swatch.color, rgbaSignal())"
                  (click)="onSwatchSelect(swatch.color)"
                ></button>
              }
            </div>
          }
        </div>
      </sanring-popover-content>
    </sanring-popover>
  `,
})
export class ColorPickerComponent extends SanringCvaBase<string> {
  readonly class = input<string | undefined>();
  readonly id = input(inject(_IdGenerator).getId('sanring-color-picker-', true));
  readonly value = input<string | undefined>();
  readonly format = model<ColorFormat>('hex');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly swatches = input<readonly string[]>([]);
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();
  readonly colorInputLabel = input('Color');
  readonly valueInputLabel = input('Color value');
  readonly hexInputLabel = input<string | undefined>();
  readonly alphaInputLabel = input('Alpha');
  readonly formatGroupLabel = input('Color format');

  readonly valueChange = output<string>();

  protected readonly formats = COLOR_FORMATS;
  protected readonly rgbaEqual = rgbaEqual;
  protected readonly toPreviewCss = toPreviewCss;
  protected readonly rgbaSignal = signal<Rgba>({ ...DEFAULT_COLOR });
  protected readonly draft = signal(formatColor(DEFAULT_COLOR, 'hex'));
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledState());
  protected readonly formattedValue = computed(() => formatColor(this.rgbaSignal(), this.format()));
  protected readonly nativeHex = computed(() => toNativeHex(this.rgbaSignal()));
  protected readonly previewCss = computed(() => toPreviewCss(this.rgbaSignal()));
  protected readonly alphaPercent = computed(() => Math.round(this.rgbaSignal().a * 100));
  protected readonly resolvedSwatches = computed(() => {
    const seen = new Set<string>();
    const next: { color: Rgba; label: string }[] = [];
    for (const swatch of this.swatches()) {
      const color = parseColor(swatch);
      if (!color) continue;
      const key = formatColor(color, 'hex');
      if (seen.has(key)) continue;
      seen.add(key);
      next.push({ color, label: swatch });
    }
    return next;
  });
  protected readonly hostClass = computed(() => cn('inline-flex', this.class()));
  protected readonly triggerClass = computed(() =>
    cn(
      'inline-flex items-center gap-2 rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)] bg-[var(--sanring-surface)] px-2.5 py-1.5 text-[var(--sanring-foreground)]',
      SELECTION_CONTROL_FOCUS_CLASS,
      this.isDisabled() && 'cursor-not-allowed opacity-50',
      (this.invalid() || this.errorState) &&
        'border-[var(--sanring-error-50)] focus-visible:ring-[var(--sanring-error-40)]',
    ),
  );
  protected readonly panelAriaLabel = computed(() => this.ariaLabel() ?? 'Color picker');
  protected readonly computedAriaDescribedBy = this.makeComputedAriaDescribedBy(
    this.ariaDescribedBy,
  );
  protected readonly resolvedValueLabel = computed(
    () => this.hexInputLabel() ?? this.valueInputLabel(),
  );

  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  constructor() {
    super();
    effect(() => {
      const raw = this.value();
      if (raw === undefined) return;
      const next = parseColor(raw);
      if (!next) return;
      untracked(() => this.commitColor(next, false));
    });
    effect(() => {
      const formatted = formatColor(this.rgbaSignal(), this.format());
      untracked(() => this.draft.set(formatted));
    });
  }

  get fieldValue(): string {
    return this.formattedValue();
  }

  get fieldEmpty(): boolean {
    return false;
  }

  get fieldDisabled(): boolean {
    return this.isDisabled();
  }

  protected override hasInputRequired(): boolean {
    return this.required();
  }

  focus(options?: FocusOptions): void {
    this.triggerRef()?.nativeElement.focus(options);
  }

  override writeValue(value: string | null | undefined): void {
    const next = parseColor(value);
    this.commitColor(next ?? DEFAULT_COLOR, false);
  }

  protected formatClass(item: ColorFormat): string {
    return cn(
      'rounded-[var(--sanring-radius-xs)] px-2 py-1 text-xs font-medium uppercase',
      SELECTION_CONTROL_FOCUS_CLASS,
      this.format() === item
        ? 'bg-[var(--sanring-foreground)] text-[var(--sanring-background)]'
        : 'text-[var(--sanring-muted)] hover:bg-[var(--sanring-surface)]',
    );
  }

  protected swatchClass(color: Rgba): string {
    return cn(
      'size-6 rounded-[var(--sanring-radius-xs)] border border-[var(--sanring-border)] disabled:cursor-not-allowed disabled:opacity-50',
      rgbaEqual(color, this.rgbaSignal()) && 'ring-2 ring-[var(--sanring-border-strong)]',
    );
  }

  protected trackSwatch(index: number, swatch: { color: Rgba; label: string }): string {
    return `${index}-${formatColor(swatch.color, 'hex')}`;
  }

  protected onFormatSelect(next: ColorFormat): void {
    if (this.isDisabled() || this.format() === next) return;
    this.format.set(next);
    const formatted = formatColor(this.rgbaSignal(), next);
    this.draft.set(formatted);
    this.emitStateChanges();
    this.onChange(formatted);
    this.valueChange.emit(formatted);
  }

  protected onNativeInput(event: Event): void {
    if (this.isDisabled()) return;
    const parsed = parseColor((event.target as HTMLInputElement).value);
    if (!parsed) return;
    this.commitColor({ ...parsed, a: this.rgbaSignal().a }, true);
  }

  protected onAlphaInput(event: Event): void {
    if (this.isDisabled()) return;
    const percent = Number.parseFloat((event.target as HTMLInputElement).value);
    this.commitColor({ ...this.rgbaSignal(), a: percent / 100 }, true);
  }

  protected onValueInput(event: Event): void {
    if (this.isDisabled()) return;
    const raw = (event.target as HTMLInputElement).value;
    this.draft.set(raw);
    if (!isCompleteColorInput(raw)) return;
    const next = parseColor(raw);
    if (next) this.commitColor(next, true, false);
  }

  protected onValueBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const next = parseColor(input.value);
    if (next) this.commitColor(next, true);
    else this.draft.set(this.formattedValue());
    input.value = this.formattedValue();
  }

  protected onSwatchSelect(color: Rgba): void {
    if (this.isDisabled()) return;
    this.commitColor(color, true);
  }

  private commitColor(color: Rgba, emit: boolean, syncDraft = true): void {
    const next = {
      r: color.r,
      g: color.g,
      b: color.b,
      a: color.a,
    };
    const formatted = formatColor(next, this.format());
    if (syncDraft) this.draft.set(formatted);
    if (rgbaEqual(this.rgbaSignal(), next) && this.formattedValue() === formatted) return;

    this.rgbaSignal.set(next);
    this.emitStateChanges();
    if (!emit) return;
    this.onChange(formatted);
    this.valueChange.emit(formatted);
  }
}
