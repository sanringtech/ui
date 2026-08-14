import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { cn } from '../shared/utils';
import { COLLECTION_GROUP_CLASS, COLLECTION_GROUP_HEADING_CLASS } from '../shared/component-styles';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-command-group',
  standalone: true,
  template: `
    @if (heading()) {
      <div [id]="headingId" [class]="headingClass">
        {{ heading() }}
      </div>
    }

    <div role="group" [attr.aria-labelledby]="heading() ? headingId : null">
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

  protected readonly headingId = inject(_IdGenerator).getId('sanring-command-group-heading-', true);
  protected readonly headingClass = COLLECTION_GROUP_HEADING_CLASS;

  protected readonly groupClass = computed(() =>
    cn(COLLECTION_GROUP_CLASS, 'p-2', this.class()),
  );
}
