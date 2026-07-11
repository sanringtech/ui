import { Directive, TemplateRef, inject } from '@angular/core';
import { StepIconContext } from './stepper.type';

@Directive({
  selector: 'ng-template[sanringStepIcon]',
  standalone: true,
})
export class StepIconDirective {
  readonly templateRef = inject<TemplateRef<StepIconContext>>(TemplateRef);
}
