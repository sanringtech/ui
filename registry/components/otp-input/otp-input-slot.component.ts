import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  numberAttribute,
  viewChild,
} from '@angular/core';
import { OTP_INPUT_ROOT } from './otp-input.context';

@Component({
  selector: 'sanring-otp-input-slot',
  standalone: true,
  template: `
    <input
      #slotInput
      [class]="slotClass()"
      [id]="root.getSlotId(index())"
      [attr.name]="root.getSlotName(index())"
      [attr.type]="'text'"
      [attr.inputmode]="root.getSlotInputMode()"
      [attr.autocomplete]="root.getSlotAutocomplete(index())"
      [attr.aria-label]="root.getSlotAriaLabel(index())"
      [attr.aria-invalid]="root.errorState ? 'true' : null"
      [attr.aria-required]="root.fieldRequired ? 'true' : null"
      [attr.data-state]="slot().state"
      [value]="slot().value"
      [readOnly]="root.isSlotReadOnly()"
      [disabled]="root.isSlotDisabled()"
      maxlength="1"
      (focus)="root.onSlotFocus(index())"
      (blur)="root.onSlotBlur()"
      (input)="root.onSlotInput($event, index())"
      (keydown)="root.onSlotKeydown($event, index())"
      (paste)="root.onSlotPaste($event, index())"
    />
  `,
})
export class OtpInputSlotComponent {
  readonly index = input(0, { transform: numberAttribute });
  readonly class = input<string | undefined>();

  protected readonly root = inject(OTP_INPUT_ROOT);
  private readonly slotInput = viewChild<ElementRef<HTMLInputElement>>('slotInput');

  protected readonly slot = computed(() => this.root.getSlot(this.index()));
  protected readonly slotClass = computed(() => this.root.getSlotClass(this.slot(), this.class()));

  constructor() {
    effect((onCleanup) => {
      const elementRef = this.slotInput();
      const index = this.index();
      if (!elementRef) return;

      this.root.registerSlot(index, elementRef);
      onCleanup(() => this.root.unregisterSlot(index, elementRef));
    });
  }
}
