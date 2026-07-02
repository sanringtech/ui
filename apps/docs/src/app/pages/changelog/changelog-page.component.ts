import { Component, inject, resource } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageComponent, ComponentPageSectionComponent } from '../../layouts/component-page';
import { CliChangeType, parseCliChangelog } from './cli-changelog';
import { ComponentChangeType, componentChangelog } from './component-changelog';

const CLI_TYPE_CLASS: Record<CliChangeType, string> = {
  major: 'bg-[var(--docs-error-bg)] text-[var(--docs-error-fg)]',
  minor: 'bg-[var(--docs-info-bg)] text-[var(--docs-info-fg)]',
  patch: 'bg-[var(--docs-surface-strong)] text-[var(--docs-muted)]',
};

const COMPONENT_TYPE_CLASS: Record<ComponentChangeType, string> = {
  added: 'bg-[var(--docs-success-bg)] text-[var(--docs-success-fg)]',
  changed: 'bg-[var(--docs-info-bg)] text-[var(--docs-info-fg)]',
  fixed: 'bg-[var(--docs-warn-bg)] text-[var(--docs-warn-fg)]',
};

const CHIP_CLASS = 'shrink-0 rounded-[var(--sanring-radius-xs)] px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide';

@Component({
  selector: 'app-changelog-page',
  imports: [ComponentPageComponent, ComponentPageSectionComponent],
  template: `
    <app-component-page [sections]="sections">
      <header class="border-b border-[var(--docs-border)] pb-10">
        <h1 class="m-0 text-[34px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]">
          {{ i18n.t('sidebar.changelog') }}
        </h1>
        <p class="mb-0 mt-4 max-w-[620px] text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('changelog.page.description') }}
        </p>
      </header>

      <!-- 1. CLI -->
      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('changelog.cli.body') }}
        </p>

        @if (cliChangelog.isLoading()) {
          <p class="mt-6 text-sm text-[var(--docs-muted)]">{{ i18n.t('changelog.cli.loading') }}</p>
        } @else if (cliChangelog.error()) {
          <p class="mt-6 text-sm text-[var(--docs-error)]">{{ i18n.t('changelog.cli.error') }}</p>
        } @else {
          <div class="mt-6 space-y-8">
            @for (version of cliChangelog.value(); track version.version) {
              <div>
                <h3 class="m-0 text-base font-semibold text-[var(--docs-fg)]">v{{ version.version }}</h3>
                <ul class="mt-3 list-none space-y-2 p-0">
                  @for (change of version.changes; track $index) {
                    <li class="flex items-start gap-2.5 text-sm text-[var(--docs-muted)]">
                      <span [class]="chipClass + ' ' + cliTypeClass[change.type]">{{ change.type }}</span>
                      <span class="min-w-0 flex-1">
                        {{ change.text }}
                        @if (change.hash) {
                          <span class="text-[var(--docs-muted)]">({{ change.hash }})</span>
                        }
                      </span>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
        }
      </app-component-page-section>

      <!-- 2. Components -->
      <app-component-page-section [section]="sections[1]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('changelog.component.body') }}
        </p>

        <div class="mt-6 space-y-8">
          @for (entry of componentChangelog; track entry.date) {
            <div>
              <h3 class="m-0 text-base font-semibold text-[var(--docs-fg)]">{{ entry.date }}</h3>
              <ul class="mt-3 list-none space-y-2 p-0">
                @for (change of entry.changes; track $index) {
                  <li class="flex items-start gap-2.5 text-sm text-[var(--docs-muted)]">
                    <span [class]="chipClass + ' ' + componentTypeClass[change.type]">{{ change.type }}</span>
                    <span class="min-w-0 flex-1">{{ change.text }}</span>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class ChangelogPageComponent {
  protected readonly i18n = inject(I18nService);

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'cli', titleKey: 'changelog.cli.title' },
    { id: 'components', titleKey: 'changelog.component.title' },
  ];

  protected readonly componentChangelog = componentChangelog;
  protected readonly chipClass = CHIP_CLASS;
  protected readonly cliTypeClass = CLI_TYPE_CLASS;
  protected readonly componentTypeClass = COMPONENT_TYPE_CLASS;

  protected readonly cliChangelog = resource({
    loader: async () => {
      const response = await fetch('/data/cli-changelog/CHANGELOG.md');
      if (!response.ok) throw new Error(`Failed to load CLI changelog: ${response.status}`);
      const markdown = await response.text();
      return parseCliChangelog(markdown);
    },
  });
}
