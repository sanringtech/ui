import { CdkScrollable } from '@angular/cdk/scrolling';
import { Directive, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs/operators';

@Directive({
  selector: '[sanringInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective {
  private readonly scrollable = inject(CdkScrollable);

  readonly loadMore = output<void>();

  constructor() {
    this.scrollable
      .elementScrolled()
      .pipe(
        filter(() => this.isAtBottom()),
        debounceTime(200),
        takeUntilDestroyed(), // DestroyRef auto-injected from constructor injection context
      )
      .subscribe(() => this.loadMore.emit());
  }

  private isAtBottom(): boolean {
    const el = this.scrollable.getElementRef().nativeElement;
    return el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
  }
}
