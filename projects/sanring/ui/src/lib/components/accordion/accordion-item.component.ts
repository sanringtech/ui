import { Component, DestroyRef, Input, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { cn } from '../../utils';

@Component({
  selector: 'sanring-accordion-item',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkAccordionItem,
      inputs: ['expanded', 'disabled'],
      outputs: ['opened', 'closed', 'expandedChange'],
    },
  ],
  template: `
    <div [class]="itemClass">
      <ng-content select="sanring-accordion-trigger"></ng-content>
      <ng-content select="sanring-accordion-content"></ng-content>
    </div>
  `,
})
export class AccordionItemComponent {
  private readonly item = inject(CdkAccordionItem);
  private readonly destroyRef = inject(DestroyRef);
  private readonly expandedState = signal(false);

  @Input() class?: string;

  get expanded() {
    return this.expandedState();
  }

  get disabled() {
    return this.item.disabled;
  }

  get id() {
    return this.item.id;
  }

  protected get itemClass() {
    return cn('border-b border-[var(--docs-border)]', this.class);
  }

  constructor() {
    this.syncState();
    this.item.expandedChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncState());
  }

  toggle() {
    this.item.toggle();
    this.syncState();
  }

  open() {
    this.item.open();
    this.syncState();
  }

  close() {
    this.item.close();
    this.syncState();
  }

  private syncState() {
    this.expandedState.set(this.item.expanded);
  }
}
