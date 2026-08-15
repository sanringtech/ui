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
    <main class="relative isolate flex w-full flex-col gap-28 overflow-hidden px-[clamp(1.25rem,4vw,4.5rem)] pb-32 pt-14 max-[860px]:gap-20 max-[860px]:pt-9 max-[520px]:gap-16 max-[520px]:px-4 max-[520px]:pb-20">
      <section class="relative z-10 grid gap-0 lg:grid-cols-12">
        <div class="relative flex min-h-[590px] flex-col justify-between overflow-hidden bg-[var(--docs-accent)] p-8 lg:col-span-7 lg:min-h-[650px] lg:p-12 max-[860px]:min-h-[540px] max-[520px]:min-h-[500px] max-[520px]:p-6">
          <div class="pointer-events-none absolute -bottom-32 -right-24 size-[30rem] rounded-full border-[36px] border-[color-mix(in_srgb,var(--docs-accent-fg)_12%,transparent)] max-[520px]:size-[22rem]" aria-hidden="true"></div>
          <div class="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full border border-[color-mix(in_srgb,var(--docs-accent-fg)_24%,transparent)] max-[520px]:size-48" aria-hidden="true"></div>

          <div class="relative z-10 flex items-center justify-between gap-4">
            <span class="inline-flex h-9 items-center border border-[color-mix(in_srgb,var(--docs-accent-fg)_30%,transparent)] bg-[color-mix(in_srgb,var(--docs-accent-fg)_10%,transparent)] px-3 font-mono text-sm font-semibold text-[var(--docs-accent-fg)] max-[520px]:h-8 max-[520px]:text-xs">
              {{ releaseVersion }}
            </span>
            <a
              class="inline-flex h-9 items-center gap-2 text-sm font-semibold text-[var(--docs-accent-fg)] no-underline opacity-80 transition-opacity hover:opacity-100 max-[520px]:text-xs"
              routerLink="/version-notes"
            >
              <svg class="size-4" lucideRocket></svg>
              <span>{{ i18n.t('home.release.label') }}</span>
              <svg class="size-4" lucideChevronRight></svg>
            </a>
          </div>

          <div class="relative z-10 max-w-[850px]">
            <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[color-mix(in_srgb,var(--docs-accent-fg)_72%,transparent)]">
              {{ i18n.t('home.eyebrow') }}
            </p>
            <h1 class="m-0 mt-5 text-[clamp(3.5rem,7.4vw,8rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-[var(--docs-accent-fg)] max-[860px]:text-[clamp(3.25rem,12vw,6rem)] max-[520px]:mt-4 max-[520px]:text-[3.5rem]">
              {{ i18n.t('home.title') }}
            </h1>
            <p class="m-0 mt-8 max-w-[650px] text-[20px] leading-[1.6] text-[color-mix(in_srgb,var(--docs-accent-fg)_78%,transparent)] max-[860px]:text-lg max-[520px]:mt-6 max-[520px]:text-base">
              {{ i18n.t('home.description') }}
            </p>
            <div class="mt-8 flex flex-wrap gap-3 max-[520px]:mt-7 max-[520px]:grid max-[520px]:grid-cols-1">
              <a
                sanringBtn
                class="min-h-12 min-w-[160px] border-[var(--docs-accent-fg)] bg-[var(--docs-accent-fg)] px-5 text-base font-semibold text-[var(--docs-accent)] hover:bg-[color-mix(in_srgb,var(--docs-accent-fg)_88%,white)] max-[520px]:w-full max-[520px]:justify-center"
                routerLink="/components"
                variant="default"
                size="md"
              >
                {{ i18n.t('home.actions.browseComponents') }}
                <svg class="size-4" lucideChevronRight></svg>
              </a>
              <a
                sanringBtn
                class="min-h-12 min-w-[140px] border-[color-mix(in_srgb,var(--docs-accent-fg)_34%,transparent)] bg-transparent px-5 text-base font-semibold text-[var(--docs-accent-fg)] hover:bg-[color-mix(in_srgb,var(--docs-accent-fg)_12%,transparent)] max-[520px]:w-full max-[520px]:justify-center"
                routerLink="/components/button"
                variant="outline"
                size="md"
              >
                {{ i18n.t('home.actions.viewExample') }}
              </a>
            </div>
          </div>
        </div>

        <div class="flex min-h-[590px] flex-col justify-between border border-l-0 border-[var(--docs-border)] bg-[var(--docs-panel)] p-8 lg:col-span-5 lg:min-h-[650px] lg:p-10 max-[860px]:min-h-0 max-[860px]:border-l max-[860px]:border-t-0 max-[520px]:p-6">
          <div>
            <div class="flex items-center justify-between gap-4 border-b border-[var(--docs-border)] pb-5">
              <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
                <svg class="size-4" lucideTerminalSquare></svg>
                {{ i18n.t('home.hero.workflowEyebrow') }}
              </div>
              <span class="inline-flex items-center gap-2 text-xs font-semibold text-[var(--docs-success-fg)]">
                <span class="size-2 rounded-full bg-[var(--docs-success-fg)]"></span>
                {{ i18n.t('home.hero.status') }}
              </span>
            </div>

            <h2 class="m-0 mt-12 max-w-[440px] text-[clamp(2.25rem,4vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--docs-fg)] max-[520px]:mt-10 max-[520px]:text-[2.5rem]">
              {{ i18n.t('home.hero.workflowTitle') }}
            </h2>
            <p class="m-0 mt-5 max-w-[430px] text-base leading-7 text-[var(--docs-muted)]">
              {{ i18n.t('home.hero.workflowDescription') }}
            </p>
          </div>

          <div class="mt-12">
            <div class="border border-[var(--docs-border)] bg-[var(--docs-code)] p-5 font-mono text-sm leading-7 text-[var(--docs-code-fg)] max-[520px]:p-4 max-[520px]:text-[13px]">
              <div class="mb-4 text-[var(--docs-muted)]">{{ i18n.t('home.hero.commandLabel') }}</div>
              <code class="block break-words [overflow-wrap:anywhere]">pnpm dlx &#64;sanring/cli add button dialog toast</code>
            </div>
            <div class="mt-5 grid gap-3 border-t border-[var(--docs-border)] pt-5 text-sm text-[var(--docs-muted)]">
              <div class="flex items-center justify-between gap-4">
                <span>{{ i18n.t('home.hero.output.one') }}</span>
                <span class="font-mono text-[var(--docs-fg)]">03</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span>{{ i18n.t('home.hero.output.two') }}</span>
                <span class="font-mono text-[var(--docs-fg)]">source</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span>{{ i18n.t('home.hero.output.three') }}</span>
                <span class="font-mono text-[var(--docs-success-fg)]">ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="relative z-10 grid gap-8 lg:grid-cols-12 lg:gap-12" aria-labelledby="home-features-title">
        <header class="lg:col-span-4 lg:pt-3">
          <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
            {{ i18n.t('home.features.eyebrow') }}
          </p>
          <h2 id="home-features-title" class="m-0 mt-5 max-w-[400px] text-[clamp(2.5rem,4.6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--docs-fg)] max-[520px]:text-[2.75rem]">
            {{ i18n.t('home.features.title') }}
          </h2>
        </header>

        <div class="lg:col-span-8">
          <article class="flex min-h-[360px] flex-col justify-between border border-[color-mix(in_srgb,var(--docs-accent)_40%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,var(--docs-panel))] p-8 lg:min-h-[420px] lg:p-12 max-[520px]:p-6">
            <div class="flex items-start justify-between gap-4">
              <span class="font-mono text-sm font-semibold text-[var(--docs-accent-strong)]">{{ i18n.t('home.features.primaryLabel') }}</span>
              <span class="text-[var(--docs-accent-strong)]"><svg class="size-6" lucideCode2></svg></span>
            </div>
            <div>
              <h3 class="m-0 max-w-[680px] text-[clamp(2.75rem,5.5vw,6rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[var(--docs-fg)] max-[520px]:text-[2.75rem]">
                {{ i18n.t('home.feature.primary.title') }}
              </h3>
              <p class="m-0 mt-7 max-w-[650px] text-lg leading-8 text-[var(--docs-muted)] max-[520px]:mt-6 max-[520px]:text-base max-[520px]:leading-7">
                {{ i18n.t('home.feature.primary.description') }}
              </p>
            </div>
          </article>

          <div class="mt-5 grid gap-5 md:grid-cols-2">
            @for (feature of features; track feature.titleKey) {
              <article class="border-t-2 border-[var(--docs-border-strong)] pt-5">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-[var(--docs-accent-strong)]">
                    @switch (feature.icon) {
                      @case ('layers') {
                        <svg class="size-5" lucideLayers3></svg>
                      }
                      @case ('code') {
                        <svg class="size-5" lucideCode2></svg>
                      }
                    }
                  </span>
                  <span class="font-mono text-xs text-[var(--docs-muted)]">{{ feature.index }}</span>
                </div>
                <h3 class="m-0 mt-6 text-xl font-semibold text-[var(--docs-fg)]">{{ i18n.t(feature.titleKey) }}</h3>
                <p class="m-0 mt-3 text-base leading-7 text-[var(--docs-muted)]">{{ i18n.t(feature.descriptionKey) }}</p>
              </article>
            }
          </div>
        </div>
      </section>

      <section class="relative z-10 border-t-2 border-[var(--docs-fg)] pt-8" aria-labelledby="home-components-title">
        <div class="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <header class="lg:col-span-4">
            <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
              {{ i18n.t('home.components.eyebrow') }}
            </p>
            <h2 id="home-components-title" class="m-0 mt-5 max-w-[440px] text-[clamp(2.75rem,5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-[var(--docs-fg)] max-[520px]:text-[2.75rem]">
              {{ i18n.t('home.components.title') }}
            </h2>
            <p class="m-0 mt-7 max-w-[420px] text-lg leading-8 text-[var(--docs-muted)] max-[520px]:mt-5 max-[520px]:text-base max-[520px]:leading-7">
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
          </header>

          <div class="lg:col-span-8">
            <div class="flex items-end justify-between gap-4 border-b border-[var(--docs-border)] pb-5">
              <div>
                <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-muted)]">{{ i18n.t('home.components.panelEyebrow') }}</p>
                <p class="m-0 mt-2 text-2xl font-semibold text-[var(--docs-fg)] max-[520px]:text-xl">{{ i18n.t('home.components.panelTitle') }}</p>
              </div>
              <p class="m-0 font-mono text-4xl font-semibold text-[var(--docs-accent-strong)] max-[520px]:text-3xl">{{ componentCount }}</p>
            </div>

            <nav
              sanringScrollArea
              [hideScrollbar]="true"
              class="mt-5 grid max-h-[520px] grid-cols-3 gap-x-5 gap-y-3 pr-1 max-[980px]:grid-cols-2 max-[520px]:max-h-[460px] max-[480px]:grid-cols-1"
              aria-label="Component shortcuts"
            >
              @for (item of componentItems; track item.id) {
                @if (item.disabled) {
                  <span class="flex min-h-14 min-w-0 items-center gap-3 border-b border-[var(--docs-border)] px-2 py-3 text-base font-semibold text-[color-mix(in_srgb,var(--docs-muted)_45%,transparent)]">
                    <span class="min-w-0 truncate">{{ i18n.t(item.labelKey) }}</span>
                  </span>
                } @else {
                  <a
                    class="flex min-h-14 min-w-0 items-center justify-between gap-3 border-b border-[var(--docs-border)] px-2 py-3 text-base font-semibold text-[var(--docs-fg)] no-underline transition-colors hover:border-[var(--docs-accent)] hover:text-[var(--docs-accent-strong)] max-[520px]:px-1"
                    [routerLink]="item.path"
                  >
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

  protected readonly features: (HomeFeature & { index: string })[] = [
    {
      titleKey: 'home.feature.compose.title',
      descriptionKey: 'home.feature.compose.description',
      icon: 'layers',
      index: '02',
    },
    {
      titleKey: 'home.feature.angular.title',
      descriptionKey: 'home.feature.angular.description',
      icon: 'code',
      index: '03',
    },
  ];
}
