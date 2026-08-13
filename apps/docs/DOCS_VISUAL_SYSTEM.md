# Docs Visual System

Version: 0.1
Scope: `apps/docs` only
Status: planning specification, not implementation

This document defines the visual direction and reusable rules for the Sanring UI documentation
site. It is intended to guide a full visual refresh before changing templates or tokens.

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
- Code blocks should use a dark code surface in both themes unless the syntax highlighter is
  changed to a light theme for light mode.
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
- Decorative background motion is acceptable only on home page and must respect
  `prefers-reduced-motion`.
- Component docs pages should avoid ambient motion.

## Implementation Rules

- Use semantic `--docs-*` tokens in docs templates.
- Use raw `--sanring-*` palette tokens only inside semantic token definitions or carefully scoped
  examples.
- Prefer docs-only components for repeated documentation structures:
  `DocsPageHeader`, `DocsSection`, `DocsPreviewer`, `DocsCodeBlock`, `DocsApiTable`.
- Keep `@sanring/ui` for product primitives and avoid leaking docs styling into the library.
- Static Tailwind classes in templates are acceptable, but repeated visual contracts should move
  into shared docs layout components.
- Avoid nested UI cards unless the inner card is a repeated item or a framed tool.

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

## Open Decisions

- Whether code blocks should always stay dark in light theme or switch Shiki themes by mode.
- Whether page headers should be framed panels on all docs pages or only component pages.
- Whether home page should keep particle background or move to the same background language as
  inner docs.
- Whether docs-only layout primitives should be created as Angular components or kept as static
  class patterns in existing components.
