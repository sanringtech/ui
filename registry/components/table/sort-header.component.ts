import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { LucideChevronDown, LucideChevronUp, LucideChevronsUpDown } from '@lucide/angular';
import { cn } from '../shared/utils';
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
    // aria-sort 一定要在 th 本身，這裡就是 <th>，可以直接綁
    '[attr.aria-sort]': 'ariaSort()',
  },
  template: `
    <button type="button" [class]="buttonClass()" [disabled]="disabled()" (click)="toggle()">
      <ng-content></ng-content>

      @if (direction() === 'asc') {
        <svg lucideChevronUp class="size-4"></svg>
      } @else if (direction() === 'desc') {
        <svg lucideChevronDown class="size-4"></svg>
      } @else {
        <svg lucideChevronsUpDown class="size-4 opacity-50"></svg>
      }
    </button>
  `,
})
export class SortHeaderComponent {
  // th 是 CdkCellOutlet 動態蓋出來的，但 injector 是照宣告時的巢狀關係解析，
  // 所以還是能抓到宣告在 <table sanringTable sanringSort> 上的 SortDirective 實例。
  private readonly sort = inject(SortDirective, { optional: true });

  readonly sortId = input.required<string>({ alias: 'sanringSortHeader' });
  readonly class = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly direction = computed<SortDirection | null>(
    () => this.sort?.directionFor(this.sortId()) ?? null,
  );

  protected readonly ariaSort = computed(() => {
    const direction = this.direction();
    if (direction === 'asc') return 'ascending';
    if (direction === 'desc') return 'descending';
    return 'none';
  });

  // 真正的 <button>：原生 tabIndex + Enter/Space 觸發 click，鍵盤可及性不用手刻。
  protected readonly buttonClass = computed(() =>
    cn(
      '-ml-2 inline-flex h-8 items-center gap-1.5 rounded-[var(--sanring-radius-sm)] px-2 text-sm font-medium text-[var(--sanring-foreground)] transition-colors hover:bg-[var(--sanring-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)] disabled:pointer-events-none disabled:opacity-50',
      this.class(),
    ),
  );

  constructor() {
    if (!this.sort) {
      throw new Error(
        'sanring-sort-header 必須用在有 [sanringSort] 指令的祖先元素內（通常是 <table sanringTable sanringSort>）。',
      );
    }
  }

  toggle(): void {
    if (this.disabled()) return;
    this.sort?.sort(this.sortId());
  }
}
