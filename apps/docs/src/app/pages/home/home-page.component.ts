import { Component, effect, inject } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';
import { SITE_URL, SeoService } from '../../seo/seo.service';
import { HomeComponentsSectionComponent } from './home-components-section.component';
import { HomeFeaturesSectionComponent } from './home-features-section.component';
import { HomeHeroSectionComponent } from './home-hero-section.component';
import { HomeStartSectionComponent } from './home-start-section.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HomeHeroSectionComponent,
    HomeFeaturesSectionComponent,
    HomeComponentsSectionComponent,
    HomeStartSectionComponent,
  ],
  template: `
    <main class="mx-auto flex w-[92vw] max-w-[1440px] flex-col gap-28 overflow-hidden pb-28 pt-14 max-[860px]:gap-20 max-[860px]:pt-10 max-[520px]:gap-14 max-[520px]:pt-8">
      <app-home-hero-section />
      <app-home-features-section />
      <app-home-components-section />
      <app-home-start-section />
    </main>
  `,
  styles: [':host { display: block; }'],
})
export class HomePageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      const title = this.i18n.t('home.title');
      const description = this.i18n.t('home.description');
      this.seo.setPage({ title, description, path: '/' });
      this.seo.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: title,
        url: `${SITE_URL}/`,
        description,
        publisher: { '@type': 'Organization', name: title, url: SITE_URL },
      });
    });
  }
}
