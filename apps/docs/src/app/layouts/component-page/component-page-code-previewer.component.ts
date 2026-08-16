import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { SANRING_TABS_IMPORTS } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';
import {
  ComponentPageCodeBlock,
  ComponentPageCodeCopyEvent,
  ComponentPageCodeLanguage,
} from './component-page-code-block.component';

@Component({
  selector: 'app-component-page-code-previewer',
  imports: [ComponentPageCodeBlock, SANRING_TABS_IMPORTS],
  standalone: true,
  host: {
    class: 'block min-w-0',
  },
  template: `
    <div
      class="mt-9 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-border)_82%,transparent)] bg-[color-mix(in_srgb,var(--docs-panel)_92%,transparent)] shadow-[var(--docs-shadow-strong)]"
    >
      <sanring-tabs defaultValue="preview" variant="line">
        <div class="border-b border-[color-mix(in_srgb,var(--docs-border)_82%,transparent)] px-3 pt-2">
          <sanring-tabs-list class="gap-2">
            <sanring-tabs-trigger value="preview" class="px-3 text-sm font-medium">
              {{ i18n.t('toc.preview') }}
            </sanring-tabs-trigger>
            <sanring-tabs-trigger value="code" class="px-3 text-sm font-medium">
              {{ i18n.t('toc.code') }}
            </sanring-tabs-trigger>
          </sanring-tabs-list>
        </div>

        <sanring-tabs-content value="preview" class="mt-0">
          <div
            class="grid place-items-center [background:linear-gradient(180deg,color-mix(in_srgb,var(--docs-elevated)_62%,transparent),color-mix(in_srgb,var(--docs-panel)_76%,transparent)),linear-gradient(var(--docs-bg-grid)_1px,transparent_1px),linear-gradient(90deg,var(--docs-bg-grid)_1px,transparent_1px)] [background-size:auto,30px_30px,30px_30px] max-[720px]:min-h-80"
            [class]="wide() ? 'min-h-[390px] p-4 max-[720px]:p-3' : 'min-h-[390px] p-11 max-[720px]:p-6'"
          >
            <ng-content select="[previewer]" />
          </div>
        </sanring-tabs-content>

        <sanring-tabs-content value="code" class="mt-0">
          <app-component-page-code-block
            [code]="code()"
            [language]="language()"
            (codeCopy)="codeCopy.emit($event)"
          />
        </sanring-tabs-content>
      </sanring-tabs>
    </div>
  `,
})
export class ComponentPageCodePreviewer {
  readonly code = input('');
  readonly language = input<ComponentPageCodeLanguage>('angular-html');
  readonly wide = input(false);

  @Output() codeCopy = new EventEmitter<ComponentPageCodeCopyEvent>();

  protected readonly i18n = inject(I18nService);
}
