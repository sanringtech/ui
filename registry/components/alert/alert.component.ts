import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../shared/utils';
import { AlertVariant } from './alert.type';

@Component({
  selector: 'sanring-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'alertClass()',
    role: 'alert',
  },
})
export class AlertComponent {
  readonly class = input<string | undefined>();
  readonly variant = input<AlertVariant>('default');

  protected readonly alertClass = computed(() => {
    const variants: Record<AlertVariant, string> = {
      default:
        'border-[var(--sanring-border-strong)] bg-[var(--sanring-surface)] text-[var(--sanring-foreground)]',
      destructive:
        'border-red-500/60 bg-red-500/10 text-red-400 dark:border-red-500 [&>svg]:text-red-400',
    };
    return cn(
      'relative block w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-[var(--sanring-foreground)]',
      variants[this.variant()],
      this.class(),
    );
  });
}
