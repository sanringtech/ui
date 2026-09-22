import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChevronRight } from '@lucide/angular';
import { ButtonDirective } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-home-start-section',
  standalone: true,
  imports: [RouterLink, ButtonDirective, LucideChevronRight],
  template: `
    <section class="grid gap-8 border-y border-[var(--docs-border)] py-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12 lg:py-12" aria-labelledby="home-start-title">
      <div><p class="docs-eyebrow">{{ i18n.t('home.start.eyebrow') }}</p><h2 id="home-start-title" class="m-0 mt-4 max-w-[700px] text-[clamp(2.4rem,4vw,4.5rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[var(--docs-fg)] max-[520px]:text-[2.75rem]">{{ i18n.t('home.start.title') }}</h2><p class="m-0 mt-4 max-w-[620px] text-lg leading-8 text-[var(--docs-muted)] max-[520px]:text-base max-[520px]:leading-7">{{ i18n.t('home.start.description') }}</p></div>
      <div class="flex flex-wrap gap-3 lg:justify-end max-[520px]:grid max-[520px]:grid-cols-1"><a sanringBtn class="min-h-12 min-w-[150px] px-5 font-semibold max-[520px]:w-full max-[520px]:justify-center" routerLink="/introduction" variant="default" size="md">{{ i18n.t('home.start.readDocs') }}<svg class="size-4" lucideChevronRight></svg></a><a sanringBtn class="min-h-12 min-w-[120px] px-5 font-semibold max-[520px]:w-full max-[520px]:justify-center" routerLink="/cli" variant="outline" size="md">{{ i18n.t('home.start.viewCli') }}</a></div>
    </section>
  `,
  styles: [':host { display: block; }'],
})
export class HomeStartSectionComponent {
  protected readonly i18n = inject(I18nService);
}
