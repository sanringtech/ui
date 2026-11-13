import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { SELECTION_CONTROL_FOCUS_CLASS } from '../component-styles';
import { ImageCropperComponent } from './image-cropper.component';

/**
 * Zoom slider for `sanring-image-cropper` in `mode="pan-zoom"`: zoom-out button, range input,
 * zoom-in button. Place it inside the cropper or anywhere else with `[for]="cropperRef"`.
 */
@Component({
  selector: 'sanring-image-cropper-zoom',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <button
      type="button"
      [class]="buttonClass"
      [attr.aria-label]="zoomOutLabel()"
      [disabled]="disabled() || zoom() <= 1"
      (click)="step(-1)"
    >
      <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M8 11h6M20 20l-3.5-3.5" stroke-linecap="round" />
      </svg>
    </button>
    <input
      type="range"
      class="h-1.5 min-w-0 flex-1 cursor-pointer accent-[var(--sanring-foreground)] disabled:cursor-not-allowed disabled:opacity-50"
      min="1"
      step="0.01"
      [max]="maxZoom()"
      [value]="zoom()"
      [disabled]="disabled()"
      [attr.aria-label]="zoomLabel()"
      [attr.aria-valuetext]="valueText()"
      (input)="set($any($event.target).valueAsNumber)"
    />
    <button
      type="button"
      [class]="buttonClass"
      [attr.aria-label]="zoomInLabel()"
      [disabled]="disabled() || zoom() >= maxZoom()"
      (click)="step(1)"
    >
      <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M8 11h6M11 8v6M20 20l-3.5-3.5" stroke-linecap="round" />
      </svg>
    </button>
  `,
})
export class ImageCropperZoomComponent {
  readonly class = input<string | undefined>();
  /** The cropper to control. Defaults to the enclosing `sanring-image-cropper`. */
  readonly for = input<ImageCropperComponent | undefined>();
  readonly zoomLabel = input('Zoom');
  readonly zoomInLabel = input('Zoom in');
  readonly zoomOutLabel = input('Zoom out');

  private readonly parent = inject(ImageCropperComponent, { optional: true });

  protected readonly cropper = computed(() => this.for() ?? this.parent);
  protected readonly zoom = computed(() => this.cropper()?.zoom() ?? 1);
  protected readonly maxZoom = computed(() => this.cropper()?.effectiveMaxZoom() ?? 1);
  protected readonly disabled = computed(() => {
    const cropper = this.cropper();
    return !cropper || cropper.isDisabled() || !cropper.crop();
  });
  protected readonly valueText = computed(() => `${Math.round(this.zoom() * 100)}%`);
  protected readonly hostClass = computed(() => cn('flex w-full items-center gap-2', this.class()));
  protected readonly buttonClass = cn(
    'inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--sanring-radius-sm)] text-[var(--sanring-muted)] transition-colors',
    'hover:bg-[var(--sanring-surface)] hover:text-[var(--sanring-foreground)]',
    SELECTION_CONTROL_FOCUS_CLASS,
    'disabled:cursor-not-allowed disabled:opacity-40',
  );

  protected set(value: number): void {
    if (Number.isFinite(value)) this.cropper()?.setZoom(value);
  }

  /** Buttons move a quarter of the range per click. */
  protected step(direction: 1 | -1): void {
    const range = this.maxZoom() - 1;
    this.set(this.zoom() + direction * Math.max(range / 4, 0.1));
  }
}
