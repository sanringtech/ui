import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { AccordionTrigger as NgAccordionTrigger } from '@angular/aria/accordion';
import { LucideChevronDown } from '@lucide/angular';
import { cn } from '../shared/utils';
import { AccordionItemComponent } from './accordion-item.component';
import { AccordionTriggerVariant } from './accordion.type';

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
        [expanded]="item.isExpanded()"
        (expandedChange)="item.setExpandedFromTrigger($event)"
        [attr.data-state]="item.state()"
        [class]="triggerClass()"
      >
        <ng-content></ng-content>

        <svg
          lucideChevronDown
          class="h-4 w-4 shrink-0 text-[var(--sanring-muted)] transition-transform duration-200"
        ></svg>
      </button>
    }
  `,
})
export class AccordionTriggerComponent {
  protected item = inject(AccordionItemComponent);
  private readonly trigger = viewChild(NgAccordionTrigger);

  readonly class = input<string | undefined>();
  readonly variant = input<AccordionTriggerVariant>('default');

  constructor() {
    effect(() => {
      const trigger = this.trigger();
      const expanded = this.item.isExpanded();

      if (trigger && trigger.expanded() !== expanded) {
        trigger.expanded.set(expanded);
      }
    });
  }

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
