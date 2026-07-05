import { NgTemplateOutlet } from '@angular/common';
import { CdkStepHeader, CdkStepper } from '@angular/cdk/stepper';
import { Component, QueryList, ViewChildren, computed, forwardRef, input } from '@angular/core';
import { cn } from '../../utils';
import { StepComponent } from './step.component';
import { StepHeaderComponent } from './step-header.component';
import { StepState, StepperLineStyle } from './stepper.type';

@Component({
  selector: 'sanring-stepper',
  standalone: true,
  imports: [NgTemplateOutlet, StepHeaderComponent],
  providers: [{ provide: CdkStepper, useExisting: forwardRef(() => StepperComponent) }],
  host: {
    '[class]': 'hostClass()',
    '(keydown)': '_onKeydown($event)',
  },
  template: `
    <div
      class="flex gap-3"
      [class.flex-col]="orientation === 'vertical'"
      [class.items-start]="orientation === 'vertical'"
      [class.items-center]="orientation !== 'vertical'"
      role="tablist"
      [attr.aria-orientation]="orientation"
    >
      @for (
        step of stepsArray();
        track step;
        let i = $index;
        let last = $last;
        let count = $count
      ) {
        <sanring-step-header
          [attr.id]="_getStepLabelId(i)"
          [label]="step.label || defaultLabel(i)"
          [labelTemplate]="step.stepLabel?.template"
          [index]="i + 1"
          [state]="stepState(step, i)"
          [selected]="i === selectedIndex"
          [optional]="step.optional"
          [optionalLabel]="optionalLabel()"
          [disabled]="!canNavigateTo(step, i)"
          [iconTemplate]="stepIcon(step)"
          [attr.aria-controls]="_getStepContentId(i)"
          [attr.aria-posinset]="i + 1"
          [attr.aria-setsize]="count"
          (click)="selectStep(step, i)"
        />

        @if (!last) {
          <div aria-hidden="true" [class]="connectorClass(i)"></div>
        }
      }
    </div>

    <div
      class="mt-8"
      role="tabpanel"
      [id]="_getStepContentId(selectedIndex)"
      [attr.aria-labelledby]="_getStepLabelId(selectedIndex)"
    >
      <ng-container [ngTemplateOutlet]="selected?.content || null"></ng-container>
    </div>
  `,
})
export class StepperComponent extends CdkStepper {
  @ViewChildren(CdkStepHeader)
  override _stepHeader: QueryList<CdkStepHeader> = new QueryList<CdkStepHeader>();

  readonly class = input<string | undefined>();
  readonly lineStyle = input<StepperLineStyle>('solid');
  readonly optionalLabel = input('Optional');

  protected readonly hostClass = computed(() => cn('block w-full', this.class()));

  protected stepsArray(): StepComponent[] {
    return (this.steps?.toArray() ?? []) as StepComponent[];
  }

  protected defaultLabel(index: number): string {
    return `Step ${index + 1}`;
  }

  protected stepIcon(step: StepComponent) {
    return step.icon()?.templateRef ?? null;
  }

  protected stepState(step: StepComponent, index: number): StepState {
    if (step.hasError) return 'error';
    const customState = step.customState();
    if (customState) return customState;
    if (this.selectedIndex === index) return 'selected';
    if (step.completed) return 'completed';
    return 'default';
  }

  protected canNavigateTo(step: StepComponent, index: number): boolean {
    if (index === this.selectedIndex) return true;
    if (index > this.selectedIndex) return step.isNavigable();
    return !step.completed || step.editable;
  }

  protected selectStep(step: StepComponent, index: number): void {
    if (!this.canNavigateTo(step, index)) return;
    this.selectedIndex = index;
  }

  protected connectorClass(index: number): string {
    const completed = index < this.selectedIndex;

    return cn(
      this.orientation === 'vertical'
        ? 'ml-4 h-8 w-px border-l-2'
        : 'h-px min-w-8 flex-1 border-t-2',
      this.lineStyle() === 'dashed' && 'border-dashed',
      this.lineStyle() === 'solid' && 'border-solid',
      completed ? 'border-[var(--sanring-foreground)]' : 'border-[var(--sanring-border-strong)]',
    );
  }
}
