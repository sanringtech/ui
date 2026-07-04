import { Directive, ElementRef, HostListener, booleanAttribute, inject, input } from '@angular/core';

/**
 * @docs-private 共用邏輯：處理「按鈕或連結」在 disabled 狀態下的 aria/attr/click 攔截。
 * 只透過 hostDirectives 給 PaginationNavDirective / PaginationItemDirective 組合使用，不對外 export。
 */
@Directive({
  selector: '[sanringDisableableNav]',
  standalone: true,
  host: {
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
    '[attr.disabled]': 'disabled() && !isAnchor ? true : null',
    '[attr.tabindex]': 'disabled() && isAnchor ? -1 : null',
  },
})
export class DisableableNavDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly isAnchor = this.elementRef.nativeElement.tagName.toLowerCase() === 'a';

  @HostListener('click', ['$event'])
  protected handleClick(event: Event): void {
    if (!this.disabled()) return;

    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
