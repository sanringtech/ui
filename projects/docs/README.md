# Docs App

This project contains the Sanring UI documentation app.

## Source Structure

- `src/app/blocks/`: reusable documentation-only content blocks. These compose docs pages,
  previews, examples, or sidebar content groups. They are not product UI primitives and should
  not be exported from `@sanring/ui`.
- `src/app/sections/`: large documentation site shell areas, such as the header, footer,
  sidebar, and article table of contents.
- `src/app/layouts/`: router layouts and page shells that own `<router-outlet>`.
- `src/app/pages/`: route page components, such as component documentation pages.

## Styling

Docs components keep static Tailwind classes directly in component templates. Prefer
`class="..."` for static styling over `cn(...)` fields in the component class.

Use `cn(...)` only when a docs component genuinely needs TypeScript-side composition, such as
conditional class merging or reusable values passed between components.

Use `@sanring/ui` for product UI primitives. Keep docs-only layout and preview helpers in
this app.
