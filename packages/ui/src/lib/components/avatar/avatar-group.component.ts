import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-avatar-group',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'groupClass()',
    role: 'group',
    '[style.--sanring-avatar-overlap]': 'overlapStyle()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
  },
})
export class AvatarGroupComponent {
  readonly class = input<string | undefined>();
  readonly overlap = input(0.75, {
    transform: (value: unknown) => coerceNumberProperty(value, 0.75),
  });
  readonly ariaLabel = input<string | undefined>();
  readonly ariaLabelledBy = input<string | undefined>();
  readonly ariaDescribedBy = input<string | undefined>();

  protected readonly overlapStyle = computed(() => `${this.overlap() * -1}rem`);
  protected readonly groupClass = computed(() =>
    cn('flex items-center [&>*+*]:ms-[var(--sanring-avatar-overlap)]', this.class()),
  );
}
