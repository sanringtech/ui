import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { cn } from '../../utils';
import { AvatarSize, AvatarStatus } from './avatar.types';

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
};

@Component({
  selector: 'sanring-avatar',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'avatarClass()',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
    '[attr.data-state]': 'status()',
  },
})
export class AvatarComponent {
  readonly class = input<string | undefined>();
  readonly size = input<AvatarSize>('md');
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();

  readonly status = signal<AvatarStatus>('idle');

  protected readonly avatarClass = computed(() =>
    cn(
      'relative flex shrink-0 items-center justify-center overflow-visible rounded-full',
      'bg-[var(--sanring-surface-strong)] text-[var(--sanring-muted-foreground)]',
      'ring-2 ring-[var(--sanring-background)]',
      SIZE_CLASSES[this.size()] ?? SIZE_CLASSES.md,
      this.class(),
    ),
  );
}
