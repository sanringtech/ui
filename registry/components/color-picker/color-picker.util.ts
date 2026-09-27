export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const COLOR_FORMATS = ['hex', 'rgb', 'hsl'] as const satisfies readonly ColorFormat[];
export const DEFAULT_COLOR: Rgba = { r: 0, g: 0, b: 0, a: 1 };
export const DEFAULT_COLOR_HEX = '#000000';

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const FULL_HEX = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGB =
  /^rgba?\(\s*([+-]?\d*\.?\d+)\s*[, ]\s*([+-]?\d*\.?\d+)\s*[, ]\s*([+-]?\d*\.?\d+)(?:\s*[,/]\s*([+-]?\d*\.?\d+%?))?\s*\)$/i;
const HSL =
  /^hsla?\(\s*([+-]?\d*\.?\d+)(?:deg)?\s*[, ]\s*([+-]?\d*\.?\d+)%\s*[, ]\s*([+-]?\d*\.?\d+)%(?:\s*[,/]\s*([+-]?\d*\.?\d+%?))?\s*\)$/i;

export function clampByte(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function rgbaEqual(left: Rgba, right: Rgba): boolean {
  return (
    left.r === right.r &&
    left.g === right.g &&
    left.b === right.b &&
    Math.abs(left.a - right.a) < 0.005
  );
}

export function parseAlpha(value: string | undefined): number {
  if (value == null || value === '') return 1;
  if (value.endsWith('%')) return clamp01(Number.parseFloat(value) / 100);
  return clamp01(Number.parseFloat(value));
}

export function parseColor(value: string | null | undefined): Rgba | null {
  if (typeof value !== 'string') return null;
  const raw = value.trim();

  const hex = HEX.exec(raw);
  if (hex) return parseHexDigits(hex[1]);

  const rgb = RGB.exec(raw);
  if (rgb) {
    return {
      r: clampByte(Number.parseFloat(rgb[1])),
      g: clampByte(Number.parseFloat(rgb[2])),
      b: clampByte(Number.parseFloat(rgb[3])),
      a: parseAlpha(rgb[4]),
    };
  }

  const hsl = HSL.exec(raw);
  if (hsl) {
    return hslToRgb(
      Number.parseFloat(hsl[1]),
      Number.parseFloat(hsl[2]),
      Number.parseFloat(hsl[3]),
      parseAlpha(hsl[4]),
    );
  }

  return null;
}

export function formatColor(color: Rgba, format: ColorFormat): string {
  if (format === 'rgb') {
    return color.a < 1
      ? `rgba(${color.r}, ${color.g}, ${color.b}, ${formatAlpha(color.a)})`
      : `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  if (format === 'hsl') {
    const hsl = rgbToHsl(color);
    const h = Math.round(hsl.h);
    const s = Math.round(hsl.s);
    const l = Math.round(hsl.l);
    return color.a < 1 ? `hsl(${h} ${s}% ${l}% / ${formatAlpha(color.a)})` : `hsl(${h} ${s}% ${l}%)`;
  }

  const body = `${hexByte(color.r)}${hexByte(color.g)}${hexByte(color.b)}`;
  return color.a < 1 ? `#${body}${hexByte(Math.round(color.a * 255))}` : `#${body}`;
}

export function toNativeHex(color: Rgba): string {
  return formatColor({ ...color, a: 1 }, 'hex');
}

export function toPreviewCss(color: Rgba): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}

export function isCompleteColorInput(value: string): boolean {
  const raw = value.trim();
  if (FULL_HEX.test(raw)) return true;
  return RGB.test(raw) || HSL.test(raw);
}

export function normalizeHex(value: string | null | undefined): string | null {
  const parsed = parseColor(value);
  if (!parsed) return null;
  return formatColor({ ...parsed, a: 1 }, 'hex');
}

export function toNativeColor(value: string | null | undefined): string {
  return normalizeHex(value) ?? DEFAULT_COLOR_HEX;
}

export function isFullHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value.trim());
}

export function rgbToHsl(color: Rgba): { h: number; s: number; l: number; a: number } {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100, a: color.a };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s: s * 100, l: l * 100, a: color.a };
}

export function hslToRgb(h: number, s: number, l: number, a = 1): Rgba {
  const hue = (((h % 360) + 360) % 360) / 360;
  const sat = clamp01(s / 100);
  const light = clamp01(l / 100);
  if (sat === 0) {
    const value = clampByte(light * 255);
    return { r: value, g: value, b: value, a: clamp01(a) };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let next = t;
    if (next < 0) next += 1;
    if (next > 1) next -= 1;
    if (next < 1 / 6) return p + (q - p) * 6 * next;
    if (next < 1 / 2) return q;
    if (next < 2 / 3) return p + (q - p) * (2 / 3 - next) * 6;
    return p;
  };

  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const p = 2 * light - q;
  return {
    r: clampByte(hue2rgb(p, q, hue + 1 / 3) * 255),
    g: clampByte(hue2rgb(p, q, hue) * 255),
    b: clampByte(hue2rgb(p, q, hue - 1 / 3) * 255),
    a: clamp01(a),
  };
}

function parseHexDigits(digits: string): Rgba {
  if (digits.length === 3 || digits.length === 4) {
    const [r, g, b, a] = digits;
    return {
      r: Number.parseInt(r + r, 16),
      g: Number.parseInt(g + g, 16),
      b: Number.parseInt(b + b, 16),
      a: a ? Number.parseInt(a + a, 16) / 255 : 1,
    };
  }

  return {
    r: Number.parseInt(digits.slice(0, 2), 16),
    g: Number.parseInt(digits.slice(2, 4), 16),
    b: Number.parseInt(digits.slice(4, 6), 16),
    a: digits.length === 8 ? Number.parseInt(digits.slice(6, 8), 16) / 255 : 1,
  };
}

function hexByte(value: number): string {
  return clampByte(value).toString(16).padStart(2, '0');
}

function formatAlpha(value: number): string {
  const rounded = Math.round(clamp01(value) * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}
