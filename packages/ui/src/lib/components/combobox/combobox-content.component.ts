import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { ComboboxComponent } from './combobox.component';
import { cn } from '../../utils';
import { OVERLAY_SURFACE_CLASS } from '../component-styles';

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
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly contentClass = computed(() =>
    cn(
      'absolute left-0 top-full z-50 mt-2 w-full min-w-32 overflow-hidden rounded-[var(--sanring-radius)] outline-none',
      OVERLAY_SURFACE_CLASS,
      this.class(),
    ),
  );

  constructor() {
    // Focus the search input inside the panel when it opens — matters for the "collapsed
    // trigger button expands into a search box" pattern (see ComboboxTriggerDirective),
    // where opening otherwise leaves focus stranded on the (now hidden-behind-the-panel)
    // trigger. A no-op for the plain always-visible-input usage, since that input already
    // has focus by the time it calls toggleOpen(true) itself.
    effect(() => {
      if (!this.combobox.isOpen()) return;
      afterNextRender(
        () => this.elementRef.nativeElement.querySelector<HTMLElement>('input[role="combobox"]')?.focus(),
        { injector: this.injector },
      );
    });
  }

  protected close(): void {
    this.combobox.toggleOpen(false);
  }

  @HostListener('document:pointerdown', ['$event'])
  protected handleDocumentPointerDown(event: PointerEvent): void {
    if (!this.combobox.isOpen() || this.combobox.containsElement(event.target)) return;
    this.close();
  }
}
