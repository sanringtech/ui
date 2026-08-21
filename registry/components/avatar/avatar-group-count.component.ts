import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { cn } from '../shared/utils';
import { AvatarSize } from './avatar.types';

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-sm',
};

@Component({
  selector: 'sanring-avatar-group-count',
  standalone: true,
  template: `<ng-content></ng-content>{{ label() }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'countClass()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.role]': 'clickable() ? "button" : null',
    '[attr.aria-disabled]': 'clickable() && disabled() ? "true" : null',
    '[attr.tabindex]': 'clickable() ? (disabled() ? "-1" : "0") : null',
    '[attr.data-disabled]': 'disabled() || null',
    '(click)': 'handleClick()',
    '(keydown.enter)': 'handleKeyActivation($event)',
    '(keydown.space)': 'handleKeyActivation($event)',
  },
})
export class AvatarGroupCountComponent {
  readonly class = input<string | undefined>();
  readonly count = input<number | undefined>(undefined, {
    transform: (value: unknown) =>
      value === undefined || value === null || value === ''
        ? undefined
        : coerceNumberProperty(value),
  });
  readonly size = input<AvatarSize>('md');
  readonly ariaLabel = input<string | undefined>();
  readonly clickable = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly clicked = output<void>();

  protected readonly label = computed(() => {
    const count = this.count();
    return typeof count === 'number' ? `+${count}` : '';
  });

  protected readonly countClass = computed(() =>
    cn(
      'relative flex shrink-0 items-center justify-center rounded-full font-medium',
      'bg-[var(--sanring-surface-strong)] text-[var(--sanring-foreground)]',
      'ring-2 ring-[var(--sanring-background)]',
      SIZE_CLASSES[this.size()] ?? SIZE_CLASSES.md,
      this.clickable() && !this.disabled() && 'cursor-pointer',
      this.clickable() && this.disabled() && 'cursor-not-allowed opacity-50',
      this.class(),
    ),
  );

  protected handleClick(): void {
    if (this.clickable() && !this.disabled()) this.clicked.emit();
  }

  protected handleKeyActivation(event: Event): void {
    if (!this.clickable() || this.disabled()) return;
    event.preventDefault(); // Space 防捲頁，Enter 防 form submit
    this.clicked.emit();
  }
}
