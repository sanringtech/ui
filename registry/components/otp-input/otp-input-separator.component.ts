import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { OTP_INPUT_ROOT } from './otp-input.context';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-otp-input-separator',
  standalone: true,
  host: {
    '[class]': 'separatorClass()',
    '[attr.aria-hidden]': '"true"',
  },
  template: `<ng-content>-</ng-content>`,
})
export class OtpInputSeparatorComponent {
  readonly class = input<string | undefined>();

  private readonly root = inject(OTP_INPUT_ROOT, { optional: true });

  protected readonly separatorClass = computed(() =>
    cn(
      'flex shrink-0 select-none items-center justify-center text-sm font-medium text-[var(--sanring-muted)]',
      this.root?.getOrientation() === 'vertical' ? 'h-3' : 'w-3',
      this.class(),
    ),
  );
}
