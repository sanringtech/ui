import { InjectionToken } from '@angular/core';
import { OtpInputOrientation, OtpInputSlot } from './otp-input.types';

export interface OtpInputRootContext {
  readonly errorState: boolean;
  readonly fieldRequired: boolean;

  getOrientation(): OtpInputOrientation;
  getSlot(index: number): OtpInputSlot;
  getSlotId(index: number): string;
  getSlotAriaLabel(index: number): string;
  getSlotClass(slot: OtpInputSlot, className?: string): string;
  onSlotPointerDown(event: PointerEvent, index: number): void;
}

export const OTP_INPUT_ROOT = new InjectionToken<OtpInputRootContext>('OtpInputRoot');
