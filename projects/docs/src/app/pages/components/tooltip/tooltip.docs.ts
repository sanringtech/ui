import { ComponentPageApiRow, ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const tooltipPage = {
  componentId: 'tooltip',
  titleKey: 'component.tooltip',
  descriptionKey: 'tooltip.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'tooltip.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'tooltip.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'tooltip.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'tooltip.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'tooltip.examples.description',
      level: 2,
      children: [
        {
          id: 'example-side',
          titleKey: 'tooltip.demo.side',
          level: 3,
        },
        {
          id: 'example-delay',
          titleKey: 'tooltip.demo.delay',
          level: 3,
        },
        {
          id: 'example-custom-content',
          titleKey: 'tooltip.demo.customContent',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'tooltip.api.description',
      level: 2,
    },
  ],
  apiRows: [
    { property: 'delayDuration', type: 'number', defaultValue: '200', descriptionKey: 'tooltip.api.delayDuration.description' },
    { property: 'side', type: "'top' | 'right' | 'bottom' | 'left'", defaultValue: "'top'", descriptionKey: 'tooltip.api.side.description' },
    { property: 'sideOffset', type: 'number', defaultValue: '6', descriptionKey: 'tooltip.api.sideOffset.description' },
    { property: 'class', type: 'string', defaultValue: "''", descriptionKey: 'tooltip.api.class.description' },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const tooltipPageExamples = {
  basic: `<sanring-tooltip>
  <button sanringTooltipTrigger type="button">
    Hover me
  </button>
  <sanring-tooltip-content>
    Tooltip content
  </sanring-tooltip-content>
</sanring-tooltip>`,
  usageImport: `import {
  TooltipComponent,
  TooltipContentComponent,
  TooltipTriggerDirective,
} from '@sanring/ui';`,
  usageMain: `<sanring-tooltip>
  <button sanringTooltipTrigger type="button">
    Hover me
  </button>
  <sanring-tooltip-content>
    Tooltip content
  </sanring-tooltip-content>
</sanring-tooltip>`,
  composition: `<sanring-tooltip>
  <button sanringTooltipTrigger type="button">Hover me</button>
  <sanring-tooltip-content>Tooltip text</sanring-tooltip-content>
</sanring-tooltip>`,
  side: `<div class="grid grid-cols-2 gap-4">
  <sanring-tooltip>
    <button sanringTooltipTrigger type="button">Top</button>
    <sanring-tooltip-content side="top">Top tooltip</sanring-tooltip-content>
  </sanring-tooltip>

  <sanring-tooltip>
    <button sanringTooltipTrigger type="button">Right</button>
    <sanring-tooltip-content side="right">Right tooltip</sanring-tooltip-content>
  </sanring-tooltip>

  <sanring-tooltip>
    <button sanringTooltipTrigger type="button">Left</button>
    <sanring-tooltip-content side="left">Left tooltip</sanring-tooltip-content>
  </sanring-tooltip>

  <sanring-tooltip>
    <button sanringTooltipTrigger type="button">Bottom</button>
    <sanring-tooltip-content side="bottom">Bottom tooltip</sanring-tooltip-content>
  </sanring-tooltip>
</div>`,
  delay: `<sanring-tooltip [delayDuration]="600">
  <button sanringTooltipTrigger type="button">
    Delayed tooltip
  </button>
  <sanring-tooltip-content>
    Opens after 600ms
  </sanring-tooltip-content>
</sanring-tooltip>`,
  customContent: `<sanring-tooltip>
  <button sanringTooltipTrigger type="button">
    Status
  </button>
  <sanring-tooltip-content class="max-w-56 text-left">
    <span class="block font-semibold">Workspace is synced</span>
    <span class="block opacity-80">Last updated just now.</span>
  </sanring-tooltip-content>
</sanring-tooltip>`,
} as const;
