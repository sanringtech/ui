import { Component, EventEmitter, Output, computed, effect, input, signal } from '@angular/core';
import { Tabs as NgTabs } from '@angular/aria/tabs';
import { cn } from '../../utils';
import { TabsOrientation, TabsVariant } from './tabs.type';

@Component({
  selector: 'sanring-tabs',
  standalone: true,
  template: `<ng-content></ng-content>`,
  hostDirectives: [NgTabs],
  host: {
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'tabsClass()',
  },
})
export class TabsComponent {
  readonly class = input<string | undefined>();
  readonly orientation = input<TabsOrientation>('horizontal');
  readonly defaultValue = input<string | undefined>();
  readonly variant = input<TabsVariant>('default');

  @Output() valueChange = new EventEmitter<string>();

  readonly value = signal<string | undefined>(undefined);
  protected readonly tabsClass = computed(() =>
    cn(
      this.orientation() === 'vertical' ? 'grid gap-4 sm:grid-cols-[180px_1fr]' : 'grid gap-3',
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      const defaultValue = this.defaultValue();

      if (defaultValue && this.value() === undefined) {
        this.value.set(defaultValue);
      }
    });
  }

  setValue(newValue: string | undefined) {
    if (newValue && this.value() !== newValue) {
      this.value.set(newValue);
      this.valueChange.emit(newValue);
    }
  }
}
