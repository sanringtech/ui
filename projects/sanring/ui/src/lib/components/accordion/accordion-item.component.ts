import { Component, Input, inject } from '@angular/core';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-accordion-item',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkAccordionItem,
      inputs: ['expanded', 'disabled'],
      outputs: ['opened', 'closed', 'expandedChange'],
    },
  ],
  template: `
    <div class="border-b border-gray-200">
      <ng-content select="sanring-accordion-trigger"></ng-content>
      <ng-content select="sanring-accordion-content"></ng-content>
    </div>
  `,
})
export class AccordionItem {
  protected item = inject(CdkAccordionItem);
  protected cn = cn;

  @Input() headerClass?: string;
  // 1. 是否顯示 Description 文字
  @Input() showDescription = false;
  // 2. 切換模式 (icon 或 text)
  @Input() triggerType: 'icon' | 'text' = 'icon';
}
