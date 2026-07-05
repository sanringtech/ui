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
  basic: `<ul sanringTimeline>
  <li sanringTimelineItem>
    <span sanringTimelineSeparator>
      <span class="grid size-6 place-items-center rounded-full border-2 bg-background">
        <span class="size-2 rounded-full bg-primary"></span>
      </span>
      <!-- omit on the last item -->
      <span class="w-px flex-1 bg-border"></span>
    </span>
    <div sanringTimelineContent class="pb-6">
      <div class="rounded-lg border bg-background p-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="font-medium">Created project</p>
            <p class="text-sm text-muted-foreground">Workspace and registry files are ready.</p>
          </div>
          <span sanringBadge variant="outline">09:12</span>
        </div>
      </div>
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
  horizontal: `<!-- TimelineItem stacks vertically and TimelineSeparator runs
     horizontally once orientation="horizontal" -->
<ul sanringTimeline orientation="horizontal" class="gap-0">
  <li sanringTimelineItem class="flex-1">
    <span sanringTimelineSeparator class="w-full">
      <!-- first item: hide the leading line segment -->
      <span class="h-px flex-1 bg-border invisible"></span>
      <span class="grid size-7 place-items-center rounded-full border-2 bg-background text-xs">
        1
      </span>
      <span class="h-px flex-1 bg-border"></span>
    </span>
    <div sanringTimelineContent class="pt-3 text-center">Plan</div>
  </li>
  <li sanringTimelineItem class="flex-1">
    <span sanringTimelineSeparator class="w-full">
      <span class="h-px flex-1 bg-border"></span>
      <span class="grid size-7 place-items-center rounded-full border-2 bg-background text-xs">
        2
      </span>
      <!-- last item: hide the trailing line segment -->
      <span class="h-px flex-1 bg-border invisible"></span>
    </span>
    <div sanringTimelineContent class="pt-3 text-center">Build</div>
  </li>
</ul>`,
  divBased: `<!-- sanringTimeline/-Item/-Content also accept plain divs, so the
     primitives compose with a Card instead of a semantic list -->
<sanring-card>
  <div sanringTimeline class="divide-y">
    <div sanringTimelineItem class="items-center p-4">
      <span sanringTimelineSeparator>
        <sanring-avatar size="sm">
          <sanring-avatar-fallback>UI</sanring-avatar-fallback>
        </sanring-avatar>
      </span>
      <div sanringTimelineContent>Imported from an activity feed.</div>
    </div>
  </div>
</sanring-card>`,
} as const;
