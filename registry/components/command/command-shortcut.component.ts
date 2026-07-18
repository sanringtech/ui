import { Component, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

/** 放在 sanring-command-item 裡，顯示該項目自己的快捷鍵提示（例如 "⌘P"） */
@Component({
  selector: 'sanring-command-shortcut',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'shortcutClass()',
  },
})
export class CommandShortcutComponent {
  readonly class = input<string | undefined>();

  protected readonly shortcutClass = computed(() =>
    cn(
      'ml-auto block text-xs tracking-widest text-[var(--sanring-muted)]',
      this.class(),
    ),
  );
}
