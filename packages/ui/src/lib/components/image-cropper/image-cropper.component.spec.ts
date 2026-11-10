import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { ImageCropperComponent } from './image-cropper.component';
import { ImageCropperFormatComponent } from './image-cropper-format.component';
import { ImageCropperPreviewComponent } from './image-cropper-preview.component';
import type { CropRect, ImageCropperFormat } from './image-cropper.util';

const PNG_SRC = 'data:image/png;base64,iVBORw0KGgo=';
const JPEG_SRC = 'data:image/jpeg;base64,/9j/4AAQ';

@Component({
  imports: [ImageCropperComponent, ImageCropperPreviewComponent, ImageCropperFormatComponent],
  template: `
    <sanring-image-cropper
      #cropper="sanringImageCropper"
      class="custom-class"
      [src]="src()"
      [aspectRatio]="aspectRatio()"
      [shape]="shape()"
      [disabled]="disabled()"
      [(crop)]="crop"
      [(format)]="format"
    >
      <sanring-image-cropper-preview [size]="100" />
      <sanring-image-cropper-format />
    </sanring-image-cropper>
    <sanring-image-cropper-preview class="external" [for]="cropper" [size]="50" />
  `,
})
class ImageCropperTestHost {
  readonly src = signal<string | null>(PNG_SRC);
  readonly aspectRatio = signal<number | null>(1);
  readonly shape = signal<'rect' | 'circle'>('rect');
  readonly disabled = signal(false);
  readonly crop = signal<CropRect | null>(null);
  readonly format = signal<ImageCropperFormat | null>(null);
}

function loadImage(fixture: ComponentFixture<ImageCropperTestHost>, width = 400, height = 200): void {
  fixture.detectChanges();
  const image = fixture.nativeElement.querySelector('sanring-image-cropper img') as HTMLImageElement;
  Object.defineProperty(image, 'naturalWidth', { configurable: true, value: width });
  Object.defineProperty(image, 'naturalHeight', { configurable: true, value: height });
  image.dispatchEvent(new Event('load'));
  fixture.detectChanges();
}

function box(fixture: ComponentFixture<ImageCropperTestHost>): HTMLElement {
  return fixture.nativeElement.querySelector('[aria-roledescription="crop area"]') as HTMLElement;
}

function pointer(type: string, clientX: number, clientY: number): MouseEvent {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX, clientY, button: 0 });
  Object.defineProperty(event, 'pointerId', { value: 1 });
  return event;
}

function key(target: HTMLElement, keyName: string, init: KeyboardEventInit = {}): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: keyName, bubbles: true, ...init }));
}

describe('ImageCropperComponent', () => {
  beforeEach(async () => {
    // jsdom has no encoder: report PNG and JPEG as supported and WebP as falling back to PNG.
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(function (type?: string) {
      return type === 'image/webp' ? 'data:image/png;base64,' : `data:${type ?? 'image/png'};base64,`;
    });
    await TestBed.configureTestingModule({ imports: [ImageCropperTestHost] }).compileComponents();
  });

  afterEach(() => vi.restoreAllMocks());

  it('shows the empty label when there is no image', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    fixture.componentInstance.src.set(null);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No image selected');
    expect(box(fixture)).toBeNull();
  });

  it('merges the consumer class onto the host', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('sanring-image-cropper') as HTMLElement;
    expect(host.classList).toContain('block');
    expect(host.classList).toContain('custom-class');
  });

  it('creates a centered crop on load and exposes it through [(crop)]', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    loadImage(fixture);

    expect(fixture.componentInstance.crop()).toEqual({ x: 120, y: 20, width: 160, height: 160 });
    expect(box(fixture).style.left).toBe('30%');
    expect(box(fixture).style.width).toBe('40%');
  });

  it('labels the crop area and links the keyboard instructions', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    loadImage(fixture);
    const area = box(fixture);

    expect(area.getAttribute('role')).toBe('group');
    expect(area.getAttribute('aria-label')).toBe('Crop area');
    expect(area.getAttribute('tabindex')).toBe('0');
    const instructions = document.getElementById(area.getAttribute('aria-describedby')!) ??
      fixture.nativeElement.querySelector(`#${area.getAttribute('aria-describedby')}`);
    expect(instructions?.textContent).toContain('arrow keys');
  });

  it('moves with arrow keys, faster with Shift, and resizes with Alt', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    loadImage(fixture);
    const area = box(fixture);

    key(area, 'ArrowRight');
    expect(fixture.componentInstance.crop()).toEqual({ x: 121, y: 20, width: 160, height: 160 });

    key(area, 'ArrowDown', { shiftKey: true });
    expect(fixture.componentInstance.crop()).toEqual({ x: 121, y: 30, width: 160, height: 160 });

    key(area, 'ArrowLeft', { altKey: true });
    const resized = fixture.componentInstance.crop()!;
    expect(resized.width).toBe(159);
    expect(resized.height).toBe(159);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-live="polite"]').textContent).toContain('159 × 159');
  });

  it('drags the crop area and resizes from a handle', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    fixture.componentInstance.aspectRatio.set(null);
    loadImage(fixture);
    const area = box(fixture);
    const start = fixture.componentInstance.crop()!;

    area.dispatchEvent(pointer('pointerdown', 0, 0));
    area.dispatchEvent(pointer('pointermove', 10, 5));
    area.dispatchEvent(pointer('pointerup', 10, 5));
    expect(fixture.componentInstance.crop()).toEqual({ ...start, x: start.x + 10, y: start.y + 5 });

    const handle = area.querySelector('[data-handle="se"]') as HTMLElement;
    handle.dispatchEvent(pointer('pointerdown', 0, 0));
    area.dispatchEvent(pointer('pointermove', -20, -10));
    area.dispatchEvent(pointer('pointerup', -20, -10));
    const resized = fixture.componentInstance.crop()!;
    expect(resized.width).toBe(start.width - 20);
    expect(resized.height).toBe(start.height - 10);
  });

  it('ignores interaction when disabled', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    fixture.componentInstance.disabled.set(true);
    loadImage(fixture);
    const area = box(fixture);
    const before = fixture.componentInstance.crop();

    expect(area.getAttribute('tabindex')).toBe('-1');
    expect(area.getAttribute('aria-disabled')).toBe('true');
    expect(area.querySelector('[data-handle]')).toBeNull();
    key(area, 'ArrowRight');
    expect(fixture.componentInstance.crop()).toEqual(before);
  });

  it('refits the crop when the aspect ratio changes', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    loadImage(fixture);
    fixture.componentInstance.aspectRatio.set(16 / 9);
    fixture.detectChanges();

    const crop = fixture.componentInstance.crop()!;
    expect(crop.width / crop.height).toBeCloseTo(16 / 9);
  });

  it('renders the preview at the crop ratio, inside and outside the cropper', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    fixture.componentInstance.aspectRatio.set(2);
    loadImage(fixture);

    const inner = fixture.nativeElement.querySelector(
      'sanring-image-cropper sanring-image-cropper-preview',
    ) as HTMLElement;
    expect(inner.getAttribute('role')).toBe('img');
    // The host stays square so the layout never shifts; the frame follows the crop ratio.
    expect(inner.style.width).toBe('100px');
    expect(inner.style.height).toBe('100px');
    const frame = inner.querySelector('[data-preview-frame]') as HTMLElement;
    expect(frame.style.width).toBe('100px');
    expect(frame.style.height).toBe('50px');
    const img = inner.querySelector('img') as HTMLImageElement;
    const crop = fixture.componentInstance.crop()!;
    const scale = 100 / crop.width;
    expect(parseFloat(img.style.width)).toBeCloseTo(400 * scale);
    expect(parseFloat(img.style.left)).toBeCloseTo(-crop.x * scale);

    const external = fixture.nativeElement.querySelector('.external') as HTMLElement;
    expect(external.style.width).toBe('50px');
    expect(external.querySelector('img')).not.toBeNull();
  });

  it('rounds the preview for circle crops', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    fixture.componentInstance.shape.set('circle');
    loadImage(fixture);

    expect(box(fixture).classList).toContain('rounded-full');
    // The dim overlay cuts an ellipse (arc commands) instead of a rectangle.
    const mask = fixture.nativeElement.querySelector('sanring-image-cropper svg path') as SVGPathElement;
    expect(mask.getAttribute('d')).toMatch(/^M0 0H100V100H0ZM.*a.*a.*Z$/);
    expect(
      fixture.nativeElement.querySelector('.external [data-preview-frame]').classList,
    ).toContain('rounded-full');
  });

  it('defaults to the source format and disables formats the browser cannot encode', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    fixture.componentInstance.src.set(JPEG_SRC);
    loadImage(fixture);

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('sanring-image-cropper-format button'),
    ) as HTMLButtonElement[];
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(['PNG', 'JPG', 'WebP']);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[2].disabled).toBe(true);
    expect(buttons[2].title).toBe('Not supported by this browser');
  });

  it('switches format, showing quality for lossy output and a fill color for JPEG', () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    loadImage(fixture);
    const picker = fixture.nativeElement.querySelector('sanring-image-cropper-format') as HTMLElement;

    expect(picker.querySelector('input[type="range"]')).toBeNull();
    expect(picker.querySelector('input[type="color"]')).toBeNull();

    (picker.querySelectorAll('button')[1] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.format()).toBe('image/jpeg');
    const quality = picker.querySelector('input[type="range"]') as HTMLInputElement;
    expect(quality.value).toBe('92');
    expect(picker.querySelector('input[type="color"]')).not.toBeNull();

    quality.value = '70';
    quality.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(picker.textContent).toContain('70%');
    // JPEG flattens transparency, so the preview shows the fill color.
    const preview = fixture.nativeElement.querySelector('.external [data-preview-frame]') as HTMLElement;
    expect(preview.style.backgroundColor).toBe('rgb(255, 255, 255)');
  });

  it('exports a File named after the encoded type', async () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    loadImage(fixture);
    const cropper = fixture.debugElement.children[0].componentInstance as ImageCropperComponent;

    const context = {
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      ellipse: vi.fn(),
      clip: vi.fn(),
      drawImage: vi.fn(),
      fillStyle: '',
      imageSmoothingQuality: 'low',
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    const toBlob = vi
      .spyOn(HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation(function (callback: BlobCallback, type?: string) {
        callback(new Blob(['x'], { type: type ?? 'image/png' }));
      });

    fixture.componentInstance.format.set('image/jpeg');
    fixture.detectChanges();
    const file = await cropper.export({ fileName: 'avatar.png' });

    expect(file.name).toBe('avatar.jpg');
    expect(file.type).toBe('image/jpeg');
    expect(toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg', 0.92);
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 160, 160);
    expect(context.drawImage).toHaveBeenCalledWith(expect.anything(), 120, 20, 160, 160, 0, 0, 160, 160);
  });

  it('rejects export before an image has loaded', async () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    fixture.componentInstance.src.set(null);
    fixture.detectChanges();
    const cropper = fixture.debugElement.children[0].componentInstance as ImageCropperComponent;

    await expect(cropper.export()).rejects.toThrow('needs a loaded image');
  });

  it('has no axe violations', async () => {
    const fixture = TestBed.createComponent(ImageCropperTestHost);
    loadImage(fixture);
    await expectNoA11yViolations(fixture.nativeElement);
  });
});
