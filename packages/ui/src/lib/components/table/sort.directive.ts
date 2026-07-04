import { Directive, output, signal } from '@angular/core';
import { SortDirection, SortState } from './table.type';

function nextDirection(direction: SortDirection): SortDirection {
  if (direction === 'asc') return 'desc';
  if (direction === 'desc') return null;
  return 'asc';
}

@Directive({
  selector: '[sanringSort]',
  standalone: true,
})
export class SortDirective {
  private readonly _sortState = signal<SortState | null>(null);
  readonly sortState = this._sortState.asReadonly();

  readonly sortChange = output<SortState | null>();

  sort(active: string): void {
    const current = this._sortState();
    const direction = nextDirection(current?.active === active ? current.direction : null);
    const next = direction === null ? null : { active, direction };

    this._sortState.set(next);
    this.sortChange.emit(next);
  }

  isActive(active: string): boolean {
    return this._sortState()?.active === active;
  }

  directionFor(active: string): SortDirection {
    const current = this._sortState();
    return current?.active === active ? current.direction : null;
  }
}
