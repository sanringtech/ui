import { _IdGenerator } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { cn } from '../../utils';
import { NavigationMenuComponent } from './navigation-menu.component';

@Component({
  selector: 'sanring-navigation-menu-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listitem',
    '[attr.data-state]': "isOpen() ? 'open' : 'closed'",
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[class]': 'itemClass()',
  },
  template: `<ng-content></ng-content>`,
})
export class NavigationMenuItemComponent {
  private readonly generatedValue = inject(_IdGenerator).getId('sanring-navigation-menu-item-', true);
  protected readonly navigationMenu = inject(NavigationMenuComponent);

  readonly class = input<string | undefined>();
  readonly value = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly contentId = signal<string | null>(null);
  readonly itemValue = computed(() => this.value() ?? this.generatedValue);
  readonly isOpen = computed(() => this.navigationMenu.isOpen(this.itemValue()));

  protected readonly itemClass = computed(() =>
    cn(
      'relative',
      this.navigationMenu.orientation() === 'vertical' ? 'w-full' : 'shrink-0',
      this.class(),
    ),
  );

  open() {
    if (this.disabled()) return;
    this.navigationMenu.open(this.itemValue());
  }

  close() {
    if (this.isOpen()) {
      this.navigationMenu.close();
    }
  }

  toggle() {
    if (this.disabled()) return;
    this.navigationMenu.toggle(this.itemValue());
  }

  registerContentId(id: string) {
    this.contentId.set(id);
  }
}
