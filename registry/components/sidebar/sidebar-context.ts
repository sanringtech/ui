import { InjectionToken, Signal } from '@angular/core';
import type { SidebarCollapsible, SidebarState } from './sidebar.type';

export interface SidebarContext {
  readonly sidebarId: Signal<string>;
  readonly collapsible: Signal<SidebarCollapsible>;
  readonly isOpen: Signal<boolean>;
  readonly state: Signal<SidebarState>;
  readonly sidebarElement: Signal<HTMLElement | null>;
  toggle(): void;
  setOpen(open: boolean): void;
}

export const SIDEBAR_CONTEXT = new InjectionToken<SidebarContext>('SidebarContext');

let _nextId = 0;
export function generateSidebarId(): string {
  return `sanring-sidebar-${_nextId++}`;
}
