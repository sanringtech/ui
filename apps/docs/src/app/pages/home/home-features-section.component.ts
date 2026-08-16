import { Component, inject } from '@angular/core';
import { LucideCode2, LucideLayers3, LucideTerminalSquare } from '@lucide/angular';
import { I18nService } from '../../i18n/i18n.service';
import { TranslationKey } from '../../i18n/translations';

interface HomeFeature {
  index: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: 'layers' | 'code' | 'terminal';
}

@Component({
  selector: 'app-home-features-section',
  standalone: true,
  imports: [LucideCode2, LucideLayers3, LucideTerminalSquare],
  template: `
    <section class="grid gap-12 border-t border-[var(--docs-border)] pt-12 lg:grid-cols-[minmax(260px,0.78fr)_minmax(0,1.22fr)] lg:gap-20" aria-labelledby="home-features-title">
      <div><p class="m-0 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--docs-accent-strong)]">{{ i18n.t('home.features.eyebrow') }}</p><h2 id="home-features-title" class="m-0 mt-5 max-w-[520px] text-[clamp(2.8rem,5vw,5.2rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-[var(--docs-fg)] max-[520px]:text-[2.9rem]">{{ i18n.t('home.features.title') }}</h2><p class="m-0 mt-6 max-w-[450px] text-lg leading-8 text-[var(--docs-muted)] max-[520px]:text-base max-[520px]:leading-7">{{ i18n.t('home.features.description') }}</p></div>
      <div class="grid gap-4 sm:grid-cols-3">
        @for (feature of features; track feature.titleKey) {
          <article class="min-w-0 rounded-[var(--sanring-radius-lg)] bg-[var(--docs-surface)] p-6 max-[520px]:p-5">
            <div class="flex items-center justify-between gap-4"><span class="font-mono text-xs font-semibold text-[var(--docs-accent-strong)]">{{ feature.index }}</span><span class="text-[var(--docs-accent-strong)]">@switch (feature.icon) { @case ('layers') { <svg class="size-4" lucideLayers3></svg> } @case ('code') { <svg class="size-4" lucideCode2></svg> } @case ('terminal') { <svg class="size-4" lucideTerminalSquare></svg> } }</span></div>
            <h3 class="m-0 mt-14 text-xl font-semibold text-[var(--docs-fg)] max-[520px]:mt-10">{{ i18n.t(feature.titleKey) }}</h3><p class="m-0 mt-3 text-base leading-7 text-[var(--docs-muted)]">{{ i18n.t(feature.descriptionKey) }}</p>
          </article>
        }
      </div>
    </section>
  `,
  styles: [':host { display: block; }'],
})
export class HomeFeaturesSectionComponent {
  protected readonly i18n = inject(I18nService);

  protected readonly features: HomeFeature[] = [
    { index: '01', titleKey: 'home.feature.source.title', descriptionKey: 'home.feature.source.description', icon: 'code' },
    { index: '02', titleKey: 'home.feature.composable.title', descriptionKey: 'home.feature.composable.description', icon: 'layers' },
    { index: '03', titleKey: 'home.feature.angular.title', descriptionKey: 'home.feature.angular.description', icon: 'terminal' },
  ];
}
