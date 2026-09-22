import { Component, inject, Input } from '@angular/core';
import { ComponentPageApiRow } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-component-page-api-table',
  standalone: true,
  template: `
    <div
      class="docs-panel mb-2 flex min-w-0 flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs"
    >
      <span class="docs-eyebrow">
        {{ i18n.t('docs.api.surface') }}
      </span>
      <span class="text-[var(--docs-muted)]"
        >{{ rows.length }} {{ i18n.t('docs.api.members') }}</span
      >
    </div>

    <div
      class="docs-panel hidden overflow-hidden md:block"
    >
      <table class="w-full table-fixed border-collapse text-left text-[13px]">
        <caption class="sr-only">
          {{
            i18n.t('docs.api.caption')
          }}
        </caption>
        <thead
          class="bg-[var(--docs-surface)] text-[var(--docs-muted)]"
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
          @for (row of rows; track row.property; let last = $last) {
            <tr
              [class.border-b]="!last"
              class="group border-[var(--docs-border)] transition-colors hover:bg-[var(--docs-surface)]"
            >
              <td class="break-words px-3 py-2.5 align-top font-mono text-[var(--docs-fg)]">
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
      @for (row of rows; track row.property) {
        <article class="docs-panel overflow-hidden">
          <div
            class="flex min-w-0 items-center gap-2 border-b border-[var(--docs-border)] bg-[var(--docs-surface)] px-3 py-2.5"
          >
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
}
