import { Component, Input, inject } from '@angular/core';
import { cn } from '../../utils';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'sanring-tabs-content',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'tabpanel',
    tabindex: '0',
    '[hidden]': '!isActive()',
    '[attr.data-state]': "isActive() ? 'active' : 'inactive'",
    '[class]': 'tabsContentClass',
  },
})
export class TabsContentComponent {
  @Input({ required: true }) value!: string;
  @Input() class = '';

  private tabs = inject(TabsComponent);

  isActive(): boolean {
    return this.tabs.value() === this.value;
  }

  protected get tabsContentClass() {
    return cn(
      'mt-2 ring-offset-[var(--docs-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-border-strong)] focus-visible:ring-offset-2',
      this.class,
    );
  }
}
