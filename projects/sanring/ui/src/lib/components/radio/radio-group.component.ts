import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  computed,
  contentChildren,
  forwardRef,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../../utils';
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
      [attr.aria-label]="ariaLabel"
      [attr.aria-labelledby]="ariaLabelledBy"
      [attr.aria-describedby]="ariaDescribedBy"
      [attr.aria-required]="required || null"
      [attr.aria-disabled]="disabled || null"
      [attr.aria-orientation]="orientation"
      [attr.data-orientation]="orientation"
      [attr.data-disabled]="disabled || null"
      [class]="groupClass"
      tabindex="-1"
      (keydown)="onKeydown($event)"
      (focusout)="onFocusOut($event)"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class RadioGroupComponent implements ControlValueAccessor {
  @Input() class = '';
  @Input() name = `sanring-radio-group-${nextGroupId++}`;
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() orientation: RadioOrientation = RadioOrientation.Vertical;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() ariaDescribedBy?: string;

  @Input() set value(v: RadioValue | null) { this.valueSignal.set(v); }
  @Output() valueChange = new EventEmitter<RadioValue | null>();

  readonly valueSignal = signal<RadioValue | null>(null);

  private readonly _items = contentChildren(RadioItemComponent, { descendants: true });
  private _focusedItem: RadioItemComponent | null = null;

  readonly activeTabItem = computed(() => {
    const items = this._items().filter(i => !i.disabled);
    return items.find(i => i.value === this.valueSignal()) ?? items[0] ?? null;
  });

  setFocusedItem(item: RadioItemComponent): void {
    this._focusedItem = item;
  }

  updateValue(newValue: RadioValue): void {
    if (this.disabled) return;
    this.valueSignal.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.valueChange.emit(newValue);
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this._items().filter(i => !i.disabled);
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
    this.disabled = isDisabled;
  }

  protected get groupClass() {
    return cn(
      this.orientation === RadioOrientation.Horizontal ? 'flex flex-row gap-4' : 'grid gap-2',
      this.class,
    );
  }
}
