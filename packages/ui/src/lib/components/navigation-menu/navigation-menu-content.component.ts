import { _IdGenerator } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { NavigationMenuItemComponent } from './navigation-menu-item.component';

@Component({
  selector: 'sanring-navigation-menu-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[id]': 'contentId()',
    role: 'region',
    '[attr.data-state]': 'item.isOpen() ? "open" : "closed"',
    '[hidden]': '!item.isOpen()',
    '[class]': 'contentClass()',
  },
  template: `<ng-content></ng-content>`,
})
export class NavigationMenuContentComponent {
  protected readonly item = inject(NavigationMenuItemComponent);
  private readonly generatedId = inject(_IdGenerator).getId('sanring-navigation-menu-content-', true);

  readonly id = input<string | undefined>();
  readonly class = input<string | undefined>();

  readonly contentId = computed(() => this.id() ?? this.generatedId);

  protected readonly contentClass = computed(() =>
    cn(
      'absolute left-0 top-full z-50 mt-2 w-max min-w-64 rounded-[var(--sanring-radius-lg)]',
      'border border-[var(--sanring-border)] bg-[var(--sanring-elevated)] p-2 text-[var(--sanring-foreground)] shadow-lg',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      this.item.registerContentId(this.contentId());
    });
  }
}
