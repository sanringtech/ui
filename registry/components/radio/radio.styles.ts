import type { RadioSize } from './radio.types';

export const RADIO_SIZE_CLASSES: Record<RadioSize, string> = {
  sm: 'aspect-square h-3 w-3',
  md: 'aspect-square h-4 w-4',
  lg: 'aspect-square h-5 w-5',
};

export const RADIO_INDICATOR_ICON_SIZE_CLASSES: Record<RadioSize, string> = {
  sm: 'h-2 w-2 fill-current text-current',
  md: 'h-2.5 w-2.5 fill-current text-current',
  lg: 'h-3 w-3 fill-current text-current',
};
