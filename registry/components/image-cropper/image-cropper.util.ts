/** Crop rectangle in the source image's natural pixel space. */
export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropBounds {
  width: number;
  height: number;
}

export type CropHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export const CROP_HANDLES: readonly CropHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

export type ImageCropperFormat = 'image/png' | 'image/jpeg' | 'image/webp';

export const IMAGE_CROPPER_FORMATS: readonly ImageCropperFormat[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
];

const FORMAT_EXTENSIONS: Record<ImageCropperFormat, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

const FORMAT_LABELS: Record<ImageCropperFormat, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/webp': 'WebP',
};

export function isImageCropperFormat(value: unknown): value is ImageCropperFormat {
  return typeof value === 'string' && (IMAGE_CROPPER_FORMATS as readonly string[]).includes(value);
}

export function formatExtension(format: ImageCropperFormat): string {
  return FORMAT_EXTENSIONS[format];
}

export function formatLabel(format: ImageCropperFormat): string {
  return FORMAT_LABELS[format];
}

/** PNG is lossless; quality only affects JPEG and WebP. */
export function isLossyFormat(format: ImageCropperFormat): boolean {
  return format !== 'image/png';
}

/** JPEG has no alpha channel, so transparent pixels need a fill color. */
export function supportsTransparency(format: ImageCropperFormat): boolean {
  return format !== 'image/jpeg';
}

/** Replaces (or appends) the extension so the name matches the encoded type. */
export function replaceExtension(fileName: string, format: ImageCropperFormat): string {
  const trimmed = fileName.trim() || 'cropped';
  const dot = trimmed.lastIndexOf('.');
  const base = dot > 0 ? trimmed.slice(0, dot) : trimmed;
  return `${base}.${formatExtension(format)}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Largest rect with the given aspect ratio, centered, covering `coverage` of the image. */
export function initialCrop(
  bounds: CropBounds,
  aspectRatio: number | null,
  coverage = 0.8,
): CropRect {
  const scale = clamp(coverage, 0.05, 1);
  let width = bounds.width * scale;
  let height = bounds.height * scale;

  if (aspectRatio && aspectRatio > 0) {
    if (width / height > aspectRatio) width = height * aspectRatio;
    else height = width / aspectRatio;
  }

  return {
    x: (bounds.width - width) / 2,
    y: (bounds.height - height) / 2,
    width,
    height,
  };
}

/** Largest rect with the given aspect ratio that fits the image, centered — zoom 1 in pan-zoom mode. */
export function fitCrop(bounds: CropBounds, aspectRatio: number | null): CropRect {
  return initialCrop(bounds, aspectRatio, 1);
}

/**
 * Resizes a crop to `width` (height follows its ratio) around an anchor in source pixels.
 * The anchor keeps its relative position inside the crop, so the point under the cursor or
 * between two fingers stays put. The result never exceeds the image.
 */
export function zoomCrop(
  start: CropRect,
  width: number,
  anchorX: number,
  anchorY: number,
  bounds: CropBounds,
): CropRect {
  const ratio = start.width / start.height;
  const nextWidth = clamp(width, 1, Math.min(bounds.width, bounds.height * ratio));
  const nextHeight = nextWidth / ratio;
  const fx = (anchorX - start.x) / start.width;
  const fy = (anchorY - start.y) / start.height;
  return clampCrop(
    { x: anchorX - fx * nextWidth, y: anchorY - fy * nextHeight, width: nextWidth, height: nextHeight },
    bounds,
  );
}

/** Keeps a rect inside the bounds, shrinking it first if it is larger than the image. */
export function clampCrop(rect: CropRect, bounds: CropBounds): CropRect {
  const width = clamp(rect.width, 1, bounds.width);
  const height = clamp(rect.height, 1, bounds.height);
  return {
    x: clamp(rect.x, 0, bounds.width - width),
    y: clamp(rect.y, 0, bounds.height - height),
    width,
    height,
  };
}

export function moveCrop(start: CropRect, dx: number, dy: number, bounds: CropBounds): CropRect {
  return clampCrop({ ...start, x: start.x + dx, y: start.y + dy }, bounds);
}

/**
 * Resizes from a handle. The opposite edge (or corner) stays fixed; with an
 * aspect ratio, edge handles grow symmetrically around the center line.
 */
export function resizeCrop(
  start: CropRect,
  handle: CropHandle,
  dx: number,
  dy: number,
  bounds: CropBounds,
  aspectRatio: number | null,
  minSize: number,
): CropRect {
  const hasN = handle.includes('n');
  const hasS = handle.includes('s');
  const hasE = handle.includes('e');
  const hasW = handle.includes('w');
  const left = start.x;
  const top = start.y;
  const right = start.x + start.width;
  const bottom = start.y + start.height;

  if (!aspectRatio || aspectRatio <= 0) {
    const minW = Math.min(minSize, bounds.width);
    const minH = Math.min(minSize, bounds.height);
    let nextLeft = left;
    let nextRight = right;
    let nextTop = top;
    let nextBottom = bottom;
    if (hasE) nextRight = clamp(right + dx, left + minW, bounds.width);
    if (hasW) nextLeft = clamp(left + dx, 0, right - minW);
    if (hasS) nextBottom = clamp(bottom + dy, top + minH, bounds.height);
    if (hasN) nextTop = clamp(top + dy, 0, bottom - minH);
    return {
      x: nextLeft,
      y: nextTop,
      width: nextRight - nextLeft,
      height: nextBottom - nextTop,
    };
  }

  const a = aspectRatio;
  const centerX = left + start.width / 2;
  const centerY = top + start.height / 2;
  const horizontal = hasE || hasW;
  const vertical = hasN || hasS;

  const maxWidthX = hasW ? right : hasE ? bounds.width - left : 2 * Math.min(centerX, bounds.width - centerX);
  const maxHeightY = hasN ? bottom : hasS ? bounds.height - top : 2 * Math.min(centerY, bounds.height - centerY);

  const widthFromX = start.width + (hasE ? dx : -dx);
  const widthFromY = (start.height + (hasS ? dy : -dy)) * a;
  // Corner handles follow whichever axis moved further, so the box can both grow and shrink.
  const desired =
    horizontal && vertical
      ? Math.abs(widthFromX - start.width) >= Math.abs(widthFromY - start.width)
        ? widthFromX
        : widthFromY
      : horizontal
        ? widthFromX
        : widthFromY;

  const maxWidth = Math.min(maxWidthX, maxHeightY * a);
  const minWidth = Math.min(Math.max(minSize, minSize * a), maxWidth);
  const width = clamp(desired, minWidth, maxWidth);
  const height = width / a;

  return {
    x: hasW ? right - width : hasE ? left : centerX - width / 2,
    y: hasN ? bottom - height : hasS ? top : centerY - height / 2,
    width,
    height,
  };
}

/** Re-fits an existing crop to a new aspect ratio around its center. */
export function applyAspectRatio(
  rect: CropRect,
  bounds: CropBounds,
  aspectRatio: number | null,
): CropRect {
  if (!aspectRatio || aspectRatio <= 0) return clampCrop(rect, bounds);
  const area = rect.width * rect.height;
  let width = Math.sqrt(area * aspectRatio);
  let height = width / aspectRatio;
  if (width > bounds.width) {
    width = bounds.width;
    height = width / aspectRatio;
  }
  if (height > bounds.height) {
    height = bounds.height;
    width = height * aspectRatio;
  }
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  return clampCrop({ x: cx - width / 2, y: cy - height / 2, width, height }, bounds);
}

/** Rounds to whole source pixels for display and export. */
export function roundCrop(rect: CropRect): CropRect {
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.max(1, Math.round(rect.width)),
    height: Math.max(1, Math.round(rect.height)),
  };
}

/** Output pixel size: the crop size, or scaled so the width matches `outputWidth`. */
export function outputSize(rect: CropRect, outputWidth: number | null): CropBounds {
  const rounded = roundCrop(rect);
  if (!outputWidth || outputWidth <= 0) return { width: rounded.width, height: rounded.height };
  return {
    width: Math.round(outputWidth),
    height: Math.max(1, Math.round((outputWidth * rect.height) / rect.width)),
  };
}
