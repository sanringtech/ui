import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const timelinePage = {
  componentId: 'timeline',
  titleKey: 'component.timeline',
  descriptionKey: 'timeline.description',
  registryDeps: ['utils'],
  ssrSafe: true,
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'timeline.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'timeline.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'timeline.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-horizontal',
          titleKey: 'timeline.demo.horizontal',
          level: 3,
        },
        {
          id: 'example-div',
          titleKey: 'timeline.demo.divBased',
          level: 3,
        },
        {
          id: 'example-reorder',
          titleKey: 'timeline.demo.reorder',
          descriptionKey: 'timeline.demo.reorder.description',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'timeline.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'timeline.accessibility.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'timeline.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'orientation',
      type: "'vertical' | 'horizontal'",
      defaultValue: "'vertical'",
      descriptionKey: 'timeline.api.orientation.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'timeline.api.class.description',
    },
    {
      property: 'sanringTimelineItem.class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'timeline.api.itemClass.description',
    },
    {
      property: 'sanringTimelineSeparator.class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'timeline.api.separatorClass.description',
    },
    {
      property: 'sanringTimelineContent.class',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'timeline.api.contentClass.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
} as const satisfies ComponentPageDefinition;

export const timelinePageExamples = {
  basic: `<ul sanringTimeline>
  <li sanringTimelineItem>
    <span sanringTimelineSeparator></span>
    <div sanringTimelineContent>
      <div class="flex items-baseline justify-between gap-4">
        <p class="font-medium">Created project</p>
        <time class="text-xs tabular-nums text-muted-foreground">09:12</time>
      </div>
      <p class="mt-1 text-sm text-muted-foreground">
        Workspace and registry files are ready.
      </p>
    </div>
  </li>
</ul>`,
  usageImport: `import { Component } from '@angular/core';
import { SANRING_TIMELINE_IMPORTS } from './components/ui/timeline';

@Component({
  imports: [SANRING_TIMELINE_IMPORTS],
})
export class ExampleComponent {}`,
  usageIndividualImports: `import { Component } from '@angular/core';
import {
  TimelineContentDirective,
  TimelineDirective,
  TimelineItemDirective,
  TimelineSeparatorDirective,
} from './components/ui/timeline';

@Component({
  imports: [
    TimelineDirective,
    TimelineItemDirective,
    TimelineSeparatorDirective,
    TimelineContentDirective,
  ],
})
export class ExampleComponent {}`,
  usageMain: `<ul sanringTimeline>
  <li sanringTimelineItem>
    <span sanringTimelineSeparator></span>
    <div sanringTimelineContent>Created project</div>
  </li>
</ul>`,
  horizontal: `<ul sanringTimeline orientation="horizontal">
  <li sanringTimelineItem>
    <span sanringTimelineSeparator></span>
    <div sanringTimelineContent class="text-center">Plan</div>
  </li>
  <li sanringTimelineItem>
    <span sanringTimelineSeparator></span>
    <div sanringTimelineContent class="text-center">Build</div>
  </li>
</ul>`,
  divBased: `<sanring-card class="p-5">
  <div sanringTimeline>
    <div sanringTimelineItem>
      <span sanringTimelineSeparator>
        <sanring-avatar size="sm">
          <sanring-avatar-fallback>UI</sanring-avatar-fallback>
        </sanring-avatar>
      </span>
      <div sanringTimelineContent>Imported from an activity feed.</div>
    </div>
  </div>
</sanring-card>`,
  reorder: `<sanring-sortable class="max-w-md gap-0" [data]="items" (sorted)="items = $event">
  @for (item of items; track item.id) {
    <div sanringTimelineItem sanringSortableItem>
      <span sanringTimelineSeparator></span>
      <div sanringTimelineContent class="flex items-start gap-3">
        <div class="min-w-0 flex-1">{{ item.title }}</div>
        <button sanringSortableHandle type="button" aria-label="Reorder">⋮⋮</button>
      </div>
    </div>
  }
</sanring-sortable>`,
} as const;
