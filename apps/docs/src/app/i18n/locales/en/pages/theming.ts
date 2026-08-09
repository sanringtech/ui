export const themingTranslations = {
  'theming.page.description':
    'How Sanring UI handles color, typography, and spacing — and how to override them for your brand.',
  'theming.tokens.title': 'Design tokens',
  'theming.tokens.body':
    'Sanring UI exposes a set of CSS custom properties (--sanring-*) that components use internally. Running sanring init generates src/sanring-theme.css with the full default set for you — just @import it into your global stylesheet. Override any variable in :root afterwards and everything updates.',
  'theming.tailwind.title': 'Tailwind v4 integration',
  'theming.tailwind.body':
    'Tailwind v4 reads token values from @theme blocks in your CSS. Using @theme inline keeps the var() reference alive at runtime so theme switching works without a rebuild.',
  'theming.tailwind.note':
    'The inline keyword is the key difference — without it Tailwind resolves the value once at build time and dark/light switching stops working. The @source paths should include both the package source and your local CLI component path.',
  'theming.brand.title': 'Customising your brand',
  'theming.brand.body':
    'Override any --sanring-* token in :root. Components immediately pick up the new values — no configuration files to change.',
  'theming.playground.title': 'Theme generator',
  'theming.playground.body':
    'Preview token combinations against common interface states, then copy the CSS overrides into your global stylesheet.',
  'theming.playground.radius': 'Radius',
  'theming.playground.copy': 'Copy CSS',
  'theming.playground.previewTitle': 'Interface preview',
  'theming.playground.previewDescription':
    'The same tokens drive surfaces, text, borders, and interactive states together.',
  'theming.playground.cardTitle': 'Workspace settings',
  'theming.playground.cardBody':
    'Check that primary actions, secondary buttons, supporting text, and code surfaces stay readable in this theme.',
  'theming.playground.formNote':
    'Inputs, progress, and status hints inherit the same semantic tokens.',
  'theming.darkMode.title': 'Dark / light mode',
  'theming.darkMode.body':
    "Dark is the default — the base :root block defines all dark values. Light mode is a shallow override on :root[data-theme='light']. Toggle it by setting the attribute on <html>.",
  'theming.darkMode.note':
    'This differs from shadcn/ui, which adds a .dark class to <body>. The attribute approach lets you scope light/dark to any subtree, not just the whole document.',
  'theming.presets.title': 'Named presets',
  'theming.presets.body':
    'Pass --theme to sanring init to start from a named preset instead of hand-editing every token. The preset is appended after the base tokens, so it only needs to override what changes — everything else falls back to the default.',
  'theming.presets.note':
    'Presets are a starting point, not a lock-in — the generated file is a plain CSS file in your project, so you can keep editing it by hand afterwards.',
} as const;
