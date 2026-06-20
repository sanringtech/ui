import { Component } from '@angular/core';
import { CdkAccordion } from '@angular/cdk/accordion';

@Component({
  selector: 'sanring-accordion',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkAccordion,
      inputs: ['multi'],
    },
  ],
  // 父容器只需要負責接收裡面的 Item 即可
  template: `
    <div class="w-full">
      <ng-content></ng-content>
    </div>
  `,
  styles: ``,
})
export class AccordionComponent {}
