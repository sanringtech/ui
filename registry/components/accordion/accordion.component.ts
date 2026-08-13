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

  // @angular/aria 的 AccordionGroup.multiExpandable 預設是 true,跟 sanring 想要的預設值
  // (false,單一展開)相反。hostDirectives.inputs 的 alias 只能單向轉發「消費者有明確綁定」
  // 的值——沒有機制可以覆寫底層 directive 自己的預設值,所以不能單純把 multiExpandable
  // 加進上面的 inputs 陣列了事(試過,會讓所有沒寫 `multi` 的 accordion 預設變成多開)。
  // AccordionGroupPattern 建構時把 multiExpandable 這個 signal 參照分別複製進
  // `_pattern.inputs` 與 `_pattern.expansionBehavior.inputs` 兩層,兩者都是初始化當下
  // 讀死的快照,事後只改 `accordion.multiExpandable` 本身不會被兩層任何一層讀到,所以
  // 三個位置都要覆寫。這幾個是底線開頭的私有欄位,沒有 semver 保證,`@angular/aria`
  // 版本升級後如果這裡的內部結構改變需要重新驗證——對應的 regression test 是
  // accordion.component.spec.ts 的 'opens and closes all items when multi is enabled'
  // 與 'keeps only one item open by default' 這兩筆。
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
