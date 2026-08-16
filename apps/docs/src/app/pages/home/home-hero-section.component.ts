import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChevronRight, LucideLayers3, LucideRocket } from '@lucide/angular';
import { ButtonDirective } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-home-hero-section',
  standalone: true,
  imports: [RouterLink, ButtonDirective, LucideChevronRight, LucideLayers3, LucideRocket],
  template: `
    <section
      class="grid gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start lg:gap-20"
      aria-labelledby="home-title"
    >
      <div class="min-w-0">
        <div class="flex items-center justify-between gap-4">
          <span
            class="inline-flex h-8 items-center rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-elevated)] px-3 font-mono text-xs font-semibold text-[var(--docs-fg)]"
          >
            {{ releaseVersion }}
          </span>
          <a
            class="inline-flex min-w-0 items-center gap-2 rounded-[var(--sanring-radius)] px-2 py-2 text-sm font-semibold text-[var(--docs-accent-strong)] no-underline transition-colors hover:bg-[var(--docs-elevated)] max-[520px]:text-xs"
            routerLink="/version-notes"
          >
            <svg class="size-4 shrink-0" lucideRocket></svg>
            <span class="truncate">{{ i18n.t('home.release.label') }}</span>
            <svg class="size-4 shrink-0" lucideChevronRight></svg>
          </a>
        </div>

        <div class="mt-20 max-[860px]:mt-16 max-[520px]:mt-14">
          <p
            class="m-0 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--docs-accent-strong)]"
          >
            {{ i18n.t('home.eyebrow') }}
          </p>
          <h1
            id="home-title"
            class="m-0 mt-6 max-w-[820px] text-[clamp(3.5rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-[var(--docs-fg)] max-[860px]:text-[clamp(3.5rem,12vw,6.2rem)] max-[520px]:mt-5 max-[520px]:text-[3.55rem]"
          >
            {{ i18n.t('home.title') }}
          </h1>
          <p
            class="m-0 mt-8 max-w-[650px] text-[20px] leading-[1.6] text-[var(--docs-muted)] max-[860px]:text-lg max-[520px]:mt-6 max-[520px]:text-base"
          >
            {{ i18n.t('home.description') }}
          </p>
          <div
            class="mt-9 flex flex-wrap gap-3 max-[520px]:mt-7 max-[520px]:grid max-[520px]:grid-cols-1"
          >
            <a
              sanringBtn
              class="min-h-12 min-w-[160px] rounded-[var(--sanring-radius)] border-[var(--docs-accent)] bg-[var(--docs-accent)] px-5 text-base font-semibold text-[var(--docs-accent-fg)] hover:bg-[var(--docs-accent-strong)] max-[520px]:w-full max-[520px]:justify-center"
              routerLink="/components"
              variant="default"
              size="md"
            >
              {{ i18n.t('home.actions.browseComponents') }}
              <svg class="size-4" lucideChevronRight></svg>
            </a>
            <a
              sanringBtn
              class="min-h-12 min-w-[140px] rounded-[var(--sanring-radius)] border-[var(--docs-border-strong)] bg-transparent px-5 text-base font-semibold text-[var(--docs-fg)] hover:bg-[var(--docs-elevated)] max-[520px]:w-full max-[520px]:justify-center"
              routerLink="/components/button"
              variant="outline"
              size="md"
            >
              {{ i18n.t('home.actions.viewExample') }}
            </a>
          </div>
        </div>
      </div>

      <div
        class="min-w-0 rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-code)] p-5 text-[var(--docs-code-fg)] shadow-[var(--docs-shadow-soft)] lg:mt-6 lg:p-6 max-[520px]:p-4"
      >
        <div
          class="flex min-w-0 items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] pb-4"
        >
          <div
            class="flex min-w-0 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[var(--docs-accent)]"
          >
            <svg class="size-4 shrink-0" lucideLayers3></svg
            ><span class="truncate">{{ i18n.t('home.hero.panel.eyebrow') }}</span>
          </div>
          <span
            class="shrink-0 font-mono text-xs text-[color-mix(in_srgb,var(--docs-code-fg)_58%,transparent)]"
            >{{ i18n.t('home.hero.panel.status') }}</span
          >
        </div>

        <div class="mt-5 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-code-fg)_22%,transparent)] bg-[var(--docs-surface)]">
          <div class="grid lg:grid-cols-[minmax(180px,0.86fr)_minmax(0,1.14fr)]">
            <div class="border-b border-[var(--docs-border)] bg-[var(--docs-code)] p-4 lg:border-b-0 lg:border-r max-[520px]:p-3">
              <div class="flex items-center justify-between gap-3 border-b border-[color-mix(in_srgb,var(--docs-code-fg)_18%,transparent)] pb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[color-mix(in_srgb,var(--docs-code-fg)_58%,transparent)]"><span>{{ i18n.t('home.hero.panel.file') }}</span><span>source</span></div>
              <div class="mt-5 grid gap-1 font-mono text-[11px] leading-6 text-[color-mix(in_srgb,var(--docs-code-fg)_78%,transparent)]">
                <div><span class="text-[var(--docs-accent)]">&lt;button</span></div>
                <div class="pl-4"><span class="text-[var(--docs-accent)]">sanringBtn</span></div>
                <div class="pl-4"><span class="text-[var(--docs-accent)]">variant</span>=&quot;default&quot;</div>
                <div class="pl-4">Browse components</div>
                <div><span class="text-[var(--docs-accent)]">/&gt;</span></div>
              </div>
            </div>

            <div class="min-w-0 bg-[var(--docs-surface)] p-5 text-[var(--docs-fg)] max-[520px]:p-4">
              <div class="flex items-center justify-between gap-3"><div><p class="m-0 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--docs-muted)]">{{ i18n.t('home.hero.panel.title') }}</p><p class="m-0 mt-1 text-xs text-[var(--docs-muted)]">{{ i18n.t('home.hero.panel.sourceLabel') }}</p></div><span class="rounded-[var(--sanring-radius-sm)] bg-[var(--docs-elevated)] px-2 py-1 font-mono text-[10px] text-[var(--docs-muted)]">Angular</span></div>
              <p class="m-0 mt-5 text-sm leading-6 text-[var(--docs-muted)]">{{ i18n.t('home.hero.panel.description') }}</p>
              <div class="mt-6 flex flex-wrap gap-3" aria-hidden="true"><span class="inline-flex min-h-11 items-center justify-center rounded-[var(--sanring-radius)] bg-[var(--docs-accent)] px-4 font-semibold text-[var(--docs-accent-fg)]">{{ i18n.t('home.actions.browseComponents') }}</span><span class="inline-flex min-h-11 items-center justify-center rounded-[var(--sanring-radius)] border border-[var(--docs-border-strong)] px-4 font-semibold text-[var(--docs-fg)]">{{ i18n.t('home.actions.viewExample') }}</span></div>
              <div class="mt-5 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--docs-border)] pt-4 font-mono text-[10px] text-[var(--docs-muted)]"><span class="font-semibold text-[var(--docs-accent-strong)]">Button</span><span>Dialog</span><span>Toast</span><span class="ml-auto">{{ i18n.t('home.hero.panel.ready') }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [':host { display: block; }'],
})
export class HomeHeroSectionComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly releaseVersion = 'v0.23.2';
}
