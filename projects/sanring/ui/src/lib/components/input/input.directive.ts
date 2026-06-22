import { Directive, Input as NgInput } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector: 'input[sanringInput], textarea[sanringInput]',
  standalone: true,
  host: {
    '[class]': 'inputClass',
  },
})
export class InputDirective {
  // 使用 NgInput 避開命名衝突
  @NgInput() class = '';

  protected get inputClass() {
    return cn(
      'peer flex h-10 w-full rounded-md border border-[var(--sanring-border-strong)]',
      'bg-[var(--sanring-surface)] px-3 py-2 text-sm text-[var(--sanring-foreground)]',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-[var(--sanring-muted)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      // 精準針對 textarea 的排版
      '[&:is(textarea)]:h-auto [&:is(textarea)]:min-h-[80px]',
      this.class,
    );
  }
}
