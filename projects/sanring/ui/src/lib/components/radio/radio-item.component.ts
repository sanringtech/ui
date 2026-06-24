import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  booleanAttribute,
  computed,
  inject,
} from '@angular/core';
import { LucideCircle } from '@lucide/angular';
import { cn } from '../../utils';
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
      [id]="id"
      [attr.name]="group?.name"
      [attr.aria-checked]="isChecked()"
      [attr.aria-label]="ariaLabel"
      [attr.aria-labelledby]="ariaLabelledBy"
      [attr.aria-describedby]="ariaDescribedBy"
      [attr.data-state]="isChecked() ? 'checked' : 'unchecked'"
      [attr.data-disabled]="isDisabled() || null"
      [attr.tabindex]="tabIndex()"
      [disabled]="isDisabled()"
      [class]="itemClass"
      (click)="select()"
      (focus)="onFocus()"
      (keydown.space)="onSpace($event)"
      (keydown.enter)="$event.preventDefault()"
    >
      @if (isChecked()) {
        <span class="flex items-center justify-center text-current animate-in zoom-in-50">
          <svg lucideCircle class="h-2.5 w-2.5 fill-current text-current"></svg>
        </span>
      }
    </button>
  `,
})
export class RadioItemComponent {
  @Input() class = '';
  @Input() id = `sanring-radio-${nextUniqueId++}`;
  @Input() value!: RadioValue;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() ariaDescribedBy?: string;

  @ViewChild('btn') private btnRef!: ElementRef<HTMLButtonElement>;

  protected readonly group = inject(RadioGroupComponent, { optional: true });

  protected isChecked = computed(() => this.group?.valueSignal() === this.value);
  protected isDisabled = computed(() => this.disabled || (this.group?.disabled ?? false));
  protected tabIndex = computed(() => {
    if (!this.group) return 0;
    return this.group.activeTabItem() === this ? 0 : -1;
  });

  select(): void {
    if (this.isDisabled()) return;
    this.group?.updateValue(this.value);
  }

  focusAndSelect(): void {
    this.btnRef?.nativeElement.focus();
    this.select();
  }

  onFocus(): void {
    this.group?.setFocusedItem(this);
  }

  protected onSpace(event: Event): void {
    event.preventDefault();
    this.select();
  }

  protected get itemClass() {
    return cn(
      'peer flex items-center justify-center aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-primary',
      this.class,
    );
  }
}
