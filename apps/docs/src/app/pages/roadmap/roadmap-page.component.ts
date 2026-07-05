import { Component, inject } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageComponent, ComponentPageSectionComponent } from '../../layouts/component-page';

interface RoadmapItem {
  name: string;
  description: string;
}

@Component({
  selector: 'app-roadmap-page',
  imports: [ComponentPageComponent, ComponentPageSectionComponent],
  template: `
    <app-component-page [sections]="sections">
      <header class="border-b border-[var(--docs-border)] pb-10">
        <h1 class="m-0 text-[34px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]">
          {{ i18n.t('sidebar.roadmap') }}
        </h1>
        <p class="mb-0 mt-4 max-w-[620px] text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('roadmap.page.description') }}
        </p>
      </header>

      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">{{ i18n.t('roadmap.tier1.description') }}</p>
        <ul class="mt-4 space-y-4 list-none p-0">
          @for (item of tier1; track item.name) {
            <li>
              <div class="font-medium text-[var(--docs-fg)]">{{ item.name }}</div>
              <div class="text-sm text-[var(--docs-muted)]">{{ item.description }}</div>
            </li>
          }
        </ul>
      </app-component-page-section>

      <app-component-page-section [section]="sections[1]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">{{ i18n.t('roadmap.tier2.description') }}</p>
        <ul class="mt-4 space-y-4 list-none p-0">
          @for (item of tier2; track item.name) {
            <li>
              <div class="font-medium text-[var(--docs-fg)]">{{ item.name }}</div>
              <div class="text-sm text-[var(--docs-muted)]">{{ item.description }}</div>
            </li>
          }
        </ul>
      </app-component-page-section>

      <app-component-page-section [section]="sections[2]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">{{ i18n.t('roadmap.tier3.description') }}</p>
        <ul class="mt-4 space-y-4 list-none p-0">
          @for (item of tier3; track item.name) {
            <li>
              <div class="font-medium text-[var(--docs-fg)]">{{ item.name }}</div>
              <div class="text-sm text-[var(--docs-muted)]">{{ item.description }}</div>
            </li>
          }
        </ul>
      </app-component-page-section>

      <app-component-page-section [section]="sections[3]">
        <p class="mt-0 text-sm text-[var(--docs-muted)]">{{ i18n.t('roadmap.tier4.description') }}</p>
        <ul class="mt-4 space-y-4 list-none p-0">
          @for (item of tier4; track item.name) {
            <li>
              <div class="font-medium text-[var(--docs-fg)]">{{ item.name }}</div>
              <div class="text-sm text-[var(--docs-muted)]">{{ item.description }}</div>
            </li>
          }
        </ul>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class RoadmapPageComponent {
  protected readonly i18n = inject(I18nService);

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'tier-1', titleKey: 'roadmap.tier1.title' },
    { id: 'tier-2', titleKey: 'roadmap.tier2.title' },
    { id: 'tier-3', titleKey: 'roadmap.tier3.title' },
    { id: 'tier-4', titleKey: 'roadmap.tier4.title' },
  ];

  protected readonly tier1: RoadmapItem[] = [
    {
      name: 'Field',
      description:
        'Label + control + description + error message layout, plus ReactiveFormsModule state (ng-invalid/ng-touched) and aria-describedby wiring. Everything else in forms depends on this.',
    },
    {
      name: 'Textarea',
      description: 'Multi-line Input with optional auto-resize. Trivial cost, very high usage.',
    },
    {
      name: 'Aspect Ratio',
      description: 'Wrapper div + CSS aspect-ratio. Near-zero cost.',
    },
    {
      name: 'Alert Dialog',
      description:
        'A specialized Dialog with default confirm/cancel actions for destructive-action confirmations.',
    },
  ];

  protected readonly tier2: RoadmapItem[] = [
    {
      name: 'Context Menu',
      description:
        'Same shape as Dropdown Menu, triggered by right-click at cursor coordinates instead of a button anchor.',
    },
    {
      name: 'Hover Card',
      description: 'Popover with a hover+delay trigger instead of click.',
    },
    {
      name: 'File Upload',
      description:
        'Drag-and-drop zone and file list, reusing Progress (upload progress) and Button (remove/retry). Pairs with Field.',
    },
  ];

  protected readonly tier3: RoadmapItem[] = [
    {
      name: 'Combobox',
      description:
        'Keyboard focus management and filtering logic. Build before Command since Command reuses the same pattern.',
    },
    {
      name: 'Date Picker / Calendar',
      description: 'Date math plus a calendar grid component — new infrastructure, not just composition.',
    },
    {
      name: 'Command (Cmd+K)',
      description: 'Builds on Combobox’s filtering/keyboard-nav logic, layered on the existing Dialog.',
    },
  ];

  protected readonly tier4: RoadmapItem[] = [
    {
      name: 'Resizable',
      description: 'Drag-to-resize split panes. Useful for IDE-like layouts, narrower audience.',
    },
    {
      name: 'Navigation Menu',
      description: 'Mega menu for marketing-site top navigation. High effort, low reuse of existing pieces.',
    },
    {
      name: 'Carousel',
      description: 'Media/marketing use case. High effort (touch/drag, autoplay, indicators).',
    },
  ];
}
