import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  model,
  signal,
} from '@angular/core';

// Grace-period delay before a hover-away actually closes the submenu, so moving the
// mouse from the trigger into the (separately portal'd) sub-content pane doesn't
// close it mid-transit.
const SUB_CLOSE_DELAY_MS = 150;

@Component({
  selector: 'sanring-context-menu-sub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ContextMenuSubComponent {
  readonly isOpen = model(false);

  private readonly _triggerRef = signal<ElementRef<HTMLElement> | null>(null);
  readonly triggerRef = this._triggerRef.asReadonly();

  private closeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearCloseTimer());
  }

  registerTrigger(ref: ElementRef<HTMLElement>): void {
    this._triggerRef.set(ref);
  }

  open(): void {
    this.clearCloseTimer();
    this.isOpen.set(true);
  }

  close(): void {
    this.clearCloseTimer();
    this.isOpen.set(false);
  }

  scheduleClose(): void {
    this.clearCloseTimer();
    this.closeTimeoutId = setTimeout(() => this.isOpen.set(false), SUB_CLOSE_DELAY_MS);
  }

  clearCloseTimer(): void {
    if (this.closeTimeoutId !== null) {
      clearTimeout(this.closeTimeoutId);
      this.closeTimeoutId = null;
    }
  }
}
