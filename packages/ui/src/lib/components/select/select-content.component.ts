import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayModule } from '@angular/cdk/overlay';
import { SelectComponent } from './select.component';
import { cn } from '../../utils';
import { OVERLAY_SURFACE_CLASS } from '../component-styles';

const SELECT_CONTENT_GAP = 4;

const SELECT_CONTENT_POSITIONS: ConnectionPositionPair[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: SELECT_CONTENT_GAP,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -SELECT_CONTENT_GAP,
  },
];

@Component({
  selector: 'sanring-select-content',
  standalone: true,
  imports: [OverlayModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (select.triggerOrigin; as origin) {
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="origin"
        [cdkConnectedOverlayOpen]="select.isOpen()"
        [cdkConnectedOverlayPositions]="positions"
        [cdkConnectedOverlayPush]="true"
        [cdkConnectedOverlayViewportMargin]="8"
        [cdkConnectedOverlayScrollStrategy]="scrollStrategy"
        (overlayOutsideClick)="close()"
        (detach)="close()"
        (overlayKeydown)="handleOverlayKeydown($event)"
      >
        <div
          role="listbox"
          [id]="select.contentId"
          [attr.data-state]="select.isOpen() ? 'open' : 'closed'"
          [class]="contentClass()"
        >
          <ng-content></ng-content>
        </div>
      </ng-template>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class SelectContentComponent {
  protected readonly select = inject(SelectComponent);
  private readonly overlay = inject(Overlay);

  readonly class = input<string | undefined>();

  protected readonly positions = SELECT_CONTENT_POSITIONS;
  protected readonly scrollStrategy = this.overlay.scrollStrategies.close();

  protected readonly contentClass = computed(() =>
    cn(
      OVERLAY_SURFACE_CLASS,
      'z-50 max-h-96 min-w-32 overflow-y-auto rounded-[var(--sanring-radius-sm)] p-1 outline-none',
      'animate-popover-in',
      this.class(),
    ),
  );

  protected close(): void {
    this.select.setOpen(false);
  }

  protected handleOverlayKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    this.close();
  }
}
