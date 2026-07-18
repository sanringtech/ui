export type ResizableDirection = 'horizontal' | 'vertical';

export type ResizablePointerEvent = MouseEvent | TouchEvent;

export interface ResizableDragState {
  beforeIndex: number;
  afterIndex: number;
  startPosition: number;
  groupSize: number;
  beforeSize: number;
  afterSize: number;
}

export interface ResizablePanelConstraints {
  minSize: number;
  maxSize: number;
  collapsible: boolean;
  collapsedSize: number;
}

export interface ResizablePairSize {
  beforeSize: number;
  afterSize: number;
}
