import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight } from '@lucide/angular';
import { ButtonDirective } from '@sanring/ui';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import { SeoService } from '../../seo/seo.service';
import {
  ComponentPageCodeBlock,
  ComponentPageComponent,
  ComponentPageSectionComponent,
  DocsPageHeaderComponent,
} from '../../layouts/component-page';
import { TranslationKey } from '../../i18n/translations';

interface IntroFeatureCard {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}

interface IntroRequirement {
  label: string;
  value: string;
}

interface IntroNextLink {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  path: string;
}

@Component({
  selector: 'app-introduction-page',
  imports: [
    RouterLink,
    ButtonDirective,
    LucideArrowRight,
    ComponentPageCodeBlock,
    ComponentPageComponent,
    ComponentPageSectionComponent,
    DocsPageHeaderComponent,
  ],
  template: `
    <app-component-page [sections]="sections">
      <app-docs-page-header
        [title]="i18n.t('sidebar.introduction')"
        [description]="i18n.t('intro.page.description')"
        eyebrow="docs / introduction"
      >
        <div page-actions class="flex flex-wrap gap-3">
          <a sanringBtn routerLink="/cli">
            {{ i18n.t('intro.actions.start') }}
            <svg lucideArrowRight class="size-4"></svg>
          </a>
          <a sanringBtn routerLink="/components/button" variant="outline">
            {{ i18n.t('intro.actions.example') }}
          </a>
        </div>
      </app-docs-page-header>

      <section class="mb-4 overflow-hidden rounded-[var(--sanring-radius-lg)] border border-[var(--docs-border)] bg-[var(--docs-panel)] shadow-[var(--docs-shadow-soft)]" aria-label="Introduction path">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--docs-border)] px-5 py-4"><p class="m-0 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--docs-accent-strong)]">START HERE</p><span class="font-mono text-xs text-[var(--docs-muted)]">3 moves to a local UI</span></div>
        <div class="grid divide-y divide-[var(--docs-border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0"><div class="p-5"><p class="m-0 font-mono text-xs text-[var(--docs-accent-strong)]">01</p><h2 class="m-0 mt-7 text-lg font-semibold text-[var(--docs-fg)]">Install the source</h2><code class="mt-3 block font-mono text-xs text-[var(--docs-muted)]">npx @sanring/cli init</code></div><div class="p-5"><p class="m-0 font-mono text-xs text-[var(--docs-accent-strong)]">02</p><h2 class="m-0 mt-7 text-lg font-semibold text-[var(--docs-fg)]">Choose a primitive</h2><p class="m-0 mt-3 text-sm leading-6 text-[var(--docs-muted)]">Bring only the component your product needs.</p></div><div class="bg-[var(--docs-accent)] p-5 text-[var(--docs-accent-fg)]"><p class="m-0 font-mono text-xs">03</p><h2 class="m-0 mt-7 text-lg font-semibold">Compose the edge</h2><p class="m-0 mt-3 text-sm leading-6 text-[color-mix(in_srgb,var(--docs-accent-fg)_78%,transparent)]">Keep the important decisions inside your app.</p></div></div>
      </section>

      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('intro.whatIs.body') }}
        </p>
        <div
          class="mt-5 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-elevated)] p-4 text-sm leading-6 text-[var(--docs-muted)]"
        >
          <span class="font-semibold text-[var(--docs-fg)]">
            {{ i18n.t('intro.whatIs.noteTitle') }}
          </span>
          {{ i18n.t('intro.whatIs.noteBody') }}
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[1]">
        <div class="grid gap-3 sm:grid-cols-3">
          @for (item of featureCards; track item.titleKey) {
            <div
              class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-4"
            >
              <h3 class="m-0 text-sm font-semibold text-[var(--docs-fg)]">
                {{ i18n.t(item.titleKey) }}
              </h3>
              <p class="mb-0 mt-2 text-sm leading-6 text-[var(--docs-muted)]">
                {{ i18n.t(item.descriptionKey) }}
              </p>
            </div>
          }
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[2]">
        <p class="mt-0 text-sm leading-6 text-[var(--docs-muted)]">
          {{ i18n.t('intro.quickStart.body') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="cliWorkflow" language="bash" />
        <p class="mt-6 text-sm leading-6 text-[var(--docs-muted)]">
          {{ i18n.t('intro.quickStart.tailwind') }}
        </p>
        <app-component-page-code-block class="mt-6" [code]="tailwindSource" language="css" />
        <p class="mt-6 text-sm leading-6 text-[var(--docs-muted)]">
          {{ i18n.t('intro.quickStart.import') }}
        </p>
        <div class="mt-4 grid gap-4">
          <div
            class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-elevated)] px-4 py-3 text-sm leading-6 text-[var(--docs-muted)]"
          >
            <span class="font-semibold text-[var(--docs-fg)]">
              {{ i18n.t('intro.quickStart.expectedTitle') }}
            </span>
            {{ i18n.t('intro.quickStart.expectedBody') }}
          </div>
          <app-component-page-code-block
            class="min-w-0"
            [code]="firstComponent"
            language="angular-ts"
          />
        </div>
      </app-component-page-section>

      <app-component-page-section [section]="sections[3]">
        <dl class="m-0 grid gap-3 sm:grid-cols-2">
          @for (item of requirements; track item.label) {
            <div
              class="rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-4"
            >
              <dt class="text-sm font-semibold text-[var(--docs-fg)]">{{ item.label }}</dt>
              <dd class="m-0 mt-2 font-mono text-sm leading-6 text-[var(--docs-muted)]">
                {{ item.value }}
              </dd>
            </div>
          }
        </dl>
      </app-component-page-section>

      <app-component-page-section [section]="sections[4]">
        <div class="grid gap-3">
          @for (item of nextLinks; track item.path) {
            <a
              class="group grid gap-1 rounded-[var(--sanring-radius)] border border-[var(--docs-border)] bg-[var(--docs-panel)] p-4 text-[var(--docs-fg)] no-underline transition-colors hover:border-[color-mix(in_srgb,var(--docs-accent)_45%,var(--docs-border))] hover:bg-[var(--docs-active)]"
              [routerLink]="item.path"
            >
              <span class="flex items-center justify-between gap-3 text-sm font-semibold">
                {{ i18n.t(item.titleKey) }}
                <svg
                  lucideArrowRight
                  class="size-4 shrink-0 text-[var(--docs-muted)] transition-transform group-hover:translate-x-0.5"
                ></svg>
              </span>
              <span class="text-sm leading-6 text-[var(--docs-muted)]">
                {{ i18n.t(item.descriptionKey) }}
              </span>
            </a>
          }
        </div>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class IntroductionPageComponent {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      this.seo.setPage({
        title: this.i18n.t('sidebar.introduction'),
        description: this.i18n.t('intro.page.description'),
      });
    });
  }

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'what-is', titleKey: 'intro.whatIs.title' },
    { id: 'why-source-first', titleKey: 'intro.sourceFirst.title' },
    { id: 'quick-start', titleKey: 'intro.quickStart.title' },
    { id: 'requirements', titleKey: 'intro.requirements.title' },
    { id: 'next', titleKey: 'intro.next.title' },
  ];

  protected readonly featureCards: IntroFeatureCard[] = [
    {
      titleKey: 'intro.sourceFirst.own.title',
      descriptionKey: 'intro.sourceFirst.own.description',
    },
    {
      titleKey: 'intro.sourceFirst.compose.title',
      descriptionKey: 'intro.sourceFirst.compose.description',
    },
    {
      titleKey: 'intro.sourceFirst.inspect.title',
      descriptionKey: 'intro.sourceFirst.inspect.description',
    },
  ];

  protected readonly requirements: IntroRequirement[] = [
    { label: 'Angular', value: '22.x' },
    { label: 'Tailwind CSS', value: 'v4' },
    { label: 'Node.js', value: '^22.22.3 || ^24.15.0 || ^26.0.0' },
    { label: 'TypeScript', value: '>=6.0.0 <6.1.0' },
  ];

  protected readonly nextLinks: IntroNextLink[] = [
    {
      titleKey: 'intro.next.components.title',
      descriptionKey: 'intro.next.components.description',
      path: '/components',
    },
    {
      titleKey: 'intro.next.cli.title',
      descriptionKey: 'intro.next.cli.description',
      path: '/cli',
    },
    {
      titleKey: 'intro.next.theming.title',
      descriptionKey: 'intro.next.theming.description',
      path: '/theming',
    },
  ];

  protected readonly tailwindSource = `@import './sanring-theme.css';

@source "./app/components/ui";`;

  protected readonly cliWorkflow = `npx @sanring/cli@latest init
npx @sanring/cli@latest add button`;

  protected readonly firstComponent = `import { Component } from '@angular/core';
import { ButtonDirective } from './components/ui/button';

@Component({
  selector: 'app-save-bar',
  imports: [ButtonDirective],
  template: \`
    <button sanringBtn type="button">
      Save changes
    </button>
  \`,
})
export class SaveBarComponent {}`;
}
