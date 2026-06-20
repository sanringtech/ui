import { Component, Input } from '@angular/core';
import { cn } from '../../utils';
import { AlertVariant } from './alert.type';

@Component({
  selector: 'sanring-alert',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'alertClass',
    role: 'alert', // 💡 增加無障礙語意
  },
})
export class Alert {
  @Input() class = '';
  @Input() variant: AlertVariant = 'default';

  protected get alertClass() {
    return cn(
      // 💡 關鍵修正：加上 'block'！
      'relative block w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-[var(--docs-fg)]',
      this.variantClasses,
      this.class,
    );
  }

  private get variantClasses() {
    const variants: Record<AlertVariant, string> = {
      default: 'bg-[var(--docs-bg)] text-[var(--docs-fg)] border-[var(--docs-border)]',
      destructive: 'border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500',
    };
    return variants[this.variant];
  }
}
