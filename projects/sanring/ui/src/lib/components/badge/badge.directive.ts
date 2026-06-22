import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';
import { BadgeVariant } from './badge.type';

@Directive({
  selector: 'span[sanringBadge], div[sanringBadge], a[sanringBadge]',
  standalone: true,
  host: { '[class]': 'badgeClass' },
})
export class BadgeDirective {
  @Input() class = '';
  @Input() variant: BadgeVariant = 'default';

  protected get badgeClass() {
    return cn(
      'inline-flex items-center justify-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
      'transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--sanring-border-strong)] focus:ring-offset-2',
      this.variantClasses,
      this.class,
    );
  }

  private get variantClasses() {
    const variants: Record<BadgeVariant, string> = {
      default: 'border-transparent bg-[var(--sanring-control)] text-[var(--sanring-control-foreground)] hover:opacity-80',
      secondary:
        'border-[var(--sanring-border)] bg-[var(--sanring-surface-strong)] text-[var(--sanring-foreground)] hover:bg-[var(--sanring-active)]',
      destructive: 'border-transparent bg-red-500 text-white hover:bg-red-600',
      outline: 'border-[var(--sanring-border-strong)] text-[var(--sanring-foreground)]',
      ghost:
        'border-transparent bg-transparent text-[var(--sanring-foreground)] hover:bg-[var(--sanring-surface-strong)]',
    };
    return variants[this.variant];
  }
}
