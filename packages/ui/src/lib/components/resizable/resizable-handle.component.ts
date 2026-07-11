import { Component, ElementRef, computed, inject, input } from '@angular/core';
import { LucideGripHorizontal, LucideGripVertical } from '@lucide/angular';
import { cn } from '../../utils';
import { ResizableGroupComponent } from './resizable-group.component';

@Component({
  selector: 'sanring-resizable-handle',
  standalone: true,
  imports: [LucideGripHorizontal, LucideGripVertical],
  template: `
    @if (withHandle()) {
      <div [class]="gripClass()">
        @if (group.direction() === 'horizontal') {
          <svg lucideGripVertical class="size-2.5" aria-hidden="true"></svg>
        } @else {
          <svg lucideGripHorizontal class="size-2.5" aria-hidden="true"></svg>
        }
      </div>
    }
  `,
  host: {
    role: 'separator',
    '[attr.data-orientation]': 'group.direction()',
    '[attr.aria-orientation]': 'group.direction()',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.tabindex]': 'isDisabled() ? -1 : 0',
    '[class]': 'handleClass()',
    '(mousedown)': 'onDragStart($event)',
    '(touchstart)': 'onDragStart($event)',
    '(keydown)': 'onKeyDown($event)',
  },
})
export class ResizableHandleComponent {
  readonly withHandle = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly keyboardStep = input<number>(5);
  readonly class = input<string | undefined>();

  protected readonly group = inject(ResizableGroupComponent);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  protected readonly isDisabled = computed(() => this.disabled() || this.group.disabled());

  protected readonly handleClass = computed(() =>
    cn(
      'relative flex w-px items-center justify-center bg-[var(--sanring-border-strong)] transition-colors',
      'after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sanring-border-strong)] focus-visible:ring-offset-1',
      'data-[orientation=horizontal]:cursor-col-resize',
      'data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full',
      'data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-2 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:-translate-y-1/2 data-[orientation=vertical]:after:translate-x-0',
      'data-[orientation=vertical]:cursor-row-resize',
      this.isDisabled() && 'pointer-events-none opacity-50',
      this.class(),
    ),
  );

  protected readonly gripClass = computed(() =>
    cn(
      'z-10 flex items-center justify-center rounded-sm border border-[var(--sanring-border-strong)] bg-[var(--sanring-surface)] text-[var(--sanring-muted)]',
      this.group.direction() === 'horizontal' ? 'h-4 w-3' : 'h-3 w-4',
    ),
  );

  onDragStart(event: MouseEvent | TouchEvent): void {
    if (this.isDisabled()) return;

    event.preventDefault();
    this.group.startDrag(this.elementRef.nativeElement, event);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    const step = this.keyboardStep();
    const direction = this.group.direction();
    const isRtl = getComputedStyle(this.elementRef.nativeElement).direction === 'rtl';
    let delta = 0;

    if (direction === 'horizontal') {
      if (event.key === 'ArrowLeft') delta = isRtl ? step : -step;
      if (event.key === 'ArrowRight') delta = isRtl ? -step : step;
    } else {
      if (event.key === 'ArrowUp') delta = -step;
      if (event.key === 'ArrowDown') delta = step;
    }

    if (event.key === 'Home') delta = -100;
    if (event.key === 'End') delta = 100;

    if (delta === 0) return;

    event.preventDefault();
    this.group.resizeBy(this.elementRef.nativeElement, delta);
  }
}
