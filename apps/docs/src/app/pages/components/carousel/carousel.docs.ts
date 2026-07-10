import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const carouselPage = {
  componentId: 'carousel',
  titleKey: 'component.carousel',
  descriptionKey: 'carousel.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'carousel.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'carousel.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'carousel.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'carousel.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        { id: 'example-multiple', titleKey: 'carousel.demo.multiple', level: 3 },
        { id: 'example-vertical', titleKey: 'carousel.demo.vertical', level: 3 },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'carousel.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      descriptionKey: 'carousel.api.orientation.description',
    },
    {
      property: 'opts',
      type: 'EmblaOptionsType',
      defaultValue: '{}',
      descriptionKey: 'carousel.api.opts.description',
    },
    {
      property: 'ariaLabel',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'carousel.api.ariaLabel.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'carousel.api.class.description',
    },
    {
      property: 'sanringCarouselPrevious',
      type: 'Directive',
      defaultValue: '-',
      descriptionKey: 'carousel.api.previous.description',
    },
    {
      property: 'sanringCarouselNext',
      type: 'Directive',
      defaultValue: '-',
      descriptionKey: 'carousel.api.next.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const carouselPageExamples = {
  basic: `<sanring-carousel ariaLabel="Featured projects">
  <sanring-carousel-content>
    <sanring-carousel-item>Slide 1</sanring-carousel-item>
    <sanring-carousel-item>Slide 2</sanring-carousel-item>
    <sanring-carousel-item>Slide 3</sanring-carousel-item>
  </sanring-carousel-content>

  <button sanringBtn sanringCarouselPrevious size="icon" variant="outline">
    Previous
  </button>
  <button sanringBtn sanringCarouselNext size="icon" variant="outline">
    Next
  </button>
</sanring-carousel>`,

  usageImport: `import { SANRING_CAROUSEL_IMPORTS } from '@sanring/ui';

@Component({
  imports: [SANRING_CAROUSEL_IMPORTS],
})
export class ExampleComponent {}`,

  usageIndividualImports: `import {
  CarouselComponent,
  CarouselContentComponent,
  CarouselItemComponent,
  CarouselNextDirective,
  CarouselPreviousDirective,
} from '@sanring/ui';

@Component({
  imports: [
    CarouselComponent,
    CarouselContentComponent,
    CarouselItemComponent,
    CarouselNextDirective,
    CarouselPreviousDirective,
  ],
})
export class ExampleComponent {}`,

  usageMain: `<sanring-carousel ariaLabel="Featured projects" [opts]="{ loop: true }">
  <sanring-carousel-content>
    @for (project of projects; track project.title) {
      <sanring-carousel-item>
        {{ project.title }}
      </sanring-carousel-item>
    }
  </sanring-carousel-content>

  <button sanringBtn sanringCarouselPrevious size="icon" variant="outline">
    Previous
  </button>
  <button sanringBtn sanringCarouselNext size="icon" variant="outline">
    Next
  </button>
</sanring-carousel>`,

  composition: `sanring-carousel
├── sanring-carousel-content
│   └── sanring-carousel-item
├── button[sanringCarouselPrevious]
└── button[sanringCarouselNext]`,

  multiple: `<sanring-carousel ariaLabel="Team highlights" [opts]="{ align: 'start' }">
  <sanring-carousel-content>
    <sanring-carousel-item class="basis-full sm:basis-1/2 lg:basis-1/3">
      Slide 1
    </sanring-carousel-item>
    <sanring-carousel-item class="basis-full sm:basis-1/2 lg:basis-1/3">
      Slide 2
    </sanring-carousel-item>
    <sanring-carousel-item class="basis-full sm:basis-1/2 lg:basis-1/3">
      Slide 3
    </sanring-carousel-item>
  </sanring-carousel-content>
</sanring-carousel>`,

  vertical: `<sanring-carousel
  orientation="vertical"
  ariaLabel="Release notes"
  class="mx-auto max-w-sm"
>
  <sanring-carousel-content class="h-64">
    <sanring-carousel-item>Release 1</sanring-carousel-item>
    <sanring-carousel-item>Release 2</sanring-carousel-item>
    <sanring-carousel-item>Release 3</sanring-carousel-item>
  </sanring-carousel-content>
</sanring-carousel>`,
} as const;
