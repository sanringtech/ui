import { Component, inject, Input } from '@angular/core';
import { cn } from '../../utils';
import { LucideChevronDown } from '@lucide/angular';
import { AccordionItem } from './accordion-item.component';

@Component({
  selector: 'sanring-accordion-trigger',
  imports: [LucideChevronDown],
  template: `
    <button
      type="button"
      (click)="item.toggle()"
      [disabled]="item.disabled"
      [attr.aria-expanded]="item.expanded"
      [attr.data-state]="item.expanded ? 'open' : 'closed'"
      [class]="
        cn(
          'flex w-full items-center justify-between px-4 py-2 text-left font-medium transition-all hover:underline',
          headerClass
        )
      "
    >
      <ng-content select="[header]"></ng-content>

      <span class="ml-auto transition-transform duration-200" [class.rotate-180]="item.expanded">
        <ng-content select="[icon]">
          <svg lucideChevronDown></svg>
        </ng-content>
      </span>
    </button>
  `,
})
export class AccordionTrigger {
  protected item = inject(AccordionItem);
  protected cn = cn;

  @Input() headerClass?: string;
}
