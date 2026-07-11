import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';
import { LucideCheck, LucideMinus } from '@lucide/angular';
import { Observable, Subject } from 'rxjs';
import { cn } from '../../utils';
import {
  CHECKBOX_ICON_SIZE_CLASSES,
  CHECKBOX_SIZE_CLASSES,
  CHECKBOX_STATE_CLASS,
  SELECTION_CONTROL_BASE_CLASS,
  SELECTION_CONTROL_FOCUS_CLASS,
} from '../component-styles';
import { FieldType, SanringFieldControl, SANRING_FIELD_CONTROL } from '../field/field.type';
import { CheckedState, CheckboxSize } from './checkbox.types';

let nextUniqueId = 0;

@Component({
  selector: 'sanring-checkbox',
  standalone: true,
  imports: [LucideCheck, LucideMinus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
    // 不能用 useExisting 直接把 CheckboxComponent 當 SanringFieldControl：介面要求的
    // id/disabled/value/required 跟元件既有的同名 @Input 衝突（且此 repo 的 eslint 規則
    // 禁止用 alias 改名 @Input），所以改用 useFactory 產生一個轉接的 adapter 物件。
    {
      provide: SANRING_FIELD_CONTROL,
      useFactory: (host: CheckboxComponent) => new CheckboxFieldControlAdapter(host),
      deps: [forwardRef(() => CheckboxComponent)],
    },
  ],
  template: `
    <button
      #btn
      type="button"
      role="checkbox"
      [id]="id()"
      [attr.name]="name()"
      [attr.value]="value()"
      [attr.aria-checked]="checkedSignal() === 'indeterminate' ? 'mixed' : checkedSignal()"
      [attr.aria-required]="required()"
      [attr.aria-invalid]="errorState ? 'true' : null"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledBy()"
      [attr.aria-describedby]="computedAriaDescribedBy()"
      [attr.data-state]="getState()"
      [attr.tabindex]="isDisabled() ? -1 : tabIndex()"
      [disabled]="isDisabled()"
      [class]="checkboxClass()"
      (click)="toggle()"
      (focus)="onFocus()"
      (blur)="onBlur()"
      (keydown.enter)="$event.preventDefault()"
    >
      @if (checkedSignal() === true) {
        <span class="flex items-center justify-center text-current animate-in zoom-in-50">
          <svg lucideCheck [class]="iconSizeClass()"></svg>
        </span>
      }

      @if (checkedSignal() === 'indeterminate') {
        <span class="flex items-center justify-center text-current animate-in zoom-in-50">
          <svg lucideMinus [class]="iconSizeClass()"></svg>
        </span>
      }
    </button>
  `,
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {
  readonly class = input<string | undefined>();
  readonly id = input(`sanring-checkbox-${nextUniqueId++}`);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string | undefined>();
  readonly value = input<string | undefined>();
  readonly required = input(false, { transform: booleanAttribute });
  readonly tabIndex = input(0);
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();
  readonly size = input<CheckboxSize>('md');
  readonly checked = input<CheckedState>(false);

  readonly checkedChange = output<CheckedState>();

  protected checkedSignal = signal<CheckedState>(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.disabledState());
  protected readonly iconSizeClass = computed(
    () => CHECKBOX_ICON_SIZE_CLASSES[this.size()] ?? CHECKBOX_ICON_SIZE_CLASSES['md'],
  );
  protected readonly checkboxClass = computed(() =>
    cn(
      SELECTION_CONTROL_BASE_CLASS,
      SELECTION_CONTROL_FOCUS_CLASS,
      'rounded-[var(--sanring-radius-xs)] border border-primary',
      CHECKBOX_SIZE_CLASSES[this.size()] ?? CHECKBOX_SIZE_CLASSES['md'],
      CHECKBOX_STATE_CLASS,
      // 讀 this.errorState（getter）而不是直接寫條件，是為了讓下面 stateVersion 的橋接生效，
      // 否則 ngControl.invalid/touched 不是 signal，這個 computed 不會在驗證狀態改變時重算
      this.errorState && 'border-red-500 focus-visible:ring-red-500',
      this.class(),
    ),
  );

  // ==========================================
  // Field 整合：底下這些成員都不會跟上面的 @Input 撞名，可以直接放在元件本身；
  // 真正會撞名的 (id/disabled/value/required) 走下面的 fieldXxx getter，由
  // CheckboxFieldControlAdapter 轉接成 SanringFieldControl 介面。
  // ==========================================
  readonly controlType = FieldType.checkbox;
  focused = false;
  ngControl: NgControl | null = null;

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('btn') private btnRef!: ElementRef<HTMLButtonElement>;

  private readonly stateChangesSubject = new Subject<void>();
  readonly stateChanges = this.stateChangesSubject.asObservable();

  // 橋接用：ngControl 的 invalid/touched 是 RxJS 驅動、不是 signal，靠這個計數器把它們
  // 接進 signal graph，errorState/fieldRequired 才能讓上面的 checkboxClass computed 正確重算
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

  get fieldValue(): CheckedState | null {
    return this.checkedSignal();
  }

  get fieldEmpty(): boolean {
    return !this.checkedSignal();
  }

  get fieldDisabled(): boolean {
    return this.isDisabled();
  }

  get fieldRequired(): boolean {
    this.stateVersion();
    return this.required() || !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  private readonly disabledState = signal(false);
  private onChange: (value: CheckedState) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this.checkedSignal.set(this.checked());
    });

    this.destroyRef.onDestroy(() => this.stateChangesSubject.complete());
  }

  ngOnInit(): void {
    // 不能像 input/textarea 直接用 `inject(NgControl, { optional: true, self: true })` field
    // initializer：本元件同時透過 NG_VALUE_ACCESSOR (forwardRef) 註冊自己，若在 constructor
    // 階段就 self-inject NgControl，跟 NgModel 搭配時會觸發 NG0200 循環依賴（NgModel 建構時
    // 需要先解出 value accessor 也就是自己，自己建構時又反過來要拿同一個還沒建構完的 NgModel）。
    // 延後到 ngOnInit 拿，因為 Angular 會先讓同一個節點上的所有 directive 建構完才跑 lifecycle hook。
    this.ngControl = this.injector.get(NgControl, null, { optional: true, self: true });

    // OnPush 元件被跳過 CD 時 ngDoCheck 不會執行，所以不能像 input/textarea 靠輪詢偵測
    // ngControl 狀態變化。不能只聽 statusChanges——那個 Observable 只在 valid/invalid/
    // pending/disabled 這幾種 status 真的變動時才會 emit，markAsTouched() 純粹改 touched
    // flag，不會觸發它，導致外部呼叫 markAllAsTouched() 時錯誤訊息不會跳出來。改聽
    // control.events（Angular v18+ 公開 API），touched/pristine/status/value 任何一種
    // 變化都會經過這裡。
    this.ngControl?.control?.events
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitStateChanges());
  }

  getState(): string {
    if (this.checkedSignal() === 'indeterminate') return 'indeterminate';
    return this.checkedSignal() ? 'checked' : 'unchecked';
  }

  toggle() {
    if (this.isDisabled()) return;
    this.checkedSignal.set(this.checkedSignal() === true ? false : true);
    this.onChange(this.checkedSignal());
    this.onTouched();
    this.checkedChange.emit(this.checkedSignal());
    this.emitStateChanges();
  }

  onFocus() {
    this.focused = true;
    this.emitStateChanges();
  }

  onBlur() {
    this.focused = false;
    this.onTouched();
    this.emitStateChanges();
  }

  focus(options?: FocusOptions): void {
    this.btnRef?.nativeElement.focus(options);
  }

  setDescribedByIds(ids: string[]): void {
    this.fieldDescribedByIds.set(ids);
  }

  writeValue(value: CheckedState): void {
    this.checkedSignal.set(value);
  }

  registerOnChange(fn: (value: CheckedState) => void): void {
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

class CheckboxFieldControlAdapter implements SanringFieldControl<CheckedState> {
  readonly controlType = FieldType.checkbox;

  constructor(private readonly host: CheckboxComponent) {}

  get id(): string {
    return this.host.id();
  }

  get value(): CheckedState | null {
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
