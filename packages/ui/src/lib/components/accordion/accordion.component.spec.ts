import { Component, Type, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { AccordionComponent } from './accordion.component';
import { AccordionContentComponent } from './accordion-content.component';
import { AccordionItemComponent } from './accordion-item.component';
import { AccordionTriggerComponent } from './accordion-trigger.component';

const ACCORDION_IMPORTS = [
  AccordionComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  AccordionContentComponent,
];

@Component({
  imports: ACCORDION_IMPORTS,
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
class AccordionBasicTestHost {}

@Component({
  imports: ACCORDION_IMPORTS,
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
class AccordionMultiTestHost {}

@Component({
  imports: ACCORDION_IMPORTS,
  template: `
    <sanring-accordion>
      <sanring-accordion-item
        class="item-one"
        [expanded]="firstExpanded()"
        (expandedChange)="firstExpandedChanges.push($event)"
        (opened)="openedCount = openedCount + 1"
        (closed)="closedCount = closedCount + 1"
      >
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
class AccordionSingleTestHost {
  firstExpanded = signal(false);
  firstExpandedChanges: boolean[] = [];
  openedCount = 0;
  closedCount = 0;
}

@Component({
  imports: ACCORDION_IMPORTS,
  template: `
    <sanring-accordion>
      <sanring-accordion-item
        class="custom-item"
        [disabled]="disabled()"
        [expanded]="expanded()"
        (expandedChange)="expandedChanges.push($event)"
      >
        <sanring-accordion-trigger class="custom-trigger" variant="underline">
          Styled question
        </sanring-accordion-trigger>
        <sanring-accordion-content class="custom-content">
          <p>Styled answer</p>
        </sanring-accordion-content>
      </sanring-accordion-item>
    </sanring-accordion>
  `,
})
class AccordionInputsTestHost {
  disabled = signal(false);
  expanded = signal(false);
  expandedChanges: boolean[] = [];
}

@Component({
  imports: ACCORDION_IMPORTS,
  template: `
    <sanring-accordion>
      <sanring-accordion-item #firstItem>
        <sanring-accordion-trigger>Question 1</sanring-accordion-trigger>
        <sanring-accordion-content>
          <p>Answer 1</p>
        </sanring-accordion-content>
      </sanring-accordion-item>
    </sanring-accordion>
  `,
})
class AccordionItemApiTestHost {
  readonly firstItem = viewChild.required<AccordionItemComponent>('firstItem');
}

function render<T>(component: Type<T>) {
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();

  return {
    fixture,
    nativeElement: fixture.nativeElement as HTMLElement,
  };
}

function getAccordionElements(root: HTMLElement) {
  return {
    triggers: Array.from(
      root.querySelectorAll<HTMLButtonElement>('sanring-accordion-trigger button'),
    ),
    contents: Array.from(root.querySelectorAll<HTMLElement>('[data-accordion-content]')),
  };
}

function expectOpen(trigger: HTMLButtonElement, content: HTMLElement) {
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  expect(trigger.getAttribute('data-state')).toBe('open');
  expect(content.getAttribute('data-state')).toBe('open');
  expect(content.classList.contains('grid-rows-[1fr]'), content.outerHTML).toBe(true);
  expect(content.classList.contains('opacity-100')).toBe(true);
}

function expectClosed(trigger: HTMLButtonElement, content: HTMLElement) {
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(trigger.getAttribute('data-state')).toBe('closed');
  expect(content.getAttribute('data-state')).toBe('closed');
  expect(content.classList.contains('grid-rows-[0fr]'), content.outerHTML).toBe(true);
}

describe('Accordion', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AccordionBasicTestHost,
        AccordionMultiTestHost,
        AccordionSingleTestHost,
        AccordionInputsTestHost,
        AccordionItemApiTestHost,
      ],
    }).compileComponents();
  });

  describe('structure and accessibility', () => {
    it('wires trigger and content ids for aria relationships', () => {
      const { nativeElement } = render(AccordionBasicTestHost);
      const { triggers, contents } = getAccordionElements(nativeElement);
      const [trigger] = triggers;
      const [content] = contents;

      expect(trigger).toBeTruthy();
      expect(content).toBeTruthy();
      expect(trigger.id).toMatch(/^sanring-accordion-item-.+-header$/);
      expect(content.id).toBe(trigger.id.replace(/-header$/, '-content'));
      expect(trigger.getAttribute('aria-controls')).toBe(content.id);
      expect(content.getAttribute('aria-labelledby')).toBe(trigger.id);
      expect(content.getAttribute('role')).toBe('region');
    });

    it('has no axe-detectable a11y violations', async () => {
      const { fixture, nativeElement } = render(AccordionBasicTestHost);
      fixture.detectChanges();

      await expectNoA11yViolations(nativeElement);
    });
  });

  describe('expansion behavior', () => {
    it('opens content when the trigger is clicked', () => {
      const { fixture, nativeElement } = render(AccordionBasicTestHost);
      const { triggers, contents } = getAccordionElements(nativeElement);

      expectClosed(triggers[0], contents[0]);

      triggers[0].click();
      fixture.detectChanges();

      expectOpen(triggers[0], contents[0]);
      expect(contents[0].textContent).toContain('Answer');
    });

    it('toggles content from keyboard activation', () => {
      const { fixture, nativeElement } = render(AccordionBasicTestHost);
      const { triggers, contents } = getAccordionElements(nativeElement);

      triggers[0].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expectOpen(triggers[0], contents[0]);

      triggers[0].dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();

      expectClosed(triggers[0], contents[0]);
    });

    it('keeps only one item open by default', () => {
      const { fixture, nativeElement } = render(AccordionSingleTestHost);
      const { triggers, contents } = getAccordionElements(nativeElement);

      triggers[0].click();
      fixture.detectChanges();

      expectOpen(triggers[0], contents[0]);

      triggers[1].click();
      fixture.detectChanges();

      expectClosed(triggers[0], contents[0]);
      expectOpen(triggers[1], contents[1]);
    });

    it('opens and closes all items when multi is enabled', () => {
      const { fixture, nativeElement } = render(AccordionMultiTestHost);
      const controlButtons =
        nativeElement.querySelectorAll<HTMLButtonElement>('button[type="button"]');
      const { triggers, contents } = getAccordionElements(nativeElement);

      controlButtons[0].click();
      fixture.detectChanges();

      expectOpen(triggers[0], contents[0]);
      expectOpen(triggers[1], contents[1]);

      controlButtons[1].click();
      fixture.detectChanges();

      expectClosed(triggers[0], contents[0]);
      expectClosed(triggers[1], contents[1]);
    });
  });

  describe('inputs and outputs', () => {
    it('syncs the expanded input and emits state changes', () => {
      const { fixture, nativeElement } = render(AccordionSingleTestHost);
      const host = fixture.componentInstance;
      const { triggers, contents } = getAccordionElements(nativeElement);

      host.firstExpanded.set(true);
      fixture.detectChanges();

      expectOpen(triggers[0], contents[0]);
      expect(host.firstExpandedChanges).toEqual([true]);
      expect(host.openedCount).toBe(1);

      host.firstExpanded.set(false);
      fixture.detectChanges();
      fixture.detectChanges();

      expectClosed(triggers[0], contents[0]);
      expect(host.firstExpandedChanges).toEqual([true, false]);
      expect(host.closedCount).toBe(1);
    });

    it('does not emit duplicate changes when the expanded input is unchanged', () => {
      const { fixture } = render(AccordionSingleTestHost);
      const host = fixture.componentInstance;

      host.firstExpanded.set(true);
      fixture.detectChanges();
      fixture.detectChanges();

      expect(host.firstExpandedChanges).toEqual([true]);
      expect(host.openedCount).toBe(1);
    });

    it('applies disabled state and ignores pointer and keyboard activation while disabled', () => {
      const { fixture, nativeElement } = render(AccordionInputsTestHost);
      const host = fixture.componentInstance;
      const { triggers, contents } = getAccordionElements(nativeElement);

      host.disabled.set(true);
      fixture.detectChanges();

      expect(triggers[0].getAttribute('aria-disabled')).toBe('true');

      triggers[0].click();
      triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expectClosed(triggers[0], contents[0]);
      expect(host.expandedChanges).toEqual([]);
    });
  });

  describe('public item api', () => {
    it('opens, closes, and toggles an item programmatically', () => {
      const { fixture, nativeElement } = render(AccordionItemApiTestHost);
      const host = fixture.componentInstance;
      const { triggers, contents } = getAccordionElements(nativeElement);

      host.firstItem().open();
      fixture.detectChanges();

      expectOpen(triggers[0], contents[0]);

      host.firstItem().toggle();
      fixture.detectChanges();

      expectClosed(triggers[0], contents[0]);

      host.firstItem().toggle();
      fixture.detectChanges();

      expectOpen(triggers[0], contents[0]);

      host.firstItem().close();
      fixture.detectChanges();

      expectClosed(triggers[0], contents[0]);
    });
  });

  describe('styling', () => {
    it('applies item, trigger, trigger variant, and content classes', () => {
      const { nativeElement } = render(AccordionInputsTestHost);
      const item = nativeElement.querySelector('.custom-item > div');
      const { triggers } = getAccordionElements(nativeElement);
      const contentBody = nativeElement.querySelector('[data-accordion-content] .custom-content');

      expect(item?.classList.contains('border-b')).toBe(true);
      expect(item?.classList.contains('custom-item')).toBe(true);
      expect(triggers[0].classList.contains('hover:underline')).toBe(true);
      expect(triggers[0].classList.contains('custom-trigger')).toBe(true);
      expect(contentBody?.classList.contains('p-3')).toBe(true);
      expect(contentBody?.classList.contains('custom-content')).toBe(true);
    });
  });
});
