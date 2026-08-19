import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChevronRight, LucideRocket } from '@lucide/angular';
import { ButtonDirective } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';
import { HomeHeroDemoPanelComponent } from './home-hero-demo-panel.component';

@Component({
  selector: 'app-home-hero-section',
  standalone: true,
  imports: [RouterLink, ButtonDirective, HomeHeroDemoPanelComponent, LucideChevronRight, LucideRocket],
  template: `
    <section
      class="grid gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start lg:gap-20"
      aria-labelledby="home-title"
    >
      <div class="min-w-0">
        <a
          class="inline-flex min-w-0 items-center gap-2.5 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] py-2 pl-3.5 pr-3 text-sm font-semibold text-[var(--docs-fg)] no-underline transition-colors hover:border-[var(--docs-border-strong)] hover:bg-[var(--docs-elevated)]"
          routerLink="/version-notes"
        >
          <svg class="size-4 shrink-0 text-[var(--docs-accent-strong)]" lucideRocket></svg>
          <span class="font-mono">{{ releaseVersion }}</span>
          <span class="h-3.5 w-px shrink-0 bg-[var(--docs-border-strong)]"></span>
          <span class="truncate text-[var(--docs-accent-strong)]">{{ i18n.t('home.release.label') }}</span>
          <svg class="size-4 shrink-0" lucideChevronRight></svg>
        </a>

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

      <app-home-hero-demo-panel />
    </section>
  `,
  styles: [':host { display: block; }'],
})
export class HomeHeroSectionComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly releaseVersion = 'v0.23.3';
}
