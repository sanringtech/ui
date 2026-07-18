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
        {
          id: 'example-sizes',
          titleKey: 'carousel.demo.sizes',
          descriptionKey: 'carousel.examples.sizes.description',
          level: 3,
        },
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
  <div class="flex items-center gap-3">
    <button sanringBtn sanringCarouselPrevious size="icon" variant="outline" class="shrink-0">
      Previous
    </button>

    <sanring-carousel-content class="min-w-0 flex-1">
      <sanring-carousel-item>Slide 1</sanring-carousel-item>
      <sanring-carousel-item>Slide 2</sanring-carousel-item>
      <sanring-carousel-item>Slide 3</sanring-carousel-item>
    </sanring-carousel-content>

    <button sanringBtn sanringCarouselNext size="icon" variant="outline" class="shrink-0">
      Next
    </button>
  </div>
</sanring-carousel>`,

  usageImport: `import { SANRING_CAROUSEL_IMPORTS } from './components/ui/carousel';

@Component({
  imports: [SANRING_CAROUSEL_IMPORTS],
})
export class ExampleComponent {}`,

  usageIndividualImports: `import { CarouselComponent, CarouselContentComponent, CarouselItemComponent, CarouselNextDirective, CarouselPreviousDirective } from './components/ui/carousel';

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
  <div class="flex items-center gap-3">
    <button sanringBtn sanringCarouselPrevious size="icon" variant="outline" class="shrink-0">
      Previous
    </button>

    <sanring-carousel-content class="min-w-0 flex-1">
      @for (project of projects; track project.title) {
        <sanring-carousel-item>
          {{ project.title }}
        </sanring-carousel-item>
      }
    </sanring-carousel-content>

    <button sanringBtn sanringCarouselNext size="icon" variant="outline" class="shrink-0">
      Next
    </button>
  </div>
</sanring-carousel>`,

  composition: `sanring-carousel
├── sanring-carousel-content
│   └── sanring-carousel-item
├── button[sanringCarouselPrevious]
└── button[sanringCarouselNext]`,

  sizes: `<sanring-carousel ariaLabel="Sized slides">
  <div class="flex items-center gap-3">
    <button sanringBtn sanringCarouselPrevious size="icon" variant="outline" class="shrink-0">
      Previous
    </button>

    <sanring-carousel-content class="min-w-0 flex-1">
      <sanring-carousel-item class="basis-1/3">Slide 1</sanring-carousel-item>
      <sanring-carousel-item class="basis-1/3">Slide 2</sanring-carousel-item>
      <sanring-carousel-item class="basis-1/3">Slide 3</sanring-carousel-item>
    </sanring-carousel-content>

    <button sanringBtn sanringCarouselNext size="icon" variant="outline" class="shrink-0">
      Next
    </button>
  </div>
</sanring-carousel>`,

  multiple: `<sanring-carousel ariaLabel="Team highlights" [opts]="{ align: 'start' }">
  <div class="flex items-center gap-3">
    <button sanringBtn sanringCarouselPrevious size="icon" variant="outline" class="shrink-0">
      Previous
    </button>

    <sanring-carousel-content class="min-w-0 flex-1">
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

    <button sanringBtn sanringCarouselNext size="icon" variant="outline" class="shrink-0">
      Next
    </button>
  </div>
</sanring-carousel>`,

  vertical: `<sanring-carousel
  orientation="vertical"
  ariaLabel="Release notes"
  class="mx-auto max-w-sm"
>
  <div class="flex flex-col items-center gap-3">
    <button sanringBtn sanringCarouselPrevious size="icon" variant="outline" class="shrink-0">
      Previous
    </button>

    <sanring-carousel-content class="h-64 w-full">
      <sanring-carousel-item>Release 1</sanring-carousel-item>
      <sanring-carousel-item>Release 2</sanring-carousel-item>
      <sanring-carousel-item>Release 3</sanring-carousel-item>
    </sanring-carousel-content>

    <button sanringBtn sanringCarouselNext size="icon" variant="outline" class="shrink-0">
      Next
    </button>
  </div>
</sanring-carousel>`,
} as const;
