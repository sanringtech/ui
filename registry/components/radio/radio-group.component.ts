import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { cn } from '../shared/utils';
import { SanringCvaBase, SanringFieldControlAdapter } from '../shared/cva-base';
import { FieldType, SANRING_FIELD_CONTROL } from '../field/field.type';
import { RadioOrientation, RadioValue } from './radio.types';
import { RadioItemComponent } from './radio-item.component';

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
    // 跟 checkbox 一樣：value/required/disabled 已經被同名 @Input 佔用，且這個 repo 的
    // eslint 規則禁止用 alias 改名，所以改用 useFactory 產生轉接的 adapter 物件。
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: RadioGroupComponent) =>
        new SanringFieldControlAdapter(FieldType.radioGroup, host),
      deps: [forwardRef(() => RadioGroupComponent)],
    },
  ],
  template: `
    <div
      [id]="id()"
      role="radiogroup"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledBy()"
      [attr.aria-describedby]="computedAriaDescribedBy()"
      [attr.aria-required]="fieldRequired ? 'true' : null"
      [attr.aria-invalid]="errorState ? 'true' : null"
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
export class RadioGroupComponent extends SanringCvaBase<RadioValue | null> {
  readonly class = input<string | undefined>();
  readonly id = input(inject(_IdGenerator).getId('sanring-radio-group-', true));
  readonly name = input(inject(_IdGenerator).getId('sanring-radio-group-', true));
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
  private _focusedItem: RadioItemComponent | null = null;

  readonly activeTabItem = computed(() => {
    const items = this._items().filter((i) => !i.disabled());
    return items.find((i) => i.value() === this.valueSignal()) ?? items[0] ?? null;
  });

  protected readonly computedAriaDescribedBy = this.makeComputedAriaDescribedBy(
    this.ariaDescribedBy,
  );

  get fieldValue(): RadioValue | null {
    return this.valueSignal();
  }

  get fieldEmpty(): boolean {
    return this.valueSignal() === null;
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
      this.valueSignal.set(this.value());
    });
  }

  setFocusedItem(item: RadioItemComponent): void {
    this._focusedItem = item;
    this.focused = true;
    this.emitStateChanges();
  }

  focus(options?: FocusOptions): void {
    (this.activeTabItem() ?? this._items()[0])?.focusOnly(options);
  }

  updateValue(newValue: RadioValue): void {
    if (this.isDisabled()) return;
    this.valueSignal.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.valueChange.emit(newValue);
    this.emitStateChanges();
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this._items().filter((i) => !i.disabled());
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
      this.focused = false;
      this.emitStateChanges();
    }
  }

  override writeValue(val: RadioValue | null): void {
    this.valueSignal.set(val);
  }
}
