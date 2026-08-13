import type { CheckboxSize } from './checkbox.types';

// Record<CheckboxSize, string> 讓這兩個 map 的 key 集合被編譯器強制對齊 CheckboxSize，
// 少一個或多一個 size 都會在這裡直接報錯，不用等到某處索引時才發現。
export const CHECKBOX_SIZE_CLASSES: Record<CheckboxSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};
export const CHECKBOX_ICON_SIZE_CLASSES: Record<CheckboxSize, string> = {
  sm: 'size-2.5',
  md: 'size-4',
  lg: 'size-5',
};
export const CHECKBOX_STATE_CLASS =
  'data-[state=checked]:bg-[var(--sanring-primary)] data-[state=checked]:text-[var(--sanring-primary-fg)] data-[state=indeterminate]:bg-[var(--sanring-primary)] data-[state=indeterminate]:text-[var(--sanring-primary-fg)]';
