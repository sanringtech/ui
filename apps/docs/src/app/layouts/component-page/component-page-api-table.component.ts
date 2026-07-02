import { Component, inject, Input } from '@angular/core';
import { ComponentPageApiRow } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-component-page-api-table',
  standalone: true,
  template: `
    <div class="overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
      <table class="w-full border-collapse text-left text-sm">
        <thead class="bg-[var(--docs-elevated)] text-[var(--docs-muted)]">
          <tr>
            <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
              {{ i18n.t('docs.api.property') }}
            </th>
            <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
              {{ i18n.t('docs.api.type') }}
            </th>
            <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
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
              <td class="px-4 py-3 font-mono text-[var(--docs-fg)]">{{ row.property }}</td>
              <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">{{ row.type }}</td>
              <td class="px-4 py-3 font-mono text-[var(--docs-muted)]">{{ row.defaultValue }}</td>
              <td class="px-4 py-3 text-[var(--docs-muted)]">{{ i18n.t(row.descriptionKey) }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class ComponentPageApiTableComponent {
  @Input({ required: true }) rows!: readonly ComponentPageApiRow[];
  protected readonly i18n = inject(I18nService);
}
