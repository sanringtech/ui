import {
  ComponentPageApiRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const timelinePage = {
  componentId: 'timeline',
  titleKey: 'component.timeline',
  descriptionKey: 'timeline.description',
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
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'timeline.api.description',
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
  basic: `<ul sanringTimeline class="gap-0">
  <li sanringTimelineItem class="gap-5">
    <span sanringTimelineSeparator>
      <span class="grid size-8 place-items-center rounded-full border bg-background">
        <span class="size-3 rounded-full bg-primary"></span>
      </span>
      <span class="h-20 w-px bg-border"></span>
    </span>
    <div sanringTimelineContent class="pb-7">
      <article class="min-h-20 rounded-md border bg-background px-4 py-3">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-medium">Created project</p>
            <p class="text-sm text-muted-foreground">Workspace and registry files are ready.</p>
          </div>
          <span class="rounded-full border px-2.5 py-1 text-xs">
            09:12
          </span>
        </div>
      </article>
    </div>
  </li>
</ul>`,
  usageImport: `import {
  TimelineContentDirective,
  TimelineDirective,
  TimelineItemDirective,
  TimelineSeparatorDirective,
} from '@sanring/ui';`,
  usageMain: `<ul sanringTimeline orientation="vertical">
  <li sanringTimelineItem>
    <span sanringTimelineSeparator></span>
    <div sanringTimelineContent>Created project</div>
  </li>
</ul>`,
  horizontal: `<ul sanringTimeline orientation="horizontal" class="gap-0">
  <li sanringTimelineItem class="flex-1 gap-3">
    <span sanringTimelineSeparator class="relative w-full justify-center">
      <span class="absolute left-1/2 right-0 top-1/2 h-px -translate-y-1/2 bg-border"></span>
      <span class="relative z-10 grid size-9 place-items-center rounded-full border bg-background">
        1
      </span>
    </span>
    <div sanringTimelineContent>
      <article class="min-h-28 rounded-md border p-4">
        Plan
      </article>
    </div>
  </li>
  <li sanringTimelineItem class="flex-1 gap-3">
    <span sanringTimelineSeparator class="relative w-full justify-center">
      <span class="absolute left-0 right-1/2 top-1/2 h-px -translate-y-1/2 bg-border"></span>
      <span class="relative z-10 grid size-9 place-items-center rounded-full border bg-background">
        2
      </span>
    </span>
    <div sanringTimelineContent>
      <article class="min-h-28 rounded-md border p-4">
        Build
      </article>
    </div>
  </li>
</ul>`,
  divBased: `<div sanringTimeline class="gap-0 rounded-md border">
  <div sanringTimelineItem class="items-start gap-4 border-b p-4">
    <span sanringTimelineSeparator class="grid size-9 place-items-center rounded-md bg-muted">
      UI
    </span>
    <div sanringTimelineContent>
      Imported from an activity feed.
    </div>
  </div>
</div>`,
} as const;
