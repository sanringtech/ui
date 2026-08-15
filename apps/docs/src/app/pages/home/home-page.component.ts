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
  index: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: 'layers' | 'code';
}

interface HomeWorkflowRow {
  labelKey: TranslationKey;
  value: string;
  state?: 'ready';
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
    <main class="mx-auto flex w-[80vw] max-w-[1760px] flex-col gap-24 overflow-hidden pb-28 pt-12 max-[860px]:w-full max-[860px]:gap-16 max-[860px]:px-5 max-[860px]:pt-9 max-[520px]:gap-12 max-[520px]:px-4 max-[520px]:pb-20">
      <section
        class="grid overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] shadow-[var(--docs-shadow-strong)] lg:grid-cols-12"
        aria-labelledby="home-title"
      >
        <div class="relative flex min-h-[580px] flex-col justify-between overflow-hidden bg-[var(--docs-accent)] p-8 lg:col-span-7 lg:min-h-[650px] lg:p-12 max-[860px]:min-h-[540px] max-[520px]:min-h-[500px] max-[520px]:p-6">
          <div class="pointer-events-none absolute -bottom-40 -right-32 size-[34rem] rounded-full border-[38px] border-[color-mix(in_srgb,var(--docs-accent-fg)_14%,transparent)] max-[520px]:size-[24rem]" aria-hidden="true"></div>
          <div class="pointer-events-none absolute -bottom-28 -right-12 size-64 rounded-full border border-[color-mix(in_srgb,var(--docs-accent-fg)_28%,transparent)] max-[520px]:size-48" aria-hidden="true"></div>

          <div class="relative z-10 flex items-center justify-between gap-4">
            <span class="inline-flex h-9 items-center rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-accent-fg)_32%,transparent)] bg-[color-mix(in_srgb,var(--docs-accent-fg)_10%,transparent)] px-3 font-mono text-sm font-semibold text-[var(--docs-accent-fg)] max-[520px]:h-8 max-[520px]:text-xs">
              {{ releaseVersion }}
            </span>
            <a
              class="inline-flex h-9 items-center gap-2 rounded-[var(--sanring-radius)] px-2 text-sm font-semibold text-[var(--docs-accent-fg)] no-underline opacity-80 transition-opacity hover:opacity-100 max-[520px]:text-xs"
              routerLink="/version-notes"
            >
              <svg class="size-4" lucideRocket></svg>
              <span>{{ i18n.t('home.release.label') }}</span>
              <svg class="size-4" lucideChevronRight></svg>
            </a>
          </div>

          <div class="relative z-10 max-w-[820px]">
            <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[color-mix(in_srgb,var(--docs-accent-fg)_72%,transparent)]">
              {{ i18n.t('home.eyebrow') }}
            </p>
            <h1 id="home-title" class="m-0 mt-5 max-w-[780px] text-[clamp(3rem,4.8vw,5.25rem)] font-semibold leading-[0.97] tracking-[-0.055em] text-[var(--docs-accent-fg)] max-[860px]:text-[clamp(3rem,10vw,5rem)] max-[520px]:mt-4 max-[520px]:text-[3.15rem]">
              {{ i18n.t('home.title') }}
            </h1>
            <p class="m-0 mt-7 max-w-[650px] text-[20px] leading-[1.6] text-[color-mix(in_srgb,var(--docs-accent-fg)_78%,transparent)] max-[860px]:text-lg max-[520px]:mt-6 max-[520px]:text-base">
              {{ i18n.t('home.description') }}
            </p>
            <div class="mt-8 flex flex-wrap gap-3 max-[520px]:mt-7 max-[520px]:grid max-[520px]:grid-cols-1">
              <a
                sanringBtn
                class="min-h-12 min-w-[160px] rounded-[var(--sanring-radius)] border-[var(--docs-accent-fg)] bg-[var(--docs-accent-fg)] px-5 text-base font-semibold text-[var(--docs-accent)] hover:bg-[color-mix(in_srgb,var(--docs-accent-fg)_88%,white)] max-[520px]:w-full max-[520px]:justify-center"
                routerLink="/components"
                variant="default"
                size="md"
              >
                {{ i18n.t('home.actions.browseComponents') }}
                <svg class="size-4" lucideChevronRight></svg>
              </a>
              <a
                sanringBtn
                class="min-h-12 min-w-[140px] rounded-[var(--sanring-radius)] border-[color-mix(in_srgb,var(--docs-accent-fg)_34%,transparent)] bg-transparent px-5 text-base font-semibold text-[var(--docs-accent-fg)] hover:bg-[color-mix(in_srgb,var(--docs-accent-fg)_12%,transparent)] max-[520px]:w-full max-[520px]:justify-center"
                routerLink="/components/button"
                variant="outline"
                size="md"
              >
                {{ i18n.t('home.actions.viewExample') }}
              </a>
            </div>
          </div>
        </div>

        <div class="flex min-h-[580px] flex-col justify-between bg-[var(--docs-panel)] p-8 lg:col-span-5 lg:min-h-[650px] lg:p-10 max-[860px]:min-h-0 max-[520px]:p-6">
          <div>
            <div class="flex items-center justify-between gap-4 border-b border-[var(--docs-border)] pb-5">
              <div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
                <svg class="size-4" lucideTerminalSquare></svg>
                {{ i18n.t('home.hero.workflowEyebrow') }}
              </div>
              <span class="inline-flex items-center gap-2 rounded-full px-2 text-xs font-semibold text-[var(--docs-success-fg)]">
                <span class="size-2 rounded-full bg-[var(--docs-success-fg)]"></span>
                {{ i18n.t('home.hero.status') }}
              </span>
            </div>

            <h2 class="m-0 mt-12 max-w-[450px] text-[clamp(2.25rem,3.6vw,4.1rem)] font-semibold leading-[1.01] tracking-[-0.05em] text-[var(--docs-fg)] max-[520px]:mt-10 max-[520px]:text-[2.45rem]">
              {{ i18n.t('home.hero.workflowTitle') }}
            </h2>
            <p class="m-0 mt-5 max-w-[430px] text-base leading-7 text-[var(--docs-muted)]">
              {{ i18n.t('home.hero.workflowDescription') }}
            </p>
          </div>

          <div class="mt-12">
            <div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-code)] p-5 font-mono text-sm leading-7 text-[var(--docs-code-fg)] max-[520px]:p-4 max-[520px]:text-[13px]">
              <div class="mb-4 text-[var(--docs-muted)]">{{ i18n.t('home.hero.commandLabel') }}</div>
              <code class="block break-words [overflow-wrap:anywhere]">pnpm dlx &#64;sanring/cli add button dialog toast</code>
            </div>
            <div class="mt-5 grid gap-3 border-t border-[var(--docs-border)] pt-5 text-sm text-[var(--docs-muted)]">
              @for (row of workflowRows; track row.labelKey) {
                <div class="flex items-center justify-between gap-4">
                  <span>{{ i18n.t(row.labelKey) }}</span>
                  <span [class]="row.state === 'ready' ? 'font-mono text-[var(--docs-success-fg)]' : 'font-mono text-[var(--docs-fg)]'">{{ row.value }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-5 lg:grid-cols-12 lg:gap-6" aria-labelledby="home-features-title">
        <article class="relative flex min-h-[390px] flex-col justify-between overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-accent)_40%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,var(--docs-panel))] p-8 lg:col-span-7 lg:min-h-[450px] lg:p-10 max-[520px]:p-6">
          <div class="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full border-[26px] border-[color-mix(in_srgb,var(--docs-accent)_12%,transparent)]" aria-hidden="true"></div>
          <div class="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
                {{ i18n.t('home.features.eyebrow') }}
              </p>
              <h2 id="home-features-title" class="m-0 mt-5 max-w-[640px] text-[clamp(2.5rem,4vw,4.45rem)] font-semibold leading-[0.99] tracking-[-0.05em] text-[var(--docs-fg)] max-[520px]:text-[2.65rem]">
                {{ i18n.t('home.features.title') }}
              </h2>
            </div>
            <span class="shrink-0 rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-accent)_36%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_12%,var(--docs-surface))] p-2 text-[var(--docs-accent-strong)]">
              <svg class="size-5" lucideCode2></svg>
            </span>
          </div>
          <div class="relative z-10 mt-12 max-w-[620px] max-[520px]:mt-8">
            <p class="m-0 text-lg leading-8 text-[var(--docs-muted)] max-[520px]:text-base max-[520px]:leading-7">
              {{ i18n.t('home.features.description') }}
            </p>
            <div class="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
              <span>{{ i18n.t('home.features.trace.source') }}</span>
              <span aria-hidden="true">→</span>
              <span>{{ i18n.t('home.features.trace.compose') }}</span>
              <span aria-hidden="true">→</span>
              <span>{{ i18n.t('home.features.trace.ship') }}</span>
            </div>
          </div>
        </article>

        <div class="grid gap-5 lg:col-span-5">
          @for (feature of features; track feature.titleKey) {
            <article class="flex min-h-[204px] items-start gap-5 rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-6 max-[520px]:min-h-0 max-[520px]:p-5">
              <div class="flex shrink-0 flex-col items-center gap-3">
                <span class="font-mono text-xs font-semibold text-[var(--docs-accent-strong)]">{{ feature.index }}</span>
                <span class="rounded-[var(--sanring-radius-sm)] border border-[color-mix(in_srgb,var(--docs-accent)_28%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,var(--docs-elevated))] p-2 text-[var(--docs-accent-strong)]">
                  @switch (feature.icon) {
                    @case ('layers') {
                      <svg class="size-5" lucideLayers3></svg>
                    }
                    @case ('code') {
                      <svg class="size-5" lucideCode2></svg>
                    }
                  }
                </span>
              </div>
              <div>
                <h3 class="m-0 text-xl font-semibold text-[var(--docs-fg)]">{{ i18n.t(feature.titleKey) }}</h3>
                <p class="m-0 mt-3 text-base leading-7 text-[var(--docs-muted)]">{{ i18n.t(feature.descriptionKey) }}</p>
              </div>
            </article>
          }
        </div>
      </section>

      <section class="grid gap-10 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:gap-16" aria-labelledby="home-components-title">
        <div class="lg:sticky lg:top-28 lg:self-start">
          <p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-accent-strong)]">
            {{ i18n.t('home.components.eyebrow') }}
          </p>
          <h2 id="home-components-title" class="m-0 mt-5 max-w-[440px] text-[clamp(2.25rem,3.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--docs-fg)] max-[520px]:text-[2.65rem]">
            {{ i18n.t('home.components.title') }}
          </h2>
          <p class="m-0 mt-6 max-w-[420px] text-lg leading-8 text-[var(--docs-muted)] max-[520px]:mt-5 max-[520px]:text-base max-[520px]:leading-7">
            {{ i18n.t('home.components.description') }}
          </p>
          <a
            sanringBtn
            class="mt-8 min-h-11 rounded-[var(--sanring-radius)] font-semibold max-[520px]:mt-6"
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
              <p class="m-0 mt-2 text-2xl font-semibold text-[var(--docs-fg)] max-[520px]:text-xl">{{ i18n.t('home.components.panelTitle') }}</p>
            </div>
            <p class="m-0 font-mono text-4xl font-semibold text-[var(--docs-accent-strong)] max-[520px]:text-3xl">{{ componentCount }}</p>
          </div>

          <nav
            sanringScrollArea
            [hideScrollbar]="true"
            class="grid max-h-[520px] grid-cols-3 gap-3 pr-1 max-[980px]:grid-cols-2 max-[520px]:max-h-[460px] max-[480px]:grid-cols-1"
            aria-label="Component shortcuts"
          >
            @for (item of componentItems; track item.id) {
              @if (item.disabled) {
                <span class="flex min-h-14 min-w-0 items-center gap-3 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-3 text-base font-semibold text-[color-mix(in_srgb,var(--docs-muted)_45%,transparent)] max-[520px]:px-3">
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
                    <span class="size-2 shrink-0 rounded-full bg-[var(--docs-accent-strong)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--docs-accent)_18%,transparent)]" aria-hidden="true"></span>
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

  protected readonly workflowRows: HomeWorkflowRow[] = [
    {
      labelKey: 'home.hero.output.one',
      value: '03',
    },
    {
      labelKey: 'home.hero.output.two',
      value: 'source',
    },
    {
      labelKey: 'home.hero.output.three',
      value: 'ready',
      state: 'ready',
    },
  ];

  protected readonly features: HomeFeature[] = [
    {
      index: '02',
      titleKey: 'home.feature.composable.title',
      descriptionKey: 'home.feature.composable.description',
      icon: 'layers',
    },
    {
      index: '03',
      titleKey: 'home.feature.angular.title',
      descriptionKey: 'home.feature.angular.description',
      icon: 'code',
    },
  ];
}
