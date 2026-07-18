import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { cn } from '../shared/utils';
import { ResizablePanelComponent } from './resizable-panel.component';
import {
  ResizableDirection,
  ResizableDragState,
  ResizablePanelConstraints,
  ResizablePairSize,
  ResizablePointerEvent,
} from './resizable.types';
import {
  getPanelIndexBeforeHandle,
  getPointerPosition,
  listen,
  normalizeSizes,
  resizePanelPair,
} from './resizable.utils';

@Component({
  selector: 'sanring-resizable-group',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'groupClass()',
    '[style.width]': '"100%"',
    '[style.height]': '"100%"',
  },
})
export class ResizableGroupComponent {
  // ==========================================
  // 外部設定 (Inputs)
  // ==========================================
  readonly direction = input<ResizableDirection>('horizontal');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly class = input<string | undefined>();

  /** 以百分比表示每個 panel 的尺寸。可雙向綁定保存 layout。 */
  readonly sizes = model<number[]>([]);

  private readonly panels = contentChildren(ResizablePanelComponent);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dragState = signal<ResizableDragState | null>(null);

  private stopMouseMove?: () => void;
  private stopMouseUp?: () => void;
  private stopTouchMove?: () => void;
  private stopTouchEnd?: () => void;

  readonly isDragging = computed(() => this.dragState() !== null);

  // ==========================================
  // 視覺排版運算
  // ==========================================
  protected readonly groupClass = computed(() =>
    cn(
      'flex overflow-hidden',
      // 根據方向切換 flex-row 或 flex-col
      this.direction() === 'horizontal' ? 'flex-row' : 'flex-col',
      this.isDragging() && 'select-none',
      this.class(),
    ),
  );

  constructor() {
    afterNextRender(() => this.applyInitialSizes());

    effect(() => {
      const panels = this.panels();
      const externalSizes = this.sizes();
      if (!panels.length || externalSizes.length !== panels.length) return;

      this.applySizes(normalizeSizes(externalSizes, this.getAllPanelConstraints()));
    });

    this.destroyRef.onDestroy(() => this.stopDrag());
  }

  startDrag(handleElement: HTMLElement, event: ResizablePointerEvent): void {
    if (this.disabled()) return;

    const panels = this.panels();
    if (panels.length < 2) return;

    this.applyInitialSizes();

    const beforeIndex = getPanelIndexBeforeHandle(this.elementRef.nativeElement, handleElement);
    const afterIndex = beforeIndex + 1;
    const beforePanel = panels[beforeIndex];
    const afterPanel = panels[afterIndex];

    if (!beforePanel || !afterPanel) return;

    const groupRect = this.elementRef.nativeElement.getBoundingClientRect();
    const groupSize = this.direction() === 'horizontal' ? groupRect.width : groupRect.height;
    if (groupSize <= 0) return;

    this.dragState.set({
      beforeIndex,
      afterIndex,
      startPosition: getPointerPosition(event, this.direction()),
      groupSize,
      beforeSize: beforePanel.currentSize() ?? 0,
      afterSize: afterPanel.currentSize() ?? 0,
    });

    const doc = this.elementRef.nativeElement.ownerDocument;
    this.stopMouseMove = listen(doc, 'mousemove', (moveEvent) =>
      this.onDragMove(moveEvent as MouseEvent),
    );
    this.stopMouseUp = listen(doc, 'mouseup', () => this.stopDrag());
    this.stopTouchMove = listen(doc, 'touchmove', (moveEvent) => {
      moveEvent.preventDefault();
      this.onDragMove(moveEvent as TouchEvent);
    });
    this.stopTouchEnd = listen(doc, 'touchend', () => this.stopDrag());
  }

  resizeBy(handleElement: HTMLElement, delta: number): void {
    if (this.disabled()) return;

    this.applyInitialSizes();

    const panels = this.panels();
    const beforeIndex = getPanelIndexBeforeHandle(this.elementRef.nativeElement, handleElement);
    const afterIndex = beforeIndex + 1;
    const beforePanel = panels[beforeIndex];
    const afterPanel = panels[afterIndex];

    if (!beforePanel || !afterPanel) return;

    this.resizePair(beforeIndex, afterIndex, delta, {
      beforeSize: beforePanel.currentSize() ?? 0,
      afterSize: afterPanel.currentSize() ?? 0,
    });
  }

  private onDragMove(event: ResizablePointerEvent): void {
    const state = this.dragState();
    if (!state) return;

    const currentPosition = getPointerPosition(event, this.direction());
    const pixelDelta = currentPosition - state.startPosition;
    const percentDelta = (pixelDelta / state.groupSize) * 100;

    this.resizePair(state.beforeIndex, state.afterIndex, percentDelta, state);
  }

  private resizePair(
    beforeIndex: number,
    afterIndex: number,
    delta: number,
    base: ResizablePairSize,
  ): void {
    const panels = this.panels();
    const beforePanel = panels[beforeIndex];
    const afterPanel = panels[afterIndex];
    if (!beforePanel || !afterPanel) return;

    const { beforeSize, afterSize } = resizePanelPair(
      delta,
      base,
      this.getPanelConstraintsAt(beforeIndex),
      this.getPanelConstraintsAt(afterIndex),
    );

    beforePanel.currentSize.set(beforeSize);
    afterPanel.currentSize.set(afterSize);
    this.emitSizes();
  }

  private stopDrag(): void {
    this.dragState.set(null);
    this.stopMouseMove?.();
    this.stopMouseUp?.();
    this.stopTouchMove?.();
    this.stopTouchEnd?.();
    this.stopMouseMove = undefined;
    this.stopMouseUp = undefined;
    this.stopTouchMove = undefined;
    this.stopTouchEnd = undefined;
  }

  private applyInitialSizes(): void {
    const panels = this.panels();
    if (!panels.length) return;

    const existingSizes = panels.map((panel) => panel.currentSize());
    if (existingSizes.every((size) => size !== undefined)) return;

    const requestedSizes =
      this.sizes().length === panels.length
        ? this.sizes()
        : panels.map((panel) => panel.defaultSize() ?? 100 / panels.length);

    const normalizedSizes = normalizeSizes(requestedSizes, this.getAllPanelConstraints());
    this.applySizes(normalizedSizes);
    this.sizes.set(normalizedSizes);
  }

  private applySizes(sizes: number[]): void {
    const panels = this.panels();
    panels.forEach((panel, index) => panel.currentSize.set(sizes[index]));
  }

  private emitSizes(): void {
    const nextSizes = this.panels().map((panel) => panel.currentSize() ?? 0);
    this.sizes.set(nextSizes);
  }

  private getAllPanelConstraints(): ResizablePanelConstraints[] {
    return this.panels().map((panel) => ({
      minSize: panel.minSize(),
      maxSize: panel.maxSize(),
      collapsible: panel.collapsible(),
      collapsedSize: panel.collapsedSize(),
    }));
  }

  private getPanelConstraintsAt(index: number): ResizablePanelConstraints {
    return (
      this.getAllPanelConstraints()[index] ?? {
        minSize: 0,
        maxSize: 100,
        collapsible: false,
        collapsedSize: 0,
      }
    );
  }
}
