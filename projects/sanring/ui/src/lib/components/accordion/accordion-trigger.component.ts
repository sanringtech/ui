import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AccordionTrigger as NgAccordionTrigger } from '@angular/aria/accordion';
import { LucideChevronDown } from '@lucide/angular';
import { cn } from '../../utils';
import { AccordionItemComponent } from './accordion-item.component';

export type AccordionTriggerVariant = 'default' | 'underline';

@Component({
  selector: 'sanring-accordion-trigger',
  standalone: true,
  imports: [LucideChevronDown, NgAccordionTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item.panel(); as panel) {
      <button
        ngAccordionTrigger
        type="button"
        [panel]="panel"
        [id]="item.id + '-header'"
        [disabled]="item.disabled()"
        [expanded]="item.expanded"
        (expandedChange)="item.setExpandedFromTrigger($event)"
        [attr.data-state]="item.state()"
        [class]="triggerClass()"
      >
        <ng-content></ng-content>

        <svg
          lucideChevronDown
          class="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
        ></svg>
      </button>
    }
  `,
})
export class AccordionTriggerComponent {
  protected item = inject(AccordionItemComponent);

  readonly class = input<string | undefined>();
  readonly variant = input<AccordionTriggerVariant>('default');

  protected readonly triggerClass = computed(() =>
    cn(
      'flex w-full flex-1 items-center justify-between rounded-md py-4 text-left font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)] [&[data-state=open]>svg]:rotate-180',
      this.variant() === 'underline'
        ? 'hover:underline'
        : 'px-3 hover:bg-[var(--sanring-surface-strong)]',
      this.class(),
    ),
  );
}
