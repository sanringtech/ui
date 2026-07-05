import { Directive, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Directive({
  selector: 'textarea[sanringTextarea]',
  standalone: true,
  host: {
    '[class]': 'textareaClass()',
  },
})
export class TextareaDirective {
  readonly class = input<string | undefined>();

  protected readonly textareaClass = computed(() =>
    cn(
      'peer flex min-h-[80px] w-full rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)]',
      'bg-[var(--sanring-surface)] px-3 py-2 text-sm text-[var(--sanring-foreground)]',
      'placeholder:text-[var(--sanring-muted)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );
}
