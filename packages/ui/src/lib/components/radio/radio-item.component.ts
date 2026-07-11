import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { LucideCircle } from '@lucide/angular';
import { cn } from '../../utils';
import {
  RADIO_INDICATOR_ICON_CLASS,
  RADIO_SIZE_CLASS,
  SELECTION_CONTROL_BASE_CLASS,
  SELECTION_CONTROL_FOCUS_CLASS,
} from '../component-styles';
import { RadioGroupComponent } from './radio-group.component';
import { RadioValue } from './radio.types';

let nextUniqueId = 0;

@Component({
  selector: 'sanring-radio-item',
  standalone: true,
  imports: [LucideCircle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      #btn
      type="button"
      role="radio"
      [id]="id()"
      [attr.name]="group?.name()"
      [attr.aria-checked]="isChecked()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledBy()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.data-state]="isChecked() ? 'checked' : 'unchecked'"
      [attr.data-disabled]="isDisabled() || null"
      [attr.tabindex]="tabIndex()"
      [disabled]="isDisabled()"
      [class]="itemClass()"
      (click)="select()"
      (focus)="onFocus()"
      (keydown.space)="onSpace($event)"
      (keydown.enter)="$event.preventDefault()"
    >
      @if (isChecked()) {
        <span class="flex items-center justify-center text-current animate-in zoom-in-50">
          <svg lucideCircle [class]="radioIndicatorIconClass"></svg>
        </span>
      }
    </button>
  `,
})
export class RadioItemComponent {
  protected readonly radioIndicatorIconClass = RADIO_INDICATOR_ICON_CLASS;

  readonly class = input<string | undefined>();
  readonly id = input(`sanring-radio-${nextUniqueId++}`);
  readonly value = input.required<RadioValue>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();

  @ViewChild('btn') private btnRef!: ElementRef<HTMLButtonElement>;

  protected readonly group = inject(RadioGroupComponent, { optional: true });

  protected isChecked = computed(() => this.group?.valueSignal() === this.value());
  protected isDisabled = computed(() => this.disabled() || (this.group?.isDisabled() ?? false));
  protected tabIndex = computed(() => {
    if (!this.group) return 0;
    return this.group.activeTabItem() === this ? 0 : -1;
  });
  protected readonly itemClass = computed(() =>
    cn(
      SELECTION_CONTROL_BASE_CLASS,
      SELECTION_CONTROL_FOCUS_CLASS,
      RADIO_SIZE_CLASS,
      'rounded-full border border-primary text-primary',
      'data-[state=checked]:border-primary',
      this.class(),
    ),
  );

  select(): void {
    if (this.isDisabled()) return;
    this.group?.updateValue(this.value());
  }

  focusAndSelect(): void {
    this.btnRef?.nativeElement.focus();
    this.select();
  }

  focusOnly(options?: FocusOptions): void {
    this.btnRef?.nativeElement.focus(options);
  }

  onFocus(): void {
    this.group?.setFocusedItem(this);
  }

  protected onSpace(event: Event): void {
    event.preventDefault();
    this.select();
  }
}
