import { Injectable, signal } from '@angular/core';

export interface DocsTocItem {
  id: string;
  label: string;
  level?: 2 | 3 | 4;
}

@Injectable({ providedIn: 'root' })
export class DocsTocService {
  private readonly itemsState = signal<DocsTocItem[]>([]);

  readonly items = this.itemsState.asReadonly();

  setItems(items: readonly DocsTocItem[]) {
    this.itemsState.set([...items]);
  }

  clearItems() {
    this.itemsState.set([]);
  }
}
