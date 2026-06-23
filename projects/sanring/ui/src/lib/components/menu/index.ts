export * from './menu-content.component';
export * from './menu-trigger.directive';

export interface SanringMenuContext<T = unknown> {
  $implicit: T;
  isOpen: boolean;
  close: () => void;
}
