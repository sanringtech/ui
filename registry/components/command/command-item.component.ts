import { Highlightable } from '@angular/cdk/a11y';
import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { cn } from '../shared/utils';
import {
  COLLECTION_ITEM_ACTIVE_CLASS,
  COLLECTION_ITEM_CLASS,
  COLLECTION_ITEM_DISABLED_CLASS,
} from '../shared/component-styles';
import { isCollectionItemVisible } from '../shared/collection-state';
import { CommandComponent } from './command.component';

let nextItemId = 0;

@Component({
  selector: 'sanring-command-item',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[id]': 'id',
    '[class]': 'itemClass()',
    // 被搜尋篩掉時直接隱藏，仍留在 DOM/content children 裡（CDK key manager 靠
    // skipPredicate 跳過它，不是靠增減項目數量）
    '[style.display]': 'isVisible() ? "" : "none"',
    '(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    role: 'option',
    '[attr.aria-selected]': 'active()',
    '[attr.aria-disabled]': 'disabled || null',
  },
})
export class CommandItemComponent implements Highlightable {
  // 開發者必須傳入唯一值（例如 'profile'），供 selected/valueChange 辨識用；
  // 搜尋比對用的是可見文字內容（見 isVisible），不是這個 value。
  readonly value = input.required<string>();
  // Highlightable/ListKeyManagerOption 要求 disabled 是一般 boolean 屬性，signal input
  // 沒辦法同名共用，所以底層 input 改名 disabledInput，再用 alias 讓範本上還是寫
  // `disabled`（跟這個 library 其他元件的慣例一致），下面用 getter 轉成 Highlightable 要的形狀。
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly class = input<string | undefined>();

  /** 點擊或按下 Enter 時觸發，帶出這個項目的 value */
  readonly selected = output<string>();

  readonly id = `sanring-command-item-${nextItemId++}`;

  protected readonly command = inject(CommandComponent);
  private readonly el = inject(ElementRef<HTMLElement>);

  protected readonly active = signal(false);

  // Highlightable/ListKeyManagerOption 要求 disabled 是一般 boolean 屬性，不是 signal，
  // 所以用 getter 包一層，底層的 reactive input 改叫 disabledInput。
  get disabled(): boolean {
    return this.disabledInput();
  }

  // 拿可見文字內容（而不是 value）去比對搜尋字串，這樣使用者打的字才會跟畫面上
  // 看到的內容對得起來，不會因為 value 是內部 id（如 "profile"）就搜不到。
  // shouldFilter 關掉時完全不比對，交給消費者外部決定要渲染哪些 item。
  readonly isVisible = computed(() => {
    if (!this.command.shouldFilter()) return true;
    return isCollectionItemVisible(this.getLabel(), this.command.searchQuery());
  });

  protected readonly itemClass = computed(() =>
    cn(
      COLLECTION_ITEM_CLASS,
      'gap-3 px-3 py-2.5',
      this.active() && COLLECTION_ITEM_ACTIVE_CLASS,
      this.disabled && COLLECTION_ITEM_DISABLED_CLASS,
      this.class(),
    ),
  );

  setActiveStyles(): void {
    this.active.set(true);
  }

  setInactiveStyles(): void {
    this.active.set(false);
  }

  getLabel(): string {
    return this.el.nativeElement.textContent?.trim() ?? this.value();
  }

  select(): void {
    if (this.disabled) return;
    this.selected.emit(this.value());
    this.command.valueChange.emit(this.value());
  }

  protected onClick(): void {
    this.select();
  }

  protected onMouseEnter(): void {
    if (this.disabled) return;
    this.command.setActiveItem(this);
  }
}
