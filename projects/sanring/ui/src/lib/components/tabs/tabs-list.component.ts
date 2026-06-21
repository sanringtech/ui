import {
  AfterContentInit,
  Component,
  ContentChildren,
  HostListener,
  Input,
  inject,
  QueryList,
} from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { cn } from '../../utils';
import { TabsTriggerComponent } from './tabs-trigger.component';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'sanring-tabs-list',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'tablist',
    '[attr.aria-orientation]': 'tabs.orientation',
    '[class]': 'tabsListClass',
  },
})
export class TabsListComponent implements AfterContentInit {
  @Input() class = '';

  @ContentChildren(TabsTriggerComponent) triggers!: QueryList<TabsTriggerComponent>;
  protected tabs = inject(TabsComponent);
  private keyManager!: FocusKeyManager<TabsTriggerComponent>;

  protected get tabsListClass() {
    const variant = this.tabs.variant;
    return cn(
      this.tabs.orientation === 'vertical' ? 'inline-grid items-stretch' : 'inline-flex items-center justify-center',
      variant === 'default' &&
        'rounded-md bg-[var(--docs-elevated)] p-1 text-[var(--docs-muted)]',
      variant === 'line' &&
        (this.tabs.orientation === 'vertical'
          ? 'border-l border-[var(--docs-border)] bg-transparent p-0'
          : 'w-full justify-start border-b border-[var(--docs-border)] bg-transparent p-0'),
      this.class,
    );
  }

  ngAfterContentInit() {
    const firstEnabledTrigger = this.triggers.find((trigger) => !trigger.disabled);

    if (firstEnabledTrigger) {
      this.tabs.setInitialValue(firstEnabledTrigger.value);
    }

    this.keyManager = new FocusKeyManager(this.triggers)
      .skipPredicate((trigger) => trigger.disabled)
      .withWrap();

    if (this.tabs.orientation === 'vertical') {
      this.keyManager.withVerticalOrientation();
    } else {
      this.keyManager.withHorizontalOrientation('ltr');
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    this.keyManager.onKeydown(event);

    if (event.key === 'Enter' || event.key === ' ') {
      this.keyManager.activeItem?.selectTab();
      event.preventDefault();
    }
  }
}
