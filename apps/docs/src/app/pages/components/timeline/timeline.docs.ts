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
      <span class="size-3 rounded-full bg-[var(--sanring-foreground)]"></span>
      <span class="mt-2 h-full min-h-10 w-px bg-[var(--sanring-border-strong)]"></span>
    </span>
    <div sanringTimelineContent>
      <p class="font-medium">Created project</p>
      <p class="text-sm text-[var(--docs-foreground-muted)]">Workspace and registry files are ready.</p>
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
  horizontal: `<ul sanringTimeline orientation="horizontal">
  <li sanringTimelineItem>
    <span sanringTimelineSeparator></span>
    <div sanringTimelineContent>Plan</div>
  </li>
  <li sanringTimelineItem>
    <span sanringTimelineSeparator></span>
    <div sanringTimelineContent>Build</div>
  </li>
</ul>`,
  divBased: `<div sanringTimeline>
  <div sanringTimelineItem>
    <div sanringTimelineContent>Imported from an activity feed.</div>
  </div>
</div>`,
} as const;
