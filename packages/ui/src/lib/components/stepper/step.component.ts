import { CdkStep } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, contentChild, forwardRef, input } from '@angular/core';
import { StepIconDirective } from './step-icon.directive';
import { StepState } from './stepper.type';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sanring-step',
  standalone: true,
  providers: [{ provide: CdkStep, useExisting: forwardRef(() => StepComponent) }],
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class StepComponent extends CdkStep {
  readonly icon = contentChild(StepIconDirective);
  readonly customState = input<StepState | undefined>();
}
