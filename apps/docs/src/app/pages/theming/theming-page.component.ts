import { Component, inject } from '@angular/core';
import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';
import { I18nService } from '../../i18n/i18n.service';
import {
  ComponentPageCodeBlock,
  ComponentPageComponent,
  ComponentPageSectionComponent,
} from '../../layouts/component-page';

@Component({
  selector: 'app-theming-page',
  imports: [ComponentPageCodeBlock, ComponentPageComponent, ComponentPageSectionComponent],
  template: `
    <app-component-page [sections]="sections">
      <header class="border-b border-[var(--docs-border)] pb-10">
        <h1 class="m-0 text-[34px] font-semibold leading-tight tracking-normal text-[var(--docs-fg)]">
          {{ i18n.t('sidebar.theming') }}
        </h1>
        <p class="mb-0 mt-4 max-w-[620px] text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('theming.page.description') }}
        </p>
      </header>

      <!-- 1. Design tokens -->
      <app-component-page-section [section]="sections[0]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('theming.tokens.body') }}
        </p>
        <div class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <div class="flex items-center gap-2 border-b border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-2.5">
            <span class="text-xs font-medium text-[var(--docs-muted)]">styles.css</span>
          </div>
          <app-component-page-code-block [code]="tokensSource" language="css" />
        </div>
      </app-component-page-section>

      <!-- 2. Tailwind v4 integration -->
      <app-component-page-section [section]="sections[1]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('theming.tailwind.body') }}
        </p>
        <div class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <div class="flex items-center gap-2 border-b border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-2.5">
            <span class="text-xs font-medium text-[var(--docs-muted)]">styles.css</span>
          </div>
          <app-component-page-code-block [code]="tailwindSource" language="css" />
        </div>
        <p class="mt-4 text-sm text-[var(--docs-muted)]">{{ i18n.t('theming.tailwind.note') }}</p>
      </app-component-page-section>

      <!-- 3. Brand override -->
      <app-component-page-section [section]="sections[2]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('theming.brand.body') }}
        </p>
        <div class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <div class="flex items-center gap-2 border-b border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-2.5">
            <span class="text-xs font-medium text-[var(--docs-muted)]">your-app/styles.css</span>
          </div>
          <app-component-page-code-block [code]="brandSource" language="css" />
        </div>
      </app-component-page-section>

      <!-- 4. Dark / light mode -->
      <app-component-page-section [section]="sections[3]">
        <p class="mt-0 text-base leading-[1.7] text-[var(--docs-muted)]">
          {{ i18n.t('theming.darkMode.body') }}
        </p>
        <div class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <div class="flex items-center gap-2 border-b border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-2.5">
            <span class="text-xs font-medium text-[var(--docs-muted)]">CSS</span>
          </div>
          <app-component-page-code-block [code]="darkModeCss" language="css" />
        </div>
        <div class="mt-6 overflow-hidden rounded-[var(--sanring-radius)] border border-[var(--docs-border)]">
          <div class="flex items-center gap-2 border-b border-[var(--docs-border)] bg-[var(--docs-surface)] px-4 py-2.5">
            <span class="text-xs font-medium text-[var(--docs-muted)]">TypeScript</span>
          </div>
          <app-component-page-code-block [code]="darkModeToggle" language="typescript" />
        </div>
        <p class="mt-4 text-sm text-[var(--docs-muted)]">{{ i18n.t('theming.darkMode.note') }}</p>
      </app-component-page-section>
    </app-component-page>
  `,
})
export class ThemingPageComponent {
  protected readonly i18n = inject(I18nService);

  protected readonly sections: readonly ComponentPageSectionDefinition[] = [
    { id: 'design-tokens', titleKey: 'theming.tokens.title' },
    { id: 'tailwind-v4', titleKey: 'theming.tailwind.title' },
    { id: 'brand-override', titleKey: 'theming.brand.title' },
    { id: 'dark-light-mode', titleKey: 'theming.darkMode.title' },
  ];

  protected readonly tokensSource = `:root {
  /* surface & typography */
  --sanring-background:    #070a0b;
  --sanring-foreground:    #f1f5f5;
  --sanring-muted:         #94a3a6;
  --sanring-border:        #1f2729;
  --sanring-border-strong: #38454a;
  --sanring-surface:       #0d1213;
  --sanring-elevated:      #121718;
  --sanring-control:       #f4faf9;

  /* primary color — drives bg-primary, text-primary, border-primary */
  --sanring-primary:    #8bd3dd;
  --sanring-primary-fg: #062f35;
}`;

  protected readonly tailwindSource = `@import 'tailwindcss';

/* tell Tailwind to scan component source for utility classes */
@source "../node_modules/@sanring/ui/src";
@source "./app/components/ui";

/* wire --sanring-* tokens to Tailwind utilities
   inline = keeps the var() reference live at runtime,
   so dark/light theme switching updates bg-primary etc. */
@theme inline {
  --color-background:         var(--sanring-background);
  --color-foreground:         var(--sanring-foreground);
  --color-primary:            var(--sanring-primary);
  --color-primary-foreground: var(--sanring-primary-fg);
}`;

  protected readonly brandSource = `/* override Sanring UI tokens with your brand */
:root {
  --sanring-background: #0a0a0f;
  --sanring-foreground: #f0f0ff;
  --sanring-border:     #2a2a40;

  /* swap the primary to your brand color */
  --sanring-primary:    #a78bfa;   /* purple */
  --sanring-primary-fg: #1e1033;
}

:root[data-theme='light'] {
  --sanring-background: #ffffff;
  --sanring-foreground: #0f0a1e;
  --sanring-primary:    #7c3aed;
  --sanring-primary-fg: #ede9fe;
}`;

  protected readonly darkModeCss = `/* dark is default — no selector needed */
:root { --sanring-background: #070a0b; }

/* light overrides scoped to the attribute */
:root[data-theme='light'] { --sanring-background: #ffffff; }`;

  protected readonly darkModeToggle = `// switch to light
document.documentElement.setAttribute('data-theme', 'light');

// switch to dark (explicit setAttribute is safer if you add a third theme later)
document.documentElement.setAttribute('data-theme', 'dark');`;
}
