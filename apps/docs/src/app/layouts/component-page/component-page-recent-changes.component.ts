import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsComponentId } from '../../navigation/docs-navigation';
import { I18nService } from '../../i18n/i18n.service';
import {
  ComponentChange,
  ComponentChangeType,
  cliVersionChangelog,
} from '../../pages/changelog/component-changelog';

interface ComponentRecentChange {
  version: string;
  date: string;
  change: ComponentChange;
}

const RECENT_CHANGE_LIMIT = 5;

const TYPE_CLASS: Record<ComponentChangeType, string> = {
  added: 'bg-[var(--docs-success-bg)] text-[var(--docs-success-fg)]',
  changed: 'bg-[var(--docs-info-bg)] text-[var(--docs-info-fg)]',
  fixed: 'bg-[var(--docs-warn-bg)] text-[var(--docs-warn-fg)]',
};

const CHIP_CLASS =
  'shrink-0 rounded-[var(--sanring-radius-xs)] px-1.5 py-0.5 text-xs font-medium leading-none uppercase tracking-normal';
const INLINE_CODE_CLASS =
  'rounded-[var(--sanring-radius-xs)] bg-[var(--docs-surface-strong)] px-1 py-0.5 font-mono text-[0.9em] text-[var(--docs-fg)]';

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

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
  selector: 'app-component-page-recent-changes',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (changes().length > 0) {
      <section
        id="recent-changes"
        class="mt-16 rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-border)_82%,transparent)] bg-[color-mix(in_srgb,var(--docs-panel)_72%,transparent)] p-6 shadow-[var(--docs-shadow-soft)] max-[520px]:p-4"
        [attr.aria-labelledby]="'recent-changes-title'"
      >
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="recent-changes-title"
              class="m-0 text-[22px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)] max-[520px]:text-xl"
            >
              {{ i18n.t('component.recentChanges.title') }}
            </h2>
            <p class="mb-0 mt-2 text-sm leading-relaxed text-[var(--docs-muted)]">
              {{ i18n.t('component.recentChanges.description') }}
            </p>
          </div>
          <a
            class="text-sm font-medium text-[var(--docs-muted)] no-underline transition-colors hover:text-[var(--docs-fg)]"
            routerLink="/changelog"
          >
            {{ i18n.t('component.recentChanges.viewAll') }}
          </a>
        </div>

        <ol class="mt-6 list-none space-y-3 p-0">
          @for (entry of changes(); track entry.version + '-' + $index) {
            <li
              class="rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-border)_82%,transparent)] bg-[color-mix(in_srgb,var(--docs-elevated)_58%,transparent)] p-4"
            >
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <span class="font-mono text-sm font-semibold text-[var(--docs-fg)]">
                  v{{ entry.version }}
                </span>
                <time
                  class="text-xs text-[var(--docs-muted)]"
                  [attr.datetime]="entry.date"
                >
                  {{ entry.date }}
                </time>
              </div>
              <div class="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--docs-fg)]">
                <span [class]="chipClass + ' ' + typeClass[entry.change.type]">
                  {{ entry.change.type }}
                </span>
                @if (entry.change.breaking) {
                  <span
                    [class]="chipClass + ' bg-[var(--docs-error-bg)] text-[var(--docs-error-fg)]'"
                  >
                    BREAKING
                  </span>
                }
                <span class="min-w-0 flex-1" [innerHTML]="renderText(entry.change.text)"></span>
              </div>
            </li>
          }
        </ol>
      </section>
    }
  `,
})
export class ComponentPageRecentChangesComponent {
  readonly componentId = input<DocsComponentId | null>(null);

  protected readonly i18n = inject(I18nService);
  protected readonly chipClass = CHIP_CLASS;
  protected readonly typeClass = TYPE_CLASS;

  protected readonly changes = computed<ComponentRecentChange[]>(() => {
    const componentId = this.componentId();
    if (!componentId) return [];

    return cliVersionChangelog
      .flatMap((entry) =>
        entry.changes
          .filter((change) => change.componentIds?.includes(componentId))
          .map((change) => ({ version: entry.version, date: entry.date, change })),
      )
      .slice(0, RECENT_CHANGE_LIMIT);
  });

  protected renderText(text: string): string {
    return renderInlineCode(text);
  }
}
