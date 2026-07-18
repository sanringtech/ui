import { Component, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { COLLECTION_EMPTY_CLASS } from '../shared/component-styles';
import { isCollectionEmpty } from '../shared/collection-state';
import { ComboboxComponent } from './combobox.component';

@Component({
  selector: 'sanring-combobox-empty',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'emptyClass()',
    '[style.display]': 'isVisible() ? "" : "none"',
    role: 'presentation',
  },
})
export class ComboboxEmptyComponent {
  readonly class = input<string | undefined>();

  protected readonly combobox = inject(ComboboxComponent);

  protected readonly isVisible = computed(() => isCollectionEmpty(this.combobox.visibleCount()));
  protected readonly emptyClass = computed(() =>
    cn(COLLECTION_EMPTY_CLASS, this.class()),
  );
}
