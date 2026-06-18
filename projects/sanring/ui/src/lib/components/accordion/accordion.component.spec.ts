import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Accordion } from './accordion.component';
import { AccordionContent } from './accordion-content.component';
import { AccordionItem } from './accordion-item.component';
import { AccordionTrigger } from './accordion-trigger.component';

@Component({
  imports: [Accordion, AccordionItem, AccordionTrigger, AccordionContent],
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

describe('Accordion', () => {
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
