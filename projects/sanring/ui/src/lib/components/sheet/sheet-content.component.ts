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
} from '@angular/core';
import { cn } from '../../utils';
import { SheetComponent } from './sheet.component';
import type { SheetSide } from './sheet.type';

const SIDE_CLASSES: Record<SheetSide, string> = {
  top: 'inset-x-0 top-0 border-b border-[var(--sanring-border)]',
  bottom: 'inset-x-0 bottom-0 border-t border-[var(--sanring-border)]',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r border-[var(--sanring-border)] sm:max-w-sm',
  right: 'inset-y-0 right-0 h-full w-3/4 border-l border-[var(--sanring-border)] sm:max-w-sm',
};

const SIDE_OPEN_ANIMATION: Record<SheetSide, string> = {
  top: 'slide-in-from-top',
  bottom: 'slide-in-from-bottom',
  left: 'slide-in-from-left',
  right: 'slide-in-from-right',
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
    @if (sheet.isOpen()) {
      <div
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
        aria-hidden="true"
        (click)="sheet.setOpen(false)"
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
        <!--
          X 關閉鈕由消費端自行加入，使用 [sanringSheetClose] 指令搭配 LucideX 圖示：
          <button type="button" sanringSheetClose aria-label="Close">
            <svg lucideX class="size-4"></svg>
          </button>
        -->
        <ng-content></ng-content>
      </div>
    }
  `,
})
export class SheetContentComponent {
  protected readonly sheet = inject(SheetComponent);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('panelDiv') private panelDiv?: ElementRef<HTMLElement>;

  readonly side = input<SheetSide>('right');
  readonly class = input<string | undefined>();

  constructor() {
    effect(() => {
      if (this.sheet.isOpen()) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = 'hidden';

        setTimeout(() => this.panelDiv?.nativeElement.focus());
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    });

    this.destroyRef.onDestroy(() => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    });
  }

  protected onEscape(): void {
    if (this.sheet.isOpen()) this.sheet.setOpen(false);
  }

  protected readonly panelClass = computed(() => {
    const side = this.side();
    return cn(
      'fixed z-50 flex flex-col bg-[var(--sanring-elevated)] shadow-lg',
      // 統一 padding：子元件（header/footer）不再帶各自的 padding
      'p-6 gap-4',
      'animate-in duration-300 ease-out',
      SIDE_CLASSES[side],
      SIDE_OPEN_ANIMATION[side],
      this.class(),
    );
  });
}
