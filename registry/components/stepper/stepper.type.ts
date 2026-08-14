export type StepState = 'default' | 'selected' | 'completed' | 'error' | (string & {});
export type StepperLineStyle = 'solid' | 'dashed';

export interface StepIconContext {
  $implicit: number;
  index: number;
  state: string;
}
