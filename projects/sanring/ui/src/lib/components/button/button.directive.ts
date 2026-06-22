import { Directive, Input } from '@angular/core';
import { cn } from '../../utils';
import type { ButtonSize, ButtonVariant } from './button.types';

@Directive({
  selector: 'button[sanringBtn], a[sanringBtn]',
  standalone: true,
  host: {
    '[class]': 'buttonClass',
  },
})
export class ButtonDirective {
  @Input() class = '';
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'md';

  protected get buttonClass() {
    return cn(
      'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium',
      'transition-[background-color,color] focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-[var(--sanring-border-strong)] disabled:pointer-events-none disabled:opacity-50',
      this.variantClasses,
      this.sizeClasses,
      this.class,
    );
  }

  private get variantClasses() {
    const variants: Record<ButtonVariant, string> = {
      default: 'border-transparent bg-[var(--sanring-control)] text-[var(--sanring-control-foreground)]',
      secondary:
        'border-[var(--sanring-border)] bg-[var(--sanring-surface-strong)] text-[var(--sanring-foreground)] hover:bg-[var(--sanring-active)]',
      outline:
        'border-[var(--sanring-border-strong)] bg-transparent text-[var(--sanring-foreground)] hover:bg-[var(--sanring-surface-strong)]',
      ghost:
        'border-transparent bg-transparent text-[var(--sanring-foreground)] hover:bg-[var(--sanring-surface-strong)]',
      destructive:
        'border-transparent bg-[#dc2626] text-white hover:bg-[#b91c1c] focus-visible:ring-[#ef4444]',
      link: 'border-transparent bg-transparent px-0 text-[var(--sanring-foreground)] underline-offset-4 hover:underline',
    };
    return variants[this.variant];
  }

  private get sizeClasses() {
    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      icon: 'size-9 p-0',
      toolbar: 'h-[38px] min-w-[76px] px-3.5 text-sm',
      toolbarIcon: 'size-[38px] p-0',
    };
    return sizes[this.size];
  }
}
