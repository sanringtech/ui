// accordion-content.component.ts
import { Component, Input, Optional, inject } from '@angular/core';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-accordion-content',
  standalone: true,
  template: `
    <div
      class="grid transition-all duration-200 ease-in-out"
      [class.grid-rows-[1fr]]="item?.expanded"
      [class.grid-rows-[0fr]]="!item?.expanded"
      [class.opacity-100]="item?.expanded"
      [class.opacity-0]="!item?.expanded"
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

  // 透過 @Optional 注入，如果沒被放在 Item 裡面也不會報錯
  protected item = inject(CdkAccordionItem, { optional: true });

  @Input() contentClass?: string;
}
