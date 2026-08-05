import { Directive, computed, input } from '@angular/core';
import { cn } from '../../utils';

@Directive({
  selector:
    'p[sanringNavigationMenuDescription], span[sanringNavigationMenuDescription], small[sanringNavigationMenuDescription], div[sanringNavigationMenuDescription]',
  standalone: true,
  host: {
    '[class]': 'descriptionClass()',
  },
})
export class NavigationMenuDescriptionDirective {
  readonly class = input<string | undefined>();

  protected readonly descriptionClass = computed(() =>
    cn(
      'block min-w-0 text-sm leading-snug text-[var(--sanring-muted)]',
      this.class(),
    ),
  );
}
