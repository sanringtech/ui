import { CdkStepperNext } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

@Directive({
  selector: 'button[sanringStepperNext]',
  standalone: true,
})
export class StepperNextDirective extends CdkStepperNext {}
