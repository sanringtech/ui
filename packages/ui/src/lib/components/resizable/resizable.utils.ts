import {
  ResizableDirection,
  ResizablePanelConstraints,
  ResizablePairSize,
  ResizablePointerEvent,
} from './resizable.types';

export function getPointerPosition(
  event: ResizablePointerEvent,
  direction: ResizableDirection,
): number {
  const point = isTouchEvent(event) ? event.touches[0] ?? event.changedTouches[0] : event;
  return direction === 'horizontal' ? point.clientX : point.clientY;
}

export function normalizeSizes(
  sizes: readonly number[],
  constraints: readonly ResizablePanelConstraints[],
): number[] {
  const clamped = sizes.map((size, index) =>
    clamp(
      Number.isFinite(size) ? size : 0,
      constraints[index]?.minSize ?? 0,
      constraints[index]?.maxSize ?? 100,
    ),
  );
  const total = clamped.reduce((sum, size) => sum + size, 0);

  if (total <= 0) return constraints.map(() => 100 / constraints.length);

  return clamped.map((size) => (size / total) * 100);
}

export function resizePanelPair(
  delta: number,
  base: ResizablePairSize,
  beforeConstraints: ResizablePanelConstraints,
  afterConstraints: ResizablePanelConstraints,
): ResizablePairSize {
  const pairTotal = base.beforeSize + base.afterSize;
  const minBefore = beforeConstraints.minSize;
  const maxBefore = Math.min(beforeConstraints.maxSize, pairTotal - afterConstraints.minSize);
  const minAfter = afterConstraints.minSize;
  const maxAfter = Math.min(afterConstraints.maxSize, pairTotal - beforeConstraints.minSize);

  const beforeSize = clamp(base.beforeSize + delta, minBefore, maxBefore);
  const afterSize = clamp(pairTotal - beforeSize, minAfter, maxAfter);

  return { beforeSize, afterSize };
}

export function getPanelIndexBeforeHandle(
  groupElement: HTMLElement,
  handleElement: HTMLElement,
): number {
  const children = Array.from(groupElement.children) as HTMLElement[];
  const handleIndex = children.indexOf(handleElement);
  if (handleIndex < 0) return -1;

  return children
    .slice(0, handleIndex)
    .filter((child) => child.tagName.toLowerCase() === 'sanring-resizable-panel').length - 1;
}

export function listen<K extends keyof DocumentEventMap>(
  target: Document,
  type: K,
  listener: (event: DocumentEventMap[K]) => void,
): () => void {
  target.addEventListener(type, listener);
  return () => target.removeEventListener(type, listener);
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function isTouchEvent(event: ResizablePointerEvent): event is TouchEvent {
  return 'touches' in event;
}
