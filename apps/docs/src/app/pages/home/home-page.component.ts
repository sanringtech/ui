import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideBlocks,
  LucideBox,
  LucideChevronRight,
  LucideCode2,
  LucideLayers3,
  LucidePalette,
  LucideSparkles,
  LucideTerminalSquare,
} from '@lucide/angular';
import { ButtonDirective, ScrollAreaDirective } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';
import { TranslationKey } from '../../i18n/translations';
import { docsComponentItems } from '../../navigation/docs-navigation';

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
    LucideSparkles,
    LucideTerminalSquare,
  ],
  template: `
    <section class="mx-auto flex w-full max-w-[1180px] flex-col gap-16 px-8 pb-24 pt-14 max-[860px]:gap-12 max-[860px]:px-5 max-[860px]:pt-9">
      <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <div class="min-w-0">
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
          class="min-w-0 rounded-[8px] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-5 shadow-[0_24px_80px_color-mix(in_srgb,var(--docs-bg)_72%,transparent)]"
        >
          <div class="flex items-center justify-between border-b border-[var(--docs-border)] pb-4">
            <div>
              <p class="m-0 text-sm font-medium text-[var(--docs-muted)]">
                {{ i18n.t('home.snapshot.eyebrow') }}
              </p>
              <h2 class="m-0 mt-1 text-xl font-semibold text-[var(--docs-fg)]">
                {{ i18n.t('home.snapshot.title') }}
              </h2>
            </div>
            <div class="rounded-[6px] border border-[color-mix(in_srgb,var(--docs-accent)_35%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_10%,var(--docs-surface))] p-2 text-[var(--docs-accent-strong)]">
              <svg class="size-5" lucideBlocks></svg>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 py-5 max-[1180px]:grid-cols-1">
            @for (highlight of highlights; track highlight.labelKey) {
              <div class="min-w-0 rounded-[8px] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4">
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
          </div>

          <div class="rounded-[8px] border border-[var(--docs-border)] bg-[var(--docs-code)] p-4 font-mono text-sm leading-7 text-[var(--docs-fg)]">
            <div class="flex items-center gap-2 text-[var(--docs-muted)]">
              <svg class="size-4" lucideTerminalSquare></svg>
              {{ i18n.t('home.install.label') }}
            </div>
            <pre class="m-0 mt-3 overflow-x-auto"><code>pnpm dlx &#64;sanring/cli add button dialog toast</code></pre>
          </div>
        </div>
      </div>

      <section>
        <div class="mb-6 flex items-end justify-between gap-6 max-[720px]:block">
          <div>
            <p class="m-0 text-sm font-semibold uppercase text-[var(--docs-muted)]">
              {{ i18n.t('home.highlights.eyebrow') }}
            </p>
            <h2 class="m-0 mt-2 text-[30px] font-semibold leading-tight text-[var(--docs-fg)]">
              {{ i18n.t('home.highlights.title') }}
            </h2>
          </div>
          <p class="m-0 max-w-[520px] text-base leading-7 text-[var(--docs-muted)] max-[720px]:mt-3">
            {{ i18n.t('home.highlights.description') }}
          </p>
        </div>

        <div class="grid grid-cols-4 gap-4 max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
          @for (feature of features; track feature.titleKey) {
            <article class="rounded-[8px] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-5">
              <div class="mb-5 inline-flex rounded-[6px] border border-[color-mix(in_srgb,var(--docs-accent)_28%,var(--docs-border))] bg-[color-mix(in_srgb,var(--docs-accent)_8%,var(--docs-elevated))] p-2 text-[var(--docs-accent-strong)]">
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

      <section class="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
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

        <div class="rounded-[8px] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-4">
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
              <a
                class="rounded-[8px] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-3 text-sm font-semibold text-[var(--docs-fg)] no-underline transition-colors hover:border-[var(--docs-border-strong)] hover:bg-[var(--docs-elevated)]"
                [routerLink]="item.path"
              >
                {{ i18n.t(item.labelKey) }}
              </a>
            }
          </nav>
        </div>
      </section>
    </section>
  `,
})
export class HomePageComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly componentCount = docsComponentItems.length;
  protected readonly componentItems = docsComponentItems.map((item) => ({
    id: item.id,
    path: item.path,
    labelKey: item.labelKey,
  }));

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
