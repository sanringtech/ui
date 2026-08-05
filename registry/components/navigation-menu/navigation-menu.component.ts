import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  model,
  numberAttribute,
} from '@angular/core';
import { cn } from '../shared/utils';
import {
  NAVIGATION_MENU_DEFAULT_DELAY_DURATION,
  NAVIGATION_MENU_DEFAULT_SKIP_DELAY_DURATION,
  NavigationMenuOrientation,
  NavigationMenuValue,
} from './navigation-menu.type';

@Component({
  selector: 'sanring-navigation-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-labelledby]': 'ariaLabelledBy() || null',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'navigationMenuClass()',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class NavigationMenuComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);

  readonly class = input<string | undefined>();
  readonly orientation = input<NavigationMenuOrientation>('horizontal');
  readonly value = model<NavigationMenuValue>(null);
  readonly delayDuration = input(NAVIGATION_MENU_DEFAULT_DELAY_DURATION, { transform: numberAttribute });
  readonly skipDelayDuration = input(NAVIGATION_MENU_DEFAULT_SKIP_DELAY_DURATION, {
    transform: numberAttribute,
  });
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();

  protected readonly navigationMenuClass = computed(() =>
    cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      this.orientation() === 'vertical' && 'max-w-none flex-col items-stretch justify-start',
      this.class(),
    ),
  );

  open(value: string) {
    this.value.set(value);
  }

  close() {
    this.value.set(null);
  }

  toggle(value: string) {
    this.value.update((currentValue) => (currentValue === value ? null : value));
  }

  isOpen(value: string) {
    return this.value() === value;
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.value() === null) return;

    const target = event.target as Node | null;
    if (!target) return;
    if (this.elementRef.nativeElement.contains(target)) return;

    // Submenu flyouts (sanring-navigation-menu-sub) render into the CDK overlay
    // container, outside this element's own DOM subtree — a click there is
    // still "inside" the menu system, not an outside click.
    if (this.document.querySelector('.cdk-overlay-container')?.contains(target)) return;

    this.value.set(null);
  }
}
