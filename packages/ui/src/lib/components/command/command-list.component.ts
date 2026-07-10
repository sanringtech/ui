import { Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { CommandComponent } from './command.component';

@Component({
  selector: 'sanring-command-list',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[id]': 'command.listId',
    '[class]': 'listClass()',
    role: 'listbox',
  },
})
export class CommandListComponent {
  readonly class = input<string | undefined>();

  protected readonly command = inject(CommandComponent);

  protected readonly listClass = computed(() =>
    cn('block max-h-[420px] overflow-y-auto overflow-x-hidden', this.class()),
  );
}
