import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  model,
  signal,
} from '@angular/core';

const NAVIGATION_MENU_SUB_CLOSE_DELAY_MS = 150;

@Component({
  selector: 'sanring-navigation-menu-sub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class NavigationMenuSubComponent {
  readonly open = model(false);

  private readonly _triggerRef = signal<ElementRef<HTMLElement> | null>(null);
  readonly triggerRef = this._triggerRef.asReadonly();

  // One-shot flag: keyboard-initiated opens (ArrowRight/Enter/Space on the sub-trigger)
  // should move focus straight to the first item, matching native menu conventions.
  // Mouse-initiated opens (hover/click) must not steal focus.
  private readonly _focusFirstItemOnOpen = signal(false);

  private closeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearCloseTimer());
  }

  registerTrigger(ref: ElementRef<HTMLElement>): void {
    this._triggerRef.set(ref);
  }

  show(options?: { focusFirstItem?: boolean }): void {
    this.clearCloseTimer();
    if (options?.focusFirstItem) {
      this._focusFirstItemOnOpen.set(true);
    }
    this.open.set(true);
  }

  consumeFocusFirstItemOnOpen(): boolean {
    const value = this._focusFirstItemOnOpen();
    if (value) this._focusFirstItemOnOpen.set(false);
    return value;
  }

  close(): void {
    this.clearCloseTimer();
    this.open.set(false);
  }

  toggle(): void {
    this.open.update((open) => !open);
  }

  scheduleClose(): void {
    this.clearCloseTimer();
    this.closeTimeoutId = setTimeout(() => this.open.set(false), NAVIGATION_MENU_SUB_CLOSE_DELAY_MS);
  }

  clearCloseTimer(): void {
    if (this.closeTimeoutId !== null) {
      clearTimeout(this.closeTimeoutId);
      this.closeTimeoutId = null;
    }
  }
}
