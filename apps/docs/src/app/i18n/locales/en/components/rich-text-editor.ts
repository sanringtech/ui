export const richTextEditorTranslations = {
  'richTextEditor.description':
    'A rich text editor built on Tiptap that plugs into Angular forms and sanring-field.',
  'richTextEditor.examples.basic.description':
    'Bind a FormControl<string> to read and write the content as HTML. An empty document is reported as an empty string, so Validators.required works as expected.',
  'richTextEditor.usage.description':
    'Import RichTextEditorComponent and bind it with formControl or ngModel. Give it an accessible name with ariaLabel or ariaLabelledBy.',
  'richTextEditor.installation.description':
    'sanring add installs @tiptap/core, @tiptap/pm, and @tiptap/starter-kit as peer dependencies. Tiptap is loaded with dynamic import() in the browser, so it never lands in your initial bundle (about 106 kB gzipped on pages that render the editor). The value is raw HTML: sanitize it on the server before storing or rendering it.',
  'richTextEditor.api.description': 'Inputs and outputs of sanring-rich-text-editor.',
  'richTextEditor.api.id.description': 'id of the editable element. Generated when omitted.',
  'richTextEditor.api.class.description': 'Additional classes merged with the editor frame styles.',
  'richTextEditor.api.contentClass.description':
    'Additional classes applied to the editable content area.',
  'richTextEditor.api.disabled.description':
    'Makes the editor read-only and dims it. Merged with the disabled state of a bound form control.',
  'richTextEditor.api.required.description':
    'Sets aria-required. Validators.required on the bound control has the same effect.',
  'richTextEditor.api.ariaLabel.description': 'Accessible name of the editable area.',
  'richTextEditor.api.ariaLabelledBy.description':
    'id of a visible label that names the editable area. Use it with <label sanringLabel id="…">, because <label for> does not label a contenteditable element.',
  'richTextEditor.api.ariaDescribedBy.description':
    'Extra description ids, merged with the ids registered by sanring-field.',
  'richTextEditor.api.extensions.description':
    'Additional open-source Tiptap extensions. Read once when the editor is created.',
  'richTextEditor.api.editorReady.description':
    'Emits the underlying Tiptap Editor once it has loaded in the browser.',
  'richTextEditor.accessibility.description':
    'The editable area has role="textbox" and aria-multiline="true". aria-invalid, aria-required, aria-disabled, and aria-describedby follow the bound form control and sanring-field. While Tiptap loads, the component sets aria-busy="true" and shows a skeleton.',
  'richTextEditor.keyboard.description': 'Standard text editing keys plus Tiptap StarterKit shortcuts.',
  'richTextEditor.keyboard.tab': 'Move focus into or out of the editor.',
  'richTextEditor.keyboard.marks': 'Toggle bold, italic, or underline on the selection.',
  'richTextEditor.keyboard.history': 'Undo or redo the last change.',
  'richTextEditor.stateModel.description':
    'A ControlValueAccessor. The value is an HTML string and an empty document is "". Writing a value from the form does not emit it back. There is no [(value)] model; use formControl or ngModel.',
  'richTextEditor.api.toggle.description':
    'Turns a button into a pressed-state toggle for a mark or block. Reuses sanringToggle styling; pass size and variant as usual.',
  'richTextEditor.api.action.description':
    'Turns a button into a one-shot command. Reuses sanringBtn styling; variant="ghost" size="icon" suits a toolbar.',
  'richTextEditor.api.levels.description':
    'Heading levels offered by sanring-rich-text-editor-heading-menu, after Paragraph.',
  'richTextEditor.api.orientation.description':
    'Layout and arrow-key axis of sanring-rich-text-editor-toolbar.',
  'richTextEditor.keyboard.arrows':
    'In the toolbar, move between enabled buttons. Disabled buttons are skipped.',
  'richTextEditor.keyboard.homeEnd':
    'In the toolbar, jump to the first or last enabled button.',
} as const;
