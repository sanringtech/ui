import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { OTP_INPUT_ROOT } from './otp-input.context';

@Component({
  selector: 'sanring-otp-input-slot',
  standalone: true,
  styles: [
    `
      :host {
        display: contents;
      }

      span[data-state='active'] {
        transform: translateY(-1px);
      }

      span[data-state='filled'] {
        animation: sanring-otp-slot-fill 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }

      @keyframes sanring-otp-slot-fill {
        0% {
          transform: scale(0.96);
        }

        100% {
          transform: scale(1);
        }
      }
    `,
  ],
  template: `
    <span
      [class]="slotClass()"
      [id]="root.getSlotId(index())"
      aria-hidden="true"
      data-otp-slot
      [attr.data-state]="slot().state"
      (pointerdown)="root.onSlotPointerDown($event, index())"
      >{{ slot().value }}</span
    >
  `,
})
export class OtpInputSlotComponent {
  readonly index = input(0, { transform: numberAttribute });
  readonly class = input<string | undefined>();

  protected readonly root = inject(OTP_INPUT_ROOT);

  protected readonly slot = computed(() => this.root.getSlot(this.index()));
  protected readonly slotClass = computed(() => this.root.getSlotClass(this.slot(), this.class()));
}
