import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideBlocks,
  LucideBox,
  LucideChevronRight,
  LucideCode2,
  LucideLayers3,
  LucidePalette,
  LucideRocket,
  LucideSparkles,
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
  icon: 'layers' | 'palette' | 'code' | 'box';
}

interface HomeHighlight {
  labelKey: TranslationKey;
  value: string;
  descriptionKey: TranslationKey;
  kind?: 'package';
}

interface HomeVisualMetric {
  labelKey: TranslationKey;
  value: string;
}

@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    ButtonDirective,
    ScrollAreaDirective,
    LucideBlocks,
    LucideBox,
    LucideChevronRight,
    LucideCode2,
    LucideLayers3,
    LucidePalette,
    LucideRocket,
    LucideSparkles,
    LucideTerminalSquare,
  ],
  template: `
    <section class="relative isolate mx-auto flex w-full max-w-[1280px] flex-col gap-16 overflow-hidden px-8 pb-24 pt-14 max-[860px]:gap-12 max-[860px]:px-5 max-[860px]:pt-9">
      <div class="home-particles" aria-hidden="true"></div>

      <div class="relative z-10 grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(520px,1.05fr)] max-[1080px]:grid-cols-1">
        <div class="min-w-0">
          <div class="mb-6 flex flex-wrap items-center gap-3">
            <span
              class="inline-flex h-9 items-center rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-elevated)] px-3 font-mono text-sm font-semibold text-[var(--docs-fg)] shadow-[0_10px_30px_color-mix(in_srgb,var(--docs-bg)_52%,transparent)]"
            >
              {{ releaseVersion }}
            </span>
            <a
              class="inline-flex h-9 items-center gap-2 rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-accent)_30%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_10%,var(--docs-elevated))] px-3 text-sm font-semibold text-[var(--docs-accent-strong)] no-underline transition-colors hover:border-[color-mix(in_srgb,var(--docs-accent)_55%,var(--docs-border))] hover:bg-[color-mix(in_srgb,var(--docs-accent)_16%,var(--docs-elevated))]"
              routerLink="/changelog"
            >
              <svg class="size-4" lucideRocket></svg>
              <span>{{ i18n.t('home.release.label') }}</span>
              <svg class="size-4" lucideChevronRight></svg>
            </a>
          </div>

          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--docs-accent)_42%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_9%,var(--docs-surface))] px-3 py-1 text-sm font-medium text-[var(--docs-muted)]"
          >
            <svg class="size-4 text-[var(--docs-accent-strong)]" lucideSparkles></svg>
            {{ i18n.t('home.eyebrow') }}
          </div>

          <h1 class="m-0 max-w-[760px] text-[56px] font-semibold leading-[1.04] tracking-normal text-[var(--docs-fg)] max-[860px]:text-[40px] max-[520px]:text-[34px]">
            {{ i18n.t('home.title') }}
          </h1>

          <p class="mb-0 mt-6 max-w-[680px] text-[18px] leading-[1.75] text-[var(--docs-muted)] max-[520px]:text-base">
            {{ i18n.t('home.description') }}
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              sanringBtn
              class="min-w-[124px] border-[var(--docs-accent)] bg-[var(--docs-accent)] font-semibold text-[var(--docs-accent-fg)] hover:bg-[var(--docs-accent-strong)]"
              routerLink="/components"
              variant="default"
              size="md"
            >
              {{ i18n.t('home.actions.browseComponents') }}
              <svg class="size-4" lucideChevronRight></svg>
            </a>
            <a
              sanringBtn
              class="min-w-[112px] font-semibold"
              routerLink="/components/button"
              variant="outline"
              size="md"
            >
              {{ i18n.t('home.actions.viewExample') }}
            </a>
          </div>
        </div>

        <div
          class="relative min-h-[430px] min-w-0 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-5 shadow-[0_24px_80px_color-mix(in_srgb,var(--docs-bg)_72%,transparent)]"
        >
          <div
            class="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(color-mix(in_srgb,var(--docs-border)_44%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--docs-border)_44%,transparent)_1px,transparent_1px)] [background-size:28px_28px]"
            aria-hidden="true"
          ></div>

          <div class="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p class="m-0 text-sm font-medium text-[var(--docs-muted)]">
                {{ i18n.t('home.visual.eyebrow') }}
              </p>
              <h2 class="m-0 mt-1 text-xl font-semibold text-[var(--docs-fg)]">
                {{ i18n.t('home.visual.title') }}
              </h2>
            </div>
            <div class="inline-flex items-center gap-2 rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-success-fg)_30%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-success-bg)_70%,var(--docs-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--docs-success-fg)]">
              <span
                class="size-2 rounded-full bg-[var(--docs-success-fg)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--docs-success-fg)_16%,transparent)]"
                aria-hidden="true"
              ></span>
              {{ i18n.t('home.visual.status') }}
            </div>
          </div>

          <div class="relative z-10 mt-8 grid gap-4">
            <div class="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-stretch gap-4 max-[1180px]:grid-cols-1">
              <div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[color-mix(in_srgb,var(--docs-surface)_82%,transparent)] p-4 backdrop-blur">
                <div class="flex items-center gap-2 text-sm font-semibold text-[var(--docs-fg)]">
                  <svg class="size-4 text-[var(--docs-accent-strong)]" lucideBlocks></svg>
                  {{ i18n.t('home.visual.registry') }}
                </div>
                <div class="mt-4 grid gap-2">
                  @for (node of registryNodes; track node) {
                    <div
                      class="flex items-center justify-between gap-3 rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] bg-[var(--docs-bg)] px-3 py-2"
                    >
                      <span class="min-w-0 truncate font-mono text-xs text-[var(--docs-muted)]">
                        {{ node }}
                      </span>
                      <span class="size-1.5 rounded-full bg-[var(--docs-accent-strong)]"></span>
                    </div>
                  }
                </div>
              </div>

              <div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[color-mix(in_srgb,var(--docs-code)_86%,transparent)] p-4 font-mono text-sm leading-7 text-[var(--docs-fg)] backdrop-blur">
                <div class="flex items-center gap-2 text-[var(--docs-muted)]">
                  <svg class="size-4" lucideTerminalSquare></svg>
                  {{ i18n.t('home.visual.command') }}
                </div>
                <div
                  class="mt-3 rounded-[var(--sanring-radius-sm)] border border-[var(--docs-border)] bg-[var(--docs-bg)] px-3 py-2 text-sm leading-6"
                >
                  <code class="break-words [overflow-wrap:anywhere]">
                    pnpm dlx &#64;sanring/cli add button dialog toast
                  </code>
                </div>
                <div class="mt-3 grid gap-1 border-t border-[var(--docs-border)] pt-3 text-xs text-[var(--docs-muted)]">
                  <span>{{ i18n.t('home.visual.output.one') }}</span>
                  <span>{{ i18n.t('home.visual.output.two') }}</span>
                  <span class="text-[var(--docs-success-fg)]">{{ i18n.t('home.visual.output.three') }}</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3 max-[520px]:grid-cols-1">
              @for (metric of visualMetrics; track metric.labelKey) {
                <div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[color-mix(in_srgb,var(--docs-surface)_82%,transparent)] p-3 backdrop-blur">
                  <p class="m-0 text-[20px] font-semibold leading-none text-[var(--docs-accent-strong)]">
                    {{ metric.value }}
                  </p>
                  <p class="m-0 mt-2 text-xs font-medium text-[var(--docs-muted)]">
                    {{ i18n.t(metric.labelKey) }}
                  </p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <section
        class="relative z-10 grid gap-4 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-4 lg:grid-cols-[minmax(240px,0.9fr)_repeat(3,minmax(0,1fr))] max-[900px]:grid-cols-1"
        aria-labelledby="home-snapshot-title"
      >
        <div class="flex min-w-0 items-center gap-3 border-r border-[var(--docs-border)] pr-4 max-[900px]:border-r-0 max-[900px]:border-b max-[900px]:pb-4 max-[900px]:pr-0">
          <div class="rounded-[var(--sanring-radius-sm)] border border-[color-mix(in_srgb,var(--docs-accent)_35%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_10%,var(--docs-surface))] p-2 text-[var(--docs-accent-strong)]">
            <svg class="size-5" lucideBlocks></svg>
          </div>
          <div>
            <p id="home-snapshot-title" class="m-0 text-sm font-medium text-[var(--docs-muted)]">
              {{ i18n.t('home.snapshot.eyebrow') }}
            </p>
            <h2 class="m-0 mt-1 text-xl font-semibold text-[var(--docs-fg)]">
              {{ i18n.t('home.snapshot.title') }}
            </h2>
          </div>
        </div>

        @for (highlight of highlights; track highlight.labelKey) {
          <div class="min-w-0 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4">
            @if (highlight.kind === 'package') {
              <p class="m-0 text-sm font-medium text-[var(--docs-fg)]">
                {{ i18n.t(highlight.labelKey) }}
              </p>
              <p
                class="m-0 mt-2 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-sm font-semibold leading-tight text-[var(--docs-accent-strong)]"
                [title]="highlight.value"
              >
                {{ highlight.value }}
              </p>
            } @else {
              <p class="m-0 min-w-0 whitespace-nowrap text-[22px] font-semibold leading-tight text-[var(--docs-accent-strong)]">
                {{ highlight.value }}
              </p>
              <p class="m-0 mt-1 text-sm font-medium text-[var(--docs-fg)]">
                {{ i18n.t(highlight.labelKey) }}
              </p>
            }
            <p class="m-0 mt-3 text-sm leading-6 text-[var(--docs-muted)]">
              {{ i18n.t(highlight.descriptionKey) }}
            </p>
          </div>
        }
      </section>

      <section class="relative z-10">
        <div class="mb-7 max-w-[660px]">
          <p class="m-0 text-sm font-semibold uppercase text-[var(--docs-muted)]">
            {{ i18n.t('home.highlights.eyebrow') }}
          </p>
          <h2 class="m-0 mt-2 text-[30px] font-semibold leading-tight text-[var(--docs-fg)]">
            {{ i18n.t('home.highlights.title') }}
          </h2>
          <p class="m-0 mt-3 text-base leading-7 text-[var(--docs-muted)]">
            {{ i18n.t('home.highlights.description') }}
          </p>
        </div>

        <div class="grid grid-cols-4 gap-4 max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
          @for (feature of features; track feature.titleKey) {
            <article class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-5">
              <div class="mb-5 inline-flex rounded-[var(--sanring-radius-sm)] border border-[color-mix(in_srgb,var(--docs-accent)_28%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,var(--docs-elevated))] p-2 text-[var(--docs-accent-strong)]">
                @switch (feature.icon) {
                  @case ('layers') {
                    <svg class="size-5" lucideLayers3></svg>
                  }
                  @case ('palette') {
                    <svg class="size-5" lucidePalette></svg>
                  }
                  @case ('code') {
                    <svg class="size-5" lucideCode2></svg>
                  }
                  @case ('box') {
                    <svg class="size-5" lucideBox></svg>
                  }
                }
              </div>
              <h3 class="m-0 text-lg font-semibold text-[var(--docs-fg)]">
                {{ i18n.t(feature.titleKey) }}
              </h3>
              <p class="m-0 mt-3 text-sm leading-6 text-[var(--docs-muted)]">
                {{ i18n.t(feature.descriptionKey) }}
              </p>
            </article>
          }
        </div>
      </section>

      <section class="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <p class="m-0 text-sm font-semibold uppercase text-[var(--docs-muted)]">
            {{ i18n.t('home.components.eyebrow') }}
          </p>
          <h2 class="m-0 mt-2 text-[30px] font-semibold leading-tight text-[var(--docs-fg)]">
            {{ i18n.t('home.components.title') }}
          </h2>
          <p class="m-0 mt-4 text-base leading-7 text-[var(--docs-muted)]">
            {{ i18n.t('home.components.descriptionPrefix') }} {{ componentCount }}
            {{ i18n.t('home.components.descriptionSuffix') }}
          </p>
        </div>

        <div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-4">
          <div class="mb-4 flex items-center justify-between gap-4 border-b border-[var(--docs-border)] pb-4">
            <p class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
              {{ i18n.t('home.components.panelTitle') }}
            </p>
            <p class="m-0 text-sm text-[var(--docs-muted)]">
              {{ componentCount }}
            </p>
          </div>

          <nav
            sanringScrollArea
            [hideScrollbar]="true"
            class="grid max-h-[360px] grid-cols-3 gap-3 pr-1 max-[760px]:grid-cols-2 max-[480px]:grid-cols-1"
            aria-label="Component shortcuts"
          >
            @for (item of componentItems; track item.id) {
              @if (item.disabled) {
                <span
                  class="flex min-w-0 items-center gap-3 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-3 text-sm font-semibold text-[color-mix(in_srgb,var(--docs-muted)_45%,transparent)]"
                >
                  <span class="min-w-0 truncate">{{ i18n.t(item.labelKey) }}</span>
                </span>
              } @else {
                <a
                  class="flex min-w-0 items-center justify-between gap-3 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-3 text-sm font-semibold text-[var(--docs-fg)] no-underline transition-colors hover:border-[var(--docs-border-strong)] hover:bg-[var(--docs-elevated)]"
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
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .home-particles {
        pointer-events: none;
        position: absolute;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        opacity: 0.64;
        mask-image: linear-gradient(to bottom, black 0%, black 58%, transparent 100%);
      }

      .home-particles::before,
      .home-particles::after {
        content: '';
        position: absolute;
        inset: -18% -10% 34%;
        background-image:
          radial-gradient(circle, color-mix(in srgb, var(--docs-accent) 48%, transparent) 0 1px, transparent 1.5px),
          radial-gradient(circle, color-mix(in srgb, var(--docs-fg) 22%, transparent) 0 1px, transparent 1.5px);
        background-position:
          0 0,
          24px 38px;
        background-size:
          88px 88px,
          132px 132px;
        transform: translate3d(0, 0, 0);
        animation: home-particles-drift 34s linear infinite;
      }

      .home-particles::after {
        inset: -12% -16% 28%;
        opacity: 0.52;
        background-size:
          118px 118px,
          172px 172px;
        background-position:
          42px 18px,
          10px 64px;
        animation-duration: 48s;
        animation-direction: reverse;
      }

      @keyframes home-particles-drift {
        from {
          transform: translate3d(0, 0, 0);
        }

        to {
          transform: translate3d(42px, 56px, 0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .home-particles::before,
        .home-particles::after {
          animation: none;
        }
      }

      @media (max-width: 640px) {
        .home-particles {
          opacity: 0.42;
        }

        .home-particles::before,
        .home-particles::after {
          bottom: 48%;
          background-size:
            118px 118px,
            164px 164px;
        }
      }
    `,
  ],
})
export class HomePageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly releaseVersion = 'v0.9.1';

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

  protected readonly registryNodes = ['button', 'dialog', 'toast'];
  protected readonly visualMetrics: HomeVisualMetric[] = [
    {
      labelKey: 'home.snapshot.components.label',
      value: String(this.componentCount),
    },
    {
      labelKey: 'home.snapshot.registry.label',
      value: 'registry',
    },
    {
      labelKey: 'home.snapshot.cli.label',
      value: 'CLI',
    },
  ];

  protected readonly highlights: HomeHighlight[] = [
    {
      labelKey: 'home.snapshot.components.label',
      value: String(this.componentCount),
      descriptionKey: 'home.snapshot.components.description',
    },
    {
      labelKey: 'home.snapshot.registry.label',
      value: '1',
      descriptionKey: 'home.snapshot.registry.description',
    },
    {
      labelKey: 'home.snapshot.cli.label',
      value: '@sanring/cli',
      descriptionKey: 'home.snapshot.cli.description',
      kind: 'package',
    },
  ];

  protected readonly features: HomeFeature[] = [
    {
      titleKey: 'home.feature.composable.title',
      descriptionKey: 'home.feature.composable.description',
      icon: 'layers',
    },
    {
      titleKey: 'home.feature.theme.title',
      descriptionKey: 'home.feature.theme.description',
      icon: 'palette',
    },
    {
      titleKey: 'home.feature.angular.title',
      descriptionKey: 'home.feature.angular.description',
      icon: 'code',
    },
    {
      titleKey: 'home.feature.registry.title',
      descriptionKey: 'home.feature.registry.description',
      icon: 'box',
    },
  ];
}
