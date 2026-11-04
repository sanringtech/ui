import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-table-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'containerClass()',
    // A scrolling container must be keyboard-focusable so keyboard users can scroll it
    // (WCAG 2.1.1, axe scrollable-region-focusable). Only when it actually overflows,
    // so tables that fit add no extra tab stop.
    '[attr.tabindex]': 'scrollable() ? 0 : null',
  },
  styles: `
    sanring-table-container .cdk-table-sticky,
    sanring-table-container .cdk-table-sticky-end {
      background-color: var(--sanring-background);
    }
  `,
})
export class TableContainerComponent {
  readonly class = input<string | undefined>();

  protected readonly scrollable = signal(false);

  protected readonly containerClass = computed(() =>
    cn(
      'relative block w-full overflow-auto',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)]',
      this.class(),
    ),
  );

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (typeof ResizeObserver === 'undefined') return;
      const update = () =>
        this.scrollable.set(
          host.scrollWidth > host.clientWidth || host.scrollHeight > host.clientHeight,
        );
      const observer = new ResizeObserver(update);
      observer.observe(host);
      for (const child of Array.from(host.children)) observer.observe(child);
      update();
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
