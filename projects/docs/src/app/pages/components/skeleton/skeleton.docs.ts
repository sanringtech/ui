import { ComponentPageDefinition } from '../../../docs-schema/component-page.types';

export const skeletonPage = {
  componentId: 'skeleton',
  titleKey: 'component.skeleton',
  descriptionKey: 'skeleton.description',
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'skeleton.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'skeleton.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'skeleton.installation.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      descriptionKey: 'skeleton.examples.description',
      level: 2,
      children: [
        {
          id: 'example-avatar',
          titleKey: 'skeleton.demo.avatar',
          level: 3,
        },
        {
          id: 'example-card',
          titleKey: 'skeleton.demo.card',
          level: 3,
        },
        {
          id: 'example-text',
          titleKey: 'skeleton.demo.text',
          level: 3,
        },
        {
          id: 'example-form',
          titleKey: 'skeleton.demo.form',
          level: 3,
        },
        {
          id: 'example-table',
          titleKey: 'skeleton.demo.table',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'skeleton.api.description',
      level: 2,
    },
  ],
} as const satisfies ComponentPageDefinition;

export const skeletonPageExamples = {
  basic: `<div class="flex items-center gap-4">
  <div sanringSkeleton class="size-12 rounded-full"></div>
  <div class="grid gap-2">
    <div sanringSkeleton class="h-4 w-[180px]"></div>
    <div sanringSkeleton class="h-4 w-[140px]"></div>
  </div>
</div>`,
  usageImport: `import { SkeletonDirective } from '@sanring/ui';`,
  usageMain: `<div sanringSkeleton class="h-4 w-[180px]"></div>`,
  avatar: `<div class="flex items-center gap-4">
  <div sanringSkeleton class="size-12 rounded-full"></div>
  <div class="grid gap-2">
    <div sanringSkeleton class="h-4 w-[160px]"></div>
    <div sanringSkeleton class="h-3 w-[120px]"></div>
  </div>
</div>`,
  card: `<div class="w-[min(360px,100%)] rounded-lg border border-[var(--docs-border)] p-5">
  <div sanringSkeleton class="h-40 w-full"></div>
  <div class="mt-4 grid gap-2">
    <div sanringSkeleton class="h-4 w-3/4"></div>
    <div sanringSkeleton class="h-4 w-1/2"></div>
  </div>
</div>`,
  text: `<div class="grid w-[min(420px,100%)] gap-2">
  <div sanringSkeleton class="h-4 w-full"></div>
  <div sanringSkeleton class="h-4 w-11/12"></div>
  <div sanringSkeleton class="h-4 w-2/3"></div>
</div>`,
  form: `<div class="grid w-[min(360px,100%)] gap-4">
  <div class="grid gap-2">
    <div sanringSkeleton class="h-4 w-24"></div>
    <div sanringSkeleton class="h-10 w-full"></div>
  </div>
  <div class="grid gap-2">
    <div sanringSkeleton class="h-4 w-20"></div>
    <div sanringSkeleton class="h-10 w-full"></div>
  </div>
  <div sanringSkeleton class="h-10 w-28"></div>
</div>`,
  table: `<div class="grid w-[min(520px,100%)] gap-3">
  <div class="grid grid-cols-[1.5fr_1fr_1fr] gap-3">
    <div sanringSkeleton class="h-4 w-20"></div>
    <div sanringSkeleton class="h-4 w-16"></div>
    <div sanringSkeleton class="h-4 w-14"></div>
  </div>
  <div class="grid gap-3">
    <div class="grid grid-cols-[1.5fr_1fr_1fr] gap-3">
      <div sanringSkeleton class="h-4 w-full"></div>
      <div sanringSkeleton class="h-4 w-20"></div>
      <div sanringSkeleton class="h-4 w-16"></div>
    </div>
    <div class="grid grid-cols-[1.5fr_1fr_1fr] gap-3">
      <div sanringSkeleton class="h-4 w-10/12"></div>
      <div sanringSkeleton class="h-4 w-24"></div>
      <div sanringSkeleton class="h-4 w-12"></div>
    </div>
    <div class="grid grid-cols-[1.5fr_1fr_1fr] gap-3">
      <div sanringSkeleton class="h-4 w-11/12"></div>
      <div sanringSkeleton class="h-4 w-16"></div>
      <div sanringSkeleton class="h-4 w-20"></div>
    </div>
  </div>
</div>`,
} as const;
