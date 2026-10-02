import { Component, effect, inject } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../../docs-schema/component-page.types';
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
import { DashboardShellComponent } from '../../../../registry-stage/dashboard-shell';
import { BlockCompositionComponent } from '../block-composition.component';
import { getDocsBlock } from '../blocks.catalog';

@Component({
  selector: 'app-dashboard-shell-block-page',
  imports: [
    BlockCompositionComponent,
    ComponentPageCodeBlock,
    ComponentPageCodePreviewer,
    ComponentPageComponent,
    ComponentPageInstallationComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
    DashboardShellComponent,
  ],
  template: `
    <app-component-page [sections]="sections">
      <app-docs-page-header
        [title]="i18n.t(block.titleKey)"
        [description]="i18n.t(block.descriptionKey)"
        eyebrow="blocks / {{ block.id }}"
      />

      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t(block.scenarioKey) }}
        </p>
      </app-component-page-section>

      <app-component-page-section [section]="sections[1]">
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

      <app-component-page-section [section]="sections[2]">
        <app-component-page-installation
          [componentName]="block.installName"
          manualSnippet="import { DashboardShellComponent } from './components/ui/dashboard-shell';"
        />
      </app-component-page-section>

      <app-component-page-section [section]="sections[3]">
        <div class="grid gap-6">
          <app-component-page-code-block [code]="usageTs" language="typescript" />
          <app-component-page-code-block [code]="usageHtml" language="angular-html" />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[4]">
        <app-component-page-code-previewer [code]="usageHtml" language="angular-html" [wide]="true">
          <div
            previewer
            class="h-[360px] w-full overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <sanring-dashboard-shell class="h-full">
              <p class="p-4 text-sm text-[var(--docs-muted)]">Page content goes here.</p>
            </sanring-dashboard-shell>
          </div>
        </app-component-page-code-previewer>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class DashboardShellBlockPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly block = getDocsBlock('dashboard-shell');

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t(this.block.titleKey),
        description: this.i18n.t(this.block.descriptionKey),
      });
    });
  }

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'scenario', titleKey: 'blocks.section.scenario' },
    { id: 'composition', titleKey: 'blocks.section.composition' },
    { id: 'installation', titleKey: 'blocks.section.installation' },
    { id: 'usage', titleKey: 'blocks.section.usage' },
    { id: 'preview', titleKey: 'blocks.section.preview' },
  ];

  protected readonly usageTs = `import { Component } from '@angular/core';
import { DashboardShellComponent } from './components/ui/dashboard-shell';

@Component({
  imports: [DashboardShellComponent],
  templateUrl: './app.html',
})
export class App {}`;

  protected readonly usageHtml = `<sanring-dashboard-shell>
  <router-outlet />
</sanring-dashboard-shell>`;
}
