import { Directive, model } from '@angular/core';
import { SortDirection, SortState } from './table.type';

function nextDirection(direction: SortDirection | null): SortDirection | null {
  if (direction === 'asc') return 'desc';
  if (direction === 'desc') return null;
  return 'asc';
}

@Directive({
  selector: '[sanringSort]',
  standalone: true,
})
export class SortDirective {
  // model() 同時提供：初始值（[sanringSort]="initialState"）、
  // 雙向綁定（[(sanringSort)]="state"）、外部可隨時 .set(null) 重置。
  readonly sortState = model<SortState | null>(null, { alias: 'sanringSort' });

  sort(active: string): void {
    const current = this.sortState();
    const direction = nextDirection(current?.active === active ? current.direction : null);

    this.sortState.set(direction === null ? null : { active, direction });
  }

  isActive(active: string): boolean {
    return this.sortState()?.active === active;
  }

  directionFor(active: string): SortDirection | null {
    const current = this.sortState();
    return current?.active === active ? current.direction : null;
  }
}
