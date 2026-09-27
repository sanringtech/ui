import {
  DEFAULT_COLOR_HEX,
  formatColor,
  isCompleteColorInput,
  isFullHex,
  normalizeHex,
  parseColor,
  toNativeColor,
  toNativeHex,
} from './color-picker.util';

describe('color-picker.util', () => {
  it('parses hex, rgb, and hsl including alpha', () => {
    expect(parseColor('#2563eb')).toEqual({ r: 37, g: 99, b: 235, a: 1 });
    expect(parseColor('#ABC')).toEqual({ r: 170, g: 187, b: 204, a: 1 });
    expect(parseColor('#2563eb80')).toEqual({ r: 37, g: 99, b: 235, a: 128 / 255 });
    expect(parseColor('rgb(37, 99, 235)')).toEqual({ r: 37, g: 99, b: 235, a: 1 });
    expect(parseColor('rgba(37 99 235 / 50%)')).toEqual({ r: 37, g: 99, b: 235, a: 0.5 });
    expect(formatColor(parseColor('#2563eb')!, 'hsl')).toBe('hsl(221 83% 53%)');
  });

  it('rejects named colors and incomplete values', () => {
    expect(parseColor('red')).toBeNull();
    expect(parseColor('oklch(0.5 0.1 250)')).toBeNull();
    expect(parseColor('#12')).toBeNull();
    expect(parseColor('rgb(37, 99)')).toBeNull();
  });

  it('formats hex, rgb, and hsl, adding alpha only when needed', () => {
    const blue = { r: 37, g: 99, b: 235, a: 1 };
    expect(formatColor(blue, 'hex')).toBe('#2563eb');
    expect(formatColor(blue, 'rgb')).toBe('rgb(37, 99, 235)');
    expect(formatColor(blue, 'hsl')).toBe('hsl(221 83% 53%)');
    expect(formatColor({ ...blue, a: 0.5 }, 'hex')).toBe('#2563eb80');
    expect(formatColor({ ...blue, a: 0.5 }, 'rgb')).toBe('rgba(37, 99, 235, 0.5)');
    expect(formatColor({ ...blue, a: 0.5 }, 'hsl')).toBe('hsl(221 83% 53% / 0.5)');
  });

  it('keeps native color bindings on opaque #rrggbb', () => {
    expect(toNativeHex({ r: 37, g: 99, b: 235, a: 0.5 })).toBe('#2563eb');
    expect(toNativeColor('#0F0')).toBe('#00ff00');
    expect(toNativeColor('nope')).toBe(DEFAULT_COLOR_HEX);
  });

  it('treats complete hex, rgb, and hsl as committable while typing', () => {
    expect(isCompleteColorInput('#aabbcc')).toBe(true);
    expect(isCompleteColorInput('#aabbcc80')).toBe(true);
    expect(isCompleteColorInput('rgb(37, 99, 235)')).toBe(true);
    expect(isCompleteColorInput('#abc')).toBe(false);
    expect(isCompleteColorInput('rgb(37, 99)')).toBe(false);
    expect(isFullHex('#aabbcc')).toBe(true);
    expect(isFullHex('#abc')).toBe(false);
  });

  it('still normalizes short hex to opaque #rrggbb', () => {
    expect(normalizeHex('#ABC')).toBe('#aabbcc');
    expect(normalizeHex(null)).toBeNull();
  });
});
