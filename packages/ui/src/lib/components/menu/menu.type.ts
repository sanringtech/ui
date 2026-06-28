export interface SanringMenuContext<T = unknown> {
  $implicit: T;
  isOpen: boolean;
  close: () => void;
}
