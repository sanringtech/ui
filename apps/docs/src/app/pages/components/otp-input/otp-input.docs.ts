import {
  ComponentPageApiRow,
  ComponentPageKeyboardRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const otpInputPage = {
  componentId: 'otp-input',
  titleKey: 'component.otpInput',
  descriptionKey: 'otpInput.description',
  registryDeps: ['component-styles', 'cva-base', 'utils'],
  ssrSafe: true,
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'otpInput.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'otpInput.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'otpInput.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-pattern', titleKey: 'otpInput.demo.pattern', level: 3 },
        { id: 'example-separator', titleKey: 'otpInput.demo.separator', level: 3 },
        { id: 'example-disabled', titleKey: 'otpInput.demo.disabled', level: 3 },
        { id: 'example-controlled', titleKey: 'otpInput.demo.controlled', level: 3 },
        {
          id: 'example-invalid',
          titleKey: 'otpInput.demo.invalid',
          descriptionKey: 'otpInput.examples.invalid.description',
          level: 3,
        },
        { id: 'example-four-digits', titleKey: 'otpInput.demo.fourDigits', level: 3 },
        { id: 'example-alphanumeric', titleKey: 'otpInput.demo.alphanumeric', level: 3 },
        {
          id: 'example-form',
          titleKey: 'otpInput.demo.form',
          descriptionKey: 'otpInput.examples.form.description',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'otpInput.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'otpInput.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'otpInput.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'otpInput.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'otpInput.api.class.description',
    },
    {
      property: 'id',
      type: 'string',
      defaultValue: 'generated',
      descriptionKey: 'otpInput.api.id.description',
    },
    {
      property: 'name',
      type: 'string | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'otpInput.api.name.description',
    },
    {
      property: 'length',
      type: 'number',
      defaultValue: '6',
      descriptionKey: 'otpInput.api.length.description',
    },
    {
      property: 'value',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'otpInput.api.value.description',
    },
    {
      property: 'type',
      type: "'numeric' | 'alphanumeric' | 'text'",
      defaultValue: "'numeric'",
      descriptionKey: 'otpInput.api.type.description',
    },
    {
      property: 'pattern',
      type: 'RegExp | string | null',
      defaultValue: 'null',
      descriptionKey: 'otpInput.api.pattern.description',
    },
    {
      property: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      descriptionKey: 'otpInput.api.size.description',
    },
    {
      property: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      descriptionKey: 'otpInput.api.orientation.description',
    },
    {
      property: 'textAlign',
      type: "'left' | 'center' | 'right'",
      defaultValue: "'center'",
      descriptionKey: 'otpInput.api.textAlign.description',
    },
    {
      property: 'separatorAt',
      type: 'number | readonly number[] | null',
      defaultValue: 'null',
      descriptionKey: 'otpInput.api.separatorAt.description',
    },
    {
      property: 'autocomplete',
      type: 'OtpInputAutocomplete',
      defaultValue: "'one-time-code'",
      descriptionKey: 'otpInput.api.autocomplete.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'otpInput.api.disabled.description',
    },
    {
      property: 'readOnly',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'otpInput.api.readOnly.description',
    },
    {
      property: 'required',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'otpInput.api.required.description',
    },
    {
      property: 'ariaLabel',
      type: 'string | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'otpInput.api.ariaLabel.description',
    },
    {
      property: 'ariaLabelledBy',
      type: 'string | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'otpInput.api.ariaLabelledBy.description',
    },
    {
      property: 'ariaDescribedBy',
      type: 'string | undefined',
      defaultValue: 'undefined',
      descriptionKey: 'otpInput.api.ariaDescribedBy.description',
    },
    {
      property: 'valueChange',
      type: 'EventEmitter<string>',
      defaultValue: '—',
      descriptionKey: 'otpInput.api.valueChange.description',
    },
    {
      property: 'stateChange',
      type: 'EventEmitter<OtpInputValueChangeEvent>',
      defaultValue: '—',
      descriptionKey: 'otpInput.api.stateChange.description',
    },
    {
      property: 'complete',
      type: 'EventEmitter<OtpInputCompleteEvent>',
      defaultValue: '—',
      descriptionKey: 'otpInput.api.complete.description',
    },
    {
      property: 'pasted',
      type: 'EventEmitter<OtpInputPasteEvent>',
      defaultValue: '—',
      descriptionKey: 'otpInput.api.pasted.description',
    },
    {
      property: 'slotKeydown',
      type: 'EventEmitter<OtpInputKeydownEvent>',
      defaultValue: '—',
      descriptionKey: 'otpInput.api.slotKeydown.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: 'Type', descriptionKey: 'otpInput.keyboard.type' },
    { keys: '← / →', descriptionKey: 'otpInput.keyboard.arrowLeftRight' },
    { keys: 'Backspace', descriptionKey: 'otpInput.keyboard.backspace' },
    { keys: 'Delete', descriptionKey: 'otpInput.keyboard.delete' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const otpInputPageExamples = {
  basic: `<sanring-otp-input
  [length]="6"
  size="lg"
  autocomplete="one-time-code"
  ariaLabel="Verification code"
/>`,
  usageImport: `import {
  OtpInputComponent,
  OtpInputSeparatorComponent,
  OtpInputSlotComponent,
} from './components/ui/otp-input';`,
  usageMain: `<sanring-otp-input
  [length]="6"
  [value]="code"
  ariaLabel="Verification code"
  (valueChange)="code = $event"
  (complete)="verify($event.value)"
/>`,
  pattern: `<sanring-otp-input
  [length]="6"
  [pattern]="digitsOnlyPattern"
  size="lg"
  autocomplete="one-time-code"
  ariaLabel="Digits only"
/>`,
  separator: `<sanring-otp-input
  [length]="6"
  [value]="'123456'"
  size="lg"
  autocomplete="one-time-code"
  ariaLabel="Verification code"
>
  <sanring-otp-input-slot [index]="0" />
  <sanring-otp-input-slot [index]="1" />
  <sanring-otp-input-slot [index]="2" />
  <sanring-otp-input-separator />
  <sanring-otp-input-slot [index]="3" />
  <sanring-otp-input-slot [index]="4" />
  <sanring-otp-input-slot [index]="5" />
</sanring-otp-input>`,
  disabled: `<sanring-otp-input
  [value]="'123456'"
  size="lg"
  autocomplete="one-time-code"
  disabled
  ariaLabel="Verification code"
/>`,
  controlled: `<sanring-otp-input
  [value]="controlledCode"
  size="lg"
  autocomplete="one-time-code"
  ariaLabel="Verification code"
  (valueChange)="controlledCode = $event"
/>`,
  invalid: `<sanring-field>
  <label sanringLabel for="invalid-otp-code">Verification code</label>
  <sanring-otp-input
    id="invalid-otp-code"
    [formControl]="invalidCodeControl"
    size="lg"
    autocomplete="one-time-code"
    ariaLabel="Verification code"
  />
  <sanring-error-message>Invalid verification code.</sanring-error-message>
</sanring-field>`,
  fourDigits: `<sanring-otp-input
  [length]="4"
  [pattern]="digitsOnlyPattern"
  size="lg"
  autocomplete="one-time-code"
  ariaLabel="PIN code"
/>`,
  alphanumeric: `<sanring-otp-input
  type="alphanumeric"
  [length]="5"
  [value]="'A1B2C'"
  size="lg"
  autocomplete="one-time-code"
  ariaLabel="Recovery code"
/>`,
  form: `<form class="grid gap-4" (ngSubmit)="verify()">
  <sanring-field>
    <label sanringLabel for="otp-code-field">Verification code</label>
    <sanring-otp-input
      id="otp-code-field"
      [formControl]="codeControl"
      size="lg"
      autocomplete="one-time-code"
      ariaLabel="Verification code"
    />
    <sanring-error-message>Enter the 6-digit code.</sanring-error-message>
  </sanring-field>

  <button sanringBtn type="submit">Verify</button>
</form>`,
  field: `<sanring-field>
  <label sanringLabel for="otp-code-field">Verification code</label>
  <sanring-otp-input id="otp-code-field" [formControl]="codeControl" ariaLabel="Verification code" />
  <sanring-error-message>Enter the 6-digit code.</sanring-error-message>
</sanring-field>`,
} as const;
