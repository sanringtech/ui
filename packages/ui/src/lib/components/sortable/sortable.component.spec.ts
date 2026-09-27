import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { expectNoA11yViolations } from '../../../testing/axe-a11y';
import { SortableHandleDirective } from './sortable-handle.directive';
import { SortableItemDirective } from './sortable-item.directive';
import { SortableComponent } from './sortable.component';

@Component({
  imports: [SortableComponent, SortableItemDirective, SortableHandleDirective],
  template: `
    <sanring-sortable class="custom-class" [data]="items" (sorted)="items = $event">
      @for (item of items; track item) {
        <div sanringSortableItem>
          <button sanringSortableHandle type="button" aria-label="Reorder">Grip</button>
          {{ item }}
        </div>
      }
    </sanring-sortable>

    <sanring-sortable [data]="locked" disabled>
      <div sanringSortableItem>Locked</div>
    </sanring-sortable>
  `,
})
class SortableTestHost {
  items: unknown[] = ['alpha', 'beta', 'gamma'];
  locked: unknown[] = ['locked'];
}

describe('SortableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortableTestHost],
    }).compileComponents();
  });

  it('renders without error', () => {
    const fixture = TestBed.createComponent(SortableTestHost);
    fixture.detectChanges();

    expect(fixture.nativeElement).toBeTruthy();
  });

  it('merges host class with consumer class', () => {
    const fixture = TestBed.createComponent(SortableTestHost);
    fixture.detectChanges();

    const root = fixture.nativeElement.querySelector('sanring-sortable') as HTMLElement;
    expect(root.classList.contains('custom-class')).toBe(true);
    expect(root.getAttribute('role')).toBe('list');
  });

  it('reorders items on ArrowDown', () => {
    const fixture = TestBed.createComponent(SortableTestHost);
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('[sanringSortableItem]') as HTMLElement;
    item.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.items).toEqual(['beta', 'alpha', 'gamma']);
  });

  it('ignores keyboard reorder while disabled', () => {
    const fixture = TestBed.createComponent(SortableTestHost);
    fixture.detectChanges();

    const disabled = fixture.nativeElement.querySelectorAll('sanring-sortable')[1] as HTMLElement;
    const item = disabled.querySelector('[sanringSortableItem]') as HTMLElement;
    item.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.locked).toEqual(['locked']);
    expect(item.getAttribute('tabindex')).toBe('-1');
  });

  it('has no axe-detectable a11y violations', async () => {
    const fixture = TestBed.createComponent(SortableTestHost);
    fixture.detectChanges();

    await expectNoA11yViolations(fixture.nativeElement);
  });
});
