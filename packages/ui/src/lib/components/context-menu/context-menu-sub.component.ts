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

  // Set by open({ focusFirstItem: true }) — read-and-cleared by
  // ContextMenuSubContentComponent once it's actually focused the item, so it's a
  // one-shot signal rather than a persistent flag.
  private readonly _focusFirstItemOnOpen = signal(false);

  private closeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearCloseTimer());
  }

  registerTrigger(ref: ElementRef<HTMLElement>): void {
    this._triggerRef.set(ref);
  }

  // ArrowRight/Enter on the trigger passes focusFirstItem: true — keyboard-initiated
  // opens should land focus on the first item immediately (matches native menus and
  // the ARIA APG submenu pattern). Mouse-initiated opens (hover/click) don't, since
  // pointer interactions shouldn't steal focus.
  open(options?: { focusFirstItem?: boolean }): void {
    this.clearCloseTimer();
    this._focusFirstItemOnOpen.set(options?.focusFirstItem ?? false);
    this.isOpen.set(true);
  }

  consumeFocusFirstItemOnOpen(): boolean {
    const value = this._focusFirstItemOnOpen();
    this._focusFirstItemOnOpen.set(false);
    return value;
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
