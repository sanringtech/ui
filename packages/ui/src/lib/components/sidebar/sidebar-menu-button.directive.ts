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
import { SIDEBAR_CONTEXT } from './sidebar-context';

@Directive({
  selector: '[sanringSidebarMenuButton]',
  standalone: true,
  host: {
    '[class]': 'buttonClass()',
    '[attr.aria-current]': 'active() ? "page" : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.disabled]': 'disabled() && isButton ? true : null',
    '[attr.tabindex]': 'disabled() && !isButton ? -1 : null',
    '[attr.data-active]': 'active() ? "" : null',
  },
})
export class SidebarMenuButtonDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ctx = inject(SIDEBAR_CONTEXT, { optional: true });

  readonly class = input<string | undefined>();
  readonly active = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isButton = this.elementRef.nativeElement.tagName.toLowerCase() === 'button';
  private readonly isIconRail = computed(
    () => this.ctx?.collapsible() === 'icon' && !this.ctx.isOpen(),
  );

  protected readonly buttonClass = computed(() =>
    cn(
      'flex min-h-8 w-full items-center gap-2 rounded-[var(--sanring-radius)] px-2 py-1.5 text-sm',
      'text-[var(--sanring-foreground)] transition-[background-color,color]',
      'hover:bg-[var(--sanring-surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      'data-active:bg-[var(--sanring-active)] data-active:font-medium aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.isIconRail() && 'size-10 min-h-10 justify-center gap-0 px-0 py-0',
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
