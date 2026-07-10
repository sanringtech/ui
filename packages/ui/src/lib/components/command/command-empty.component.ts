import { Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
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

  protected readonly isVisible = computed(() => this.command.visibleCount() === 0);
  protected readonly emptyClass = computed(() =>
    cn('block py-6 text-center text-sm', this.class()),
  );
}
