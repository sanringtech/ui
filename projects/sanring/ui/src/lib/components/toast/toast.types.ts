export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface ToastAction {
  label: string;
  class?: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  duration: number;   // ms; 0 = persistent
  closable: boolean;
  action?: ToastAction;
  class?: string;
}

/** 呼叫端可傳入的欄位。不暴露 id（由 service 自動產生）。 */
export interface ToastOptions {
  type?: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  closable?: boolean;
  action?: ToastAction;
  class?: string;
}
