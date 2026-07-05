import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const stepperPage = {
  componentId: 'stepper',
  titleKey: 'component.stepper',
  descriptionKey: 'stepper.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'stepper.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'stepper.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'stepper.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-dashed', titleKey: 'stepper.demo.dashed', level: 3 },
        { id: 'example-custom-label', titleKey: 'stepper.demo.customLabel', level: 3 },
        { id: 'example-vertical', titleKey: 'stepper.demo.vertical', level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'stepper.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'stepper.api.class.description',
    },
    {
      property: 'lineStyle',
      type: "'solid' | 'dashed'",
      defaultValue: "'solid'",
      descriptionKey: 'stepper.api.lineStyle.description',
    },
    {
      property: 'optionalLabel',
      type: 'string',
      defaultValue: "'Optional'",
      descriptionKey: 'stepper.api.optionalLabel.description',
    },
    {
      property: 'linear',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'stepper.api.linear.description',
    },
    {
      property: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      descriptionKey: 'stepper.api.orientation.description',
    },
    {
      property: 'selectedIndex',
      type: 'number',
      defaultValue: '0',
      descriptionKey: 'stepper.api.selectedIndex.description',
    },
    {
      property: 'sanring-step[label]',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'stepper.api.stepLabel.description',
    },
    {
      property: 'sanring-step[optional]',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'stepper.api.stepOptional.description',
    },
    {
      property: 'sanring-step[completed]',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'stepper.api.stepCompleted.description',
    },
    {
      property: 'sanring-step[customState]',
      type: "'default' | 'selected' | 'completed' | 'error'",
      defaultValue: '—',
      descriptionKey: 'stepper.api.stepCustomState.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const stepperPageExamples = {
  basic: `<sanring-stepper>
  <sanring-step label="Account">
    Account details
    <button sanringStepperNext>Next</button>
  </sanring-step>

  <sanring-step label="Profile" optional>
    Profile details
    <button sanringStepperPrevious>Back</button>
  </sanring-step>
</sanring-stepper>`,
  usageImport: `import {
  StepComponent,
  StepLabelDirective,
  StepIconDirective,
  StepperComponent,
  StepperNextDirective,
  StepperPreviousDirective,
} from '@sanring/ui';`,
  usageMain: `<sanring-stepper lineStyle="dashed" optionalLabel="Optional">
  <sanring-step label="Account">...</sanring-step>
  <sanring-step label="Profile" optional>...</sanring-step>
</sanring-stepper>`,
  dashed: `<sanring-stepper lineStyle="dashed">
  <sanring-step label="Cart" completed>Cart content</sanring-step>
  <sanring-step label="Shipping">Shipping content</sanring-step>
  <sanring-step label="Payment">Payment content</sanring-step>
</sanring-stepper>`,
  customLabel: `<sanring-step label="Deploy" customState="error">
  <ng-template sanringStepLabel>
    Deploy app
  </ng-template>

  <ng-template sanringStepIcon let-state="state">
    {{ state === 'error' ? '!' : '3' }}
  </ng-template>

  Deployment failed.
</sanring-step>`,
  vertical: `<sanring-stepper orientation="vertical">
  <sanring-step label="Plan">Plan content</sanring-step>
  <sanring-step label="Build">Build content</sanring-step>
  <sanring-step label="Ship">Ship content</sanring-step>
</sanring-stepper>`,
} as const;
