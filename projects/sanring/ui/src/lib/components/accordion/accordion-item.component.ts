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
    <div class="border-b border-gray-200">
      <ng-content select="sanring-accordion-trigger"></ng-content>
      <ng-content select="sanring-accordion-content"></ng-content>
    </div>
  `,
})
export class AccordionItemComponent {
  private readonly item = inject(CdkAccordionItem);
  private readonly destroyRef = inject(DestroyRef);
  private readonly expandedState = signal(false);
  protected cn = cn;

  @Input() headerClass?: string;
  // 1. 是否顯示 Description 文字
  @Input() showDescription = false;
  // 2. 切換模式 (icon 或 text)
  @Input() triggerType: 'icon' | 'text' = 'icon';

  get expanded() {
    return this.expandedState();
  }

  get disabled() {
    return this.item.disabled;
  }

  toggle() {
    this.item.toggle();
    this.syncState();
  }

  constructor() {
    this.syncState();
    this.item.expandedChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncState());
  }

  private syncState() {
    this.expandedState.set(this.item.expanded);
  }
}
