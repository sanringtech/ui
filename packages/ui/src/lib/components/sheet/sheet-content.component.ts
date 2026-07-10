import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Overlay, OverlayContainer, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { cn } from '../../utils';
import {
  OVERLAY_BACKDROP_CLASS,
  OVERLAY_SURFACE_CLASS,
  SHEET_SURFACE_CLASS,
} from '../component-styles';
import { SheetComponent } from './sheet.component';
import type { SheetSide } from './sheet.type';

const LEAVE_DURATION_MS = 200;

const SIDE_CLASSES: Record<SheetSide, string> = {
  top:    'inset-x-0 top-0 border-b border-[var(--sanring-border)]',
  bottom: 'inset-x-0 bottom-0 border-t border-[var(--sanring-border)]',
  left:   'inset-y-0 left-0 h-full w-3/4 border-r border-[var(--sanring-border)] sm:max-w-sm',
  right:  'inset-y-0 right-0 h-full w-3/4 border-l border-[var(--sanring-border)] sm:max-w-sm',
};

const SIDE_ENTER: Record<SheetSide, string> = {
  top:    'animate-sheet-in-top',
  bottom: 'animate-sheet-in-bottom',
  left:   'animate-sheet-in-left',
  right:  'animate-sheet-in-right',
};

const SIDE_LEAVE: Record<SheetSide, string> = {
  top:    'animate-sheet-out-top',
  bottom: 'animate-sheet-out-bottom',
  left:   'animate-sheet-out-left',
  right:  'animate-sheet-out-right',
};

@Component({
  selector: 'sanring-sheet-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkTrapFocus],
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
  template: `
    <ng-template #contentTemplate>
      <div
        [class]="backdropClass()"
        aria-hidden="true"
        (click)="requestClose()"
      ></div>

      <div
        #panelDiv
        tabindex="-1"
        cdkTrapFocus
        [cdkTrapFocus]="sheet.isOpen()"
        [id]="sheet.panelId"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="sheet.titleId"
        [attr.aria-describedby]="sheet.descId"
        [class]="panelClass()"
      >
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class SheetContentComponent {
  protected readonly sheet = inject(SheetComponent);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayContainer = inject(OverlayContainer);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @ViewChild('contentTemplate') private contentTemplateRef!: TemplateRef<unknown>;
  @ViewChild('panelDiv') private panelDiv?: ElementRef<HTMLElement>;

  readonly side  = input<SheetSide>('right');
  readonly class = input<string | undefined>();

  private readonly _leaving = signal(false);
  private _leaveTimer: ReturnType<typeof setTimeout> | undefined;

  // Portal 到 cdk-overlay-container（<body> 底下），避免祖先元素的 transform/filter/contain
  // 劫走 position:fixed 的 containing block，並讓 z-index 跟其他 CDK overlay 共用同一套堆疊管理。
  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;

  // 關閉後把焦點還給開啟它的元素，符合 WAI-ARIA dialog pattern 的要求
  private previouslyFocusedElement: HTMLElement | null = null;

  // 開啟期間把背景內容標成 aria-hidden，避免螢幕閱讀器使用者還能導覽到面板背後的內容
  private hiddenSiblings: Element[] = [];

  /** Keep DOM visible during leave animation */
  protected readonly shouldDisplay = computed(
    () => this.sheet.isOpen() || this._leaving(),
  );

  constructor() {
    // Scroll lock: hold lock while visible (including leave phase)
    effect(() => {
      if (this.shouldDisplay()) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    });

    // Attach/detach the overlay portal alongside visibility
    effect(() => {
      if (this.shouldDisplay()) {
        this.attachOverlay();
      } else {
        this.detachOverlay();
      }
    });

    // Focus panel when opened
    effect(() => {
      if (this.sheet.isOpen()) {
        setTimeout(() => this.panelDiv?.nativeElement.focus());
      }
    });

    // Detect external isOpen → false and play leave animation
    let prevOpen = false;
    effect(() => {
      const isOpen = this.sheet.isOpen();
      untracked(() => {
        if (prevOpen && !isOpen && !this._leaving()) {
          this._startLeave();
        }
        prevOpen = isOpen;
      });
    });

    this.destroyRef.onDestroy(() => {
      clearTimeout(this._leaveTimer);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      this.detachOverlay();
      this.overlayRef?.dispose();
    });
  }

  protected onEscape(): void {
    if (this.sheet.isOpen()) this.requestClose();
  }

  /** Trigger close with leave animation (used by backdrop click & Escape in content) */
  protected requestClose(): void {
    if (this._leaving() || !this.sheet.isOpen()) return;
    this.sheet.setOpen(false);
    // isOpen change is picked up by the effect above
  }

  protected readonly backdropClass = computed(() =>
    cn(
      OVERLAY_BACKDROP_CLASS,
      this._leaving() ? 'animate-sheet-backdrop-out' : 'animate-sheet-backdrop-in',
    ),
  );

  protected readonly panelClass = computed(() => {
    const side = this.side();
    return cn(
      OVERLAY_SURFACE_CLASS,
      SHEET_SURFACE_CLASS,
      SIDE_CLASSES[side],
      this._leaving() ? SIDE_LEAVE[side] : SIDE_ENTER[side],
      this.class(),
    );
  });

  private attachOverlay(): void {
    this.overlayRef ??= this.overlay.create({
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().global(),
    });

    if (this.overlayRef.hasAttached()) return;

    this.previouslyFocusedElement = document.activeElement as HTMLElement | null;
    this.hideBackgroundFromAssistiveTech();

    this.portal ??= new TemplatePortal(this.contentTemplateRef, this.viewContainerRef);
    this.overlayRef.attach(this.portal);
  }

  private detachOverlay(): void {
    if (!this.overlayRef?.hasAttached()) return;

    this.overlayRef.detach();
    this.restoreBackgroundFromAssistiveTech();
    this.previouslyFocusedElement?.focus();
    this.previouslyFocusedElement = null;
  }

  private hideBackgroundFromAssistiveTech(): void {
    const overlayContainerElement = this.overlayContainer.getContainerElement();
    this.hiddenSiblings = Array.from(document.body.children).filter(
      (el) => el !== overlayContainerElement && !el.hasAttribute('aria-hidden'),
    );
    for (const el of this.hiddenSiblings) {
      el.setAttribute('aria-hidden', 'true');
    }
  }

  private restoreBackgroundFromAssistiveTech(): void {
    for (const el of this.hiddenSiblings) {
      el.removeAttribute('aria-hidden');
    }
    this.hiddenSiblings = [];
  }

  private _startLeave(): void {
    this._leaving.set(true);
    this._leaveTimer = setTimeout(() => this._leaving.set(false), LEAVE_DURATION_MS);
  }
}
