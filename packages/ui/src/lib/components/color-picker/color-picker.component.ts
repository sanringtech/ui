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
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils';
import { SELECTION_CONTROL_FOCUS_CLASS } from '../component-styles';
import { FieldType, SANRING_FIELD_CONTROL } from '../field/field.type';
import { InputDirective } from '../input/input.directive';
import { PopoverComponent } from '../popover/popover.component';
import { PopoverContentComponent } from '../popover/popover-content.component';
import { PopoverTriggerDirective } from '../popover/popover-trigger.directive';
import { SanringCvaBase, SanringFieldControlAdapter } from '../shared/cva-base';
import { DEFAULT_COLOR_HEX, isFullHex, normalizeHex, toNativeColor } from './color-picker.util';

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
          class="size-5 shrink-0 rounded-[var(--sanring-radius-xs)] border border-[var(--sanring-border)]"
          [style.background-color]="colorSignal()"
          aria-hidden="true"
        ></span>
        <span class="font-mono text-sm lowercase">{{ colorSignal() }}</span>
      </button>

      <sanring-popover-content class="w-56 p-3" [ariaLabel]="panelAriaLabel()">
        <div class="grid gap-3">
          <input
            type="color"
            class="h-24 w-full cursor-pointer rounded-[var(--sanring-radius)] border border-[var(--sanring-border)] bg-transparent p-1 disabled:cursor-not-allowed disabled:opacity-50"
            [value]="colorSignal()"
            [disabled]="isDisabled()"
            [attr.aria-label]="colorInputLabel()"
            (input)="onNativeInput($event)"
          />

          <input
            sanringInput
            class="font-mono lowercase"
            [value]="hexDraft()"
            [disabled]="isDisabled()"
            [attr.aria-label]="hexInputLabel()"
            (input)="onHexInput($event)"
            (blur)="onHexBlur($event)"
          />

          @if (resolvedSwatches().length) {
            <div class="flex flex-wrap gap-1.5">
              @for (swatch of resolvedSwatches(); track swatch) {
                <button
                  type="button"
                  [class]="swatchClass(swatch)"
                  [style.background-color]="swatch"
                  [disabled]="isDisabled()"
                  [attr.aria-label]="swatch"
                  [attr.aria-pressed]="swatch === colorSignal()"
                  (click)="onSwatchSelect(swatch)"
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
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly swatches = input<readonly string[]>([]);
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();
  readonly colorInputLabel = input('Color');
  readonly hexInputLabel = input('Hex');

  readonly valueChange = output<string>();

  protected readonly colorSignal = signal(DEFAULT_COLOR_HEX);
  protected readonly hexDraft = signal(DEFAULT_COLOR_HEX);
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledState());
  protected readonly resolvedSwatches = computed(() => {
    const seen = new Set<string>();
    const next: string[] = [];
    for (const swatch of this.swatches()) {
      const hex = normalizeHex(swatch);
      if (!hex || seen.has(hex)) continue;
      seen.add(hex);
      next.push(hex);
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

  protected swatchClass(swatch: string): string {
    return cn(
      'size-6 rounded-[var(--sanring-radius-xs)] border border-[var(--sanring-border)] disabled:cursor-not-allowed disabled:opacity-50',
      swatch === this.colorSignal() && 'ring-2 ring-[var(--sanring-border-strong)]',
    );
  }

  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  constructor() {
    super();
    effect(() => {
      const raw = this.value();
      if (raw === undefined) return;
      const next = toNativeColor(raw);
      untracked(() => this.commitColor(next, false));
    });
  }

  get fieldValue(): string {
    return this.colorSignal();
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
    this.commitColor(toNativeColor(value), false);
  }

  protected onNativeInput(event: Event): void {
    if (this.isDisabled()) return;
    this.commitColor((event.target as HTMLInputElement).value, true);
  }

  protected onHexInput(event: Event): void {
    if (this.isDisabled()) return;
    const raw = (event.target as HTMLInputElement).value;
    this.hexDraft.set(raw);
    if (isFullHex(raw)) this.commitColor(raw, true, false);
  }

  protected onHexBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const next = normalizeHex(input.value);
    if (next) {
      this.commitColor(next, true);
    } else {
      this.hexDraft.set(this.colorSignal());
    }
    input.value = this.colorSignal();
  }

  protected onSwatchSelect(swatch: string): void {
    if (this.isDisabled()) return;
    this.commitColor(swatch, true);
  }

  private commitColor(value: string, emit: boolean, syncDraft = true): void {
    const next = toNativeColor(value);
    if (syncDraft) this.hexDraft.set(next);
    if (this.colorSignal() === next) return;

    this.colorSignal.set(next);
    this.emitStateChanges();
    if (!emit) return;
    this.onChange(next);
    this.valueChange.emit(next);
  }
}
