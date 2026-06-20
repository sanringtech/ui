import { CdkScrollable } from '@angular/cdk/scrolling';
import { Directive, EventEmitter, inject, Output } from '@angular/core';
import { debounceTime, filter } from 'rxjs/operators';

@Directive({
  selector: '[sanringInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective {
  private scrollable = inject(CdkScrollable);

  @Output() loadMore = new EventEmitter<void>();

  constructor() {
    this.scrollable
      .elementScrolled()
      .pipe(
        filter(() => this.isAtBottom()),
        debounceTime(200), // 防抖動，避免觸發太多次
      )
      .subscribe(() => {
        this.loadMore.emit(); // 只發出訊號，不處理 API
      });
  }

  private isAtBottom(): boolean {
    const el = this.scrollable.getElementRef().nativeElement;
    return el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
  }
}
