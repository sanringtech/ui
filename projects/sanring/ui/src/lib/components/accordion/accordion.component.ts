import { Component, inject } from '@angular/core';
import { AccordionGroup as NgAccordionGroup } from '@angular/aria/accordion';

@Component({
  selector: 'sanring-accordion',
  standalone: true,
  hostDirectives: [
    {
      directive: NgAccordionGroup,
      inputs: ['multiExpandable: multi', 'disabled', 'softDisabled', 'wrap'],
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
export class AccordionComponent {
  private readonly accordion = inject(NgAccordionGroup);

  openAll() {
    this.accordion.expandAll();
  }

  closeAll() {
    this.accordion.collapseAll();
  }
}
