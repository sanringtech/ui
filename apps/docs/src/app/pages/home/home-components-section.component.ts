import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChevronRight } from '@lucide/angular';
import { ButtonDirective, ScrollAreaDirective } from '@sanring/ui';
import { I18nService } from '../../i18n/i18n.service';
import {
  docsComponentStatusBadgeKeys,
  docsComponentStatusDotClass,
  visibleDocsComponentItems,
} from '../../navigation/docs-navigation';
import { isRecentlyUpdatedComponentId } from '../changelog/component-changelog';

@Component({
  selector: 'app-home-components-section',
  standalone: true,
  imports: [RouterLink, ButtonDirective, ScrollAreaDirective, LucideChevronRight],
  template: `
    <section class="grid gap-10 border-t border-[var(--docs-border)] pt-12 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:gap-16" aria-labelledby="home-components-title">
      <div class="lg:sticky lg:top-28 lg:self-start"><p class="m-0 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--docs-accent-strong)]">{{ i18n.t('home.components.eyebrow') }}</p><h2 id="home-components-title" class="m-0 mt-5 max-w-[440px] text-[clamp(2.3rem,3.7vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.06em] text-[var(--docs-fg)] max-[520px]:text-[2.8rem]">{{ i18n.t('home.components.title') }}</h2><p class="m-0 mt-6 max-w-[420px] text-lg leading-8 text-[var(--docs-muted)] max-[520px]:mt-5 max-[520px]:text-base max-[520px]:leading-7">{{ i18n.t('home.components.description') }}</p><a sanringBtn class="mt-8 min-h-11 rounded-[var(--sanring-radius)] font-semibold max-[520px]:mt-6" routerLink="/components" variant="outline" size="md">{{ i18n.t('home.components.browseAll') }}<svg class="size-4" lucideChevronRight></svg></a></div>
      <div class="min-w-0 rounded-[var(--sanring-radius-lg)] border border-[color-mix(in_srgb,var(--docs-accent)_38%,var(--docs-border))] bg-[var(--docs-panel)] p-6 shadow-[var(--docs-shadow-soft)] max-[520px]:p-4">
        <div class="mb-6 flex items-end justify-between gap-4 border-b border-[var(--docs-border)] pb-5 max-[520px]:mb-4 max-[520px]:pb-4"><div class="min-w-0"><p class="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--docs-muted)]">{{ i18n.t('home.components.panelEyebrow') }}</p><p class="m-0 mt-2 text-2xl font-semibold text-[var(--docs-fg)] max-[520px]:text-xl">{{ i18n.t('home.components.panelTitle') }}</p></div><p class="m-0 shrink-0 font-mono text-4xl font-semibold text-[var(--docs-accent-strong)] max-[520px]:text-3xl">{{ componentCount }}</p></div>
        <nav sanringScrollArea [hideScrollbar]="true" class="grid max-h-[520px] grid-cols-3 gap-3 pr-1 max-[980px]:grid-cols-2 max-[520px]:max-h-[460px] max-[480px]:grid-cols-1" aria-label="Component shortcuts">
          @for (item of componentItems; track item.id) {
            @if (item.disabled) {
              <span class="flex min-h-14 min-w-0 items-center gap-3 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-3 text-base font-semibold text-[color-mix(in_srgb,var(--docs-muted)_45%,transparent)] max-[520px]:px-3"><span class="min-w-0 truncate">{{ i18n.t(item.labelKey) }}</span></span>
            } @else {
              <a class="flex min-h-14 min-w-0 items-center justify-between gap-3 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-3 text-base font-semibold text-[var(--docs-fg)] no-underline transition-colors hover:border-[var(--docs-border-strong)] hover:bg-[var(--docs-elevated)] max-[520px]:px-3" [routerLink]="item.path"><span class="min-w-0 truncate">{{ i18n.t(item.labelKey) }}</span>@if (item.isNew) { <span class="sr-only">{{ i18n.t('home.components.newBadge') }}</span><span class="size-2 shrink-0 rounded-full bg-[var(--docs-accent-strong)]" aria-hidden="true"></span> } @if (item.status) { <span class="sr-only">{{ i18n.t(statusBadgeKeys[item.status]) }}</span><span [class]="'size-2 shrink-0 rounded-full ' + statusDotClass[item.status]" [attr.title]="i18n.t(statusBadgeKeys[item.status])" aria-hidden="true"></span> }</a>
            }
          }
        </nav>
      </div>
    </section>
  `,
  styles: [':host { display: block; }'],
})
export class HomeComponentsSectionComponent {
  protected readonly i18n = inject(I18nService);
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
}
