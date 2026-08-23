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

const RECENT_CHANGE_LIMIT = 3;

const TYPE_CLASS: Record<ComponentChangeType, string> = {
  added: 'bg-[var(--docs-success-bg)] text-[var(--docs-success-fg)]',
  changed: 'bg-[var(--docs-info-bg)] text-[var(--docs-info-fg)]',
  fixed: 'bg-[var(--docs-warn-bg)] text-[var(--docs-warn-fg)]',
};

const CHIP_CLASS =
  'shrink-0 rounded-[var(--sanring-radius-xs)] px-1.5 py-0.5 text-xs font-medium leading-none uppercase tracking-normal';
const INLINE_CODE_CLASS =
  'break-words rounded-[var(--sanring-radius-xs)] bg-[var(--docs-surface-strong)] px-1 py-0.5 font-mono text-[0.9em] text-[var(--docs-fg)]';

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
        class="mt-16 overflow-hidden rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-border)_86%,transparent)] bg-[color-mix(in_srgb,var(--docs-panel)_76%,transparent)] shadow-[var(--docs-shadow-soft)]"
        [attr.aria-labelledby]="'recent-changes-title'"
      >
        <div
          class="flex min-w-0 flex-wrap items-center justify-between gap-3 border-b border-[var(--docs-border)] bg-[color-mix(in_srgb,var(--docs-elevated)_72%,transparent)] px-3.5 py-3"
        >
          <div class="flex min-w-0 items-center gap-3">
            <span
              class="h-8 w-1 shrink-0 rounded-full bg-[linear-gradient(180deg,var(--docs-accent),var(--docs-accent-alt))]"
              aria-hidden="true"
            ></span>
            <div class="min-w-0">
              <p
                class="m-0 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]"
              >
                {{ i18n.t('component.recentChanges.signal') }}
              </p>
              <h2
                id="recent-changes-title"
                class="m-0 mt-0.5 text-base font-semibold leading-tight tracking-normal text-[var(--docs-fg)]"
              >
                {{ i18n.t('component.recentChanges.title') }}
              </h2>
            </div>
          </div>
          <a
            class="shrink-0 font-mono text-xs font-medium text-[var(--docs-muted)] no-underline transition-colors hover:text-[var(--docs-fg)] focus-visible:rounded-[var(--sanring-radius-xs)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-focus-ring)]"
            routerLink="/changelog"
          >
            {{ i18n.t('component.recentChanges.viewAll') }}
          </a>
        </div>

        <ol
          class="m-0 list-none divide-y divide-[color-mix(in_srgb,var(--docs-border)_82%,transparent)] p-0"
        >
          @for (entry of changes(); track entry.version + '-' + $index) {
            <li
              class="grid min-w-0 gap-x-3 gap-y-2 px-3.5 py-3 sm:grid-cols-[9rem_auto_minmax(0,1fr)] sm:items-baseline"
            >
              <span class="flex min-w-0 items-baseline gap-2">
                <span class="shrink-0 font-mono text-xs font-semibold text-[var(--docs-fg)]"
                  >v{{ entry.version }}</span
                >
                <time
                  class="shrink-0 font-mono text-[10px] text-[var(--docs-muted)]"
                  [attr.datetime]="entry.date"
                  >{{ entry.date }}</time
                >
              </span>
              <span class="flex flex-wrap items-center gap-1.5">
                <span [class]="chipClass + ' ' + typeClass[entry.change.type]">{{
                  entry.change.type
                }}</span>
                @if (entry.change.breaking) {
                  <span
                    [class]="chipClass + ' bg-[var(--docs-error-bg)] text-[var(--docs-error-fg)]'"
                    >BREAKING</span
                  >
                }
              </span>
              <span
                class="min-w-0 text-[13px] leading-5 text-[var(--docs-fg)]"
                [innerHTML]="renderText(entry.change.text)"
              ></span>
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
