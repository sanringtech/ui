import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-dialog-header',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'dialogHeaderClass()',
  },
})
export class DialogHeaderComponent {
  readonly class = input<string | undefined>();

  readonly align = input<'start' | 'center' | undefined>(undefined);

  protected readonly dialogHeaderClass = computed(() =>
    cn(
      'flex flex-col space-y-1.5',
      this.align() === 'center' && 'items-center text-center',
      this.align() === 'start' && 'items-start text-left',
      !this.align() && 'text-center sm:text-left',
      this.class(),
    ),
  );
}
