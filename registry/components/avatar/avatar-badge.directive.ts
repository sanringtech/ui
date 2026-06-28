import { Directionality } from '@angular/cdk/bidi';
import { Directive, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
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
      online: 'bg-[var(--sanring-badge-online)]',
      offline: 'bg-[var(--sanring-badge-offline)]',
      away: 'bg-[var(--sanring-badge-away)]',
      busy: 'bg-[var(--sanring-badge-busy)]',
      default: 'bg-[var(--sanring-badge-default)]',
    };
    const isRtl = this.directionality?.value === 'rtl';
    const isVisualEnd = this.placement() === 'end';
    const sideClass = isVisualEnd !== isRtl ? 'right-0' : 'left-0';

    return cn(
      'absolute bottom-0 z-10 flex size-3 items-center justify-center rounded-full text-white ring-2 ring-[var(--sanring-background)]',
      sideClass,
      statusColors[this.status()],
      this.class(),
    );
  });
}
