import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const scrollAreaPage = {
  componentId: 'scroll-area',
  titleKey: 'component.scrollArea',
  descriptionKey: 'scrollArea.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'scrollArea.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'scrollArea.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'scrollArea.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-basic',
          titleKey: 'scrollArea.demo.basic',
          level: 3,
        },
        {
          id: 'example-direction',
          titleKey: 'scrollArea.demo.direction',
          level: 3,
        },
        {
          id: 'example-infinite',
          titleKey: 'scrollArea.demo.infinite',
          level: 3,
        },
        {
          id: 'example-hide-scrollbar',
          titleKey: 'scrollArea.demo.hideScrollbar',
          level: 3,
        },
        {
          id: 'example-custom-scrollbar',
          titleKey: 'scrollArea.demo.customScrollbar',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'scrollArea.api.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'scrollArea.api.class.description',
    },
    {
      property: 'orientation',
      type: "'vertical' | 'horizontal' | 'both'",
      defaultValue: "'vertical'",
      descriptionKey: 'scrollArea.api.orientation.description',
    },
    {
      property: 'loadMore',
      type: 'EventEmitter<void>',
      defaultValue: '-',
      descriptionKey: 'scrollArea.api.loadMore.description',
    },
    {
      property: 'hideScrollbar',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'scrollArea.api.hideScrollbar.description',
    },
    {
      property: '--scrollbar-thumb',
      type: 'CSS variable',
      defaultValue: '#cbd5e1',
      descriptionKey: 'scrollArea.api.scrollbarThumb.description',
    },
    {
      property: '--scrollbar-track',
      type: 'CSS variable',
      defaultValue: 'transparent',
      descriptionKey: 'scrollArea.api.scrollbarTrack.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const scrollAreaPageExamples = {
  basic: `<sanring-scroll-area class="h-64 rounded-[var(--sanring-radius)] border p-4">
  @for (item of items; track item.id) {
    <div class="border-b py-3">
      {{ item.title }}
    </div>
  }
</sanring-scroll-area>`,
  usageImport: `import { Component } from '@angular/core';
import { SANRING_SCROLL_AREA_IMPORTS } from '@sanring/ui';

@Component({
  imports: [SANRING_SCROLL_AREA_IMPORTS],
})
export class ExampleComponent {}`,
  usageMain: `<div
  sanringScrollArea
  sanringInfiniteScroll
  class="h-72 rounded-[var(--sanring-radius)] border p-4"
  (loadMore)="loadMore()"
>
  @for (item of items; track item.id) {
    <article class="border-b py-3">
      {{ item.title }}
    </article>
  }
</div>`,
  usageIndividualImports: `import { Component } from '@angular/core';
import { InfiniteScrollDirective, ScrollAreaComponent, ScrollAreaDirective } from '@sanring/ui';

@Component({
  imports: [ScrollAreaComponent, ScrollAreaDirective, InfiniteScrollDirective],
})
export class ExampleComponent {}`,
  direction: `<sanring-scroll-area
  class="h-48 w-full rounded-[var(--sanring-radius)] border"
  orientation="horizontal"
>
  <div class="flex w-max gap-3 p-4 pr-6">
    @for (item of items; track item.id) {
      <article class="w-48 rounded-[var(--sanring-radius)] border p-4">
        {{ item.title }}
      </article>
    }
  </div>
</sanring-scroll-area>`,
  hideScrollbar: `<sanring-scroll-area
  class="h-64 rounded-[var(--sanring-radius)] border p-4"
  [hideScrollbar]="true"
>
  @for (item of items; track item.id) {
    <div class="border-b py-3">{{ item.title }}</div>
  }
</sanring-scroll-area>`,
  customScrollbar: `<!-- Custom thumb color -->
<sanring-scroll-area
  class="h-64 rounded-[var(--sanring-radius)] border p-4"
  style="--scrollbar-thumb: #6366f1"
>
  ...
</sanring-scroll-area>

<!-- Custom thumb + track -->
<sanring-scroll-area
  class="h-64 rounded-[var(--sanring-radius)] border p-4"
  style="--scrollbar-thumb: #94a3b8; --scrollbar-track: #f1f5f9"
>
  ...
</sanring-scroll-area>`,
  infinite: `<div
  sanringScrollArea
  sanringInfiniteScroll
  class="h-72 rounded-[var(--sanring-radius)] border p-4"
  (loadMore)="loadMore()"
>
  @for (item of visibleItems; track item.id) {
    <article class="border-b py-3">
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
    </article>
  }
</div>`,
} as const;
