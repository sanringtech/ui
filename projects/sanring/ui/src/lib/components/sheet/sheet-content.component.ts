import { CdkTrapFocus } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
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
    @if (shouldDisplay()) {
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
    }
  `,
})
export class SheetContentComponent {
  protected readonly sheet = inject(SheetComponent);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('panelDiv') private panelDiv?: ElementRef<HTMLElement>;

  readonly side  = input<SheetSide>('right');
  readonly class = input<string | undefined>();

  private readonly _leaving = signal(false);
  private _leaveTimer: ReturnType<typeof setTimeout> | undefined;

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

  private _startLeave(): void {
    this._leaving.set(true);
    this._leaveTimer = setTimeout(() => this._leaving.set(false), LEAVE_DURATION_MS);
  }
}
