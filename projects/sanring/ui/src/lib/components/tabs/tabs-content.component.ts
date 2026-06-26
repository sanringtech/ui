import { TabContent as NgTabContent, TabPanel as NgTabPanel } from '@angular/aria/tabs';
import { Component, computed, inject, input } from '@angular/core';
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
    '[class]': 'tabsContentClass()',
  },
})
export class TabsContentComponent {
  readonly class = input<string | undefined>();

  protected panel = inject(NgTabPanel);
  protected readonly tabsContentClass = computed(() =>
    cn(
      'mt-2 ring-offset-[var(--sanring-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sanring-border-strong)] focus-visible:ring-offset-2',
      this.class(),
    ),
  );
}
