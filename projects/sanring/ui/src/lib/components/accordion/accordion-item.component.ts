import { booleanAttribute, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { AccordionPanel as NgAccordionPanel } from '@angular/aria/accordion';
import { cn } from '../../utils';

let nextAccordionItemId = 0;

@Component({
  selector: 'sanring-accordion-item',
  standalone: true,
  template: `
    <div [class]="itemClass">
      <ng-content select="sanring-accordion-trigger"></ng-content>
      <ng-content select="sanring-accordion-content"></ng-content>
    </div>
  `,
})
export class AccordionItemComponent {
  readonly id = `sanring-accordion-item-${nextAccordionItemId++}`;
  private readonly expandedState = signal(false);
  readonly panel = signal<NgAccordionPanel | null>(null);

  @Input() class?: string;
  @Input({ transform: booleanAttribute }) disabled = false;

  @Input({ transform: booleanAttribute })
  set expanded(expanded: boolean) {
    this.setExpanded(expanded);
  }

  get expanded() {
    return this.expandedState();
  }

  @Output() expandedChange = new EventEmitter<boolean>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  protected get itemClass() {
    return cn('border-b border-[var(--sanring-border)]', this.class);
  }

  registerPanel(panel: NgAccordionPanel) {
    this.panel.set(panel);
  }

  toggle() {
    this.panel()?.toggle();
  }

  open() {
    this.panel()?.expand();
  }

  close() {
    this.panel()?.collapse();
  }

  setExpanded(expanded: boolean) {
    const previousExpanded = this.expandedState();
    this.expandedState.set(expanded);

    if (previousExpanded === expanded) {
      return;
    }

    this.expandedChange.emit(expanded);

    if (expanded) {
      this.opened.emit();
    } else {
      this.closed.emit();
    }
  }
}
