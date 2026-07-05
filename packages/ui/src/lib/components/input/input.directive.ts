import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';
import { FIELD_SIZE_CLASS } from '../component-styles';

@Directive({
  selector: 'input[sanringInput]',
  standalone: true,
  host: {
    '[class]': 'inputClass()',
  },
})
export class InputDirective {
  readonly class = input<string>('');

  protected readonly inputClass = computed(() =>
    cn(
      'peer flex h-10 w-full rounded-[var(--sanring-radius)] border border-[var(--sanring-border-strong)]',
      'bg-[var(--sanring-surface)] text-[var(--sanring-foreground)]',
      FIELD_SIZE_CLASS,
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-[var(--sanring-muted)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.class(),
    ),
  );
}
