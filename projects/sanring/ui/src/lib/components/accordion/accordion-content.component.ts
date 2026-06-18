// accordion-content.component.ts
import { Component, Input, inject } from '@angular/core';
import { cn } from '../../utils';
import { AccordionItem } from './accordion-item.component';

@Component({
  selector: 'sanring-accordion-content',
  standalone: true,
  template: `
    <div
      data-accordion-content
      [attr.data-state]="item?.expanded ? 'open' : 'closed'"
      [class]="contentContainerClass"
    >
      <div class="overflow-hidden">
        <div [class]="cn('pb-4 pt-0', contentClass)">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class AccordionContent {
  protected cn = cn;

  // 透過 optional 注入，如果沒被放在 Item 裡面也不會報錯
  protected item = inject(AccordionItem, { optional: true });

  @Input() contentClass?: string;

  protected get contentContainerClass() {
    return cn(
      'grid transition-all duration-200 ease-in-out',
      this.item?.expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
    );
  }
}
