import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../../utils';
import { SheetComponent } from './sheet.component';
import type { SheetSide } from './sheet.type';

const SIDE_CLASSES: Record<SheetSide, string> = {
  top:    'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
  bottom: 'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
  left:   'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
  right:  'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
};

@Component({
  selector: 'sanring-sheet-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (sheet.isOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        (click)="sheet.setOpen(false)"
      ></div>

      <!-- Panel -->
      <div
        role="dialog"
        aria-modal="true"
        [class]="panelClass()"
      >
        <ng-content></ng-content>
      </div>
    }
  `,
})
export class SheetContentComponent {
  protected readonly sheet = inject(SheetComponent);

  readonly side  = input<SheetSide>('right');
  readonly class = input<string | undefined>();

  protected readonly panelClass = computed(() =>
    cn(
      'fixed z-50 flex flex-col gap-4 bg-[var(--sanring-elevated)] shadow-lg',
      'transition ease-in-out duration-300',
      SIDE_CLASSES[this.side()],
      this.class(),
    ),
  );
}
