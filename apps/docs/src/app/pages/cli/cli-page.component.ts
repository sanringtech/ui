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
  selector: 'app-cli-page',
  imports: [ComponentPageCodeBlock, ComponentPageComponent, ComponentPageSectionComponent],
  template: `
    <app-component-page [sections]="sections">
      <header class="border-b border-[var(--docs-border)] pb-10">
        <h1 class="m-0 text-[34px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]">
          {{ i18n.t('sidebar.cli') }}
        </h1>
        <p class="mb-0 mt-4 max-w-[620px] text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.page.description') }}
        </p>
      </header>

      <!-- 1. Overview -->
      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.overview.body') }}
        </p>
        <div class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="commands.overview" language="bash" />
        </div>
      </app-component-page-section>

      <!-- 2. init -->
      <app-component-page-section [section]="sections[1]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.init.body') }}
        </p>
        <div class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="commands.init" language="bash" />
        </div>
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">-p, --path &lt;path&gt;</code>
            &mdash; component destination path (default: <code [class]="inlineCodeClass">src/app/components/ui</code>)
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
        <div class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="commands.add" language="bash" />
        </div>
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">-p, --path &lt;path&gt;</code>
            &mdash; destination path relative to cwd
          </li>
          <li>
            <code [class]="inlineCodeClass">-s, --shared-path &lt;path&gt;</code>
            &mdash; destination for shared utilities (default: <code [class]="inlineCodeClass">&lt;path&gt;/shared</code>)
          </li>
          <li>
            <code [class]="inlineCodeClass">-f, --force</code>
            &mdash; overwrite existing files after confirmation
          </li>
          <li>
            <code [class]="inlineCodeClass">-y, --yes</code>
            &mdash; skip overwrite confirmation when using <code [class]="inlineCodeClass">--force</code>
          </li>
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path)
          </li>
          <li>
            <code [class]="inlineCodeClass">--dry-run</code>
            &mdash; preview changes without writing files
          </li>
        </ul>
      </app-component-page-section>

      <!-- 4. diff -->
      <app-component-page-section [section]="sections[3]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.diff.body') }}
        </p>
        <div class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="commands.diff" language="bash" />
        </div>
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">-p, --path &lt;path&gt;</code>
            &mdash; destination path relative to cwd
          </li>
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path)
          </li>
        </ul>
      </app-component-page-section>

      <!-- 5. list -->
      <app-component-page-section [section]="sections[4]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('cli.list.body') }}
        </p>
        <div class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <app-component-page-code-block [code]="commands.list" language="bash" />
        </div>
        <ul class="mt-4 list-none space-y-2 p-0 text-sm text-[var(--docs-muted)]">
          <li>
            <code [class]="inlineCodeClass">--registry &lt;source&gt;</code>
            &mdash; custom registry (URL or local path)
          </li>
        </ul>
      </app-component-page-section>

      <!-- 6. Requirements -->
      <app-component-page-section [section]="sections[5]">
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
    { id: 'diff', titleKey: 'cli.diff.title' },
    { id: 'list', titleKey: 'cli.list.title' },
    { id: 'requirements', titleKey: 'cli.requirements.title' },
  ];

  protected readonly commands = {
    overview: `npx @sanring/cli@latest init
npx @sanring/cli@latest add calendar`,
    init: `npx @sanring/cli@latest init`,
    add: `npx @sanring/cli@latest add calendar

# add multiple components at once
npx @sanring/cli@latest add calendar dialog

# component dependencies are added automatically
npx @sanring/cli@latest add calendar

# preview what would change, without writing any files
npx @sanring/cli@latest add calendar --dry-run`,
    diff: `# check everything installed
npx @sanring/cli@latest diff

# check just one component
npx @sanring/cli@latest diff button`,
    list: `npx @sanring/cli@latest list
npx @sanring/cli@latest ls`,
  };
}
