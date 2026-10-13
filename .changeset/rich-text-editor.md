---
"@sanring/cli": minor
---

Add `rich-text-editor`: a Tiptap-based editor with ControlValueAccessor (HTML value, `''` when empty) and sanring-field integration. Composable parts: toolbar with roving focus, toggle/action buttons, heading menu, and character count. Supports `placeholder`, `readonly`, `disabled`, and `maxCharacters` (form values over the limit are shown in full, never trimmed). Tiptap loads with dynamic `import()` so it stays out of the initial bundle; `@tiptap/core`, `@tiptap/pm`, `@tiptap/starter-kit`, and `@tiptap/extensions` are installed as peer dependencies (MIT).
