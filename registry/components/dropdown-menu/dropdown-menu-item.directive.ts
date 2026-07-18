import { Directive, computed, input } from '@angular/core';
import { MenuItem as ngMenuItem } from '@angular/aria/menu';
import { cn } from '../shared/utils';
import { MENU_ITEM_SIZE_CLASS } from '../shared/component-styles';
import { DropdownMenuItemVariant } from './dropdown-menu.type';

/*
  role/tabindex/aria-disabled/aria-expanded 等全部交給 ngMenuItem 的 host bindings 處理，
  這裡只負責視覺樣式。點擊/鍵盤啟動也不用自己接了——父層 sanring-dropdown-menu-content
  (ngMenu) 的 host 會用事件代理找到被點的 item、呼叫它、觸發 (itemSelected) 並自動關閉選單。
*/
@Directive({
  selector: '[sanringDropdownMenuItem]',
  standalone: true,
  hostDirectives: [
    {
      directive: ngMenuItem,
      inputs: ['value', 'disabled'],
    },
  ],
  host: {
    '[attr.data-variant]': 'variant()',
    '[class]': 'itemClass()',
  },
})
export class DropdownMenuItemDirective {
  readonly class = input<string | undefined>();
  readonly variant = input<DropdownMenuItemVariant>('default');

  protected readonly itemClass = computed(() =>
    cn(
      'relative flex w-full cursor-default select-none items-center justify-start gap-2 rounded-[var(--sanring-radius-xs)] outline-none',
      MENU_ITEM_SIZE_CLASS,
      'text-[var(--sanring-foreground)] transition-colors',
      'hover:bg-[var(--sanring-surface-strong)] focus:bg-[var(--sanring-surface-strong)] data-[active=true]:bg-[var(--sanring-surface-strong)]',
      this.variant() === 'destructive' &&
        'text-[var(--sanring-error-50)] hover:bg-[color-mix(in_srgb,var(--sanring-error-50)_10%,transparent)] focus:bg-[color-mix(in_srgb,var(--sanring-error-50)_10%,transparent)] data-[active=true]:bg-[color-mix(in_srgb,var(--sanring-error-50)_10%,transparent)]',
      'aria-disabled:pointer-events-none aria-disabled:opacity-50',
      this.class(),
    ),
  );
}
