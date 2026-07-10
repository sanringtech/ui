import { Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { COLLECTION_LIST_CLASS } from '../component-styles';
import { ComboboxComponent } from './combobox.component';

@Component({
  selector: 'sanring-combobox-list',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[id]': 'combobox.listId',
    '[class]': 'listClass()',
    role: 'listbox',
  },
})
export class ComboboxListComponent {
  readonly class = input<string | undefined>();

  protected readonly combobox = inject(ComboboxComponent);

  protected readonly listClass = computed(() =>
    cn(COLLECTION_LIST_CLASS, 'max-h-[300px] p-1', this.class()),
  );
}
