import { booleanAttribute, Component, ElementRef, inject, Input } from '@angular/core';
import { cn } from '../../utils';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'sanring-tabs-trigger',
  standalone: true,
  template: `<ng-content></ng-content>`,
  host: {
    role: 'tab',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-disabled]': 'disabled',
    '[attr.data-state]': "isSelected() ? 'active' : 'inactive'",
    '[attr.data-disabled]': "disabled ? '' : null",
    '[tabindex]': "disabled ? '-1' : isSelected() ? '0' : '-1'",
    '(click)': 'selectTab()',
    '[class]': 'tabsTriggerClass',
  },
})
export class TabsTriggerComponent {
  @Input({ required: true }) value!: string;
  @Input() class = '';
  @Input({ transform: booleanAttribute }) disabled = false;

  private elementRef = inject(ElementRef<HTMLElement>);
  protected tabs = inject(TabsComponent);

  focus() {
    this.elementRef.nativeElement.focus();
  }

  isSelected(): boolean {
    return this.tabs.value() === this.value;
  }

  selectTab() {
    if (!this.disabled) {
      this.tabs.setValue(this.value);
    }
  }

  protected get tabsTriggerClass() {
    const variant = this.tabs.variant;
    return cn(
      'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-border-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--docs-bg)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      variant === 'default' &&
        'rounded-md border border-transparent px-2.5 py-1 text-[var(--docs-muted)] hover:bg-[var(--docs-elevated)] hover:text-[var(--docs-fg)] data-[state=active]:border-[var(--docs-border-strong)] data-[state=active]:bg-[var(--docs-active)] data-[state=active]:text-[var(--docs-fg)] data-[state=active]:shadow-sm',
      variant === 'line' &&
        cn(
          'rounded-none border-transparent text-[var(--docs-muted)] data-[state=active]:border-[var(--docs-fg)] data-[state=active]:text-[var(--docs-fg)]',
          this.tabs.orientation === 'vertical'
            ? 'justify-start border-l-2 px-3 py-2'
            : 'border-b-2 pb-2.5 pt-2',
        ),
      this.class,
    );
  }
}
