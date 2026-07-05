import { CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

@Directive({
  selector: 'button[sanringStepperPrevious]',
  standalone: true,
})
export class StepperPreviousDirective extends CdkStepperPrevious {}
