import {
  applyAspectRatio,
  clampCrop,
  fitCrop,
  initialCrop,
  moveCrop,
  outputSize,
  replaceExtension,
  resizeCrop,
  zoomCrop,
} from './image-cropper.util';

const bounds = { width: 400, height: 200 };

describe('image-cropper.util', () => {
  it('centers the initial crop and honors the aspect ratio', () => {
    expect(initialCrop(bounds, 1)).toEqual({ x: 120, y: 20, width: 160, height: 160 });
    expect(initialCrop(bounds, null)).toEqual({ x: 40, y: 20, width: 320, height: 160 });
  });

  it('keeps moves inside the image', () => {
    const start = { x: 120, y: 20, width: 160, height: 160 };
    expect(moveCrop(start, 1000, -1000, bounds)).toEqual({ x: 240, y: 0, width: 160, height: 160 });
  });

  it('clamps an oversized rect to the image', () => {
    expect(clampCrop({ x: -10, y: 50, width: 900, height: 100 }, bounds)).toEqual({
      x: 0,
      y: 50,
      width: 400,
      height: 100,
    });
  });

  it('resizes freely from a corner while the opposite corner stays put', () => {
    const start = { x: 100, y: 50, width: 100, height: 100 };
    expect(resizeCrop(start, 'se', 50, 20, bounds, null, 16)).toEqual({
      x: 100,
      y: 50,
      width: 150,
      height: 120,
    });
    expect(resizeCrop(start, 'nw', 500, 500, bounds, null, 16)).toEqual({
      x: 184,
      y: 134,
      width: 16,
      height: 16,
    });
  });

  it('keeps the aspect ratio while resizing and stops at the image edge', () => {
    const start = { x: 100, y: 50, width: 100, height: 50 };
    const grown = resizeCrop(start, 'se', 400, 0, bounds, 2, 16);
    expect(grown.width / grown.height).toBeCloseTo(2);
    expect(grown.y + grown.height).toBeLessThanOrEqual(200);
    expect(grown.x).toBe(100);

    const shrunk = resizeCrop(start, 'se', -40, 0, bounds, 2, 16);
    expect(shrunk).toEqual({ x: 100, y: 50, width: 60, height: 30 });
  });

  it('grows edge handles symmetrically when the ratio is locked', () => {
    const start = { x: 100, y: 50, width: 100, height: 100 };
    const next = resizeCrop(start, 'e', 20, 0, bounds, 1, 16);
    expect(next).toEqual({ x: 100, y: 40, width: 120, height: 120 });
  });

  it('refits an existing crop to a new ratio around its center', () => {
    const next = applyAspectRatio({ x: 100, y: 50, width: 100, height: 100 }, bounds, 4);
    expect(next.width / next.height).toBeCloseTo(4);
    expect(next.x + next.width / 2).toBeCloseTo(150);
  });

  it('computes output size and file names', () => {
    expect(outputSize({ x: 0, y: 0, width: 300.4, height: 150.2 }, null)).toEqual({
      width: 300,
      height: 150,
    });
    expect(outputSize({ x: 0, y: 0, width: 300, height: 150 }, 120)).toEqual({ width: 120, height: 60 });
    expect(replaceExtension('avatar.png', 'image/jpeg')).toBe('avatar.jpg');
    expect(replaceExtension('photo', 'image/webp')).toBe('photo.webp');
    expect(replaceExtension('  ', 'image/png')).toBe('cropped.png');
  });

  it('fits the largest crop with the ratio for zoom 1', () => {
    expect(fitCrop(bounds, 1)).toEqual({ x: 100, y: 0, width: 200, height: 200 });
    expect(fitCrop(bounds, 4)).toEqual({ x: 0, y: 50, width: 400, height: 100 });
  });

  it('zooms around an anchor that keeps its place in the crop', () => {
    const start = { x: 100, y: 0, width: 200, height: 200 };
    // Anchor at the crop center: halving the width keeps the center.
    expect(zoomCrop(start, 100, 200, 100, bounds)).toEqual({ x: 150, y: 50, width: 100, height: 100 });
    // Anchor at the top-left quarter point stays at the same relative spot.
    expect(zoomCrop(start, 100, 150, 50, bounds)).toEqual({ x: 125, y: 25, width: 100, height: 100 });
  });

  it('never zooms out past the image and keeps the ratio', () => {
    const start = { x: 150, y: 50, width: 100, height: 100 };
    const next = zoomCrop(start, 1000, 200, 100, bounds);
    expect(next).toEqual({ x: 100, y: 0, width: 200, height: 200 });
  });
});
