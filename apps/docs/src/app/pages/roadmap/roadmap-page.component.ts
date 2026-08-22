import { Component, effect, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { SeoService } from '../../seo/seo.service';
import {
  ComponentPageComponent,
  ComponentPageSectionComponent,
  DocsPageHeaderComponent,
} from '../../layouts/component-page';

interface RoadmapItem {
  name: string;
  description: string;
  meta?: string;
  tone?: 'updated';
}

interface RoadmapComponentRow {
  items: RoadmapItem[];
  duration: number;
}

@Component({
  selector: 'app-roadmap-page',
  imports: [
    ComponentPageComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
    NgTemplateOutlet,
  ],
  styles: [
    `
      .documented-components {
        --roadmap-row-gap: 0.75rem;
        mask-image: linear-gradient(
          90deg,
          transparent,
          #000 2.5rem,
          #000 calc(100% - 2.5rem),
          transparent
        );
      }

      .documented-components__track {
        animation: documented-components-pan var(--roadmap-row-duration) ease-in-out infinite
          alternate;
        animation-delay: var(--roadmap-row-delay);
        gap: var(--roadmap-row-gap);
        width: max-content;
      }

      .documented-components__row:nth-child(even) .documented-components__track {
        animation-direction: alternate-reverse;
      }

      @keyframes documented-components-pan {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(calc(-50% - (var(--roadmap-row-gap) / 2)));
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .documented-components {
          mask-image: none;
        }

        .documented-components__track {
          animation: none;
          flex-wrap: wrap;
          width: auto;
        }

        .documented-components__duplicate {
          display: none;
        }
      }
    `,
  ],
  template: `
    <app-component-page [sections]="sections">
      <app-docs-page-header
        [title]="i18n.t('sidebar.roadmap')"
        [description]="i18n.t('roadmap.page.description')"
        eyebrow="docs / roadmap"
      />

      <section class="mb-4 rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-5 shadow-[var(--docs-shadow-soft)] sm:p-6" aria-label="Roadmap delivery map">
        <div class="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--docs-border)] pb-5"><div><p class="m-0 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--docs-accent-strong)]">DELIVERY MAP</p><h2 class="m-0 mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--docs-fg)]">What is shipped, next, and forming.</h2></div><span class="font-mono text-xs text-[var(--docs-muted)]">v0.24.0</span></div>
        <div class="mt-5 grid gap-2 sm:grid-cols-4"><div class="rounded-[var(--sanring-radius)] bg-[var(--docs-accent)] p-4 text-[var(--docs-accent-fg)]"><p class="m-0 font-mono text-xs">SHIPPED</p><p class="m-0 mt-4 text-3xl font-semibold">{{ shipped.length }}</p><p class="m-0 mt-1 text-xs opacity-75">available now</p></div><div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4"><p class="m-0 font-mono text-xs text-[var(--docs-muted)]">TIER 1</p><p class="m-0 mt-4 text-3xl font-semibold text-[var(--docs-fg)]">{{ tier1.length }}</p><p class="m-0 mt-1 text-xs text-[var(--docs-muted)]">next in line</p></div><div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4"><p class="m-0 font-mono text-xs text-[var(--docs-muted)]">TIER 2</p><p class="m-0 mt-4 text-3xl font-semibold text-[var(--docs-fg)]">{{ tier2.length }}</p><p class="m-0 mt-1 text-xs text-[var(--docs-muted)]">in planning</p></div><div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4"><p class="m-0 font-mono text-xs text-[var(--docs-muted)]">TIER 3+</p><p class="m-0 mt-4 text-3xl font-semibold text-[var(--docs-fg)]">{{ tier3.length + tier4.length }}</p><p class="m-0 mt-1 text-xs text-[var(--docs-muted)]">forming</p></div></div>
      </section>

      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('roadmap.shipped.description') }}
        </p>
        <div class="documented-components mt-5 grid gap-3 overflow-hidden py-1">
          @for (row of shippedRows; track $index) {
            <div class="documented-components__row min-w-0 overflow-hidden">
              <div
                class="documented-components__track flex items-center"
                [style.--roadmap-row-duration]="row.duration + 's'"
                [style.--roadmap-row-delay]="-$index * 1.75 + 's'"
              >
                @for (item of row.items; track item.name) {
                  <ng-container
                    [ngTemplateOutlet]="componentChip"
                    [ngTemplateOutletContext]="{ item: item }"
                  />
                }
                @for (item of row.items; track item.name) {
                  <span class="documented-components__duplicate contents" aria-hidden="true">
                    <ng-container
                      [ngTemplateOutlet]="componentChip"
                      [ngTemplateOutletContext]="{ item: item }"
                    />
                  </span>
                }
              </div>
            </div>
          }
        </div>
      </app-component-page-section>

      <ng-template #componentChip let-item="item">
        <span
          [class]="componentChipClass(item)"
          [attr.aria-label]="item.tone === 'updated' ? item.name + ', recently updated' : item.name"
        >
          {{ item.name }}
        </span>
      </ng-template>

      <app-component-page-section [section]="sections[1]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('roadmap.tier1.description') }}
        </p>
        <ng-container
          [ngTemplateOutlet]="roadmapCards"
          [ngTemplateOutletContext]="{ items: tier1 }"
        />
      </app-component-page-section>

      <app-component-page-section [section]="sections[2]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('roadmap.tier2.description') }}
        </p>
        <ng-container
          [ngTemplateOutlet]="roadmapCards"
          [ngTemplateOutletContext]="{ items: tier2 }"
        />
      </app-component-page-section>

      <app-component-page-section [section]="sections[3]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('roadmap.tier3.description') }}
        </p>
        <ng-container
          [ngTemplateOutlet]="roadmapCards"
          [ngTemplateOutletContext]="{ items: tier3 }"
        />
      </app-component-page-section>

      <app-component-page-section [section]="sections[4]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
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
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t('sidebar.roadmap'),
        description: this.i18n.t('roadmap.page.description'),
      });
    });
  }

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
    { name: 'Calendar', description: '', tone: 'updated' },
    { name: 'Card', description: '' },
    { name: 'Carousel', description: '' },
    { name: 'Checkbox', description: '' },
    { name: 'Collapsible', description: '' },
    { name: 'Command', description: '' },
    { name: 'Combobox', description: '' },
    { name: 'Context Menu', description: '', tone: 'updated' },
    { name: 'Date Picker', description: '', tone: 'updated' },
    { name: 'Dialog', description: '' },
    { name: 'Divider', description: '' },
    { name: 'Dropdown Menu', description: '' },
    { name: 'Field', description: '' },
    { name: 'File Upload', description: '' },
    { name: 'Hover Card', description: '' },
    { name: 'Input', description: '' },
    { name: 'Label', description: '' },
    { name: 'Link', description: '' },
    { name: 'Navigation Menu', description: '', tone: 'updated' },
    { name: 'OTP Input', description: '', tone: 'updated' },
    { name: 'Pagination', description: '' },
    { name: 'Popover', description: '' },
    { name: 'Progress', description: '' },
    { name: 'Radio Group', description: '' },
    { name: 'Resizable', description: '' },
    { name: 'Scroll Area', description: '' },
    { name: 'Select', description: '' },
    { name: 'Sheet', description: '' },
    { name: 'Sidebar', description: '', tone: 'updated' },
    { name: 'Skeleton', description: '' },
    { name: 'Slider', description: '' },
    { name: 'Spinner', description: '' },
    { name: 'Stepper', description: '' },
    { name: 'Switch', description: '', tone: 'updated' },
    { name: 'Table', description: '' },
    { name: 'Tag', description: '' },
    { name: 'Tabs', description: '' },
    { name: 'Textarea', description: '' },
    { name: 'Timeline', description: '' },
    { name: 'Toggle', description: '' },
    { name: 'Toast', description: '' },
    { name: 'Tooltip', description: '' },
    { name: 'Transfer', description: '', tone: 'updated' },
    { name: 'Tree', description: '' },
  ];

  protected readonly shippedRows: RoadmapComponentRow[] = this.createComponentRows(this.shipped);

  protected readonly tier1: RoadmapItem[] = [];

  protected readonly tier2: RoadmapItem[] = [
    {
      name: 'Masked Input',
      description:
        'A formatting directive layered on the existing Input, not a one-off credit-card component. One config drives credit card (with Luhn validation and card-brand detection), phone number, national ID, and thousand-separator amount formatting.',
    },
  ];

  protected readonly tier3: RoadmapItem[] = [
    {
      name: 'Virtual Scroller',
      description:
        'Windowed rendering for large lists/tables. Angular CDK provides the primitive, but wrapping it into a styled, easy-to-drop-into Table/Select is real integration work.',
    },
    {
      name: 'Color Picker',
      description:
        'Hue/saturation/alpha picker UI with swatch and hex/rgb input. New color-math and canvas/gradient rendering, no reuse of existing components.',
    },
    {
      name: 'Tour / Walkthrough',
      description:
        'Dims the screen and spotlights a target element with a step-by-step tooltip for onboarding. Needs a step state machine plus a highlight/cutout overlay, not just Popover reuse.',
    },
  ];

  protected readonly tier4: RoadmapItem[] = [
    {
      name: 'Charts',
      description:
        'Potential future category, but it likely belongs in a separate package or recipe layer rather than core primitives.',
    },
  ];

  private createComponentRows(items: RoadmapItem[]): RoadmapComponentRow[] {
    const rowSize = 10;

    return Array.from({ length: Math.ceil(items.length / rowSize) }, (_, index) => ({
      items: items.slice(index * rowSize, index * rowSize + rowSize),
      duration: 22 + index * 3,
    }));
  }

  protected componentChipClass(item: RoadmapItem) {
    const base =
      'shrink-0 rounded-[var(--sanring-radius)] border px-3 py-1.5 text-sm font-medium shadow-sm transition-colors';

    if (item.tone === 'updated') {
      return `${base} border-[color-mix(in_srgb,var(--docs-accent)_62%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_18%,var(--docs-panel))] text-[var(--docs-accent-strong)]`;
    }

    return `${base} border-[var(--docs-border)] bg-[var(--docs-panel)] text-[var(--docs-fg)]`;
  }
}
