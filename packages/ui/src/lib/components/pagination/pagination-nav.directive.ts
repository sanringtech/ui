import {
  Directive,
  ElementRef,
  HostListener,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector: 'button[sanringPaginationNav], a[sanringPaginationNav]',
  standalone: true,
  host: {
    '[class]': 'navClass()',
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
    '[attr.disabled]': 'disabled() && !isAnchor ? true : null',
    '[attr.tabindex]': 'disabled() && isAnchor ? -1 : null',
  },
})
export class PaginationNavDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly class = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isAnchor = this.elementRef.nativeElement.tagName.toLowerCase() === 'a';

  protected readonly navClass = computed(() =>
    cn(
      'inline-flex size-9 cursor-pointer items-center justify-center rounded-[var(--sanring-radius)] border border-[var(--sanring-border)] bg-transparent text-[var(--sanring-foreground)] transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.class(),
    ),
  );

  @HostListener('click', ['$event'])
  protected handleClick(event: Event): void {
    if (!this.disabled()) return;

    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
