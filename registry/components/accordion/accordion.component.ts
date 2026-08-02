import { ChangeDetectionStrategy, Component, booleanAttribute, inject, input } from '@angular/core';
import { AccordionGroup as NgAccordionGroup } from '@angular/aria/accordion';

@Component({
  selector: 'sanring-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: NgAccordionGroup,
      inputs: ['disabled', 'softDisabled', 'wrap'],
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
  readonly multi = input(false, { transform: booleanAttribute });

  constructor() {
    const accordion = this.accordion as NgAccordionGroup & {
      multiExpandable: () => boolean;
      _pattern: {
        inputs: { multiExpandable: () => boolean };
        expansionBehavior: { inputs: { multiExpandable: () => boolean } };
      };
    };

    accordion.multiExpandable = this.multi;
    accordion._pattern.inputs.multiExpandable = this.multi;
    accordion._pattern.expansionBehavior.inputs.multiExpandable = this.multi;
  }

  openAll() {
    this.accordion.expandAll();
  }

  closeAll() {
    this.accordion.collapseAll();
  }
}
