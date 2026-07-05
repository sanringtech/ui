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

const CHIP_CLASS = 'shrink-0 rounded-[var(--sanring-radius-xs)] px-1.5 py-0.5 text-[11px] font-medium leading-none uppercase tracking-wide';

/**
 * Shared type scale for this page. Every text block below picks one of these
 * instead of leaving weight/line-height to the browser default, so CLI and
 * component entries render on the same rhythm. Every row — notable or not —
 * shares the same size, weight, line-height, and left edge; "notable" is
 * marked by text color alone, so there's no extra border/padding to misalign.
 */
const ENTRY_HEADING_CLASS = 'm-0 text-base font-semibold leading-snug text-[var(--docs-fg)]';
const ROW_CLASS = 'flex items-start gap-2.5 text-sm font-normal leading-relaxed text-[var(--docs-muted)]';
const NOTABLE_ROW_CLASS = 'flex items-start gap-2.5 text-sm font-normal leading-relaxed text-[var(--docs-fg)]';
const INLINE_CODE_CLASS =
  'rounded-[var(--sanring-radius-xs)] bg-[var(--docs-surface-strong)] px-1 py-0.5 font-mono text-[0.9em] text-[var(--docs-fg)]';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Renders `` `code` `` spans as inline <code>, escaping everything else. */
function renderInlineCode(text: string): string {
  return text
    .split(/(`[^`]+`)/g)
    .map((segment) =>
      segment.startsWith('`') && segment.endsWith('`')
        ? `<code class="${INLINE_CODE_CLASS}">${escapeHtml(segment.slice(1, -1))}</code>`
        : escapeHtml(segment),
    )
    .join('');
}

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
                <h3 [class]="entryHeadingClass">v{{ version.version }}</h3>
                <ul class="mt-3 list-none space-y-2 p-0">
                  @for (change of version.changes; track $index) {
                    <li [class]="rowClass">
                      <span [class]="chipClass + ' ' + cliTypeClass[change.type]">{{ change.type }}</span>
                      <span class="min-w-0 flex-1">
                        <span [innerHTML]="renderText(change.text)"></span>
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
          @for (entry of groupedComponentChangelog; track entry.date) {
            <div>
              <h3 [class]="entryHeadingClass">{{ entry.date }}</h3>

              @if (entry.visible.length > 0) {
                <ul class="mt-3 list-none space-y-2.5 p-0">
                  @for (change of entry.visible; track $index) {
                    <li [class]="change.notable ? notableRowClass : rowClass">
                      <span [class]="chipClass + ' ' + componentTypeClass[change.type]">{{ change.type }}</span>
                      <span class="min-w-0 flex-1" [innerHTML]="renderText(change.text)"></span>
                    </li>
                  }
                </ul>
              }

              @if (entry.fixed.length > 0) {
                <details class="mt-3 [&_summary::-webkit-details-marker]:hidden">
                  <summary class="cursor-pointer text-xs font-medium leading-snug text-[var(--docs-muted)] hover:text-[var(--docs-fg)]">
                    {{ i18n.t('changelog.component.otherFixes') }} ({{ entry.fixed.length }})
                  </summary>
                  <ul class="mt-2 list-none space-y-2 p-0">
                    @for (change of entry.fixed; track $index) {
                      <li [class]="rowClass">
                        <span [class]="chipClass + ' ' + componentTypeClass[change.type]">{{ change.type }}</span>
                        <span class="min-w-0 flex-1" [innerHTML]="renderText(change.text)"></span>
                      </li>
                    }
                  </ul>
                </details>
              }
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

  protected readonly groupedComponentChangelog = componentChangelog.map((entry) => ({
    date: entry.date,
    visible: entry.changes.filter((change) => change.notable || change.type !== 'fixed'),
    fixed: entry.changes.filter((change) => change.type === 'fixed' && !change.notable),
  }));
  protected readonly chipClass = CHIP_CLASS;
  protected readonly entryHeadingClass = ENTRY_HEADING_CLASS;
  protected readonly rowClass = ROW_CLASS;
  protected readonly notableRowClass = NOTABLE_ROW_CLASS;
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

  protected renderText(text: string): string {
    return renderInlineCode(text);
  }
}
