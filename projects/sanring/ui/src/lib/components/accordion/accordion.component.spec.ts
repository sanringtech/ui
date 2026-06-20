import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AccordionComponent } from './accordion.component';
import { AccordionContentComponent } from './accordion-content.component';
import { AccordionItemComponent } from './accordion-item.component';
import { AccordionTriggerComponent } from './accordion-trigger.component';

@Component({
  imports: [AccordionComponent, AccordionItemComponent, AccordionTriggerComponent, AccordionContentComponent],
  template: `
    <sanring-accordion>
      <sanring-accordion-item>
        <sanring-accordion-trigger>
          <span header>Question</span>
        </sanring-accordion-trigger>
        <sanring-accordion-content>
          <p>Answer</p>
        </sanring-accordion-content>
      </sanring-accordion-item>
    </sanring-accordion>
  `,
})
class AccordionTestHost {}

describe('AccordionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionTestHost],
    }).compileComponents();
  });

  it('opens content when the trigger is clicked', () => {
    const fixture = TestBed.createComponent(AccordionTestHost);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const trigger = nativeElement.querySelector('button');
    const content = nativeElement.querySelector('[data-accordion-content]');

    expect(trigger).toBeTruthy();
    expect(content).toBeTruthy();
    expect(content?.classList.contains('grid-rows-[0fr]')).toBe(true);

    trigger?.click();
    fixture.detectChanges();

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(content?.classList.contains('grid-rows-[1fr]'), content?.outerHTML).toBe(true);
    expect(content?.classList.contains('opacity-100')).toBe(true);
  });
});
