import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  afterRenderEffect,
  computed,
  inject,
} from '@angular/core';
import {
  AccordionContent as NgAccordionContent,
  AccordionPanel as NgAccordionPanel,
  ɵɵDeferredContentAware as DeferredContentAware,
} from '@angular/aria/accordion';
import { cn } from '../../utils';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'sanring-accordion-content',
  standalone: true,
  imports: [NgAccordionContent, NgAccordionPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      ngAccordionPanel
      #panel="ngAccordionPanel"
      data-accordion-content
      [id]="item?.id + '-content'"
      [attr.data-state]="item?.expanded ? 'open' : 'closed'"
      [class]="contentContainerClass()"
    >
      <div class="overflow-hidden">
        <ng-template ngAccordionContent>
          <div [class]="cn('pb-4 pt-0', class)">
            <ng-content></ng-content>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class AccordionContentComponent implements AfterViewInit {
  protected cn = cn;
  protected item = inject(AccordionItemComponent, { optional: true });

  @ViewChild(NgAccordionPanel) private panel?: NgAccordionPanel;
  @ViewChild(DeferredContentAware) private deferredContentAware?: DeferredContentAware;

  @Input() class?: string;

  constructor() {
    afterRenderEffect({
      write: () => {
        this.syncContentVisibility();
      },
    });
  }

  ngAfterViewInit() {
    if (this.item && this.panel) {
      this.item.registerPanel(this.panel);
    }

    this.syncContentVisibility();
  }

  protected readonly contentContainerClass = computed(() =>
    cn(
      'grid transition-all duration-200 ease-in-out',
      this.item?.expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
    ),
  );

  private syncContentVisibility() {
    this.deferredContentAware?.contentVisible.set(this.item?.expanded ?? false);
  }
}
