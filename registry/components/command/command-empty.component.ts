import { Component, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { COLLECTION_EMPTY_CLASS } from '../shared/component-styles';
import { isCollectionEmpty } from '../shared/collection-state';
import { CommandComponent } from './command.component';

@Component({
  selector: 'sanring-command-empty',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'emptyClass()',
    '[style.display]': 'isVisible() ? "" : "none"',
    role: 'presentation',
  },
})
export class CommandEmptyComponent {
  readonly class = input<string | undefined>();

  protected readonly command = inject(CommandComponent);

  protected readonly isVisible = computed(() => isCollectionEmpty(this.command.visibleCount()));
  protected readonly emptyClass = computed(() =>
    cn(COLLECTION_EMPTY_CLASS, this.class()),
  );
}
