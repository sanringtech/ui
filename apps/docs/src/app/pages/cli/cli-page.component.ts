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
  selector: 'app-cli-page',
  imports: [
    ComponentPageCodeBlock,
    ComponentPageComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
  ],
  template: `
    <app-component-page [sections]="sections">
      <app-docs-page-header
        [title]="i18n.t('sidebar.cli')"
        [description]="i18n.t('cli.page.description')"
        eyebrow="docs / cli"
      />

      <section class="mb-4 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-code)] text-[var(--docs-code-fg)] shadow-[var(--docs-shadow-soft)]" aria-label="CLI workflow overview">
        <header class="flex flex-wrap items-center justify-between gap-3 border-b border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] px-5 py-4">
          <div><p class="m-0 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--docs-accent)]">CLI WORKFLOW</p><p class="m-0 mt-1 text-sm text-[color-mix(in_srgb,var(--docs-code-fg)_62%,transparent)]">Move from intent to a reviewed local change.</p></div>
          <span class="rounded-[var(--sanring-radius-sm)] border border-[color-mix(in_srgb,var(--docs-code-fg)_22%,transparent)] px-2 py-1 font-mono text-[11px] text-[color-mix(in_srgb,var(--docs-code-fg)_68%,transparent)]">dry-run safe</span>
        </header>
        <div class="grid lg:grid-cols-[minmax(190px,0.72fr)_minmax(0,1.28fr)]">
          <nav class="border-b border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] p-4 lg:border-b-0 lg:border-r" aria-label="CLI command groups">
            <p class="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[color-mix(in_srgb,var(--docs-code-fg)_48%,transparent)]">COMMAND GROUPS</p>
            <div class="mt-3 grid gap-1.5">
              @for (group of commandGroups; track group.command; let first = $first) {
                <div [class]="first ? 'rounded-[var(--sanring-radius-sm)] bg-[var(--docs-accent)] px-3 py-2.5 text-[var(--docs-accent-fg)]' : 'rounded-[var(--sanring-radius-sm)] px-3 py-2.5 text-[color-mix(in_srgb,var(--docs-code-fg)_68%,transparent)]'">
                  <div class="flex items-center justify-between gap-3 font-mono text-xs"><span>{{ group.command }}</span><span>{{ group.index }}</span></div>
                  <p class="m-0 mt-1 text-[11px] leading-4 opacity-75">{{ group.description }}</p>
                </div>
              }
            </div>
          </nav>
          <div class="min-w-0 p-4 sm:p-5">
            <div class="relative mb-4 grid grid-cols-4 gap-2" aria-label="CLI process flow">
              <div class="absolute left-[12.5%] right-[12.5%] top-3 border-t border-dashed border-[color-mix(in_srgb,var(--docs-code-fg)_24%,transparent)]" aria-hidden="true"></div>
              @for (step of workflowSteps; track step.index) {
                <div class="relative z-10 text-center"><span class="mx-auto grid size-6 place-items-center rounded-full border border-[var(--docs-accent)] bg-[var(--docs-code)] font-mono text-[10px] text-[var(--docs-accent)]">{{ step.index }}</span><p class="m-0 mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[color-mix(in_srgb,var(--docs-code-fg)_72%,transparent)]">{{ step.label }}</p></div>
              }
            </div>
            <div class="flex items-center justify-between gap-3 rounded-t-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] bg-[color-mix(in_srgb,var(--docs-code-fg)_5%,transparent)] px-3 py-2 font-mono text-[11px] text-[color-mix(in_srgb,var(--docs-code-fg)_58%,transparent)]"><span>~/sanring-app</span><span>terminal</span></div>
            <div class="border-x border-b border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] p-4 font-mono text-xs leading-6 sm:p-5"><p class="m-0"><span class="text-[var(--docs-accent)]">$</span> sanring add button --dry-run</p><p class="m-0 mt-3 text-[color-mix(in_srgb,var(--docs-code-fg)_58%,transparent)]">resolve component + shared dependencies</p><div class="mt-4 grid gap-2 border-t border-[color-mix(in_srgb,var(--docs-code-fg)_14%,transparent)] pt-3 text-[color-mix(in_srgb,var(--docs-code-fg)_78%,transparent)]"><p class="m-0"><span class="text-[var(--docs-success)]">✓</span> button/button.directive.ts</p><p class="m-0"><span class="text-[var(--docs-success)]">✓</span> shared/utils.ts</p><p class="m-0"><span class="text-[var(--docs-accent)]">→</span> no files written</p></div></div>
            <div class="mt-3 grid gap-2 sm:grid-cols-3"><div class="rounded-[var(--sanring-radius-sm)] border border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] px-3 py-2.5"><p class="m-0 font-mono text-[10px] uppercase text-[color-mix(in_srgb,var(--docs-code-fg)_52%,transparent)]">exit 0</p><p class="m-0 mt-1 text-xs text-[color-mix(in_srgb,var(--docs-code-fg)_76%,transparent)]">ready to apply</p></div><div class="rounded-[var(--sanring-radius-sm)] border border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] px-3 py-2.5"><p class="m-0 font-mono text-[10px] uppercase text-[color-mix(in_srgb,var(--docs-code-fg)_52%,transparent)]">dry-run</p><p class="m-0 mt-1 text-xs text-[color-mix(in_srgb,var(--docs-code-fg)_76%,transparent)]">no writes</p></div><div class="rounded-[var(--sanring-radius-sm)] border border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] px-3 py-2.5"><p class="m-0 font-mono text-[10px] uppercase text-[color-mix(in_srgb,var(--docs-code-fg)_52%,transparent)]">diff</p><p class="m-0 mt-1 text-xs text-[color-mix(in_srgb,var(--docs-code-fg)_76%,transparent)]">review first</p></div></div>
          </div>
        </div>
      </section>

      <!-- 1. Overview -->
      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.overview.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="commands.overview" language="bash" />
      </app-component-page-section>

      <!-- 2. init -->
      <app-component-page-section [section]="sections[1]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.init.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="commands.init" language="bash" />
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">-p, --path &lt;path&gt;</code>
            &mdash; component destination path (default:
            <code [class]="inlineCodeClass">src/app/components/ui</code>)
          </li>
          <li>
            <code [class]="inlineCodeClass">-y, --yes</code>
            &mdash; accept all defaults without prompting
          </li>
          <li>
            <code [class]="inlineCodeClass">-f, --force</code>
            &mdash; overwrite an existing theme file with the defaults
          </li>
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path)
          </li>
        </ul>
      </app-component-page-section>

      <!-- 3. add -->
      <app-component-page-section [section]="sections[2]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.add.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="commands.add" language="bash" />
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">-p, --path &lt;path&gt;</code>
            &mdash; destination path relative to cwd
          </li>
          <li>
            <code [class]="inlineCodeClass">-s, --shared-path &lt;path&gt;</code>
            &mdash; destination for shared utilities (default:
            <code [class]="inlineCodeClass">&lt;path&gt;/shared</code>)
          </li>
          <li>
            <code [class]="inlineCodeClass">-f, --force</code>
            &mdash; overwrite existing files after confirmation
          </li>
          <li>
            <code [class]="inlineCodeClass">-y, --yes</code>
            &mdash; skip overwrite confirmation when using
            <code [class]="inlineCodeClass">--force</code>
          </li>
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path)
          </li>
          <li>
            <code [class]="inlineCodeClass">--dry-run</code>
            &mdash; preview changes without writing files
          </li>
          <li>
            <code [class]="inlineCodeClass">--diff</code>
            &mdash; show line-by-line diff against local files without installing
          </li>
          <li>
            <code [class]="inlineCodeClass">--view</code>
            &mdash; print raw registry file content without writing anything
          </li>
        </ul>
      </app-component-page-section>

      <!-- 4. remove -->
      <app-component-page-section [section]="sections[3]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.remove.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="commands.remove" language="bash" />
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">-p, --path &lt;path&gt;</code>
            &mdash; destination path relative to cwd
          </li>
          <li>
            <code [class]="inlineCodeClass">-y, --yes</code>
            &mdash; skip the delete confirmation
          </li>
          <li>
            <code [class]="inlineCodeClass">-f, --force</code>
            &mdash; remove even if another installed component still depends on it
          </li>
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path)
          </li>
        </ul>
      </app-component-page-section>

      <!-- 5. info -->
      <app-component-page-section [section]="sections[4]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.info.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="commands.info" language="bash" />
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">-p, --path &lt;path&gt;</code>
            &mdash; component path relative to cwd
          </li>
          <li>
            <code [class]="inlineCodeClass">--json</code>
            &mdash; output as JSON (useful for CI and coding agents)
          </li>
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path; only used in component mode)
          </li>
        </ul>
      </app-component-page-section>

      <!-- 6. diff -->
      <app-component-page-section [section]="sections[5]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.diff.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="commands.diff" language="bash" />
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">-p, --path &lt;path&gt;</code>
            &mdash; destination path relative to cwd
          </li>
          <li>
            <code [class]="inlineCodeClass">--exit-code</code>
            &mdash; exit 1 when any file differs from the registry (CI gate)
          </li>
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path)
          </li>
        </ul>
      </app-component-page-section>

      <!-- 7. update -->
      <app-component-page-section [section]="sections[6]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.update.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="commands.update" language="bash" />
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">-p, --path &lt;path&gt;</code>
            &mdash; destination path relative to cwd
          </li>
          <li>
            <code [class]="inlineCodeClass">-y, --yes</code>
            &mdash; apply every change without prompting
          </li>
          <li>
            <code [class]="inlineCodeClass">--dry-run</code>
            &mdash; show what would change without writing anything
          </li>
          <li>
            <code [class]="inlineCodeClass">--trust</code>
            &mdash; treat files with no recorded baseline as untouched — use for installs predating
            v0.9.0 hash tracking
          </li>
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path)
          </li>
        </ul>
      </app-component-page-section>

      <!-- 8. list -->
      <app-component-page-section [section]="sections[7]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.list.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="commands.list" language="bash" />
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">-i, --installed</code>
            &mdash; only show components already installed in the current project
          </li>
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path)
          </li>
        </ul>
      </app-component-page-section>

      <!-- 9. search -->
      <app-component-page-section [section]="sections[8]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.search.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="commands.search" language="bash" />
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">-p, --path &lt;path&gt;</code>
            &mdash; component path used to detect install status
          </li>
          <li>
            <code [class]="inlineCodeClass">--registry &lt;url&gt;</code>
            &mdash; custom registry URL
          </li>
        </ul>
      </app-component-page-section>

      <!-- 10. doctor -->
      <app-component-page-section [section]="sections[9]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.doctor.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="commands.doctor" language="bash" />
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">--offline</code>
            &mdash; skip the registry connectivity check
          </li>
          <li>
            <code [class]="inlineCodeClass">-p, --path &lt;path&gt;</code>
            &mdash; component path relative to cwd
          </li>
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path)
          </li>
        </ul>
      </app-component-page-section>

      <!-- 11. Requirements -->
      <app-component-page-section [section]="sections[10]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.requirements.body') }}
        </p>
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">Node.js &gt;= 18</code>
          </li>
          <li>
            <code [class]="inlineCodeClass">Angular &gt;= 22</code>
          </li>
          <li>
            <code [class]="inlineCodeClass">Tailwind CSS v4</code>
            &mdash; configured in your application stylesheet
          </li>
        </ul>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class CliPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly inlineCodeClass = INLINE_CODE_CLASS;
  protected readonly commandGroups = [
    { index: '01', command: 'init', description: 'create the local theme' },
    { index: '02', command: 'add', description: 'install source files' },
    { index: '03', command: 'inspect', description: 'read project context' },
    { index: '04', command: 'verify', description: 'diff and diagnose' },
  ];

  protected readonly workflowSteps = [
    { index: '01', label: 'intent' },
    { index: '02', label: 'resolve' },
    { index: '03', label: 'preview' },
    { index: '04', label: 'apply' },
  ];

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t('sidebar.cli'),
        description: this.i18n.t('cli.page.description'),
      });
    });
  }

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'overview', titleKey: 'cli.overview.title' },
    { id: 'init', titleKey: 'cli.init.title' },
    { id: 'add', titleKey: 'cli.add.title' },
    { id: 'remove', titleKey: 'cli.remove.title' },
    { id: 'info', titleKey: 'cli.info.title' },
    { id: 'diff', titleKey: 'cli.diff.title' },
    { id: 'update', titleKey: 'cli.update.title' },
    { id: 'list', titleKey: 'cli.list.title' },
    { id: 'search', titleKey: 'cli.search.title' },
    { id: 'doctor', titleKey: 'cli.doctor.title' },
    { id: 'requirements', titleKey: 'cli.requirements.title' },
  ];

  protected readonly commands = {
    overview: `npx @sanring/cli@latest init
npx @sanring/cli@latest add button
npx @sanring/cli@latest search button
npx @sanring/cli@latest doctor`,
    init: `npx @sanring/cli@latest init`,
    add: `npx @sanring/cli@latest add button

# add multiple components at once
npx @sanring/cli@latest add button badge

# preview what would change, without writing any files
npx @sanring/cli@latest add button --dry-run

# see line-by-line diff against local files before installing
npx @sanring/cli@latest add button --diff

# print raw registry content without writing anything
npx @sanring/cli@latest add button --view`,
    remove: `npx @sanring/cli@latest remove button

# remove multiple components at once
npx @sanring/cli@latest remove tag badge`,
    info: `# project context — no network call
npx @sanring/cli@latest info

# component details
npx @sanring/cli@latest info select

# machine-readable output
npx @sanring/cli@latest info --json`,
    diff: `# check everything installed
npx @sanring/cli@latest diff

# check just one component
npx @sanring/cli@latest diff button

# exit 1 when any file differs (CI gate)
npx @sanring/cli@latest diff --exit-code`,
    update: `# check + prompt for everything installed
npx @sanring/cli@latest update

# just one component
npx @sanring/cli@latest update accordion

# apply every change without prompting
npx @sanring/cli@latest update --yes

# for projects installed before v0.9.0 (no hash baseline)
npx @sanring/cli@latest update --trust`,
    list: `npx @sanring/cli@latest list
npx @sanring/cli@latest ls

# only show installed components
npx @sanring/cli@latest list --installed`,
    search: `npx @sanring/cli@latest search button

# search by description keyword
npx @sanring/cli@latest search "date"`,
    doctor: `npx @sanring/cli@latest doctor

# skip registry network check
npx @sanring/cli@latest doctor --offline`,
  };
}
