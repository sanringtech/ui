import { TabContent as NgTabContent, TabPanel as NgTabPanel } from '@angular/aria/tabs';
import { Component, inject, Input } from '@angular/core';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-tabs-content',
  standalone: true,
  imports: [NgTabContent, NgTabPanel],
  template: `
    <ng-template ngTabContent>
      <ng-content></ng-content>
    </ng-template>
  `,
  hostDirectives: [
    {
      directive: NgTabPanel,
      inputs: ['value'],
    },
  ],
  host: {
    '[hidden]': '!panel.visible()',
    '[attr.data-state]': "panel.visible() ? 'active' : 'inactive'",
    '[class]': 'tabsContentClass',
  },
})
export class TabsContentComponent {
  @Input() class = '';

  protected panel = inject(NgTabPanel);

  protected get tabsContentClass() {
    return cn(
      'mt-2 ring-offset-[var(--sanring-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)] focus-visible:ring-offset-2',
      this.class,
    );
  }
}
