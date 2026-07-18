import { Component, computed, input } from '@angular/core';
import { cn, uniqueId } from '../shared/utils';
import { COLLECTION_GROUP_CLASS, COLLECTION_GROUP_HEADING_CLASS } from '../shared/component-styles';

@Component({
  selector: 'sanring-combobox-group',
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
export class ComboboxGroupComponent {
  readonly heading = input<string>();
  readonly class = input<string | undefined>();

  protected readonly headingId = uniqueId('sanring-combobox-group-heading');
  protected readonly headingClass = cn(COLLECTION_GROUP_HEADING_CLASS, 'py-1.5');

  protected readonly groupClass = computed(() =>
    cn(COLLECTION_GROUP_CLASS, 'py-1', this.class()),
  );
}
