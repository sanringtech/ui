import { CdkStepLabel } from '@angular/cdk/stepper';
import { Directive, forwardRef } from '@angular/core';

@Directive({
  selector: 'ng-template[sanringStepLabel]',
  standalone: true,
  providers: [{ provide: CdkStepLabel, useExisting: forwardRef(() => StepLabelDirective) }],
})
export class StepLabelDirective extends CdkStepLabel {}
