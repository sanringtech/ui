import {
  ComponentPageApiRow,
  ComponentPageKeyboardRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const inputPage = {
  componentId: 'input',
  titleKey: 'component.input',
  descriptionKey: 'input.description',
  registryDeps: ['utils', 'component-styles'],
  ssrSafe: true,
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'input.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'input.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'input.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-floating',
          titleKey: 'input.demo.floating',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'input.demo.disabled',
          level: 3,
        },
        {
          id: 'example-validation',
          titleKey: 'input.demo.validation',
          level: 3,
        },
        {
          id: 'example-file',
          titleKey: 'input.demo.file',
          level: 3,
        },
        {
          id: 'example-character-count',
          titleKey: 'input.demo.characterCount',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'input.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'input.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'input.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'input.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'input.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: 'Tab', descriptionKey: 'input.keyboard.tab' },
    { keys: 'Type', descriptionKey: 'input.keyboard.type' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const inputPageExamples = {
  basic: `<sanring-field>
  <label sanringLabel>Email</label>
  <input sanringInput placeholder="name@sanring.dev" type="email" />
  <p sanringDescription>We'll only use this for account notifications.</p>
</sanring-field>`,
  usageImport: `import { DescriptionDirective, FieldLabelDirective, SanringFieldComponent } from './components/ui/field';
import { InputDirective } from './components/ui/input';`,
  usageMain: `<sanring-field>
  <label sanringLabel>Email</label>
  <input sanringInput placeholder="name@sanring.dev" type="email" />
  <p sanringDescription>We'll only use this for account notifications.</p>
</sanring-field>`,
  floating: `<sanring-field floating>
  <label sanringLabel>Email</label>
  <input sanringInput placeholder="" type="email" />
</sanring-field>`,
  disabled: `<sanring-field>
  <label sanringLabel>Disabled email</label>
  <input sanringInput disabled value="readonly@sanring.dev" />
</sanring-field>`,
  validation: `<sanring-field>
  <label sanringLabel>Email</label>
  <input sanringInput [formControl]="emailControl" placeholder="name@sanring.dev" />
  <sanring-error-message>Email is required.</sanring-error-message>
</sanring-field>`,
  file: `<input sanringInput type="file" />`,
  characterCount: `<sanring-field>
  <label sanringLabel>Title</label>
  <div class="relative min-w-0 w-full" ngProjectAs="[sanringInput]">
    <input sanringInput class="min-w-0 pr-14" maxlength="500" [formControl]="titleControl" />
    <span
      class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs tabular-nums text-[var(--sanring-muted)]"
      aria-live="polite"
    >
      {{ titleControl.value.length }}/500
    </span>
  </div>
  <sanring-error-message>Title must be at least 50 characters.</sanring-error-message>
</sanring-field>`,
} as const;
