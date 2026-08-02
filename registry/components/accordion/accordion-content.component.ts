import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  AccordionContent as NgAccordionContent,
  AccordionPanel as NgAccordionPanel,
} from '@angular/aria/accordion';
import { cn } from '../shared/utils';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'sanring-accordion-content',
  standalone: true,
  imports: [NgAccordionContent, NgAccordionPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      ngAccordionPanel
      #panelElement
      #panel="ngAccordionPanel"
      data-accordion-content
      [id]="item ? item.id + '-content' : ''"
      [attr.aria-labelledby]="item ? item.id + '-header' : null"
      [attr.data-state]="item?.state() ?? 'closed'"
      [class]="contentContainerClass()"
    >
      <ng-template ngAccordionContent></ng-template>
      <div class="overflow-hidden">
        <div [class]="contentBodyClass()">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class AccordionContentComponent implements AfterViewInit {
  protected readonly item = inject(AccordionItemComponent, { optional: true });

  @ViewChild(NgAccordionPanel) private panel?: NgAccordionPanel;
  @ViewChild('panelElement') private panelElement?: ElementRef<HTMLElement>;

  readonly class = input<string | undefined>();

  ngAfterViewInit() {
    if (this.item && this.panel) {
      this.item.registerPanel(this.panel);
    }

    if (this.item && this.panelElement) {
      this.panelElement.nativeElement.setAttribute('aria-labelledby', `${this.item.id}-header`);
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
