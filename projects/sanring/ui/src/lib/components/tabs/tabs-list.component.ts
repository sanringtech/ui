import { AfterContentInit, Component, effect, Input, inject, untracked } from '@angular/core';
import { TabList as NgTabList } from '@angular/aria/tabs';
import { cn } from '../../utils';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'sanring-tabs-list',
  standalone: true,
  template: `<ng-content></ng-content>`,
  hostDirectives: [
    {
      directive: NgTabList,
      inputs: ['orientation', 'selectionMode', 'wrap', 'softDisabled', 'focusMode', 'disabled'],
    },
  ],
  host: {
    '[class]': 'tabsListClass',
  },
})
export class TabsListComponent implements AfterContentInit {
  @Input() class = '';

  protected tabs = inject(TabsComponent);
  private tabList = inject(NgTabList);

  constructor() {
    effect(() => {
      const selectedTab = this.tabList.selectedTab();

      if (selectedTab && selectedTab !== this.tabs.value()) {
        untracked(() => this.tabs.setValue(selectedTab));
      }
    });
  }

  ngAfterContentInit() {
    const value = this.tabs.value();

    if (value) {
      this.tabList.selectedTab.set(value);
    }
  }

  protected get tabsListClass() {
    const variant = this.tabs.variant;
    return cn(
      this.tabs.orientation === 'vertical'
        ? 'inline-grid w-max items-stretch'
        : 'inline-flex w-max items-center justify-center',
      variant === 'default' &&
        'rounded-lg border border-[var(--sanring-border)] bg-[var(--sanring-surface-strong)] p-0.5 text-[var(--sanring-muted)] shadow-sm',
      variant === 'line' &&
        (this.tabs.orientation === 'vertical'
          ? 'border-l border-[var(--sanring-border)] bg-transparent p-0'
          : 'justify-start border-b border-[var(--sanring-border)] bg-transparent p-0'),
      this.class,
    );
  }
}
