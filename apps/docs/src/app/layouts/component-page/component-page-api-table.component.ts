import { Component, inject, Input } from '@angular/core';
import { ComponentPageApiRow } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-component-page-api-table',
  standalone: true,
  template: `
    <div class="hidden overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)] md:block">
      <table class="w-full table-fixed border-collapse text-left text-sm">
        <thead class="bg-[var(--docs-elevated)] text-[var(--docs-muted)]">
          <tr>
            <th class="w-[22%] border-b border-[var(--docs-border)] px-4 py-3 font-medium">
              {{ i18n.t('docs.api.property') }}
            </th>
            <th class="w-[24%] border-b border-[var(--docs-border)] px-4 py-3 font-medium">
              {{ i18n.t('docs.api.type') }}
            </th>
            <th class="w-[20%] border-b border-[var(--docs-border)] px-4 py-3 font-medium">
              {{ i18n.t('docs.api.default') }}
            </th>
            <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
              {{ i18n.t('docs.api.description') }}
            </th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row.property; let last = $last) {
            <tr [class.border-b]="!last" class="border-[var(--docs-border)]">
              <td class="break-words px-4 py-3 font-mono text-[var(--docs-fg)]">{{ row.property }}</td>
              <td class="break-words px-4 py-3 font-mono text-[var(--docs-muted)]">{{ row.type }}</td>
              <td class="break-words px-4 py-3 font-mono text-[var(--docs-muted)]">{{ row.defaultValue }}</td>
              <td class="px-4 py-3 leading-6 text-[var(--docs-muted)]">{{ i18n.t(row.descriptionKey) }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="grid gap-3 md:hidden">
      @for (row of rows; track row.property) {
        <article class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-4">
          <div class="mb-3">
            <p class="mb-1 text-xs font-medium uppercase text-[var(--docs-muted)]">
              {{ i18n.t('docs.api.property') }}
            </p>
            <p class="break-words font-mono text-sm text-[var(--docs-fg)]">{{ row.property }}</p>
          </div>

          <dl class="grid gap-3">
            <div>
              <dt class="mb-1 text-xs font-medium uppercase text-[var(--docs-muted)]">
                {{ i18n.t('docs.api.type') }}
              </dt>
              <dd class="m-0 break-words font-mono text-sm text-[var(--docs-fg)]">{{ row.type }}</dd>
            </div>

            <div>
              <dt class="mb-1 text-xs font-medium uppercase text-[var(--docs-muted)]">
                {{ i18n.t('docs.api.default') }}
              </dt>
              <dd class="m-0 break-words font-mono text-sm text-[var(--docs-fg)]">{{ row.defaultValue }}</dd>
            </div>

            <div>
              <dt class="mb-1 text-xs font-medium uppercase text-[var(--docs-muted)]">
                {{ i18n.t('docs.api.description') }}
              </dt>
              <dd class="m-0 text-sm leading-6 text-[var(--docs-muted)]">{{ i18n.t(row.descriptionKey) }}</dd>
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
