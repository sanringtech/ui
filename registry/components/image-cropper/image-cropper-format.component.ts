import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../shared/utils';
import { SELECTION_CONTROL_FOCUS_CLASS } from '../shared/component-styles';
import { ImageCropperComponent } from './image-cropper.component';
import {
  type ImageCropperFormat,
  formatLabel,
  isLossyFormat,
  supportsTransparency,
} from './image-cropper.util';

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/**
 * Output format picker for `sanring-image-cropper`: file type, quality for
 * JPEG / WebP, and the fill color JPEG uses for transparent pixels.
 */
@Component({
  selector: 'sanring-image-cropper-format',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    @if (cropper(); as c) {
      <div
        role="group"
        class="inline-flex w-fit gap-0.5 rounded-[var(--sanring-radius-sm)] border border-[var(--sanring-border)] p-0.5"
        [attr.aria-label]="formatGroupLabel()"
      >
        @for (item of c.formats(); track item) {
          <button
            type="button"
            [class]="formatClass(item)"
            [disabled]="c.isDisabled() || !isSupported(item)"
            [attr.aria-pressed]="current() === item"
            [attr.title]="isSupported(item) ? null : unsupportedLabel()"
            (click)="select(item)"
          >
            {{ label(item) }}
          </button>
        }
      </div>

      @if (lossy()) {
        <label class="grid gap-1.5">
          <span class="flex items-center justify-between text-xs text-[var(--sanring-muted)]">
            <span>{{ qualityLabel() }}</span>
            <span class="font-mono tabular-nums">{{ qualityPercent() }}%</span>
          </span>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            class="w-full accent-[var(--sanring-foreground)] disabled:cursor-not-allowed disabled:opacity-50"
            [value]="qualityPercent()"
            [disabled]="c.isDisabled()"
            [attr.aria-valuetext]="qualityPercent() + '%'"
            (input)="onQualityInput($event)"
          />
        </label>
      }

      @if (needsBackground()) {
        <label class="flex items-center gap-2 text-xs text-[var(--sanring-muted)]">
          <input
            type="color"
            class="h-7 w-9 cursor-pointer rounded-[var(--sanring-radius-xs)] border border-[var(--sanring-border)] bg-transparent p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            [value]="backgroundHex()"
            [disabled]="c.isDisabled()"
            (input)="onBackgroundInput($event)"
          />
          <span>{{ backgroundLabel() }}</span>
        </label>
      }
    }
  `,
})
export class ImageCropperFormatComponent {
  readonly class = input<string | undefined>();
  /** The cropper to control. Defaults to the enclosing `sanring-image-cropper`. */
  readonly for = input<ImageCropperComponent | undefined>();
  readonly formatGroupLabel = input('Output format');
  readonly qualityLabel = input('Quality');
  readonly backgroundLabel = input('Background');
  readonly unsupportedLabel = input('Not supported by this browser');

  private readonly parent = inject(ImageCropperComponent, { optional: true });

  protected readonly cropper = computed(() => this.for() ?? this.parent);
  protected readonly current = computed(() => this.cropper()?.effectiveFormat() ?? null);
  protected readonly lossy = computed(() => {
    const format = this.current();
    return format !== null && isLossyFormat(format);
  });
  protected readonly needsBackground = computed(() => {
    const format = this.current();
    return format !== null && !supportsTransparency(format);
  });
  protected readonly qualityPercent = computed(() =>
    Math.round((this.cropper()?.quality() ?? 0.92) * 100),
  );
  protected readonly backgroundHex = computed(() => {
    const value = this.cropper()?.background() ?? '';
    return HEX_COLOR.test(value) ? value : '#ffffff';
  });
  protected readonly hostClass = computed(() => cn('grid gap-3', this.class()));

  protected label(format: ImageCropperFormat): string {
    return formatLabel(format);
  }

  protected isSupported(format: ImageCropperFormat): boolean {
    const supported = this.cropper()?.supportedFormats();
    return !supported || supported.has(format);
  }

  protected formatClass(format: ImageCropperFormat): string {
    return cn(
      'rounded-[var(--sanring-radius-xs)] px-2.5 py-1 text-xs font-medium transition-colors',
      SELECTION_CONTROL_FOCUS_CLASS,
      'disabled:cursor-not-allowed disabled:opacity-40',
      this.current() === format
        ? 'bg-[var(--sanring-foreground)] text-[var(--sanring-background)]'
        : 'text-[var(--sanring-muted)] hover:bg-[var(--sanring-surface)] hover:text-[var(--sanring-foreground)]',
    );
  }

  protected select(format: ImageCropperFormat): void {
    const cropper = this.cropper();
    if (!cropper || cropper.isDisabled() || !this.isSupported(format)) return;
    cropper.format.set(format);
  }

  protected onQualityInput(event: Event): void {
    const percent = Number.parseFloat((event.target as HTMLInputElement).value);
    if (Number.isFinite(percent)) this.cropper()?.quality.set(Math.min(Math.max(percent, 1), 100) / 100);
  }

  protected onBackgroundInput(event: Event): void {
    this.cropper()?.background.set((event.target as HTMLInputElement).value);
  }
}
