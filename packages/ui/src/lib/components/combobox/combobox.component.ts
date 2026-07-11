import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { cn, uniqueId } from '../../utils';
import { FieldType, SanringFieldControl, SANRING_FIELD_CONTROL } from '../field/field.type';
import { CollectionController } from '../shared/collection-controller';
import { ComboboxItemComponent } from './combobox-item.component';

type ComboboxValue = string | string[] | null;

@Component({
  selector: 'sanring-combobox',
  standalone: true,
  exportAs: 'sanringCombobox',
  template: `<ng-content></ng-content>`,
  host: {
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[class]': 'hostClass()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true,
    },
    // value/disabled 已經被同名 @Input (model()/input()) 佔用，跟 checkbox 一樣改用
    // useFactory 產生轉接的 adapter 物件，而不是讓 ComboboxComponent 自己 implements。
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: ComboboxComponent) => new ComboboxFieldControlAdapter(host),
      deps: [forwardRef(() => ComboboxComponent)],
    },
  ],
})
export class ComboboxComponent implements ControlValueAccessor, OnInit {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly inputId = uniqueId('sanring-combobox-input');
  readonly listId = uniqueId('sanring-combobox-list');

  // ==========================================
  // 1. 外部屬性與 Models
  // ==========================================
  readonly class = input<string | undefined>();
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly multiple = input<boolean>(false);
  readonly value = model<ComboboxValue>(null);

  // ==========================================
  // 2. 內部 UI 狀態 (Signals)
  // ==========================================
  readonly isOpen = signal<boolean>(false);
  readonly searchQuery = signal<string>('');

  private readonly items = contentChildren(ComboboxItemComponent, { descendants: true });
  private readonly collection = new CollectionController(this.items, this.injector);

  readonly activeItemId = this.collection.activeItemId;
  readonly visibleCount = this.collection.visibleCount;
  readonly inputValue = computed(() => {
    const query = this.searchQuery();
    if (this.isOpen() || query || this.multiple()) return query;

    const current = this.value();
    if (!current || Array.isArray(current)) return '';

    return this.items().find((item) => item.value() === current)?.getLabel() ?? current;
  });

  private readonly disabledState = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.disabledState());

  protected readonly hostClass = computed(() =>
    cn(
      'relative block w-full',
      this.isDisabled() && 'opacity-50 cursor-not-allowed',
      this.class(),
    ),
  );

  // ==========================================
  // Field 整合：value/disabled 已經被同名 @Input 佔用，走下面的 fieldXxx getter，
  // 由 ComboboxFieldControlAdapter 轉接成 SanringFieldControl 介面。
  // ==========================================
  readonly controlType = FieldType.input;
  focused = false;
  ngControl: NgControl | null = null;

  private readonly destroyRef = inject(DestroyRef);
  private readonly stateChangesSubject = new Subject<void>();
  readonly stateChanges: Observable<void> = this.stateChangesSubject.asObservable();
  private readonly stateVersion = signal(0);
  private readonly fieldDescribedByIds = signal<string[]>([]);

  readonly computedAriaDescribedBy = computed(() => {
    const ids = [...this.fieldDescribedByIds()].filter((v): v is string => !!v);
    return ids.length ? ids.join(' ') : undefined;
  });

  get errorState(): boolean {
    this.stateVersion();
    return !!(this.ngControl?.invalid && this.ngControl?.touched);
  }

  get fieldValue(): ComboboxValue {
    return this.value();
  }

  get fieldDisabled(): boolean {
    return this.isDisabled();
  }

  get fieldRequired(): boolean {
    this.stateVersion();
    return this.required() || !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  private onChange: (value: ComboboxValue) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this.searchQuery();
      const visible = this.collection.focusableItems();
      untracked(() => {
        if (visible.length > 0) this.collection.ensureActiveItem();
      });
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

  toggleOpen(state?: boolean) {
    if (this.isDisabled()) return;
    const newState = state ?? !this.isOpen();
    this.isOpen.set(newState);

    if (!newState) {
      this.searchQuery.set('');
    }
  }

  containsElement(target: EventTarget | null): boolean {
    return target instanceof Node && this.elementRef.nativeElement.contains(target);
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  setActiveItem(item: ComboboxItemComponent): void {
    this.collection.setActiveItem(item);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.toggleOpen(true);
      this.collection.onKeydown(event);
      return;
    }

    if (event.key === 'Enter') {
      this.collection.onKeydown(event);
    }
  }

  selectValue(newValue: string) {
    if (this.multiple()) {
      const currentValues = (this.value() as string[]) || [];
      if (currentValues.includes(newValue)) {
        this.value.set(currentValues.filter((v) => v !== newValue));
      } else {
        this.value.set([...currentValues, newValue]);
      }
    } else {
      this.value.set(newValue);
      this.toggleOpen(false);
    }
    this.onChange(this.value());
    this.onTouched();
    this.emitStateChanges();
  }

  removeValue(valueToRemove: string) {
    if (!this.multiple()) return;
    const currentValues = (this.value() as string[]) || [];
    this.value.set(currentValues.filter((v) => v !== valueToRemove));
    this.onChange(this.value());
    this.onTouched();
    this.emitStateChanges();
  }

  isSelected(val: string): boolean {
    const current = this.value();
    if (this.multiple()) {
      return Array.isArray(current) && current.includes(val);
    }
    return current === val;
  }

  hasValue(): boolean {
    const current = this.value();
    if (Array.isArray(current)) return current.length > 0;
    return current !== null && current !== '';
  }

  clear(): void {
    this.value.set(this.multiple() ? [] : null);
    this.searchQuery.set('');
    this.onChange(this.value());
    this.onTouched();
    this.emitStateChanges();
  }

  onFocus(): void {
    this.focused = true;
    this.emitStateChanges();
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
    this.emitStateChanges();
  }

  // 不管目前顯示的是純文字 input 還是 trigger 按鈕，實際可 focus 的元素一定在 host 底下，
  // 直接查詢就不用讓每個變體 (input / chip-input / trigger) 各自反過來註冊一次 ElementRef
  focus(options?: FocusOptions): void {
    this.elementRef.nativeElement.querySelector<HTMLElement>('input, [role="combobox"]')?.focus(options);
  }

  setDescribedByIds(ids: string[]): void {
    this.fieldDescribedByIds.set(ids);
  }

  // --- ControlValueAccessor 介面實作 ---
  writeValue(value: ComboboxValue): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: ComboboxValue) => void): void {
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

class ComboboxFieldControlAdapter implements SanringFieldControl<ComboboxValue> {
  readonly controlType = FieldType.input;

  constructor(private readonly host: ComboboxComponent) {}

  get id(): string {
    return this.host.inputId;
  }

  get value(): ComboboxValue {
    return this.host.fieldValue;
  }

  get empty(): boolean {
    return !this.host.hasValue();
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
