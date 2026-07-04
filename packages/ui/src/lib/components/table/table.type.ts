export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  active: string;
  direction: SortDirection;
}
