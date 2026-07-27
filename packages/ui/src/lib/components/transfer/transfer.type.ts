export type TransferDirection = 'source' | 'target';

// 'one-way' 只允許 source -> target：target 面板變成唯讀展示，不能勾選、也不能搬回 source。
export type TransferMode = 'two-way' | 'one-way';

export interface TransferItem {
  key: string;
  label: string;
  disabled?: boolean;
}
