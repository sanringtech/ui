import { Component, effect, inject } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { SeoService } from '../../seo/seo.service';
import {
  ComponentPageCodeBlock,
  ComponentPageComponent,
  ComponentPageSectionComponent,
} from '../../layouts/component-page';

const INLINE_CODE_CLASS =
  'rounded-[var(--sanring-radius-xs)] bg-[var(--docs-code)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--docs-fg)]';

@Component({
  selector: 'app-mcp-page',
  imports: [ComponentPageCodeBlock, ComponentPageComponent, ComponentPageSectionComponent],
  template: `
    <app-component-page [sections]="sections">
      <header class="border-b border-[var(--docs-border)] pb-10">
        <h1
          class="m-0 text-[34px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]"
        >
          {{ i18n.t('sidebar.mcpServer') }}
        </h1>
        <p class="mb-0 mt-4 max-w-[620px] text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('mcp.page.description') }}
        </p>
      </header>

      <!-- 1. Overview -->
      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('mcp.overview.body') }}
        </p>
        <div
          class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="commands.start" language="bash" />
        </div>
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path)
          </li>
        </ul>
      </app-component-page-section>

      <!-- 2. Tools -->
      <app-component-page-section [section]="sections[1]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('mcp.tools.body') }}
        </p>
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">list_components</code>
            &mdash; list every available component with its description
          </li>
          <li>
            <code [class]="inlineCodeClass">search_components</code>
            &mdash; search components by name or description
          </li>
          <li>
            <code [class]="inlineCodeClass">get_component_info</code>
            &mdash; show files, auto-installed component dependencies, shared utilities, and peer
            dependencies
          </li>
          <li>
            <code [class]="inlineCodeClass">plan_component_install</code>
            &mdash; preview files, component deps, and peer packages that would be installed,
            without modifying the project
          </li>
          <li>
            <code [class]="inlineCodeClass">add_component</code>
            &mdash; run <code [class]="inlineCodeClass">sanring add --yes</code> in the target
            Angular project (call
            <code [class]="inlineCodeClass">plan_component_install</code>
            first to preview)
          </li>
        </ul>
      </app-component-page-section>

      <!-- 3. Setup -->
      <app-component-page-section [section]="sections[2]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('mcp.setup.body') }}
        </p>
        <div
          class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
        >
          <app-component-page-code-block [code]="commands.claudeConfig" language="json" />
        </div>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class McpPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly inlineCodeClass = INLINE_CODE_CLASS;

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t('sidebar.mcpServer'),
        description: this.i18n.t('mcp.page.description'),
      });
    });
  }

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'overview', titleKey: 'mcp.overview.title' },
    { id: 'tools', titleKey: 'mcp.tools.title' },
    { id: 'setup', titleKey: 'mcp.setup.title' },
  ];

  protected readonly commands = {
    start: `npx @sanring/cli@latest mcp`,
    claudeConfig: `{
  "mcpServers": {
    "sanring": {
      "command": "npx",
      "args": ["@sanring/cli@latest", "mcp"]
    }
  }
}`,
  };
}
