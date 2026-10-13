import {
  ComponentPageApiRow,
  ComponentPageKeyboardRow,
  ComponentPageDefinition,
} from '../../../docs-schema/component-page.types';

export const richTextEditorPage = {
  componentId: 'rich-text-editor',
  titleKey: 'component.richTextEditor',
  descriptionKey: 'richTextEditor.description',
  registryDeps: ['cva-base', 'utils'],
  ssrSafe: true,
  sections: [
    {
      id: 'basic',
      titleKey: 'toc.basic',
      descriptionKey: 'richTextEditor.examples.basic.description',
      level: 2,
    },
    {
      id: 'usage',
      titleKey: 'toc.usage',
      descriptionKey: 'richTextEditor.usage.description',
      level: 2,
    },
    {
      id: 'installation',
      titleKey: 'sidebar.installation',
      descriptionKey: 'richTextEditor.installation.description',
      level: 2,
    },
    {
      id: 'composition',
      titleKey: 'toc.composition',
      descriptionKey: 'richTextEditor.composition.description',
      level: 2,
    },
    {
      id: 'example',
      titleKey: 'toc.examples',
      level: 2,
      children: [
        {
          id: 'example-character-count',
          titleKey: 'richTextEditor.demo.characterCount',
          descriptionKey: 'richTextEditor.demo.characterCount.description',
          level: 3,
        },
        {
          id: 'example-readonly',
          titleKey: 'richTextEditor.demo.readonly',
          descriptionKey: 'richTextEditor.demo.readonly.description',
          level: 3,
        },
      ],
    },
    {
      id: 'api',
      titleKey: 'toc.apiReference',
      descriptionKey: 'richTextEditor.api.description',
      level: 2,
    },
    {
      id: 'accessibility',
      titleKey: 'toc.accessibility',
      descriptionKey: 'richTextEditor.accessibility.description',
      level: 2,
    },
    {
      id: 'keyboard',
      titleKey: 'toc.keyboard',
      descriptionKey: 'richTextEditor.keyboard.description',
      level: 2,
    },
    {
      id: 'stateModel',
      titleKey: 'toc.stateModel',
      descriptionKey: 'richTextEditor.stateModel.description',
      level: 2,
    },
  ],
  apiRows: [
    {
      property: 'id',
      type: 'string',
      defaultValue: 'auto',
      descriptionKey: 'richTextEditor.api.id.description',
    },
    {
      property: 'class',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'richTextEditor.api.class.description',
    },
    {
      property: 'contentClass',
      type: 'string',
      defaultValue: "''",
      descriptionKey: 'richTextEditor.api.contentClass.description',
    },
    {
      property: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'richTextEditor.api.disabled.description',
    },
    {
      property: 'required',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'richTextEditor.api.required.description',
    },
    {
      property: 'readonly',
      type: 'boolean',
      defaultValue: 'false',
      descriptionKey: 'richTextEditor.api.readonly.description',
    },
    {
      property: 'placeholder',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'richTextEditor.api.placeholder.description',
    },
    {
      property: 'maxCharacters',
      type: 'number',
      defaultValue: 'undefined',
      descriptionKey: 'richTextEditor.api.maxCharacters.description',
    },
    {
      property: 'ariaLabel',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'richTextEditor.api.ariaLabel.description',
    },
    {
      property: 'ariaLabelledBy',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'richTextEditor.api.ariaLabelledBy.description',
    },
    {
      property: 'ariaDescribedBy',
      type: 'string',
      defaultValue: 'undefined',
      descriptionKey: 'richTextEditor.api.ariaDescribedBy.description',
    },
    {
      property: 'extensions',
      type: 'AnyExtension[]',
      defaultValue: '[]',
      descriptionKey: 'richTextEditor.api.extensions.description',
    },
    {
      property: 'sanringRichTextEditorToggle',
      type: "'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'bulletList' | 'orderedList' | 'blockquote' | 'codeBlock'",
      defaultValue: '-',
      descriptionKey: 'richTextEditor.api.toggle.description',
    },
    {
      property: 'sanringRichTextEditorAction',
      type: "'undo' | 'redo' | 'horizontalRule' | 'hardBreak' | 'clearFormatting'",
      defaultValue: '-',
      descriptionKey: 'richTextEditor.api.action.description',
    },
    {
      property: 'heading-menu levels',
      type: '(1 | 2 | 3 | 4 | 5 | 6)[]',
      defaultValue: '[1, 2, 3]',
      descriptionKey: 'richTextEditor.api.levels.description',
    },
    {
      property: 'toolbar orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      descriptionKey: 'richTextEditor.api.orientation.description',
    },
    {
      property: 'sanring-rich-text-editor-character-count',
      type: '-',
      defaultValue: '-',
      descriptionKey: 'richTextEditor.api.characterCount.description',
    },
    {
      property: '(editorReady)',
      type: 'Editor',
      defaultValue: '-',
      descriptionKey: 'richTextEditor.api.editorReady.description',
    },
  ] satisfies readonly ComponentPageApiRow[],
  keyboardRows: [
    { keys: 'Tab', descriptionKey: 'richTextEditor.keyboard.tab' },
    { keys: 'ArrowLeft / ArrowRight', descriptionKey: 'richTextEditor.keyboard.arrows' },
    { keys: 'Home / End', descriptionKey: 'richTextEditor.keyboard.homeEnd' },
    { keys: 'Mod+B / Mod+I / Mod+U', descriptionKey: 'richTextEditor.keyboard.marks' },
    { keys: 'Mod+Z / Mod+Shift+Z', descriptionKey: 'richTextEditor.keyboard.history' },
  ] satisfies readonly ComponentPageKeyboardRow[],
} as const satisfies ComponentPageDefinition;

export const richTextEditorPageExamples = {
  basic: `<sanring-field>
  <label sanringLabel id="message-label">Message</label>
  <sanring-rich-text-editor ariaLabelledBy="message-label" [formControl]="message">
    <sanring-rich-text-editor-toolbar>
      <button sanringRichTextEditorAction="undo" variant="ghost" size="icon" ariaLabel="Undo">
        <svg lucideUndo2 class="size-4"></svg>
      </button>
      <button sanringRichTextEditorAction="redo" variant="ghost" size="icon" ariaLabel="Redo">
        <svg lucideRedo2 class="size-4"></svg>
      </button>
      <sanring-divider vertical class="mx-1 my-1" />
      <sanring-rich-text-editor-heading-menu />
      <sanring-divider vertical class="mx-1 my-1" />
      <sanring-tooltip>
        <button sanringRichTextEditorToggle="bold" sanringTooltipTrigger size="sm" ariaLabel="Bold">
          <svg lucideBold class="size-4"></svg>
        </button>
        <sanring-tooltip-content>Bold (Ctrl+B)</sanring-tooltip-content>
      </sanring-tooltip>
      <sanring-tooltip>
        <button sanringRichTextEditorToggle="italic" sanringTooltipTrigger size="sm" ariaLabel="Italic">
          <svg lucideItalic class="size-4"></svg>
        </button>
        <sanring-tooltip-content>Italic (Ctrl+I)</sanring-tooltip-content>
      </sanring-tooltip>
      <button sanringRichTextEditorToggle="underline" size="sm" ariaLabel="Underline">
        <svg lucideUnderline class="size-4"></svg>
      </button>
      <button sanringRichTextEditorToggle="strike" size="sm" ariaLabel="Strikethrough">
        <svg lucideStrikethrough class="size-4"></svg>
      </button>
      <sanring-divider vertical class="mx-1 my-1" />
      <button sanringRichTextEditorToggle="bulletList" size="sm" ariaLabel="Bulleted list">
        <svg lucideList class="size-4"></svg>
      </button>
      <button sanringRichTextEditorToggle="orderedList" size="sm" ariaLabel="Numbered list">
        <svg lucideListOrdered class="size-4"></svg>
      </button>
      <button sanringRichTextEditorToggle="blockquote" size="sm" ariaLabel="Quote">
        <svg lucideQuote class="size-4"></svg>
      </button>
    </sanring-rich-text-editor-toolbar>
  </sanring-rich-text-editor>
  <sanring-error-message>Message is required.</sanring-error-message>
</sanring-field>`,
  composition: `sanring-rich-text-editor
├── sanring-rich-text-editor-toolbar
│   ├── button[sanringRichTextEditorToggle]
│   ├── button[sanringRichTextEditorAction]
│   └── sanring-rich-text-editor-heading-menu
└── sanring-rich-text-editor-character-count`,
  characterCount: `<sanring-field>
  <label sanringLabel id="comment-label">Comment</label>
  <sanring-rich-text-editor
    ariaLabelledBy="comment-label"
    placeholder="Write a comment…"
    [maxCharacters]="140"
    [formControl]="comment"
  >
    <sanring-rich-text-editor-character-count />
  </sanring-rich-text-editor>
</sanring-field>`,
  readonly: `<sanring-rich-text-editor ariaLabel="Release notes" readonly [formControl]="notes">
  <sanring-rich-text-editor-toolbar>
    <sanring-rich-text-editor-heading-menu />
    <button sanringRichTextEditorToggle="bold" size="sm" ariaLabel="Bold">
      <svg lucideBold class="size-4"></svg>
    </button>
    <button sanringRichTextEditorToggle="italic" size="sm" ariaLabel="Italic">
      <svg lucideItalic class="size-4"></svg>
    </button>
  </sanring-rich-text-editor-toolbar>
</sanring-rich-text-editor>`,
  usageImport: `import { SANRING_RICH_TEXT_EDITOR_IMPORTS } from './components/ui/rich-text-editor';`,
  usageMain: `<sanring-rich-text-editor ariaLabel="Notes" [formControl]="notes">
  <sanring-rich-text-editor-toolbar>
    <button sanringRichTextEditorToggle="bold" size="sm" ariaLabel="Bold">B</button>
    <button sanringRichTextEditorToggle="italic" size="sm" ariaLabel="Italic">I</button>
  </sanring-rich-text-editor-toolbar>
</sanring-rich-text-editor>`,
} as const;
