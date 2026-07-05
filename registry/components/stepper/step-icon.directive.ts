import { Directive, TemplateRef, inject } from '@angular/core';

export interface StepIconContext {
  $implicit: number;
  index: number;
  state: string;
}

@Directive({
  selector: 'ng-template[sanringStepIcon]',
  standalone: true,
})
export class StepIconDirective {
  readonly templateRef = inject<TemplateRef<StepIconContext>>(TemplateRef);
}
