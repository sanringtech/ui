import { ComponentPageApiRow, ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const switchPage = {
  componentId: 'switch',
  titleKey: 'component.switch',
  descriptionKey: 'switch.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'switch.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'switch.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'switch.examples.description',
      level: 2,
      children: [
        {
          id: 'example-description',
          titleKey: 'switch.demo.description',
          level: 3,
        },
        {
          id: 'example-choice-card',
          titleKey: 'switch.demo.choiceCard',
          level: 3,
        },
        {
          id: 'example-disabled',
          titleKey: 'switch.demo.disabled',
          level: 3,
        },
        {
          id: 'example-invalid',
          titleKey: 'switch.demo.invalid',
          level: 3,
        },
        {
          id: 'example-size',
          titleKey: 'switch.demo.size',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'switch.api.description',
      level: 2,
    },
  ],
  apiRows: [
    { property: 'class', type: 'string', defaultValue: "''", descriptionKey: 'switch.api.class.description' },
    { property: 'id', type: 'string', defaultValue: 'generated', descriptionKey: 'switch.api.id.description' },
    { property: 'checked', type: 'boolean', defaultValue: 'false', descriptionKey: 'switch.api.checked.description' },
    { property: 'disabled', type: 'boolean', defaultValue: 'false', descriptionKey: 'switch.api.disabled.description' },
    { property: 'invalid', type: 'boolean', defaultValue: 'false', descriptionKey: 'switch.api.invalid.description' },
    { property: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", descriptionKey: 'switch.api.size.description' },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const switchPageExamples = {
  basic: `<sanring-switch />`,
  usageImport: `import { SwitchComponent } from '@sanring/ui';`,
  usageMain: `<sanring-switch id="airplane-mode" />`,
  description: `<div class="flex items-center justify-between gap-6">
  <div class="grid gap-1">
    <label for="marketing-emails">Marketing emails</label>
    <p>Receive product news and launch updates.</p>
  </div>
  <sanring-switch id="marketing-emails" checked />
</div>`,
  choiceCard: `<div class="flex items-center justify-between gap-4 rounded-[var(--sanring-radius)] border p-4">
  <span>
    <span class="block font-medium">Enable notifications</span>
    <span class="block text-sm opacity-70">Get alerts for account activity.</span>
  </span>
  <sanring-switch checked />
</div>`,
  disabled: `<div class="flex items-center gap-3">
  <sanring-switch disabled />
  <sanring-switch checked disabled />
</div>`,
  invalid: `<div class="grid gap-2">
  <div class="flex items-center justify-between gap-4">
    <label for="required-consent">Required consent</label>
    <sanring-switch id="required-consent" invalid />
  </div>
  <p class="text-sm text-red-500">You must enable this setting to continue.</p>
</div>`,
  size: `<div class="flex items-center gap-4">
  <sanring-switch size="sm" checked />
  <sanring-switch checked />
  <sanring-switch size="lg" checked />
</div>`,
} as const;
