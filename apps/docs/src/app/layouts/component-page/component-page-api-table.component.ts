import { Component, inject, Input } from '@angular/core';
import { ComponentPageApiRow } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-component-page-api-table',
  standalone: true,
  template: `
    <div
      class="mb-2 flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-[var(--sanring-radius-sm)] border border-[color-mix(in_srgb,var(--docs-border)_80%,transparent)] bg-[color-mix(in_srgb,var(--docs-elevated)_68%,transparent)] px-3 py-2 font-mono text-xs"
    >
      <span
        class="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.08em] text-[var(--docs-fg)]"
      >
        <span class="size-1.5 rounded-full bg-[var(--docs-accent)]" aria-hidden="true"></span>
        {{ i18n.t('docs.api.surface') }}
      </span>
      <span class="text-[var(--docs-muted)]"
        >{{ rows.length }} {{ i18n.t('docs.api.members') }}</span
      >
    </div>

    <div
      class="hidden overflow-hidden rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-border)_86%,transparent)] bg-[color-mix(in_srgb,var(--docs-panel)_78%,transparent)] shadow-[var(--docs-shadow-soft)] md:block"
    >
      <table class="w-full table-fixed border-collapse text-left text-[13px]">
        <caption class="sr-only">
          {{
            i18n.t('docs.api.caption')
          }}
        </caption>
        <thead
          class="bg-[color-mix(in_srgb,var(--docs-elevated)_86%,transparent)] text-[var(--docs-muted)]"
        >
          <tr>
            <th class="w-[22%] border-b border-[var(--docs-border)] px-3 py-2 font-medium">
              {{ i18n.t('docs.api.property') }}
            </th>
            <th class="w-[28%] border-b border-[var(--docs-border)] px-3 py-2 font-medium">
              {{ i18n.t('docs.api.type') }}
            </th>
            <th class="w-[15%] border-b border-[var(--docs-border)] px-3 py-2 font-medium">
              {{ i18n.t('docs.api.default') }}
            </th>
            <th class="border-b border-[var(--docs-border)] px-3 py-2 font-medium">
              {{ i18n.t('docs.api.description') }}
            </th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row.property; let last = $last; let index = $index) {
            <tr
              [class.border-b]="!last"
              class="group border-[var(--docs-border)] transition-colors hover:bg-[color-mix(in_srgb,var(--docs-elevated)_46%,transparent)]"
            >
              <td class="break-words px-3 py-2.5 align-top font-mono text-[var(--docs-fg)]">
                <span class="mr-2 text-[10px] text-[var(--docs-accent-strong)]">{{
                  rowNumber(index)
                }}</span>
                <span class="font-semibold">{{ row.property }}</span>
              </td>
              <td class="break-words px-3 py-2.5 align-top">
                <code
                  class="rounded-[var(--sanring-radius-xs)] bg-[var(--docs-surface-strong)] px-1.5 py-0.5 font-mono text-[12px] leading-5 text-[var(--docs-fg)]"
                  >{{ row.type }}</code
                >
              </td>
              <td class="break-words px-3 py-2.5 align-top">
                <code class="font-mono text-[12px] leading-5 text-[var(--docs-muted)]">{{
                  row.defaultValue
                }}</code>
              </td>
              <td class="px-3 py-2.5 align-top leading-5 text-[var(--docs-muted)]">
                {{ i18n.t(row.descriptionKey) }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="grid gap-3 md:hidden">
      @for (row of rows; track row.property; let index = $index) {
        <article
          class="overflow-hidden rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-border)_86%,transparent)] bg-[color-mix(in_srgb,var(--docs-panel)_86%,transparent)] shadow-sm"
        >
          <div
            class="flex min-w-0 items-center gap-2 border-b border-[var(--docs-border)] bg-[color-mix(in_srgb,var(--docs-elevated)_66%,transparent)] px-3 py-2.5"
          >
            <span class="font-mono text-[10px] text-[var(--docs-accent-strong)]">{{
              rowNumber(index)
            }}</span>
            <p
              class="m-0 min-w-0 break-words font-mono text-sm font-semibold text-[var(--docs-fg)]"
            >
              {{ row.property }}
            </p>
          </div>

          <dl class="m-0 grid grid-cols-2 gap-x-3 gap-y-4 p-3">
            <div class="min-w-0">
              <dt class="mb-1 text-xs font-medium uppercase text-[var(--docs-muted)]">
                {{ i18n.t('docs.api.type') }}
              </dt>
              <dd
                class="m-0 min-w-0 break-words font-mono text-[13px] leading-5 text-[var(--docs-fg)]"
              >
                {{ row.type }}
              </dd>
            </div>

            <div class="min-w-0">
              <dt class="mb-1 text-xs font-medium uppercase text-[var(--docs-muted)]">
                {{ i18n.t('docs.api.default') }}
              </dt>
              <dd
                class="m-0 min-w-0 break-words font-mono text-[13px] leading-5 text-[var(--docs-fg)]"
              >
                {{ row.defaultValue }}
              </dd>
            </div>

            <div class="col-span-2 min-w-0 border-t border-[var(--docs-border)] pt-3">
              <dt class="mb-1 text-xs font-medium uppercase text-[var(--docs-muted)]">
                {{ i18n.t('docs.api.description') }}
              </dt>
              <dd class="m-0 text-sm leading-6 text-[var(--docs-muted)]">
                {{ i18n.t(row.descriptionKey) }}
              </dd>
            </div>
          </dl>
        </article>
      }
    </div>
  `,
})
export class ComponentPageApiTableComponent {
  @Input({ required: true }) rows!: readonly ComponentPageApiRow[];
  protected readonly i18n = inject(I18nService);

  protected rowNumber(index: number) {
    return String(index + 1).padStart(2, '0');
  }
}
