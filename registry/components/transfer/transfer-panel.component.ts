import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { cn } from '../../utils';
import { TransferComponent } from './transfer.component';
import { TransferDirection } from './transfer.type';

@Component({
  selector: 'sanring-transfer-panel',
  standalone: true,
  exportAs: 'sanringTransferPanel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'panelClass()',
    '[attr.data-direction]': 'direction()',
  },
})
export class TransferPanelComponent {
  readonly direction = input.required<TransferDirection>();
  readonly class = input<string | undefined>();
  // 不設就不分頁，維持原本「一次顯示全部」的行為
  readonly pageSize = input<number | undefined>(undefined);

  private readonly transfer = inject(TransferComponent);

  // overflow-hidden 是必要的：header 的實心背景跟 list 的捲動內容都是矩形，
  // 沒有這個會在面板圓角的四個角露出方形背景，而不是被裁成圓角。
  protected readonly panelClass = computed(() =>
    cn(
      'flex flex-col flex-1 min-w-0 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[var(--sanring-border)] bg-[var(--sanring-surface)] text-[var(--sanring-foreground)] shadow-sm',
      this.class(),
    ),
  );

  // target 面板在 one-way 模式下變成唯讀展示：不能勾選，也就無法被搬回 source
  readonly interactive = computed(
    () => !(this.direction() === 'target' && this.transfer.mode() === 'one-way'),
  );

  // List/Item 元件只認得「這個 panel 該顯示哪些 key、勾選狀態怎麼查/切換」，
  // 不用自己判斷 direction 是 source 還是 target，direction 分派全部收斂在這裡。
  private readonly directionItems = computed(() =>
    this.direction() === 'source' ? this.transfer.sourceItems() : this.transfer.targetItems(),
  );

  private readonly query = signal('');

  private readonly filteredItems = computed(() => {
    const query = this.query().trim().toLowerCase();
    if (!query) return this.directionItems();
    return this.directionItems().filter((item) => item.label.toLowerCase().includes(query));
  });

  private readonly page = signal(0);

  readonly totalPages = computed(() => {
    const size = this.pageSize();
    if (!size) return 1;
    return Math.max(1, Math.ceil(this.filteredItems().length / size));
  });

  // 用 computed 把頁碼夾在合法範圍內，而不是用 effect 手動重置：搜尋字串或 items
  // 變動導致目前頁碼超出範圍時（例如原本在第 3 頁，篩選後只剩 1 頁），畫面會自動
  // 落在最後一頁，不會卡在空白頁。
  readonly currentPage = computed(() => Math.min(this.page(), this.totalPages() - 1));

  readonly hasPreviousPage = computed(() => this.currentPage() > 0);
  readonly hasNextPage = computed(() => this.currentPage() < this.totalPages() - 1);

  readonly items = computed(() => {
    const size = this.pageSize();
    if (!size) return this.filteredItems();
    const start = this.currentPage() * size;
    return this.filteredItems().slice(start, start + size);
  });

  isSelected(key: string): boolean {
    return this.direction() === 'source'
      ? this.transfer.isSourceSelected(key)
      : this.transfer.isTargetSelected(key);
  }

  toggleSelected(key: string): void {
    if (!this.interactive()) return;
    if (this.direction() === 'source') this.transfer.toggleSourceSelected(key);
    else this.transfer.toggleTargetSelected(key);
  }

  setQuery(value: string): void {
    this.query.set(value);
    this.page.set(0);
  }

  nextPage(): void {
    if (this.hasNextPage()) this.page.set(this.currentPage() + 1);
  }

  previousPage(): void {
    if (this.hasPreviousPage()) this.page.set(this.currentPage() - 1);
  }
}
