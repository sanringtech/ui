import { Component, effect, inject } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageComponent } from '../../layouts/component-page';
import { SeoService } from '../../seo/seo.service';
import { ThemingBrandSectionComponent } from './theming-brand-section.component';
import { themingSections } from './theming.constants';
import { ThemingDarkModeSectionComponent } from './theming-dark-mode-section.component';
import { ThemingDesignTokensSectionComponent } from './theming-design-tokens-section.component';
import { ThemingPlaygroundSectionComponent } from './theming-playground-section.component';
import { ThemingPresetsSectionComponent } from './theming-presets-section.component';
import { ThemingTailwindSectionComponent } from './theming-tailwind-section.component';

@Component({
  selector: 'app-theming-page',
  imports: [
    ComponentPageComponent,
    ThemingBrandSectionComponent,
    ThemingDarkModeSectionComponent,
    ThemingDesignTokensSectionComponent,
    ThemingPlaygroundSectionComponent,
    ThemingPresetsSectionComponent,
    ThemingTailwindSectionComponent,
  ],
  template: `
    <app-component-page [sections]="sections">
      <header class="border-b border-[var(--docs-border)] pb-10">
        <h1
          class="m-0 text-[34px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]"
        >
          {{ i18n.t('sidebar.theming') }}
        </h1>
        <p class="mb-0 mt-4 max-w-[620px] text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('theming.page.description') }}
        </p>
      </header>

      <app-theming-design-tokens-section [section]="sections[0]" />
      <app-theming-tailwind-section [section]="sections[1]" />
      <app-theming-playground-section [section]="sections[2]" />
      <app-theming-brand-section [section]="sections[3]" />
      <app-theming-dark-mode-section [section]="sections[4]" />
      <app-theming-presets-section [section]="sections[5]" />
    </app-component-page>
  `,
})
export class ThemingPageComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly sections = themingSections;
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t('sidebar.theming'),
        description: this.i18n.t('theming.page.description'),
      });
    });
  }
}
