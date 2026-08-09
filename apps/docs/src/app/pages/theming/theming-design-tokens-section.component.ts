import { Component, inject, input } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageSectionComponent } from '../../layouts/component-page';
import { ThemingCodePanelComponent } from './theming-code-panel.component';
import { themingTokensSource } from './theming.constants';

@Component({
  selector: 'app-theming-design-tokens-section',
  standalone: true,
  imports: [ComponentPageSectionComponent, ThemingCodePanelComponent],
  template: `
    <app-component-page-section [section]="section()">
      <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
        {{ i18n.t('theming.tokens.body') }}
      </p>
      <app-theming-code-panel
        label="sanring-theme.css (generated, abridged)"
        [code]="tokensSource"
        language="css"
      />
    </app-component-page-section>
  `,
})
export class ThemingDesignTokensSectionComponent {
  readonly section = input.required<ComponentPageSectionDefinition>();

  protected readonly i18n = inject(I18nService);
  protected readonly tokensSource = themingTokensSource;
}
