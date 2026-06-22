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
      this.tabs.orientation === 'vertical'
        ? 'inline-grid w-max items-stretch'
        : 'inline-flex w-max items-center justify-center',
      variant === 'default' &&
        'rounded-lg border border-[var(--docs-border)] bg-[var(--docs-surface-strong)] p-0.5 text-[var(--docs-muted)] shadow-sm',
      variant === 'line' &&
        (this.tabs.orientation === 'vertical'
          ? 'border-l border-[var(--docs-border)] bg-transparent p-0'
          : 'justify-start border-b border-[var(--docs-border)] bg-transparent p-0'),
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
