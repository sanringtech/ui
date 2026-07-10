import { Component, computed, input } from '@angular/core';
import { cn } from '@sanring/ui';

@Component({
  selector: 'app-component-page-hint',
  standalone: true,
  template: `<ng-content />`,
  host: {
    '[class]': 'hintClass()',
  },
})
export class ComponentPageHintComponent {
  readonly class = input<string | undefined>();

  protected readonly hintClass = computed(() =>
    cn('m-0 text-xs leading-5 text-[var(--docs-muted)]', this.class()),
  );
}
