import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../shared/utils';
import { RadioOrientation, RadioValue } from './radio.types';
import { RadioItemComponent } from './radio-item.component';

let nextGroupId = 0;

@Component({
  selector: 'sanring-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
  template: `
    <div
      role="radiogroup"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledBy()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.aria-required]="required() || null"
      [attr.aria-disabled]="isDisabled() || null"
      [attr.aria-orientation]="orientation()"
      [attr.data-orientation]="orientation()"
      [attr.data-disabled]="isDisabled() || null"
      [class]="groupClass()"
      tabindex="-1"
      (keydown)="onKeydown($event)"
      (focusout)="onFocusOut($event)"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class RadioGroupComponent implements ControlValueAccessor {
  readonly class = input<string | undefined>();
  readonly name = input(`sanring-radio-group-${nextGroupId++}`);
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<RadioOrientation>(RadioOrientation.Vertical);
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();
  readonly value = input<RadioValue | null>(null);

  readonly valueChange = output<RadioValue | null>();

  readonly valueSignal = signal<RadioValue | null>(null);
  readonly isDisabled = computed(() => this.disabled() || this.disabledState());
  protected readonly groupClass = computed(() =>
    cn(
      this.orientation() === RadioOrientation.Horizontal ? 'flex flex-row gap-4' : 'grid gap-2',
      this.class(),
    ),
  );

  private readonly _items = contentChildren(RadioItemComponent, { descendants: true });
  private readonly disabledState = signal(false);
  private _focusedItem: RadioItemComponent | null = null;

  readonly activeTabItem = computed(() => {
    const items = this._items().filter(i => !i.disabled());
    return items.find(i => i.value() === this.valueSignal()) ?? items[0] ?? null;
  });

  constructor() {
    effect(() => {
      this.valueSignal.set(this.value());
    });
  }

  setFocusedItem(item: RadioItemComponent): void {
    this._focusedItem = item;
  }

  updateValue(newValue: RadioValue): void {
    if (this.isDisabled()) return;
    this.valueSignal.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.valueChange.emit(newValue);
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this._items().filter(i => !i.disabled());
    if (items.length === 0) return;

    const currentIndex = this._focusedItem ? items.indexOf(this._focusedItem) : -1;
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = items.length - 1;
        break;
    }

    if (nextIndex !== null) {
      items[nextIndex].focusAndSelect();
    }
  }

  onFocusOut(event: FocusEvent): void {
    const related = event.relatedTarget as Element | null;
    if (!(event.currentTarget as Element).contains(related)) {
      this.onTouched();
    }
  }

  private onChange: (value: RadioValue | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: RadioValue | null): void {
    this.valueSignal.set(val);
  }

  registerOnChange(fn: (value: RadioValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }
}
