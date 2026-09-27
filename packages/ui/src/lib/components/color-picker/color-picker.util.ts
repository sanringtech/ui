export const DEFAULT_COLOR_HEX = '#000000';

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const FULL_HEX = /^#[0-9a-fA-F]{6}$/;

export function normalizeHex(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const match = HEX.exec(value.trim());
  if (!match) return null;

  const digits = match[1];
  if (digits.length === 3) {
    const [r, g, b] = digits;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  return `#${digits}`.toLowerCase();
}

export function toNativeColor(value: string | null | undefined): string {
  return normalizeHex(value) ?? DEFAULT_COLOR_HEX;
}

export function isFullHex(value: string): boolean {
  return FULL_HEX.test(value.trim());
}
