import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import {
  Component,
  Injector,
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
  readonly valueChange = output<string>();

  readonly listId = `sanring-command-list-${nextCommandId++}`;
  readonly searchQuery = signal('');

  private readonly injector = inject(Injector);
  // DOM 順序的 content children，交給 CDK 的 key manager 管理鍵盤導覽，
  // 取代先前「靠每個 item 自己 registerItem 塞進 Set」的做法——
  // 那種寫法的順序取決於 item 的 effect 執行先後，不保證跟畫面順序一致。
  private readonly items = contentChildren(CommandItemComponent, { descendants: true });

  private readonly keyManager = new ActiveDescendantKeyManager(this.items, this.injector)
    .withWrap()
    .withVerticalOrientation()
    .skipPredicate((item) => !item.isVisible() || item.disabled);

  /** 目前 active 項目的 id，給 CommandInputComponent 綁 aria-activedescendant 用 */
  readonly activeItemId = computed(() => this.keyManager.activeItem?.id ?? null);
  readonly visibleCount = computed(() => this.items().filter((item) => item.isVisible()).length);

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
      const visible = this.items().filter((item) => item.isVisible() && !item.disabled);
      untracked(() => {
        if (visible.length > 0 && !visible.includes(this.keyManager.activeItem as CommandItemComponent)) {
          this.keyManager.setActiveItem(visible[0]);
        }
      });
    });
  }

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  setActiveItem(item: CommandItemComponent) {
    this.keyManager.setActiveItem(item);
  }

  protected onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const active = this.keyManager.activeItem;
      if (active && !active.disabled) active.select();
      return;
    }

    this.keyManager.onKeydown(event);
  }
}
