import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import {
  ComponentPageComponent,
  ComponentPageSectionComponent,
} from '../../layouts/component-page';

interface RoadmapItem {
  name: string;
  description: string;
  meta?: string;
}

@Component({
  selector: 'app-roadmap-page',
  imports: [ComponentPageComponent, ComponentPageSectionComponent, NgTemplateOutlet],
  template: `
    <app-component-page [sections]="sections">
      <header class="border-b border-[var(--docs-border)] pb-10">
        <h1
          class="m-0 text-[34px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]"
        >
          {{ i18n.t('sidebar.roadmap') }}
        </h1>
        <p class="mb-0 mt-4 max-w-[620px] text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('roadmap.page.description') }}
        </p>
      </header>

      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">
          {{ i18n.t('roadmap.shipped.description') }}
        </p>
        <div class="mt-5 flex flex-wrap gap-2">
          @for (item of shipped; track item.name) {
            <span
              class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] px-3 py-1.5 text-sm font-medium text-[var(--docs-fg)]"
            >
              {{ item.name }}
            </span>
          }
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[1]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">
          {{ i18n.t('roadmap.tier1.description') }}
        </p>
        <ng-container
          [ngTemplateOutlet]="roadmapCards"
          [ngTemplateOutletContext]="{ items: tier1 }"
        />
      </app-component-page-section>

      <app-component-page-section [section]="sections[2]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">
          {{ i18n.t('roadmap.tier2.description') }}
        </p>
        <ng-container
          [ngTemplateOutlet]="roadmapCards"
          [ngTemplateOutletContext]="{ items: tier2 }"
        />
      </app-component-page-section>

      <app-component-page-section [section]="sections[3]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">
          {{ i18n.t('roadmap.tier3.description') }}
        </p>
        <ng-container
          [ngTemplateOutlet]="roadmapCards"
          [ngTemplateOutletContext]="{ items: tier3 }"
        />
      </app-component-page-section>

      <app-component-page-section [section]="sections[4]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">
          {{ i18n.t('roadmap.tier4.description') }}
        </p>
        <ng-container
          [ngTemplateOutlet]="roadmapCards"
          [ngTemplateOutletContext]="{ items: tier4 }"
        />
      </app-component-page-section>

      <ng-template #roadmapCards let-items="items">
        <ul class="mt-5 grid list-none gap-3 p-0">
          @for (item of items; track item.name) {
            <li
              class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-4 shadow-sm"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="font-medium text-[var(--docs-fg)]">{{ item.name }}</div>
                @if (item.meta) {
                  <span
                    class="rounded-[var(--sanring-radius-xs)] bg-[var(--docs-surface-strong)] px-2 py-1 text-xs font-medium text-[var(--docs-muted)]"
                  >
                    {{ item.meta }}
                  </span>
                }
              </div>
              <div class="mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                {{ item.description }}
              </div>
            </li>
          }
        </ul>
      </ng-template>
    </app-component-page>
  `,
})
export class RoadmapPageComponent {
  protected readonly i18n = inject(I18nService);

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'shipped', titleKey: 'roadmap.shipped.title' },
    { id: 'tier-1', titleKey: 'roadmap.tier1.title' },
    { id: 'tier-2', titleKey: 'roadmap.tier2.title' },
    { id: 'tier-3', titleKey: 'roadmap.tier3.title' },
    { id: 'tier-4', titleKey: 'roadmap.tier4.title' },
  ];

  protected readonly shipped: RoadmapItem[] = [
    { name: 'Accordion', description: '' },
    { name: 'Alert', description: '' },
    { name: 'Alert Dialog', description: '' },
    { name: 'Aspect Ratio', description: '' },
    { name: 'Avatar', description: '' },
    { name: 'Badge', description: '' },
    { name: 'Breadcrumb', description: '' },
    { name: 'Button', description: '' },
    { name: 'Card', description: '' },
    { name: 'Carousel', description: '' },
    { name: 'Checkbox', description: '' },
    { name: 'Collapsible', description: '' },
    { name: 'Command', description: '' },
    { name: 'Combobox', description: '' },
    { name: 'Dialog', description: '' },
    { name: 'Divider', description: '' },
    { name: 'Dropdown Menu', description: '' },
    { name: 'Hover Card', description: '' },
    { name: 'Input', description: '' },
    { name: 'Label', description: '' },
    { name: 'Link', description: '' },
    { name: 'Pagination', description: '' },
    { name: 'Popover', description: '' },
    { name: 'Progress', description: '' },
    { name: 'Radio Group', description: '' },
    { name: 'Scroll Area', description: '' },
    { name: 'Select', description: '' },
    { name: 'Sheet', description: '' },
    { name: 'Skeleton', description: '' },
    { name: 'Slider', description: '' },
    { name: 'Spinner', description: '' },
    { name: 'Stepper', description: '' },
    { name: 'Switch', description: '' },
    { name: 'Table', description: '' },
    { name: 'Tag', description: '' },
    { name: 'Tabs', description: '' },
    { name: 'Textarea', description: '' },
    { name: 'Timeline', description: '' },
    { name: 'Toggle', description: '' },
    { name: 'Toast', description: '' },
    { name: 'Tooltip', description: '' },
    { name: 'Tree', description: '' },
  ];

  protected readonly tier1: RoadmapItem[] = [
    {
      name: 'Field',
      meta: 'package-ready',
      description:
        'Implemented and exported as form composition primitives. Needs a dedicated docs page because Input already depends on this pattern.',
    },
  ];

  protected readonly tier2: RoadmapItem[] = [
    {
      name: 'Date Picker / Calendar',
      meta: 'scaffolded',
      description:
        'Directory exists, but the current index is empty. Finish calendar/date math, selection model, forms integration, and docs before exposing.',
    },
  ];

  protected readonly tier3: RoadmapItem[] = [
    {
      name: 'Context Menu',
      description:
        'Same shape as Dropdown Menu, triggered by right-click at cursor coordinates instead of a button anchor.',
    },
    {
      name: 'File Upload',
      description:
        'Drag-and-drop zone and file list, reusing Progress, Button, and Field for upload states.',
    },
    {
      name: 'Resizable',
      description: 'Drag-to-resize split panes for IDE-like layouts.',
    },
  ];

  protected readonly tier4: RoadmapItem[] = [
    {
      name: 'Navigation Menu',
      description:
        'Mega menu for marketing-site top navigation. High effort, low reuse of existing pieces.',
    },
    {
      name: 'Charts',
      description:
        'Potential future category, but it likely belongs in a separate package or recipe layer rather than core primitives.',
    },
  ];
}
