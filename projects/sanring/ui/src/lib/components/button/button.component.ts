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
export class Button {
  @Input() class = '';
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'md';

  protected get buttonClass() {
    return cn(
      'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium',
      'transition-colors focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-[var(--docs-border-strong)] disabled:pointer-events-none disabled:opacity-50',
      this.variantClasses,
      this.sizeClasses,
      this.class,
    );
  }

  private get variantClasses() {
    const variants: Record<ButtonVariant, string> = {
      default: 'border-transparent bg-[var(--docs-fg)] text-[var(--docs-bg)]',
      secondary:
        'border-transparent bg-[var(--docs-elevated)] text-[var(--docs-fg)] hover:bg-[var(--docs-active)]',
      outline:
        'border-[var(--docs-border)] bg-transparent text-[var(--docs-fg)] hover:bg-[var(--docs-elevated)]',
      ghost:
        'border-transparent bg-transparent text-[var(--docs-fg)] hover:bg-[var(--docs-elevated)]',
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
