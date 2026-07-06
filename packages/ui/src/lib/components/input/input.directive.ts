import { Directive, ElementRef, computed, inject, input, DoCheck, OnDestroy } from '@angular/core';
import { cn } from '../../utils';
import { FIELD_SIZE_CLASS } from '../component-styles';
import { Subject } from 'rxjs';
import { NgControl } from '@angular/forms';
import { FieldType, SanringFieldControl, SANRING_FIELD_CONTROL } from '../field/field.type';

let nextUniqueId = 0;

@Directive({
  selector: 'input[sanringInput]',
  standalone: true,
  providers: [{ provide: SANRING_FIELD_CONTROL, useExisting: InputDirective }],
  host: {
    '[class]': 'inputClass()',
    '[id]': 'id',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
  },
})
export class InputDirective implements SanringFieldControl<string>, DoCheck, OnDestroy {
  readonly class = input<string>('');

  readonly stateChanges = new Subject<void>();
  readonly controlType = FieldType.input;
  focused = false;
  id = `sanring-input-${nextUniqueId++}`;

  readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly el = inject(ElementRef<HTMLInputElement>);

  protected readonly inputClass = computed(() =>
    cn(
      'peer flex h-10 w-full rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)]',
      'bg-[var(--sanring-surface)] text-[var(--sanring-foreground)]',
      FIELD_SIZE_CLASS,
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-[var(--sanring-muted)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      // 當驗證失敗時，覆蓋原有的 border 與 ring 顏色
      this.errorState && 'border-red-500 focus-visible:ring-red-500',
      this.class(),
    ),
  );

  get empty(): boolean {
    return !this.el.nativeElement.value;
  }

  get value(): string | null {
    return this.el.nativeElement.value;
  }

  // 判斷是否顯示錯誤：有 NgControl + 驗證不通過 + 已經被碰觸過 (touched)
  get errorState(): boolean {
    return !!(this.ngControl?.invalid && this.ngControl?.touched);
  }

  // 有綁定 ngControl (reactive forms) 時，disabled 狀態以 control 為準；否則看原生屬性
  get disabled(): boolean {
    return this.ngControl?.disabled ?? this.el.nativeElement.disabled;
  }

  get required(): boolean {
    return this.el.nativeElement.required;
  }

  onFocus() {
    this.focused = true;
    this.stateChanges.next();
  }

  onBlur() {
    this.focused = false;
    this.stateChanges.next();
  }

  // Angular 在某些狀態改變時（例如透過程式碼手動 markAsTouched）不會觸發 DOM 事件，
  // 透過 ngDoCheck 可以在每個變更偵測週期同步狀態給外層 Field。
  ngDoCheck() {
    if (this.ngControl) {
      this.stateChanges.next();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  focus(options?: FocusOptions): void {
    this.el.nativeElement.focus(options);
  }
}
