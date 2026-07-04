import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { cn } from '../../utils';
import { AvatarComponent } from './avatar.component';

@Component({
  selector: 'sanring-avatar-fallback',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'fallbackClass()',
    '[attr.aria-hidden]': 'ariaHidden()',
  },
})
export class AvatarFallbackComponent implements OnDestroy {
  readonly class = input<string | undefined>();
  readonly delayMs = input(0, { transform: (value: unknown) => coerceNumberProperty(value, 0) });

  private readonly avatar = inject(AvatarComponent, { optional: true });
  private readonly isDelayElapsed = signal(false);
  private timeoutId?: ReturnType<typeof setTimeout>;

  protected readonly isVisible = computed(() => {
    const status = this.avatar?.status() ?? 'error';
    return status !== 'loaded' && this.isDelayElapsed();
  });

  protected readonly ariaHidden = computed(() => (this.isVisible() ? null : 'true'));
  protected readonly fallbackClass = computed(() =>
    cn(
      'flex size-full items-center justify-center rounded-full text-sm font-medium uppercase',
      'bg-[var(--sanring-surface-strong)] text-[var(--sanring-muted)]',
      this.isVisible() ? null : 'hidden',
      this.class(),
    ),
  );

  constructor() {
    effect((onCleanup) => {
      const delay = Math.max(0, this.delayMs());
      this.isDelayElapsed.set(delay === 0);
      clearTimeout(this.timeoutId);

      if (delay > 0) {
        this.timeoutId = setTimeout(() => this.isDelayElapsed.set(true), delay);
      }

      onCleanup(() => clearTimeout(this.timeoutId));
    });
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
  }
}
