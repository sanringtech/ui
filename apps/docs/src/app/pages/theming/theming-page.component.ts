import { Component, effect, inject } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageComponent, DocsPageHeaderComponent } from '../../layouts/component-page';
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
    DocsPageHeaderComponent,
    ThemingBrandSectionComponent,
    ThemingDarkModeSectionComponent,
    ThemingDesignTokensSectionComponent,
    ThemingPlaygroundSectionComponent,
    ThemingPresetsSectionComponent,
    ThemingTailwindSectionComponent,
  ],
  template: `
    <app-component-page [sections]="sections">
      <app-docs-page-header
        [title]="i18n.t('sidebar.theming')"
        [description]="i18n.t('theming.page.description')"
        eyebrow="docs / theming"
      />

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
