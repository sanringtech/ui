import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  OnInit,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { cn } from '../../utils';
import { FieldType, SanringFieldControl, SANRING_FIELD_CONTROL } from '../field/field.type';
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
    // 跟 checkbox 一樣：value/required/disabled 已經被同名 @Input 佔用，且這個 repo 的
    // eslint 規則禁止用 alias 改名，所以改用 useFactory 產生轉接的 adapter 物件。
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: RadioGroupComponent) => new RadioGroupFieldControlAdapter(host),
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
      [attr.aria-required]="required() || null"
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
export class RadioGroupComponent implements ControlValueAccessor, OnInit {
  readonly class = input<string | undefined>();
  readonly id = input(`sanring-radio-group-${nextGroupId++}`);
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

  // ==========================================
  // Field 整合：controlType/focused/ngControl/stateChanges 不會撞名，直接放元件本身；
  // value/required/disabled 走下面的 fieldXxx getter，由 RadioGroupFieldControlAdapter 轉接。
  // ==========================================
  readonly controlType = FieldType.radioGroup;
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

  get fieldValue(): RadioValue | null {
    return this.valueSignal();
  }

  get fieldEmpty(): boolean {
    return this.valueSignal() === null;
  }

  get fieldDisabled(): boolean {
    return this.isDisabled();
  }

  get fieldRequired(): boolean {
    this.stateVersion();
    return this.required() || !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  constructor() {
    effect(() => {
      this.valueSignal.set(this.value());
    });

    this.destroyRef.onDestroy(() => this.stateChangesSubject.complete());
  }

  ngOnInit(): void {
    // 跟 checkbox 一樣的原因：constructor 階段 self-inject NgControl 會跟 NgModel 搭配時
    // 觸發 NG0200 循環依賴，延後到 ngOnInit 才拿。
    this.ngControl = this.injector.get(NgControl, null, { optional: true, self: true });
    // 不能只聽 statusChanges——那個 Observable 只在 valid/invalid/pending/disabled 這幾種
    // status 真的變動時才會 emit，markAsTouched() 純粹改 touched flag，不會觸發它，導致
    // 外部呼叫 markAllAsTouched() 時錯誤訊息不會跳出來。改聽 control.events（Angular v18+
    // 公開 API），touched/pristine/status/value 任何一種變化都會經過這裡。
    this.ngControl?.control?.events
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitStateChanges());
  }

  setFocusedItem(item: RadioItemComponent): void {
    this._focusedItem = item;
    this.focused = true;
    this.emitStateChanges();
  }

  focus(options?: FocusOptions): void {
    (this.activeTabItem() ?? this._items()[0])?.focusOnly(options);
  }

  setDescribedByIds(ids: string[]): void {
    this.fieldDescribedByIds.set(ids);
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
      this.focused = false;
      this.emitStateChanges();
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
    this.emitStateChanges();
  }

  private emitStateChanges(): void {
    this.stateVersion.update((v) => v + 1);
    this.stateChangesSubject.next();
  }
}

class RadioGroupFieldControlAdapter implements SanringFieldControl<RadioValue> {
  readonly controlType = FieldType.radioGroup;

  constructor(private readonly host: RadioGroupComponent) {}

  get id(): string {
    return this.host.id();
  }

  get value(): RadioValue | null {
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
