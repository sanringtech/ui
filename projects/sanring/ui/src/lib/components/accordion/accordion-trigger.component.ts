import { Component, inject, Input } from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';
import { cn } from '../../utils';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'sanring-accordion-trigger',
  standalone: true,
  imports: [LucideChevronDown],
  template: `
    <button
      type="button"
      (click)="item.toggle()"
      [disabled]="item.disabled"
      [id]="item.id + '-header'"
      [attr.aria-controls]="item.id + '-content'"
      [attr.aria-expanded]="item.expanded"
      [attr.data-state]="item.expanded ? 'open' : 'closed'"
      [class]="
        cn(
          'flex w-full flex-1 items-center justify-between py-4 text-left font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
          class
        )
      "
    >
      <ng-content></ng-content>

      <svg
        lucideChevronDown
        class="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
      ></svg>
    </button>
  `,
})
export class AccordionTriggerComponent {
  protected item = inject(AccordionItemComponent);
  protected cn = cn;

  @Input() class?: string;
}
