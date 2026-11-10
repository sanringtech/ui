import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { cn } from '../../utils';
import { ImageCropperComponent } from './image-cropper.component';
import { supportsTransparency } from './image-cropper.util';

/**
 * Live preview of the current crop. Place it inside `sanring-image-cropper`,
 * or anywhere else with `[for]="cropperRef"`.
 */
@Component({
  selector: 'sanring-image-cropper-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel()',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
  },
  template: `
    <!-- The host keeps a fixed size × size box so dragging never reflows the layout;
         the frame inside follows the crop ratio. -->
    <span
      data-preview-frame
      [class]="frameClass()"
      [style.width.px]="frame().width"
      [style.height.px]="frame().height"
      [style.background-color]="fillColor()"
    >
    @if (view(); as v) {
      <img
        [src]="v.url"
        [attr.crossorigin]="cropper()?.crossOrigin()"
        alt=""
        aria-hidden="true"
        draggable="false"
        class="pointer-events-none absolute max-w-none select-none"
        [style.width.px]="v.width"
        [style.height.px]="v.height"
        [style.left.px]="v.left"
        [style.top.px]="v.top"
      />
    }
    </span>
  `,
})
export class ImageCropperPreviewComponent {
  readonly class = input<string | undefined>();
  /** The cropper to mirror. Defaults to the enclosing `sanring-image-cropper`. */
  readonly for = input<ImageCropperComponent | undefined>();
  /** Side of the square box the preview occupies; the crop is fitted and centered inside it. */
  readonly size = input(160, { transform: numberAttribute });
  readonly ariaLabel = input('Crop preview');

  private readonly parent = inject(ImageCropperComponent, { optional: true });

  protected readonly cropper = computed(() => this.for() ?? this.parent);

  /** Preview box size, matching the crop's aspect ratio. */
  protected readonly frame = computed(() => {
    const size = this.size();
    const crop = this.cropper()?.crop();
    if (!crop || crop.width <= 0 || crop.height <= 0) return { width: size, height: size };
    const ratio = crop.width / crop.height;
    return ratio >= 1
      ? { width: size, height: size / ratio }
      : { width: size * ratio, height: size };
  });

  protected readonly view = computed(() => {
    const cropper = this.cropper();
    const url = cropper?.imageUrl();
    const crop = cropper?.crop();
    const natural = cropper?.naturalSize();
    if (!url || !crop || !natural) return null;
    const scale = this.frame().width / crop.width;
    return {
      url,
      width: natural.width * scale,
      height: natural.height * scale,
      left: -crop.x * scale,
      top: -crop.y * scale,
    };
  });

  /** JPEG output has no transparency, so show the fill color it will be flattened onto. */
  protected readonly fillColor = computed(() => {
    const cropper = this.cropper();
    if (!cropper || supportsTransparency(cropper.effectiveFormat())) return null;
    return cropper.background();
  });

  protected readonly hostClass = computed(() =>
    cn('inline-flex shrink-0 items-center justify-center', this.class()),
  );

  protected readonly frameClass = computed(() =>
    cn(
      'relative block overflow-hidden border border-[var(--sanring-border)]',
      'bg-[length:12px_12px] bg-[repeating-conic-gradient(#e5e5e5_0_25%,#fff_0_50%)]',
      this.cropper()?.shape() === 'circle'
        ? 'rounded-full'
        : 'rounded-[var(--sanring-radius-sm)]',
    ),
  );
}
