import { Component, inject, Input } from '@angular/core';
import { ComponentPageKeyboardRow } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-component-page-keyboard-table',
  standalone: true,
  template: `
    <div class="hidden overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)] md:block">
      <table class="w-full border-collapse text-left text-sm">
        <thead class="bg-[var(--docs-elevated)] text-[var(--docs-muted)]">
          <tr>
            <th class="w-[30%] border-b border-[var(--docs-border)] px-4 py-3 font-medium">
              {{ i18n.t('docs.keyboard.key') }}
            </th>
            <th class="border-b border-[var(--docs-border)] px-4 py-3 font-medium">
              {{ i18n.t('docs.keyboard.action') }}
            </th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row.keys; let last = $last) {
            <tr [class.border-b]="!last" class="border-[var(--docs-border)]">
              <td class="px-4 py-3 font-mono text-xs text-[var(--docs-fg)]">{{ row.keys }}</td>
              <td class="px-4 py-3 leading-6 text-[var(--docs-muted)]">{{ i18n.t(row.descriptionKey) }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div class="grid gap-3 md:hidden">
      @for (row of rows; track row.keys) {
        <article class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-4">
          <p class="mb-1 font-mono text-xs font-medium text-[var(--docs-fg)]">{{ row.keys }}</p>
          <p class="m-0 text-sm leading-6 text-[var(--docs-muted)]">{{ i18n.t(row.descriptionKey) }}</p>
        </article>
      }
    </div>
  `,
})
export class ComponentPageKeyboardTableComponent {
  @Input({ required: true }) rows!: readonly ComponentPageKeyboardRow[];
  protected readonly i18n = inject(I18nService);
}
