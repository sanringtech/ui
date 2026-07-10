import {
  Component,
  Injector,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { cn } from '../../utils';
import { CollectionController } from '../shared/collection-controller';
import { CommandItemComponent } from './command-item.component';

let nextCommandId = 0;

@Component({
  selector: 'sanring-command',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'hostClass()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class CommandComponent {
  readonly class = input<string | undefined>();
  // 對齊 cmdk 的 shouldFilter：關掉時，item 自己的內建 substring 比對整組停用，
  // 交給消費者外部先篩選/排序好要渲染哪些 item（例如接自己的 fuzzy match），
  // Command 本身不再二次過濾、也不會把外部已經判定「符合」的項目又擋掉。
  readonly shouldFilter = input(true, { transform: booleanAttribute });
  readonly valueChange = output<string>();

  readonly listId = `sanring-command-list-${nextCommandId++}`;
  readonly searchQuery = signal('');

  private readonly injector = inject(Injector);
  // DOM 順序的 content children，交給 CDK 的 key manager 管理鍵盤導覽，
  // 取代先前「靠每個 item 自己 registerItem 塞進 Set」的做法——
  // 那種寫法的順序取決於 item 的 effect 執行先後，不保證跟畫面順序一致。
  private readonly items = contentChildren(CommandItemComponent, { descendants: true });

  private readonly collection = new CollectionController(this.items, this.injector);

  /** 目前 active 項目的 id，給 CommandInputComponent 綁 aria-activedescendant 用 */
  readonly activeItemId = this.collection.activeItemId;
  readonly visibleCount = this.collection.visibleCount;

  protected readonly hostClass = computed(() =>
    cn(
      'flex h-full w-full flex-col overflow-hidden rounded-[var(--sanring-radius)] bg-[var(--sanring-elevated)] text-[var(--sanring-foreground)]',
      this.class(),
    ),
  );

  constructor() {
    // 搜尋字串（或可見項目集合）變動時，把 active 項目重新對到第一個可見結果
    effect(() => {
      this.searchQuery();
      const visible = this.collection.focusableItems();
      untracked(() => {
        if (visible.length > 0) this.collection.ensureActiveItem();
      });
    });
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  setActiveItem(item: CommandItemComponent) {
    this.collection.setActiveItem(item);
  }

  protected onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.collection.onKeydown(event);
      return;
    }

    this.collection.onKeydown(event);
  }
}
