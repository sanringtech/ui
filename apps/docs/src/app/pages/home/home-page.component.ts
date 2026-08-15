import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideChevronRight,
  LucideCode2,
  LucideLayers3,
  LucideRocket,
  LucideTerminalSquare,
} from '@lucide/angular';
import { ButtonDirective, ScrollAreaDirective } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';
import { TranslationKey } from '../../i18n/translations';
import {
  docsComponentStatusBadgeKeys,
  docsComponentStatusDotClass,
  visibleDocsComponentItems,
} from '../../navigation/docs-navigation';
import { SITE_URL, SeoService } from '../../seo/seo.service';
import { isRecentlyUpdatedComponentId } from '../changelog/component-changelog';

interface HomeFeature {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: 'layers' | 'code';
}

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    ButtonDirective,
    ScrollAreaDirective,
    LucideChevronRight,
    LucideCode2,
    LucideLayers3,
    LucideRocket,
    LucideTerminalSquare,
  ],
  template: `
    <main class="mx-auto flex w-[80vw] max-w-[1920px] flex-col gap-20 overflow-hidden pb-28 pt-12 max-[860px]:w-full max-[860px]:gap-16 max-[860px]:px-5 max-[860px]:pt-8 max-[520px]:gap-12 max-[520px]:px-4 max-[520px]:pb-20">
      <section class="overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-panel)] shadow-[var(--docs-shadow-soft)]">
        <div class="grid items-stretch gap-0 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <div class="flex min-w-0 flex-col justify-between gap-12 p-8 lg:p-12 max-[520px]:gap-9 max-[520px]:p-6">
            <div class="flex flex-wrap items-center gap-3 max-[520px]:gap-2">
              <span class="inline-flex h-9 items-center rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-elevated)] px-3 font-mono text-sm font-semibold text-[var(--docs-fg)] max-[520px]:h-8 max-[520px]:text-xs">
                {{ releaseVersion }}
              </span>
              <a class="inline-flex h-9 items-center gap-2 rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-accent)_30%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_10%,var(--docs-elevated))] px-3 text-sm font-semibold text-[var(--docs-accent-strong)] no-underline transition-colors hover:border-[color-mix(in_srgb,var(--docs-accent)_55%,var(--docs-border))] hover:bg-[color-mix(in_srgb,var(--docs-accent)_16%,var(--docs-elevated))] max-[520px]:h-8 max-[520px]:text-xs" routerLink="/version-notes">
                <svg class="size-4" lucideRocket></svg>
                <span>{{ i18n.t('home.release.label') }}</span>
                <svg class="size-4" lucideChevronRight></svg>
              </a>
            </div>

            <div>
              <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">{{ i18n.t('home.eyebrow') }}</p>
              <h1 class="m-0 mt-5 max-w-[720px] text-[clamp(3rem,5.2vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--docs-fg)] max-[860px]:text-[clamp(2.75rem,9vw,4.5rem)] max-[520px]:mt-4 max-[520px]:text-[2.8rem]">
                {{ i18n.t('home.title') }}
              </h1>
              <p class="m-0 mt-6 max-w-[620px] text-lg leading-8 text-[var(--docs-muted)] max-[520px]:mt-5 max-[520px]:text-base max-[520px]:leading-7">
                {{ i18n.t('home.description') }}
              </p>
            </div>

            <div class="flex flex-wrap gap-3 max-[520px]:grid max-[520px]:grid-cols-1">
              <a sanringBtn class="min-h-11 min-w-[150px] border-[var(--docs-accent)] bg-[var(--docs-accent)] px-5 font-semibold text-[var(--docs-accent-fg)] hover:bg-[var(--docs-accent-strong)] max-[520px]:w-full max-[520px]:justify-center" routerLink="/components" variant="default" size="md">
                {{ i18n.t('home.actions.browseComponents') }}
                <svg class="size-4" lucideChevronRight></svg>
              </a>
              <a sanringBtn class="min-h-11 min-w-[132px] px-5 font-semibold max-[520px]:w-full max-[520px]:justify-center" routerLink="/components/button" variant="outline" size="md">
                {{ i18n.t('home.actions.viewExample') }}
              </a>
            </div>
          </div>

          <div class="border-l border-[var(--docs-border)] bg-[color-mix(in_srgb,var(--docs-surface)_72%,var(--docs-panel))] p-6 lg:p-8 max-[860px]:border-l-0 max-[860px]:border-t max-[520px]:p-4">
            <div class="flex h-full min-h-[430px] flex-col justify-between rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-accent)_30%,var(--docs-border))] bg-[var(--docs-bg)] p-6 max-[520px]:min-h-[360px] max-[520px]:p-5">
              <div class="flex items-center justify-between gap-4 border-b border-[var(--docs-border)] pb-4">
                <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
                  <svg class="size-4" lucideTerminalSquare></svg>
                  {{ i18n.t('home.hero.visualEyebrow') }}
                </div>
                <span class="inline-flex items-center gap-2 text-xs font-semibold text-[var(--docs-success-fg)]"><span class="size-2 rounded-full bg-[var(--docs-success-fg)]"></span>{{ i18n.t('home.hero.status') }}</span>
              </div>

              <div class="py-10 max-[520px]:py-8">
                <p class="m-0 max-w-[560px] text-[clamp(2rem,3.6vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-[var(--docs-fg)] max-[520px]:text-[2.25rem]">{{ i18n.t('home.hero.visualTitle') }}</p>
                <p class="m-0 mt-4 max-w-[480px] text-base leading-7 text-[var(--docs-muted)]">{{ i18n.t('home.hero.visualDescription') }}</p>
              </div>

              <div class="grid gap-3">
                @for (stage of workflowStages; track stage.labelKey) {
                  <div class="flex items-center gap-4 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-3 max-[520px]:px-3">
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--docs-accent)_16%,var(--docs-elevated))] font-mono text-xs font-semibold text-[var(--docs-accent-strong)]">{{ stage.index }}</span>
                    <span class="min-w-0 flex-1 text-sm font-semibold text-[var(--docs-fg)]">{{ i18n.t(stage.labelKey) }}</span>
                    <span class="size-2 shrink-0 rounded-full bg-[var(--docs-accent-strong)]"></span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-8 lg:grid-cols-[minmax(190px,0.42fr)_minmax(0,1.58fr)] lg:gap-12" aria-labelledby="home-features-title">
        <header class="lg:pt-4">
          <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">{{ i18n.t('home.features.eyebrow') }}</p>
          <h2 id="home-features-title" class="m-0 mt-4 max-w-[260px] text-[clamp(2rem,3.4vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-[var(--docs-fg)] max-[520px]:text-[2.4rem]">{{ i18n.t('home.features.title') }}</h2>
        </header>

        <div class="grid gap-4 md:grid-cols-5">
          <article class="flex min-h-[340px] flex-col justify-between rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-accent)_34%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_10%,var(--docs-panel))] p-7 md:col-span-3 lg:min-h-[380px] lg:p-9 max-[520px]:min-h-[300px] max-[520px]:p-6">
            <div class="flex items-center justify-between gap-4">
              <span class="font-mono text-xs font-semibold text-[var(--docs-accent-strong)]">{{ i18n.t('home.features.primaryLabel') }}</span>
              <svg class="size-5 text-[var(--docs-accent-strong)]" lucideCode2></svg>
            </div>
            <div>
              <h3 class="m-0 max-w-[520px] text-[clamp(2.25rem,4.2vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--docs-fg)] max-[520px]:text-[2.5rem]">{{ i18n.t('home.feature.primary.title') }}</h3>
              <p class="m-0 mt-5 max-w-[520px] text-base leading-7 text-[var(--docs-muted)]">{{ i18n.t('home.feature.primary.description') }}</p>
            </div>
          </article>

          <div class="grid gap-4 md:col-span-2">
            @for (feature of features; track feature.titleKey; let index = $index) {
              <article class="flex flex-col justify-between rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-6 max-[520px]:min-h-[180px] max-[520px]:p-5">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-[var(--docs-accent-strong)]">
                    @switch (feature.icon) {
                      @case ('layers') { <svg class="size-5" lucideLayers3></svg> }
                      @case ('code') { <svg class="size-5" lucideCode2></svg> }
                    }
                  </span>
                  <span class="font-mono text-xs text-[var(--docs-muted)]">0{{ index + 2 }}</span>
                </div>
                <div>
                  <h3 class="m-0 mt-8 text-lg font-semibold text-[var(--docs-fg)]">{{ i18n.t(feature.titleKey) }}</h3>
                  <p class="m-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">{{ i18n.t(feature.descriptionKey) }}</p>
                </div>
              </article>
            }
          </div>
        </div>
      </section>

      <section class="rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-7 shadow-[var(--docs-shadow-soft)] lg:p-9 max-[520px]:p-5" aria-labelledby="home-components-title">
        <div class="grid gap-10 lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <header class="lg:pt-2">
            <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">{{ i18n.t('home.components.eyebrow') }}</p>
            <h2 id="home-components-title" class="m-0 mt-4 max-w-[430px] text-[clamp(2.25rem,4vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--docs-fg)] max-[520px]:text-[2.6rem]">{{ i18n.t('home.components.title') }}</h2>
            <p class="m-0 mt-5 max-w-[420px] text-base leading-7 text-[var(--docs-muted)]">{{ i18n.t('home.components.description') }}</p>
            <a sanringBtn class="mt-7 min-h-11 font-semibold" routerLink="/components" variant="outline" size="md">
              {{ i18n.t('home.components.browseAll') }}
              <svg class="size-4" lucideChevronRight></svg>
            </a>
          </header>

          <div class="min-w-0 rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-accent)_32%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-surface)_74%,var(--docs-panel))] p-5 max-[520px]:p-4">
            <div class="mb-5 flex items-end justify-between gap-4 border-b border-[var(--docs-border)] pb-4">
              <div>
                <p class="m-0 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--docs-muted)]">{{ i18n.t('home.components.panelEyebrow') }}</p>
                <p class="m-0 mt-2 text-xl font-semibold text-[var(--docs-fg)]">{{ i18n.t('home.components.panelTitle') }}</p>
              </div>
              <p class="m-0 font-mono text-3xl font-semibold text-[var(--docs-accent-strong)]">{{ componentCount }}</p>
            </div>

            <nav sanringScrollArea [hideScrollbar]="true" class="grid max-h-[460px] grid-cols-3 gap-3 pr-1 max-[980px]:grid-cols-2 max-[480px]:grid-cols-1" aria-label="Component shortcuts">
              @for (item of componentItems; track item.id) {
                @if (item.disabled) {
                  <span class="flex min-h-12 min-w-0 items-center gap-3 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-3 py-2 text-sm font-semibold text-[color-mix(in_srgb,var(--docs-muted)_45%,transparent)]">
                    <span class="min-w-0 truncate">{{ i18n.t(item.labelKey) }}</span>
                  </span>
                } @else {
                  <a class="flex min-h-12 min-w-0 items-center justify-between gap-3 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-3 py-2 text-sm font-semibold text-[var(--docs-fg)] no-underline transition-colors hover:border-[var(--docs-border-strong)] hover:bg-[var(--docs-elevated)]" [routerLink]="item.path">
                    <span class="min-w-0 truncate">{{ i18n.t(item.labelKey) }}</span>
                    @if (item.isNew) {
                      <span class="sr-only">{{ i18n.t('home.components.newBadge') }}</span>
                      <span class="size-2 shrink-0 rounded-full bg-[var(--docs-accent-strong)]" aria-hidden="true"></span>
                    }
                    @if (item.status) {
                      <span class="sr-only">{{ i18n.t(statusBadgeKeys[item.status]) }}</span>
                      <span [class]="'size-2 shrink-0 rounded-full ' + statusDotClass[item.status]" [attr.title]="i18n.t(statusBadgeKeys[item.status])" aria-hidden="true"></span>
                    }
                  </a>
                }
              }
            </nav>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class HomePageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly releaseVersion = 'v0.23.2';

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
        publisher: {
          '@type': 'Organization',
          name: title,
          url: SITE_URL,
        },
      });
    });
  }

  protected readonly componentCount = visibleDocsComponentItems.length;
  protected readonly componentItems = visibleDocsComponentItems.map((item) => ({
    id: item.id,
    path: item.path,
    labelKey: item.labelKey,
    status: item.status,
    disabled: item.disabled,
    isNew: isRecentlyUpdatedComponentId(item.id),
  }));
  protected readonly statusBadgeKeys = docsComponentStatusBadgeKeys;
  protected readonly statusDotClass = docsComponentStatusDotClass;
  protected readonly workflowStages = [
    { index: '01', labelKey: 'home.hero.stage.select' as TranslationKey },
    { index: '02', labelKey: 'home.hero.stage.install' as TranslationKey },
    { index: '03', labelKey: 'home.hero.stage.adapt' as TranslationKey },
  ];
  protected readonly features: HomeFeature[] = [
    { titleKey: 'home.feature.compose.title', descriptionKey: 'home.feature.compose.description', icon: 'layers' },
    { titleKey: 'home.feature.angular.title', descriptionKey: 'home.feature.angular.description', icon: 'code' },
  ];
}
