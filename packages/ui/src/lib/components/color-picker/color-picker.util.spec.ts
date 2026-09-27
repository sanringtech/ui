import { DEFAULT_COLOR_HEX, isFullHex, normalizeHex, toNativeColor } from './color-picker.util';

describe('color-picker.util', () => {
  it('normalizes 3-digit and 6-digit hex to lowercase #rrggbb', () => {
    expect(normalizeHex('#ABC')).toBe('#aabbcc');
    expect(normalizeHex('  #FfFFfF  ')).toBe('#ffffff');
  });

  it('rejects missing, empty, or malformed values', () => {
    expect(normalizeHex(null)).toBeNull();
    expect(normalizeHex('')).toBeNull();
    expect(normalizeHex('#12')).toBeNull();
    expect(normalizeHex('#zzzzzz')).toBeNull();
    expect(normalizeHex('2563eb')).toBeNull();
  });

  it('falls back to black for native color bindings', () => {
    expect(toNativeColor('#0F0')).toBe('#00ff00');
    expect(toNativeColor('nope')).toBe(DEFAULT_COLOR_HEX);
  });

  it('treats only 6-digit hex as complete while typing', () => {
    expect(isFullHex('#aabbcc')).toBe(true);
    expect(isFullHex('#abc')).toBe(false);
    expect(isFullHex('#aabb')).toBe(false);
  });
});
