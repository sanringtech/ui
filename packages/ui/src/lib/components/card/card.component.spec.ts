import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { CardContentComponent } from './card-content.component';
import { CardDescriptionDirective } from './card-description.directive';
import { CardFooterComponent } from './card-footer.component';
import { CardHeaderComponent } from './card-header.component';
import { CardTitleDirective } from './card-title.directive';
import { CardComponent } from './card.component';

@Component({
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    CardDescriptionDirective,
    CardContentComponent,
    CardFooterComponent,
  ],
  template: `
    <sanring-card class="custom-card">
      <sanring-card-header class="custom-header">
        <h3 sanringCardTitle class="custom-title">Plan</h3>
        <p sanringCardDescription class="custom-description">Production plan</p>
      </sanring-card-header>
      <sanring-card-content class="custom-content">Content</sanring-card-content>
      <sanring-card-footer class="custom-footer">Footer</sanring-card-footer>
    </sanring-card>
  `,
})
class CardTestHost {}

describe('CardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTestHost],
    }).compileComponents();
  });

  it('renders the full card composition', () => {
    const fixture = TestBed.createComponent(CardTestHost);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('sanring-card') as HTMLElement;

    expect(card.textContent).toContain('Plan');
    expect(card.textContent).toContain('Production plan');
    expect(card.textContent).toContain('Content');
    expect(card.textContent).toContain('Footer');
  });

  it('merges custom classes on every card primitive', () => {
    const fixture = TestBed.createComponent(CardTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('sanring-card')?.className).toContain('custom-card');
    expect(host.querySelector('sanring-card-header')?.className).toContain('custom-header');
    expect(host.querySelector('[sanringCardTitle]')?.className).toContain('custom-title');
    expect(host.querySelector('[sanringCardDescription]')?.className).toContain(
      'custom-description',
    );
    expect(host.querySelector('sanring-card-content')?.className).toContain('custom-content');
    expect(host.querySelector('sanring-card-footer')?.className).toContain('custom-footer');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(CardTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
