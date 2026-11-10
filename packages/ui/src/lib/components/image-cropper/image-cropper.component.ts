import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { cn } from '../../utils';
import { SELECTION_CONTROL_FOCUS_CLASS } from '../component-styles';
import {
  CROP_HANDLES,
  type CropBounds,
  type CropHandle,
  type CropRect,
  IMAGE_CROPPER_FORMATS,
  type ImageCropperFormat,
  applyAspectRatio,
  clampCrop,
  initialCrop,
  isImageCropperFormat,
  isLossyFormat,
  moveCrop,
  outputSize,
  replaceExtension,
  resizeCrop,
  roundCrop,
  supportsTransparency,
} from './image-cropper.util';

export type ImageCropperSource = File | Blob | string | null | undefined;
export type ImageCropperShape = 'rect' | 'circle';

interface DragState {
  pointerId: number;
  handle: CropHandle | null;
  startX: number;
  startY: number;
  start: CropRect;
  scale: number;
}

const HANDLE_POSITION: Record<CropHandle, string> = {
  nw: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize',
  n: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize',
  ne: 'right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize',
  e: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
  se: 'right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize',
  s: 'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-ns-resize',
  sw: 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize',
  w: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize',
};

function aspectRatioAttribute(value: unknown): number | null {
  if (value === null || value === undefined || value === '' || value === 'free') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function nullablePositiveNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = numberAttribute(value, Number.NaN);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function sourceFormatOf(src: ImageCropperSource): ImageCropperFormat | null {
  if (src instanceof Blob) return isImageCropperFormat(src.type) ? src.type : null;
  if (typeof src === 'string') {
    const match = /^data:([^;,]+)/.exec(src);
    if (match && isImageCropperFormat(match[1])) return match[1];
  }
  return null;
}

/** Encodes a 1×1 canvas once per type to see which formats this browser can actually write. */
export function detectSupportedFormats(): ReadonlySet<ImageCropperFormat> {
  const supported = new Set<ImageCropperFormat>(['image/png']);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    for (const format of IMAGE_CROPPER_FORMATS) {
      const url = canvas.toDataURL(format);
      if (typeof url === 'string' && url.startsWith(`data:${format}`)) supported.add(format);
    }
  } catch {
    // Keep the PNG-only fallback.
  }
  return supported;
}

@Component({
  selector: 'sanring-image-cropper',
  standalone: true,
  exportAs: 'sanringImageCropper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
  },
  template: `
    <div
      class="relative inline-block max-w-full touch-none select-none overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--sanring-border)] bg-[length:16px_16px] bg-[repeating-conic-gradient(#e5e5e5_0_25%,#fff_0_50%)] align-top"
      [class.opacity-60]="isDisabled()"
    >
      @if (imageUrl(); as url) {
        <img
          #image
          [src]="url"
          [attr.crossorigin]="crossOrigin()"
          alt=""
          draggable="false"
          class="pointer-events-none block h-auto max-h-[var(--sanring-image-cropper-max-height,24rem)] max-w-full"
          (load)="onImageLoad()"
          (error)="onImageError()"
        />

        @if (cropPercent(); as box) {
          <svg
            class="pointer-events-none absolute inset-0 size-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path fill="rgb(0 0 0 / 0.6)" fill-rule="evenodd" [attr.d]="maskPath()" />
          </svg>
          <div
            #box
            role="group"
            aria-roledescription="crop area"
            [attr.tabindex]="isDisabled() ? -1 : 0"
            [attr.aria-label]="cropAreaLabel()"
            [attr.aria-describedby]="instructionsId()"
            [attr.aria-disabled]="isDisabled() ? 'true' : null"
            [class]="boxClass()"
            [style.left.%]="box.left"
            [style.top.%]="box.top"
            [style.width.%]="box.width"
            [style.height.%]="box.height"
            (pointerdown)="onPointerDown($event, null)"
            (pointermove)="onPointerMove($event)"
            (pointerup)="onPointerEnd($event)"
            (pointercancel)="onPointerEnd($event)"
            (keydown)="onKeydown($event)"
          >
            @if (guides()) {
              <span
                class="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3"
                [class.overflow-hidden]="shape() === 'circle'"
                [class.rounded-full]="shape() === 'circle'"
                aria-hidden="true"
              >
                @for (cell of guideCells; track cell) {
                  <span class="border-[0.5px] border-white/40"></span>
                }
              </span>
            }
            @if (!isDisabled()) {
              @for (handle of handles; track handle) {
                <span
                  [class]="handleClass(handle)"
                  [attr.data-handle]="handle"
                  aria-hidden="true"
                  (pointerdown)="onPointerDown($event, handle)"
                ></span>
              }
            }
          </div>
        }
      } @else {
        <div
          class="flex h-48 w-72 max-w-full items-center justify-center bg-[var(--sanring-surface)] px-4 text-center text-sm text-[var(--sanring-muted)]"
        >
          <ng-content select="[sanringImageCropperEmpty]">{{ emptyLabel() }}</ng-content>
        </div>
      }
    </div>
    <span [id]="instructionsId()" class="sr-only">{{ instructions() }}</span>
    <span class="sr-only" aria-live="polite">{{ announcement() }}</span>
    <ng-content />
  `,
})
export class ImageCropperComponent {
  // ==========================================
  // Inputs
  // ==========================================
  readonly class = input<string | undefined>();
  readonly id = input(inject(_IdGenerator).getId('sanring-image-cropper-', true));
  /** Image to crop: a File/Blob (e.g. from file-upload), or a URL / data URL. */
  readonly src = input<ImageCropperSource>(null);
  /** Width ÷ height. `null` or `'free'` lets the user crop any shape. */
  readonly aspectRatio = input<number | null, unknown>(null, { transform: aspectRatioAttribute });
  /** Minimum crop width and height in source pixels. */
  readonly minSize = input(16, { transform: numberAttribute });
  /** `'circle'` masks the preview and, for PNG / WebP, clears the exported corners. */
  readonly shape = input<ImageCropperShape>('rect');
  /** Scales the export so its width matches; height follows the crop ratio. */
  readonly outputWidth = input<number | null, unknown>(null, { transform: nullablePositiveNumber });
  /** Formats offered by the format picker, in order. */
  readonly formats = input<readonly ImageCropperFormat[]>(IMAGE_CROPPER_FORMATS);
  /** File name used by export(). The extension is replaced to match the format. */
  readonly fileName = input<string | undefined>();
  /** Needed for remote URLs; the server must send CORS headers or export() fails. */
  readonly crossOrigin = input<'anonymous' | 'use-credentials' | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly guides = input(true, { transform: booleanAttribute });
  readonly cropAreaLabel = input('Crop area');
  readonly instructions = input(
    'Use the arrow keys to move the crop area. Hold Alt (Option) with the arrow keys to resize. Hold Shift to move in larger steps.',
  );
  readonly emptyLabel = input('No image selected');

  // ==========================================
  // Models
  // ==========================================
  /** Crop rectangle in source pixels. `null` until an image loads. */
  readonly crop = model<CropRect | null>(null);
  /** Requested output format. `null` keeps the source format when it is offered. */
  readonly format = model<ImageCropperFormat | null>(null);
  /** Encoder quality between 0 and 1 for JPEG and WebP. */
  readonly quality = model(0.92);
  /** Fill color for transparent pixels when the output is JPEG. */
  readonly background = model('#ffffff');

  // ==========================================
  // Outputs
  // ==========================================
  readonly loaded = output<CropBounds>();
  readonly loadError = output<void>();

  // ==========================================
  // State shared with preview / format
  // ==========================================
  readonly imageUrl = signal<string | null>(null);
  readonly naturalSize = signal<CropBounds | null>(null);
  /** `null` until detection runs in the browser; every format is treated as available meanwhile. */
  readonly supportedFormats = signal<ReadonlySet<ImageCropperFormat> | null>(null);
  readonly isDisabled = computed(() => this.disabled());
  readonly sourceFormat = computed(() => sourceFormatOf(this.src()));
  readonly availableFormats = computed(() => {
    const supported = this.supportedFormats();
    return this.formats().filter((format) => !supported || supported.has(format));
  });
  readonly effectiveFormat = computed<ImageCropperFormat>(() => {
    const available = this.availableFormats();
    const requested = this.format();
    if (requested && available.includes(requested)) return requested;
    const source = this.sourceFormat();
    if (source && available.includes(source)) return source;
    return available[0] ?? 'image/png';
  });
  readonly outputSize = computed(() => {
    const crop = this.crop();
    return crop ? outputSize(crop, this.outputWidth()) : null;
  });

  protected readonly handles = CROP_HANDLES;
  protected readonly guideCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  protected readonly instructionsId = computed(() => `${this.id()}-instructions`);
  protected readonly announcement = signal('');
  protected readonly hostClass = computed(() => cn('block', this.class()));
  protected readonly boxClass = computed(() =>
    cn(
      'absolute outline-none ring-1 ring-white/90',
      SELECTION_CONTROL_FOCUS_CLASS,
      'focus-visible:ring-offset-0',
      this.shape() === 'circle' && 'rounded-full',
      this.isDisabled() ? 'cursor-not-allowed' : 'cursor-move',
    ),
  );
  protected readonly cropPercent = computed(() => {
    const crop = this.crop();
    const size = this.naturalSize();
    if (!crop || !size) return null;
    return {
      left: (crop.x / size.width) * 100,
      top: (crop.y / size.height) * 100,
      width: (crop.width / size.width) * 100,
      height: (crop.height / size.height) * 100,
    };
  });

  /** Dark overlay with the crop shape cut out (evenodd), in the stage's 0–100 viewBox. */
  protected readonly maskPath = computed(() => {
    const box = this.cropPercent();
    if (!box) return '';
    const outer = 'M0 0H100V100H0Z';
    if (this.shape() === 'circle') {
      const rx = box.width / 2;
      const ry = box.height / 2;
      const cy = box.top + ry;
      return `${outer}M${box.left} ${cy}a${rx} ${ry} 0 1 0 ${box.width} 0a${rx} ${ry} 0 1 0 ${-box.width} 0Z`;
    }
    return `${outer}M${box.left} ${box.top}h${box.width}v${box.height}h${-box.width}Z`;
  });

  private readonly imageRef = viewChild<ElementRef<HTMLImageElement>>('image');
  private readonly boxRef = viewChild<ElementRef<HTMLElement>>('box');
  private drag: DragState | null = null;
  private previousSource: ImageCropperSource = undefined;

  constructor() {
    effect((onCleanup) => {
      const src = this.src();
      untracked(() => {
        // A new image invalidates the previous crop; the very first source keeps a consumer-provided one.
        if (this.previousSource !== undefined && this.previousSource !== src) this.crop.set(null);
        this.previousSource = src;
        this.naturalSize.set(null);
      });

      if (src instanceof Blob) {
        const url = URL.createObjectURL(src);
        this.imageUrl.set(url);
        onCleanup(() => URL.revokeObjectURL(url));
      } else {
        this.imageUrl.set(src || null);
      }
    });

    effect(() => {
      const aspectRatio = this.aspectRatio();
      untracked(() => {
        const size = this.naturalSize();
        const crop = this.crop();
        if (size && crop) this.crop.set(applyAspectRatio(crop, size, aspectRatio));
      });
    });

    afterNextRender(() => this.supportedFormats.set(detectSupportedFormats()));
  }

  focus(options?: FocusOptions): void {
    this.boxRef()?.nativeElement.focus(options);
  }

  /** Restores the default centered crop for the current image. */
  reset(): void {
    const size = this.naturalSize();
    if (size) this.crop.set(initialCrop(size, this.aspectRatio()));
  }

  /** Draws the crop to a canvas and encodes it in the selected format. */
  async export(options: { fileName?: string } = {}): Promise<File> {
    const image = this.imageRef()?.nativeElement;
    const crop = this.crop();
    const size = this.naturalSize();
    if (!image || !crop || !size) {
      throw new Error('[sanring-image-cropper] export() needs a loaded image.');
    }

    const format = this.effectiveFormat();
    const source = clampCrop(roundCrop(crop), size);
    const out = outputSize(source, this.outputWidth());

    const canvas = document.createElement('canvas');
    canvas.width = out.width;
    canvas.height = out.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('[sanring-image-cropper] Canvas 2D is not available.');

    if (!supportsTransparency(format)) {
      context.fillStyle = this.background();
      context.fillRect(0, 0, out.width, out.height);
    }
    if (this.shape() === 'circle') {
      context.beginPath();
      context.ellipse(out.width / 2, out.height / 2, out.width / 2, out.height / 2, 0, 0, Math.PI * 2);
      context.clip();
    }
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, source.x, source.y, source.width, source.height, 0, 0, out.width, out.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, format, isLossyFormat(format) ? this.quality() : undefined),
    );
    if (!blob) throw new Error('[sanring-image-cropper] The browser could not encode the image.');

    // Browsers silently fall back to PNG for types they cannot encode; name the file after what we got.
    const actual = isImageCropperFormat(blob.type) ? blob.type : format;
    const src = this.src();
    const baseName =
      options.fileName ?? this.fileName() ?? (src instanceof File ? src.name : undefined) ?? 'cropped';
    return new File([blob], replaceExtension(baseName, actual), { type: actual });
  }

  protected handleClass(handle: CropHandle): string {
    return cn(
      'absolute size-3 rounded-full border border-[var(--sanring-border-strong)] bg-white shadow-sm',
      'before:absolute before:-inset-2 before:content-[""]',
      HANDLE_POSITION[handle],
    );
  }

  protected onImageLoad(): void {
    const image = this.imageRef()?.nativeElement;
    if (!image || !image.naturalWidth || !image.naturalHeight) return;
    const size = { width: image.naturalWidth, height: image.naturalHeight };
    this.naturalSize.set(size);

    const current = this.crop();
    const fits =
      current !== null &&
      current.x >= 0 &&
      current.y >= 0 &&
      current.x + current.width <= size.width &&
      current.y + current.height <= size.height;
    this.crop.set(fits ? applyAspectRatio(current, size, this.aspectRatio()) : initialCrop(size, this.aspectRatio()));
    this.announce();
    this.loaded.emit(size);
  }

  protected onImageError(): void {
    this.naturalSize.set(null);
    this.loadError.emit();
  }

  protected onPointerDown(event: PointerEvent, handle: CropHandle | null): void {
    const crop = this.crop();
    if (this.isDisabled() || !crop || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as Element).setPointerCapture?.(event.pointerId);
    this.boxRef()?.nativeElement.focus({ preventScroll: true });
    this.drag = {
      pointerId: event.pointerId,
      handle,
      startX: event.clientX,
      startY: event.clientY,
      start: crop,
      scale: this.displayScale(),
    };
  }

  protected onPointerMove(event: PointerEvent): void {
    const drag = this.drag;
    const size = this.naturalSize();
    if (!drag || !size || event.pointerId !== drag.pointerId) return;
    const dx = (event.clientX - drag.startX) * drag.scale;
    const dy = (event.clientY - drag.startY) * drag.scale;
    this.crop.set(
      drag.handle
        ? resizeCrop(drag.start, drag.handle, dx, dy, size, this.aspectRatio(), this.minSize())
        : moveCrop(drag.start, dx, dy, size),
    );
  }

  protected onPointerEnd(event: PointerEvent): void {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return;
    this.drag = null;
    this.announce();
  }

  protected onKeydown(event: KeyboardEvent): void {
    const crop = this.crop();
    const size = this.naturalSize();
    if (this.isDisabled() || !crop || !size) return;

    const step = this.displayScale() * (event.shiftKey ? 10 : 1);
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = delta[event.key];
    if (!move) return;
    event.preventDefault();

    const [dx, dy] = move;
    if (event.altKey) {
      const handle: CropHandle = dx !== 0 ? 'e' : 's';
      this.crop.set(resizeCrop(crop, handle, dx, dy, size, this.aspectRatio(), this.minSize()));
    } else {
      this.crop.set(moveCrop(crop, dx, dy, size));
    }
    this.announce();
  }

  /** Source pixels per CSS pixel of the displayed image. */
  private displayScale(): number {
    const image = this.imageRef()?.nativeElement;
    const size = this.naturalSize();
    const displayed = image?.getBoundingClientRect().width ?? 0;
    return size && displayed > 0 ? size.width / displayed : 1;
  }

  private announce(): void {
    const crop = this.crop();
    if (!crop) return;
    const r = roundCrop(crop);
    this.announcement.set(`${this.cropAreaLabel()} ${r.width} × ${r.height}, ${r.x}, ${r.y}`);
  }
}
