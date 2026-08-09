import { Component, inject, input } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageSectionComponent } from '../../layouts/component-page';
import { ThemingCodePanelComponent } from './theming-code-panel.component';
import { themingDarkModeCss, themingDarkModeToggle } from './theming.constants';

@Component({
  selector: 'app-theming-dark-mode-section',
  standalone: true,
  imports: [ComponentPageSectionComponent, ThemingCodePanelComponent],
  template: `
    <app-component-page-section [section]="section()">
      <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
        {{ i18n.t('theming.darkMode.body') }}
      </p>
      <app-theming-code-panel label="CSS" [code]="darkModeCss" language="css" />
      <app-theming-code-panel label="TypeScript" [code]="darkModeToggle" language="typescript" />
      <p class="mt-4 text-sm text-[var(--docs-muted)]">{{ i18n.t('theming.darkMode.note') }}</p>
    </app-component-page-section>
  `,
})
export class ThemingDarkModeSectionComponent {
  readonly section = input.required<ComponentPageSectionDefinition>();

  protected readonly i18n = inject(I18nService);
  protected readonly darkModeCss = themingDarkModeCss;
  protected readonly darkModeToggle = themingDarkModeToggle;
}
