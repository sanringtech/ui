import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  input,
} from '@angular/core';
import { ComboboxComponent } from './combobox.component';
import { cn } from '../shared/utils';
import { OVERLAY_SURFACE_CLASS } from '../shared/component-styles';

@Component({
  selector: 'sanring-combobox-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (combobox.isOpen()) {
      <div
        tabindex="-1"
        [class]="contentClass()"
        [attr.data-state]="combobox.isOpen() ? 'open' : 'closed'"
        (keydown.escape)="close()"
      >
        <ng-content></ng-content>
      </div>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ComboboxContentComponent {
  readonly class = input<string | undefined>();

  protected combobox = inject(ComboboxComponent);

  protected readonly contentClass = computed(() =>
    cn(
      'absolute left-0 top-full z-50 mt-2 w-full min-w-32 overflow-hidden rounded-[var(--sanring-radius)] outline-none',
      OVERLAY_SURFACE_CLASS,
      this.class(),
    ),
  );

  protected close(): void {
    this.combobox.toggleOpen(false);
  }

  @HostListener('document:pointerdown', ['$event'])
  protected handleDocumentPointerDown(event: PointerEvent): void {
    if (!this.combobox.isOpen() || this.combobox.containsElement(event.target)) return;
    this.close();
  }
}
