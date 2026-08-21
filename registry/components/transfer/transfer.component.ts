import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { cn } from '../shared/utils';
import { TransferItem, TransferMode } from './transfer.type';

@Component({
  selector: 'sanring-transfer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'rootClass()',
  },
})
export class TransferComponent {
  readonly items = input<TransferItem[]>([]);
  readonly class = input<string | undefined>();

  protected readonly rootClass = computed(() => cn(this.class()));
  // 雙向綁定：目前在右側（target）的 key 清單，父層可用 [(selectedKeys)] 拿到結果
  readonly selectedKeys = model<string[]>([]);
  readonly mode = input<TransferMode>('two-way');

  // 左右兩側各自的「勾選中、尚未移動」的暫存狀態，跟 selectedKeys 是分開的概念
  protected readonly sourceSelectedKeys = signal<string[]>([]);
  protected readonly targetSelectedKeys = signal<string[]>([]);

  // 不能是 protected：TransferPanelComponent 是另一個 class，靠 inject(TransferComponent)
  // 拿到這個實例來讀 source/target 各自要渲染的清單，protected 對它來說是存取不到的。
  readonly sourceItems = computed(() =>
    this.items().filter((item) => !this.selectedKeys().includes(item.key)),
  );
  readonly targetItems = computed(() =>
    this.items().filter((item) => this.selectedKeys().includes(item.key)),
  );

  private readonly itemsByKey = computed(
    () => new Map(this.items().map((item) => [item.key, item])),
  );

  isSourceSelected(key: string): boolean {
    return this.sourceSelectedKeys().includes(key);
  }

  isTargetSelected(key: string): boolean {
    return this.targetSelectedKeys().includes(key);
  }

  toggleSourceSelected(key: string): void {
    if (this.itemsByKey().get(key)?.disabled) return;
    this.sourceSelectedKeys.update((keys) =>
      keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key],
    );
  }

  toggleTargetSelected(key: string): void {
    // one-way 模式下 target 是唯讀展示，不接受勾選
    if (this.mode() === 'one-way') return;
    if (this.itemsByKey().get(key)?.disabled) return;
    this.targetSelectedKeys.update((keys) =>
      keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key],
    );
  }

  moveToTarget(): void {
    // 用當下的 sourceItems 過濾一次，避免 items() 從外部變動後 sourceSelectedKeys 裡殘留已經不存在的 key
    const validKeys = new Set(this.sourceItems().map((item) => item.key));
    const moving = this.sourceSelectedKeys().filter((key) => validKeys.has(key));
    if (moving.length === 0) return;

    this.selectedKeys.update((keys) => [...keys, ...moving]);
    this.sourceSelectedKeys.set([]);
  }

  moveToSource(): void {
    if (this.mode() === 'one-way') return;
    const moving = new Set(this.targetSelectedKeys().filter((key) => this.itemsByKey().has(key)));
    if (moving.size === 0) return;

    this.selectedKeys.update((keys) => keys.filter((key) => !moving.has(key)));
    this.targetSelectedKeys.set([]);
  }

  setSourceSelectedKeys(keys: string[]): void {
    this.sourceSelectedKeys.set(keys);
  }

  setTargetSelectedKeys(keys: string[]): void {
    if (this.mode() === 'one-way') return;
    this.targetSelectedKeys.set(keys);
  }
}
