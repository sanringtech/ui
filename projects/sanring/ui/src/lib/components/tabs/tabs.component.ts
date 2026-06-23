import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { Tabs as NgTabs } from '@angular/aria/tabs';
import { cn } from '../../utils';
import { TabsOrientation, TabsVariant } from './tabs.type';

@Component({
  selector: 'sanring-tabs',
  standalone: true,
  template: `<ng-content></ng-content>`,
  hostDirectives: [NgTabs],
  host: {
    '[attr.data-orientation]': 'orientation',
    '[class]': 'tabsClass',
  },
})
export class TabsComponent implements OnInit {
  @Input() class = '';
  @Input() orientation: TabsOrientation = 'horizontal';
  @Input() defaultValue?: string;
  @Input() variant: TabsVariant = 'default';

  @Output() valueChange = new EventEmitter<string>();

  readonly value = signal<string | undefined>(undefined);

  ngOnInit() {
    if (this.defaultValue) {
      this.value.set(this.defaultValue);
    }
  }

  setValue(newValue: string | undefined) {
    if (newValue && this.value() !== newValue) {
      this.value.set(newValue);
      this.valueChange.emit(newValue);
    }
  }

  protected get tabsClass() {
    return cn(
      this.orientation === 'vertical' ? 'grid gap-4 sm:grid-cols-[180px_1fr]' : 'grid gap-3',
      this.class,
    );
  }
}
