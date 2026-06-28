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

@Component({
  imports: [AccordionComponent, AccordionItemComponent, AccordionTriggerComponent, AccordionContentComponent],
  template: `
    <button type="button" (click)="accordion.openAll()">Open all</button>
    <button type="button" (click)="accordion.closeAll()">Close all</button>

    <sanring-accordion #accordion multi>
      <sanring-accordion-item>
        <sanring-accordion-trigger>Question 1</sanring-accordion-trigger>
        <sanring-accordion-content>
          <p>Answer 1</p>
        </sanring-accordion-content>
      </sanring-accordion-item>
      <sanring-accordion-item>
        <sanring-accordion-trigger>Question 2</sanring-accordion-trigger>
        <sanring-accordion-content>
          <p>Answer 2</p>
        </sanring-accordion-content>
      </sanring-accordion-item>
    </sanring-accordion>
  `,
})
class AccordionControlledTestHost {}

describe('AccordionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionTestHost, AccordionControlledTestHost],
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
    expect(trigger?.getAttribute('aria-controls')).toBe(content?.id);
    expect(content?.getAttribute('role')).toBe('region');
    expect(content?.classList.contains('grid-rows-[0fr]')).toBe(true);

    trigger?.click();
    fixture.detectChanges();

    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
    expect(content?.classList.contains('grid-rows-[1fr]'), content?.outerHTML).toBe(true);
    expect(content?.classList.contains('opacity-100')).toBe(true);
    expect(content?.textContent).toContain('Answer');
  });

  it('opens and closes all items when multi is enabled', () => {
    const fixture = TestBed.createComponent(AccordionControlledTestHost);
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const buttons = nativeElement.querySelectorAll('button');
    const contents = () => Array.from(nativeElement.querySelectorAll('[data-accordion-content]'));

    buttons[0].click();
    fixture.detectChanges();

    expect(contents().every((content) => content.classList.contains('grid-rows-[1fr]'))).toBe(true);

    buttons[1].click();
    fixture.detectChanges();

    expect(contents().every((content) => content.classList.contains('grid-rows-[0fr]'))).toBe(true);
  });
});
