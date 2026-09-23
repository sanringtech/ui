import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { AvatarBadgePlacement, AvatarBadgeStatus } from './avatar.types';

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-[var(--sanring-badge-online)]',
  offline: 'bg-[var(--sanring-badge-offline)]',
  away: 'bg-[var(--sanring-badge-away)]',
  busy: 'bg-[var(--sanring-badge-busy)]',
  default: 'bg-[var(--sanring-badge-default)]',
};

@Component({
  selector: '[sanringAvatarBadge]',
  standalone: true,
  template: `{{ countLabel() }}<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'badgeClass()',
    role: 'status',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[attr.aria-hidden]': 'isHidden() ? "true" : null',
    '[hidden]': 'isHidden()',
  },
})
export class AvatarBadgeDirective {
  readonly class = input<string | undefined>();
  readonly status = input<AvatarBadgeStatus>('default');
  readonly placement = input<AvatarBadgePlacement | undefined>();
  readonly ariaLabel = input<string | undefined>();
  readonly count = input<number | undefined>(undefined, {
    transform: (value: unknown) =>
      value === undefined || value === null || value === ''
        ? undefined
        : coerceNumberProperty(value),
  });

  private readonly directionality = inject(Directionality, { optional: true });

  protected readonly countLabel = computed(() => {
    const count = this.count();
    if (typeof count !== 'number' || count <= 0) return '';
    return count > 99 ? '99+' : String(count);
  });

  protected readonly isCount = computed(() => this.countLabel() !== '');
  protected readonly isHidden = computed(() => {
    const count = this.count();
    return typeof count === 'number' && count <= 0;
  });

  protected readonly resolvedPlacement = computed<AvatarBadgePlacement>(
    () => this.placement() ?? (this.isCount() ? 'top' : 'end'),
  );

  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? (this.countLabel() || this.status()),
  );

  protected readonly badgeClass = computed(() => {
    const placement = this.resolvedPlacement();
    const isRtl = this.directionality?.value === 'rtl';
    const isVisualEnd = placement !== 'start';
    const sideClass = isVisualEnd !== isRtl ? 'right-0' : 'left-0';
    const verticalClass = placement === 'top' ? 'top-0' : 'bottom-0';
    const status = this.status();
    const colorClass =
      this.isCount() && status === 'default'
        ? 'bg-[var(--sanring-error-50)]'
        : (STATUS_COLORS[status] ?? STATUS_COLORS['default']);

    return cn(
      'absolute z-10 flex items-center justify-center rounded-full text-white ring-2 ring-[var(--sanring-background)]',
      this.isCount()
        ? 'h-4 min-w-4 px-1 text-[10px] font-semibold leading-none'
        : 'size-3',
      verticalClass,
      sideClass,
      colorClass,
      this.class(),
    );
  });
}
