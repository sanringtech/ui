import { Component, Input, inject } from '@angular/core';
import { cn } from '../../utils';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'sanring-accordion-content',
  standalone: true,
  template: `
    <div
      data-accordion-content
      role="region"
      [id]="item?.id + '-content'"
      [attr.aria-labelledby]="item?.id + '-header'"
      [attr.data-state]="item?.expanded ? 'open' : 'closed'"
      [class]="contentContainerClass"
    >
      <div class="overflow-hidden">
        <div [class]="cn('pb-4 pt-0', class)">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class AccordionContentComponent {
  protected cn = cn;
  protected item = inject(AccordionItemComponent, { optional: true });

  @Input() class?: string;

  protected get contentContainerClass() {
    return cn(
      'grid transition-all duration-200 ease-in-out',
      this.item?.expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
    );
  }
}
