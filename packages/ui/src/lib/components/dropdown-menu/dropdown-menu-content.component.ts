import { Component, computed, inject, input } from '@angular/core';
import { Menu as ngMenu } from '@angular/aria/menu';
import { cn } from '../../utils';
import { OVERLAY_SURFACE_CLASS } from '../component-styles';

@Component({
  selector: 'sanring-dropdown-menu-content',
  standalone: true,
  exportAs: 'sanringDropdownMenuContent',
  hostDirectives: [
    {
      directive: ngMenu,
      inputs: ['id', 'wrap', 'typeaheadDelay'],
      outputs: ['itemSelected'],
    },
  ],
  template: `<ng-content></ng-content>`,
  host: {
    /*
      ngMenu 的 host 已經自己綁了 role="menu"、[attr.data-visible]（是否展開）等 ARIA
      屬性與鍵盤/滑鼠事件，這裡只負責視覺樣式；data-visible=false 時整個隱藏，
      交由 DropdownMenuTriggerDirective 持續 attach 在 DOM 上、不重複建立/銷毀。
    */
    '[class]': 'contentClass()',
  },
})
export class DropdownMenuContentComponent {
  readonly menu = inject(ngMenu, { self: true });

  readonly class = input<string | undefined>();

  protected readonly contentClass = computed(() =>
    cn(
      OVERLAY_SURFACE_CLASS,
      'z-50 block min-w-32 overflow-hidden rounded-[var(--sanring-radius-sm)] p-1 outline-none',
      'data-[visible=false]:hidden',
      this.menu.visible() ? 'animate-popover-in' : '',
      this.class(),
    ),
  );
}
