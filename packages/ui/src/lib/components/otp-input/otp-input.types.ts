export type OtpInputValue = string;

export type OtpInputSize = 'sm' | 'md' | 'lg';

export type OtpInputType = 'numeric' | 'alphanumeric' | 'text';

export type OtpInputOrientation = 'horizontal' | 'vertical';

export type OtpInputTextAlign = 'left' | 'center' | 'right';

export type OtpInputAutocomplete = 'one-time-code' | 'off';

export type OtpInputSlotState = 'empty' | 'filled' | 'active' | 'disabled' | 'invalid';

export interface OtpInputSlot {
  index: number;
  value: string;
  state: OtpInputSlotState;
}

export interface OtpInputValueChangeEvent {
  value: OtpInputValue;
  slots: readonly OtpInputSlot[];
  complete: boolean;
}

export interface OtpInputCompleteEvent extends OtpInputValueChangeEvent {
  value: OtpInputValue;
  complete: true;
}

export interface OtpInputPasteEvent {
  value: OtpInputValue;
  slots: readonly OtpInputSlot[];
  originalEvent: ClipboardEvent;
}

export interface OtpInputKeydownEvent {
  value: OtpInputValue;
  slots: readonly OtpInputSlot[];
  index: number;
  originalEvent: KeyboardEvent;
}
