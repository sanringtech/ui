import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-context-menu-shortcut',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'shortcutClass()',
  },
})
export class ContextMenuShortcutComponent {
  readonly class = input<string | undefined>();

  protected readonly shortcutClass = computed(() =>
    cn('ml-auto block text-xs tracking-widest text-[var(--sanring-muted)]', this.class()),
  );
}
