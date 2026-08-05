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
  selector: '[sanringSidebarMenuAction]',
  standalone: true,
  host: {
    '[class]': 'actionClass()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.disabled]': 'disabled() && isButton ? true : null',
    '[attr.tabindex]': 'disabled() && !isButton ? -1 : null',
  },
})
export class SidebarMenuActionDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ctx = inject(SIDEBAR_CONTEXT, { optional: true });

  readonly class = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isButton = this.elementRef.nativeElement.tagName.toLowerCase() === 'button';
  private readonly isIconRail = computed(
    () => this.ctx?.collapsible() === 'icon' && !this.ctx.isOpen(),
  );

  protected readonly actionClass = computed(() =>
    cn(
      'absolute right-1 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-[var(--sanring-radius-xs)]',
      'text-[var(--sanring-muted-foreground)] transition-[background-color,color,opacity]',
      'hover:bg-[var(--sanring-surface-strong)] hover:text-[var(--sanring-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      'aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.isIconRail() && 'hidden',
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
