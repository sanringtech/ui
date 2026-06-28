import {
  AfterContentInit,
  booleanAttribute,
  Component,
  ContentChild,
  DestroyRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// 1. 引入 LucideAngularModule 與需要的 X icon
import { LucideX } from '@lucide/angular';
import { cn } from '../shared/utils';
import {
  DIALOG_SURFACE_CLASS,
  OVERLAY_ABSOLUTE_CLOSE_BUTTON_CLASS,
  OVERLAY_CLOSE_ICON_CLASS,
  OVERLAY_SURFACE_CLASS,
} from '../shared/component-styles';
import { DialogDescriptionDirective } from './dialog-description.directive';
import { DialogTitleDirective } from './dialog-title.directive';

@Component({
  selector: 'sanring-dialog-content',
  standalone: true,
  imports: [LucideX],
  host: {
    '[class]': 'dialogContentClass()',
  },
  template: `
    <ng-content></ng-content>

    @if (showClose()) {
      <button
        type="button"
        [attr.aria-label]="closeAriaLabel()"
        (click)="closeDialog()"
        [class]="closeButtonClass"
      >
        <svg lucideX [class]="closeIconClass"></svg>
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
export class DialogContentComponent implements AfterContentInit {
  protected readonly closeButtonClass = OVERLAY_ABSOLUTE_CLOSE_BUTTON_CLASS;
  protected readonly closeIconClass = OVERLAY_CLOSE_ICON_CLASS;

  readonly class = input<string | undefined>();
  readonly showClose = input(true, { transform: booleanAttribute });
  readonly closeAriaLabel = input('關閉對話框');

  private dialogRef = inject(DialogRef, { optional: true });
  private destroyRef = inject(DestroyRef);

  @ContentChild(DialogTitleDirective) private title?: DialogTitleDirective;
  @ContentChild(DialogDescriptionDirective) private description?: DialogDescriptionDirective;

  protected readonly dialogContentClass = computed(() =>
    cn(
      OVERLAY_SURFACE_CLASS,
      DIALOG_SURFACE_CLASS,
      'bg-[var(--sanring-surface)]',
      this.class(),
    ),
  );

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  ngAfterContentInit() {
    this.syncDialogAria();
    this.dialogRef?.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.clearDialogAria();
    });
  }

  private syncDialogAria() {
    const container = this.getDialogContainer();

    if (!container) {
      return;
    }

    if (this.title) {
      container.setAttribute('aria-labelledby', this.title.id());
    }

    if (this.description) {
      container.setAttribute('aria-describedby', this.description.id());
    }
  }

  private clearDialogAria() {
    const container = this.getDialogContainer();
    container?.removeAttribute('aria-describedby');
  }

  private getDialogContainer() {
    return this.dialogRef?.overlayRef.overlayElement.querySelector('cdk-dialog-container');
  }
}
