import {
  ChangeDetectionStrategy,
  Injector,
  afterNextRender,
  booleanAttribute,
  Component,
  Input,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AccordionPanel as NgAccordionPanel } from '@angular/aria/accordion';
import { cn } from '../../utils';

let nextAccordionItemId = 0;

@Component({
  selector: 'sanring-accordion-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="itemClass()">
      <ng-content select="sanring-accordion-trigger"></ng-content>
      <ng-content select="sanring-accordion-content"></ng-content>
    </div>
  `,
})
export class AccordionItemComponent {
  private readonly injector = inject(Injector);
  readonly id = `sanring-accordion-item-${nextAccordionItemId++}`;
  private readonly expandedState = signal(false);
  readonly panel = signal<NgAccordionPanel | null>(null);
  readonly class = input<string | undefined>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly state = computed(() => (this.expandedState() ? 'open' : 'closed'));
  readonly expandedChange = output<boolean>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  @Input({ transform: booleanAttribute })
  set expanded(expanded: boolean) {
    this.setExpanded(expanded);
  }

  get expanded() {
    return this.expandedState();
  }

  protected readonly itemClass = computed(() => cn('border-b border-[var(--sanring-border)]', this.class()));

  registerPanel(panel: NgAccordionPanel) {
    this.panel.set(panel);
    this.syncPanelWithState();
  }

  toggle() {
    this.panel()?.toggle();
  }

  open() {
    this.setExpanded(true);
  }

  close() {
    this.setExpanded(false);
  }

  setExpanded(expanded: boolean) {
    this.updateExpandedState(expanded);
    this.syncPanelWithState();
  }

  setExpandedFromTrigger(expanded: boolean) {
    this.updateExpandedState(expanded);
  }

  private updateExpandedState(expanded: boolean) {
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

  private syncPanelWithState() {
    const panel = this.panel();

    if (!panel) {
      return;
    }

    const expanded = this.expandedState();
    const sync = () => (expanded ? panel.expand() : panel.collapse());

    sync();
    afterNextRender(sync, { injector: this.injector });
  }
}
