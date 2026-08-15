import { Component, inject, input } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageSectionComponent } from '../../layouts/component-page';
import { ThemingCodePanelComponent } from './theming-code-panel.component';
import { themingPresetsCommand } from './theming.constants';

@Component({
  selector: 'app-theming-presets-section',
  standalone: true,
  imports: [ComponentPageSectionComponent, ThemingCodePanelComponent],
  template: `
    <app-component-page-section [section]="section()">
      <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
        {{ i18n.t('theming.presets.body') }}
      </p>
      <app-theming-code-panel label="Terminal" [code]="presetsCommand" language="bash" />
      <div class="mt-6 w-full min-w-0 overflow-x-auto">
        <table class="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr class="border-b border-[var(--docs-border)] text-left text-[var(--docs-muted)]">
              <th class="py-2 pr-4 font-medium">Preset</th>
              <th class="py-2 font-medium">Look</th>
            </tr>
          </thead>
          <tbody class="text-[var(--docs-fg)]">
            <tr class="border-b border-[var(--docs-border)]">
              <td class="py-2 pr-4"><code>default</code></td>
              <td class="py-2 text-[var(--docs-muted)]">Teal accent (no flag needed)</td>
            </tr>
            <tr class="border-b border-[var(--docs-border)]">
              <td class="py-2 pr-4"><code>slate</code></td>
              <td class="py-2 text-[var(--docs-muted)]">Muted blue-gray accent</td>
            </tr>
            <tr class="border-b border-[var(--docs-border)]">
              <td class="py-2 pr-4"><code>warm</code></td>
              <td class="py-2 text-[var(--docs-muted)]">Amber accent, larger radius</td>
            </tr>
            <tr>
              <td class="py-2 pr-4"><code>high-contrast</code></td>
              <td class="py-2 text-[var(--docs-muted)]">Near-black/white surfaces, square corners</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-4 text-sm text-[var(--docs-muted)]">{{ i18n.t('theming.presets.note') }}</p>
    </app-component-page-section>
  `,
})
export class ThemingPresetsSectionComponent {
  readonly section = input.required<ComponentPageSectionDefinition>();

  protected readonly i18n = inject(I18nService);
  protected readonly presetsCommand = themingPresetsCommand;
}
