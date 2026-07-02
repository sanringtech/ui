export interface DropdownMenuContext<T = unknown> {
  $implicit: T;
  isOpen: boolean;
  close: () => void;
}

export type DropdownMenuItemVariant = 'default' | 'destructive';
