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
  selector: 'button[sanringPaginationItem], a[sanringPaginationItem]',
  standalone: true,
  host: {
    '[class]': 'itemClass()',
    '[attr.aria-current]': 'active() ? "page" : null',
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
    '[attr.disabled]': 'disabled() && !isAnchor ? true : null',
    '[attr.tabindex]': 'disabled() && isAnchor ? -1 : null',
  },
})
export class PaginationItemDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly class = input<string | undefined>();
  readonly active = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isAnchor = this.elementRef.nativeElement.tagName.toLowerCase() === 'a';

  protected readonly itemClass = computed(() =>
    cn(
      'inline-flex size-9 cursor-pointer items-center justify-center rounded-[var(--sanring-radius)] border text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      this.active()
        ? 'border-[var(--sanring-border-strong)] bg-[var(--sanring-active)] text-[var(--sanring-foreground)]'
        : 'border-[var(--sanring-border)] bg-transparent text-[var(--sanring-foreground)] hover:bg-[var(--sanring-surface-strong)]',
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
