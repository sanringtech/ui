import { Component, effect, inject } from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';
import { ComponentPageComponent, DocsPageHeaderComponent } from '../../layouts/component-page';
import { SeoService } from '../../seo/seo.service';
import { ThemingBrandSectionComponent } from './theming-brand-section.component';
import { themingSections } from './theming.constants';
import { ThemingDarkModeSectionComponent } from './theming-dark-mode-section.component';
import { ThemingDesignTokensSectionComponent } from './theming-design-tokens-section.component';
import { ThemingPlaygroundSectionComponent } from './theming-playground-section.component';
import { ThemingPresetsSectionComponent } from './theming-presets-section.component';
import { ThemingTailwindSectionComponent } from './theming-tailwind-section.component';

@Component({
  selector: 'app-theming-page',
  imports: [
    ComponentPageComponent,
    DocsPageHeaderComponent,
    ThemingBrandSectionComponent,
    ThemingDarkModeSectionComponent,
    ThemingDesignTokensSectionComponent,
    ThemingPlaygroundSectionComponent,
    ThemingPresetsSectionComponent,
    ThemingTailwindSectionComponent,
  ],
  template: `
    <app-component-page [sections]="sections">
      <app-docs-page-header
        [title]="i18n.t('sidebar.theming')"
        [description]="i18n.t('theming.page.description')"
        eyebrow="docs / theming"
      />

      <section class="mb-4 rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-5 shadow-[var(--docs-shadow-soft)] sm:p-6" aria-label="Theme token model">
        <div class="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--docs-border)] pb-5"><div><p class="m-0 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--docs-accent-strong)]">TOKEN CASCADE</p><h2 class="m-0 mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--docs-fg)]">Scale → semantic → component.</h2></div><span class="font-mono text-xs text-[var(--docs-muted)]">light / dark</span></div>
        <div class="mt-5 grid gap-3 lg:grid-cols-[0.8fr_1fr_1.15fr] lg:items-stretch"><div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4"><p class="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--docs-muted)]">RAW SCALE</p><div class="mt-4 flex gap-1.5"><span class="h-8 flex-1 rounded-[var(--sanring-radius-xs)] bg-[var(--docs-accent)]"></span><span class="h-8 flex-1 rounded-[var(--sanring-radius-xs)] bg-[var(--docs-accent-strong)]"></span><span class="h-8 flex-1 rounded-[var(--sanring-radius-xs)] bg-[var(--docs-fg)]"></span></div><p class="m-0 mt-3 font-mono text-xs text-[var(--docs-muted)]">primary-10 … primary-90</p></div><div class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-surface)] p-4"><p class="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--docs-muted)]">SEMANTIC MAP</p><div class="mt-3 grid gap-2 font-mono text-xs"><div class="flex justify-between gap-3"><span class="text-[var(--docs-muted)]">background</span><span class="text-[var(--docs-fg)]">neutral-90</span></div><div class="flex justify-between gap-3"><span class="text-[var(--docs-muted)]">primary</span><span class="text-[var(--docs-accent-strong)]">primary-50</span></div><div class="flex justify-between gap-3"><span class="text-[var(--docs-muted)]">border</span><span class="text-[var(--docs-fg)]">neutral-60</span></div></div></div><div class="rounded-[var(--sanring-radius)] bg-[var(--docs-code)] p-4 text-[var(--docs-code-fg)]"><div class="flex items-center justify-between gap-3"><p class="m-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--docs-accent)]">COMPONENT READS</p><span class="flex gap-1.5"><span class="size-2 rounded-full bg-[var(--docs-accent)]"></span><span class="size-2 rounded-full bg-[color-mix(in_srgb,var(--docs-code-fg)_35%,transparent)]"></span></span></div><div class="mt-4 rounded-[var(--sanring-radius)] border border-[color-mix(in_srgb,var(--docs-code-fg)_20%,transparent)] p-3"><div class="flex items-center justify-between"><span class="text-sm font-semibold">Button</span><span class="rounded-[var(--sanring-radius-xs)] bg-[var(--docs-accent)] px-2 py-1 text-xs text-[var(--docs-accent-fg)]">primary</span></div><div class="mt-3 h-2 rounded-full bg-[color-mix(in_srgb,var(--docs-code-fg)_16%,transparent)]"></div></div></div></div>
        <div class="mt-3 grid gap-3 sm:grid-cols-2"><div class="rounded-[var(--sanring-radius)] border border-[#d5dddd] bg-[#f5f8f8] p-4 text-[#172022]"><div class="flex items-center justify-between gap-3"><p class="m-0 font-mono text-[10px] font-semibold uppercase tracking-[0.12em]">LIGHT</p><span class="font-mono text-[10px] text-[#5d6b6d]">surface / ink / accent</span></div><div class="mt-4 flex items-center gap-3"><span class="size-8 rounded-full border border-[#d5dddd] bg-[#f5f8f8]"></span><span class="size-8 rounded-full bg-[#172022]"></span><span class="size-8 rounded-full bg-[#68c9d6]"></span><span class="font-mono text-xs text-[#5d6b6d]">same semantic roles</span></div></div><div class="rounded-[var(--sanring-radius)] border border-[#344244] bg-[#101617] p-4 text-[#e8f6f8]"><div class="flex items-center justify-between gap-3"><p class="m-0 font-mono text-[10px] font-semibold uppercase tracking-[0.12em]">DARK</p><span class="font-mono text-[10px] text-[#91a5a8]">surface / ink / accent</span></div><div class="mt-4 flex items-center gap-3"><span class="size-8 rounded-full border border-[#344244] bg-[#101617]"></span><span class="size-8 rounded-full bg-[#e8f6f8]"></span><span class="size-8 rounded-full bg-[#68c9d6]"></span><span class="font-mono text-xs text-[#91a5a8]">same semantic roles</span></div></div></div>
      </section>

      <app-theming-design-tokens-section [section]="sections[0]" />
      <app-theming-tailwind-section [section]="sections[1]" />
      <app-theming-playground-section [section]="sections[2]" />
      <app-theming-brand-section [section]="sections[3]" />
      <app-theming-dark-mode-section [section]="sections[4]" />
      <app-theming-presets-section [section]="sections[5]" />
    </app-component-page>
  `,
})
export class ThemingPageComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly sections = themingSections;
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t('sidebar.theming'),
        description: this.i18n.t('theming.page.description'),
      });
    });
  }
}
