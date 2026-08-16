import { Component, effect, inject } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { SeoService } from '../../seo/seo.service';
import {
  ComponentPageCodeBlock,
  ComponentPageComponent,
  ComponentPageSectionComponent,
  DocsPageHeaderComponent,
} from '../../layouts/component-page';

const INLINE_CODE_CLASS =
  'rounded-[var(--sanring-radius-xs)] bg-[var(--docs-code)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--docs-fg)]';

@Component({
  selector: 'app-mcp-page',
  imports: [
    ComponentPageCodeBlock,
    ComponentPageComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
  ],
  template: `
    <app-component-page [sections]="sections">
      <app-docs-page-header
        [title]="i18n.t('sidebar.mcpServer')"
        [description]="i18n.t('mcp.page.description')"
        eyebrow="docs / mcp"
      />

      <section class="mb-4 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-panel)] shadow-[var(--docs-shadow-soft)]" aria-label="MCP agent tool map">
        <header class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--docs-border)] px-5 py-4"><div><p class="m-0 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--docs-accent-strong)]">AGENT TOOL MAP</p><p class="m-0 mt-1 text-sm text-[var(--docs-muted)]">Discover first. Plan before anything writes.</p></div><span class="rounded-[var(--sanring-radius-sm)] bg-[var(--docs-success-bg)] px-2 py-1 font-mono text-[11px] text-[var(--docs-success-fg)]">safe by default</span></header>
        <div class="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(220px,0.88fr)]">
          <div class="p-5 sm:p-6"><div class="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[var(--docs-muted)]"><span class="rounded-[var(--sanring-radius-sm)] bg-[var(--docs-surface)] px-2 py-1">read</span><span>→</span><span class="rounded-[var(--sanring-radius-sm)] bg-[var(--docs-surface)] px-2 py-1">plan</span><span>→</span><span class="rounded-[var(--sanring-radius-sm)] bg-[var(--docs-accent)] px-2 py-1 text-[var(--docs-accent-fg)]">write</span></div><div class="mt-5 grid gap-2 sm:grid-cols-3"><div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-3"><p class="m-0 font-mono text-xs text-[var(--docs-accent-strong)]">READ</p><p class="m-0 mt-2 text-sm font-semibold text-[var(--docs-fg)]">list / search / info</p><p class="m-0 mt-1 text-xs leading-5 text-[var(--docs-muted)]">understand the registry</p></div><div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] p-3"><p class="m-0 font-mono text-xs text-[var(--docs-accent-strong)]">PLAN</p><p class="m-0 mt-2 text-sm font-semibold text-[var(--docs-fg)]">preview install</p><p class="m-0 mt-1 text-xs leading-5 text-[var(--docs-muted)]">files and deps first</p></div><div class="rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-accent)_38%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,transparent)] p-3"><p class="m-0 font-mono text-xs text-[var(--docs-accent-strong)]">WRITE</p><p class="m-0 mt-2 text-sm font-semibold text-[var(--docs-fg)]">add component</p><p class="m-0 mt-1 text-xs leading-5 text-[var(--docs-muted)]">only after approval</p></div></div></div>
          <aside class="border-t border-[var(--docs-border)] bg-[var(--docs-code)] p-5 text-[var(--docs-code-fg)] lg:border-l lg:border-t-0 sm:p-6"><p class="m-0 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--docs-accent)]">WRITE BOUNDARY</p><p class="m-0 mt-4 text-sm leading-6 text-[color-mix(in_srgb,var(--docs-code-fg)_76%,transparent)]">The agent can inspect and plan freely. File changes stay behind an explicit install step.</p><div class="mt-5 grid gap-2 font-mono text-xs"><div class="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--docs-code-fg)_16%,transparent)] pb-2"><span>registry</span><span class="text-[var(--docs-success)]">read</span></div><div class="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--docs-code-fg)_16%,transparent)] pb-2"><span>plan</span><span class="text-[var(--docs-success)]">safe</span></div><div class="flex items-center justify-between"><span>project files</span><span class="text-[var(--docs-accent)]">explicit</span></div></div></aside>
        </div>
      </section>

      <!-- 1. Overview -->
      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('mcp.overview.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="commands.start" language="bash" />
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
        <app-component-page-code-block
          class="mt-6"
          [code]="commands.claudeConfig"
          language="json"
        />
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
