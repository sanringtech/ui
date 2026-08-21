import { LucideCheck } from '@lucide/angular';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { cn } from '../shared/utils';
import { COLLECTION_ITEM_DISABLED_CLASS } from '../shared/component-styles';
import { TransferPanelComponent } from './transfer-panel.component';
import { TransferItem } from './transfer.type';

@Component({
  selector: 'sanring-transfer-item',
  standalone: true,
  imports: [LucideCheck],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span aria-hidden="true" [class]="indicatorClass()">
      @if (checked()) {
        <svg lucideCheck class="size-3"></svg>
      }
    </span>
    <span>{{ item().label }}</span>
  `,
  host: {
    '[class]': 'itemClass()',
    role: 'checkbox',
    '[attr.aria-checked]': 'checked()',
    '[attr.aria-label]': 'item().label',
    '[attr.aria-disabled]': 'isDisabled() || null',
    '[attr.tabindex]': 'isDisabled() ? -1 : panel.isActiveItem(item().key) ? 0 : -1',
    '(click)': 'toggle($event)',
    '(keydown.space)': 'toggle($event)',
    '(focus)': 'panel.setActiveItem(item().key)',
  },
})
export class TransferItemComponent {
  readonly item = input.required<TransferItem>();

  protected readonly panel = inject(TransferPanelComponent);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  protected readonly checked = computed(() => this.panel.isSelected(this.item().key));

  // 兩種來源都會讓一個項目「不能互動」：項目本身標了 disabled，或是它所在的
  // panel 因為 one-way 模式整個變成唯讀（target 面板不接受勾選）。
  readonly isDisabled = computed(() => !!this.item().disabled || !this.panel.interactive());

  protected readonly indicatorClass = computed(() =>
    cn(
      'flex size-4 shrink-0 items-center justify-center rounded-[var(--sanring-radius-xs)] border border-[var(--sanring-primary)]',
      this.checked() && 'bg-[var(--sanring-primary)] text-[var(--sanring-primary-fg)]',
    ),
  );

  protected readonly itemClass = computed(() =>
    cn(
      'flex items-center gap-2 px-3 py-2 text-sm text-[var(--sanring-foreground)] transition-colors',
      'outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--sanring-border-strong)]',
      this.isDisabled()
        ? cn(COLLECTION_ITEM_DISABLED_CLASS, 'cursor-not-allowed')
        : 'cursor-pointer hover:bg-[var(--sanring-surface-strong)]',
    ),
  );

  toggle(event: Event): void {
    event.preventDefault();
    if (this.isDisabled()) return;
    this.panel.toggleSelected(this.item().key);
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}
