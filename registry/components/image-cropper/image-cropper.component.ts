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
import { cn } from '../shared/utils';
import { SELECTION_CONTROL_FOCUS_CLASS } from '../shared/component-styles';
import {
  CROP_HANDLES,
  type CropBounds,
  type CropHandle,
  type CropRect,
  IMAGE_CROPPER_FORMATS,
  type ImageCropperFormat,
  applyAspectRatio,
  clampCrop,
  fitCrop,
  initialCrop,
  isImageCropperFormat,
  isLossyFormat,
  moveCrop,
  outputSize,
  replaceExtension,
  resizeCrop,
  roundCrop,
  supportsTransparency,
  zoomCrop,
} from './image-cropper.util';

export type ImageCropperSource = File | Blob | string | null | undefined;
export type ImageCropperShape = 'rect' | 'circle';
/**
 * `'box'` — the image is fixed and the user drags / resizes the crop box.
 * `'pan-zoom'` — the crop frame is fixed and the user drags / zooms the image (wheel, pinch, keys,
 * or `sanring-image-cropper-zoom`). Needs a fixed ratio; `aspectRatio` falls back to 1.
 */
export type ImageCropperMode = 'box' | 'pan-zoom';

/** Share of the pan-zoom stage the crop frame takes on its longer side, in percent. */
const PAN_ZOOM_FRAME = 80;

const BOX_INSTRUCTIONS =
  'Use the arrow keys to move the crop area. Hold Alt (Option) with the arrow keys to resize. Hold Shift to move in larger steps.';
const PAN_ZOOM_INSTRUCTIONS =
  'Drag the image to move it; scroll or pinch to zoom. Use the arrow keys to move the image, plus and minus to zoom, and Shift for larger steps.';

interface PanGesture {
  start: CropRect;
  midX: number;
  midY: number;
  distance: number;
  /** Source pixels per CSS pixel at the gesture start. */
  scale: number;
  frameLeft: number;
  frameTop: number;
}

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
    @if (isPanZoom()) {
    <div
      #stage
      role="group"
      aria-roledescription="crop area"
      [attr.tabindex]="isDisabled() || !crop() ? -1 : 0"
      [attr.aria-label]="cropAreaLabel()"
      [attr.aria-describedby]="instructionsId()"
      [attr.aria-disabled]="isDisabled() ? 'true' : null"
      [class]="stageClass()"
      (pointerdown)="onPanPointerDown($event)"
      (pointermove)="onPanPointerMove($event)"
      (pointerup)="onPanPointerEnd($event)"
      (pointercancel)="onPanPointerEnd($event)"
      (wheel)="onWheel($event)"
      (keydown)="onPanKeydown($event)"
    >
      @if (imageUrl(); as url) {
        <img
          #image
          [src]="url"
          [attr.crossorigin]="crossOrigin()"
          alt=""
          draggable="false"
          class="pointer-events-none absolute max-w-none select-none"
          [class.invisible]="!panImage()"
          [style.left.%]="panImage()?.left"
          [style.top.%]="panImage()?.top"
          [style.width.%]="panImage()?.width"
          [style.height.%]="panImage()?.height"
          (load)="onImageLoad()"
          (error)="onImageError()"
        />
        @if (panImage()) {
          <svg
            class="pointer-events-none absolute inset-0 size-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path fill="rgb(0 0 0 / 0.6)" fill-rule="evenodd" [attr.d]="maskPath()" />
          </svg>
          <span
            class="pointer-events-none absolute ring-1 ring-white/90"
            [class.rounded-full]="shape() === 'circle'"
            [style.left.%]="panFrame().left"
            [style.top.%]="panFrame().top"
            [style.width.%]="panFrame().width"
            [style.height.%]="panFrame().height"
            aria-hidden="true"
          >
            @if (guides() && dragging()) {
              <span
                class="absolute inset-0 grid grid-cols-3 grid-rows-3"
                [class.overflow-hidden]="shape() === 'circle'"
                [class.rounded-full]="shape() === 'circle'"
              >
                @for (cell of guideCells; track cell) {
                  <span class="border-[0.5px] border-white/40"></span>
                }
              </span>
            }
          </span>
        }
      } @else {
        <div
          class="flex size-full items-center justify-center bg-[var(--sanring-surface)] px-4 text-center text-sm text-[var(--sanring-muted)]"
        >
          <ng-content select="[sanringImageCropperEmpty]">{{ emptyLabel() }}</ng-content>
        </div>
      }
    </div>
    } @else {
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
    }
    <span [id]="instructionsId()" class="sr-only">{{ instructionsText() }}</span>
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
  /** Interaction model; see `ImageCropperMode`. */
  readonly mode = input<ImageCropperMode>('box');
  /** Pan-zoom only: largest zoom, relative to the crop that fits the whole image (zoom 1). */
  readonly maxZoom = input(4, { transform: numberAttribute });
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
  /** Screen-reader instructions. Defaults to English text that matches `mode`. */
  readonly instructions = input<string | null>(null);
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
  readonly isPanZoom = computed(() => this.mode() === 'pan-zoom');
  /** Ratio actually enforced: pan-zoom needs a fixed one, so it falls back to 1. */
  readonly effectiveAspectRatio = computed(() =>
    this.isPanZoom() ? (this.aspectRatio() ?? 1) : this.aspectRatio(),
  );
  /** Crop that fits the whole image at the enforced ratio (zoom 1). */
  readonly fitRect = computed(() => {
    const size = this.naturalSize();
    return size ? fitCrop(size, this.effectiveAspectRatio()) : null;
  });
  readonly effectiveMaxZoom = computed(() => Math.max(1, this.maxZoom() || 1));
  /** 1 = the whole image fits; larger = zoomed in. */
  readonly zoom = computed(() => {
    const fit = this.fitRect();
    const crop = this.crop();
    return fit && crop && crop.width > 0 ? fit.width / crop.width : 1;
  });
  readonly dragging = signal(false);
  readonly outputSize = computed(() => {
    const crop = this.crop();
    return crop ? outputSize(crop, this.outputWidth()) : null;
  });

  protected readonly handles = CROP_HANDLES;
  protected readonly guideCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  protected readonly instructionsId = computed(() => `${this.id()}-instructions`);
  protected readonly instructionsText = computed(
    () => this.instructions() ?? (this.isPanZoom() ? PAN_ZOOM_INSTRUCTIONS : BOX_INSTRUCTIONS),
  );
  protected readonly stageClass = computed(() =>
    cn(
      'relative block aspect-square w-[min(100%,var(--sanring-image-cropper-stage-size,20rem))] touch-none select-none overflow-hidden',
      'rounded-[var(--sanring-radius)] border border-[var(--sanring-border)] bg-neutral-900 outline-none',
      SELECTION_CONTROL_FOCUS_CLASS,
      this.isDisabled() ? 'cursor-not-allowed opacity-60' : this.dragging() ? 'cursor-grabbing' : 'cursor-grab',
    ),
  );
  /** Pan-zoom frame inside the square stage, in percent; it keeps the enforced ratio. */
  protected readonly panFrame = computed(() => {
    const ratio = this.effectiveAspectRatio() ?? 1;
    const width = ratio >= 1 ? PAN_ZOOM_FRAME : PAN_ZOOM_FRAME * ratio;
    const height = ratio >= 1 ? PAN_ZOOM_FRAME / ratio : PAN_ZOOM_FRAME;
    return { left: (100 - width) / 2, top: (100 - height) / 2, width, height };
  });
  /** Where the image sits in the stage (percent) so that the crop lines up with the frame. */
  protected readonly panImage = computed(() => {
    const crop = this.crop();
    const size = this.naturalSize();
    if (!this.isPanZoom() || !crop || !size) return null;
    const frame = this.panFrame();
    const sx = frame.width / crop.width;
    const sy = frame.height / crop.height;
    return {
      left: frame.left - crop.x * sx,
      top: frame.top - crop.y * sy,
      width: size.width * sx,
      height: size.height * sy,
    };
  });
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
    const box = this.isPanZoom() ? (this.panImage() ? this.panFrame() : null) : this.cropPercent();
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
  private readonly stageRef = viewChild<ElementRef<HTMLElement>>('stage');
  private drag: DragState | null = null;
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private gesture: PanGesture | null = null;
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
      const aspectRatio = this.effectiveAspectRatio();
      untracked(() => {
        const size = this.naturalSize();
        const crop = this.crop();
        if (size && crop) this.crop.set(applyAspectRatio(crop, size, aspectRatio));
      });
    });

    afterNextRender(() => this.supportedFormats.set(detectSupportedFormats()));
  }

  focus(options?: FocusOptions): void {
    (this.stageRef() ?? this.boxRef())?.nativeElement.focus(options);
  }

  /** Restores the default centered crop for the current image. */
  reset(): void {
    const size = this.naturalSize();
    if (size) this.crop.set(this.defaultCrop(size));
  }

  /**
   * Pan-zoom: sets the zoom (1 = whole image fits, up to `maxZoom`) around the crop center,
   * or around `anchor` given in source pixels.
   */
  setZoom(zoom: number, anchor?: { x: number; y: number }): void {
    const crop = this.crop();
    const size = this.naturalSize();
    const fit = this.fitRect();
    if (!crop || !size || !fit || !Number.isFinite(zoom)) return;
    const z = Math.min(Math.max(zoom, 1), this.effectiveMaxZoom());
    const ax = anchor?.x ?? crop.x + crop.width / 2;
    const ay = anchor?.y ?? crop.y + crop.height / 2;
    this.crop.set(zoomCrop(crop, fit.width / z, ax, ay, size));
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
    this.crop.set(
      fits ? applyAspectRatio(current, size, this.effectiveAspectRatio()) : this.defaultCrop(size),
    );
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

  // ---------- pan-zoom ----------

  protected onPanPointerDown(event: PointerEvent): void {
    if (this.isDisabled() || !this.crop() || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    const stage = this.stageRef()?.nativeElement;
    stage?.setPointerCapture?.(event.pointerId);
    stage?.focus({ preventScroll: true });
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    this.beginGesture();
    this.dragging.set(true);
  }

  protected onPanPointerMove(event: PointerEvent): void {
    const gesture = this.gesture;
    const size = this.naturalSize();
    if (!gesture || !size || !this.pointers.has(event.pointerId)) return;
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...this.pointers.values()];
    const mid = midpoint(points);

    let next = gesture.start;
    let scale = gesture.scale;
    if (points.length > 1 && gesture.distance > 0) {
      // Pinch: zoom around the point that was between the fingers, then follow the fingers.
      const width = this.clampWidth((gesture.start.width * gesture.distance) / distance(points[0], points[1]));
      const anchor = this.sourcePoint(gesture.midX, gesture.midY, gesture);
      next = zoomCrop(gesture.start, width, anchor.x, anchor.y, size);
      scale = (gesture.scale * next.width) / gesture.start.width;
    }
    // Dragging the image right shows what was to its left, so the crop moves the other way.
    this.crop.set(moveCrop(next, -(mid.x - gesture.midX) * scale, -(mid.y - gesture.midY) * scale, size));
  }

  protected onPanPointerEnd(event: PointerEvent): void {
    if (!this.pointers.delete(event.pointerId)) return;
    if (this.pointers.size > 0) {
      this.beginGesture();
      return;
    }
    this.gesture = null;
    this.dragging.set(false);
    this.announce();
  }

  protected onWheel(event: WheelEvent): void {
    const crop = this.crop();
    if (this.isDisabled() || !crop || !this.naturalSize() || event.deltaY === 0) return;
    event.preventDefault();
    const lines = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1;
    // Trackpad pinch arrives as ctrl + wheel with small deltas; give it more weight.
    const factor = Math.exp(event.deltaY * lines * (event.ctrlKey ? 0.01 : 0.002));
    const geometry = this.stageGeometry();
    const anchor = geometry ? this.sourcePoint(event.clientX, event.clientY, { start: crop, ...geometry }) : undefined;
    const fit = this.fitRect();
    if (fit) this.setZoom(fit.width / (crop.width * factor), anchor);
    this.announce();
  }

  protected onPanKeydown(event: KeyboardEvent): void {
    const crop = this.crop();
    const size = this.naturalSize();
    if (this.isDisabled() || !crop || !size) return;

    if (event.key === '+' || event.key === '=' || event.key === '-' || event.key === '_') {
      event.preventDefault();
      const step = event.shiftKey ? 1.5 : 1.1;
      const zoomIn = event.key === '+' || event.key === '=';
      this.setZoom(zoomIn ? this.zoom() * step : this.zoom() / step);
      this.announce();
      return;
    }

    const pixels = event.shiftKey ? 40 : 8;
    const scale = this.stageGeometry()?.scale ?? 1;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-pixels, 0],
      ArrowRight: [pixels, 0],
      ArrowUp: [0, -pixels],
      ArrowDown: [0, pixels],
    };
    const move = delta[event.key];
    if (!move) return;
    event.preventDefault();
    // Arrow keys move the image, like dragging it.
    this.crop.set(moveCrop(crop, -move[0] * scale, -move[1] * scale, size));
    this.announce();
  }

  private beginGesture(): void {
    const crop = this.crop();
    const geometry = this.stageGeometry();
    if (!crop || !geometry) {
      this.gesture = null;
      return;
    }
    const points = [...this.pointers.values()];
    const mid = midpoint(points);
    this.gesture = {
      start: crop,
      midX: mid.x,
      midY: mid.y,
      distance: points.length > 1 ? distance(points[0], points[1]) : 0,
      ...geometry,
    };
  }

  /** Frame position on screen and the source-pixels-per-CSS-pixel scale of the current crop. */
  private stageGeometry(): { scale: number; frameLeft: number; frameTop: number } | null {
    const stage = this.stageRef()?.nativeElement;
    const crop = this.crop();
    if (!stage || !crop) return null;
    const rect = stage.getBoundingClientRect();
    const frame = this.panFrame();
    const frameWidth = (rect.width * frame.width) / 100;
    if (frameWidth <= 0) return null;
    return {
      scale: crop.width / frameWidth,
      frameLeft: rect.left + (rect.width * frame.left) / 100,
      frameTop: rect.top + (rect.height * frame.top) / 100,
    };
  }

  /** Source-pixel point under a screen point, using the crop and geometry captured at `gesture`. */
  private sourcePoint(
    clientX: number,
    clientY: number,
    gesture: Pick<PanGesture, 'start' | 'scale' | 'frameLeft' | 'frameTop'>,
  ): { x: number; y: number } {
    return {
      x: gesture.start.x + (clientX - gesture.frameLeft) * gesture.scale,
      y: gesture.start.y + (clientY - gesture.frameTop) * gesture.scale,
    };
  }

  private clampWidth(width: number): number {
    const fit = this.fitRect();
    if (!fit) return width;
    return Math.min(Math.max(width, fit.width / this.effectiveMaxZoom()), fit.width);
  }

  private defaultCrop(size: CropBounds): CropRect {
    return this.isPanZoom() ? fitCrop(size, this.effectiveAspectRatio()) : initialCrop(size, this.aspectRatio());
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
    const zoom = this.isPanZoom() ? `, ${Math.round(this.zoom() * 100)}%` : '';
    this.announcement.set(`${this.cropAreaLabel()} ${r.width} × ${r.height}, ${r.x}, ${r.y}${zoom}`);
  }
}

function midpoint(points: readonly { x: number; y: number }[]): { x: number; y: number } {
  if (points.length === 0) return { x: 0, y: 0 };
  const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  return { x, y };
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
