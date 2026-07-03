import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  AccordionContent as NgAccordionContent,
  AccordionPanel as NgAccordionPanel,
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
      [preserveContent]="true"
      data-accordion-content
      [id]="item?.id + '-content'"
      [attr.data-state]="item?.state() ?? 'closed'"
      [class]="contentContainerClass()"
    >
      <ng-template ngAccordionContent>
        <div class="overflow-hidden">
          <div [class]="contentBodyClass()">
            <ng-content></ng-content>
          </div>
        </div>
      </ng-template>
    </div>
  `,
})
export class AccordionContentComponent implements AfterViewInit {
  protected readonly item = inject(AccordionItemComponent, { optional: true });

  @ViewChild(NgAccordionPanel) private panel?: NgAccordionPanel;

  readonly class = input<string | undefined>();

  ngAfterViewInit() {
    if (this.item && this.panel) {
      this.item.registerPanel(this.panel);
    }
  }

  protected readonly contentContainerClass = computed(() =>
    cn(
      'grid transition-all duration-200 ease-in-out',
      this.item?.isExpanded() ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
    ),
  );

  protected readonly contentBodyClass = computed(() => cn('p-3', this.class()));
}
