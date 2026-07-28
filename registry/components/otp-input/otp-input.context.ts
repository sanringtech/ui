import { ElementRef, InjectionToken } from '@angular/core';
import { OtpInputAutocomplete, OtpInputOrientation, OtpInputSlot } from './otp-input.types';

export interface OtpInputRootContext {
  readonly errorState: boolean;
  readonly fieldRequired: boolean;

  getOrientation(): OtpInputOrientation;
  getSlot(index: number): OtpInputSlot;
  getSlotId(index: number): string;
  getSlotName(index: number): string | null;
  getSlotInputMode(): 'numeric' | 'text';
  getSlotAutocomplete(index: number): OtpInputAutocomplete | 'off';
  getSlotAriaLabel(index: number): string;
  getSlotClass(slot: OtpInputSlot, className?: string): string;
  isSlotReadOnly(): boolean;
  isSlotDisabled(): boolean;
  registerSlot(index: number, elementRef: ElementRef<HTMLInputElement>): void;
  unregisterSlot(index: number, elementRef: ElementRef<HTMLInputElement>): void;
  onSlotFocus(index: number): void;
  onSlotBlur(): void;
  onSlotInput(event: Event, index: number): void;
  onSlotKeydown(event: KeyboardEvent, index: number): void;
  onSlotPaste(event: ClipboardEvent, index: number): void;
}

export const OTP_INPUT_ROOT = new InjectionToken<OtpInputRootContext>('OtpInputRoot');
