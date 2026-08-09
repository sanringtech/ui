import { ComponentPageSectionDefinition } from '../../docs-schema/component-page.types';

export const themingSections: readonly ComponentPageSectionDefinition[] = [
  { id: 'design-tokens', titleKey: 'theming.tokens.title' },
  { id: 'tailwind-v4', titleKey: 'theming.tailwind.title' },
  { id: 'theme-playground', titleKey: 'theming.playground.title' },
  { id: 'brand-override', titleKey: 'theming.brand.title' },
  { id: 'dark-light-mode', titleKey: 'theming.darkMode.title' },
  { id: 'named-presets', titleKey: 'theming.presets.title' },
];

export const themingTokensSource = `:root {
  /* radius scale */
  --sanring-radius-xs: 3px;
  --sanring-radius-sm: 6px;
  --sanring-radius:    8px;
  --sanring-radius-lg: 12px;

  /* brand color scale — 9 steps, 10 lightest to 90 darkest */
  --sanring-primary-10: #e8f6f8;
  --sanring-primary-50: #8bd3dd;
  --sanring-primary-90: #1c2a2c;
  /* ...plus coral / sun / neutral / info / success / warn / error scales */

  /* single-value alias — drives bg-primary, text-primary, border-primary */
  --sanring-primary:    var(--sanring-primary-50);
  --sanring-primary-fg: var(--sanring-neutral-90);

  /* semantic layer — components read these, not the raw scales above */
  --sanring-background:    var(--sanring-neutral-90);
  --sanring-foreground:    var(--sanring-neutral-10);
  --sanring-muted:         var(--sanring-neutral-40);
  --sanring-border:        #354042;
  --sanring-border-strong: var(--sanring-neutral-60);
  --sanring-surface:       #232a2b;
  --sanring-control:       var(--sanring-neutral-10);

  /* ...plus progress, file-upload, and avatar-badge tokens */
}

:root[data-theme='light'] {
  /* shallow overrides — see the generated file for the full list */
  --sanring-background: var(--sanring-neutral-10);
  --sanring-foreground: var(--sanring-neutral-90);
}`;

export const themingTailwindSource = `@import 'tailwindcss';
@import './sanring-theme.css';

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

export const themingBrandSource = `/* override Sanring UI tokens with your brand */
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

export const themingDarkModeCss = `/* dark is default — no selector needed */
:root { --sanring-background: #070a0b; }

/* light overrides scoped to the attribute */
:root[data-theme='light'] { --sanring-background: #ffffff; }`;

export const themingDarkModeToggle = `// switch to light
document.documentElement.setAttribute('data-theme', 'light');

// switch to dark (explicit setAttribute is safer if you add a third theme later)
document.documentElement.setAttribute('data-theme', 'dark');`;

export const themingPresetsCommand = `npx @sanring/cli@latest init --theme slate`;
