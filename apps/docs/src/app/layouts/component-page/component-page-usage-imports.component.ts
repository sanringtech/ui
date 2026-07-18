import { Component, inject, input } from '@angular/core';
import { SANRING_TABS_IMPORTS } from '@sanring/ui';

import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageCodeBlock } from './component-page-code-block.component';

@Component({
  selector: 'app-component-page-usage-imports',
  standalone: true,
  imports: [ComponentPageCodeBlock, SANRING_TABS_IMPORTS],
  host: {
    // 這個元件的 host 本身可能是外層 flex/grid 容器的 item（例如放在
    // ComponentPageSectionComponent 的 grid gap-2 區塊裡），預設 min-width:auto
    // 會被內部 code block 的 min-w-max 長行撐開，明確設 min-width:0 才會用內部
    // 自身的 overflow-auto 捲動而不是撐大整個容器。
    class: 'block min-w-0',
  },
  template: `
    @if (individualCode()) {
      <sanring-tabs class="w-full min-w-0" defaultValue="convenience" variant="line">
        <sanring-tabs-list class="mb-3 gap-4">
          <sanring-tabs-trigger value="convenience" class="px-0 text-base">
            {{ i18n.t('docs.usage.imports.convenience') }}
          </sanring-tabs-trigger>
          <sanring-tabs-trigger value="individual" class="px-0 text-base">
            {{ i18n.t('docs.usage.imports.individual') }}
          </sanring-tabs-trigger>
        </sanring-tabs-list>

        <sanring-tabs-content value="convenience" class="mt-0 min-w-0">
          <div
            class="min-w-0 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="code()" language="typescript" />
          </div>
        </sanring-tabs-content>

        <sanring-tabs-content value="individual" class="mt-0 min-w-0">
          <div
            class="min-w-0 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
          >
            <app-component-page-code-block [code]="individualCode()" language="typescript" />
          </div>
        </sanring-tabs-content>
      </sanring-tabs>
    } @else {
      <div
        class="min-w-0 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]"
      >
        <app-component-page-code-block [code]="code()" language="typescript" />
      </div>
    }
  `,
})
export class ComponentPageUsageImportsComponent {
  readonly code = input.required<string>();
  readonly individualCode = input('');

  protected readonly i18n = inject(I18nService);
}
