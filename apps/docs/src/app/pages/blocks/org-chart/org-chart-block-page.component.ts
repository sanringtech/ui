import { Component, effect, inject, signal } from '@angular/core';
import {
  ComponentPageDefinition,
  ComponentPageSectionDefinition,
} from '../../../docs-schema/component-page.types';
import { getComponentPageSection } from '../../../docs-schema/component-page.utils';
import { I18nService } from '../../../i18n/i18n.service';
import { SeoService } from '../../../seo/seo.service';
import {
  ComponentPageCodeBlock,
  ComponentPageCodePreviewer,
  ComponentPageComponent,
  ComponentPageInstallationComponent,
  ComponentPageSectionComponent,
  DocsPageHeaderComponent,
} from '../../../layouts/component-page';
import { OrgChartComponent, type OrgLink, type OrgPerson } from '../../../../registry-stage/org-chart';
import { BlockCompositionComponent } from '../block-composition.component';
import { getDocsBlock } from '../blocks.catalog';

const orgChartBlockPage = {
  componentId: 'tree',
  titleKey: 'blocks.org.title',
  descriptionKey: 'blocks.org.body',
  sections: [
    { id: 'scenario', titleKey: 'blocks.section.scenario' },
    { id: 'composition', titleKey: 'blocks.section.composition' },
    { id: 'installation', titleKey: 'blocks.section.installation' },
    { id: 'usage', titleKey: 'blocks.section.usage' },
    {
      id: 'preview',
      titleKey: 'blocks.section.preview',
      children: [
        {
          id: 'preview-with-tree',
          titleKey: 'blocks.org.preview.withTree',
          level: 3,
        },
        {
          id: 'preview-canvas-only',
          titleKey: 'blocks.org.preview.canvasOnly',
          level: 3,
        },
      ],
    },
    { id: 'notes', titleKey: 'blocks.section.notes' },
  ],
} as const satisfies ComponentPageDefinition;

@Component({
  selector: 'app-org-chart-block-page',
  imports: [
    BlockCompositionComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
    OrgChartComponent,
  ],
  template: `
    <app-component-page [sections]="page.sections">
      <app-docs-page-header
        [title]="i18n.t(block.titleKey)"
        [description]="i18n.t(block.descriptionKey)"
        eyebrow="blocks / {{ block.id }}"
      />

      <app-component-page-section [section]="section('scenario')">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t(block.scenarioKey) }}
        </p>
      </app-component-page-section>

      <app-component-page-section [section]="section('composition')">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t(block.compositionKey) }}
        </p>
        <p class="mt-2 text-sm text-[var(--docs-muted)]">
          {{ i18n.t('blocks.section.compositionHint') }}
        </p>
        <div class="mt-4">
          <app-block-composition
            [componentDeps]="block.componentDeps"
            [peerDependencies]="block.peerDependencies"
            [componentsLabel]="i18n.t('blocks.section.components')"
            [peersLabel]="i18n.t('blocks.section.peers')"
          />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('installation')">
        <app-component-page-installation
          [componentName]="block.installName"
          manualSnippet="import { OrgChartComponent } from './components/ui/org-chart';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="section('usage')">
        <div class="grid gap-6">
          <app-component-page-code-block [code]="usageTs" language="typescript" />
          <app-component-page-code-block [code]="usageHtml" language="angular-html" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="section('preview')">
        <div class="grid gap-10">
          <app-component-page-section [section]="section('preview-with-tree')">
            <p class="mt-0 text-sm leading-6 text-[var(--docs-muted)]">
              {{ i18n.t('blocks.org.preview.withTreeDescription') }}
            </p>
            <app-component-page-code-previewer
              class="mt-4"
              [code]="usageHtml"
              language="angular-html"
              [wide]="true"
            >
              <div previewer class="w-full min-w-0 overflow-hidden bg-[var(--docs-surface)] p-4">
                <sanring-org-chart
                  class="h-[520px]"
                  [people]="people"
                  [links]="links"
                  [(selected)]="selected"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>

          <app-component-page-section [section]="section('preview-canvas-only')">
            <p class="mt-0 text-sm leading-6 text-[var(--docs-muted)]">
              {{ i18n.t('blocks.org.preview.canvasOnlyDescription') }}
            </p>
            <app-component-page-code-previewer
              class="mt-4"
              [code]="usageCanvasOnlyHtml"
              language="angular-html"
              [wide]="true"
            >
              <div previewer class="w-full min-w-0 overflow-hidden bg-[var(--docs-surface)] p-4">
                <sanring-org-chart
                  class="h-[480px]"
                  [people]="people"
                  [links]="links"
                  [showTree]="false"
                  [(selected)]="selectedCanvasOnly"
                />
              </div>
            </app-component-page-code-previewer>
          </app-component-page-section>
        </div>
      </app-component-page-section>

      @if (block.notesKey; as notesKey) {
        <app-component-page-section [section]="section('notes')">
          <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
            {{ i18n.t(notesKey) }}
          </p>
        </app-component-page-section>
      }
    </app-component-page>
  `,
})
export class OrgChartBlockPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly block = getDocsBlock('org-chart');
  protected readonly page = orgChartBlockPage;
  protected readonly selected = signal<string | null>(null);
  protected readonly selectedCanvasOnly = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t(this.block.titleKey),
        description: this.i18n.t(this.block.descriptionKey),
      });
    });
  }

  protected section(id: string): ComponentPageSectionDefinition {
    return getComponentPageSection(this.page, id);
  }

  protected readonly usageTs = `import { Component, signal } from '@angular/core';
import {
  OrgChartComponent,
  type OrgLink,
  type OrgPerson,
} from './components/ui/org-chart';

@Component({
  imports: [OrgChartComponent],
  templateUrl: './org.page.html',
})
export class OrgPage {
  readonly selected = signal<string | null>(null);

  readonly people: OrgPerson[] = [
    { id: 'ada', name: 'Ada Lin', title: 'CEO' },
    { id: 'ben', name: 'Ben Ho', title: 'CTO', department: 'Eng' },
    { id: 'mia', name: 'Mia Hsu', title: 'Solutions Eng', department: 'Eng' },
  ];

  readonly links: OrgLink[] = [
    { source: 'ada', target: 'ben' },
    { source: 'ben', target: 'mia' },
    { source: 'ada', target: 'mia', kind: 'dotted' },
  ];
}`;

  protected readonly usageHtml = `<sanring-org-chart
  class="h-[520px]"
  [people]="people"
  [links]="links"
  [(selected)]="selected"
/>`;

  protected readonly usageCanvasOnlyHtml = `<sanring-org-chart
  class="h-[480px]"
  [people]="people"
  [links]="links"
  [showTree]="false"
  [(selected)]="selected"
/>`;

  protected readonly people: OrgPerson[] = [
    { id: 'ada', name: 'Ada Lin', title: 'CEO' },
    { id: 'ben', name: 'Ben Ho', title: 'CTO', department: 'Eng' },
    { id: 'cora', name: 'Cora Wu', title: 'CFO', department: 'Finance' },
    { id: 'dan', name: 'Dan Chen', title: 'VP Sales', department: 'Sales' },
    { id: 'eve', name: 'Eve Tsai', title: 'Eng Manager', department: 'Eng' },
    { id: 'finn', name: 'Finn Kao', title: 'Eng Manager', department: 'Eng' },
    { id: 'gus', name: 'Gus Lee', title: 'Controller', department: 'Finance' },
    { id: 'hana', name: 'Hana Su', title: 'Sales Lead', department: 'Sales' },
    { id: 'jo', name: 'Jo Yang', title: 'Engineer', department: 'Eng' },
    { id: 'kai', name: 'Kai Lu', title: 'Engineer', department: 'Eng' },
    { id: 'mia', name: 'Mia Hsu', title: 'Solutions Eng', department: 'Eng' },
    { id: 'nia', name: 'Nia Lo', title: 'Accountant', department: 'Finance' },
    { id: 'oto', name: 'Oto Pan', title: 'Account Exec', department: 'Sales' },
    { id: 'quin', name: 'Quin Fang', title: 'Junior PM', department: 'Eng' },
  ];

  protected readonly links: OrgLink[] = [
    { source: 'ada', target: 'ben' },
    { source: 'ada', target: 'cora' },
    { source: 'ada', target: 'dan' },
    { source: 'ben', target: 'eve' },
    { source: 'ben', target: 'finn' },
    { source: 'cora', target: 'gus' },
    { source: 'dan', target: 'hana' },
    { source: 'eve', target: 'jo' },
    { source: 'eve', target: 'quin' },
    { source: 'finn', target: 'kai' },
    { source: 'finn', target: 'mia' },
    { source: 'hana', target: 'mia' },
    { source: 'gus', target: 'nia' },
    { source: 'hana', target: 'oto' },
    { source: 'ada', target: 'quin', kind: 'dotted' },
  ];
}
