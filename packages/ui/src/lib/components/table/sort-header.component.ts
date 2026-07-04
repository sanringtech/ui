import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { LucideChevronDown, LucideChevronUp, LucideChevronsUpDown } from '@lucide/angular';
import { cn } from '../../utils';
import { TableHeaderCellDirective } from './cell.directive';
import { SortDirective } from './sort.directive';
import { SortDirection } from './table.type';

@Component({
  selector: 'th[sanringSortHeader]',
  standalone: true,
  imports: [LucideChevronUp, LucideChevronDown, LucideChevronsUpDown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // 複用 TableHeaderCellDirective：基礎 header cell 樣式 + CdkHeaderCell 都會一併帶進來
  hostDirectives: [TableHeaderCellDirective],
  host: {
    '[class]': 'headerClass()',
    '[attr.aria-sort]': 'ariaSort()',
    '(click)': 'toggle()',
  },
  template: `
    <span class="inline-flex items-center gap-1.5">
      <ng-content></ng-content>

      @if (direction() === 'asc') {
        <svg lucideChevronUp class="size-4"></svg>
      } @else if (direction() === 'desc') {
        <svg lucideChevronDown class="size-4"></svg>
      } @else {
        <svg lucideChevronsUpDown class="size-4 opacity-50"></svg>
      }
    </span>
  `,
})
export class SortHeaderComponent {
  // th 是 CdkCellOutlet 動態蓋出來的，但 injector 是照宣告時的巢狀關係解析，
  // 所以還是能抓到宣告在 <table sanringTable sanringSort> 上的 SortDirective 實例。
  private readonly sort = inject(SortDirective, { optional: true });

  readonly sortId = input.required<string>({ alias: 'sanringSortHeader' });
  readonly class = input<string | undefined>();

  protected readonly direction = computed<SortDirection>(
    () => this.sort?.directionFor(this.sortId()) ?? null,
  );

  protected readonly ariaSort = computed(() => {
    const direction = this.direction();
    if (direction === 'asc') return 'ascending';
    if (direction === 'desc') return 'descending';
    return 'none';
  });

  protected readonly headerClass = computed(() =>
    cn('cursor-pointer select-none hover:bg-[var(--sanring-elevated)]', this.class()),
  );

  constructor() {
    if (!this.sort) {
      throw new Error(
        'sanring-sort-header 必須用在有 [sanringSort] 指令的祖先元素內（通常是 <table sanringTable sanringSort>）。',
      );
    }
  }

  toggle(): void {
    this.sort?.sort(this.sortId());
  }
}
