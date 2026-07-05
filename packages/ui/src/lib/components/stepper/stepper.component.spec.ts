import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { StepIconDirective } from './step-icon.directive';
import { StepLabelDirective } from './step-label.directive';
import { StepComponent } from './step.component';
import { StepperNextDirective } from './stepper-next.directive';
import { StepperPreviousDirective } from './stepper-previous.directive';
import { StepperComponent } from './stepper.component';

function keydown(keyCode: number): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'keyCode', { get: () => keyCode });
  return event;
}

const RIGHT_ARROW = 39;
const LEFT_ARROW = 37;
const HOME = 36;
const END = 35;
const ENTER_KEY = 13;

@Component({
  imports: [
    StepComponent,
    StepIconDirective,
    StepLabelDirective,
    StepperComponent,
    StepperNextDirective,
    StepperPreviousDirective,
  ],
  template: `
    <sanring-stepper lineStyle="dashed" optionalLabel="選填">
      <sanring-step label="Account">
        <ng-template sanringStepLabel>
          <span class="custom-label">Account label</span>
        </ng-template>
        Account content
        <button sanringStepperNext>Next</button>
      </sanring-step>
      <sanring-step label="Profile" optional>
        <ng-template sanringStepIcon let-index let-state="state">
          <span class="custom-icon">{{ index }} {{ state }}</span>
        </ng-template>
        Profile content
        <button sanringStepperPrevious>Previous</button>
      </sanring-step>
    </sanring-stepper>
  `,
})
class StepperTestHost {}

describe('StepperComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperTestHost],
    }).compileComponents();
  });

  it('renders headers, dashed connectors, selected content, and custom icons', () => {
    const fixture = TestBed.createComponent(StepperTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const headers = host.querySelectorAll('sanring-step-header');

    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toContain('Account label');
    expect(headers[1].textContent).toContain('Profile');
    expect(headers[1].textContent).toContain('選填');
    expect(host.querySelector('.border-dashed')).not.toBeNull();
    expect(host.textContent).toContain('Account content');
    expect(host.querySelector('.custom-icon')?.textContent).toContain('2 default');
  });

  it('selects a navigable step from its header', () => {
    const fixture = TestBed.createComponent(StepperTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const headers = host.querySelectorAll('sanring-step-header');

    headers[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(host.textContent).toContain('Profile content');
    expect(headers[1].getAttribute('aria-selected')).toBe('true');
  });

  it('supports next and previous directives', () => {
    const fixture = TestBed.createComponent(StepperTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    host.querySelector<HTMLButtonElement>('button[sanringStepperNext]')?.click();
    fixture.detectChanges();

    expect(host.textContent).toContain('Profile content');

    host.querySelector<HTMLButtonElement>('button[sanringStepperPrevious]')?.click();
    fixture.detectChanges();

    expect(host.textContent).toContain('Account content');
  });

  it('moves focus with ArrowRight/ArrowLeft/Home/End and selects the focused step on Enter', () => {
    const fixture = TestBed.createComponent(StepperTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const tablist = host.querySelector('[role="tablist"]') as HTMLElement;
    const headers = host.querySelectorAll('sanring-step-header');

    (headers[0] as HTMLElement).focus();
    tablist.dispatchEvent(keydown(RIGHT_ARROW));
    fixture.detectChanges();
    expect(document.activeElement).toBe(headers[1]);

    tablist.dispatchEvent(keydown(LEFT_ARROW));
    fixture.detectChanges();
    expect(document.activeElement).toBe(headers[0]);

    tablist.dispatchEvent(keydown(END));
    fixture.detectChanges();
    expect(document.activeElement).toBe(headers[1]);

    tablist.dispatchEvent(keydown(HOME));
    fixture.detectChanges();
    expect(document.activeElement).toBe(headers[0]);

    tablist.dispatchEvent(keydown(RIGHT_ARROW));
    fixture.detectChanges();
    tablist.dispatchEvent(keydown(ENTER_KEY));
    fixture.detectChanges();

    expect(headers[1].getAttribute('aria-selected')).toBe('true');
    expect(host.textContent).toContain('Profile content');
  });
});

@Component({
  imports: [StepComponent, StepperComponent, StepperNextDirective, ReactiveFormsModule],
  template: `
    <sanring-stepper linear>
      <sanring-step label="One" [stepControl]="control">
        One content
        <button sanringStepperNext>Next</button>
      </sanring-step>
      <sanring-step label="Two">Two content</sanring-step>
    </sanring-stepper>
  `,
})
class LinearStepperTestHost {
  readonly control = new FormControl('', Validators.required);
}

describe('StepperComponent (linear + stepControl)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinearStepperTestHost],
    }).compileComponents();
  });

  it('blocks forward navigation while the current step control is invalid', () => {
    const fixture = TestBed.createComponent(LinearStepperTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const headers = host.querySelectorAll('sanring-step-header');

    expect(headers[1].getAttribute('aria-disabled')).toBe('true');

    host.querySelector<HTMLButtonElement>('button[sanringStepperNext]')?.click();
    fixture.detectChanges();

    expect(host.textContent).toContain('One content');
    expect(headers[0].getAttribute('aria-selected')).toBe('true');
  });

  it('allows forward navigation once the step control becomes valid', () => {
    const fixture = TestBed.createComponent(LinearStepperTestHost);
    fixture.detectChanges();

    fixture.componentInstance.control.setValue('answer');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    host.querySelector<HTMLButtonElement>('button[sanringStepperNext]')?.click();
    fixture.detectChanges();

    const headers = host.querySelectorAll('sanring-step-header');
    expect(host.textContent).toContain('Two content');
    expect(headers[1].getAttribute('aria-selected')).toBe('true');
  });
});

@Component({
  imports: [StepComponent, StepperComponent],
  template: `
    <sanring-stepper>
      <sanring-step label="One" [editable]="editable">One content</sanring-step>
      <sanring-step label="Two">Two content</sanring-step>
    </sanring-stepper>
  `,
})
class NonEditableStepTestHost {
  editable = false;
}

describe('StepperComponent (editable)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonEditableStepTestHost],
    }).compileComponents();
  });

  it('blocks returning to a completed step once editable is false', () => {
    const fixture = TestBed.createComponent(NonEditableStepTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const headers = host.querySelectorAll('sanring-step-header');

    headers[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(host.textContent).toContain('Two content');

    headers[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(host.textContent).toContain('Two content');
    expect(headers[0].getAttribute('aria-disabled')).toBe('true');
  });
});

@Component({
  imports: [StepComponent, StepperComponent],
  template: `
    <sanring-stepper>
      <sanring-step label="One">One content</sanring-step>
      <sanring-step label="Two" [completed]="completed">Two content</sanring-step>
      <sanring-step label="Three" [hasError]="hasError">Three content</sanring-step>
    </sanring-stepper>
  `,
})
class StateRenderingTestHost {
  completed = true;
  hasError = true;
}

describe('StepperComponent (completed / hasError rendering)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateRenderingTestHost],
    }).compileComponents();
  });

  it('renders a check icon for a completed, non-selected step', () => {
    const fixture = TestBed.createComponent(StateRenderingTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const headers = host.querySelectorAll('sanring-step-header');

    expect(headers[1].querySelector('svg[lucidecheck]')).not.toBeNull();
    expect(headers[1].querySelector('.bg-\\[var\\(--sanring-foreground\\)\\]')).not.toBeNull();
  });

  it('renders an error icon and error styling when hasError is true, even though it is not selected', () => {
    const fixture = TestBed.createComponent(StateRenderingTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const headers = host.querySelectorAll('sanring-step-header');

    expect(headers[2].querySelector('svg[lucidecirclealert]')).not.toBeNull();
    expect(headers[2].querySelector('.border-red-500')).not.toBeNull();
  });
});

@Component({
  imports: [StepComponent, StepperComponent],
  template: `
    <sanring-stepper orientation="vertical">
      <sanring-step label="One">One content</sanring-step>
      <sanring-step label="Two">Two content</sanring-step>
    </sanring-stepper>
  `,
})
class VerticalStepperTestHost {}

describe('StepperComponent (vertical orientation)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalStepperTestHost],
    }).compileComponents();
  });

  it('renders a vertical tablist and connector', () => {
    const fixture = TestBed.createComponent(VerticalStepperTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const tablist = host.querySelector('[role="tablist"]') as HTMLElement;

    expect(tablist.getAttribute('aria-orientation')).toBe('vertical');
    expect(tablist.classList.contains('flex-col')).toBe(true);
    expect(tablist.classList.contains('items-start')).toBe(true);
    expect(tablist.classList.contains('items-center')).toBe(false);
    expect(host.querySelector('.border-l-2')).not.toBeNull();
  });
});
