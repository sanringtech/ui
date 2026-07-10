import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const hoverCardPage = {
  componentId: 'hover-card',
  titleKey: 'component.hoverCard',
  descriptionKey: 'hoverCard.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'hoverCard.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'hoverCard.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'hoverCard.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'hoverCard.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-side', titleKey: 'hoverCard.demo.side', level: 3 },
        { id: 'example-delay', titleKey: 'hoverCard.demo.delay', level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'hoverCard.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'openDelay',
      type: 'number',
      defaultValue: '700',
      descriptionKey: 'hoverCard.api.openDelay.description',
    },
    {
      property: 'closeDelay',
      type: 'number',
      defaultValue: '300',
      descriptionKey: 'hoverCard.api.closeDelay.description',
    },
    {
      property: 'side',
      type: "'top' | 'right' | 'bottom' | 'left'",
      defaultValue: "'bottom'",
      descriptionKey: 'hoverCard.api.side.description',
    },
    {
      property: 'sideOffset',
      type: 'number',
      defaultValue: '8',
      descriptionKey: 'hoverCard.api.sideOffset.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'hoverCard.api.class.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const hoverCardPageExamples = {
  basic: `<sanring-hover-card>
  <button sanringBtn variant="link" sanringHoverCardTrigger>
    @sanring/ui
  </button>

  <sanring-hover-card-content>
    <div class="space-y-2">
      <h3 class="m-0 text-sm font-semibold">Sanring UI</h3>
      <p class="m-0 text-sm text-[var(--docs-muted)]">
        Angular primitives for product interfaces.
      </p>
    </div>
  </sanring-hover-card-content>
</sanring-hover-card>`,

  usageImport: `import { Component } from '@angular/core';
import { ButtonDirective, SANRING_HOVER_CARD_IMPORTS } from '@sanring/ui';

@Component({
  imports: [ButtonDirective, SANRING_HOVER_CARD_IMPORTS],
})
export class ExampleComponent {}`,

  usageIndividualImports: `import { Component } from '@angular/core';
import {
  ButtonDirective,
  HoverCardComponent,
  HoverCardContentComponent,
  HoverCardTriggerDirective,
} from '@sanring/ui';

@Component({
  imports: [
    ButtonDirective,
    HoverCardComponent,
    HoverCardTriggerDirective,
    HoverCardContentComponent,
  ],
})
export class ExampleComponent {}`,

  usageMain: `<sanring-hover-card [openDelay]="500" [closeDelay]="200">
  <button sanringBtn variant="link" sanringHoverCardTrigger>
    Product team
  </button>

  <sanring-hover-card-content side="right">
    <p class="m-0 text-sm">Context shown on hover or focus.</p>
  </sanring-hover-card-content>
</sanring-hover-card>`,

  composition: `sanring-hover-card
├── [sanringHoverCardTrigger]
└── sanring-hover-card-content`,

  side: `<sanring-hover-card>
  <button sanringBtn sanringHoverCardTrigger>Top</button>
  <sanring-hover-card-content side="top">
    Content
  </sanring-hover-card-content>
</sanring-hover-card>`,

  delay: `<sanring-hover-card [openDelay]="150" [closeDelay]="500">
  <button sanringBtn sanringHoverCardTrigger>
    Faster open, slower close
  </button>
  <sanring-hover-card-content>
    Content remains forgiving while the pointer moves.
  </sanring-hover-card-content>
</sanring-hover-card>`,
} as const;
