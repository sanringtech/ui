import { Component, Input } from '@angular/core';
import { cn } from '../../utils';
import type { ButtonSize, ButtonVariant } from './button.types';

@Component({
  selector: 'sanring-button',
  standalone: true,
  template: `
    <button
      [attr.type]="type"
      [attr.aria-label]="ariaLabel"
      [disabled]="disabled"
      [class]="buttonClass"
    >
      <ng-content />
    </button>
  `,
})
export class Button {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() ariaLabel: string | null = null;

  protected get buttonClass() {
    return cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg border font-medium',
      'transition-colors focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-[var(--docs-border-strong)] disabled:pointer-events-none disabled:opacity-50',
      this.variantClasses,
      this.sizeClasses,
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
    };

    return sizes[this.size];
  }
}
