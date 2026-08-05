import {
  Directive,
  ElementRef,
  HostListener,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { cn } from '../shared/utils';
import { LinkTarget } from '../link/link.type';

@Directive({
  selector: 'a[sanringNavigationMenuLink], button[sanringNavigationMenuLink]',
  standalone: true,
  host: {
    '[attr.aria-current]': "active() ? 'page' : null",
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.disabled]': 'disabled() && isButton ? true : null',
    '[attr.tabindex]': 'disabled() ? -1 : null',
    '[attr.target]': 'target() || null',
    '[attr.rel]': 'computedRel()',
    '[attr.data-active]': 'active() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[class]': 'linkClass()',
  },
})
export class NavigationMenuLinkDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly class = input<string | undefined>();
  readonly active = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly target = input<LinkTarget | undefined>();
  readonly rel = input<string | undefined>();

  protected readonly isButton = this.elementRef.nativeElement.tagName.toLowerCase() === 'button';

  protected readonly linkClass = computed(() =>
    cn(
      'flex w-full min-w-0 items-start gap-3 rounded-[var(--sanring-radius)] px-3 py-2 text-left',
      'text-sm text-[var(--sanring-foreground)] no-underline outline-none transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus-visible:bg-[var(--sanring-surface-strong)]',
      'focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      'data-active:bg-[var(--sanring-active)] data-active:font-medium',
      'data-disabled:pointer-events-none data-disabled:opacity-50',
      this.class(),
    ),
  );

  protected readonly computedRel = computed(() => {
    const target = this.target();
    const rel = this.rel();

    if (target !== '_blank' && !rel) {
      return null;
    }

    const rels = new Set(rel ? rel.split(' ') : []);

    if (target === '_blank') {
      rels.add('noopener');
      rels.add('noreferrer');
    }

    return Array.from(rels).join(' ') || null;
  });

  @HostListener('click', ['$event'])
  protected handleClick(event: Event): void {
    if (!this.disabled()) return;

    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
