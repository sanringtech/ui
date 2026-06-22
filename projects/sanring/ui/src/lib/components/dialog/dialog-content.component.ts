import { booleanAttribute, Component, Input, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
// 1. 引入 LucideAngularModule 與需要的 X icon
import { LucideX } from '@lucide/angular';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-dialog-content',
  standalone: true,
  imports: [LucideX],
  host: {
    '[class]': 'dialogContentClass',
  },
  template: `
    <ng-content></ng-content>

    @if (showClose) {
      <button
        type="button"
        (click)="closeDialog()"
        class="absolute right-4 top-4 rounded-sm text-[var(--sanring-muted)] opacity-70 ring-offset-[var(--sanring-surface)] transition-colors transition-opacity hover:text-[var(--sanring-foreground)] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)] focus-visible:ring-offset-2 disabled:pointer-events-none"
      >
        <svg lucideX class="size-4"></svg>
        <span class="sr-only">關閉</span>
      </button>
    }
  `,
  styles: `
    :host {
      animation: sanring-dialog-content-in 160ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes sanring-dialog-content-in {
      from {
        opacity: 0;
        scale: 0.95;
      }

      to {
        opacity: 1;
        scale: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        animation: none;
      }
    }
  `,
})
export class DialogContentComponent {
  @Input() class = '';
  @Input({ transform: booleanAttribute }) showClose = true;

  private dialogRef = inject(DialogRef, { optional: true });

  protected get dialogContentClass() {
    return cn(
      'relative z-50 grid w-full max-w-lg gap-4 border border-[var(--sanring-border)] bg-[var(--sanring-surface)] p-6 shadow-lg sm:rounded-lg',
      this.class,
    );
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
