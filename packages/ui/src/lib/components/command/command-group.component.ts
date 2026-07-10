import { Component, computed, input } from '@angular/core';
import { cn } from '../../utils';
import { COLLECTION_GROUP_CLASS, COLLECTION_GROUP_HEADING_CLASS } from '../component-styles';

@Component({
  selector: 'sanring-command-group',
  standalone: true,
  template: `
    @if (heading()) {
      <div [class]="headingClass">
        {{ heading() }}
      </div>
    }

    <div role="group">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[class]': 'groupClass()',
  },
})
export class CommandGroupComponent {
  readonly heading = input<string>();
  readonly class = input<string | undefined>();

  protected readonly headingClass = COLLECTION_GROUP_HEADING_CLASS;

  protected readonly groupClass = computed(() =>
    cn(COLLECTION_GROUP_CLASS, 'p-2', this.class()),
  );
}
