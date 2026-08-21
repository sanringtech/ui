import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { BreadcrumbDividerComponent } from './breadcrumb-divider.component';
import { BreadcrumbEllipsisComponent } from './breadcrumb-ellipsis.component';
import { BreadcrumbItemComponent } from './breadcrumb-item.component';
import { BreadcrumbLinkComponent } from './breadcrumb-link.component';
import { BreadcrumbListComponent } from './breadcrumb-list.component';
import { BreadcrumbPageComponent } from './breadcrumb-page.component';
import { BreadcrumbComponent } from './breadcrumb.component';

@Component({
  imports: [
    BreadcrumbComponent,
    BreadcrumbListComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbPageComponent,
    BreadcrumbDividerComponent,
    BreadcrumbEllipsisComponent,
  ],
  template: `
    <sanring-breadcrumb ariaLabel="導覽路徑" class="custom-breadcrumb">
      <sanring-breadcrumb-list class="custom-list">
        <sanring-breadcrumb-item class="custom-item">
          <sanring-breadcrumb-link routerLink="/docs" class="custom-link"
            >Docs</sanring-breadcrumb-link
          >
        </sanring-breadcrumb-item>
        <sanring-breadcrumb-divider class="custom-divider" />
        <sanring-breadcrumb-ellipsis class="custom-ellipsis" />
        <sanring-breadcrumb-item>
          <sanring-breadcrumb-page class="custom-page">Components</sanring-breadcrumb-page>
        </sanring-breadcrumb-item>
      </sanring-breadcrumb-list>
    </sanring-breadcrumb>
  `,
})
class BreadcrumbTestHost {}

describe('BreadcrumbComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbTestHost],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders breadcrumb navigation with list semantics', () => {
    const fixture = TestBed.createComponent(BreadcrumbTestHost);
    fixture.detectChanges();

    const breadcrumb = fixture.nativeElement.querySelector('sanring-breadcrumb') as HTMLElement;
    const list = fixture.nativeElement.querySelector('sanring-breadcrumb-list') as HTMLElement;
    const items = fixture.nativeElement.querySelectorAll('sanring-breadcrumb-item');

    expect(breadcrumb.getAttribute('role')).toBe('navigation');
    expect(breadcrumb.getAttribute('aria-label')).toBe('導覽路徑');
    expect(list.getAttribute('role')).toBe('list');
    expect(items[0].getAttribute('role')).toBe('listitem');
  });

  it('marks the current page and decorative separators correctly', () => {
    const fixture = TestBed.createComponent(BreadcrumbTestHost);
    fixture.detectChanges();

    const page = fixture.nativeElement.querySelector('sanring-breadcrumb-page') as HTMLElement;
    const divider = fixture.nativeElement.querySelector(
      'sanring-breadcrumb-divider',
    ) as HTMLElement;
    const ellipsis = fixture.nativeElement.querySelector(
      'sanring-breadcrumb-ellipsis',
    ) as HTMLElement;

    expect(page.getAttribute('aria-current')).toBe('page');
    expect(page.getAttribute('aria-disabled')).toBe('true');
    expect(divider.getAttribute('aria-hidden')).toBe('true');
    expect(ellipsis.getAttribute('aria-hidden')).toBe('true');
  });

  it('merges custom classes on breadcrumb primitives', () => {
    const fixture = TestBed.createComponent(BreadcrumbTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('sanring-breadcrumb')?.className).toContain('custom-breadcrumb');
    expect(host.querySelector('sanring-breadcrumb-list')?.className).toContain('custom-list');
    expect(host.querySelector('sanring-breadcrumb-item')?.className).toContain('custom-item');
    expect(host.querySelector('sanring-breadcrumb-link')?.className).toContain('custom-link');
    expect(host.querySelector('sanring-breadcrumb-page')?.className).toContain('custom-page');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(BreadcrumbTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
