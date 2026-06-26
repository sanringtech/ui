import { Directionality } from '@angular/cdk/bidi';
import { Directive, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { AvatarBadgePlacement, AvatarBadgeStatus } from './avatar.types';

@Directive({
  selector: '[sanringAvatarBadge]',
  standalone: true,
  host: {
    '[class]': 'badgeClass()',
    role: 'status',
    '[attr.aria-label]': 'resolvedAriaLabel()',
  },
})
export class AvatarBadgeDirective {
  readonly class = input<string | undefined>();
  readonly status = input<AvatarBadgeStatus>('default');
  readonly placement = input<AvatarBadgePlacement>('end');
  readonly ariaLabel = input<string | undefined>();

  private readonly directionality = inject(Directionality, { optional: true });

  protected readonly resolvedAriaLabel = computed(() => this.ariaLabel() ?? this.status());

  protected readonly badgeClass = computed(() => {
    const statusColors: Record<AvatarBadgeStatus, string> = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-400',
      busy: 'bg-red-500',
      default: 'bg-[var(--sanring-muted-foreground)]',
    };
    const isRtl = this.directionality?.value === 'rtl';
    const isVisualEnd = this.placement() === 'end';
    const sideClass = isVisualEnd !== isRtl ? 'right-0' : 'left-0';

    return cn(
      'absolute bottom-0 z-10 block size-3 rounded-full ring-2 ring-[var(--sanring-background)]',
      sideClass,
      statusColors[this.status()],
      this.class(),
    );
  });
}
