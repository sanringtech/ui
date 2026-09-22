import {
  afterEveryRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ComboboxChipInputComponent } from './combobox-chip-input.component';
import { cn } from '../shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-combobox-chips',
  standalone: true,
  template: `
    <ng-content></ng-content>
    @if (overflowing()) {
      <span
        data-overflow-ellipsis
        class="shrink-0 select-none text-[var(--sanring-muted)]"
        aria-hidden="true"
      >…</span>
    }
  `,
  host: {
    '[class]': 'chipsClass()',
  },
})
export class ComboboxChipsComponent {
  readonly class = input<string | undefined>();
  /** When false, chips stay on one line and overflow with an ellipsis. */
  readonly wrap = input(true, { transform: booleanAttribute });

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly chipInput = inject(ComboboxChipInputComponent, { optional: true });
  protected readonly overflowing = signal(false);
  /** First chip index that no longer fits on a single line. */
  readonly hiddenFrom = signal<number | null>(null);

  constructor() {
    afterEveryRender(() => {
      if (this.wrap()) {
        if (this.overflowing()) this.overflowing.set(false);
        if (this.hiddenFrom() !== null) this.hiddenFrom.set(null);
        this.chipInput?.setChipsOverflowing(false);
        return;
      }
      const node = this.elementRef.nativeElement;
      const gap = parseFloat(getComputedStyle(node).gap) || 0;
      const chips = [...node.children].filter(
        (child) => child.tagName === 'SANRING-COMBOBOX-CHIP',
      ) as HTMLElement[];
      const widths = chips.map((chip) => chip.offsetWidth);
      const total = (count: number) => {
        if (count <= 0) return 0;
        return (
          widths.slice(0, count).reduce((sum, width) => sum + width, 0) +
          gap * Math.max(0, count - 1)
        );
      };
      const lane = this.chipInput ? this.chipInput.chipLaneWidth() : node.clientWidth;
      const allFit = total(chips.length) <= lane;
      if (allFit) {
        if (this.overflowing()) this.overflowing.set(false);
        if (this.hiddenFrom() !== null) this.hiddenFrom.set(null);
        this.chipInput?.setChipsOverflowing(false);
        return;
      }

      const ellipsis =
        node.querySelector<HTMLElement>('[data-overflow-ellipsis]')?.offsetWidth ?? 14;
      let visible = chips.length;
      while (
        visible > 1 &&
        total(visible) + (visible > 0 ? gap : 0) + ellipsis > lane
      ) {
        visible -= 1;
      }
      if (!this.overflowing()) this.overflowing.set(true);
      this.chipInput?.setChipsOverflowing(true);
      const from = visible < chips.length ? visible : chips.length;
      if (this.hiddenFrom() !== from) this.hiddenFrom.set(from);
    });
  }

  protected readonly chipsClass = computed(() =>
    cn(
      this.wrap()
        ? 'contents'
        : 'flex min-w-0 shrink-0 items-center gap-1 flex-nowrap',
      this.class(),
    ),
  );
}
