import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideChevronRight,
  LucideCode2,
  LucideLayers3,
  LucideRocket,
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
  icon: 'layers' | 'code' | 'box';
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
  ],
  template: `
    <main class="relative isolate flex w-full flex-col gap-24 overflow-hidden px-[clamp(1.25rem,4vw,4.5rem)] pb-28 pt-16 max-[860px]:gap-16 max-[860px]:pt-10 max-[520px]:gap-12 max-[520px]:px-4 max-[520px]:pb-20">
      <section class="relative z-10 grid items-stretch gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-16">
        <div class="flex min-w-0 flex-col justify-center">
          <div class="mb-7 flex flex-wrap items-center gap-3 max-[520px]:mb-5 max-[520px]:gap-2">
            <span
              class="inline-flex h-9 items-center rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-elevated)] px-3 font-mono text-sm font-semibold text-[var(--docs-fg)] max-[520px]:h-8 max-[520px]:text-xs"
            >
              {{ releaseVersion }}
            </span>
            <a
              class="inline-flex h-9 min-w-0 items-center gap-2 rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-accent)_30%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_10%,var(--docs-elevated))] px-3 text-sm font-semibold text-[var(--docs-accent-strong)] no-underline transition-colors hover:border-[color-mix(in_srgb,var(--docs-accent)_55%,var(--docs-border))] hover:bg-[color-mix(in_srgb,var(--docs-accent)_16%,var(--docs-elevated))] max-[520px]:h-8 max-[520px]:text-xs"
              routerLink="/version-notes"
            >
              <svg class="size-4" lucideRocket></svg>
              <span class="min-w-0 truncate">{{ i18n.t('home.release.label') }}</span>
              <svg class="size-4" lucideChevronRight></svg>
            </a>
          </div>

          <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
            {{ i18n.t('home.eyebrow') }}
          </p>
          <h1 class="m-0 mt-5 max-w-[980px] text-[clamp(3.5rem,7.2vw,7rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[var(--docs-fg)] max-[860px]:text-[clamp(3rem,12vw,5rem)] max-[520px]:mt-4 max-[520px]:text-[3.25rem]">
            {{ i18n.t('home.title') }}
          </h1>

          <p class="mb-0 mt-8 max-w-[700px] text-[20px] leading-[1.65] text-[var(--docs-muted)] max-[860px]:text-lg max-[520px]:mt-6 max-[520px]:text-base">
            {{ i18n.t('home.description') }}
          </p>

          <div class="mt-9 flex flex-wrap items-center gap-3 max-[520px]:mt-7 max-[520px]:grid max-[520px]:grid-cols-1">
            <a
              sanringBtn
              class="min-h-12 min-w-[160px] border-[var(--docs-accent)] bg-[var(--docs-accent)] px-5 text-base font-semibold text-[var(--docs-accent-fg)] hover:bg-[var(--docs-accent-strong)] max-[520px]:w-full max-[520px]:justify-center"
              routerLink="/components"
              variant="default"
              size="md"
            >
              {{ i18n.t('home.actions.browseComponents') }}
              <svg class="size-4" lucideChevronRight></svg>
            </a>
            <a
              sanringBtn
              class="min-h-12 min-w-[140px] px-5 text-base font-semibold max-[520px]:w-full max-[520px]:justify-center"
              routerLink="/components/button"
              variant="outline"
              size="md"
            >
              {{ i18n.t('home.actions.viewExample') }}
            </a>
          </div>
        </div>

        <div
          class="relative min-h-[540px] min-w-0 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-accent)_34%,var(--docs-border))] bg-[var(--docs-panel)] p-8 shadow-[var(--docs-shadow-strong)] max-[1080px]:min-h-[440px] max-[640px]:min-h-[390px] max-[640px]:p-5"
        >
          <div
            class="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(var(--docs-bg-grid)_1px,transparent_1px),linear-gradient(90deg,var(--docs-bg-grid)_1px,transparent_1px)] [background-size:36px_36px]"
            aria-hidden="true"
          ></div>
          <div class="absolute -right-16 -top-16 size-64 rounded-full border border-[color-mix(in_srgb,var(--docs-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--docs-accent)_8%,transparent)] max-[640px]:size-48" aria-hidden="true"></div>
          <div class="relative z-10 flex h-full flex-col justify-between gap-12">
            <div class="flex items-center justify-between gap-4 border-b border-[var(--docs-border)] pb-5">
              <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
                {{ i18n.t('home.hero.panelEyebrow') }}
              </p>
              <span class="size-3 rounded-full bg-[var(--docs-accent)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--docs-accent)_16%,transparent)]" aria-hidden="true"></span>
            </div>

            <div class="max-w-[520px]">
              <p class="m-0 text-[clamp(2.25rem,4vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--docs-fg)] max-[640px]:text-[2.25rem]">
                {{ i18n.t('home.hero.panelTitle') }}
              </p>
              <p class="m-0 mt-5 max-w-[420px] text-base leading-7 text-[var(--docs-muted)]">
                {{ i18n.t('home.hero.panelDescription') }}
              </p>
            </div>

            <div class="grid grid-cols-2 border-t border-[var(--docs-border)] pt-5 max-[420px]:grid-cols-1 max-[420px]:gap-4">
              <div class="border-r border-[var(--docs-border)] pr-5 max-[420px]:border-r-0 max-[420px]:pr-0">
                <p class="m-0 text-sm font-semibold text-[var(--docs-fg)]">{{ i18n.t('home.hero.signalOneTitle') }}</p>
                <p class="m-0 mt-1 text-sm leading-6 text-[var(--docs-muted)]">{{ i18n.t('home.hero.signalOneDescription') }}</p>
              </div>
              <div class="pl-5 max-[420px]:border-t max-[420px]:border-[var(--docs-border)] max-[420px]:pl-0 max-[420px]:pt-4">
                <p class="m-0 text-sm font-semibold text-[var(--docs-fg)]">{{ i18n.t('home.hero.signalTwoTitle') }}</p>
                <p class="m-0 mt-1 text-sm leading-6 text-[var(--docs-muted)]">{{ i18n.t('home.hero.signalTwoDescription') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="relative z-10 grid gap-5 lg:grid-cols-12 lg:gap-6" aria-labelledby="home-features-title">
        <div class="flex flex-col justify-between rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-accent)_36%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,var(--docs-panel))] p-8 lg:col-span-7 lg:min-h-[390px] lg:p-12 max-[520px]:p-6">
          <div>
            <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
              {{ i18n.t('home.features.eyebrow') }}
            </p>
            <h2 id="home-features-title" class="m-0 mt-5 max-w-[620px] text-[clamp(2.25rem,4vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--docs-fg)] max-[520px]:text-[2.25rem]">
              {{ i18n.t('home.feature.source.title') }}
            </h2>
          </div>
          <p class="m-0 mt-12 max-w-[600px] text-lg leading-8 text-[var(--docs-muted)] max-[520px]:mt-8 max-[520px]:text-base max-[520px]:leading-7">
            {{ i18n.t('home.feature.source.description') }}
          </p>
        </div>

        <div class="grid gap-5 lg:col-span-5">
          @for (feature of features; track feature.titleKey) {
            <article class="flex min-h-[182px] items-start gap-5 rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-6 max-[520px]:min-h-0 max-[520px]:p-5">
              <div class="shrink-0 rounded-[var(--sanring-radius-sm)] border border-[color-mix(in_srgb,var(--docs-accent)_28%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,var(--docs-elevated))] p-2 text-[var(--docs-accent-strong)]">
                @switch (feature.icon) {
                  @case ('layers') {
                    <svg class="size-5" lucideLayers3></svg>
                  }
                  @case ('code') {
                    <svg class="size-5" lucideCode2></svg>
                  }
                  @case ('box') {
                    <svg class="size-5" lucideBox></svg>
                  }
                }
              </div>
              <div>
                <h3 class="m-0 text-xl font-semibold text-[var(--docs-fg)]">{{ i18n.t(feature.titleKey) }}</h3>
                <p class="m-0 mt-2 text-base leading-7 text-[var(--docs-muted)]">{{ i18n.t(feature.descriptionKey) }}</p>
              </div>
            </article>
          }
        </div>
      </section>

      <section class="relative z-10 grid gap-10 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:gap-16" aria-labelledby="home-components-title">
        <div class="lg:sticky lg:top-28 lg:self-start">
          <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
            {{ i18n.t('home.components.eyebrow') }}
          </p>
          <h2 id="home-components-title" class="m-0 mt-5 text-[clamp(2.25rem,4vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--docs-fg)] max-[520px]:text-[2.25rem]">
              {{ i18n.t('home.components.title') }}
          </h2>
          <p class="m-0 mt-6 max-w-[420px] text-lg leading-8 text-[var(--docs-muted)] max-[520px]:text-base max-[520px]:leading-7">
            {{ i18n.t('home.components.description') }}
          </p>
          <a
            sanringBtn
            class="mt-8 min-h-11 font-semibold max-[520px]:mt-6"
            routerLink="/components"
            variant="outline"
            size="md"
          >
            {{ i18n.t('home.components.browseAll') }}
            <svg class="size-4" lucideChevronRight></svg>
          </a>
        </div>

        <div class="rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-accent)_38%,var(--docs-border))] bg-[var(--docs-panel)] p-6 shadow-[var(--docs-shadow-soft)] max-[520px]:p-4">
          <div class="mb-6 flex items-end justify-between gap-4 border-b border-[var(--docs-border)] pb-5 max-[520px]:mb-4 max-[520px]:pb-4">
            <div>
              <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-muted)]">{{ i18n.t('home.components.panelEyebrow') }}</p>
              <p class="m-0 mt-2 text-2xl font-semibold text-[var(--docs-fg)] max-[520px]:text-xl">
                {{ i18n.t('home.components.panelTitle') }}
              </p>
            </div>
            <p class="m-0 font-mono text-3xl font-semibold text-[var(--docs-accent-strong)] max-[520px]:text-2xl">
              {{ componentCount }}
            </p>
          </div>

          <nav
            sanringScrollArea
            [hideScrollbar]="true"
            class="grid max-h-[520px] grid-cols-3 gap-3 pr-1 max-[980px]:grid-cols-2 max-[520px]:max-h-[460px] max-[480px]:grid-cols-1"
            aria-label="Component shortcuts"
          >
            @for (item of componentItems; track item.id) {
              @if (item.disabled) {
                <span
                  class="flex min-w-0 items-center gap-3 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-3 text-sm font-semibold text-[color-mix(in_srgb,var(--docs-muted)_45%,transparent)] max-[520px]:px-3"
                >
                  <span class="min-w-0 truncate">{{ i18n.t(item.labelKey) }}</span>
                </span>
              } @else {
                <a
                  class="flex min-h-14 min-w-0 items-center justify-between gap-3 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-3 text-base font-semibold text-[var(--docs-fg)] no-underline transition-colors hover:border-[var(--docs-border-strong)] hover:bg-[var(--docs-elevated)] max-[520px]:px-3"
                  [routerLink]="item.path"
                >
                  <span class="min-w-0 truncate">{{ i18n.t(item.labelKey) }}</span>
                  @if (item.isNew) {
                    <span class="sr-only">{{ i18n.t('home.components.newBadge') }}</span>
                    <span
                      class="size-2 shrink-0 rounded-full bg-[var(--docs-accent-strong)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--docs-accent)_18%,transparent)]"
                      aria-hidden="true"
                    ></span>
                  }
                  @if (item.status) {
                    <span class="sr-only">{{ i18n.t(statusBadgeKeys[item.status]) }}</span>
                    <span
                      [class]="'size-2 shrink-0 rounded-full ' + statusDotClass[item.status]"
                      [attr.title]="i18n.t(statusBadgeKeys[item.status])"
                      aria-hidden="true"
                    ></span>
                  }
                </a>
              }
            }
          </nav>
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

  protected readonly features: HomeFeature[] = [
    {
      titleKey: 'home.feature.compose.title',
      descriptionKey: 'home.feature.compose.description',
      icon: 'layers',
    },
    {
      titleKey: 'home.feature.angular.title',
      descriptionKey: 'home.feature.angular.description',
      icon: 'code',
    },
  ];
}
