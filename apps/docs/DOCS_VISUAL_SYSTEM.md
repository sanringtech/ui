# Docs Visual System

Version: 0.2
Scope: `apps/docs` only
Status: living visual system — rules below are enforced in code unless flagged `[planned]`;
resolved decisions are recorded in the Decision Log, not left open

This document defines the visual direction and reusable rules for the Sanring UI documentation
site. Phase 1 (P29 in `TODOLIST.md`) landed the token contract and closed all four open decisions
that were blocking Phase 2. Phase 2/3 items (shell refresh, long-form page refresh, primitive
componentization) are `[planned]` until implemented — see `TODOLIST.md` for current status and
`DEVLOG.md` for what shipped and why.

## Goals

- Make the docs app feel like a coherent product documentation experience, not a set of
  individually styled pages.
- Preserve the existing Sanring brand foundation: neutral dark UI, mint primary accent, compact
  engineering-oriented layout, strong component examples.
- Define a stable contract for color, typography, radius, spacing, layout, and responsive behavior.
- Keep the component library primitives generic. Docs-specific visual decisions belong in
  `apps/docs`.
- Reduce one-off Tailwind decisions in pages by establishing reusable docs layout patterns.

## Current Baseline

The docs app already has a usable token base in `src/styles.css`:

- Raw brand scales: `--sanring-primary-*`, `--sanring-coral-*`, `--sanring-sun-*`,
  `--sanring-neutral-*`, status palettes.
- Docs semantic tokens: `--docs-bg`, `--docs-panel`, `--docs-surface`,
  `--docs-elevated`, `--docs-code`, `--docs-fg`, `--docs-muted`, `--docs-border`,
  `--docs-accent`.
- Radius tokens: `--sanring-radius-xs`, `--sanring-radius-sm`, `--sanring-radius`,
  `--sanring-radius-lg`.

The main gap is not token availability. The gap is visual governance: the app does not yet define
when to use each surface, text size, radius, section pattern, or breakpoint.

## Visual Direction

Sanring docs should feel:

- Precise: dense enough for engineers, with high signal and predictable layout.
- Layered: surfaces should communicate hierarchy through background, border, and limited shadow.
- Calm: avoid oversized decoration, one-off gradients, and marketing-heavy page sections.
- Tactile: interactive controls should have consistent shape, hover states, and active states.
- Bilingual-ready: English and Chinese strings must fit the same layouts without relying on exact
  text length.

The target style is a refined technical documentation interface: structured, spacious where it
matters, compact where repeated navigation or reference content needs scanning.

### Phase 4 Style Thesis

Phase 4 moves beyond conformance and into Sanring-specific identity. The docs should feel like a
compact engineering control surface for installing, inspecting, and composing Angular UI
primitives.

This means Sanring should not read as a shadcn clone with a different accent color. Avoid using
large empty hero space, neutral-only card stacks, or a single code preview card as the main brand
memory. Prefer product-native visual language:

- CLI command center surfaces.
- Registry nodes and source maps.
- Component dependency graphs.
- Token mapping and light/dark comparison panels.
- Install result timelines.
- Agent-readable status and safe-operation boundaries.

Use the mint accent as signal rather than decoration: status lights, active edges, command output,
selection traces, and dependency links. Keep the physical feel crisp and tool-like: `6px`/`8px`
radius for most controls and repeated surfaces, `12px` only for major panels, restrained shadows,
and no decorative blobs or generic marketing gradients.

## Color System

### Raw Palettes

Raw palettes remain brand primitives and should only be referenced when defining semantic tokens.

| Palette | Role | Current Base |
| --- | --- | --- |
| Primary | Brand accent, focus, highlights | `--sanring-primary-50` `#8bd3dd` |
| Neutral | Backgrounds, text, borders | `--sanring-neutral-*` |
| Coral | Secondary warmth, selective emphasis | `--sanring-coral-50` |
| Sun | Warm highlight, low-frequency accent | `--sanring-sun-50` |
| Info | Informational status | `--sanring-info-50` |
| Success | Success status | `--sanring-success-50` |
| Warn | Warning status | `--sanring-warn-50` |
| Error | Destructive/error status | `--sanring-error-50` |

### Semantic Surface Roles

The docs app should use semantic tokens for page styling.

| Token | Intended Role | Usage Rule |
| --- | --- | --- |
| `--docs-bg` | Page canvas | Body, shell background, full-page bands |
| `--docs-panel` | Primary raised surface | Header sheets, preview containers, major panels |
| `--docs-surface` | Repeated item surface | Cards, list items, table rows, small panels |
| `--docs-surface-strong` | Stronger grouped surface | Nested cards, selected group backgrounds |
| `--docs-elevated` | Interactive/hover surface | Buttons, search, nav hover, active controls |
| `--docs-code` | Code body background | Code blocks only |
| `--docs-code-header` | Code header background | Code toolbar/title row |
| `--docs-fg` | Primary text | Headings, labels, strong values |
| `--docs-muted` | Secondary text | Body descriptions, metadata, nav inactive text |
| `--docs-border` | Default separator | Cards, panels, header/sidebar separators |
| `--docs-border-strong` | Focus/active border | Active nav, hover, selected controls |
| `--docs-accent` | Brand action/accent | Primary buttons, focus, selected indicators |
| `--docs-accent-strong` | High-contrast accent text/icon | Accent labels and icons |

### Proposed Additions

Add these semantic tokens before the visual refresh:

| Token | Purpose |
| --- | --- |
| `--docs-bg-grid` | Subtle grid line color for page or preview backgrounds |
| `--docs-shadow-soft` | Standard panel shadow |
| `--docs-shadow-strong` | Hero/preview shadow |
| `--docs-focus-ring` | Focus-visible ring color |
| `--docs-accent-alt` | Secondary accent derived from coral |
| `--docs-accent-warm` | Low-frequency warm accent derived from sun |

### Theme Rules

- Dark and light themes should preserve the same hierarchy. Do not invert which surface is
  stronger between themes.
- **Resolved**: code blocks always use a dark code surface, in both light and dark theme. Do not
  switch the syntax highlighter to a light Shiki theme for light mode.
- Status backgrounds must be readable in both themes and should not be reused as general
  decorative colors.

## Typography

### Font Families

| Role | Font |
| --- | --- |
| UI / docs text | `var(--sanring-font-sans)` |
| Code / paths / versions | `var(--sanring-font-mono)` |

### Type Scale

Use a fixed type scale. Do not introduce new arbitrary text sizes without updating this table.

| Role | Desktop | Mobile | Weight | Line Height | Usage |
| --- | ---: | ---: | ---: | ---: | --- |
| Display | `56px` | `36px` | 600 | `1.04` | Home page H1 only |
| Page title | `36px` | `30px` | 600 | `1.15` | Docs article and component page H1 |
| Section title | `28px` | `24px` | 600 | `1.2` | Main H2 sections |
| Subsection title | `22px` | `20px` | 600 | `1.25` | H3 sections |
| Card title | `18px` | `18px` | 600 | `1.35` | Cards, panels |
| Body large | `18px` | `16px` | 400 | `1.75` | Hero descriptions |
| Body | `16px` | `16px` | 400 | `1.7` | Article descriptions |
| Small | `14px` | `14px` | 400/500 | `1.6` | Nav, table body, metadata |
| Caption | `12px` | `12px` | 500/600 | `1.4` | Chips, labels, uppercase headings |
| Code | `14px` | `13px` | 400 | `1.65` | Code blocks |

### Text Rules

- Letter spacing is `0` by default.
- Uppercase labels may use `0.06em` to `0.08em` letter spacing, but only for captions.
- Body copy max width should usually be `620px` to `760px`.
- Text inside buttons must not rely on hero-scale sizing or viewport-scaled text.
- Inline code uses mono, `13px`, radius `xs`, and a code/surface background.

## Radius System

Use the existing token scale as a contract.

| Token | Value | Use |
| --- | ---: | --- |
| `--sanring-radius-xs` | `3px` | Inline code, tiny chips, table badges |
| `--sanring-radius-sm` | `6px` | Icon buttons, compact nav indicators, small icons |
| `--sanring-radius` | `8px` | Buttons, inputs, nav items, repeated cards |
| `--sanring-radius-lg` | `12px` | Major panels, code previewers, dialogs, hero panels |
| `rounded-full` | full | Pills, dots, avatars only |

### Button Radius

- Default buttons: `--sanring-radius`.
- Icon buttons: `--sanring-radius-sm` if visually compact, otherwise `--sanring-radius`.
- Split buttons: outer corners keep `--sanring-radius`; inner corners are `0`.
- Do not introduce larger button radius for docs-only pages.

## Spacing System

Use a compact but readable spacing rhythm.

| Role | Desktop | Mobile |
| --- | ---: | ---: |
| Shell horizontal padding | `32px-48px` | `16px-20px` |
| Article top padding | `56px-64px` | `32px` |
| Article bottom padding | `96px` | `72px` |
| Section gap | `64px` | `48px` |
| Section title to body | `12px-16px` | `12px` |
| Body to example | `24px-36px` | `24px` |
| Card padding | `16px-20px` | `12px-16px` |
| Hero panel padding | `28px-36px` | `20px` |

Spacing should communicate structure first. Avoid adding decorative spacing just to make a page
feel larger.

## Layout System

### Shell

Desktop docs article layout:

- Header: sticky, `76px` height.
- Left sidebar: `260px`.
- Main article: fluid, max content width controlled by page component.
- Right TOC: `260px`.

Tablet:

- Left sidebar: `240px-250px`.
- Main article: fluid.
- Right TOC hidden below `980px`.

Mobile:

- Single column.
- Sidebar hidden below `860px`.
- Navigation moves into sheet.
- Header becomes multi-row with search full width.

### Article Width

| Page Type | Max Width |
| --- | ---: |
| Component page default | `832px` |
| Component page wide | `960px` |
| Long-form docs page | `832px` |
| Home page | `1280px` |

Use `min-w-0` on custom component hosts and grid/flex children that contain code or long strings.

## Component Page Structure

Every component page should follow the same order:

1. Page header
2. Basic example
3. Usage / installation
4. Examples
5. API reference
6. Accessibility
7. State model
8. Recent changes

### Page Header

Required content:

- Component/page title.
- One-sentence description.
- Optional path chip, e.g. `components / button`.
- Copy page action.
- Previous/next navigation for component pages.

Visual rules:

- Header should be visually stronger than ordinary sections.
- **Resolved**: framed panel treatment applies to every docs page header, not just component
  pages — long-form pages (introduction, CLI, registry, MCP, theming, roadmap, changelog) use the
  same header pattern as component pages.
- Header actions wrap below content at mobile widths.
- Header description max width: `620px`.

### Section

Each major section should have:

- Stable `id` for TOC.
- H2 using the section title style.
- Optional description using body text.
- Content starts after a consistent gap.

Nested sections use H3/H4 and lower vertical spacing.

### Example Previewer

The example previewer has two zones:

- Preview stage: component rendered in a controlled environment.
- Code block: syntax highlighted source.

Rules:

- Major preview container uses `--sanring-radius-lg`.
- Stage must have stable min height and responsive padding.
- Code block scrolls horizontally internally; it must not widen the page.
- Copy code action is always visible and keyboard accessible.

### API Reference

Desktop:

- Table layout.
- Fixed columns for property/type/default.
- Description column receives remaining width.

Mobile:

- Card layout.
- Property appears first.
- Type/default/description use labeled definition rows.

### Recent Changes

Recent changes are a supporting surface, not the main page ending.

- Limit to current component.
- Keep compact rows.
- Link to full version notes.
- Use status chips consistently.

## Navigation

### Header

Header priorities:

1. Brand/home affordance.
2. Primary docs navigation.
3. Search.
4. GitHub/action controls.
5. Theme switch.

Rules:

- Header stays sticky.
- Header background should preserve readability over page content.
- Search should become full width below `860px`.
- Theme switch remains available on mobile.
- GitHub may be hidden below very narrow widths if needed.

### Sidebar

Sidebar is for wayfinding, not decoration.

- Section labels use caption style.
- Item text uses small text.
- Active state must be more visible than hover.
- New/status dots must not replace active state.
- Sidebar scrollbars can remain hidden if fade masks make overflow discoverable.

### TOC

TOC is a scanning aid.

- Hidden below `980px`.
- Active section uses accent border or indicator.
- Nested sections indent consistently.
- TOC should not compete visually with the main article.

## Responsive Breakpoints

Standardize around these app breakpoints:

| Breakpoint | Meaning | Use |
| --- | --- | --- |
| `1180px` | compressed desktop | Reduce side columns |
| `980px` | tablet docs | Hide right TOC |
| `860px` | mobile docs shell | Hide sidebar, header wraps, sheet nav |
| `720px` | narrow content | Header actions stack, previews reduce padding |
| `520px` | phone | Smaller page title, tighter cards |
| `480px` | very narrow phone | Single-column dense grids |

Avoid adding new arbitrary breakpoints unless a component has a specific measured layout failure.

## Interactive States

Every interactive element needs:

- Default
- Hover
- Active/current where relevant
- Focus-visible
- Disabled where relevant

Use `--docs-border-strong` or `--docs-focus-ring` for focus-visible. Do not rely only on color
changes for state.

## Motion

Motion should support orientation, not decoration.

- Theme transition: keep current View Transitions API behavior.
- Toast/sheet/popover animations can remain as defined in `styles.css`.
- **Resolved**: home page drops the particle background and moves to the same background
  language as inner docs pages — no ambient decorative background motion anywhere in the app.
  Brand richness on the home page comes from layout, typography, and color, not motion.
- Component docs pages should avoid ambient motion.

## Implementation Rules

- Use semantic `--docs-*` tokens in docs templates. Before adding a new `--docs-*` token, check
  it against `src/styles.css` — do not reference a token in a template without defining it; the
  P29 token sweep (see `DEVLOG.md`) found 5 dangling references that had gone unnoticed.
- Use raw `--sanring-*` palette tokens only inside semantic token definitions or carefully scoped
  examples.
- Prefer docs-only components for repeated documentation structures. Component page structure
  already has this layer implemented under `apps/docs/src/app/layouts/component-page/`:
  `DocsPageHeaderComponent`, `ComponentPageSectionComponent`, `ComponentPageCodePreviewerComponent`,
  `ComponentPageCodeBlockComponent`, `ComponentPageApiTableComponent`,
  `ComponentPageRecentChangesComponent`. **Resolved**: content-level primitives
  (`DocsCallout`, `DocsMetric`, `DocsFeatureList`) follow the same precedent and should be built
  as Angular components, not static class patterns — `[planned]`, not yet built.
- Keep `@sanring/ui` for product primitives and avoid leaking docs styling into the library.
- Static Tailwind classes in templates are acceptable, but repeated visual contracts should move
  into shared docs layout components.
- Avoid nested UI cards unless the inner card is a repeated item or a framed tool.

## Page Matrix Audit (P29 Phase 1)

Baseline inventory of every top-level docs page plus a spot-check of the component page template,
recorded before Phase 2 work starts. "Shared primitives" refers to
`apps/docs/src/app/layouts/component-page/`: `DocsPageHeaderComponent` (`app-docs-page-header`),
`ComponentPageSectionComponent` (`app-component-page-section`), `ComponentPageCodePreviewerComponent`,
`ComponentPageCodeBlockComponent`, `ComponentPageApiTableComponent`, `ComponentPageRecentChangesComponent`.

| Page | Header pattern | Surface tokens | Typography | Mobile overflow | One-off layout notes |
| --- | --- | --- | --- | --- | --- |
| Home (`pages/home/home-page.component.ts`) | Fully hand-rolled hero markup — does not use `app-docs-page-header` | Full `--docs-*` semantic token usage with heavy `color-mix`; well aligned | Off-scale: H1 uses `56px/40px/32px` across three breakpoints instead of the Display scale's `56px/36px`; section titles use `30px/26px` instead of the Section title scale's `28px/24px` | Good — consistent `min-w-0`, `truncate`, `break-words` on flex/grid children | Hero grid, visual-metrics panel, and component-shortcuts nav are all one-off; the component still ships an animated `.home-particles` background, contradicting the Decision Log's resolved "drop particle background" decision |
| Introduction (`pages/introduction/introduction-page.component.ts`) | `app-docs-page-header`, correct | Full `--docs-*` usage | Aligned via `ComponentPageSectionComponent` (28/24 H2) | Good — code blocks wrapped in `min-w-0 overflow-hidden` containers | Feature-card grid, requirements `dl` grid, and next-step link list are small local card patterns; low risk, could be replaced by the planned `DocsFeatureList`/`DocsCallout` primitives |
| Components landing (`pages/components/components-page.component.ts`) | `app-docs-page-header`, correct | Full `--docs-*` usage | Hand-rolled `<h2 class="text-[28px] ...">` with **no mobile downscale** — the canonical `ComponentPageSectionComponent` H2 drops to 24px under 520px, this page stays at 28px | `truncate` on long labels, responsive 3/2/1-column grid | Does not use `ComponentPageSectionComponent` at all; both sections ("Recently updated", "All components") are fully hand-rolled instead of reusing the shared section primitive |
| CLI (`pages/cli/cli-page.component.ts`) | `app-docs-page-header`, correct | Full `--docs-*` usage | Aligned via `ComponentPageSectionComponent` | Good — every code sample wrapped in an `overflow-hidden` container; `ComponentPageCodeBlock` is internally `overflow-auto` | None significant — 11 sections repeat the same body + code + option-list pattern; the most systematized long-form page in the audit |
| Registry (`pages/registry/registry-page.component.ts`) | `app-docs-page-header`, correct | Full `--docs-*` usage | Aligned via `ComponentPageSectionComponent` | Good — same wrapped-code-block pattern as CLI | None significant |
| MCP (`pages/mcp/mcp-page.component.ts`) | `app-docs-page-header`, correct | Full `--docs-*` usage | Aligned via `ComponentPageSectionComponent` | Good — same wrapped-code-block pattern as CLI | None significant — shortest page in the audit |
| Theming (`pages/theming/` — shell + 6 sub-section components) | `app-docs-page-header` on the shell; every sub-section wraps `ComponentPageSectionComponent` | `--docs-*` throughout the shell and most sub-sections; `theming-playground-section.component.ts` deliberately switches to its own `--playground-*` runtime custom properties (hex defaults) driven by live color pickers — an intentional sandbox, not token misuse | Aligned via `ComponentPageSectionComponent` | Playground grid uses `min-w-0` and an `overflow-x-auto` `<pre>` for generated CSS; **`theming-presets-section.component.ts` hand-rolls a raw `<table>` with no `overflow-x-auto` wrapper** — low risk today given short content, but no guard against growth | `theming-playground-section.component.ts` (~390 lines) is the single largest one-off in the site — a live theme sandbox that legitimately can't reuse `ComponentPageCodePreviewer`; `theming-presets-section.component.ts` hand-rolls a table instead of reusing `ComponentPageApiTableComponent` |
| Roadmap (`pages/roadmap/roadmap-page.component.ts`) | `app-docs-page-header`, correct | `--docs-*` plus `--docs-surface-strong` for meta chips | Aligned via `ComponentPageSectionComponent` | `min-w-0 overflow-hidden` on each marquee row | Infinite auto-scrolling "shipped components" marquee ticker with its own keyframe animation (respects `prefers-reduced-motion`) — decorative ambient motion that sits in tension with the system's "no ambient motion" principle, even though the Decision Log only names the home page explicitly |
| Changelog (`pages/changelog/changelog-page.component.ts`) | `app-docs-page-header`, correct | `--docs-*` including status-tinted chips (`--docs-success-bg`, `--docs-info-bg`, `--docs-warn-bg`, `--docs-error-bg`) | Aligned via `ComponentPageSectionComponent` | Rows use `flex items-start gap-2.5` + `min-w-0 flex-1`; inline `<code>` fragments rendered via `[innerHTML]` have no explicit `break-words`/`overflow-wrap`, so an unusually long unbroken inline code token could overflow on narrow viewports (not observed today, no guard) | Built on `sanringTimeline` from `@sanring/ui` with an expand/collapse "other fixes" panel — unique to this page, but appropriately built on a library primitive rather than a hand-rolled one |
| Component page template (spot-check: `button`, `select`, `dialog`, `table`, `tree`, `collapsible`) | All six consistently use `app-component-page-header` (which itself wraps `app-docs-page-header`) — no deviation found | `--docs-*` throughout chrome; `select` page sets two demo icon colors directly with raw `--sanring-muted` / `--sanring-border-strong` instead of `--docs-*` (borderline-acceptable "scoped example" per this doc's raw-token rule, worth a lint pass) | All inherit `ComponentPageSectionComponent`'s scale — no arbitrary sizes found | Shared primitives handle it: `ComponentPageCodeBlock` is `overflow-auto`, `ComponentPageApiTableComponent` swaps to a card layout below `md:`, `ComponentPageCodePreviewer` is `overflow-hidden`; `table` page's sticky-column demos force `min-w-[760px]`/`min-w-[820px]` on the `<table>` but correctly scope scrolling inside `sanring-table-container`, so the page itself doesn't widen | None structural — the shared layer is consistently adopted across the sample; `table` is the most visually dense page but stays inside the primitives |

**Biggest inconsistencies for Phase 2 sequencing**: the home page is the clear outlier — it bypasses
`app-docs-page-header` entirely, uses off-scale type sizes, and still ships the particle background the
Decision Log already marked as removed, so it should be first in line for the "Home alignment" step.
The components landing page and theming presets table both hand-roll patterns (section headings, a data
table) that the shared primitives already solve, which is cheap, low-risk cleanup during the "Long-form
docs refresh" step. The roadmap marquee is the only other page with ambient motion, worth a deliberate
keep-or-cut decision rather than leaving it as an implicit exception. The component page template itself
needs no structural work — Phase 3 there is closer to polish than refactor.

## Refresh Plan

1. Token pass
   - Add missing semantic tokens.
   - Stabilize light/dark code block contrast.
   - Document exact surface hierarchy in `styles.css`.

2. Layout primitives
   - Normalize shell, sidebar, TOC, header.
   - Define docs page header and component page header variants.
   - Add host `block min-w-0` where custom components contain long content.

3. Component page refresh
   - Update component page header.
   - Update section rhythm.
   - Update preview/code/API/recent changes surfaces.
   - Verify a narrow, default, and wide component page.

4. Long-form docs refresh
   - Align introduction, CLI, registry, MCP, theming, roadmap, changelog page headers.
   - Replace local one-off cards with standardized docs surfaces.

5. Home alignment
   - Keep home page richer than inner docs.
   - Align radius, typography, and surface usage with the system.

6. Verification
   - Desktop: `1440px`, `1180px`, `1024px`.
   - Mobile: `390px`, `360px`.
   - Light and dark themes.
   - Component examples with long code lines.

## Acceptance Criteria

A page satisfies the visual system when:

- It uses the defined type scale.
- It uses only approved radius roles.
- It uses semantic docs tokens for surfaces and text.
- It does not introduce page-specific breakpoints without justification.
- It has no horizontal page overflow at `360px`.
- Its header, section rhythm, previewer, code block, and API table match the shared patterns.
- Light and dark themes preserve contrast and hierarchy.

## Decision Log

All Phase 1 open decisions are resolved as of 2026-08-15. No open decisions remain; new ones
should be added here when raised, not left implicit in code review threads.

| Decision | Resolution | Rationale |
| --- | --- | --- |
| Code block theme | Always dark, in both light and dark theme | Matches GitHub/Vercel/shadcn convention; avoids maintaining a second Shiki theme |
| Page header treatment | Framed panel on every docs page, not just component pages | Coherent single header pattern across the whole site is the stated Phase 2 goal |
| Home page background | Drop particle background, align with inner docs background language | Avoids the home page reading as a different product from the rest of the site; brand richness comes from layout/typography/color instead |
| Layout primitive componentization | Build `DocsCallout`/`DocsMetric`/`DocsFeatureList` as Angular components | Follows the existing `component-page-*` precedent; avoids a second Phase 3 refactor pass |
| `component-page-*` naming | Keep existing names; new primitives use `Docs*` prefix | Renaming 50+ existing imports has no functional payoff; the prefix split matches the existing component-page-only vs. docs-wide layering |
| Roadmap marquee animation | Keep, `[planned]` items unaffected | It is a content presentation device (scrolling item list), not decoration, and already respects `prefers-reduced-motion`; the "avoid ambient motion" rule targets decorative backgrounds like the home page particles, not this |
| Phase 4 identity | Position Sanring docs as a compact engineering control surface, not a shadcn-style neutral docs clone | The refresh goal is stronger brand recognition: emphasize CLI, registry, dependency, token, and agent-ready visual language instead of generic card/hero patterns |
| Home page composition | Keep `Curated component entry points` as the only approved existing section; redesign the rest from a fresh information architecture | The user approved that specific section, not its visual vocabulary as a site-wide system. The command center direction and the later product-entry/system-map direction were both rejected for home, so future work should restart from content priority and visual concept rather than iterating either attempted layout |

Full rationale for each is in `DEVLOG.md` under the P29 entry.

## Visual QA Checklist

Run this manually before shipping a visual change, and whenever `[automated]` coverage below
doesn't apply. Pages to sample: home, a component page (e.g. `button`), a long-form page (e.g.
`introduction`), and the mobile shell.

### Breakpoints

- [ ] Desktop `1440px` — no layout is unusually sparse or overly wide; TOC and sidebar both visible.
- [ ] Desktop `1180px` — side columns compress per the breakpoint table; no overlap.
- [ ] Desktop `1024px` — still above the `980px` TOC-hide threshold; check nothing clips early.
- [ ] Mobile `390px` — sidebar collapses into the sheet nav; header wraps correctly. `[automated]`
      basic sheet-open check in `apps/docs/e2e/mobile-shell.spec.ts`.
- [ ] Mobile `360px` — no horizontal page overflow anywhere. `[automated]` scroll-width check runs
      on home, a long-form page, and this exact viewport in the e2e suite.

### Theme

- [ ] Light theme — surfaces (`panel`/`surface`/`elevated`) are visually distinguishable from each
      other and from `bg`, not just from border/shadow.
- [ ] Dark theme — same hierarchy check; code blocks stay dark in both themes (resolved decision).
- [ ] Toggle light → dark → system and back; no flash of unstyled content, no stuck intermediate
      state. `[automated]` `apps/docs/e2e/theme-toggle.spec.ts` checks `data-theme` + persistence
      across reload, but not the transition animation itself — that still needs eyes.

### Content stress cases

- [ ] A code block with a long unbroken line (e.g. a long CLI command or URL) scrolls horizontally
      inside its own container and does not widen the page. `[automated]` covered for the CLI page
      command block.
- [ ] Switch the docs language to Chinese and re-check page headers, nav labels, and button text —
      confirm bilingual copy doesn't overflow or wrap awkwardly (spec requires layouts to work with
      either language without relying on exact text length). No automated coverage yet; the e2e
      suite only exercises the English locale.

### What's automated vs. what still needs eyes

`apps/docs/e2e/` (Playwright, see `apps/docs/playwright.config.ts`) covers: page renders without
console errors, key landmarks/headings are present, no horizontal overflow at two viewports, the
mobile sheet nav opens, and theme switching updates `data-theme` and persists. It does **not**
cover subjective visual quality — spacing rhythm, color harmony, "does this look premium" — none of
that is testable without a human (or a visual-diff tool with an approved baseline, which this repo
doesn't have yet). Run `pnpm test:e2e:docs` before merging a visual change; still walk through this
checklist by eye for anything the automated suite doesn't assert on.
