import { Component, effect, inject, signal } from '@angular/core';
import {
  TimelineContentDirective,
  TimelineDirective,
  TimelineItemDirective,
  TimelineSeparatorDirective,
} from '@sanring/ui';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { SeoService } from '../../seo/seo.service';
import { ComponentPageComponent, ComponentPageSectionComponent } from '../../layouts/component-page';
import { ComponentChangeType, cliVersionChangelog, isPatch } from './component-changelog';

const COMPONENT_TYPE_CLASS: Record<ComponentChangeType, string> = {
  added: 'bg-[var(--docs-success-bg)] text-[var(--docs-success-fg)]',
  changed: 'bg-[var(--docs-info-bg)] text-[var(--docs-info-fg)]',
  fixed: 'bg-[var(--docs-warn-bg)] text-[var(--docs-warn-fg)]',
};

const CHIP_CLASS =
  'shrink-0 rounded-[var(--sanring-radius-xs)] px-1.5 py-0.5 text-[11px] font-medium leading-none uppercase tracking-wide';

const ROW_CLASS =
  'flex items-start gap-2.5 text-sm font-normal leading-relaxed text-[var(--docs-muted)]';
const NOTABLE_ROW_CLASS =
  'flex items-start gap-2.5 text-sm font-normal leading-relaxed text-[var(--docs-fg)]';
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
  selector: 'app-changelog-page',
  imports: [
    ComponentPageComponent,
    ComponentPageSectionComponent,
    TimelineContentDirective,
    TimelineDirective,
    TimelineItemDirective,
    TimelineSeparatorDirective,
  ],
  template: `
    <app-component-page [sections]="sections">
      <header class="border-b border-[var(--docs-border)] pb-10">
        <h1
          class="m-0 text-[34px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]"
        >
          {{ i18n.t('sidebar.changelog') }}
        </h1>
        <p class="mb-0 mt-4 max-w-[620px] text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('changelog.page.description') }}
        </p>
      </header>

      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('changelog.component.body') }}
        </p>

        <ul sanringTimeline class="mt-8 gap-0">
          @for (entry of versionedChangelog; track entry.version; let last = $last) {
            <li sanringTimelineItem class="gap-5">
              <!-- Timeline separator: accent dot for minor, muted for patch -->
              <span sanringTimelineSeparator>
                @if (entry.isPatch) {
                  <span
                    class="grid min-h-7 min-w-7 shrink-0 place-items-center rounded-full border border-[var(--docs-border)] bg-[var(--docs-panel)]"
                  >
                    <span class="size-2 rounded-full bg-[var(--docs-muted)]"></span>
                  </span>
                } @else {
                  <span
                    class="grid min-h-9 min-w-9 shrink-0 place-items-center rounded-full border border-[var(--docs-border-strong)] bg-[var(--docs-panel)] shadow-sm"
                  >
                    <span class="size-2.5 rounded-full bg-[var(--docs-accent-strong)]"></span>
                  </span>
                }
                @if (!last) {
                  <span class="w-px flex-1 bg-[var(--docs-border)]"></span>
                }
              </span>

              <!-- Version card -->
              <section sanringTimelineContent [class]="entry.isPatch ? 'pb-6' : 'pb-10'">
                <article
                  [class]="
                    'rounded-[var(--sanring-radius)] border bg-[var(--docs-panel)] p-5 shadow-sm transition-[border-color,box-shadow] hover:shadow-md ' +
                    (entry.isPatch
                      ? 'border-[var(--docs-border)] hover:border-[var(--docs-border)]'
                      : 'border-[var(--docs-border)] hover:border-[var(--docs-border-strong)]')
                  "
                >
                  <header
                    class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--docs-border)] pb-4"
                  >
                    <div class="flex items-baseline gap-3">
                      <span
                        [class]="
                          'font-mono font-semibold leading-none ' +
                          (entry.isPatch
                            ? 'text-sm text-[var(--docs-muted)]'
                            : 'text-base text-[var(--docs-fg)]')
                        "
                      >
                        v{{ entry.version }}
                      </span>
                      <time
                        class="text-xs font-normal leading-none text-[var(--docs-muted)]"
                        [attr.datetime]="entry.date"
                      >
                        {{ entry.date }}
                      </time>
                    </div>
                    <span class="text-xs font-medium leading-none text-[var(--docs-muted)]">
                      {{ entry.changes.length }}
                      {{ i18n.t('changelog.component.changeCount') }}
                    </span>
                  </header>

                  @if (entry.visible.length > 0) {
                    <ul class="mt-4 list-none space-y-2.5 p-0">
                      @for (change of entry.visible; track $index) {
                        <li [class]="change.notable ? notableRowClass : rowClass">
                          <span [class]="chipClass + ' ' + componentTypeClass[change.type]">{{
                            change.type
                          }}</span>
                          @if (change.breaking) {
                            <span
                              [class]="chipClass + ' bg-[var(--docs-danger-bg,#fee2e2)] text-[var(--docs-danger-fg,#b91c1c)]'"
                            >BREAKING</span>
                          }
                          <span
                            class="min-w-0 flex-1"
                            [innerHTML]="renderText(change.text)"
                          ></span>
                        </li>
                      }
                    </ul>
                  }

                  @if (entry.collapsed.length > 0) {
                    <div class="mt-4 border-t border-[var(--docs-border)] pt-3">
                      <button
                        type="button"
                        class="inline-flex cursor-pointer items-center gap-2 rounded-[var(--sanring-radius-xs)] text-xs font-medium leading-snug text-[var(--docs-muted)] transition-colors hover:text-[var(--docs-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--docs-border-strong)]"
                        [attr.aria-expanded]="isExpanded(entry.version)"
                        [attr.aria-controls]="'changelog-extra-' + entry.version"
                        (click)="toggleExpanded(entry.version)"
                      >
                        <span>
                          {{ i18n.t('changelog.component.otherFixes') }} ({{
                            entry.collapsed.length
                          }})
                        </span>
                        <span
                          [class]="collapseChevronClass(entry.version)"
                          aria-hidden="true"
                        >
                          v
                        </span>
                      </button>

                      <div
                        [class]="collapsePanelClass(entry.version)"
                        [id]="'changelog-extra-' + entry.version"
                      >
                        <div class="min-h-0">
                          <ul class="mt-3 list-none space-y-2 p-0">
                            @for (change of entry.collapsed; track $index) {
                              <li [class]="rowClass">
                                <span [class]="chipClass + ' ' + componentTypeClass[change.type]">{{
                                  change.type
                                }}</span>
                                @if (change.breaking) {
                                  <span
                                    [class]="chipClass + ' bg-[var(--docs-danger-bg,#fee2e2)] text-[var(--docs-danger-fg,#b91c1c)]'"
                                  >BREAKING</span>
                                }
                                <span
                                  class="min-w-0 flex-1"
                                  [innerHTML]="renderText(change.text)"
                                ></span>
                              </li>
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  }
                </article>
              </section>
            </li>
          }
        </ul>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class ChangelogPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  private readonly expandedEntries = signal<ReadonlySet<string>>(new Set());

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t('sidebar.changelog'),
        description: this.i18n.t('changelog.page.description'),
      });
    });
  }

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'releases', titleKey: 'changelog.component.title' },
  ];

  protected readonly versionedChangelog = cliVersionChangelog.map((entry) => {
    const patch = isPatch(entry.version);
    // patches: show all (usually 1-2 items); minor releases: notable first, rest collapse
    const visible = patch
      ? entry.changes
      : entry.changes.filter((c) => c.notable);
    const collapsed = patch ? [] : entry.changes.filter((c) => !c.notable);
    return { ...entry, isPatch: patch, visible, collapsed };
  });

  protected readonly chipClass = CHIP_CLASS;
  protected readonly rowClass = ROW_CLASS;
  protected readonly notableRowClass = NOTABLE_ROW_CLASS;
  protected readonly componentTypeClass = COMPONENT_TYPE_CLASS;

  protected isExpanded(version: string): boolean {
    return this.expandedEntries().has(version);
  }

  protected toggleExpanded(version: string) {
    this.expandedEntries.update((current) => {
      const next = new Set(current);
      if (next.has(version)) {
        next.delete(version);
      } else {
        next.add(version);
      }
      return next;
    });
  }

  protected collapseChevronClass(version: string): string {
    return [
      'text-[10px] transition-transform duration-300 ease-out',
      this.isExpanded(version) ? 'rotate-180' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  protected collapsePanelClass(version: string): string {
    return [
      'grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-300 ease-out',
      this.isExpanded(version)
        ? 'grid-rows-[1fr] translate-y-0 opacity-100'
        : 'grid-rows-[0fr] -translate-y-1 opacity-0',
    ].join(' ');
  }

  protected renderText(text: string): string {
    return renderInlineCode(text);
  }
}
